import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Radio,
} from "lucide-react";
import {
  SKILLS_MODAL_DATA,
  type SkillSlotItem,
  type SkillModalData,
} from "@/data/skillsModalData";
import { UxUiDesignerView } from "./UxUiDesignerView";

interface SkillDetailModalProps {
  isOpen?: boolean;
  skillId: string;
  onClose: () => void;
  onSelectSkill: (skillId: string) => void;
  servicesList: Array<{ id: string; title: string }>;
}

interface ActiveMediaItem {
  title: string;
  type: "image" | "video" | "youtube";
  src: string;
  youtubeId?: string;
  aspectRatio?: string;
}

function getVideoEmbedUrl(url?: string, youtubeId?: string): string | null {
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (!url) return null;

  // 1. YouTube
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  // 2. Google Drive Video Preview
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  );
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview?autoplay=1`;
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  if (url.includes("/preview") || url.includes("/embed/")) {
    return url;
  }

  return null;
}

function getVideoThumbnail(url?: string, youtubeId?: string): string | null {
  if (youtubeId) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  if (!url) return null;

  // 1. YouTube
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 2. Google Drive
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  );
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}=w1920-h1080`;
  }

  return null;
}

interface MediaSkillSlotProps {
  id: number;
  skillId: string;
  title?: string;
  aspectClass?: string;
  className?: string;
  onOpenMedia?: (media: ActiveMediaItem) => void;
}

/**
 * High-performance Media Slot:
 * - 0% video decoding overhead in the grid (videos play on demand in the Lightbox).
 * - Instant GPU-accelerated CSS rendering.
 * - Async off-thread image decoding.
 */
export const MediaSkillSlot = memo(function MediaSkillSlot({
  id,
  skillId,
  title,
  aspectClass = "aspect-[16/9]",
  className = "",
  onOpenMedia,
}: MediaSkillSlotProps) {
  const currentSkill = SKILLS_MODAL_DATA[skillId];
  const slotData: SkillSlotItem | undefined = currentSkill?.slots?.[id];
  const itemTitle = slotData?.title || title || `Slot ${id}`;
  const isOngoing =
    slotData?.isOngoing || (skillId === "srv-content" && id === 12);

  // 1. CASE: ON GOING (Production Styled Badge)
  if (isOngoing) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#0c1a60]/90 via-[#071142]/95 to-[#030926] border border-blue-400/35 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none shadow-[0_0_24px_rgba(37,99,235,0.18)] ${aspectClass} ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-funnel text-xs font-bold uppercase tracking-wider">
              On going
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-white/90 font-funnel text-sm sm:text-base font-bold tracking-tight">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{itemTitle}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/60 font-roboto mt-0.5">
              Production in active progress
            </p>
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      </div>
    );
  }

  // 2. CASE: GRAPHIC DESIGNER IMAGE SLOT
  if (skillId === "srv-graphic") {
    const imgNumber = id <= 51 ? id : 51;
    const imgSrc = `/images/graphic-designer/${imgNumber}.png`;

    return (
      <div
        onClick={() =>
          onOpenMedia?.({
            title: itemTitle,
            type: "image",
            src: imgSrc,
          })
        }
        className={`group relative overflow-hidden bg-[#0A1244] flex items-center justify-center cursor-pointer transition-all duration-300 border border-white/15 hover:border-blue-400/70 ${aspectClass} ${className}`}
      >
        <img
          src={imgSrc}
          alt={itemTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  // 3. CASE: CINEMATIC VIDEO EDITOR (All 18 Slots)
  if (skillId === "srv-video") {
    const videoSrc = slotData?.mediaUrl || "";
    const thumbUrl = slotData?.thumbnailUrl || `/images/cinematic-video-editor/${id}.jpg`;

    return (
      <div
        onClick={() =>
          onOpenMedia?.({
            title: itemTitle,
            type: "video",
            src: videoSrc,
            youtubeId: slotData?.youtubeId,
            aspectRatio: slotData?.aspectRatio,
          })
        }
        className={`group relative overflow-hidden bg-[#0A1244] flex items-center justify-center cursor-pointer border border-white/15 hover:border-blue-400/80 transition-colors duration-200 ${aspectClass} ${className}`}
      >
        <img
          src={thumbUrl}
          alt={itemTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors pointer-events-none" />

        {/* Center Play Icon: visible with glow, expands slightly on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#253BFF]/90 group-hover:bg-[#253BFF] text-white flex items-center justify-center shadow-[0_0_24px_rgba(37,99,235,0.65)] group-hover:scale-105 transition-transform duration-200">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
          </div>
        </div>
      </div>
    );
  }

  // 4. CASE: YOUTUBE EMBED OR LIVESTREAM SLOT
  if (slotData?.youtubeId || skillId === "srv-livestream") {
    const ytId = slotData?.youtubeId || "";
    const ytThumb = slotData?.thumbnailUrl || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

    return (
      <div
        onClick={() =>
          onOpenMedia?.({
            title: itemTitle,
            type: "youtube",
            src: slotData?.mediaUrl || `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
            youtubeId: ytId,
          })
        }
        className={`group relative overflow-hidden bg-[#050C2A] flex items-center justify-center cursor-pointer transition-all duration-300 border border-white/15 hover:border-red-500/70 ${aspectClass} ${className}`}
      >
        <img
          src={ytThumb}
          alt={itemTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {skillId === "srv-livestream" && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 border border-white/20 text-white text-[10px] font-bold pointer-events-none">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
          </div>
        </div>
      </div>
    );
  }

  // 5. CASE: CONTENT CREATOR VIDEO SLOT
  const contentVideoSrc = slotData?.mediaUrl || "";
  const contentThumb = slotData?.thumbnailUrl || `/images/content-creator/${id}.jpg`;

  return (
    <div
      onClick={() =>
        onOpenMedia?.({
          title: itemTitle,
          type: "video",
          src: contentVideoSrc,
          youtubeId: slotData?.youtubeId,
          aspectRatio: slotData?.aspectRatio,
        })
      }
      className={`group relative overflow-hidden bg-[#0A1244] flex items-center justify-center cursor-pointer transition-all duration-300 border border-white/15 hover:border-blue-400/80 ${aspectClass} ${className}`}
    >
      <img
        src={contentThumb}
        alt={itemTitle}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Ambient Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors pointer-events-none" />

      {/* Center Play Icon with Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#253BFF] group-hover:bg-[#3B50FF] text-white flex items-center justify-center shadow-[0_0_24px_rgba(37,99,235,0.6)] group-hover:scale-110 group-hover:shadow-[0_0_32px_rgba(59,130,246,0.85)] transition-all duration-300">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// SUB-VIEW 1: CONTENT CREATOR (16 Slots)
// =============================================================================
interface SkillViewProps {
  onOpenMedia: (media: ActiveMediaItem) => void;
  skillData: SkillModalData;
}

const ContentCreatorView = memo(function ContentCreatorView({
  onOpenMedia,
  skillData,
}: SkillViewProps) {
  const skillId = "srv-content";
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* SECTION 1: Football In-depth Analysis (Slots 1 to 5) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section1.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section1.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          {/* Top Row: Slots 1 & 2 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 border-b border-white/20">
            <MediaSkillSlot
              id={1}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.2/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={2}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.2/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          {/* Bottom Row: Slots 3, 4, 5 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3">
            <MediaSkillSlot
              id={3}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={4}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={5}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Documentary (Slots 6, 7, 8) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section2.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section2.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          <div className="w-full border-b border-white/20">
            <MediaSkillSlot
              id={6}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.3/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2">
            <MediaSkillSlot
              id={7}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={8}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: Dual Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              {skillData.section3.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              {skillData.section3.description}
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-row items-stretch min-h-[340px] sm:min-h-[380px] bg-white/[0.03]">
            <div className="w-1/2 border-r border-white/20 flex">
              <MediaSkillSlot
                id={9}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex-1 border-b border-white/20 flex">
                <MediaSkillSlot
                  id={10}
                  skillId={skillId}
                  aspectClass="h-full w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
              <div className="flex-1 flex">
                <MediaSkillSlot
                  id={11}
                  skillId={skillId}
                  aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                  onOpenMedia={onOpenMedia}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              {skillData.section4.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              {skillData.section4.description}
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-col min-h-[340px] sm:min-h-[380px] bg-white/[0.03]">
            <div className="w-full border-b border-white/20 flex-1 flex">
              <MediaSkillSlot
                id={12}
                skillId={skillId}
                aspectClass="h-full w-full min-h-[160px]"
                onOpenMedia={onOpenMedia}
              />
            </div>

            <div className="w-full grid grid-cols-4 flex-1">
              <MediaSkillSlot
                id={13}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/5] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={14}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/5] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={15}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/5] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={16}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/5] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// SUB-VIEW 2: GRAPHIC DESIGNER (51 Slots)
// =============================================================================
const GraphicDesignerView = memo(function GraphicDesignerView({
  onOpenMedia,
  skillData,
}: SkillViewProps) {
  const skillId = "srv-graphic";
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* 1. BRAND IDENTITY SECTION */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section1.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section1.description}
          </p>
        </div>

        {/* Brand Block A: Tranquille (Slots 1 to 6) */}
        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row bg-white/[0.03]">
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-white/20">
            <div className="grid grid-cols-2 border-b border-white/20">
              <MediaSkillSlot
                id={1}
                skillId={skillId}
                aspectClass="aspect-square sm:aspect-[4/3]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={2}
                skillId={skillId}
                aspectClass="aspect-square sm:aspect-[4/3]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-3">
              <MediaSkillSlot
                id={3}
                skillId={skillId}
                aspectClass="aspect-square"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={4}
                skillId={skillId}
                aspectClass="aspect-square"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={5}
                skillId={skillId}
                aspectClass="aspect-square"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex">
            <MediaSkillSlot
              id={6}
              skillId={skillId}
              aspectClass="h-full w-full aspect-[4/3] sm:aspect-auto"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>

        {/* Brand Block B: Escape in Time (Slots 7 to 10) */}
        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row bg-white/[0.03]">
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-white/20">
            <div className="grid grid-cols-3 border-b border-white/20">
              <MediaSkillSlot
                id={7}
                skillId={skillId}
                aspectClass="aspect-[4/3]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={8}
                skillId={skillId}
                aspectClass="aspect-[4/3]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={9}
                skillId={skillId}
                aspectClass="aspect-[4/3]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="flex-1 flex">
              <MediaSkillSlot
                id={10}
                skillId={skillId}
                aspectClass="h-full w-full min-h-[220px]"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
          {/* Right half: Konoha Ramen (Slots 11 to 17) */}
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 grid grid-cols-3 sm:flex sm:flex-col border-b sm:border-b-0 sm:border-r border-white/20">
              <MediaSkillSlot
                id={11}
                skillId={skillId}
                aspectClass="flex-1 w-full border-r sm:border-r-0 border-b-0 sm:border-b border-white/20 aspect-square sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={12}
                skillId={skillId}
                aspectClass="flex-1 w-full border-r sm:border-r-0 border-b-0 sm:border-b border-white/20 aspect-square sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={13}
                skillId={skillId}
                aspectClass="flex-1 w-full aspect-square sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="w-full sm:w-2/3 flex flex-col">
              <div className="flex-[2] flex flex-row border-b border-white/20 min-h-[200px] sm:min-h-0">
                <div className="w-1/3 border-r border-white/20 flex">
                  <MediaSkillSlot
                    id={14}
                    skillId={skillId}
                    aspectClass="h-full w-full"
                    onOpenMedia={onOpenMedia}
                  />
                </div>
                <div className="w-2/3 flex flex-col min-h-0">
                  <MediaSkillSlot
                    id={15}
                    skillId={skillId}
                    aspectClass="flex-1 w-full border-b border-white/20"
                    onOpenMedia={onOpenMedia}
                  />
                  <MediaSkillSlot
                    id={16}
                    skillId={skillId}
                    aspectClass="flex-1 w-full"
                    onOpenMedia={onOpenMedia}
                  />
                </div>
              </div>
              <div className="flex-1 flex min-h-[100px] sm:min-h-0">
                <MediaSkillSlot
                  id={17}
                  skillId={skillId}
                  aspectClass="h-full w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Block C: Sana Capital (Slots 18 to 21) */}
        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col sm:flex-row bg-white/[0.03] min-h-[140px] md:min-h-[160px]">
          <div className="w-full sm:w-[15%] border-b sm:border-b-0 sm:border-r border-white/20 flex">
            <MediaSkillSlot
              id={18}
              skillId={skillId}
              aspectClass="h-full w-full aspect-square sm:aspect-auto"
              onOpenMedia={onOpenMedia}
            />
          </div>
          <div className="w-full sm:w-[15%] border-b sm:border-b-0 sm:border-r border-white/20 flex">
            <MediaSkillSlot
              id={19}
              skillId={skillId}
              aspectClass="h-full w-full aspect-square sm:aspect-auto"
              onOpenMedia={onOpenMedia}
            />
          </div>
          <div className="w-full sm:w-[35%] border-b sm:border-b-0 sm:border-r border-white/20 flex">
            <MediaSkillSlot
              id={20}
              skillId={skillId}
              aspectClass="h-full w-full aspect-[2/1] sm:aspect-auto"
              onOpenMedia={onOpenMedia}
            />
          </div>
          <div className="w-full sm:w-[35%] flex">
            <MediaSkillSlot
              id={21}
              skillId={skillId}
              aspectClass="h-full w-full aspect-[2/1] sm:aspect-auto"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* 2. LOGO COLLECTION (Slots 22 to 28) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section2.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section2.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden bg-white/[0.03]">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
            <MediaSkillSlot
              id={22}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={23}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={24}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={25}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={26}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={27}
              skillId={skillId}
              aspectClass="aspect-square"
              className="border-r border-b md:border-b-0 border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={28}
              skillId={skillId}
              aspectClass="aspect-square"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA & YOUTUBE (Slots 29 to 41) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              Social Media Post & Banner Design
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              Multi-format static and carousel assets, fixtures, and
              announcements optimized for Instagram, Facebook, and Twitter.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
            <div className="grid grid-cols-3 border-b border-white/20">
              <MediaSkillSlot
                id={29}
                skillId={skillId}
                aspectClass="aspect-square"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={30}
                skillId={skillId}
                aspectClass="aspect-square"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={31}
                skillId={skillId}
                aspectClass="aspect-square"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="flex flex-row">
              <div className="w-2/3 border-r border-white/20 flex">
                <MediaSkillSlot
                  id={32}
                  skillId={skillId}
                  aspectClass="h-full w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
              <div className="w-1/3 flex flex-col">
                <MediaSkillSlot
                  id={33}
                  skillId={skillId}
                  aspectClass="flex-1 w-full border-b border-white/20"
                  onOpenMedia={onOpenMedia}
                />
                <MediaSkillSlot
                  id={34}
                  skillId={skillId}
                  aspectClass="flex-1 w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              YouTube Thumbnail Design
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              CTR-focused compositions with high visual contrast, dynamic
              cutouts, and emotive expressions driving click-throughs.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
            <div className="border-b border-white/20">
              <MediaSkillSlot
                id={35}
                skillId={skillId}
                aspectClass="aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-2 border-b border-white/20">
              <MediaSkillSlot
                id={36}
                skillId={skillId}
                aspectClass="aspect-[16/9]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={37}
                skillId={skillId}
                aspectClass="aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-4">
              <MediaSkillSlot
                id={38}
                skillId={skillId}
                aspectClass="aspect-[16/9] w-full"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={39}
                skillId={skillId}
                aspectClass="aspect-[16/9] w-full"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={40}
                skillId={skillId}
                aspectClass="aspect-[16/9] w-full"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={41}
                skillId={skillId}
                aspectClass="aspect-[16/9] w-full"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. LIVESTREAM & POWERPOINT (Slots 42 to 51) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              Livestream Template Design
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              Modular broadcast design including dynamic scene layouts, starting
              screens, webcam frames, and scorebugs.
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03] min-h-[340px]">
            <div className="w-full border-b border-white/20 flex-1 flex">
              <MediaSkillSlot
                id={42}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-2 flex-1">
              <MediaSkillSlot
                id={43}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[16/9]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={44}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              Powerpoint Template Design
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              Custom structured slide decks bridging complex data and clean
              aesthetics using branded layouts.
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03] min-h-[340px]">
            <div className="grid grid-cols-2 border-b border-white/20">
              <MediaSkillSlot
                id={45}
                skillId={skillId}
                aspectClass="aspect-[16/9]"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={46}
                skillId={skillId}
                aspectClass="aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="w-full border-b border-white/20 flex-1 flex">
              <MediaSkillSlot
                id={47}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[16/9]"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-4 flex-1">
              <MediaSkillSlot
                id={48}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/3] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={49}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/3] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={50}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/3] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={51}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[4/3] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// SUB-VIEW 3: CINEMATIC VIDEO EDITOR (18 Slots)
// =============================================================================
const CinematicVideoEditorView = memo(function CinematicVideoEditorView({
  onOpenMedia,
  skillData,
}: SkillViewProps) {
  const skillId = "srv-video";
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* SECTION 1: 2D Motion Graphic Video (Slots 1 to 6) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section1.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section1.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          {/* Row 1: Slot 1 (Large Feature) */}
          <div className="w-full border-b border-white/20">
            <MediaSkillSlot
              id={1}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.3/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          {/* Row 2: Slots 2 & 3 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 border-b border-white/20">
            <MediaSkillSlot
              id={2}
              skillId={skillId}
              aspectClass="aspect-[16/9]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={3}
              skillId={skillId}
              aspectClass="aspect-[16/9]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          {/* Row 3: Slots 4, 5, 6 (Vertical Portals) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3">
            <MediaSkillSlot
              id={4}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[4/5]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={5}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[4/5]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={6}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[4/5]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Long-form Documentary Video (Slots 7, 8, 9) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section2.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section2.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          {/* Row 1: Slot 7 (Large Feature) */}
          <div className="w-full border-b border-white/20">
            <MediaSkillSlot
              id={7}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.3/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          {/* Row 2: Slots 8 & 9 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2">
            <MediaSkillSlot
              id={8}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={9}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: Dual Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              {skillData.section3.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              {skillData.section3.description}
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-row items-stretch min-h-[340px] sm:min-h-[380px] bg-white/[0.03]">
            <div className="w-1/2 border-r border-white/20 flex">
              <MediaSkillSlot
                id={10}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex-1 border-b border-white/20 flex">
                <MediaSkillSlot
                  id={11}
                  skillId={skillId}
                  aspectClass="h-full w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
              <div className="flex-1 flex">
                <MediaSkillSlot
                  id={12}
                  skillId={skillId}
                  aspectClass="h-full w-full"
                  onOpenMedia={onOpenMedia}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 min-h-[60px]">
            <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white">
              {skillData.section4.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed text-justify-center">
              {skillData.section4.description}
            </p>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-white/20 overflow-hidden flex flex-col min-h-[340px] sm:min-h-[380px] bg-white/[0.03]">
            <div className="grid grid-cols-3 border-b border-white/20 flex-1">
              <MediaSkillSlot
                id={13}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={14}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={15}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
            <div className="grid grid-cols-3 flex-1">
              <MediaSkillSlot
                id={16}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={17}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                className="border-r border-white/20"
                onOpenMedia={onOpenMedia}
              />
              <MediaSkillSlot
                id={18}
                skillId={skillId}
                aspectClass="h-full w-full aspect-[9/16] sm:aspect-auto"
                onOpenMedia={onOpenMedia}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// SUB-VIEW 4: LIVESTREAM PRODUCTION (8 Slots)
// =============================================================================
const LivestreamProductionView = memo(function LivestreamProductionView({
  onOpenMedia,
  skillData,
}: SkillViewProps) {
  const skillId = "srv-livestream";
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* SECTION 1: Broadcast Infrastructure & Multi-Cam (Slots 1 to 5) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section1.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section1.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 border-b border-white/20">
            <MediaSkillSlot
              id={1}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.2/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={2}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.2/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3">
            <MediaSkillSlot
              id={3}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={4}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={5}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[1.5/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Major Championship Live Broadcasts (Slots 6, 7, 8) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-6">
          <h3 className="font-funnel text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            {skillData.section2.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 font-roboto leading-relaxed md:max-w-2xl text-justify-center">
            {skillData.section2.description}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/20 overflow-hidden flex flex-col bg-white/[0.03]">
          <div className="w-full border-b border-white/20">
            <MediaSkillSlot
              id={6}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2.3/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2">
            <MediaSkillSlot
              id={7}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              className="border-b sm:border-b-0 sm:border-r border-white/20"
              onOpenMedia={onOpenMedia}
            />
            <MediaSkillSlot
              id={8}
              skillId={skillId}
              aspectClass="aspect-[16/9] sm:aspect-[2/1]"
              onOpenMedia={onOpenMedia}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

// Helper for tab circular offset calculation
function getCircularDiff(
  index: number,
  current: number,
  total: number,
): number {
  let diff = (index - current) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

// =============================================================================
// MAIN COMPONENT: SkillDetailModal
// =============================================================================
export function SkillDetailModal({
  skillId,
  onClose,
  onSelectSkill,
  servicesList,
}: SkillDetailModalProps) {
  const [tabOffset, setTabOffset] = useState<number>(200);
  const [activeMedia, setActiveMedia] = useState<ActiveMediaItem | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Responsive tab spacing calculation with guard to prevent redundant renders
  useEffect(() => {
    const updateOffset = () => {
      const next = window.innerWidth < 640 ? 140 : 210;
      setTabOffset((prev) => (prev !== next ? next : prev));
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const currentIndex = useMemo(
    () => servicesList.findIndex((s) => s.id === skillId),
    [servicesList, skillId],
  );
  const prevIndex =
    (currentIndex - 1 + servicesList.length) % servicesList.length;
  const nextIndex = (currentIndex + 1) % servicesList.length;

  const prevSkill = useMemo(
    () => servicesList[prevIndex] || servicesList[0],
    [servicesList, prevIndex],
  );
  const nextSkill = useMemo(
    () => servicesList[nextIndex] || servicesList[0],
    [servicesList, nextIndex],
  );

  const handleSelectSkill = useCallback(
    (newId: string) => {
      onSelectSkill(newId);
    },
    [onSelectSkill],
  );

  const handleOpenMedia = useCallback((media: ActiveMediaItem) => {
    // Pause any other playing videos on the page
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });
    setActiveMedia(media);
  }, []);

  const handleCloseLightbox = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Pause any modal videos before closing
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });
    setActiveMedia(null);
  }, []);

  // Reset scroll to top when changing skill
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [skillId]);

  // Keep references for keyboard listener to prevent re-attaching & body overflow thrashing
  const activeMediaRef = useRef(activeMedia);
  activeMediaRef.current = activeMedia;

  const prevSkillRef = useRef(prevSkill);
  prevSkillRef.current = prevSkill;

  const nextSkillRef = useRef(nextSkill);
  nextSkillRef.current = nextSkill;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onSelectSkillRef = useRef(onSelectSkill);
  onSelectSkillRef.current = onSelectSkill;

  // Body scroll lock (runs strictly on mount/unmount)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation (attached once on mount)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeMediaRef.current) {
          setActiveMedia(null);
        } else {
          onCloseRef.current();
        }
      } else if (
        !activeMediaRef.current &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight")
      ) {
        const skill =
          e.key === "ArrowLeft" ? prevSkillRef.current : nextSkillRef.current;
        if (skill) onSelectSkillRef.current(skill.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diffX > 45 && prevSkillRef.current) {
      onSelectSkillRef.current(prevSkillRef.current.id);
    } else if (diffX < -45 && nextSkillRef.current) {
      onSelectSkillRef.current(nextSkillRef.current.id);
    }
    touchStartXRef.current = null;
  }, []);

  const currentSkillData = useMemo(() => {
    return (
      SKILLS_MODAL_DATA[skillId || ""] || {
        id: skillId || "",
        title:
          servicesList.find((s) => s.id === skillId)?.title || "Skill Detail",
        prevSkillId: "srv-livestream",
        nextSkillId: "srv-graphic",
        section1: { title: "Overview", description: "" },
        section2: { title: "Features", description: "" },
        section3: { title: "Production", description: "" },
        section4: { title: "Showcase", description: "" },
      }
    );
  }, [skillId, servicesList]);

  return (
    <motion.div
      key="skill-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#02051E]/95 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
    >
      <motion.div
        key="skill-modal-dialog"
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-[92vh] max-h-[92vh] flex flex-col bg-gradient-to-b from-[#091560] via-[#060F45] to-[#040A2C] border border-white/20 rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden text-white"
      >
        {/* 1. FIXED TOP BAR (Pinned Header) */}
        <div className="relative shrink-0 w-full px-5 sm:px-8 py-3.5 sm:py-4 border-b border-white/15 bg-[#081358] flex items-center justify-between gap-4 z-30">
          {/* Close Button (Top Left) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="relative z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </button>

          {/* Centered Skill Switcher Tabs */}
          <div
            className="relative flex-1 max-w-2xl mx-auto h-12 flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Smooth Edge Fades without expensive CSS mask-image */}
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#081358] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#081358] to-transparent pointer-events-none z-10" />

            {servicesList.map((service, index) => {
              const diff = getCircularDiff(
                index,
                currentIndex,
                servicesList.length,
              );
              const isActive = diff === 0;
              const isAdjacent = Math.abs(diff) === 1;
              const isVisible = Math.abs(diff) <= 1;
              const xPos = diff * tabOffset;

              return (
                <div
                  key={service.id}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isActive) {
                        handleSelectSkill(service.id);
                      }
                    }}
                    initial={false}
                    animate={{
                      x: xPos,
                      opacity: isActive ? 1 : isAdjacent ? 0.45 : 0,
                      scale: isActive ? 1 : isAdjacent ? 0.88 : 0.72,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    style={{
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                    className={`relative group whitespace-nowrap text-center py-1.5 px-4 rounded-full focus:outline-none select-none transition-opacity duration-200 ${
                      isActive
                        ? "cursor-default"
                        : "hover:opacity-80 cursor-pointer"
                    }`}
                    aria-label={service.title}
                  >
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/25 shadow-[0_0_16px_rgba(255,255,255,0.22)]"
                    />
                    <span
                      className={`relative z-10 font-funnel text-xs sm:text-sm font-bold tracking-tight block text-white transition-all duration-200 ${
                        isActive
                          ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                          : "opacity-80 max-w-[130px] sm:max-w-[170px] truncate"
                      }`}
                    >
                      {service.title}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Symmetrical Balancer for Top-Left Close Button */}
          <div className="w-9 sm:w-10 shrink-0 pointer-events-none" />
        </div>

        {/* 2. SCROLLABLE CONTENT BODY (Unloads immediately when switching tabs) */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-10 py-6 sm:py-10 custom-scrollbar"
        >
          {skillId === "srv-content" && (
            <ContentCreatorView
              onOpenMedia={handleOpenMedia}
              skillData={currentSkillData}
            />
          )}
          {skillId === "srv-graphic" && (
            <GraphicDesignerView
              onOpenMedia={handleOpenMedia}
              skillData={currentSkillData}
            />
          )}
          {skillId === "srv-video" && (
            <CinematicVideoEditorView
              onOpenMedia={handleOpenMedia}
              skillData={currentSkillData}
            />
          )}
          {skillId === "srv-uxui" && <UxUiDesignerView />}
          {skillId === "srv-livestream" && (
            <LivestreamProductionView
              onOpenMedia={handleOpenMedia}
              skillData={currentSkillData}
            />
          )}
        </div>

        {/* 3. FIXED BOTTOM BAR (Pinned Footer Navigation) */}
        <div className="shrink-0 w-full px-5 sm:px-8 py-3.5 sm:py-4 border-t border-white/15 bg-[#050C38] flex items-center justify-between z-20">
          <button
            onClick={() => handleSelectSkill(prevSkill.id)}
            className="flex items-center gap-2 text-xs sm:text-sm font-funnel font-semibold text-white/70 hover:text-white transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{prevSkill.title}</span>
          </button>

          <button
            onClick={() => handleSelectSkill(nextSkill.id)}
            className="flex items-center gap-2 text-xs sm:text-sm font-funnel font-semibold text-blue-400 hover:text-blue-300 transition-all hover:translate-x-1 cursor-pointer"
          >
            <span>{nextSkill.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 4. LIGHTBOX / FULLSCREEN MEDIA PLAYER MODAL */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 z-[60] bg-black/92 flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              key="lightbox-dialog"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl flex flex-col bg-[#050B28] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white"
            >
              {/* Modal Header */}
              <div className="shrink-0 px-5 py-3.5 border-b border-white/15 flex items-center justify-between bg-white/5">
                <span className="font-funnel text-sm sm:text-base font-bold text-white/95 truncate">
                  {activeMedia.title}
                </span>
                <button
                  onClick={handleCloseLightbox}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-3 sm:p-6 flex items-center justify-center bg-black/70">
                {activeMedia.type === "image" && (
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.title}
                    className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-xl"
                  />
                )}

                {(activeMedia.type === "video" || activeMedia.type === "youtube") && (() => {
                  const embedUrl = getVideoEmbedUrl(activeMedia.src, activeMedia.youtubeId);
                  const thumb = getVideoThumbnail(activeMedia.src, activeMedia.youtubeId);
                  return (
                    <div
                      className={`w-full ${
                        activeMedia.aspectRatio === "9/16"
                          ? "max-w-sm aspect-[9/16]"
                          : "aspect-[16/9] max-h-[75vh]"
                      } flex items-center justify-center bg-black rounded-lg overflow-hidden bg-cover bg-center`}
                      style={{
                        backgroundImage: thumb ? `url(${thumb})` : undefined,
                      }}
                    >
                      {embedUrl ? (
                        <iframe
                          src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                          title={activeMedia.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={activeMedia.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
