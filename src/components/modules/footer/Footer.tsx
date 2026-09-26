import { useNavigate, useLocation } from "react-router-dom";
import { MymLogo } from "@/components/modules/mym-logo";
import { Mail, ArrowUpRight } from "lucide-react";
import { useAppStore } from "@/store";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToSection = useAppStore((s) => s.navigateToSection);
  const contactEmail = "nguyengiahao2501@gmail.com";

  const handleNav = (targetId?: string) => {
    navigateToSection(navigate, targetId, location.pathname);
  };

  return (
    <footer className="w-full bg-[#05050A] text-white border-t border-white/10 py-16 sm:py-20 px-6 sm:px-12 lg:px-20 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Top Row: Brand & Contact Us */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-10">
          {/* Brand: Logo + MYM + Meet Your Maker */}
          <div
            onClick={() => handleNav("home")}
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group"
          >
            <MymLogo className="w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-funnel text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
                MYM
              </span>
              <span className="font-funnel text-xs sm:text-sm text-white/80 font-normal tracking-wide mt-1">
                Meet Your Maker
              </span>
            </div>
          </div>

          {/* Contact us + Mailto Action Pill */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 w-full md:w-auto">
            <span className="font-funnel text-base sm:text-lg font-medium text-white whitespace-nowrap">
              Contact us
            </span>

            <a
              href={`mailto:${contactEmail}?subject=Inquiry%20from%20MYM%20Portfolio`}
              aria-label={`Send email to ${contactEmail}`}
              className="group relative flex items-center justify-between gap-4 w-full sm:w-auto min-w-[280px] sm:min-w-[340px] md:min-w-[380px] h-11 sm:h-12 px-5 sm:px-6 rounded-full border border-white/30 hover:border-[#253BFF] bg-white/5 hover:bg-[#253BFF]/10 text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(37,59,255,0.3)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-white/60 group-hover:text-[#253BFF] transition-colors shrink-0" />
                <span className="font-funnel text-sm sm:text-base text-white/90 group-hover:text-white font-medium truncate">
                  {contactEmail}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#253BFF] text-white flex items-center justify-center transition-all shrink-0 group-hover:scale-105">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Row: Navigation Links Spaced Across */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-4">
          <div>
            <span
              onClick={() => handleNav("home")}
              className="font-funnel text-sm sm:text-base text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Home
            </span>
          </div>

          <div>
            <span
              onClick={() => handleNav("aesthetic")}
              className="font-funnel text-sm sm:text-base text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Aesthetic
            </span>
          </div>

          <div>
            <span
              onClick={() => handleNav("overview")}
              className="font-funnel text-sm sm:text-base text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Overview
            </span>
          </div>

          <div>
            <span
              onClick={() => handleNav("projects")}
              className="font-funnel text-sm sm:text-base text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Projects
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

