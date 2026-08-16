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

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-transparent flex flex-col justify-center items-center">
      {/* Center Block: Top Marquee + 3-Row Grid + Bottom Marquee */}
      <div className="w-full flex flex-col items-center">
        {/* Top Marquee Slider */}
        <div className="relative z-20 w-full shrink-0 bg-[#05050A]/90 backdrop-blur-md border-y border-white/10 py-2.5 sm:py-3.5">
          <Marquee repeat={10} className="[--duration:15s] [--gap:2rem]">
            <MeetYourMakerItem />
          </Marquee>
        </div>

        {/* Center Interactive Grid Pattern with exactly 3 rows (3 * 160px = 480px) */}
        <div className="relative z-10 w-full h-[480px] overflow-hidden">
          <InteractiveGridPattern width={160} height={160} squares={[32, 3]} />
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
