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
        const delayDebounceFn = setTimeout(async () => {
            if (keyword.length > 1) { // Suggest starting from 2 characters
                try {
                    const res = await searchSuggestions(keyword);
                    setSuggestions(res || []);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
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
                            onFocus={() => keyword.length > 1 && setShowSuggestions(true)}
                        />
                    </div>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full glass-heavy rounded-2xl overflow-hidden py-3 z-[60] border border-white/10 shadow-2xl ring-1 ring-black/50">
                        <div className="px-4 pb-2 mb-2 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Suggestions</span>
                            <span className="text-[10px] text-accent/50 font-bold">{suggestions.length} found</span>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {suggestions.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-all group"
                                    onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent input onBlur from firing before navigation
                                        navigate(`/details/${item.id}`);
                                        setKeyword('');
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={item.poster} alt="" className="w-10 h-14 object-cover rounded shadow-lg border border-white/10 group-hover:border-accent/30 transition-colors" />
                                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="grow text-sm font-bold truncate group-hover:text-accent transition-colors">{item.name}</div>
                                        <div className="text-[11px] text-gray-400 truncate mt-0.5">{item.jname}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 font-bold uppercase tracking-wider">{item.type || 'TV'}</span>
                                            <span className="text-[9px] text-gray-500">{item.aired?.split(',')[1] || item.aired || ''}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
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
