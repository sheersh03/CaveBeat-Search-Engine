export async function fetchSearchResults({ query, filters, siteScope, type = 'web' }) {
  const params = new URLSearchParams({
    query,
    time: filters.time,
    region: filters.region,
    safe: filters.safe ? 'on' : 'off',
    type,
  });
  if (siteScope) params.set('siteScope', siteScope);

  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search API error: ${response.status} ${text}`);
  }
  const data = await response.json();
  return data.results || [];
}
