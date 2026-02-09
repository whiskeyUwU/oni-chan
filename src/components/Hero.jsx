import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronRight, ChevronLeft, Calendar, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Hero = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    if (items.length === 0) return <div className="h-[70vh] bg-dark animate-pulse" />;

    const current = items[currentIndex];

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

    const handleWatchNow = () => {
        // GogoAnime IDs for spotlight might be category IDs, but we want to watch. 
        // We can navigate to details first or try to guess episode 1 ID.
        // For now, navigating to details is safer.
        navigate(`/details/${current.id}`);
    };

    return (
        <div className="relative h-[85vh] w-full overflow-hidden mt-16 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 z-0">
                        <img src={current.poster} alt="" className="w-full h-full object-cover blur-2xl opacity-50 scale-110" />
                    </div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-10">
                        <img src={current.poster} alt={current.name} className="w-full h-full object-contain max-h-[80vh] drop-shadow-[0_0_50px_rgba(202,233,98,0.3)]" />
                    </div>
                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-dark via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-30 flex flex-col justify-center px-6 md:px-12 lg:px-24">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl"
                >
                    <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                        <span className="bg-accent/20 backdrop-blur-md border border-accent/30 px-3 py-1 rounded-lg">#{current.rank || currentIndex + 1} Spotlight</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
                        {current.name}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-gray-200 font-medium mb-8">
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <PlayCircle size={18} className="text-accent" />
                            <span>{current.duration || 'TV'}</span>
                            {current.otherInfo?.length > 0 && (
                                <>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <span>{current.otherInfo.join(' • ')}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-300 text-base md:text-lg line-clamp-3 mb-10 max-w-xl leading-relaxed drop-shadow-lg">
                        {current.description || 'Watch the latest episodes of this trending anime on Oni-Chan.'}
                    </p>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={handleWatchNow}
                            className="bg-accent text-dark px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(202,233,98,0.4)]"
                        >
                            <Play fill="currentColor" size={24} /> Watch Now
                        </button>
                        <Link
                            to={`/details/${current.id}`}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 px-10 py-4 rounded-full font-bold flex items-center gap-3 transition-all active:scale-95 text-white"
                        >
                            <Info size={24} /> Details
                        </Link>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 right-6 md:right-12 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prev} className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={next} className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2 pb-6">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 transition-all rounded-full ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
