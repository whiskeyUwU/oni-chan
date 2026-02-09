import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime, filterAnime } from '../api';
import Navbar from '../components/Navbar';
import AnimeCard from '../components/AnimeCard';
import { Search as SearchIcon, Filter, Layers, ChevronRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const filterOptions = {
    type: ['all', 'movie', 'tv', 'ova', 'special', 'music'],
    status: ['all', 'finished_airing', 'currently_airing', 'not_yet_aired'],
    season: ['all', 'spring', 'summer', 'fall', 'winter'],
    language: ['all', 'sub', 'dub', 'sub_dub'],
    sort: ['default', 'recently_added', 'recently_updated', 'score', 'name_az', 'release_date', 'most_watched']
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        type: searchParams.get('type') || 'all',
        status: searchParams.get('status') || 'all',
        season: searchParams.get('season') || 'all',
        language: searchParams.get('language') || 'all',
        sort: searchParams.get('sort') || 'default',
        genres: searchParams.get('genres') || ''
    });

    useEffect(() => {
        const getResults = async () => {
            setLoading(true);
            try {
                let res;
                // If we have filters (other than defaults), use filterAnime
                const hasFilters = Object.entries(filters).some(([key, val]) => {
                    if (key === 'genres') return val !== '';
                    if (key === 'sort') return val !== 'default';
                    return val !== 'all';
                });

                if (hasFilters || !keyword) {
                    res = await filterAnime({ ...filters, keyword, page });
                } else {
                    res = await searchAnime(keyword, page);
                }

                setResults(res.results || []);
                setHasNextPage(res.hasNextPage);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getResults();
    }, [keyword, page, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        Object.entries(filters).forEach(([k, v]) => {
            if (v && v !== 'all' && v !== 'default') params.set(k, v);
        });
        setSearchParams(params);
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen bg-dark pb-20 selection:bg-accent selection:text-dark">
            <Navbar />

            <div className="px-6 md:px-12 lg:px-24 pt-32 text-white">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 text-accent mb-4">
                            <span className="w-8 h-1 bg-accent rounded-full" />
                            <span className="text-sm font-black uppercase tracking-widest">Library</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            {keyword || 'Explore'}
                        </h1>
                        <p className="text-gray-500 mt-4 font-medium italic">Showing {results.length} titles in results</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-3 font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all group"
                    >
                        <Filter size={20} className="group-hover:rotate-180 transition-transform duration-500" /> Advanced Filter
                    </button>
                </div>

                {/* Filter Sidebar/Modal */}
                <AnimatePresence>
                    {showFilters && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowFilters(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-full max-w-md bg-dark border-l border-white/10 z-[101] shadow-2xl p-8 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                        <Filter className="text-accent" /> Filters
                                    </h2>
                                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
                                    {Object.entries(filterOptions).map(([key, options]) => (
                                        <div key={key}>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">{key}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleFilterChange(key, opt)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filters[key] === opt
                                                            ? 'bg-accent text-dark border-accent shadow-lg shadow-accent/20'
                                                            : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                                                            }`}
                                                    >
                                                        {opt.replace(/_/g, ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5">
                                    <button
                                        onClick={applyFilters}
                                        className="w-full bg-accent text-dark py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-accent/10"
                                    >
                                        <Check size={20} /> Apply Filters
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilters({ type: 'all', status: 'all', season: 'all', language: 'all', sort: 'default', genres: '' });
                                        }}
                                        className="w-full mt-4 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                    >
                                        Reset to Default
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-20">
                            {results.map((anime) => (
                                <AnimeCard key={anime.id} anime={anime} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {results.length > 0 && (
                            <div className="flex justify-center items-center gap-8 mt-12 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl w-fit mx-auto shadow-2xl">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5"
                                >
                                    <ChevronRight size={24} className="rotate-180" />
                                </button>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Page</span>
                                    <span className="text-xl font-black text-accent">{page}</span>
                                </div>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!hasNextPage}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!loading && results.length === 0 && (
                    <div className="text-center py-40">
                        <Layers size={64} className="mx-auto text-gray-700 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-400">No results found</h2>
                        <p className="text-gray-600 mt-2">Try adjusting your filters or search keywords</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
