import { HeroSection } from "@/components/modules/hero-section";
import { AestheticSection } from "@/components/modules/aesthetic-section";
import { PartnerSection } from "@/components/modules/partner-section";
import { OverviewSection } from "@/components/modules/overview-section";
import { ProjectsSection } from "@/components/modules/projects-section";
import { ProjectDetailPage } from "@/components/modules/project-detail";
import { MymLogo } from "@/components/modules/mym-logo";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (
      hash === "#projects" ||
      hash.startsWith("#project-") ||
      (state as { scrollToProject?: string; scrollToProjects?: boolean } | null)
        ?.scrollToProject ||
      (state as { scrollToProject?: string; scrollToProjects?: boolean } | null)
        ?.scrollToProjects
    ) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, state]);

  return null;
}

function PageTransitionLoader() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;

      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(6px)",
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="fixed inset-0 z-[100] bg-[#05050A] flex items-center justify-center pointer-events-auto select-none"
        >
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,59,255,0.16)_0%,transparent_60%)] pointer-events-none" />

          {/* MYM Logo Only */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: [0.75, 1.05, 1], opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative z-10 flex items-center justify-center"
          >
            <MymLogo className="w-14 h-14 sm:w-20 sm:h-20 text-white drop-shadow-[0_0_35px_rgba(37,59,255,0.6)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function MainPortfolioPage() {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const targetProjectId =
      (location.state as { scrollToProject?: string } | null)
        ?.scrollToProject ||
      (location.hash.startsWith("#project-")
        ? location.hash.replace("#project-", "")
        : null);

    if (targetProjectId) {
      const el = document.getElementById(`project-card-${targetProjectId}`);
      if (el) {
        el.scrollIntoView({ behavior: "instant", block: "center" });
        return;
      }
    }

    const shouldScrollToProjects =
      location.hash === "#projects" ||
      (location.state as { scrollToProjects?: boolean } | null)
        ?.scrollToProjects;

    if (shouldScrollToProjects && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [location.hash, location.state]);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetOverviewProgressRef = useRef<number>(0);
  const currentOverviewProgressRef = useRef<number>(0);
  const targetProjectsProgressRef = useRef<number>(0);
  const currentProjectsProgressRef = useRef<number>(0);

  const [animState, setAnimState] = useState<{
    directTopPx: number;
    viewportHeight: number;
    viewportWidth: number;
    smoothProgress: number;
    smoothOverviewProgress: number;
    smoothProjectsProgress: number;
    bgColor: string;
  }>({
    directTopPx: typeof window !== "undefined" ? window.innerHeight : 800,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
    smoothProgress: 0,
    smoothOverviewProgress: 0,
    smoothProjectsProgress: 0,
    bgColor: "rgb(255, 255, 255)",
  });

  useEffect(() => {
    let animationFrameId: number;

    const updatePositionAndProgress = () => {
      if (!boundaryRef.current) return;
      const rect = boundaryRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const directTop = rect.top;

      const rawProgress = (vh - directTop) / vh;
      const clampedTarget = Math.max(0, Math.min(1, rawProgress));
      targetProgressRef.current = clampedTarget;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      let nextProgress = current;
      if (Math.abs(diff) > 0.0001) {
        nextProgress = current + diff * 0.08;
        currentProgressRef.current = nextProgress;
      } else {
        nextProgress = target;
        currentProgressRef.current = target;
      }

      if (partnerRef.current) {
        const partnerRect = partnerRef.current.getBoundingClientRect();
        const transitionStart = vh * 0.65;
        const transitionEnd = vh * 0.15;
        const rawOverviewTarget =
          (transitionStart - partnerRect.top) /
          (transitionStart - transitionEnd);
        targetOverviewProgressRef.current = Math.max(
          0,
          Math.min(1, rawOverviewTarget),
        );
      }

      if (projectsRef.current) {
        const projectsRect = projectsRef.current.getBoundingClientRect();
        const transitionStart = vh * 0.7;
        const transitionEnd = vh * 0.2;
        const rawProjectsTarget =
          (transitionStart - projectsRect.top) /
          (transitionStart - transitionEnd);
        targetProjectsProgressRef.current = Math.max(
          0,
          Math.min(1, rawProjectsTarget),
        );
      }

      const targetOverview = targetOverviewProgressRef.current;
      const currentOverview = currentOverviewProgressRef.current;
      const overviewDiff = targetOverview - currentOverview;

      let smoothOverviewProgress = currentOverview;
      if (Math.abs(overviewDiff) > 0.0001) {
        smoothOverviewProgress = currentOverview + overviewDiff * 0.1;
        currentOverviewProgressRef.current = smoothOverviewProgress;
      } else {
        smoothOverviewProgress = targetOverview;
        currentOverviewProgressRef.current = targetOverview;
      }

      const targetProjects = targetProjectsProgressRef.current;
      const currentProjects = currentProjectsProgressRef.current;
      const projectsDiff = targetProjects - currentProjects;

      let smoothProjectsProgress = currentProjects;
      if (Math.abs(projectsDiff) > 0.0001) {
        smoothProjectsProgress = currentProjects + projectsDiff * 0.12;
        currentProjectsProgressRef.current = smoothProjectsProgress;
      } else {
        smoothProjectsProgress = targetProjects;
        currentProjectsProgressRef.current = targetProjects;
      }

      const rDelta = 255 - 37;
      const gDelta = 255 - 59;

      const rawR =
        255 - rDelta * smoothOverviewProgress + rDelta * smoothProjectsProgress;
      const rawG =
        255 - gDelta * smoothOverviewProgress + gDelta * smoothProjectsProgress;

      const bgR = Math.round(Math.max(37, Math.min(255, rawR)));
      const bgG = Math.round(Math.max(59, Math.min(255, rawG)));
      const bgB = 255;

      const currentBgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

      if (nextProgress >= 0.5) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      setAnimState({
        directTopPx: directTop,
        viewportHeight: vh,
        viewportWidth: vw,
        smoothProgress: nextProgress,
        smoothOverviewProgress,
        smoothProjectsProgress,
        bgColor: currentBgColor,
      });

      animationFrameId = requestAnimationFrame(updatePositionAndProgress);
    };

    window.addEventListener("scroll", updatePositionAndProgress, {
      passive: true,
    });
    window.addEventListener("resize", updatePositionAndProgress, {
      passive: true,
    });

    updatePositionAndProgress();

    return () => {
      window.removeEventListener("scroll", updatePositionAndProgress);
      window.removeEventListener("resize", updatePositionAndProgress);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSelectProject = (projectId: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/project/${projectId}`);
  };

  const { viewportHeight, viewportWidth, smoothProgress, bgColor } = animState;

  const maxCornerDistancePx = Math.hypot(viewportWidth / 2, viewportHeight / 2);
  const clipRadiusPx = smoothProgress * maxCornerDistancePx;

  return (
    <div className="relative w-screen max-w-full min-h-screen h-auto bg-[#05050A] text-white flex flex-col items-center overflow-x-hidden">
      {/* Scroll-Driven View Transition Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          clipPath: `circle(${clipRadiusPx}px at 50% 50%)`,
          opacity: smoothProgress > 0 ? 1 : 0,
          backgroundColor: bgColor,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Landing Hero Container */}
        <section className="w-full flex items-center justify-center p-0">
          <HeroSection />
        </section>

        {/* Boundary Border Line Marker */}
        <div ref={boundaryRef} className="w-full h-px" />

        {/* Aesthetic Section */}
        <AestheticSection />

        {/* Partner Section */}
        <div ref={partnerRef} className="w-full">
          <PartnerSection partnerProgress={animState.smoothOverviewProgress} />
        </div>

        {/* Overview Section */}
        <OverviewSection />

        {/* Projects Section */}
        <div ref={projectsRef} className="w-full">
          <ProjectsSection
            onSelectProject={handleSelectProject}
            projectsProgress={animState.smoothProjectsProgress}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <PageTransitionLoader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <MainPortfolioPage />
              </PageTransition>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <PageTransition>
                <ProjectDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <MainPortfolioPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
