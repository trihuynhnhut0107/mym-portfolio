import { DiaTextReveal } from "@/components/ui/dia-text-reveal"
import { motion } from "framer-motion"

interface ThumbnailItem {
  id: string
  title: string
  subtitle?: string
  image: string
  variant: "blue" | "red"
  tag?: string
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
    title: "ZEN CINE HIGHLIGHTS",
    subtitle: "FIFA eWorld Cup",
    image: "/logos/zen-tactics/4.jpg",
    variant: "blue",
    tag: "HIGHLIGHTS",
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
    title: "ZEN ESPORT SHOWDOWN",
    subtitle: "Official Tournament",
    image: "/images/zen-tactics/471552190_890431343172967_6818025960644762277_n.jpg",
    variant: "red",
    tag: "ESPORTS",
  },
]

function VideoCard({ item }: { item: ThumbnailItem }) {
  const isBlue = item.variant === "blue"

  return (
    <div
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
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border ${
            isBlue
              ? "bg-[#253BFF]/90 text-white border-white/50"
              : "bg-[#FF253B]/90 text-white border-white/50"
          }`}
        >
          <svg className="w-7 h-7 ml-0.5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
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
  speed = 35,
}: {
  items: ThumbnailItem[]
  direction?: "left" | "right"
  speed?: number
}) {
  return (
    <div className="flex w-full overflow-hidden select-none py-0 my-0">
      <motion.div
        className="flex items-center gap-0 shrink-0"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : "0%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {items.map((item, idx) => (
          <VideoCard key={`${item.id}-1-${idx}`} item={item} />
        ))}
        {items.map((item, idx) => (
          <VideoCard key={`${item.id}-2-${idx}`} item={item} />
        ))}
      </motion.div>
    </div>
  )
}

export function AestheticSection() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-between relative overflow-hidden py-12 sm:py-16 select-none bg-transparent">
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
        <MarqueeRow items={TOP_MARQUEE_ITEMS} direction="left" speed={40} />

        {/* Bottom Marquee Row (Moving Right) */}
        <MarqueeRow items={BOTTOM_MARQUEE_ITEMS} direction="right" speed={40} />
      </div>
    </section>
  )
}
