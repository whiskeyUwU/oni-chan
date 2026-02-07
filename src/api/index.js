import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3030/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

export const fetchHome = async () => {
    const response = await api.get('/home');
    const data = response.data.data;
    return {
        ...data,
        spotlightAnimes: data.spotlight,
        trendingAnimes: data.trending,
        latestEpisodeAnimes: data.latestEpisode,
        topAiringAnimes: data.topAiring,
    };
};

export const fetchSpotlight = async () => {
    const response = await api.get('/spotlight');
    return response.data.data;
};

export const fetchTopTen = async () => {
    const response = await api.get('/topten');
    return response.data.data;
};


export const fetchSearch = async (keyword, page = 1) => {
    const response = await api.get(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
    return response.data.data;
};

export const fetchSuggestions = async (keyword) => {
    const response = await api.get(`/suggestion?keyword=${encodeURIComponent(keyword)}`);
    return response.data.data;
};

export const fetchAnimeDetails = async (id) => {
    const response = await api.get(`/anime/${id}`);
    return response.data.data;
};

export const fetchEpisodes = async (id) => {
    const response = await api.get(`/episodes/${id}`);
    return response.data.data;
};

export const fetchServers = async (episodeId) => {
    const response = await api.get(`/servers?id=${episodeId}`);
    return response.data.data;
};

export const fetchStream = async (episodeId, server, type = 'sub') => {
    const response = await api.get(`/stream?id=${episodeId}&server=${server}&type=${type}`);
    return response.data.data;
};

export const searchAnime = async (keyword, page = 1) => {
    const response = await api.get(`/search?keyword=${keyword}&page=${page}`);
    return response.data.data;
};

export const searchSuggestions = async (keyword) => {
    const response = await api.get(`/suggestion?keyword=${keyword}`);
    return response.data.data;
};

export default api;
