import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROJECTS_DETAIL_DATA } from "@/data/projectsData";
import type { ProjectDetail } from "@/data/projectsData";
import { ArrowLeft, Play, X, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface MediaSlotProps {
  url?: string;
  type: "Video" | "Logo" | "Image";
  resolution: "1920x1080" | "1000x1000" | "1080x1920";
  aspectClass: string;
  className?: string;
  onOpen?: (url: string, title: string) => void;
}

function MediaSlot({
  url,
  type,
  resolution,
  aspectClass,
  className = "",
  onOpen,
}: MediaSlotProps) {
  const isVideo = type === "Video";
  const title = `${type} ${resolution}`;

  if (!url) {
    // Blue Tile Wireframe Placeholder Box
    return (
      <div
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

        {/* Wireframe Label */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white font-mono p-2 select-none">
          <span className="text-xs sm:text-sm font-semibold leading-tight text-white/90">
            {type}
          </span>
          <span className="text-xs sm:text-sm font-extrabold tracking-tight leading-tight text-white">
            {resolution}
          </span>
        </div>
      </div>
    );
  }

  // Real Image / Video / Logo Display
  return (
    <div
      onClick={() => onOpen?.(url, title)}
      className={`relative group bg-[#253BFF] overflow-hidden cursor-pointer border border-white/20 w-full ${aspectClass} ${className}`}
    >
      <img
        src={url}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {isVideo ? (
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#253BFF] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-medium text-white/90 bg-black/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
            {title}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] sm:text-xs font-mono font-medium text-white bg-black/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const currentId =
    projectId && PROJECTS_DETAIL_DATA[projectId] ? projectId : "zen-tactics";
  const project: ProjectDetail = PROJECTS_DETAIL_DATA[currentId];

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
    const isVid = title.toLowerCase().includes("video");
    setActiveMedia({
      url,
      type: isVid ? "video" : "image",
      title,
    });
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

        {/* Node Stats Bar (3 Connected Circular Nodes) */}
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

      {/* 3. MEDIA GRID LAYOUT (RESPONSIVE ZERO-GAP MATHEMATICAL ASPECT RATIO ALIGNMENT) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-12 pb-16 sm:pb-24 flex flex-col gap-0"
      >
        {/* ROW 1: Video 1920x1080 (flex-[32]) + 2x Logo 1000x1000 Stack (flex-[9]) */}
        <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
          <div className="w-full md:w-auto md:flex-[32]">
            <MediaSlot
              url={project.videos[0]}
              type="Video"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
          </div>
          <div className="w-full md:w-auto md:flex-[9] flex flex-row md:flex-col gap-0">
            <MediaSlot
              url={project.logos[0]}
              type="Logo"
              resolution="1000x1000"
              aspectClass="aspect-square"
              onOpen={handleOpenMedia}
            />
            <MediaSlot
              url={project.logos[1]}
              type="Logo"
              resolution="1000x1000"
              aspectClass="aspect-square"
              onOpen={handleOpenMedia}
            />
          </div>
        </div>

        {/* ROW 2: 3x Image 1920x1080 (Row of 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          <MediaSlot
            url={project.horizontalImages[0]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[1]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[2]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
        </div>

        {/* ROW 3: 2x Video 1080x1920 (flex-[162]) + Image 1920x1080 (flex-[256]) */}
        <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
          <div className="w-full md:w-auto md:flex-[162] grid grid-cols-2 gap-0">
            <MediaSlot
              url={project.verticalImages[0]}
              type="Video"
              resolution="1080x1920"
              aspectClass="aspect-[9/16]"
              onOpen={handleOpenMedia}
            />
            <MediaSlot
              url={project.verticalImages[1]}
              type="Video"
              resolution="1080x1920"
              aspectClass="aspect-[9/16]"
              onOpen={handleOpenMedia}
            />
          </div>
          <div className="w-full md:w-auto md:flex-[256]">
            <MediaSlot
              url={project.horizontalImages[3]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
          </div>
        </div>

        {/* ROW 4: Complex Asymmetric 4 Columns (Perfect Height Matching) */}
        <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
          {/* Col 1: Stack of 2 Horizontal Images (flex-[384]) */}
          <div className="w-full md:w-auto md:flex-[384] flex flex-col gap-0">
            <MediaSlot
              url={project.horizontalImages[4]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
            <MediaSlot
              url={project.horizontalImages[5]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
          </div>

          {/* Col 2: Vertical Image 1080x1920 (flex-[243]) */}
          <div className="w-full md:w-auto md:flex-[243]">
            <MediaSlot
              url={project.verticalImages[2]}
              type="Image"
              resolution="1080x1920"
              aspectClass="aspect-[9/16]"
              onOpen={handleOpenMedia}
            />
          </div>

          {/* Col 3: Stack of 3 Horizontal Images (flex-[256]) */}
          <div className="w-full md:w-auto md:flex-[256] flex flex-col gap-0 justify-between">
            <MediaSlot
              url={project.horizontalImages[6]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
            <MediaSlot
              url={project.horizontalImages[7]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
            <MediaSlot
              url={project.horizontalImages[8]}
              type="Image"
              resolution="1920x1080"
              aspectClass="aspect-[16/9]"
              onOpen={handleOpenMedia}
            />
          </div>

          {/* Col 4: Vertical Image 1080x1920 (flex-[243]) */}
          <div className="w-full md:w-auto md:flex-[243]">
            <MediaSlot
              url={project.verticalImages[3]}
              type="Image"
              resolution="1080x1920"
              aspectClass="aspect-[9/16]"
              onOpen={handleOpenMedia}
            />
          </div>
        </div>

        {/* ROW 5: Full Width Feature Video 1920x1080 */}
        <div className="w-full">
          <MediaSlot
            url={project.videos[1]}
            type="Video"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
        </div>

        {/* ROW 6: 2x Image 1920x1080 (Row of 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <MediaSlot
            url={project.horizontalImages[9]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[10]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
        </div>

        {/* ROW 7: 4x Image 1920x1080 (Row of 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
          <MediaSlot
            url={project.horizontalImages[11]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[12]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[13]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
          <MediaSlot
            url={project.horizontalImages[14]}
            type="Image"
            resolution="1920x1080"
            aspectClass="aspect-[16/9]"
            onOpen={handleOpenMedia}
          />
        </div>
      </motion.section>

      {/* 4. FOOTER */}
      <footer className="w-full bg-[#05050A] text-white py-12 sm:py-16 px-4 sm:px-12 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-white/10">
            {/* Brand Logo & Slogan */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#253BFF] flex items-center justify-center font-bold text-white text-base sm:text-lg group-hover:scale-105 transition-transform">
                  M
                </div>
                <span className="text-xl sm:text-2xl font-black tracking-tight font-funnel">
                  MYM
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest font-mono">
                Meet Your Maker
              </span>
            </div>

            {/* Contact Us Bar */}
            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
              </span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#253BFF] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Footer Links & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-white/50">
            <div className="flex items-center gap-4 sm:gap-6 font-funnel">
              <span
                onClick={() => navigate("/")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </span>
              <span
                onClick={() => navigate("/")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Aesthetics
              </span>
              <span
                onClick={() => navigate("/")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Overview
              </span>
              <span
                onClick={handleBack}
                className="text-[#253BFF] font-semibold cursor-pointer"
              >
                Projects
              </span>
            </div>
            <span>© 2026 MYM Portfolio. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* 5. INTERACTIVE MEDIA LIGHTBOX MODAL */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
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
                onClick={() => setActiveMedia(null)}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Lightbox Content */}
            <div className="p-3 sm:p-4 flex items-center justify-center min-h-[250px] max-h-[75vh] overflow-hidden bg-black/60">
              <img
                src={activeMedia.url}
                alt={activeMedia.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
