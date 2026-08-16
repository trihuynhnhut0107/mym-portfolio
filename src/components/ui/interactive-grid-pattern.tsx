import React, { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_ZEN_IMAGES = [
  "/logos/zen-tactics/1.jpg",
  "/logos/zen-tactics/3.jpg",
  "/logos/zen-tactics/4.jpg",
];

const DEFAULT_LABELS = ["Zen Tactics"];

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
  squares = [20, 12],
  className,
  squaresClassName,
  images = DEFAULT_ZEN_IMAGES,
  labels = DEFAULT_LABELS,
  persistent = true,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [flippedSquares, setFlippedSquares] = useState<Set<number>>(
    () => new Set(),
  );

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
          const aboveRandImgIndex =
            row > 0
              ? Math.floor(pseudoRandom(aboveIndex * 19 + 3) * images.length)
              : 0;
          const label =
            row > 0 ? labels[aboveRandImgIndex % labels.length] : "";

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
                  y={y + 24}
                  className={cn(
                    "font-sans text-[11px] font-medium tracking-wide fill-white select-none pointer-events-none transition-opacity duration-300 ease-in-out",
                    isAboveLockedOpen ? "opacity-100" : "opacity-0",
                  )}
                >
                  {label}
                </text>
              )}
              {/* Thin line between grid and bottom marquee for text */}
              {row === vertical - 1 && (
                <line
                  x1={x}
                  y1={y + height - 28}
                  x2={x + width}
                  y2={y + height - 28}
                  className="stroke-white/10"
                  strokeWidth={1}
                />
              )}
            </g>
          );
        }

        const randImgIndex = Math.floor(
          pseudoRandom(index * 19 + 3) * images.length,
        );
        // Deterministic diagonal striping pattern: ((row + col) / 2) % 2 === 1 for blue, 0 for white
        const isBlue = ((row + col) / 2) % 2 === 1;
        const imageSrc = images[randImgIndex % images.length];
        const labelText = labels[randImgIndex % labels.length];

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
              height={row === vertical - 1 ? height - 28 : height}
              preserveAspectRatio="xMidYMid slice"
              className={cn(
                "transition-opacity duration-300 ease-in-out pointer-events-none",
                isLockedOpen ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Thin line between bottom grid cell and bottom marquee for text */}
            {row === vertical - 1 && (
              <line
                x1={x}
                y1={y + height - 28}
                x2={x + width}
                y2={y + height - 28}
                className="stroke-white/10"
                strokeWidth={1}
              />
            )}

            {/* For the bottom row active cells with no row below them, show label right at the bottom edge */}
            {row === vertical - 1 && (
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
            )}
          </g>
        );
      })}
    </svg>
  );
}
