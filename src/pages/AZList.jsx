
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AZList = () => {
    const [letter, setLetter] = useState('A');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                // Using axios directly or create a new api method. 
                // Let's use direct axios for now or add to api/index.js later.
                // Assuming api endpoint is /az-list/:letter
                const res = await axios.get(`http://127.0.0.1:3030/api/v1/az-list/${letter.toLowerCase()}`);
                setResults(res.data.data.results || []);
            } catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [letter]);

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />
            <div className="px-6 md:px-12 lg:px-24 pt-32">
                <h1 className="text-3xl font-bold mb-8 text-accent">A-Z Anime List</h1>

                {/* Alphabet Navigation */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {alphabet.map((l) => (
                        <button
                            key={l}
                            onClick={() => setLetter(l)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${letter === l
                                ? 'bg-accent text-dark shadow-lg shadow-accent/20 scale-110'
                                : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse">Loading {letter}...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((anime) => (
                            <Link
                                key={anime.id}
                                to={`/details/${anime.id}`}
                                className="glass p-4 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                                <div className="font-bold text-gray-300 group-hover:text-accent truncate">
                                    {anime.title}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AZList;
