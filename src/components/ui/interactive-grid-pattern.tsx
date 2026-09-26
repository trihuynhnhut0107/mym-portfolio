import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ActiveTileData {
  image: string;
  label?: string;
}

// 3 rows x 12 columns grid definition matching the project design
// Key is index: row * 12 + col
const TILES_3X12: Record<number, ActiveTileData> = {
  // Row 0
  0: {
    image: "/logos/project-logos/1_Zen Tactics.png",
    label: "ZenTactics\n(Livestream Channel)",
  },
  2: {
    image: "/logos/project-logos/2_Modern Football.png",
    label: "Modern Football",
  },
  4: {
    image: "/logos/project-logos/3_Zen Cine.png",
    label: "Zen Cine",
  },
  6: {
    image: "/logos/project-logos/4_Zen Esports.png",
    label: "Zen Esport",
  },
  8: {
    image: "/logos/project-logos/5_The Tactics Duo.png",
    label: "The Tactics Duo",
  },
  10: {
    image: "/logos/project-logos/6_Zen FIFA eWorld Cup.png",
    label: "Zen FIFA eWorld Cup",
  },

  // Row 1
  13: {
    image: "/logos/project-logos/7_Zentleman.png",
    label: "Zentlemen",
  },
  15: {
    image: "/logos/project-logos/8_HLV Online.png",
    label: "HLV Online",
  },
  17: {
    image: "/logos/project-logos/9_HLV Online Classic.png",
    label: "HLV Online Classic",
  },
  19: {
    image: "/logos/project-logos/10_HLV Onlive.png",
    label: "HLV Onlive",
  },
  21: {
    image: "/logos/project-logos/11_Cup Hoc Xem Bong.png",
    label: "Cup Hoc Xem Bong",
  },
  23: {
    image: "/logos/project-logos/12_Qua Bong Cuoi.png",
    label: "Qua Bong Cuoi",
  },

  // Row 2
  24: {
    image: "/logos/project-logos/Up coming.png",
    label: "Upcoming",
  },
  26: {
    image: "/logos/project-logos/Up coming.png",
    label: "Upcoming",
  },
  28: {
    image: "/logos/project-logos/13_Nem Ngon.png",
    label: "Nem Ngon",
  },
  30: {
    image: "/logos/project-logos/14_The Watcher.png",
    label: "The Watcher",
  },
  32: {
    image: "/logos/project-logos/Up coming.png",
    label: "Upcoming",
  },
  34: {
    image: "/logos/project-logos/Up coming.png",
    label: "Upcoming",
  },
};

const DEFAULT_IMAGES = [
  "/logos/project-logos/1_Zen Tactics.png",
  "/logos/project-logos/2_Modern Football.png",
  "/logos/project-logos/3_Zen Cine.png",
];

const DEFAULT_LABELS = ["Up-coming"];

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
  images?: string[];
  labels?: string[];
  persistent?: boolean;
}

// Deterministic pseudo-random generator [0, 1) based on seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999 + 12345) * 10000;
  return x - Math.floor(x);
}

export function InteractiveGridPattern({
  width = 160,
  height = 160,
  squares = [12, 3],
  className,
  squaresClassName,
  images = DEFAULT_IMAGES,
  labels = DEFAULT_LABELS,
  persistent = true,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [flippedSquares, setFlippedSquares] = useState<Set<number>>(
    () => new Set(),
  );

  const isDefault3x12 = horizontal === 12 && vertical === 3;

  const handleMouseEnter = (index: number) => {
    setHoveredSquare(index);
    if (persistent) {
      setFlippedSquares((prev) => {
        if (prev.has(index)) return prev;
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }
  };

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      viewBox={`0 0 ${width * horizontal} ${height * vertical}`}
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-auto",
        className,
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const col = index % horizontal;
        const row = Math.floor(index / horizontal);
        const x = col * width;
        const y = row * height;

        // Checkerboard pattern: Black tiles stay still no matter what
        const isBlackTile = (row + col) % 2 === 1;
        const isHovered = hoveredSquare === index;
        const isFlipped = flippedSquares.has(index);
        const isLockedOpen = isHovered || isFlipped;

        if (isBlackTile) {
          // The black tile directly below the active tile (row - 1, col)
          const aboveIndex = (row - 1) * horizontal + col;
          const isAboveLockedOpen =
            row > 0 &&
            (hoveredSquare === aboveIndex || flippedSquares.has(aboveIndex));

          const label =
            row > 0
              ? isDefault3x12 && TILES_3X12[aboveIndex]?.label
                ? TILES_3X12[aboveIndex].label
                : labels[
                    Math.floor(
                      pseudoRandom(aboveIndex * 19 + 3) * labels.length,
                    ) % labels.length
                  ]
              : "";

          return (
            <g
              key={index}
              className={row > 0 ? "cursor-pointer" : "pointer-events-none"}
              onMouseEnter={() => row > 0 && handleMouseEnter(aboveIndex)}
              onMouseLeave={() => setHoveredSquare(null)}
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                className={cn(
                  "fill-transparent stroke-white/10 dark:stroke-white/10 stroke-black/15",
                  squaresClassName,
                )}
              />
              {row > 0 && label && (
                <text
                  x={x + 14}
                  y={label.includes("\n") ? y + 20 : y + 24}
                  className={cn(
                    "font-sans text-[11px] font-medium tracking-wide fill-white select-none pointer-events-none transition-opacity duration-300 ease-in-out",
                    isAboveLockedOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  {label.split("\n").map((line, i) => (
                    <tspan key={i} x={x + 14} dy={i === 0 ? 0 : 13}>
                      {line}
                    </tspan>
                  ))}
                </text>
              )}
            </g>
          );
        }

        // Active tile
        const configuredTile = isDefault3x12 ? TILES_3X12[index] : undefined;
        const randImgIndex = Math.floor(
          pseudoRandom(index * 19 + 3) * images.length,
        );
        const imageSrc =
          configuredTile?.image ?? images[randImgIndex % images.length];
        const labelText =
          configuredTile?.label ?? labels[randImgIndex % labels.length];

        // Deterministic diagonal striping pattern: ((row + col) / 2) % 2 === 1 for blue, 0 for white
        const isBlue = ((row + col) / 2) % 2 === 1;

        // Bottom row active tile shows label at bottom if it has a label (e.g. Nem Ngon, The Watcher)
        const hasBottomLabel = row === vertical - 1 && Boolean(labelText);

        return (
          <g
            key={index}
            className="cursor-pointer"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          >
            {/* Base tile background: White / Blue diagonal striping when unrevealed, black when revealed */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              className={cn(
                "stroke-white/10 transition-all duration-300 ease-in-out",
                isLockedOpen
                  ? "fill-black"
                  : isBlue
                    ? "fill-[#253BFF]"
                    : "fill-white",
                squaresClassName,
              )}
            />

            {/* Tile image: revealed on hover */}
            <image
              href={imageSrc}
              x={x}
              y={y}
              width={width}
              height={hasBottomLabel ? height - 28 : height}
              preserveAspectRatio={
                hasBottomLabel ? "xMidYMid meet" : "xMidYMid slice"
              }
              className={cn(
                "transition-opacity duration-300 ease-in-out pointer-events-none",
                isLockedOpen ? "opacity-100" : "opacity-0",
              )}
            />

            {/* For the bottom row active cells with label (Nem Ngon, The Watcher), show divider and label */}
            {hasBottomLabel && (
              <>
                <line
                  x1={x}
                  y1={y + height - 28}
                  x2={x + width}
                  y2={y + height - 28}
                  className="stroke-white/10"
                  strokeWidth={1}
                />
                <text
                  x={x + 14}
                  y={y + height - 10}
                  className={cn(
                    "font-sans text-[11px] font-medium tracking-wide fill-white select-none pointer-events-none transition-opacity duration-300 ease-in-out",
                    isLockedOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  {labelText}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
