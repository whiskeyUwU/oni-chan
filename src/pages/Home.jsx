import React, { useEffect, useState } from 'react';
import { fetchHome } from '../api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AnimeCard from '../components/AnimeCard';
import { ChevronRight, Filter } from 'lucide-react';

import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                console.log('Fetching home data...');
                setError(null);
                const res = await fetchHome();
                console.log('Home data received:', res);
                if (!res || Object.keys(res).length === 0) {
                    setError('Received empty data from API');
                } else {
                    setData(res);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(`Failed to connect to API server: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-accent">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-bold tracking-widest animate-pulse">ONICHAN IS LOADING...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-accent p-6 text-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-white">Oops!</h1>
                <p className="text-gray-400 mb-8">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-accent text-dark px-10 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20">
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pb-20 selection:bg-accent selection:text-dark">
            <Navbar />
            <Hero items={data?.spotlightAnimes} />

            <main className="px-6 md:px-12 lg:px-24 mt-20 space-y-24">
                {/* Trending */}
                <section>
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tighter">
                            <span className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_#cae962]" />
                            Trending Now
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {data?.trendingAnimes?.map((item) => (
                            <AnimeCard key={item.id} anime={item} />
                        ))}
                    </div>
                </section>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Latest Episodes */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black flex items-center gap-4 text-white uppercase tracking-tighter">
                                <span className="w-2 h-10 bg-accent rounded-full shadow-[0_0_15px_#cae962]" />
                                Latest Episodes
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                            {data?.latestEpisodeAnimes?.map((item) => (
                                <AnimeCard key={item.id} anime={item} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Top Airing */}
                    <div className="space-y-10">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl sticky top-24">
                            <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter flex items-center gap-3">
                                <Filter size={24} className="text-accent" />
                                Top Airing
                            </h2>
                            <div className="space-y-6">
                                {data?.topAiringAnimes?.slice(0, 10).map((item, idx) => (
                                    <Link
                                        to={`/details/${item.id}`}
                                        key={item.id}
                                        className="flex gap-5 group cursor-pointer p-2 rounded-2xl transition-all hover:bg-white/10 border border-transparent hover:border-white/10"
                                    >
                                        <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-xl shadow-black/40 border border-white/5 group-hover:border-accent/30 transition-colors">
                                            <img src={item.poster} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute top-2 left-2 w-7 h-7 bg-accent text-dark text-sm font-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <h4 className="text-sm font-bold line-clamp-2 text-gray-100 group-hover:text-accent transition-colors leading-snug">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md">TV</span>
                                                <p className="text-xs text-gray-500 font-medium">{item.duration}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
