import { Marquee } from "@/components/ui/marquee";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

const SPONSOR_LOGOS = [
  { name: "EA FC Mobile", src: "/logos/sponsors/1.png" },
  { name: "Ananas", src: "/logos/sponsors/2.png" },
  { name: "On Sports", src: "/logos/sponsors/3.png" },
  { name: "Akala", src: "/logos/sponsors/4.png" },
  { name: "XM", src: "/logos/sponsors/5.png" },
  { name: "Sponsor 6", src: "/logos/sponsors/6.png" },
  { name: "Sponsor 7", src: "/logos/sponsors/7.png" },
  { name: "Sponsor 8", src: "/logos/sponsors/8.png" },
  { name: "The Sporting News", src: "/logos/sponsors/9.png" },
  { name: "Neymar Sport", src: "/logos/sponsors/10.png" },
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
    <section className="w-full bg-transparent flex flex-col items-center py-10 sm:py-16 select-none">
      {/* Label on top with DiaTextReveal */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 mb-2 sm:mb-4 flex items-center justify-start">
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
      <div className="w-full bg-transparent pt-0 pb-6 sm:pb-8 overflow-hidden">
        <Marquee repeat={6} className="[--duration:36s] [--gap:3.5rem] sm:[--gap:6rem]">
          <div className="flex items-center gap-14 sm:gap-20 md:gap-24 lg:gap-28 select-none">
            {SPONSOR_LOGOS.map((sponsor, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-center shrink-0 h-16 sm:h-20 md:h-24 lg:h-28"
              >
                {/* Dark Logo (Active on White Background) */}
                <img
                  src={sponsor.src}
                  alt={sponsor.name}
                  style={{ opacity: 0.85 * (1 - progress) }}
                  className="h-full w-auto object-contain brightness-0 pointer-events-none select-none transition-opacity duration-150"
                />
                {/* White Logo (Active on Blue Background) */}
                <img
                  src={sponsor.src}
                  alt={sponsor.name}
                  style={{ opacity: 0.95 * progress }}
                  className="absolute top-0 left-0 h-full w-full object-contain brightness-0 invert pointer-events-none select-none transition-opacity duration-150"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
