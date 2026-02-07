import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../api';
import Navbar from '../components/Navbar';
import AnimeCard from '../components/AnimeCard';
import { Search as SearchIcon, Filter, Layers } from 'lucide-react';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getResults = async () => {
            if (!keyword) return;
            setLoading(true);
            try {
                const res = await searchAnime(keyword);
                setResults(res.results || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getResults();
    }, [keyword]);

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />

            <div className="px-6 md:px-12 lg:px-24 pt-32">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <SearchIcon className="text-accent" size={28} />
                            Search Results for "{keyword}"
                        </h1>
                        <p className="text-gray-500 mt-2">{results.length} titles found</p>
                    </div>
                    <button className="glass px-6 py-2 rounded-full flex items-center gap-2 font-bold text-sm hover:bg-white/10 transition-colors">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {results.map((anime) => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                )}

                {!loading && results.length === 0 && (
                    <div className="text-center py-40">
                        <Layers size={64} className="mx-auto text-gray-700 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-400">No results found</h2>
                        <p className="text-gray-600 mt-2">Try searching with different keywords</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
