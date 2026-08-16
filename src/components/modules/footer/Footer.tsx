import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MymLogo } from "@/components/modules/mym-logo";
import { ArrowRight, Check } from "lucide-react";

const PLACEHOLDER_EMAILS = [
  "example@mail.com",
  "contact@mym.agency",
  "hello@maker.vn",
];

function useTypingPlaceholder(
  words: string[],
  typeSpeed = 90,
  deleteSpeed = 45,
  pauseDelay = 2000,
) {
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex] || "";
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, typeSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    isDeleting,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    pauseDelay,
  ]);

  return displayedText;
}

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const typingPlaceholder = useTypingPlaceholder(PLACEHOLDER_EMAILS);

  const handleNav = (targetId?: string) => {
    if (location.pathname === "/") {
      if (!targetId || targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      if (!targetId || targetId === "home") {
        navigate("/");
      } else {
        navigate(`/#${targetId}`, {
          state: { scrollToProjects: targetId === "projects" },
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = emailInput.trim();
    const recipient = "contact@mym.agency";
    const subject = encodeURIComponent("Inquiry from MYM Portfolio");
    const body = encodeURIComponent(
      `Hello MYM Team,\n\nI would like to get in touch regarding a project/collaboration.\n\nSender Email: ${userEmail}\n\nBest regards,`,
    );

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmailInput("");
    }, 4000);
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

          {/* Contact us + Capsule Pill Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 w-full md:w-auto"
          >
            <span className="font-funnel text-base sm:text-lg font-medium text-white whitespace-nowrap">
              Contact us
            </span>

            <div className="relative flex items-center w-full sm:w-[320px] md:w-[400px] lg:w-[460px]">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={
                  isSubmitted
                    ? "Opening mail client..."
                    : `${typingPlaceholder}`
                }
                className="w-full h-11 sm:h-12 px-6 rounded-full border border-white/30 bg-transparent text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-[#253BFF] focus:ring-1 focus:ring-[#253BFF] transition-all pr-12 font-funnel"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="absolute right-2 w-8 h-8 rounded-full bg-white/10 hover:bg-[#253BFF] text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              >
                {isSubmitted ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
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
