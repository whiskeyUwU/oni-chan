import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAnimeDetails, fetchEpisodes } from '../api';
import Navbar from '../components/Navbar';
import { Play, Star, Calendar, Clock, Tv, Layers, ChevronRight, Share2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Details = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setEpisodes(episodesRes.episodes || []);
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
                            <button onClick={() => navigate(`/watch/${episodes[0]?.episodeId}`)} className="w-full bg-accent text-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-accent/20">
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
                    </div>
                </div>

                {/* Episodes */}
                <section className="mt-20">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-1 h-8 bg-accent rounded-full" />
                        Episodes
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {episodes.map((ep) => (
                            <Link
                                key={ep.episodeId}
                                to={`/watch/${ep.episodeId}`}
                                className="bg-white/5 hover:bg-accent hover:text-dark px-4 py-3 rounded-lg text-center font-bold text-sm transition-all border border-white/5 hover:border-accent shadow-sm"
                            >
                                {ep.number}
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Details;
