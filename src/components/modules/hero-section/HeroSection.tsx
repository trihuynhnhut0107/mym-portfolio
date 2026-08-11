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
    <section className="relative w-full h-screen min-h-screen overflow-hidden border-y border-white/10 dark:border-white/10 border-black/10 bg-transparent flex flex-col justify-between">
      {/* Top Marquee Slider */}
      <div className="relative z-20 w-full shrink-0 bg-[#05050A]/90 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3.5">
        <Marquee repeat={10} className="[--duration:15s] [--gap:2rem]">
          <MeetYourMakerItem />
        </Marquee>
      </div>

      {/* Center Interactive Grid Pattern filling the gap */}
      <div className="relative z-10 flex-1 w-full h-full min-h-0 overflow-hidden">
        <InteractiveGridPattern width={160} height={160} squares={[20, 12]} />
      </div>

      {/* Bottom Marquee Slider */}
      <div className="relative z-20 w-full shrink-0 bg-[#05050A]/90 backdrop-blur-md border-t border-white/10 py-2.5 sm:py-3.5">
        <Marquee reverse repeat={10} className="[--duration:15s] [--gap:2rem]">
          <MeetYourMakerItem />
        </Marquee>
      </div>
    </section>
  );
}
