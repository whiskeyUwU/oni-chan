import React, { useState, useEffect } from 'react';
import { Search, Menu, Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { searchSuggestions } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Temporarily disabled - suggestion endpoint not compatible with Jikan
        // const delayDebounceFn = setTimeout(async () => {
        //     if (keyword.length > 2) {
        //         try {
        //             const res = await searchSuggestions(keyword);
        //             setSuggestions(res.suggestions || []);
        //             setShowSuggestions(true);
        //         } catch (err) {
        //             console.error(err);
        //         }
        //     } else {
        //         setSuggestions([]);
        //         setShowSuggestions(false);
        //     }
        // }, 300);

        // return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword}`);
            setShowSuggestions(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <span className="bg-accent text-dark p-1 rounded-lg"><Play fill="currentColor" size={20} /></span>
                    <span className="text-gradient">ONI-CHAN</span>
                </Link>
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <Link to="/az-list" className="hover:text-accent transition-colors">A-Z List</Link>
                    <Link to="/most-popular" className="hover:text-accent transition-colors">Most Popular</Link>
                </div>
            </div>

            <div className="flex-1 max-w-md mx-8 relative hidden sm:block">
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search anime..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onFocus={() => keyword.length > 2 && setShowSuggestions(true)}
                        />
                    </div>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full glass rounded-2xl overflow-hidden py-2 z-[60]">
                        {suggestions.map((item, idx) => (
                            <div
                                key={idx}
                                className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                                onClick={() => {
                                    navigate(`/anime/${item.id}`);
                                    setKeyword('');
                                    setShowSuggestions(false);
                                }}
                            >
                                <img src={item.poster} alt="" className="w-10 h-14 object-cover rounded shadow-lg" />
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium truncate">{item.name}</div>
                                    <div className="text-xs text-gray-400">{item.jname}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="md:hidden text-gray-400 hover:text-white">
                    <Search size={24} />
                </button>
                <button className="text-gray-400 hover:text-white">
                    <Menu size={24} />
                </button>
                <div className="w-8 h-8 rounded-full bg-accent text-dark flex items-center justify-center font-bold text-xs ring-2 ring-accent/20">
                    J
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
