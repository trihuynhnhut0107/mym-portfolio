import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROJECTS_DETAIL_DATA } from "@/data/projectsData";
import type { ProjectDetail } from "@/data/projectsData";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/modules/footer";
import {
  Layout23Slots,
  Layout12Slots,
  Layout13Slots,
  Layout17Slots,
  LayoutQuaBongCuoiNemNgon,
  getVideoEmbedUrl,
  getVideoThumbnail,
} from "./layouts";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const currentId =
    projectId && PROJECTS_DETAIL_DATA[projectId] ? projectId : "zen-tactics";
  const project: ProjectDetail = PROJECTS_DETAIL_DATA[currentId];

  const [playingSlotId, setPlayingSlotId] = useState<number | null>(null);

  const [activeMedia, setActiveMedia] = useState<{
    url: string;
    type: "image" | "video";
    title: string;
  } | null>(null);

  const handleBack = () => {
    navigate(`/#project-${currentId}`, {
      state: { scrollToProject: currentId, scrollToProjects: true },
    });
  };

  const handleOpenMedia = (url: string, title: string) => {
    // 1. Immediately stop any inline playing video/iframe
    setPlayingSlotId(null);

    // 2. Pause all HTML5 video elements in document to prevent overlap
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });

    const isVid =
      title.toLowerCase().includes("video") ||
      Boolean(getVideoEmbedUrl(url)) ||
      /\.(?:mp4|webm|mov)$/i.test(url);
    setActiveMedia({
      url,
      type: isVid ? "video" : "image",
      title,
    });
  };

  const handleCloseMedia = () => {
    // Pause any modal videos before closing
    const allVideos = document.querySelectorAll<HTMLVideoElement>("video");
    allVideos.forEach((vid) => {
      if (!vid.paused) {
        vid.pause();
      }
    });
    setActiveMedia(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F7FD] text-[#05050A] flex flex-col font-sans select-none">
      {/* 1. TOP HEADER BAR */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full bg-[#05050A] text-white py-3 sm:py-4 px-4 sm:px-12 flex items-center justify-between shadow-lg border-b border-white/10"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-[#253BFF] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/50">
            <span
              onClick={handleBack}
              className="hover:text-white transition-colors cursor-pointer"
            >
              MYM's Projects
            </span>
            <span>/</span>
            <span className="text-[#253BFF] font-semibold">{project.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#253BFF]/20 text-[#253BFF] border border-[#253BFF]/40 text-[10px] sm:text-xs font-funnel font-semibold">
            {project.year}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-funnel font-semibold">
            {project.tag}
          </span>
        </div>
      </motion.header>

      {/* 2. PROJECT HERO & DESCRIPTION SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-12 pt-8 sm:pt-16 pb-8 flex flex-col gap-8 sm:gap-12">
        {/* Title & 2-Column Text Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Title Column */}
          <div className="lg:col-span-5 flex flex-col gap-1 sm:gap-2">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#253BFF]"
            >
              Project
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#253BFF] font-funnel"
            >
              {project.title}
            </motion.h1>
          </div>

          {/* Right 2-Column Paragraph Description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-[#05050A]/80 leading-relaxed font-sans"
          >
            <p className="border-l-2 border-[#253BFF]/30 pl-3 sm:pl-4">
              {project.description}
            </p>
            <p className="border-l-2 border-[#253BFF]/30 pl-3 sm:pl-4">
              {project.vision}
            </p>
          </motion.div>
        </div>

        {/* Node Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="w-full py-4 sm:py-8 flex items-center justify-between relative px-2 sm:px-12"
        >
          {/* Connecting Line */}
          <div className="absolute left-10 right-10 sm:left-16 sm:right-16 top-1/2 -translate-y-1/2 h-0.5 bg-[#253BFF]/30 z-0" />

          {project.statsNodes.map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-[#253BFF] text-white shadow-xl shadow-[#253BFF]/25 transition-transform duration-300 hover:scale-105"
            >
              <span className="text-base sm:text-xl md:text-2xl font-black font-funnel leading-none">
                {node.value}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-white/80 mt-0.5 sm:mt-1 text-center">
                {node.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. MEDIA GRID LAYOUT (MODULAR WIREFRAME-ACCURATE ZERO-GAP ALIGNMENT) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-12 pb-16 sm:pb-24 flex flex-col gap-0"
      >
        {(() => {
          switch (project.layoutType) {
            case 1:
              return (
                <Layout23Slots
                  project={project}
                  playingSlotId={playingSlotId}
                  onStartPlaySlot={setPlayingSlotId}
                  onOpenMedia={handleOpenMedia}
                />
              );
            case 2:
              return (
                <Layout12Slots
                  project={project}
                  playingSlotId={playingSlotId}
                  onStartPlaySlot={setPlayingSlotId}
                  onOpenMedia={handleOpenMedia}
                />
              );
            case 3:
              return (
                <Layout13Slots
                  project={project}
                  playingSlotId={playingSlotId}
                  onStartPlaySlot={setPlayingSlotId}
                  onOpenMedia={handleOpenMedia}
                />
              );
            case 4:
              return (
                <Layout17Slots
                  project={project}
                  playingSlotId={playingSlotId}
                  onStartPlaySlot={setPlayingSlotId}
                  onOpenMedia={handleOpenMedia}
                />
              );
            case 5:
              return (
                <LayoutQuaBongCuoiNemNgon
                  project={project}
                  playingSlotId={playingSlotId}
                  onStartPlaySlot={setPlayingSlotId}
                  onOpenMedia={handleOpenMedia}
                />
              );
            case 6:
            default:
              return (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.media?.map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        handleOpenMedia(m.src, `${project.title} - Showcase #${idx + 1}`)
                      }
                      className="relative group bg-[#0D0F18] border border-white/20 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:border-blue-400/60 transition-all"
                    >
                      <img
                        src={m.src}
                        alt={m.title || project.title}
                        className="w-full h-auto object-contain max-h-[70vh] transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              );
          }
        })()}
      </motion.section>

      {/* 4. FOOTER */}
      <Footer />

      {/* 5. INTERACTIVE MEDIA LIGHTBOX MODAL */}
      {activeMedia && (
        <div
          onClick={handleCloseMedia}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0D0F18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Lightbox Header */}
            <div className="p-3 sm:p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#253BFF] uppercase tracking-wider bg-[#253BFF]/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
                  {activeMedia.title}
                </span>
                <span className="text-xs sm:text-sm text-white/80 font-medium truncate max-w-[200px] sm:max-w-none">
                  {project.title}
                </span>
              </div>
              <button
                onClick={handleCloseMedia}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Lightbox Content */}
            <div className="p-3 sm:p-4 flex items-center justify-center min-h-[250px] max-h-[75vh] overflow-hidden bg-black/60">
              {getVideoEmbedUrl(activeMedia.url) ? (
                <div
                  className="w-full aspect-[16/9] max-h-[70vh] rounded-lg overflow-hidden bg-black bg-cover bg-center"
                  style={{
                    backgroundImage: getVideoThumbnail(activeMedia.url)
                      ? `url(${getVideoThumbnail(activeMedia.url)})`
                      : undefined,
                  }}
                >
                  <iframe
                    src={getVideoEmbedUrl(activeMedia.url, true)!}
                    title={activeMedia.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : activeMedia.type === "video" || /\.(?:mp4|webm|mov)$/i.test(activeMedia.url) ? (
                <div className="flex items-center justify-center max-h-[72vh] w-auto">
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[72vh] max-w-full rounded-lg shadow-2xl object-contain bg-black"
                  />
                </div>
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
