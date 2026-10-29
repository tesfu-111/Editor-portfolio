import React, { useState, useRef, useEffect } from 'react';
import { parseVideoUrl } from '../utils/videoUtils.ts';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '2.39:1';
  className?: string;
  showControls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  title,
  autoPlay = false,
  loop = false,
  muted = true,
  aspectRatio = '16:9',
  className = '',
  showControls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseVideoUrl(url);

  // Aspect ratio class mapper
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-[420px] mx-auto';
      case '1:1':
        return 'aspect-square max-w-[540px] mx-auto';
      case '2.39:1':
        return 'aspect-[2.39/1]';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
  }, [url]);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.warn('Playback error:', e);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * (videoRef.current.duration || 0);
    videoRef.current.currentTime = targetTime;
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!url) {
    return (
      <div className={`relative bg-[#171719] border border-[#26262B] rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 text-center ${getAspectClass()} ${className}`}>
        <AlertCircle className="w-10 h-10 text-[#A5A5AA] mb-2 opacity-50" />
        <p className="text-sm text-[#A5A5AA]">No video source has been specified for this project.</p>
      </div>
    );
  }

  // YouTube & Vimeo & Google Drive Embeds
  if (parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'gdrive') {
    return (
      <div ref={containerRef} className={`relative bg-[#0B0B0D] border border-[#26262B] rounded-lg overflow-hidden group ${getAspectClass()} ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0B0D] text-sm text-[#A5A5AA]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6A2B] mb-2" />
            <span>Loading player feed...</span>
          </div>
        )}
        <iframe
          src={parsed.embedUrl}
          title={title || 'Cinematic Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage('Unable to embed this external video. Verify the permissions or video ID.');
          }}
          className="w-full h-full border-0 absolute inset-0"
        />
        {hasError && (
          <div className="absolute inset-0 bg-[#0B0B0D]/95 flex flex-col items-center justify-center p-6 text-center z-20">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h4 className="text-white font-medium mb-1">Playback Unavailable</h4>
            <p className="text-xs text-[#A5A5AA] max-w-sm mb-4">{errorMessage}</p>
            <a
              href={parsed.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#FF6A2B] underline hover:text-[#FF7F47]"
            >
              Open source link directly
            </a>
          </div>
        )}
      </div>
    );
  }

  // Direct HTML5 Video
  return (
    <div
      ref={containerRef}
      className={`relative bg-[#0B0B0D] border border-[#26262B] rounded-lg overflow-hidden group select-none ${getAspectClass()} ${className}`}
      onMouseEnter={() => {}}
    >
      <video
        ref={videoRef}
        src={parsed.embedUrl}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        preload="metadata"
        onLoadedData={() => {
          setIsLoading(false);
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 0);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Failed to decode or stream the requested video file.');
        }}
        onClick={handlePlayToggle}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
          <div className="flex flex-col items-center bg-[#171719]/90 px-4 py-3 rounded border border-[#26262B] text-xs text-[#A5A5AA]">
            <Loader2 className="w-5 h-5 text-[#FF6A2B] animate-spin mb-1.5" />
            <span>Buffering timeline...</span>
          </div>
        </div>
      )}

      {/* Big Play Button on Idle */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          onClick={handlePlayToggle}
          aria-label="Play Video"
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#FF6A2B]/90 hover:bg-[#FF6A2B] text-[#0B0B0D] flex items-center justify-center shadow-xl shadow-black/50 transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
        >
          <Play className="w-7 h-7 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-[#0B0B0D]/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-sm font-medium text-white mb-1">Playback Error</p>
          <p className="text-xs text-[#A5A5AA] mb-4 max-w-sm">{errorMessage}</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#171719] border border-[#3D3D45] text-xs text-[#F5F5F5] hover:border-[#FF6A2B] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Playback
          </button>
        </div>
      )}

      {/* Custom Bottom Controls Bar */}
      {showControls && !hasError && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {/* Seekbar */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-[#26262B] rounded-full mb-3 cursor-pointer relative overflow-hidden group/bar"
          >
            <div
              className="h-full bg-[#FF6A2B] rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayToggle}
                className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleMuteToggle}
                className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-[11px] text-[#A5A5AA]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {title && (
                <span className="text-[11px] text-[#A5A5AA] truncate max-w-[200px] hidden sm:inline">
                  {title}
                </span>
              )}
              <button
                onClick={handleFullscreen}
                className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                aria-label="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
