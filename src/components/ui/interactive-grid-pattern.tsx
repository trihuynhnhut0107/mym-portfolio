import React, { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_ZEN_IMAGES = [
  "/logos/zen-tactics/1.jpg",
  "/logos/zen-tactics/3.jpg",
  "/logos/zen-tactics/4.jpg",
];

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
  images?: string[];
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
        "absolute inset-0 h-full w-full border border-white/5 pointer-events-auto",
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
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              className={cn(
                "fill-transparent stroke-white/10 dark:stroke-white/10 stroke-black/15 pointer-events-none",
                squaresClassName,
              )}
            />
          );
        }

        // Pseudo-randomized parameters for non-linear, organic flashing across grid
        const randDelay = pseudoRandom(index * 7 + 1);
        const randDuration = 2.5 + pseudoRandom(index * 13 + 2) * 2;
        const randImgIndex = Math.floor(
          pseudoRandom(index * 19 + 3) * images.length,
        );
        const startWithBlue = pseudoRandom(index * 23 + 4) > 0.5;

        const imageSrc = images[randImgIndex % images.length];
        const delay = Math.round(randDelay * 4000) / 1000; // 0s to 4s
        const duration = Math.round(randDuration * 100) / 100; // 2.5s to 4.5s

        return (
          <g
            key={index}
            className="cursor-pointer"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          >
            {/* Base tile background: Flashes between White & Blue when not locked open */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              className={cn(
                "stroke-white/10 transition-all duration-300 ease-in-out",
                isLockedOpen
                  ? "fill-black"
                  : startWithBlue
                    ? "animate-blue-white-flash"
                    : "animate-white-blue-flash",
                squaresClassName,
              )}
              style={
                isLockedOpen
                  ? { animation: "none" }
                  : {
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }
              }
            />

            {/* Tile image: Flashes in (visible) & out (hidden) when not hovered; locks to opacity 1 when hovered/flipped */}
            <image
              href={imageSrc}
              x={x}
              y={y}
              width={width}
              height={height}
              preserveAspectRatio="xMidYMid slice"
              className={cn(
                "transition-opacity duration-300 ease-in-out pointer-events-none",
                isLockedOpen ? "opacity-100" : "animate-image-flash",
              )}
              style={
                isLockedOpen
                  ? { animation: "none", opacity: 1 }
                  : {
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }
              }
            />
          </g>
        );
      })}
    </svg>
  );
}
