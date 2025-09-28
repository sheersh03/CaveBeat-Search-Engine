const API_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';

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

export async function fetchSearchResults({ query, filters, siteScope }) {
  const key = import.meta.env.VITE_SEARCH_API_KEY;
  const cx = import.meta.env.VITE_SEARCH_CX;

  if (!key || !cx) {
    throw new Error('Missing VITE_SEARCH_API_KEY or VITE_SEARCH_CX');
  }

  const params = new URLSearchParams({
    key,
    cx,
    q: siteScope ? `${query} ${siteScope}` : query,
    num: '10',
    safe: filters.safe ? 'active' : 'off',
    fields: 'items(title,link,snippet,displayLink,pagemap,cachedPageUrl)' // reduce payload
  });

  const gl = regionMap[filters.region];
  if (gl) params.set('gl', gl);
  const dateRestrict = timeMap[filters.time];
  if (dateRestrict) params.set('dateRestrict', dateRestrict);

  const url = `${API_ENDPOINT}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const items = data.items || [];
  return items.map(item => ({
    title: item.title,
    url: item.link,
    site: item.displayLink,
    snippet: item.snippet,
    cachedUrl: item.cachedPageUrl || null,
    image: item.pagemap?.cse_image?.[0]?.src || null
  }));
}
