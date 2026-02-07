import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchStream, fetchServers, fetchEpisodes } from '../api';
import Navbar from '../components/Navbar';
import { Play, Settings, SkipForward, Volume2, Maximize } from 'lucide-react';


const Watch = () => {
    const { episodeId } = useParams();
    const [searchParams] = useSearchParams();
    const [streamData, setStreamData] = useState(null);
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getStream = async () => {
            setLoading(true);
            try {
                const [serversRes, streamRes] = await Promise.all([
                    fetchServers(episodeId),
                    fetchStream(episodeId, 'animesuge') // Use AnimeSuge server
                ]);
                setServers(serversRes.sub || []);
                setStreamData(streamRes);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getStream();
    }, [episodeId]);

    // No need for HLS setup with iframe


    if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-accent">Gathering energy...</div>;

    return (
        <div className="min-h-screen bg-dark pb-20">
            <Navbar />

            <div className="px-6 md:px-12 lg:px-24 pt-24">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Player Section */}
                    <div className="flex-1">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group border border-white/10">
                            {streamData?.iframe ? (
                                <iframe
                                    src={streamData.iframe}
                                    className="w-full h-full"
                                    allowFullScreen
                                    frameBorder="0"
                                    title="Anime Player"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Loading player...
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-accent">Now Playing: Episode</h1>
                                <p className="text-gray-500 text-sm mt-1">If the player is slow, try switching servers below.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-3 glass rounded-full hover:bg-white/10 transition-colors"><SkipForward size={20} /></button>
                                <button className="p-3 glass rounded-full hover:bg-white/10 transition-colors"><Settings size={20} /></button>
                            </div>
                        </div>

                        {/* Servers */}
                        <div className="mt-8">
                            <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Available Servers</div>
                            <div className="flex flex-wrap gap-3">
                                {servers.map((s) => (
                                    <button key={s.serverId} className="px-6 py-3 glass rounded-xl text-sm font-bold hover:bg-accent hover:text-dark transition-all border border-white/5">
                                        {s.serverName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Chat or Episodes Placeholder */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="glass p-6 rounded-3xl h-full min-h-[400px]">
                            <h3 className="text-lg font-bold mb-6">Episode List</h3>
                            <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                {/* We'd normally fetch all episodes for this anime and list them here */}
                                <div className="col-span-4 text-gray-500 text-sm text-center py-10 italic">More episodes loading...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
