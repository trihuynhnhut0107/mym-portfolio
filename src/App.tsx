import { HeroSection } from "@/components/modules/hero-section";
import { AestheticSection } from "@/components/modules/aesthetic-section";
import { OverviewSection } from "@/components/modules/overview-section";
import { ProjectsSection } from "@/components/modules/projects-section";
import { ProjectDetailPage } from "@/components/modules/project-detail";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function MainPortfolioPage() {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    smoothProjectsProgress: number;
    bgColor: string;
  }>({
    directTopPx: typeof window !== "undefined" ? window.innerHeight : 800,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
    smoothProgress: 0,
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

      if (overviewRef.current) {
        const overviewRect = overviewRef.current.getBoundingClientRect();
        const transitionStart = vh * 1.0;
        const transitionEnd = vh * 0.1;
        const rawOverviewTarget =
          (transitionStart - overviewRect.top) /
          (transitionStart - transitionEnd);
        targetOverviewProgressRef.current = Math.max(
          0,
          Math.min(1, rawOverviewTarget),
        );
      }

      if (projectsRef.current) {
        const projectsRect = projectsRef.current.getBoundingClientRect();
        const transitionStart = vh * 0.65;
        const transitionEnd = vh * 0.25;
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
        smoothOverviewProgress = currentOverview + overviewDiff * 0.08;
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
        smoothProjectsProgress = currentProjects + projectsDiff * 0.15;
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

  const {
    directTopPx,
    viewportHeight,
    viewportWidth,
    smoothProgress,
    bgColor,
  } = animState;

  const maxCornerDistancePx = Math.hypot(
    viewportWidth / 2,
    Math.max(Math.abs(directTopPx), Math.abs(viewportHeight - directTopPx)),
  );
  const clipRadiusPx = smoothProgress * maxCornerDistancePx;

  return (
    <div className="relative w-screen max-w-full min-h-screen h-auto bg-[#05050A] text-white flex flex-col items-center overflow-x-hidden">
      {/* Scroll-Driven View Transition Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          clipPath: `circle(${clipRadiusPx}px at 50% ${directTopPx}px)`,
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

        {/* Overview Section */}
        <div ref={overviewRef} className="w-full">
          <OverviewSection />
        </div>

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
  return (
    <Routes>
      <Route path="/" element={<MainPortfolioPage />} />
      <Route path="/project/:projectId" element={<ProjectDetailPage />} />
      <Route path="*" element={<MainPortfolioPage />} />
    </Routes>
  );
}

export default App;
