import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Safari, SAFARI_FRAME } from "@/components/ui/safari";

const REST = 0.58;

const SITES = {
  zentlemen: {
    id: "zentlemen",
    name: "Zentlemen",
    year: "2022",
    url: "zentlemen.vn",
    image: "/images/ux-ui/zentlemen.webp",
    project: "/project/zentlemen",
  },
  watcher: {
    id: "the-watcher",
    name: "The Watcher",
    year: "2025",
    url: "thewatcherxiii.info",
    image: "/images/ux-ui/the-watcher.webp",
    project: "/project/the-watcher",
  },
} as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function labelOpacity(share: number) {
  return Math.min(1, Math.max(0, (share - 0.08) / 0.22));
}

export function UxUiDesignerView() {
  return <WebsiteCompare />;
}

function WebsiteCompare() {
  const frameRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const [position, setPosition] = useState(REST);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const timeout = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        if (interacted.current) return;
        const t = Math.min(1, (now - start) / 900);
        setPosition(REST + Math.sin(t * Math.PI) * 0.08);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 450);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0) return;
    interacted.current = true;
    setPosition(clamp01((clientX - rect.left) / rect.width));
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      gripRef.current?.focus();
      setFromClientX(event.clientX);
    },
    [setFromClientX],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      setFromClientX(event.clientX);
    },
    [setFromClientX],
  );

  const nudge = useCallback((delta: number) => {
    interacted.current = true;
    setPosition((current) => clamp01(current + delta));
  }, []);

  const onGripKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    nudge(event.key === "ArrowRight" ? 0.04 : -0.04);
  };

  const zentlemenShare = position;
  const watcherShare = 1 - position;
  const dominant = position >= 0.5 ? SITES.zentlemen : SITES.watcher;

  const gripLeft =
    ((SAFARI_FRAME.screenX + position * SAFARI_FRAME.screenWidth) /
      SAFARI_FRAME.width) *
    100;
  const gripTop =
    ((SAFARI_FRAME.screenY + SAFARI_FRAME.screenHeight / 2) /
      SAFARI_FRAME.height) *
    100;

  return (
    <div data-website-compare="">
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: "min(100%, calc(52vh * 1203 / 753))" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <Safari
          url={dominant.url}
          className="w-full shadow-2xl border border-white/10 rounded-[12px] overflow-hidden"
        >
          <div
            ref={frameRef}
            className="relative h-full w-full cursor-ew-resize touch-none select-none bg-[#05050A]"
          >
            <img
              src={SITES.watcher.image}
              alt="The Watcher homepage"
              draggable={false}
              className="absolute inset-0 size-full object-cover object-top"
            />
            <img
              src={SITES.zentlemen.image}
              alt="Zentlemen homepage"
              draggable={false}
              className="absolute inset-0 size-full object-cover object-top"
              style={{ clipPath: `inset(0 ${(1 - position) * 100}% 0 0)` }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.55)]"
              style={{ left: `${position * 100}%` }}
            />
          </div>
        </Safari>
        <button
          ref={gripRef}
          type="button"
          role="slider"
          aria-label="Drag to compare Zentlemen and The Watcher"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position * 100)}
          aria-valuetext={dominant.name}
          onKeyDown={onGripKeyDown}
          className="absolute z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#253BFF] text-white shadow-lg shadow-blue-950/40 cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ left: `${gripLeft}%`, top: `${gripTop}%` }}
        >
          <ChevronLeft className="w-3.5 h-3.5 -mr-1" />
          <ChevronRight className="w-3.5 h-3.5 -ml-1" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <SiteLabel
          site={SITES.zentlemen}
          align="start"
          opacity={labelOpacity(zentlemenShare)}
          active={dominant.id === SITES.zentlemen.id}
          onSnap={() => {
            interacted.current = true;
            setPosition(1);
          }}
        />
        <SiteLabel
          site={SITES.watcher}
          align="end"
          opacity={labelOpacity(watcherShare)}
          active={dominant.id === SITES.watcher.id}
          onSnap={() => {
            interacted.current = true;
            setPosition(0);
          }}
        />
      </div>
    </div>
  );
}

function SiteLabel({
  site,
  align,
  opacity,
  active,
  onSnap,
}: {
  site: (typeof SITES)[keyof typeof SITES];
  align: "start" | "end";
  opacity: number;
  active: boolean;
  onSnap: () => void;
}) {
  return (
    <div
      className={`min-w-0 ${align === "end" ? "text-right" : "text-left"}`}
      style={{ opacity }}
    >
      <button
        type="button"
        onClick={onSnap}
        className="font-funnel text-sm sm:text-base font-bold text-white cursor-pointer"
      >
        {site.name}
        <span className="ml-2 text-xs font-roboto font-medium text-white/60">
          {site.year}
        </span>
      </button>
      {active && (
        <Link
          to={site.project}
          className={`mt-1 block text-[11px] sm:text-xs font-roboto text-[#A8B6FF] hover:text-white ${
            align === "end" ? "text-right" : "text-left"
          }`}
        >
          View project
        </Link>
      )}
    </div>
  );
}
