import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import NodeCache from 'node-cache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env first, then fall back to project root
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config();

const PORT = process.env.PORT || 8787;
const GOOGLE_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
const CACHE_TTL = parseInt(process.env.SEARCH_CACHE_TTL || '60', 10);

const app = express();
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_TTL * 0.2 });

const IMAGE_META_KEYS = [
  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'twitter:image',
  'twitter:image:src'
];

const TYPE_HINTS = {
  news: {
    querySuffix: '(news OR press release OR announcement)',
    siteFilters: ['news.google.com', 'reuters.com', 'apnews.com', 'bbc.com', 'bloomberg.com'],
    dateRestrict: 'w1'
  },
  video: {
    querySuffix: '(video OR watch OR playlist)',
    siteFilters: ['youtube.com', 'vimeo.com', 'dailymotion.com']
  },
  academic: {
    querySuffix: '(research OR academic paper OR whitepaper)',
    siteFilters: ['arxiv.org', 'ieee.org', 'springer.com', 'acm.org', 'nature.com']
  },
  code: {
    querySuffix: '(code example OR repository OR implementation)',
    siteFilters: ['github.com', 'gitlab.com', 'bitbucket.org', 'npmjs.com', 'stackoverflow.com']
  }
};

app.use(cors());
app.use(express.json());

const regionMap = {
  Global: undefined,
  US: 'us',
  India: 'in',
  EU: 'uk',
  SEA: 'sg'
};

const timeMap = {
  'Any time': undefined,
  'Past day': 'd1',
  'Past week': 'w1',
  'Past month': 'm1',
  'Past year': 'y1'
};

function buildGoogleParams({ query, filters, siteScope, searchType, start }) {
  const params = new URLSearchParams();
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if (!key || !cx) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CX environment variables');
  }
  params.set('key', key);
  params.set('cx', cx);
  params.set('num', '10');
  params.set('safe', filters.safe ? 'active' : 'off');
  const gl = regionMap[filters.region];
  if (gl) params.set('gl', gl);
  const dateRestrict = timeMap[filters.time];
  if (dateRestrict) params.set('dateRestrict', dateRestrict);

  if (searchType === 'image') {
    params.set('searchType', 'image');
    params.set('fields', 'items(title,link,snippet,image,displayLink)');
  } else {
    params.set('fields', 'items(title,link,snippet,displayLink,pagemap)');
  }

  let searchQuery = siteScope ? `${query} ${siteScope}` : query;
  const hints = TYPE_HINTS[searchType];
  if (hints) {
    if (hints.querySuffix) {
      searchQuery = `${searchQuery} ${hints.querySuffix}`;
    }
    if (Array.isArray(hints.siteFilters) && hints.siteFilters.length) {
      searchQuery = `${searchQuery} (${hints.siteFilters.map((domain) => `site:${domain}`).join(' OR ')})`;
    }
    if (hints.dateRestrict && !dateRestrict) {
      params.set('dateRestrict', hints.dateRestrict);
    }
  }

  params.set('q', searchQuery);
  if (start) {
    params.set('start', String(start));
  }

  return params;
}

function resolveToAbsolute(url, base) {
  if (!url) return null;
  try {
    return new URL(url, base).href;
  } catch (_) {
    return null;
  }
}

function extractImageFromItem(item) {
  const pagemap = item?.pagemap || {};
  const baseUrl = item?.link;

  const candidates = [];
  const cseImage = pagemap.cse_image?.[0]?.src;
  if (cseImage) candidates.push(cseImage);
  const cseThumb = pagemap.cse_thumbnail?.[0]?.src;
  if (cseThumb) candidates.push(cseThumb);

  if (Array.isArray(pagemap.metatags)) {
    for (const meta of pagemap.metatags) {
      if (!meta) continue;
      for (const key of IMAGE_META_KEYS) {
        if (meta[key]) {
          candidates.push(meta[key]);
        }
      }
    }
  }

  for (const candidate of candidates) {
    const resolved = resolveToAbsolute(candidate, baseUrl);
    if (resolved) return resolved;
  }

  return null;
}

function extractPublishedDate(pagemap = {}, metatags = []) {
  const news = pagemap.newsarticle?.[0] || pagemap.article?.[0];
  const video = pagemap.videoobject?.[0];
  const candidates = [
    news?.datepublished,
    news?.datemodified,
    video?.uploaddate,
    metatags?.['article:published_time'],
    metatags?.['og:updated_time']
  ].filter(Boolean);
  if (!candidates.length) return null;
  const parsed = candidates
    .map((value) => {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    })
    .filter(Boolean);
  return parsed[0] || null;
}

function normalizeMeta(metaArray) {
  if (!Array.isArray(metaArray)) return {};
  return metaArray.reduce((acc, obj) => Object.assign(acc, obj), {});
}

function mapGoogleItems(items, searchType) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const pagemap = item?.pagemap || {};
    const metatags = normalizeMeta(pagemap.metatags);
    if (searchType === 'image') {
      return {
        title: item.title,
        url: item.link,
        site: item.displayLink,
        snippet: item.snippet || '',
        image: item.link
      };
    }

    const derivedImage = extractImageFromItem(item);
    const published = extractPublishedDate(pagemap, metatags);
    const byline = metatags?.['og:site_name'] || metatags?.['twitter:creator'] || item.displayLink;
    const video = pagemap.videoobject?.[0];
    const ogType = (metatags?.['og:type'] || '').toLowerCase();
    const isVideo = ogType.includes('video') || !!video;
    return {
      title: item.title,
      url: item.link,
      site: item.displayLink,
      snippet: item.snippet || '',
      image: derivedImage,
      published,
      byline,
      duration: video?.duration || video?.length || null,
      isVideo
    };
  });
}

app.get('/api/search', async (req, res) => {
  const query = (req.query.query || '').trim();
  if (!query) {
    res.status(400).json({ error: 'Missing query parameter' });
    return;
  }

  const filters = {
    time: req.query.time || 'Any time',
    region: req.query.region || 'Global',
    safe: req.query.safe !== 'off'
  };
  const siteScope = (req.query.siteScope || '').trim();
  const searchType = req.query.type === 'image' ? 'image' : 'web';

  const cacheKey = JSON.stringify({ query, filters, siteScope, searchType });
  const cached = cache.get(cacheKey);
  if (cached) {
    res.json({ fromCache: true, results: cached.results });
    return;
  }

  try {
    const startPages = searchType === 'image' ? [1, 11, 21] : [1];
    let collected = [];

    for (const start of startPages) {
      const params = buildGoogleParams({ query, filters, siteScope, searchType, start });
      const response = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Google API error ${response.status}: ${text}`);
      }
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      collected = collected.concat(items);
      const hasNextPage = data.queries?.nextPage?.length;
      if (!hasNextPage) break;
    }

    // Deduplicate by URL to avoid repeats across pages.
    const uniqueByUrl = [];
    const seen = new Set();
    for (const item of collected) {
      const key = item.link || item.title;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      uniqueByUrl.push(item);
      if (searchType === 'image' && uniqueByUrl.length >= 30) break;
    }

    let mapped = mapGoogleItems(uniqueByUrl, searchType);
    if (searchType === 'video') {
      const allowedHosts = new Set(TYPE_HINTS.video.siteFilters);
      mapped = mapped.filter((item) => {
        if (item.isVideo) return true;
        try {
          const host = new URL(item.url).hostname.replace(/^www\./, '');
          return allowedHosts.has(host);
        } catch (e) {
          return false;
        }
      }).map(({ isVideo, ...rest }) => rest);
    } else {
      mapped = mapped.map(({ isVideo, ...rest }) => rest);
    }

    cache.set(cacheKey, { results: mapped });
    res.json({ fromCache: false, results: mapped });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Failed to fetch live results', details: error.message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', cacheKeys: cache.keys() });
});

app.listen(PORT, () => {
  console.log(`Search backend running on http://localhost:${PORT}`);
});
