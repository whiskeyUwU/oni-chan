import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAnimeDetails, fetchEpisodes, searchAnime } from '../api';
import Navbar from '../components/Navbar';
import { Play, Star, Calendar, Clock, Tv, Layers, ChevronRight, Share2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Details = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeRange, setActiveRange] = useState(0); // 0 = 1-100, 1 = 101-200, etc.
    const navigate = useNavigate();

    useEffect(() => {
        const getDetails = async () => {
            setLoading(true);
            try {
                const [detailsRes, episodesRes] = await Promise.all([
                    fetchAnimeDetails(id),
                    fetchEpisodes(id)
                ]);
                setData(detailsRes);
                const eps = Array.isArray(episodesRes) ? episodesRes : episodesRes.episodes || [];
                setEpisodes(eps);

                // Use related anime from backend if available, otherwise search
                if (detailsRes?.relatedAnimes?.length > 0) {
                    setRelated(detailsRes.relatedAnimes.slice(0, 6));
                } else if (detailsRes?.anime?.info?.name) {
                    const searchRes = await searchAnime(detailsRes.anime.info.name);
                    const searchResults = Array.isArray(searchRes) ? searchRes : (searchRes?.results || []);
                    setRelated(searchResults.filter(a => a.id !== id).slice(0, 6));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getDetails();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-accent">Loading...</div>;

    const anime = data.anime;

    // Pagination logic
    const itemsPerPage = 100;
    const sortedEpisodes = [...episodes].sort((a, b) => {
        const numA = parseFloat(a.number);
        const numB = parseFloat(b.number);
        return numA - numB;
    });

    const totalPages = Math.ceil(sortedEpisodes.length / itemsPerPage);
    const currentEpisodes = sortedEpisodes.slice(activeRange * itemsPerPage, (activeRange + 1) * itemsPerPage);

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />

            {/* Banner */}
            <div className="relative h-[50vh] w-full">
                <div className="absolute inset-0">
                    <img src={anime.info.poster} alt="" className="w-full h-full object-cover blur-sm opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
                </div>
            </div>

            <div className="px-6 md:px-12 lg:px-24 -mt-64 relative z-10">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Poster */}
                    <div className="w-64 flex-shrink-0 mx-auto md:mx-0">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 shadow-accent/10">
                            <img src={anime.info.poster} alt={anime.info.name} className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={() => sortedEpisodes[0]?.id ? navigate(`/watch/${sortedEpisodes[0].id}`) : console.warn('No episodeId found')}
                                className="w-full bg-accent text-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                            >
                                <Play fill="currentColor" size={20} /> Watch Now
                            </button>
                            <button className="w-full glass py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                <Plus size={20} /> Add to List
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left pt-8">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold ring-1 ring-accent/20">#{anime.info.stats.rating} Score</span>
                            <span className="bg-white/5 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">{anime.info.stats.quality}</span>
                            <span className="bg-white/5 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">{anime.info.stats.type}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{anime.info.name}</h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-4 md:line-clamp-none">
                            {anime.info.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5">
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Released</div>
                                <div className="text-sm font-medium">{anime.moreInfo.aired}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Status</div>
                                <div className="text-sm font-medium">{anime.moreInfo.status}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Genre</div>
                                <div className="text-sm font-medium flex flex-wrap gap-1">{anime.moreInfo.genres.slice(0, 3).join(', ')}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase tracking-widest mb-1 font-bold">Duration</div>
                                <div className="text-sm font-medium">{anime.moreInfo.duration}</div>
                            </div>
                        </div>

                        {data.seasons?.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                    <Layers size={14} className="text-accent" /> More Seasons
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {data.seasons.map((s) => (
                                        <Link
                                            key={s.id}
                                            to={`/details/${s.id}`}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${s.isActive
                                                ? 'bg-accent text-dark border-accent shadow-lg shadow-accent/20 scale-105'
                                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {s.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mt-20">
                    {/* Episodes List */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-1 h-8 bg-accent rounded-full" />
                                Episodes
                            </h2>
                            {totalPages > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveRange(i)}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeRange === i ? 'bg-accent text-dark' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            {i * 100 + 1}-{Math.min((i + 1) * 100, sortedEpisodes.length)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                            <AnimatePresence mode="wait">
                                {currentEpisodes.map((ep) => (
                                    <motion.div
                                        key={ep.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <Link
                                            to={`/watch/${ep.id}`}
                                            className="block bg-white/5 hover:bg-accent hover:text-dark px-4 py-3 rounded-xl text-center font-bold text-sm transition-all border border-white/5 hover:border-accent shadow-sm"
                                        >
                                            {ep.number}
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Related Anime */}
                    {related.length > 0 && (
                        <div className="w-full lg:w-80">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-1 h-8 bg-accent rounded-full" />
                                Related
                            </h2>
                            <div className="flex flex-col gap-4">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/details/${item.id}`}
                                        className="flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="w-20 h-28 rounded-xl overflow-hidden shadow-lg border border-white/5 flex-shrink-0">
                                            <img src={item.poster} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-accent transition-colors">{item.name}</h3>
                                            <span className="text-xs text-gray-500 mt-2">
                                                {item.type} • {typeof item.episodes === 'object' ? (item.episodes.sub || item.episodes.eps || 0) : item.episodes} eps
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Details;
