import type { ProjectDetail } from "@/data/projectsData";
import { MediaSlot } from "./MediaSlot";
import { resolveSlotMedia } from "./slotResolver";
import type { SlotResolvedMedia } from "./slotResolver";

export interface Layout17SlotsProps {
  project: ProjectDetail;
  slots?: Record<number, SlotResolvedMedia>;
  onOpenMedia?: (url: string, title: string) => void;
}

export function Layout17Slots({
  project,
  slots,
  onOpenMedia,
}: Layout17SlotsProps) {
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

      {/* ROW 3: 3x Square Image 1000x1000 (Row of 3 Squares) */}
      <div className="grid grid-cols-3 gap-0">
        {getSlot(7, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(8, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(9, "Logo", "1:1", "1000x1000", "aspect-square")}
      </div>

      {/* ROW 4: Full Width Feature Video 1920x1080 */}
      <div className="w-full">
        {getSlot(10, "Video", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 5: 2x Image 1920x1080 (Row of 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {getSlot(11, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
        {getSlot(12, "Image", "16:9", "1920x1080", "aspect-[16/9]")}
      </div>

      {/* ROW 6: 5x Square Image 1000x1000 (Row of 5 Squares) */}
      <div className="grid grid-cols-5 gap-0">
        {getSlot(13, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(14, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(15, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(16, "Logo", "1:1", "1000x1000", "aspect-square")}
        {getSlot(17, "Logo", "1:1", "1000x1000", "aspect-square")}
      </div>
    </div>
  );
}
