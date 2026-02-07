import React, { useEffect, useState } from 'react';
import { fetchHome } from '../api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AnimeCard from '../components/AnimeCard';
import { ChevronRight, Filter } from 'lucide-react';

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                console.log('Fetching home data...');
                const res = await fetchHome();
                console.log('Home data received:', res);
                if (!res || Object.keys(res).length === 0) {
                    setError('Received empty data from API');
                }
                setData(res);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(`Failed to connect to API server: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-accent">Loading...</div>;

    if (error) return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-accent p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Content</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <p className="text-xs text-gray-500 mb-8">API URL: http://localhost:3030/api/v1/home</p>
            <button onClick={() => window.location.reload()} className="bg-accent text-dark px-6 py-2 rounded-lg font-bold">
                Retry
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />
            <Hero items={data?.spotlightAnimes} />

            <main className="px-6 md:px-12 lg:px-24 mt-12 space-y-16">
                {/* Trending */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-1 h-8 bg-accent rounded-full" />
                            Trending Anime
                        </h2>
                        <button className="text-gray-400 hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {data?.trendingAnimes?.map((item) => (
                            <AnimeCard key={item.id} anime={item} />
                        ))}
                    </div>
                </section>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Top Airing */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-1 h-8 bg-primary rounded-full" />
                                Latest Episodes
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {data?.latestEpisodeAnimes?.map((item) => (
                                <AnimeCard key={item.id} anime={item} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Most Popular */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold">Top Airing</h2>
                        </div>
                        <div className="space-y-4">
                            {data?.topAiringAnimes?.slice(0, 10).map((item, idx) => (
                                <div key={item.id} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                                    <div className="relative w-16 h-20 flex-shrink-0">
                                        <img src={item.poster} alt="" className="w-full h-full object-cover rounded-lg shadow-lg" />
                                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-accent text-dark text-xs font-bold rounded-md flex items-center justify-center shadow-lg">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-sm font-bold line-clamp-1 group-hover:text-accent transition-colors">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{item.episodes?.sub} Episodes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
