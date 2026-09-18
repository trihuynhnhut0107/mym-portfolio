import type { ProjectDetail } from "@/data/projectsData";
import { MediaSlot } from "./MediaSlot";
import { resolveSlotMedia } from "./slotResolver";
import type { SlotResolvedMedia } from "./slotResolver";

export interface Layout13SlotsProps {
  project: ProjectDetail;
  slots?: Record<number, SlotResolvedMedia>;
  playingSlotId?: number | null;
  onStartPlaySlot?: (slotId: number | null) => void;
  onOpenMedia?: (url: string, title: string) => void;
}

export function Layout13Slots({
  project,
  slots,
  playingSlotId,
  onStartPlaySlot,
  onOpenMedia,
}: Layout13SlotsProps) {
  const getSlot = (
    id: number,
    type: "Video" | "Image" | "Logo",
    aspect: "16:9" | "9:16" | "1:1",
    resolution: "1920x1080" | "1000x1000" | "1080x1920",
    aspectClass: string,
    className = ""
  ) => {
    const resolved = slots?.[id] || resolveSlotMedia(project, id, type);
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
        isPlayingInline={playingSlotId === id}
        onStartPlay={onStartPlaySlot}
        onOpen={onOpenMedia}
      />
    );
  };

  return (
    <div className="w-full flex flex-col gap-0">
      {/* ROW 1: Video 1920x1080 (flex-[32]) + 2x Logo 1000x1000 Stack (flex-[9]) */}
      <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
        <div className="w-full md:w-auto md:flex-[32]">
          {getSlot(1, "Video", "16:9", "1920x1080", "aspect-[16/9]")}
        </div>
        <div className="w-full md:w-auto md:flex-[9] flex flex-row md:flex-col gap-0">
          {getSlot(2, "Logo", "1:1", "1000x1000", "aspect-square")}
          {getSlot(3, "Logo", "1:1", "1000x1000", "aspect-square")}
        </div>
      </div>

      {/* ROW 2: 3x Image 1920x1080 (Row of 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        {getSlot(4, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(5, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(6, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 3: Full Width Feature Video 1920x1080 */}
      <div className="w-full">
        {getSlot(7, "Video", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 4: 2x Image 1920x1080 (Row of 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {getSlot(8, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(9, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 5: 4x Image 1920x1080 (Row of 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
        {getSlot(10, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(11, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(12, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(13, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>
    </div>
  );
}
