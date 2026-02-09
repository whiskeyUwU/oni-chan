import React from 'react';
import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimeCard = ({ anime }) => {
    return (
        <Link to={`/details/${anime.id}`} className="group relative">
            <motion.div
                whileHover={{ y: -5 }}
                className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-dark-light"
            >
                <img
                    src={anime.poster}
                    alt={anime.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {anime.episodes?.sub && (
                        <span className="bg-accent text-dark text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            SUB {anime.episodes.sub}
                        </span>
                    )}
                    {anime.episodes?.dub && (
                        <span className="bg-primary text-dark text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            DUB {anime.episodes.dub}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-10 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-1.5 text-xs text-accent font-bold mb-1">
                        <Star size={10} fill="currentColor" /> {anime.type || 'TV'}
                    </div>
                    <h3 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {anime.name}
                    </h3>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark/40 backdrop-blur-[2px]">
                    <div className="bg-accent text-dark p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl shadow-accent/40">
                        <Play fill="currentColor" size={24} />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default AnimeCard;
