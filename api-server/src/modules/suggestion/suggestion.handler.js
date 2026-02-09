import { hiAnimeService } from '#services/hiAnimeService.js';
import { validationError } from '#utils/errors';
import suggestionExtract from './suggestion.extract.js';

export default async function suggestionHandler(c) {
  const { keyword } = c.req.valid('query');

  try {
    const data = await hiAnimeService.fetchAjax(`/ajax/search/suggest?keyword=${keyword}`);
    console.log(`Suggestion Ajax status: ${data?.status}, html length: ${data?.html?.length || 0}`);

    if (!data || !data.status) {
      return [];
    }

    const suggestions = suggestionExtract(data.html);
    console.log(`Extracted ${suggestions.length} suggestions`);
    const response = suggestions.map(item => ({
      ...item,
      name: item.title,
      jname: item.alternativeTitle
    }));
    return response;
  } catch (error) {
    console.error('Suggestion Handler Error:', error);
    return [];
  }
}
