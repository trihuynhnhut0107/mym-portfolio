import { useState, useEffect } from "react"
import { DiaTextReveal } from "@/components/ui/dia-text-reveal"
import { X, Play } from "lucide-react"

interface ThumbnailItem {
  id: string
  title: string
  subtitle?: string
  image: string
  variant: "blue" | "red"
  tag?: string
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
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`
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
    title: "KHÓ ĐUA VÔ ĐỊCH",
    subtitle: "Zen Tactics • Chelsea",
    image: "/logos/zen-tactics/1.jpg",
    variant: "blue",
    tag: "PRE-SEASON",
  },
  {
    id: "top-2",
    title: "SA BÀN NÀO!!!",
    subtitle: "Arsenal vs Liverpool 3-2",
    image: "/logos/zen-tactics/3.jpg",
    variant: "red",
    tag: "MATCHDAY",
  },
  {
    id: "top-3",
    title: "HẠ MÀN PREMIER LEAGUE",
    subtitle: "Modern Football Analysis",
    image: "/images/modern-football/1.jpg",
    variant: "blue",
    tag: "ANALYSIS",
  },
  {
    id: "top-4",
    title: "CHIẾN THUẬT DUO",
    subtitle: "HLV Onlive Classic",
    image: "/images/zen-tactics/471149121_885377707011664_4241553800759395865_n.jpg",
    variant: "red",
    tag: "LIVE",
  },
  {
    id: "top-5",
    title: "CUP HỌC XEM BÓNG",
    subtitle: "Tập 1: Khởi Đầu Mới",
    image: "/images/cup-hoc-xem-bong/Alexander_Isak_Liam_Delap_Woltermade_Liverpool_Chelsea_Newcastle.png",
    videoUrl: "https://www.youtube.com/watch?v=mSsx4nwU9Kw",
    variant: "blue",
    tag: "EPISODE",
  },
]

const BOTTOM_MARQUEE_ITEMS: ThumbnailItem[] = [
  {
    id: "bot-1",
    title: "SA BÀN NÀO!!!",
    subtitle: "Tactics Analysis 3-2",
    image: "/logos/zen-tactics/3.jpg",
    variant: "red",
    tag: "SPECIAL",
  },
  {
    id: "bot-2",
    title: "HẠ MÀN PREMIER LEAGUE",
    subtitle: "Champion Edition",
    image: "/images/modern-football/2.jpg",
    variant: "blue",
    tag: "CHAMPION",
  },
  {
    id: "bot-3",
    title: "KHÓ ĐUA VÔ ĐỊCH",
    subtitle: "Chelsea vs City",
    image: "/logos/zen-tactics/1.jpg",
    variant: "red",
    tag: "TACTICS",
  },
  {
    id: "bot-4",
    title: "MODERN FOOTBALL 2026",
    subtitle: "Tactics Duo Review",
    image: "/images/modern-football/4.jpg",
    variant: "blue",
    tag: "NEW",
  },
  {
    id: "bot-5",
    title: "CUP HỌC HIGHLIGHTS",
    subtitle: "Shorts Edition",
    image: "/images/cup-hoc-xem-bong/6a.png",
    videoUrl: "https://www.youtube.com/shorts/LEgSRAPu1V4",
    variant: "red",
    tag: "SHORTS",
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
          className={`absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase backdrop-blur-md border text-white ${
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
        {item.subtitle && (
          <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">
            {item.subtitle}
          </div>
        )}
        <h4 className="font-funnel text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-wide truncate">
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
  const [activeVideo, setActiveVideo] = useState<ThumbnailItem | null>(null)

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null)
      }
    }
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeVideo])

  const embedUrl = activeVideo?.videoUrl ? getVideoEmbedUrl(activeVideo.videoUrl) : null

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
          onSelectVideo={(item) => setActiveVideo(item)}
        />

        {/* Bottom Marquee Row (Moving Right) */}
        <MarqueeRow
          items={BOTTOM_MARQUEE_ITEMS}
          direction="right"
          speed={40}
          isPaused={!!activeVideo}
          onSelectVideo={(item) => setActiveVideo(item)}
        />
      </div>

      {/* Interactive Video Playback Modal (Stops Marquee on Play) */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
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
                  {activeVideo.title} {activeVideo.subtitle && `• ${activeVideo.subtitle}`}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Video Player */}
            <div className="p-2 sm:p-4 flex items-center justify-center bg-black/80">
              <div className="w-full aspect-[16/9] max-h-[75vh] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
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
