import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3030/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

export const fetchHome = async () => {
    const response = await api.get('/home');
    return response.data.data;
};

export const fetchSpotlight = async () => {
    const response = await api.get('/spotlight');
    return response.data.data;
};

export const fetchTopTen = async () => {
    const response = await api.get('/topten');
    return response.data.data;
};


export const searchAnime = async (keyword, page = 1) => {
    const response = await api.get(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
    return response.data.data;
};

export const filterAnime = async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
    });
    const response = await api.get(`/filter?${query.toString()}`);
    return response.data.data;
};

export const searchSuggestions = async (keyword) => {
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

export default api;
