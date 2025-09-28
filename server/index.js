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

function buildGoogleParams({ query, filters, siteScope, searchType }) {
  const params = new URLSearchParams();
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if (!key || !cx) {
    throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CX environment variables');
  }
  params.set('key', key);
  params.set('cx', cx);
  params.set('q', siteScope ? `${query} ${siteScope}` : query);
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

  return params;
}

function mapGoogleItems(items, searchType) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (searchType === 'image') {
      return {
        title: item.title,
        url: item.link,
        site: item.displayLink,
        snippet: item.snippet || '',
        image: item.link
      };
    }
    return {
      title: item.title,
      url: item.link,
      site: item.displayLink,
      snippet: item.snippet || '',
      image: item.pagemap?.cse_image?.[0]?.src || null
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
    const params = buildGoogleParams({ query, filters, siteScope, searchType });
    const response = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google API error ${response.status}: ${text}`);
    }
    const data = await response.json();
    const mapped = mapGoogleItems(data.items, searchType);
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
