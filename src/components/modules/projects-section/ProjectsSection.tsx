import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export interface ProjectStat {
  icon?: "play" | "eye" | "users" | "like" | "clock";
  value: string;
  label: string;
  isPrimary?: boolean;
}

export interface ProjectItem {
  id: string;
  year: string;
  title: string;
  tag: string;
  category: "youtube" | "events" | "outsource" | "website";
  description: string;
  stats: ProjectStat[];
  images: string[];
  isHighlighted?: boolean;
  accentColor?: string;
}

// 1. Zen Tactics Era Projects
const ZEN_TACTICS_PROJECTS: ProjectItem[] = [
  {
    id: "zen-tactics",
    year: "2021",
    title: "Zen Tactics",
    tag: "(Livestream Channel)",
    category: "youtube",
    accentColor: "#253BFF",
    description:
      "One of the pioneering football YouTube channels in Vietnam to use well-designed motion graphics rather than relying on clunky audios/internet stock footage. We delivered a visual experience on par with mainstream broadcast networks, elevating high-quality football content in the landscape. This project successfully set the industry standard for both visual aesthetics and analytical depth for future football content creators in Vietnam.",
    stats: [
      { icon: "play", value: "30K+", label: "Subscribers", isPrimary: true },
      { icon: "eye", value: "1M+", label: "Views", isPrimary: true },
      { icon: "users", value: "600", label: "Views/stream" },
      { icon: "users", value: "30K+", label: "Followers" },
    ],
    images: [
      "/images/zen-tactics/472789356_898720405677394_7598917261126547216_n.jpg",
      "/images/zen-tactics/472599692_895716355977799_4787358625607068956_n.jpg",
      "/images/zen-tactics/472426126_895709369311831_6879265775689816510_n.jpg",
    ],
  },
  {
    id: "modern-football",
    year: "2022",
    title: "Modern Football",
    tag: "(Sport YT Channel)",
    category: "youtube",
    accentColor: "#253BFF",
    description:
      "The analytical successor to Zen Tactics. Introducing a vibrant design language that effectively bridges today's tactical analysis with young audiences through relatable graphics and high-performance storytelling.",
    stats: [
      { icon: "play", value: "24K+", label: "Subscribers", isPrimary: true },
      { icon: "eye", value: "4M+", label: "Views", isPrimary: true },
      { icon: "users", value: "30K+", label: "Followers" },
    ],
    images: [
      "/logos/zen-tactics/1.jpg",
      "/images/modern-football/1.jpg",
      "/images/modern-football/2.jpg",
    ],
  },
  {
    id: "tactics-duo",
    year: "2022",
    title: "The Tactics Duo",
    tag: "(Outsource Channel)",
    category: "outsource",
    accentColor: "#253BFF",
    description:
      "Focused on pre-match tactical breakdown and heavy graphic design execution. Achieved a peak traffic of over 600K views within a single year.",
    stats: [
      { icon: "play", value: "2.9K", label: "Subscribers" },
      { icon: "eye", value: "646K", label: "Views", isPrimary: true },
      { icon: "users", value: "4.7K", label: "Followers" },
      { icon: "eye", value: "18K", label: "Views/post", isPrimary: true },
    ],
    images: [
      "/images/tactics-duo/309459643_3421573241395550_5199766547589067483_n.jpg",
      "/images/tactics-duo/472270521_576889831872912_1974374757049650913_n.jpg",
      "/images/tactics-duo/473992265_586856844209544_1402096003712105981_n.jpg",
    ],
  },
  {
    id: "zen-fifa",
    year: "2023",
    title: "Zen FIFA23 eWorld Cup",
    tag: "(Public Event)",
    category: "events",
    accentColor: "#253BFF",
    description:
      "The first major Esports offline tournament organized under the Modern Football brand. One of the largest offline EA FC tournaments hosted in Ho Chi Minh City.",
    stats: [
      { icon: "users", value: "100+", label: "Participants", isPrimary: true },
      { icon: "eye", value: "50K+", label: "Event Reach", isPrimary: true },
      { icon: "users", value: "8+", label: "Teams" },
    ],
    images: [
      "/images/zen-fifa-eworldcup/475831082_944879471080415_4984727195396708880_n.jpg",
      "/images/zen-fifa-eworldcup/475872175_944879587747070_2330471353124767265_n.jpg",
      "/images/zen-fifa-eworldcup/475684476_944879924413703_8127607533985552413_n.jpg",
    ],
  },
];

// 2. HLV Online Era Projects
const HLV_ONLINE_PROJECTS: ProjectItem[] = [
  {
    id: "hlv-online",
    year: "2023",
    title: "HLV Online",
    tag: "(Sport YT Channel)",
    category: "youtube",
    isHighlighted: true,
    accentColor: "#253BFF",
    description:
      "Our signature milestone and most successful project to date. By applying modern visual graphics, deep-dive tactical analytics, and semantic interface design, we dismantled the barriers between complex football analytics and audience engagement.",
    stats: [
      { icon: "play", value: "94K", label: "Subscribers", isPrimary: true },
      { icon: "eye", value: "9M", label: "Views", isPrimary: true },
      { icon: "users", value: "40K", label: "Followers" },
      { icon: "like", value: "972K", label: "Likes" },
    ],
    images: [
      "/images/hlv-onlive/12.jpg",
      "/images/hlv-onlive/13.jpg",
      "/images/hlv-onlive/epl 3.png",
    ],
  },
  {
    id: "hlv-classic",
    year: "2024",
    title: "HLV Online Classic",
    tag: "(Sport YT Channel)",
    category: "youtube",
    accentColor: "#253BFF",
    description:
      "A retro, narrative-driven approach to iconic football moments. Focusing on nostalgic events to restore pure, emotional human connection with dedicated audiences.",
    stats: [
      { icon: "play", value: "31K", label: "Subscribers", isPrimary: true },
      { icon: "eye", value: "3.3M", label: "Views", isPrimary: true },
      { icon: "eye", value: "11M", label: "Impressions" },
      { icon: "clock", value: "93K", label: "Watch hours", isPrimary: true },
    ],
    images: [
      "/images/hlv-online-classic/Bayern_Munnich_Ribery_Robben.png",
      "/images/hlv-online-classic/Paul Scholes.png",
      "/images/hlv-online-classic/Pirlo.png",
    ],
  },
  {
    id: "cup-hoc",
    year: "2025",
    title: "Cup Hoc Xem Bong",
    tag: "(Sport YT Channel)",
    category: "youtube",
    accentColor: "#253BFF",
    description:
      "A reality show format dedicated to finding and nurturing young commentary and analytical talent in football esports, forming the foundation for the next media generation.",
    stats: [
      { icon: "play", value: "11K", label: "Subscribers" },
      { icon: "eye", value: "1.6M", label: "Views", isPrimary: true },
      { icon: "users", value: "51K", label: "Followers", isPrimary: true },
      { icon: "users", value: "40K", label: "TikTok" },
    ],
    images: [
      "/images/cup-hoc-xem-bong/Mark logo.png",
      "/images/cup-hoc-xem-bong/Bản sao của Arsenal_va_Bayern_nhu_nay_thi_sao_Chelsea_an_uoc_ay.png",
      "/images/cup-hoc-xem-bong/6a.png",
    ],
  },
  {
    id: "the-watcher",
    year: "2025",
    title: "The Watcher",
    tag: "(Website & Platform)",
    category: "website",
    accentColor: "#253BFF",
    description:
      "A premium subscription-based editorial blog platform designed with a dark, minimalist aesthetic, smooth scroll interactions, and a custom admin CMS panel.",
    stats: [
      { icon: "eye", value: "100%", label: "Custom UI", isPrimary: true },
      { icon: "users", value: "CMS", label: "Admin Panel", isPrimary: true },
      { icon: "clock", value: "2025", label: "Launch" },
    ],
    images: ["/images/zentlemen/image.png", "/images/zentlemen/image copy.png"],
  },
];

// Circular Node Stat Badges from Overview (3 Circles)
const ZEN_STATS_NODES = [
  { value: "64K", label: "SUBS" },
  { value: "44K", label: "FOLLOW" },
  { value: "6.3M", label: "VIEWS" },
];

const HLV_STATS_NODES = [
  { value: "164K", label: "SUBS" },
  { value: "133K", label: "FOLLOW" },
  { value: "39M", label: "VIEWS" },
];

interface ProjectsSectionProps {
  onSelectProject?: (projectId: string) => void;
  projectsProgress?: number;
}

function lerpColor(factor: number) {
  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(255 - (255 - 37) * f);
  const g = Math.round(255 - (255 - 59) * f);
  const b = 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function lerpTextColor(factor: number) {
  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(255 - (255 - 5) * f);
  const g = Math.round(255 - (255 - 5) * f);
  const b = Math.round(255 - (255 - 10) * f);
  const a = (0.95 - (0.95 - 0.85) * f).toFixed(2);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function ProjectsSection({
  onSelectProject,
  projectsProgress = 1,
}: ProjectsSectionProps) {
  const navigate = useNavigate();

  const labelColor = lerpColor(projectsProgress);
  const titleTextColor = lerpColor(projectsProgress);
  const descTextColor = lerpTextColor(projectsProgress);

  const handleCardClick = (id: string) => {
    if (onSelectProject) {
      onSelectProject(id);
    } else {
      navigate(`/project/${id}`);
    }
  };

  const renderCard = (project: ProjectItem) => {
    return (
      <motion.div
        key={project.id}
        id={`project-card-${project.id}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="w-full h-full cursor-pointer group/card scroll-mt-24 sm:scroll-mt-32"
        onClick={() => handleCardClick(project.id)}
      >
        <div className="p-6 sm:p-8 rounded-[28px] text-white shadow-2xl flex flex-col justify-between h-full gap-6 bg-[#253BFF] group-hover/card:ring-2 group-hover/card:ring-white/50 transition-all duration-300">
          {/* Card Title & Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-funnel text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover/card:translate-x-1 transition-transform">
                {project.title}
              </h3>
              <span className="text-xs font-mono font-medium text-white/80 bg-white/20 px-2.5 py-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity">
                View Page →
              </span>
            </div>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-roboto font-normal">
              {project.description}
            </p>
          </div>

          {/* Statistics & Images Section */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Project Statistics Badges inserted in place of statistic label */}
            <div className="w-full flex flex-wrap items-center justify-around gap-1.5 sm:gap-2">
              {project.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-md shadow-xs"
                >
                  <span className="font-funnel text-xs sm:text-sm font-extrabold text-white leading-none">
                    {stat.value}
                  </span>
                  <span className="font-roboto text-[9px] sm:text-[10px] font-medium text-white/85 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 3 Image Squares placed in the grid where statistics used to be */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, idx) => {
                const img =
                  project.images && project.images[idx]
                    ? project.images[idx]
                    : project.images?.[0];

                return (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-black/20 border border-white/25 shadow-inner group/img cursor-pointer"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`${project.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/15 border border-white/25 backdrop-blur-md p-3 flex items-center justify-center">
                        <span className="font-funnel text-lg font-bold text-white">
                          {project.title.slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section
      id="projects"
      className="w-full min-h-screen bg-transparent text-[#05050A] py-16 sm:py-24 px-6 sm:px-12 select-none relative overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-24 sm:gap-32">
        {/* SECTION 1: PROJECT ZEN TACTICS */}
        <div className="w-full flex flex-col gap-8 sm:gap-12">
          {/* Header layout: Title on Left, 2-column description on Right */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col items-start gap-1">
              <span
                className="font-funnel text-sm font-semibold uppercase tracking-widest"
                style={{ color: labelColor }}
              >
                Project
              </span>
              <DiaTextReveal
                text="Zen Tactics"
                colors={
                  projectsProgress < 0.4
                    ? ["#FFFFFF", "#90A0FF", "#FF4D61", "#FFFFFF"]
                    : ["#253BFF", "#3A4FFF", "#FF253B", "#253BFF"]
                }
                textColor={titleTextColor}
                repeat={true}
                repeatDelay={1.5}
                duration={1.8}
                className="font-funnel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-normal pr-2"
              />
            </div>

            <div
              className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-roboto leading-relaxed"
              style={{ color: descTextColor }}
            >
              <p>
                The Zen system represents a multi-year journey of redefining
                digital sports and entertainment media in Vietnam. Born from a
                desire to move beyond basic streams, we have consistently pushed
                the boundaries of content creation—transitioning from pioneering
                regional tactical analysis to football broadcasting, large scale
                live esports events. Our evolution reflects a commitment to
                technical precision, visual innovation, and an unwavering focus
                on deep-audience engagement across diverse digital platforms.
              </p>
              <p>
                Our work—from pioneering high-end tactical boards in football to
                crossing down esports strategy—is designed to dismantle the
                barrier between 'hardcore information' and 'audience
                understanding'. By utilizing dynamic motion graphics and
                reliable storytelling, we turn technical analysis into a
                rewarding viewing experience.
              </p>
            </div>
          </div>

          {/* Stats summary row (3 Enlarged Circles & connecting line) */}
          <div className="w-full flex items-center justify-center py-6 my-2">
            <div className="relative w-full max-w-2xl flex items-center justify-between px-6 sm:px-12">
              {/* Background line */}
              <div className="absolute top-1/2 left-12 right-12 h-1.5 bg-[#253BFF]/30 -translate-y-1/2 z-0" />

              {/* Stat Circular Nodes (3 Big Circles) */}
              {ZEN_STATS_NODES.map((node, i) => (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#253BFF] text-white flex flex-col items-center justify-center shadow-xl border-4 sm:border-[6px] border-white transition-transform duration-300 hover:scale-110 cursor-pointer">
                    <span className="font-funnel text-xl sm:text-3xl font-extrabold leading-none">
                      {node.value}
                    </span>
                    <span className="font-roboto text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90 mt-1">
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards 2-Column Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch">
            {ZEN_TACTICS_PROJECTS.map((project) => renderCard(project))}
          </div>
        </div>

        {/* SECTION 2: PROJECT HLV ONLINE */}
        <div className="w-full flex flex-col gap-8 sm:gap-12 pt-6">
          {/* Header layout: Title on Left, 2-column description on Right */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col items-start gap-1">
              <span className="font-funnel text-sm font-semibold uppercase tracking-widest text-[#253BFF]">
                Project
              </span>
              <DiaTextReveal
                text="HLV Online"
                colors={["#253BFF", "#3A4FFF", "#FF253B", "#253BFF"]}
                textColor="#253BFF"
                repeat={true}
                repeatDelay={1.5}
                duration={1.8}
                className="font-funnel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-normal pr-2 text-[#253BFF]"
              />
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-[#05050A]/80 text-xs sm:text-sm font-roboto leading-relaxed">
              <p>
                HLV Online represents our signature milestone and most
                successful sport media brand to date. By combining modern visual
                motion graphics, deep-dive tactical analytics, and interactive
                storytelling, we dismantled the traditional barriers between
                complex football tactics and mass audience engagement.
              </p>
              <p>
                From real-time matchday coverage to retro narrative-driven
                documentaries and youth commentary talent shows, our work under
                the HLV Online brand continues to set the benchmark for football
                entertainment and community growth across Vietnam.
              </p>
            </div>
          </div>

          {/* Stats summary row (3 Enlarged Circles & connecting line) */}
          <div className="w-full flex items-center justify-center py-6 my-2">
            <div className="relative w-full max-w-2xl flex items-center justify-between px-6 sm:px-12">
              {/* Background line */}
              <div className="absolute top-1/2 left-12 right-12 h-1.5 bg-[#253BFF]/30 -translate-y-1/2 z-0" />

              {/* Stat Circular Nodes (3 Big Circles) */}
              {HLV_STATS_NODES.map((node, i) => (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#253BFF] text-white flex flex-col items-center justify-center shadow-xl border-4 sm:border-[6px] border-white transition-transform duration-300 hover:scale-110 cursor-pointer">
                    <span className="font-funnel text-xl sm:text-3xl font-extrabold leading-none">
                      {node.value}
                    </span>
                    <span className="font-roboto text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90 mt-1">
                      {node.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards 2-Column Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch">
            {HLV_ONLINE_PROJECTS.map((project) => renderCard(project))}
          </div>
        </div>
      </div>
    </section>
  );
}
