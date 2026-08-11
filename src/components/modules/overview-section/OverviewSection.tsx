import { useRef } from "react";
import { motion } from "framer-motion";
import {
  SquarePen,
  Palette,
  Clapperboard,
  Code2,
  Layout,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { IconCloud } from "@/components/ui/icon-cloud";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "@/components/reui/timeline";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const SERVICES: ServiceItem[] = [
  {
    id: "srv-content",
    title: "Content Creator",
    description:
      "We craft compelling narratives and high-impact copy tailored to your brand's voice. From strategic storytelling to social media engagement, we ensure your message resonates deeply and clearly communicates your interaction with your target audience.",
    icon: SquarePen,
  },
  {
    id: "srv-graphic",
    title: "Graphic Designer",
    description:
      "We translate your brand identity into stunning visual experiences. By blending aesthetic precision with strategic intent, we create logos, marketing assets, and brand systems that capture attention and clearly communicate your unique value proposition.",
    icon: Palette,
  },
  {
    id: "srv-video",
    title: "Cinematic video editor",
    description:
      "We transform raw footage into immersive stories that captivate viewers. Utilizing professional-grade editing, pacing, and sound design, we bring your vision to life through high-quality video content optimized for any platform or medium.",
    icon: Clapperboard,
  },
  {
    id: "srv-software",
    title: "Software Designer & Developer",
    description:
      "We build robust, scalable, and intuitive software solutions. From architectural design to full-stack implementation, we bridge the gap between complex requirements and high-performance technical execution to deliver products that empower your users.",
    icon: Code2,
  },
  {
    id: "srv-uxui",
    title: "UX/UI Designer & Developer",
    description:
      "We prioritize the human experience by designing interfaces that are as functional as they are beautiful. Our approach focuses on user research, intuitive navigation, and responsive development to ensure seamless interaction across all digital touchpoints.",
    icon: Layout,
  },
  {
    id: "srv-livestream",
    title: "Livestream production",
    description:
      "We manage the technical and creative demands of live broadcasting. Whether it is webinars, events, or real-time interactive content, we ensure a professional-grade stream with stable connectivity, high-quality audio/visuals, and seamless show flow.",
    icon: Radio,
  },
];

interface TimelineEntry {
  year: string;
  leftContent?: Array<{ title: string; type: string }>;
  rightContent?: Array<{ title: string; type: string }>;
  eraMarkerLeft?: string;
  eraMarkerRight?: string;
  isHighlightedEra?: boolean;
}

const TIMELINE_DATA: TimelineEntry[] = [
  {
    year: "2021",
    leftContent: [{ title: "Zen Tactics", type: "(Livestream channel)" }],
    eraMarkerRight: "Zen Tactics' Era",
  },
  {
    year: "2022",
    leftContent: [{ title: "Zen Cine & Esports", type: "(Other YT channels)" }],
    rightContent: [
      { title: "Modern Football", type: "(Sport YT Channel)" },
      { title: "The Tactics Duo", type: "(Outsource Channel)" },
      { title: "Zentlemen", type: "(Website)" },
    ],
  },
  {
    year: "2023",
    leftContent: [{ title: "Zen FIFA eWorld Cup", type: "(Public Event)" }],
    eraMarkerRight: "HLV Online's Era",
    isHighlightedEra: true,
  },
  {
    year: "2024",
    leftContent: [
      { title: "HLV Online", type: "(Sport YT Channel)" },
      { title: "HLV Onlive", type: "(Livestream Channel)" },
    ],
    rightContent: [{ title: "HLV Online Classic", type: "(Sport YT Channel)" }],
  },
  {
    year: "2025",
    leftContent: [
      { title: "Qua Bong Cuoi, Nem Ngon,...", type: "(Outsource Channels)" },
    ],
    rightContent: [
      { title: "Cup Hoc Xem Bong", type: "(Sport YT Channel)" },
      { title: "The Watcher", type: "(Website)" },
    ],
  },
];

// High-DPI SVG Helper Generator for 3D IconCloud Stats Badges (Enlarged Bubbles)
function createStatBadge(
  value: string,
  label: string,
  bgHex: string,
  textHex: string,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="160"
      viewBox="0 0 160 160"
    >
      <circle
        cx="80"
        cy="80"
        r="72"
        fill={bgHex}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="4"
      />
      <text
        x="80"
        y="68"
        fill={textHex}
        fontSize="32"
        fontWeight="800"
        fontFamily="sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {value}
      </text>
      <text
        x="80"
        y="102"
        fill={textHex}
        fontSize="12"
        fontWeight="700"
        fontFamily="sans-serif"
        letterSpacing="1.5"
        opacity="0.85"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </svg>
  );
}

function createIconBadge(pathD: string, bgHex: string, iconHex: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="160"
      viewBox="0 0 160 160"
    >
      <circle
        cx="80"
        cy="80"
        r="72"
        fill={bgHex}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
      />
      <g transform="translate(48, 48) scale(2.6)">
        <path
          d={pathD}
          fill="none"
          stroke={iconHex}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Zen Tactics' Era 3D Cloud Badges (Primary Blue Theme)
const ZEN_CLOUD_ICONS = [
  createStatBadge("64K", "SUBS", "#FFFFFF", "#253BFF"),
  createStatBadge("44K", "FOLLOW", "#FFFFFF", "#253BFF"),
  createStatBadge("6.3M", "VIEWS", "#FFFFFF", "#253BFF"),
  createStatBadge("ZEN", "ERA", "#253BFF", "#FFFFFF"),
  createIconBadge(
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17 M14 14.66V17 M18 2H6v7a6 6 0 0 0 12 0V2z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M4.9 19.1C1 15.2 1 8.8 4.9 4.9 M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5 M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5 M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M23 7l-7 5 7 5V7z M14 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    "#FFFFFF",
    "#253BFF",
  ),
];

// HLV Online's Era 3D Cloud Badges (White Background with Primary Blue Icons)
const HLV_CLOUD_ICONS = [
  createStatBadge("164K", "SUBS", "#FFFFFF", "#253BFF"),
  createStatBadge("133K", "FOLLOW", "#FFFFFF", "#253BFF"),
  createStatBadge("39M", "VIEWS", "#FFFFFF", "#253BFF"),
  createStatBadge("HLV", "ONLINE", "#253BFF", "#FFFFFF"),
  createIconBadge(
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 1.5 3.5z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17 M14 14.66V17 M18 2H6v7a6 6 0 0 0 12 0V2z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge(
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "#FFFFFF",
    "#253BFF",
  ),
  createIconBadge("M16 18l6-6-6-6 M8 6l-6 6 6 6", "#FFFFFF", "#253BFF"),
  createIconBadge("M5 3l14 9-14 9V3z", "#FFFFFF", "#253BFF"),
];

export function OverviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const node0Ref = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);
  const node4Ref = useRef<HTMLDivElement>(null);

  const nodeRefs = [node0Ref, node1Ref, node2Ref, node3Ref, node4Ref];

  return (
    <section
      id="about"
      className="w-full min-h-screen bg-transparent text-white flex flex-col justify-center items-center relative overflow-hidden py-16 sm:py-24 px-6 sm:px-12 select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-20 sm:gap-28">
        {/* Part 1: Who is MYM? */}
        <div className="w-full flex flex-col items-center text-center gap-10 sm:gap-14">
          <div className="w-full flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            <h2 className="font-funnel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight text-center">
              Who is “MYM”?
            </h2>

            <div className="flex flex-col gap-3 text-white/90 text-sm sm:text-base font-roboto leading-relaxed text-center max-w-2xl">
              <p>
                Every great achievement begins as a fragment of imagination. But
                the distance between a brilliant idea and its reality is often a
                treacherous gap. We exist to bridge that gap.
              </p>
              <p>
                As a multidisciplinary creative agency, we refine the raw core
                of your demand into a pinnacle of design and strategy—optimizing
                performance for those who demand excellence.
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-items-center gap-6 sm:gap-8">
            {SERVICES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full w-full flex flex-col items-center"
                >
                  <MagicCard
                    gradientSize={300}
                    gradientFrom="#586CFF"
                    gradientTo="#253BFF"
                    gradientColor="rgba(37, 59, 255, 0.22)"
                    gradientOpacity={0.9}
                    cardClassName="bg-[#F6F7FD]/95 backdrop-blur-md h-full"
                    className="h-full w-full rounded-[32px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/60"
                  >
                    <div
                      id={item.id}
                      className="p-8 sm:p-10 flex flex-col items-center justify-center text-center h-full min-h-[380px] sm:min-h-[420px]"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#586CFF] via-[#253BFF] to-[#1627C4] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-xl shadow-[#253BFF]/40 border border-white/30 mb-6 sm:mb-8 shrink-0">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[1.75]" />
                      </div>

                      <h3 className="font-funnel text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3 sm:mb-4 text-center">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-roboto max-w-sm text-center">
                        {item.description}
                      </p>
                    </div>
                  </MagicCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Overview 6-years of MYM */}
        <div
          id="overview"
          className="w-full flex flex-col items-center text-center gap-10 sm:gap-14 pt-8"
        >
          <h2 className="font-funnel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight text-center">
            Overview <br />
            <span className="text-white/90">6-years of MYM</span>
          </h2>

          {/* Dual 3D Orbit Clouds Stats Banner */}
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-around gap-10 lg:gap-6">
            {/* Era 1: Zen Tactics' Era Cloud */}
            <div className="flex-1 w-full flex flex-col items-center text-center gap-4">
              <div className="flex flex-col items-center text-center gap-1">
                <h4 className="font-funnel text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                  Zen Tactics' Era
                </h4>
                <p className="text-xs sm:text-sm text-white/75 font-roboto font-semibold">
                  64K Subs • 44K Followers • 6.3M Views
                </p>
              </div>
              <div className="relative flex items-center justify-center overflow-visible max-w-full scale-90 sm:scale-100">
                <IconCloud
                  icons={ZEN_CLOUD_ICONS}
                  width={380}
                  height={380}
                  iconSize={76}
                />
              </div>
            </div>

            {/* Vertical / Horizontal Divider */}
            <div className="w-full lg:w-px h-px lg:h-96 bg-white/20 shrink-0 my-2 lg:my-0" />

            {/* Era 2: HLV Online's Era Cloud */}
            <div className="flex-1 w-full flex flex-col items-center text-center gap-4">
              <div className="flex flex-col items-center text-center gap-1">
                <h4 className="font-funnel text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                  HLV Online's Era
                </h4>
                <p className="text-xs sm:text-sm text-white/75 font-roboto font-semibold">
                  164K Subs • 133K Followers • 39M Views
                </p>
              </div>
              <div className="relative flex items-center justify-center overflow-visible max-w-full scale-90 sm:scale-100">
                <IconCloud
                  icons={HLV_CLOUD_ICONS}
                  width={380}
                  height={380}
                  iconSize={76}
                />
              </div>
            </div>
          </div>

          {/* REUI Horizontal Timeline Container with Animated Beams */}
          <div className="w-full max-w-5xl mx-auto py-8 px-4 overflow-x-auto scrollbar-none">
            <Timeline
              defaultValue={TIMELINE_DATA.length}
              orientation="horizontal"
              className="w-full"
            >
              <div
                ref={containerRef}
                className="relative min-w-[850px] md:min-w-full pt-10 pb-6 px-6 pr-28 select-none"
              >
                {/* Single continuous AnimatedBeam flowing seamlessly across all timeline items */}
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={node0Ref}
                  toRef={node4Ref}
                  duration={10}
                  delay={0}
                  repeatDelay={0.5}
                  ease="linear"
                  curvature={0}
                  pathColor="rgba(255, 255, 255, 0.2)"
                  pathWidth={3}
                  pathOpacity={0.5}
                  gradientStartColor="#FFFFFF"
                  gradientStopColor="#FFFFFF"
                  startXOffset={-60}
                  endXOffset={56}
                />

                <div className="grid grid-cols-5 gap-4 relative z-10">
                  {TIMELINE_DATA.map((entry, idx) => {
                    return (
                      <TimelineItem
                        key={entry.year}
                        step={idx + 1}
                        className="flex flex-col items-center text-center group-data-[orientation=horizontal]/timeline:mt-0"
                      >
                        {/* Top Content Area (above horizontal beam) */}
                        <div className="min-h-[130px] w-full flex flex-col justify-end items-center text-center pb-6">
                          {entry.leftContent?.map((item, i) => (
                            <div key={i} className={i > 0 ? "mt-2" : ""}>
                              <h4 className="font-funnel text-sm sm:text-base font-bold text-white leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-white/70 font-roboto font-medium mt-0.5">
                                {item.type}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* United Pure White Glowing Node Circle for Every Timeline Item */}
                        <div className="relative flex items-center justify-center">
                          <div
                            ref={nodeRefs[idx]}
                            className="relative w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20 shrink-0 transition-transform duration-300 hover:scale-125 cursor-pointer"
                          />

                          {/* "To be continued..." label attached at the end of the progress bar */}
                          {idx === TIMELINE_DATA.length - 1 && (
                            <div className="absolute left-full ml-14 flex items-center whitespace-nowrap z-30">
                              <span className="font-funnel text-xs sm:text-sm font-semibold tracking-wide text-white">
                                To be continued...
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Timeline Header (Year & Era Header directly below node) */}
                        <TimelineHeader className="flex flex-col items-center text-center mt-3">
                          <TimelineDate className="font-funnel text-sm sm:text-base font-extrabold tracking-wider text-white">
                            {entry.year}
                          </TimelineDate>

                          {entry.eraMarkerRight && (
                            <TimelineTitle className="font-funnel text-xs sm:text-sm font-bold tracking-wide mt-1.5 text-white">
                              {entry.eraMarkerRight}
                            </TimelineTitle>
                          )}
                        </TimelineHeader>

                        {/* Bottom Content Area (below node & year badge) */}
                        <TimelineContent className="min-h-[140px] w-full flex flex-col justify-start items-center text-center pt-3">
                          {entry.rightContent?.map((item, i) => (
                            <div key={i} className={i > 0 ? "mt-2.5" : ""}>
                              <h4 className="font-funnel text-sm sm:text-base font-bold text-white leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-white/70 font-roboto font-medium mt-0.5">
                                {item.type}
                              </p>
                            </div>
                          ))}
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </div>
              </div>
            </Timeline>
          </div>
        </div>
      </div>
    </section>
  );
}
