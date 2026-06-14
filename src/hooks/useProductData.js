/**
 * Fetches real product data from free public APIs (no key required):
 * - Wikipedia REST API: product description, categories, specs
 * - DuckDuckGo Instant Answer API: quick facts and related topics
 * - Wikimedia Commons: product images
 */

export async function fetchProductContext(query) {
  const encoded = encodeURIComponent(query);

  const [wikiData, ddgData, wikiImageData] = await Promise.allSettled([
    // Wikipedia search + summary
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}?redirect=true`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null),

    // DuckDuckGo Instant Answer
    fetch(`https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null),

    // Wikipedia Commons image search
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=pageimages&format=json&pithumbsize=400&origin=*`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null),
  ]);

  const wiki = wikiData.status === 'fulfilled' ? wikiData.value : null;
  const ddg = ddgData.status === 'fulfilled' ? ddgData.value : null;
  const wikiImg = wikiImageData.status === 'fulfilled' ? wikiImageData.value : null;

  // Extract Wikipedia image
  let wikiImageUrl = null;
  if (wikiImg?.query?.pages) {
    const pages = Object.values(wikiImg.query.pages);
    wikiImageUrl = pages[0]?.thumbnail?.source || null;
  }

  // Extract DuckDuckGo topics
  const ddgTopics = ddg?.RelatedTopics?.slice(0, 5)
    .map(t => t.Text)
    .filter(Boolean) || [];

  // Build enriched context string for the LLM
  const contextParts = [];

  if (wiki?.extract) {
    contextParts.push(`Wikipedia: ${wiki.extract.slice(0, 600)}`);
  }
  if (wiki?.description) {
    contextParts.push(`Product type: ${wiki.description}`);
  }
  if (ddg?.AbstractText) {
    contextParts.push(`DuckDuckGo: ${ddg.AbstractText.slice(0, 400)}`);
  }
  if (ddgTopics.length) {
    contextParts.push(`Related topics: ${ddgTopics.join(' | ')}`);
  }
  if (ddg?.Answer) {
    contextParts.push(`Quick fact: ${ddg.Answer}`);
  }

  return {
    contextText: contextParts.join('\n'),
    wikiImageUrl,
    wikiTitle: wiki?.title || null,
    wikiDescription: wiki?.description || null,
  };
}