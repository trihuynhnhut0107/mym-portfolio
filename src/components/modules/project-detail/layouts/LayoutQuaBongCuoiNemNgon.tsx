import { useState, useEffect } from "react";
import type { ProjectDetail } from "@/data/projectsData";
import { MediaSlot } from "./MediaSlot";
import { resolveSlotMedia } from "./slotResolver";
import type { SlotResolvedMedia } from "./slotResolver";
import { getTopChannelVideos } from "@/lib/youtube";
import type { YouTubeVideo } from "@/lib/youtube";

export interface LayoutQuaBongCuoiNemNgonProps {
  project: ProjectDetail;
  slots?: Record<number, SlotResolvedMedia>;
  onOpenMedia?: (url: string, title: string) => void;
}

export function LayoutQuaBongCuoiNemNgon({
  project,
  slots,
  onOpenMedia,
}: LayoutQuaBongCuoiNemNgonProps) {
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadVideos() {
      try {
        const [nemNgon, quaBong] = await Promise.all([
          getTopChannelVideos("nem-ngon", 5),
          getTopChannelVideos("qua-bong-cuoi", 5),
        ]);
        if (isMounted) {
          // Alternate videos between channels
          const combined: YouTubeVideo[] = [];
          const max = Math.max(nemNgon.length, quaBong.length);
          for (let i = 0; i < max; i++) {
            if (nemNgon[i]) combined.push(nemNgon[i]);
            if (quaBong[i]) combined.push(quaBong[i]);
          }
          setChannelVideos(combined);
        }
      } catch {
        // Fallback to static resolution
      }
    }
    loadVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  const getSlot = (
    id: number,
    type: "Video" | "Image" | "Logo",
    aspect: "16:9" | "9:16" | "1:1",
    resolution: "1920x1080" | "1000x1000" | "1080x1920",
    aspectClass: string,
    className = ""
  ) => {
    // 1. Check explicit slot override or static resolver
    let resolved = slots?.[id] || resolveSlotMedia(project, id, type);

    // 2. If slot is 4..12 and channel video is available, use it
    if (!resolved?.url && id >= 4 && id <= 12) {
      const vidIndex = id - 4;
      const vid = channelVideos[vidIndex];
      if (vid) {
        resolved = {
          url: `https://www.youtube.com/watch?v=${vid.id}`,
          thumbnail: vid.thumbnail,
          type: "Video",
          title: vid.title,
          isVideo: true,
        };
      }
    }

    return (
      <MediaSlot
        slotId={id}
        type={resolved?.type || type}
        aspect={aspect}
        resolution={resolution}
        aspectClass={aspectClass}
        url={resolved?.url}
        thumbnail={resolved?.thumbnail}
        title={resolved?.title}
        className={className}
        onOpen={onOpenMedia}
      />
    );
  };

  return (
    <div className="w-full flex flex-col gap-0">
      {/* ROW 1: Logo 1:1 (flex-[9]) + Logo 1:1 (flex-[9]) + Horizontal 16:9 (flex-[16]) */}
      <div className="flex flex-col sm:flex-row w-full gap-0 items-stretch">
        <div className="w-full sm:w-auto sm:flex-[9]">
          {getSlot(1, "Logo", "1:1", "1000x1000", "aspect-square")}
        </div>
        <div className="w-full sm:w-auto sm:flex-[9]">
          {getSlot(2, "Logo", "1:1", "1000x1000", "aspect-square")}
        </div>
        <div className="w-full sm:w-auto sm:flex-[16]">
          {getSlot(3, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        </div>
      </div>

      {/* ROW 2: Featured 9:16 (50% Width) + 2x2 Grid 9:16 (50% Width) */}
      <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
        {/* Left 50%: Large 9:16 Vertical Video/Short */}
        <div className="w-full md:w-1/2">
          {getSlot(4, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        </div>

        {/* Right 50%: 2x2 Grid of 9:16 Vertical Videos (Height equals Left Column) */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-0">
          {getSlot(5, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
          {getSlot(6, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
          {getSlot(7, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
          {getSlot(8, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        </div>
      </div>

      {/* ROW 3: 4x 9:16 Vertical Shorts/Reels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
        {getSlot(9, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        {getSlot(10, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        {getSlot(11, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        {getSlot(12, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
      </div>
    </div>
  );
}
