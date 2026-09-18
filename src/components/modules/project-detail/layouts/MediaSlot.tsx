import { useState, useRef } from "react";
import { Play, Maximize2 } from "lucide-react";
import {
  getVideoEmbedUrl,
  getDirectVideoUrl,
  getVideoThumbnail,
} from "./slotResolver";

export interface MediaSlotProps {
  slotId: number;
  type: "Video" | "Logo" | "Image";
  aspect: "16:9" | "9:16" | "1:1";
  resolution: "1920x1080" | "1000x1000" | "1080x1920";
  aspectClass: string;
  url?: string;
  thumbnail?: string;
  title?: string;
  className?: string;
  isPlayingInline?: boolean;
  onStartPlay?: (slotId: number | null) => void;
  onOpen?: (url: string, title: string) => void;
}

export function MediaSlot({
  slotId,
  type,
  aspect,
  resolution,
  aspectClass,
  url,
  thumbnail,
  title,
  className = "",
  isPlayingInline: controlledIsPlaying,
  onStartPlay,
  onOpen,
}: MediaSlotProps) {
  const isVideo = type === "Video";
  const displayTitle = title || `${type} #${slotId} (${resolution})`;
  const embedUrl = url ? getVideoEmbedUrl(url) : null;
  const directVideoUrl = url ? getDirectVideoUrl(url) : null;
  const computedThumbnail = thumbnail || (url ? getVideoThumbnail(url) : null);
  const [localIsPlayingInline, setLocalIsPlayingInline] = useState(false);
  const isPlayingInline = controlledIsPlaying !== undefined ? controlledIsPlaying : localIsPlayingInline;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartPlay = () => {
    if (onStartPlay) {
      onStartPlay(slotId);
    } else {
      setLocalIsPlayingInline(true);
    }
  };

  const handleOpenTheater = () => {
    if (onStartPlay) {
      onStartPlay(null);
    }
    setLocalIsPlayingInline(false);
    if (url) {
      onOpen?.(url, displayTitle);
    }
  };

  // 1. WIREFRAME PLACEHOLDER (When media is not yet placed)
  if (!url) {
    return (
      <div
        data-slot-id={slotId}
        className={`relative bg-[#253BFF] border border-white/20 flex items-center justify-center overflow-hidden w-full ${aspectClass} ${className}`}
      >
        {/* Diagonal White X-lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none stroke-white/35"
          strokeWidth="1.5"
        >
          <line x1="0" y1="0" x2="100%" y2="100%" />
          <line x1="100%" y1="0" x2="0" y2="100%" />
        </svg>

        {/* Top-Left Slot ID Tag */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white font-mono text-[10px] font-bold tracking-wider pointer-events-none">
          #{slotId} • {aspect}
        </div>

        {/* Center Wireframe Info */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white font-mono p-2 select-none pointer-events-none">
          <span className="text-2xl sm:text-3xl font-black font-funnel leading-none tracking-tight text-white mb-1 shadow-sm">
            #{slotId}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold leading-tight text-white/90 uppercase tracking-wider">
            {type}
          </span>
          <span className="text-[9px] sm:text-[11px] font-medium tracking-tight text-white/75 mt-0.5">
            {resolution}
          </span>
        </div>
      </div>
    );
  }

  // 2. VIDEO SLOT (YouTube, Google Drive, or Direct Video)
  if (isVideo || embedUrl || directVideoUrl) {
    if (isPlayingInline) {
      if (embedUrl) {
        return (
          <div
            data-slot-id={slotId}
            className={`relative group bg-[#05050A] overflow-hidden border border-white/20 w-full ${aspectClass} ${className}`}
          >
            <iframe
              src={embedUrl}
              title={displayTitle}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Top-Right Expand Button to Lightbox */}
            <button
              onClick={handleOpenTheater}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white/90 hover:text-white transition-colors z-20 cursor-pointer shadow-lg backdrop-blur-sm"
              title="Expand to theater view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        );
      }
      if (directVideoUrl) {
        return (
          <div
            data-slot-id={slotId}
            className={`relative group bg-[#05050A] overflow-hidden border border-white/20 w-full ${aspectClass} ${className}`}
          >
            <video
              src={directVideoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Top-Right Expand Button to Lightbox */}
            <button
              onClick={handleOpenTheater}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white/90 hover:text-white transition-colors z-20 cursor-pointer shadow-lg backdrop-blur-sm"
              title="Expand to theater view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        );
      }
    }

    return (
      <div
        data-slot-id={slotId}
        onClick={() => {
          if (embedUrl || directVideoUrl) {
            handleStartPlay();
          } else {
            handleOpenTheater();
          }
        }}
        className={`relative group bg-[#0A1244] overflow-hidden cursor-pointer border border-white/20 hover:border-blue-400/80 transition-all duration-300 w-full ${aspectClass} ${className}`}
      >
        {/* Direct video preview frame if supported */}
        {directVideoUrl && !videoError ? (
          <video
            ref={videoRef}
            src={`${directVideoUrl}#t=3`}
            preload="auto"
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const vid = e.currentTarget;
              try {
                if (vid.duration && vid.duration > 3) {
                  vid.currentTime = 3;
                } else if (vid.duration && vid.duration > 1) {
                  vid.currentTime = 1;
                }
              } catch {}
            }}
            onSeeked={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}

        {/* Fallback image thumbnail or backdrop */}
        {(!videoLoaded || videoError || !directVideoUrl) &&
          (computedThumbnail ? (
            <img
              src={computedThumbnail}
              alt={displayTitle}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0c1854] via-[#07103d] to-[#040926]" />
          ))}

        {/* Top-Right Expand Button to Lightbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(url, displayTitle);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10 cursor-pointer shadow-md backdrop-blur-sm"
          title="Open Theater View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Center Play Icon with Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#253BFF] group-hover:bg-[#3B50FF] text-white flex items-center justify-center shadow-[0_0_28px_rgba(37,99,235,0.7)] group-hover:scale-110 group-hover:shadow-[0_0_36px_rgba(59,130,246,0.9)] transition-all duration-300">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white translate-x-0.5" />
          </div>
        </div>
      </div>
    );
  }

  // 3. IMAGE / LOGO SLOT
  return (
    <div
      data-slot-id={slotId}
      onClick={() => onOpen?.(url, displayTitle)}
      className={`relative group bg-[#253BFF] overflow-hidden cursor-pointer border border-white/20 w-full ${aspectClass} ${className}`}
    >
      <img
        src={url}
        alt={displayTitle}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
