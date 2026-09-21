import { useState, useEffect } from "react"
import { DiaTextReveal } from "@/components/ui/dia-text-reveal"
import { X, Play } from "lucide-react"

interface ThumbnailItem {
  id: string
  channel: string
  title: string
  image: string
  variant: "blue" | "red"
  tag: "Player Analysis" | "Team Analysis" | "Match Analysis" | "Statistic Explanation"
  videoUrl?: string
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  )
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`
  }
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  )
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview?autoplay=1`
  }
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }
  return null
}

const TOP_MARQUEE_ITEMS: ThumbnailItem[] = [
  {
    id: "top-1",
    channel: "Zen Tactics",
    title: "Phân tích Wesley Fofana",
    image: "/images/creative-productions/1.jpg",
    videoUrl: "https://drive.google.com/file/d/1SKhGuYTC8dm0yZPU8bVfPDaWUMz7fG3K/preview",
    variant: "blue",
    tag: "Player Analysis",
  },
  {
    id: "top-2",
    channel: "HLV Online Classic",
    title: "Sự nghiệp của Andrea Pirlo",
    image: "/images/creative-productions/2.jpg",
    videoUrl: "https://drive.google.com/file/d/1VdTOBuRlUn5f2w0Sp2T-XgQh8Vu5vSgk/preview",
    variant: "red",
    tag: "Player Analysis",
  },
  {
    id: "top-3",
    channel: "Modern Football",
    title: "Giải mã Tỉ lệ kiểm soát bóng",
    image: "/images/creative-productions/3.jpg",
    videoUrl: "https://drive.google.com/file/d/1jqIFolqgIZrzUMhH9bXf0r6Vyp0eahsq/preview",
    variant: "blue",
    tag: "Statistic Explanation",
  },
  {
    id: "top-4",
    channel: "Cúp Học Xem Bóng",
    title: "Phân tích trận đấu PSG 6-0 Bayern",
    image: "/images/creative-productions/4.jpg",
    videoUrl: "https://drive.google.com/file/d/1PHPErYdcTQ7ooGXF8dW24AJKH_sKHv0s/preview",
    variant: "red",
    tag: "Match Analysis",
  },
  {
    id: "top-5",
    channel: "Modern Football",
    title: "Tài năng trẻ, Pedri & Musiala",
    image: "/images/creative-productions/5.jpg",
    videoUrl: "https://drive.google.com/file/d/1f3IzG5CmnkxUHxj_ZCQFOvCXjH7zAsfm/preview",
    variant: "blue",
    tag: "Player Analysis",
  },
]

const BOTTOM_MARQUEE_ITEMS: ThumbnailItem[] = [
  {
    id: "bot-6",
    channel: "HLV Online",
    title: "Phân tích Vua Tốc Độ, Gareth Bale",
    image: "/images/creative-productions/6.jpg",
    videoUrl: "https://drive.google.com/file/d/1NPRWzVfz5f4pCvO_GSvb3cYgNW9F4sRe/preview",
    variant: "red",
    tag: "Player Analysis",
  },
  {
    id: "bot-7",
    channel: "HLV Online Classic",
    title: "Phân tích Vũ công Samba, Neymar Jr",
    image: "/images/creative-productions/7.png",
    videoUrl: "https://drive.google.com/file/d/1lMB5y_su4-5KFFRWZ89bzNzARB7VbyFg/preview",
    variant: "blue",
    tag: "Player Analysis",
  },
  {
    id: "bot-8",
    channel: "Cúp Học Xem Bóng",
    title: "Phân tích Arsenal mùa giải 2025/26",
    image: "/images/creative-productions/8.png",
    videoUrl: "https://drive.google.com/file/d/1qjJYwUlp9rV2gYhNzY2XJpzsnJYq8kpb/preview",
    variant: "red",
    tag: "Team Analysis",
  },
  {
    id: "bot-9",
    channel: "HLV Online",
    title: "Phân tích Zlatan Ibrahimovic",
    image: "/images/creative-productions/9.jpg",
    videoUrl: "https://drive.google.com/file/d/14SbKluVSzpQRPW3xzfWjqPNeO95Tdmsi/preview",
    variant: "blue",
    tag: "Player Analysis",
  },
  {
    id: "bot-10",
    channel: "Cúp Học Xem Bóng",
    title: "Phân tích Dominik Szoboszlai",
    image: "/images/creative-productions/10.png",
    videoUrl: "https://drive.google.com/file/d/1TntmDoa42FBCx38aPPPd4TqX7004oigY/preview",
    variant: "red",
    tag: "Player Analysis",
  },
]

function VideoCard({
  item,
  onSelect,
}: {
  item: ThumbnailItem
  onSelect?: (item: ThumbnailItem) => void
}) {
  const isBlue = item.variant === "blue"

  return (
    <div
      onClick={() => onSelect?.(item)}
      style={{ aspectRatio: "16 / 9" }}
      className={`group relative aspect-[16/9] h-auto w-[320px] sm:w-[480px] md:w-[600px] lg:w-[720px] shrink-0 overflow-hidden border-r border-b border-white/10 transition-all duration-300 cursor-pointer ${
        isBlue
          ? "bg-[#253BFF]/10 hover:bg-[#253BFF]/20"
          : "bg-[#FF253B]/10 hover:bg-[#FF253B]/20"
      }`}
    >
      {/* Thumbnail Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

      {/* Blue / Red Container Badge Accent */}
      {item.tag && (
        <div
          className={`absolute top-4 right-4 px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md border text-white ${
            isBlue
              ? "bg-[#253BFF]/85 border-[#253BFF]"
              : "bg-[#FF253B]/85 border-[#FF253B]"
          }`}
        >
          {item.tag}
        </div>
      )}

      {/* Center Play Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border transition-transform duration-300 group-hover:scale-110 ${
            isBlue
              ? "bg-[#253BFF]/90 text-white border-white/50"
              : "bg-[#FF253B]/90 text-white border-white/50"
          }`}
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Content Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-left">
        <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
          {item.channel}
        </div>
        <h4 className="font-funnel text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-wide truncate">
          {item.title}
        </h4>
      </div>
    </div>
  )
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 40,
  isPaused = false,
  onSelectVideo,
}: {
  items: ThumbnailItem[]
  direction?: "left" | "right"
  speed?: number
  isPaused?: boolean
  onSelectVideo?: (item: ThumbnailItem) => void
}) {
  const animName = direction === "left" ? "aesthetic-marquee-left" : "aesthetic-marquee-right"

  return (
    <div className="flex w-full overflow-hidden select-none py-0 my-0 group/row">
      <div
        className="flex items-center gap-0 shrink-0 hover:[animation-play-state:paused]"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : undefined,
        }}
      >
        {items.map((item, idx) => (
          <VideoCard
            key={`${item.id}-1-${idx}`}
            item={item}
            onSelect={onSelectVideo}
          />
        ))}
        {items.map((item, idx) => (
          <VideoCard
            key={`${item.id}-2-${idx}`}
            item={item}
            onSelect={onSelectVideo}
          />
        ))}
      </div>
    </div>
  )
}

export function AestheticSection() {
  const [activeVideo, setActiveVideo] = useState<ThumbnailItem | null>(null);

  const handleOpenVideo = (item: ThumbnailItem) => {
    // Pause any other playing videos on the page
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });
    setActiveVideo(item);
  };

  const handleCloseVideo = () => {
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });
    setActiveVideo(null);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseVideo();
      }
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  const embedUrl = activeVideo?.videoUrl ? getVideoEmbedUrl(activeVideo.videoUrl) : null;

  return (
    <section
      id="aesthetic"
      className="w-full min-h-screen flex flex-col justify-between relative overflow-hidden py-12 sm:py-16 select-none bg-transparent"
    >
      <style>{`
        @keyframes aesthetic-marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes aesthetic-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>

      {/* Header Part */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 mb-6 sm:mb-8 flex flex-col items-start gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#253BFF]/10 border border-[#253BFF]/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#253BFF] animate-ping" />
          <span className="font-funnel text-xs font-semibold tracking-widest uppercase text-[#253BFF]">
            Featured Showcase
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-4">
          <DiaTextReveal
            text={["MYM's Aesthetic", "Creative Productions", "Tactics & Media"]}
            colors={["#253BFF", "#3A4FFF", "#FF253B", "#253BFF"]}
            textColor="var(--clr-primary)"
            repeat={true}
            repeatDelay={1.2}
            duration={1.8}
            className="font-funnel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-normal pr-2"
          />
        </div>
      </div>

      {/* Body Part: 2 Marquees Running in Opposite Directions (Seamless Adjacent Tiling) */}
      <div className="w-full flex flex-col gap-0 my-auto py-0">
        {/* Top Marquee Row (Moving Left) */}
        <MarqueeRow
          items={TOP_MARQUEE_ITEMS}
          direction="left"
          speed={40}
          isPaused={!!activeVideo}
          onSelectVideo={handleOpenVideo}
        />

        {/* Bottom Marquee Row (Moving Right) */}
        <MarqueeRow
          items={BOTTOM_MARQUEE_ITEMS}
          direction="right"
          speed={40}
          isPaused={!!activeVideo}
          onSelectVideo={handleOpenVideo}
        />
      </div>

      {/* Interactive Video Playback Modal (Stops Marquee on Play) */}
      {activeVideo && (
        <div
          onClick={handleCloseVideo}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0D0F18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                {activeVideo.tag && (
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-white ${
                      activeVideo.variant === "blue" ? "bg-[#253BFF]/40" : "bg-[#FF253B]/40"
                    }`}
                  >
                    {activeVideo.tag}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-white font-medium truncate max-w-[200px] sm:max-w-none">
                  {activeVideo.channel} • {activeVideo.title}
                </span>
              </div>
              <button
                onClick={handleCloseVideo}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Video Player */}
            <div className="p-2 sm:p-4 flex items-center justify-center bg-black/80">
              <div
                className="w-full aspect-[16/9] max-h-[75vh] rounded-lg overflow-hidden bg-black flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: activeVideo.image ? `url(${activeVideo.image})` : undefined,
                }}
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : activeVideo.videoUrl ? (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={activeVideo.image}
                    alt={activeVideo.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
