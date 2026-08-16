import { Marquee } from "@/components/ui/marquee";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

const SPONSOR_LOGOS = [
  { name: "EA FC Mobile", src: "/logos/sponsors/1.png" },
  { name: "Ananas", src: "/logos/sponsors/2.png" },
  { name: "On Sports", src: "/logos/sponsors/3.png" },
  { name: "Sponsor 4", src: "/logos/sponsors/4.png" },
  { name: "Sponsor 5", src: "/logos/sponsors/5.png" },
  { name: "Sponsor 6", src: "/logos/sponsors/6.png" },
  { name: "Sponsor 7", src: "/logos/sponsors/7.png" },
  { name: "Sponsor 8", src: "/logos/sponsors/8.png" },
  { name: "Sponsor 9", src: "/logos/sponsors/9.png" },
  { name: "Sponsor 10", src: "/logos/sponsors/10.png" },
];

interface PartnerSectionProps {
  partnerProgress?: number;
}

export function PartnerSection({ partnerProgress = 0 }: PartnerSectionProps) {
  const progress = Math.max(0, Math.min(1, partnerProgress));
  const labelR = Math.round(37 + (255 - 37) * progress);
  const labelG = Math.round(59 + (255 - 59) * progress);
  const labelColor = `rgb(${labelR}, ${labelG}, 255)`;

  return (
    <section className="w-full bg-transparent flex flex-col items-center py-8 sm:py-14 select-none">
      {/* Label on top with DiaTextReveal */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 mb-4 sm:mb-6 flex items-center justify-start">
        <DiaTextReveal
          text="MYM's Partners"
          colors={["#253BFF", "#586CFF", "#FF3B58", "#253BFF"]}
          textColor={labelColor}
          repeat={true}
          repeatDelay={1.5}
          duration={1.8}
          className="font-funnel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
        />
      </div>

      {/* Transparent Sponsors Marquee Bar (No Border, Transparent Background) */}
      <div className="w-full bg-transparent py-4 sm:py-6 overflow-hidden">
        <Marquee repeat={6} className="[--duration:28s] [--gap:4.5rem] sm:[--gap:6.5rem]">
          <div className="flex items-center gap-16 sm:gap-24 select-none">
            {SPONSOR_LOGOS.map((sponsor, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-center shrink-0 h-12 sm:h-16 md:h-20 lg:h-24"
              >
                {/* Dark Logo (Active on White Background) */}
                <img
                  src={sponsor.src}
                  alt={sponsor.name}
                  style={{ opacity: 1 - progress }}
                  className="h-full w-auto max-w-[200px] sm:max-w-[280px] md:max-w-[340px] object-contain brightness-0 opacity-85 transition-opacity duration-150"
                />
                {/* White Logo (Active on Blue Background) */}
                <img
                  src={sponsor.src}
                  alt={sponsor.name}
                  style={{ opacity: progress }}
                  className="absolute inset-0 h-full w-auto max-w-[200px] sm:max-w-[280px] md:max-w-[340px] object-contain brightness-0 invert opacity-95 transition-opacity duration-150"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
