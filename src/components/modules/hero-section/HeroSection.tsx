import { useState, useEffect } from "react";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Marquee } from "@/components/ui/marquee";
import { MymLogo } from "@/components/modules/mym-logo";

export function MeetYourMakerItem() {
  return (
    <div className="flex items-center gap-3 md:gap-4 select-none px-4">
      <MymLogo className="h-5 w-5 md:h-6 md:w-6 text-white" />
      <span className="font-funnel text-sm sm:text-base md:text-lg font-medium text-white tracking-wider whitespace-nowrap">
        Meet Your Maker
      </span>
    </div>
  );
}

const COLS = 12;
const ROWS = 3;

export function HeroSection() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1440,
    height: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute tile dimensions so all 12 columns fit the window width perfectly
  const tileWidth = windowDimensions.width / COLS;
  const tileHeight = tileWidth;
  const gridHeight = tileHeight * ROWS;

  return (
    <section
      style={{
        width: windowDimensions.width,
        height: windowDimensions.height,
      }}
      className="relative w-full overflow-hidden bg-transparent flex flex-col justify-center items-center"
    >
      {/* Center Block: Top Marquee + 3-Row Grid + Bottom Marquee */}
      <div className="w-full flex flex-col items-center">
        {/* Top Marquee Slider */}
        <div className="relative z-20 w-full shrink-0 bg-[#05050A]/90 backdrop-blur-md border-y border-white/10 py-2.5 sm:py-3.5">
          <Marquee repeat={10} className="[--duration:15s] [--gap:2rem]">
            <MeetYourMakerItem />
          </Marquee>
        </div>

        {/* Center Interactive Grid Pattern with exactly 3 rows (3x12 full) */}
        <div
          className="relative z-10 w-full overflow-hidden"
          style={{ height: gridHeight }}
        >
          <InteractiveGridPattern
            width={tileWidth}
            height={tileHeight}
            squares={[COLS, ROWS]}
          />
        </div>

        {/* Bottom Marquee Slider */}
        <div className="relative z-20 w-full shrink-0 bg-[#05050A]/90 backdrop-blur-md border-y border-white/10 py-2.5 sm:py-3.5">
          <Marquee
            reverse
            repeat={10}
            className="[--duration:15s] [--gap:2rem]"
          >
            <MeetYourMakerItem />
          </Marquee>
        </div>
      </div>
    </section>
  );
}
