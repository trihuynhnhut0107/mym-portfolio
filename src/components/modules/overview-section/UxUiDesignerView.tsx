import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Safari } from "@/components/ui/safari";
import { PROJECTS_DETAIL_DATA } from "@/data/projectsData";
import { useAppStore } from "@/store";

export function UxUiDesignerView() {
  const navigate = useNavigate();
  const navigateToProject = useAppStore((s) => s.navigateToProject);
  const zentlemen = PROJECTS_DETAIL_DATA["zentlemen"];
  const theWatcher = PROJECTS_DETAIL_DATA["the-watcher"];

  const projects = [
    {
      data: zentlemen,
      siteUrl: "/zentlemen.html",
      displayUrl: "https://zentlemen.vn",
      showExternalLink: false,
    },
    {
      data: theWatcher,
      siteUrl: "https://thewatcherxiii.info/",
      displayUrl: "https://thewatcherxiii.info/",
      showExternalLink: true,
    },
  ];

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      {projects.map(({ data: project, siteUrl, displayUrl, showExternalLink }, index) => {
        if (!project) return null;

        return (
          <div
            key={project.id || index}
            className="w-full flex flex-col items-center gap-3"
          >
            {/* Top Action Bar */}
            <div className="w-full flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="font-funnel text-base sm:text-lg font-bold text-white">
                  {project.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#253BFF]/20 text-[#3B50FF] border border-[#253BFF]/40 text-[10px] sm:text-xs font-funnel font-semibold">
                  {project.year}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigateToProject(navigate, project.id, {
                      fromSkillId: "srv-uxui",
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-roboto text-[#A8B6FF] hover:text-white transition-colors cursor-pointer"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {showExternalLink && (
                  <a
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#253BFF] hover:bg-[#3B50FF] text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/20 hover:scale-105 cursor-pointer"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Magic UI Safari Mockup with Live Iframe */}
            <Safari
              url={displayUrl}
              className="w-full shadow-2xl border border-white/10 rounded-[12px] overflow-hidden"
            >
              <iframe
                src={siteUrl}
                title={project.title}
                className="w-full h-full border-0 bg-[#05050A]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
              />
            </Safari>
          </div>
        );
      })}
    </div>
  );
}
