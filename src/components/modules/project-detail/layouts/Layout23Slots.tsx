import type { ProjectDetail } from "@/data/projectsData";
import { MediaSlot } from "./MediaSlot";
import { resolveSlotMedia } from "./slotResolver";
import type { SlotResolvedMedia } from "./slotResolver";

export interface Layout23SlotsProps {
  project: ProjectDetail;
  slots?: Record<number, SlotResolvedMedia>;
  playingSlotId?: number | null;
  onStartPlaySlot?: (slotId: number | null) => void;
  onOpenMedia?: (url: string, title: string) => void;
}

export function Layout23Slots({
  project,
  slots,
  playingSlotId,
  onStartPlaySlot,
  onOpenMedia,
}: Layout23SlotsProps) {
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

      {/* ROW 3: 2x Video 1080x1920 (flex-[162]) + Image 1920x1080 (flex-[256]) */}
      <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
        <div className="w-full md:w-auto md:flex-[162] grid grid-cols-2 gap-0">
          {getSlot(7, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
          {getSlot(8, "Video", "9:16", "1080x1920", "aspect-[9/16]")}
        </div>
        <div className="w-full md:w-auto md:flex-[256]">
          {getSlot(9, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        </div>
      </div>

      {/* ROW 4: Complex Asymmetric 4 Columns (Perfect Height Matching) */}
      <div className="flex flex-col md:flex-row w-full gap-0 items-stretch">
        {/* Col 1: Stack of 2 Horizontal Images (flex-[384]) */}
        <div className="w-full md:w-auto md:flex-[384] flex flex-col gap-0">
          {getSlot(10, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
          {getSlot(11, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        </div>

        {/* Col 2: Vertical Image 1080x1920 (flex-[243]) */}
        <div className="w-full md:w-auto md:flex-[243]">
          {getSlot(12, "Image", "9:16", "1080x1920", "aspect-[9/16]")}
        </div>

        {/* Col 3: Stack of 3 Horizontal Images (flex-[256]) */}
        <div className="w-full md:w-auto md:flex-[256] flex flex-col gap-0 justify-between">
          {getSlot(13, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
          {getSlot(14, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
          {getSlot(15, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        </div>

        {/* Col 4: Vertical Image 1080x1920 (flex-[243]) */}
        <div className="w-full md:w-auto md:flex-[243]">
          {getSlot(16, "Image", "9:16", "1080x1920", "aspect-[9/16]")}
        </div>
      </div>

      {/* ROW 5: Full Width Feature Video 1920x1080 */}
      <div className="w-full">
        {getSlot(17, "Video", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 6: 2x Image 1920x1080 (Row of 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {getSlot(18, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(19, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 7: 4x Image 1920x1080 (Row of 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
        {getSlot(20, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(21, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(22, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(23, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>
    </div>
  );
}
