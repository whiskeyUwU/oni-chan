import { gogoScraper } from '#services/gogoScraper.js';
import { NotFoundError, validationError } from '#utils/errors';

export default async function searchHandler(c) {
  const { page, keyword } = c.req.valid('query');

  try {
    const cleanKeyword = keyword.replaceAll('+', ' ');
    let { results, hasNextPage } = await gogoScraper.search(cleanKeyword, page);

    // Spelling insensitivity: If no results found, try suggestions
    if ((!results || results.length < 1) && page === 1) {
      try {
        const { hiAnimeService } = await import('#services/hiAnimeService.js');
        const suggestionExtract = (await import('../../suggestion/suggestion.extract.js')).default;

        let data = await hiAnimeService.fetchAjax(`/ajax/search/suggest?keyword=${encodeURIComponent(cleanKeyword.toLowerCase())}`);

        // If no results for full keyword, try a prefix (aggressive fuzzy)
        if ((!data || !data.status || !data.html || data.html.includes('No results found')) && cleanKeyword.length > 5) {
          const prefix = cleanKeyword.substring(0, 5).toLowerCase();
          const fallbackData = await hiAnimeService.fetchAjax(`/ajax/search/suggest?keyword=${encodeURIComponent(prefix)}`);
          if (fallbackData && fallbackData.status && fallbackData.html && !fallbackData.html.includes('No results found')) {
            data = fallbackData;
          }
        }

        console.log(`HiAnime Suggestion Fallback status: ${data?.status}`);
        if (data && data.status) {
          const suggestions = suggestionExtract(data.html);
          console.log(`Fallback Extracted ${suggestions.length} suggestions`);
          if (Array.isArray(suggestions) && suggestions.length > 0) {
            results = suggestions.map(item => ({
              id: item.id.startsWith('hi:') ? item.id : `hi:${item.id}`,
              name: item.title,
              img: item.poster
            }));
            hasNextPage = false;
          }
        }
      } catch (err) {
        console.error('Search Suggestion Fallback Error:', err);
      }
    }

    const mappedResults = (results || []).map(item => ({
      id: item.id,
      name: item.name || item.title,
      poster: item.img || item.poster,
      duration: null,
      type: 'TV', // Default to TV
      rating: null,
      episodes: { sub: null, dub: null } // Details not available in search
    }));

    return {
      results: mappedResults,
      currentPage: Number(page) || 1,
      hasNextPage: hasNextPage,
      totalPages: hasNextPage ? (Number(page) || 1) + 1 : (Number(page) || 1) // Estimate
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        results: [],
        currentPage: Number(page) || 1,
        hasNextPage: false,
        totalPages: 1
      };
    }
    console.error('Gogo Search Handler Error:', error);
    throw new validationError('Failed to fetch search results from GogoAnime');
  }
}
