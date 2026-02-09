import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

const VideoPlayer = ({ url, poster, onEnded, autoplay, autoskip, animeName, episodeNumber }) => {
    const artRef = useRef(null);
    const instanceRef = useRef(null);

    // Initial setup and URL change handling
    useEffect(() => {
        if (!url) return;

        const art = new Artplayer({
            container: artRef.current,
            url: url,
            poster: poster,
            volume: 0.5,
            isLive: false,
            muted: false,
            autoplay: autoplay,
            pip: true,
            autoSize: true,
            autoMini: true,
            screenshot: true,
            setting: true,
            loop: false,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            fullscreenWeb: true,
            subtitleOffset: true,
            miniProgressBar: true,
            mutex: true,
            backdrop: true,
            playsInline: true,
            autoPlayback: true,
            airplay: true,
            theme: '#cae962', // Lemonish accent color
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
            customType: {
                m3u8: function (video, url) {
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    }
                },
            },
            highlight: [
                { time: 85, text: 'Intro Ends' },
                { time: 1320, text: 'Outro Starts' },
            ],
        });

        instanceRef.current = art;

        art.on('ready', () => {
            console.info('Artplayer Ready');

            const updateHighlights = () => {
                if (art.video.duration > 100) {
                    const introEnd = 85;
                    const outroStart = art.video.duration - 90;

                    art.option.highlight = [
                        { time: introEnd, text: 'Intro Ends' },
                        { time: outroStart, text: 'Outro Starts' }
                    ];
                }
            };

            art.on('video:loadedmetadata', updateHighlights);
            if (art.video.duration) updateHighlights();

            // Initial autoskip check
            if (autoskip && art.video.currentTime < 85) {
                art.video.currentTime = 85;
                art.notice.show = 'Intro skipped automatically';
            }
        });

        art.on('video:ended', () => {
            if (onEnded) onEnded();
        });

        // Add Skip Intro/Outro layers
        art.layers.add({
            name: 'skip-intro',
            html: '<button style="background: rgba(202,233,98,0.9); color: #000; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; display: none;">Skip Intro</button>',
            style: { position: 'absolute', bottom: '80px', right: '20px' },
            click: function () {
                art.video.currentTime = 90;
                this.style.display = 'none';
                art.notice.show = 'Intro skipped';
            },
        });

        art.layers.add({
            name: 'skip-outro',
            html: '<button style="background: rgba(202,233,98,0.9); color: #000; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; display: none;">Skip Outro</button>',
            style: { position: 'absolute', bottom: '80px', right: '20px' },
            click: function () {
                if (onEnded) onEnded();
                art.notice.show = 'Skipping to next...';
            },
        });

        art.on('video:timeupdate', () => {
            const current = art.video.currentTime;
            const duration = art.video.duration;
            const skipIntroBtn = art.layers['skip-intro'];
            const skipOutroBtn = art.layers['skip-outro'];

            if (current > 5 && current < 85) {
                if (skipIntroBtn) skipIntroBtn.style.display = 'block';
            } else {
                if (skipIntroBtn) skipIntroBtn.style.display = 'none';
            }

            if (duration > 100 && current > duration - 90 && current < duration - 10) {
                if (skipOutroBtn) skipOutroBtn.style.display = 'block';
            } else {
                if (skipOutroBtn) skipOutroBtn.style.display = 'none';
            }
        });

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
            instanceRef.current = null;
        };
    }, [url, poster]);

    // Update settings reactively without restarting video
    useEffect(() => {
        const art = instanceRef.current;
        if (!art || !art.video) return;

        art.option.autoplay = autoplay;

        // If autoskip is turned on while in the intro, skip it immediately
        if (autoskip && art.video.currentTime < 85) {
            art.video.currentTime = 85;
            art.notice.show = 'Intro skipped automatically';
        }
    }, [autoplay, autoskip]);

    return (
        <div ref={artRef} className="w-full h-full rounded-2xl overflow-hidden" />
    );
};

export default VideoPlayer;
