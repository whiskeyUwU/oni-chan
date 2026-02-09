
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimeCard from '../components/AnimeCard';
import { fetchTopTen } from '../api';

const MostPopular = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const res = await fetchTopTen();
                // API returns { today: [], week: [], month: [] }
                // We'll use 'today' as it maps to 'popular ongoing' from our backend update
                setAnimeList(res.today || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />
            <div className="px-6 md:px-12 lg:px-24 pt-32">
                <h1 className="text-3xl font-bold mb-8 text-accent">Most Popular Anime</h1>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {animeList.map((anime) => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MostPopular;
