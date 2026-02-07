import React, { useState } from 'react';
import { Play, Info, ChevronRight, ChevronLeft, Calendar, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (items.length === 0) return <div className="h-[70vh] bg-dark animate-pulse" />;

    const current = items[currentIndex];

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

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
                    <img src={current.poster} alt={current.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl"
                >
                    <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                        <span className="bg-accent/10 px-2 py-0.5 rounded">#{current.rank} Spotlight</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                        {current.name}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-gray-300 font-medium mb-6">
                        <div className="flex items-center gap-2">
                            <PlayCircle size={16} className="text-accent" />
                            <span>{current.otherInfo?.join(' • ')}</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base line-clamp-3 mb-8 max-w-xl">
                        {current.description}
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="bg-accent text-dark px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/20">
                            <Play fill="currentColor" size={20} /> Watch Now
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95">
                            <Info size={20} /> Details
                        </button>
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
