import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchStream, fetchServers, fetchEpisodes, fetchAnimeDetails } from '../api';
import Navbar from '../components/Navbar';
import { Play, Settings, SkipForward, Volume2, Maximize, ArrowLeft, RotateCw, Layers, Forward } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';


const Watch = () => {
    const { episodeId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [streamData, setStreamData] = useState(null);
    const [servers, setServers] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [anime, setAnime] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeRange, setActiveRange] = useState(0);
    const [subDub, setSubDub] = useState('sub');
    const [allServers, setAllServers] = useState({ sub: [], dub: [] });
    const [refreshKey, setRefreshKey] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [autoskip, setAutoskip] = useState(false);
    const [seasons, setSeasons] = useState([]);

    // Extract animeId (e.g., "fire-force-episode-1" -> "fire-force")
    // For HiAnime: "shingeki-no-kyojin-112::ep=123" -> "shingeki-no-kyojin-112"
    let animeId = episodeId?.includes('::') ? episodeId.split('::')[0] : episodeId?.split('-episode-')[0];
    if (episodeId?.includes('::') && !animeId.startsWith('hi:')) {
        animeId = `hi:${animeId}`;
    }
    const currentEpisodeNumber = episodeId?.includes('ep=') ? parseFloat(episodeId.split('ep=').pop()) : parseFloat(episodeId?.split('-episode-')[1]);

    useEffect(() => {
        const getData = async () => {
            if (!episodeId || !animeId) return;
            setLoading(true);
            try {
                // Fetch Servers, Episodes, and Details in parallel
                const [serversRes, episodesRes, detailsRes] = await Promise.all([
                    fetchServers(episodeId),
                    fetchEpisodes(animeId),
                    fetchAnimeDetails(animeId)
                ]);

                // Store all servers
                const fetchedServers = {
                    sub: serversRes?.sub || [],
                    dub: serversRes?.dub || []
                };
                setAllServers(fetchedServers);

                // Decide which type to show (if current is empty, try other)
                let currentType = subDub;
                if (fetchedServers[currentType].length === 0) {
                    currentType = fetchedServers.sub.length > 0 ? 'sub' : (fetchedServers.dub.length > 0 ? 'dub' : 'sub');
                    setSubDub(currentType);
                }

                const displayServers = fetchedServers[currentType];
                setServers(displayServers);

                if (displayServers.length > 0) {
                    const defaultServer = displayServers[0].serverName;
                    setSelectedServer(defaultServer);
                    const stream = await fetchStream(episodeId, defaultServer, currentType);
                    setStreamData(stream);
                }

                // Handle Episodes & Details
                const eps = episodesRes?.episodes || [];
                setEpisodes(eps);
                setAnime(detailsRes?.anime?.info);
                setSeasons(detailsRes?.seasons || []);

                // Set active range based on current episode
                const currentEp = eps.find(e =>
                    e.id === episodeId ||
                    (e.number === currentEpisodeNumber && !episodeId.includes('::'))
                );
                const currentIndex = eps.indexOf(currentEp);
                if (currentIndex !== -1) {
                    setActiveRange(Math.floor(currentIndex / 100));
                }

            } catch (err) {
                console.error('Failed to fetch watch data:', err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [episodeId, animeId, refreshKey]);

    const handleServerChange = async (serverName) => {
        try {
            setSelectedServer(serverName);
            setStreamData(null); // Show loading
            const streamRes = await fetchStream(episodeId, serverName, subDub);
            setStreamData(streamRes);
        } catch (err) {
            console.error('Failed to change server:', err);
        }
    };

    const handleEpisodeChange = (id) => {
        navigate(`/watch/${id}`);
    };

    // Find next episode ID
    const sortedEpisodes = [...episodes].sort((a, b) => a.number - b.number);
    const nextEpisode = sortedEpisodes.find(ep => ep.number === currentEpisodeNumber + 1);
    const prevEpisode = sortedEpisodes.find(ep => ep.number === currentEpisodeNumber - 1);

    const itemsPerPage = 100;
    const totalPages = Math.ceil(sortedEpisodes.length / itemsPerPage);
    const currentEpisodes = sortedEpisodes.slice(activeRange * itemsPerPage, (activeRange + 1) * itemsPerPage);

    const toggleSubDub = async () => {
        const newType = subDub === 'sub' ? 'dub' : 'sub';
        setSubDub(newType);

        const newServers = allServers[newType];
        setServers(newServers);

        if (newServers.length > 0) {
            const defaultServer = newServers[0].serverName;
            setSelectedServer(defaultServer);
            setStreamData(null);
            const stream = await fetchStream(episodeId, defaultServer, newType);
            setStreamData(stream);
        }
    };

    // Autoplay logic for both custom VideoPlayer (via callback) and iframes (via postMessage)
    useEffect(() => {
        const handleMessage = (e) => {
            try {
                const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                if (data.event === 'ended' && autoplay && nextEpisode) {
                    handleEpisodeChange(nextEpisode.id);
                }
            } catch (err) { }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [autoplay, nextEpisode]);

    if (loading) return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-accent">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse">Summoning jutsu...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pb-20 relative overflow-hidden text-white">
            <Navbar />

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

            <div className="px-6 md:px-12 lg:px-24 pt-28 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Player Section */}
                    <div className="flex-1 min-w-0">
                        {/* Player Container */}
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative group secondary-glow">
                            {streamData ? (
                                streamData.sources?.length > 0 ? (
                                    <VideoPlayer
                                        key={`${selectedServer}-${subDub}-${refreshKey}`}
                                        url={streamData.sources[0].url}
                                        poster={anime?.poster}
                                        onEnded={() => autoplay && nextEpisode && handleEpisodeChange(nextEpisode.id)}
                                        autoplay={autoplay}
                                        autoskip={autoskip}
                                        animeName={anime?.name}
                                        episodeNumber={currentEpisodeNumber}
                                    />
                                ) : (
                                    <iframe
                                        key={`${refreshKey}-${selectedServer}-${subDub}`}
                                        src={streamData.iframe}
                                        className="w-full h-full"
                                        allowFullScreen
                                        frameBorder="0"
                                        title="Anime Player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <div className="w-12 h-12 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                                    <p>Loading stream...</p>
                                </div>
                            )}
                        </div>

                        {/* Controls & Title */}
                        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-xl md:text-2xl font-bold leading-tight line-clamp-1">
                                    {anime?.name || 'Loading...'}
                                </h1>
                                <p className="text-accent font-medium mt-1 flex items-center gap-2">
                                    Episode {episodes.find(e => e.id === episodeId)?.number || currentEpisodeNumber}
                                    <span className="text-gray-500 text-xs">•</span>
                                    <span className="text-gray-400 text-xs uppercase tracking-wider">{subDub === 'dub' ? 'DUBBED' : 'SUBBED'}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <button
                                    onClick={toggleSubDub}
                                    className="px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-300 border-white/5"
                                >
                                    {subDub === 'dub' ? 'Sub' : 'Dub'}
                                </button>

                                <div className="h-6 w-px bg-white/10 hidden md:block" />

                                <button
                                    onClick={() => setRefreshKey(k => k + 1)}
                                    className="p-2.5 glass rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    title="Reload Player"
                                >
                                    <RotateCw size={18} />
                                </button>

                                {prevEpisode && (
                                    <button
                                        onClick={() => handleEpisodeChange(prevEpisode.id)}
                                        className="p-2.5 glass rounded-full hover:bg-white/10 transition-colors text-white hover:text-accent"
                                        title="Previous Episode"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                )}

                                {nextEpisode && (
                                    <button
                                        onClick={() => handleEpisodeChange(nextEpisode.id)}
                                        className="px-4 md:px-6 py-2 md:py-3 bg-accent text-dark rounded-full font-bold hover:bg-accent/90 transition-transform active:scale-95 flex items-center gap-2 shadow-lg shadow-accent/20 text-sm"
                                    >
                                        Next <SkipForward size={16} fill="currentColor" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Seasons & Player Enhancements */}
                        <div className="mt-8 flex flex-col md:flex-row gap-6">
                            {/* Seasons */}
                            {seasons.length > 0 && (
                                <div className="flex-1">
                                    <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                                        <Layers size={14} className="text-accent" /> Change Season
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {seasons.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => navigate(`/details/${s.id}`)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${s.isActive
                                                    ? 'bg-accent text-dark border-accent shadow-lg shadow-accent/10'
                                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {s.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Player Settings */}
                            <div className="glass p-4 rounded-2xl flex items-center gap-6 border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Autoplay</div>
                                    <button
                                        onClick={() => setAutoplay(!autoplay)}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${autoplay ? 'bg-accent' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoplay ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="h-8 w-px bg-white/5" />
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Autoskip</div>
                                    <button
                                        onClick={() => setAutoskip(!autoskip)}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${autoskip ? 'bg-accent' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoskip ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Servers & Tip */}
                        <div className="mt-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Settings size={18} className="text-accent" />
                                    <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Warp Gates (Servers)</span>
                                </div>
                                <div className="text-[10px] text-gray-500 italic bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    💡 Playback stuck? Try switching servers or refreshing.
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {servers.map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => handleServerChange(s.name)}
                                        className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${selectedServer === s.name
                                            ? 'bg-gradient-to-r from-accent to-primary text-dark shadow-lg shadow-accent/20 scale-105 font-bold'
                                            : 'glass text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Up Next / Next Season */}
                        {seasons.length > 0 && seasons.findIndex(s => s.isActive) < seasons.length - 1 && (
                            <div className="mt-10">
                                <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                    <Forward size={14} className="text-accent" /> Up Next (Next Season)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {seasons.slice(seasons.findIndex(s => s.isActive) + 1, seasons.findIndex(s => s.isActive) + 2).map((nextS) => (
                                        <button
                                            key={nextS.id}
                                            onClick={() => navigate(`/details/${nextS.id}`)}
                                            className="group relative flex items-center gap-4 p-4 rounded-2xl glass border-white/5 hover:bg-white/10 transition-all text-left overflow-hidden"
                                        >
                                            <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                                {nextS.poster ? (
                                                    <img src={nextS.poster} alt={nextS.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-accent text-[10px] font-black uppercase tracking-widest mb-1">Coming Up Next</div>
                                                <div className="text-white font-bold line-clamp-1 group-hover:text-accent transition-colors">{nextS.title}</div>
                                                <div className="text-gray-500 text-xs mt-1">Visit Season Details</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-dark transition-all">
                                                <SkipForward size={20} fill="currentColor" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Episode List */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="glass-card p-6 rounded-2xl h-[calc(100vh-150px)] sticky top-28 flex flex-col">
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        Episodes
                                        <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                                            {episodes.length}
                                        </span>
                                    </h3>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 rounded-xl">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveRange(i)}
                                                className={`flex-1 min-w-[60px] py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeRange === i
                                                    ? 'bg-accent text-dark'
                                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                            >
                                                {i * 100 + 1}-{Math.min((i + 1) * 100, sortedEpisodes.length)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar space-y-2">
                                {currentEpisodes.length > 0 ? (
                                    currentEpisodes.map((ep) => (
                                        <button
                                            key={ep.id}
                                            onClick={() => handleEpisodeChange(ep.id)}
                                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${ep.number === currentEpisodeNumber
                                                ? 'bg-white/10 border border-accent/30 shadow-[inset_0_0_20px_rgba(202,233,98,0.1)]'
                                                : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${ep.number === currentEpisodeNumber
                                                ? 'bg-accent text-dark'
                                                : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                                                }`}>
                                                {ep.number}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className={`text-sm font-medium line-clamp-1 ${ep.number === currentEpisodeNumber ? 'text-accent' : 'text-gray-300 group-hover:text-white'
                                                    }`}>
                                                    Episode {ep.number}
                                                </div>
                                            </div>
                                            {ep.number === currentEpisodeNumber && (
                                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#cae962]" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                                        <div className="mb-4 opacity-20 text-6xl">🕸️</div>
                                        No episodes found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
