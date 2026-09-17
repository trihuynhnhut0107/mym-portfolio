import type { ProjectDetail } from "@/data/projectsData";

export interface SlotResolvedMedia {
  url?: string;
  thumbnail?: string;
  type?: "Video" | "Image" | "Logo";
  title?: string;
  isVideo?: boolean;
}

export const PROJECT_VIDEO_THUMBNAILS: Record<string, string> = {
  "1iUfXeqNqXsCUNN66TlSX2c53nDPnybeL": "/images/zen-tactics/1.jpg",
  "1PsO8fLA9SUn6HzAfCUQCT4ETE3ztca3F": "/images/zen-tactics/17.jpg",
  "1gJsr_2d2FDO2fGnXxOUk1_hiGYoCuqKs": "/images/zen-tactics/7.jpg",
  "1--QabvWWob7rTjmlqAS5BO8VJIDddazM": "/images/zen-tactics/8.jpg",
  "1wPp6zFc5Jzz4lDfGOZN3rHIKmk9WrzAa": "/images/modern-football/1.jpg",
  "1hiiwMSHkMjRDs48cad0dCLHwZrXFumev": "/images/modern-football/17.jpg",
  "1B5vdu5vfm48xU6MLpZ7xZ3QKkarEcdF1": "/images/modern-football/7.jpg",
  "1PFRTMcV4vx8kqdQF30PV6SKNRgy0H7MW": "/images/modern-football/8.jpg",
  "1U8AjTgqTH05V9PaUw__zEtPzsZgfyCID": "/images/zen-cine-esports/1.jpg",
  "1IQi9wXG77nfLRBVDPnkQuP38TywEd8yL": "/images/zen-cine-esports/6.jpg",
  "1hv5HhGLvnmBaBAAQ1akQd6PnKdSFhalf": "/images/tactics-duo/1.jpg",
  "1iQfPlxsmZGWcdiTi4ThbP0c6hBwJSJiX": "/images/tactics-duo/7.jpg",
  "1pjXf7hlm1-8QkPOhLbqoG6qsv5Gg39Q0": "/images/hlv-online/1.jpg",
  "1zsZVLCyKolS3gVdRR0wYecKhwFjJ427f": "/images/hlv-online/17.jpg",
  "1z7Hfv3E0Kgocw-lZVOvqFPZ7gVP4OKjI": "/images/hlv-online/7.jpg",
  "1nwYORA8hSB9U7ALh6SH5pe69HvCAy8nf": "/images/hlv-online/8.jpg",
  "1w88XRlAu0XT_fD1GNPMtuXQBGZ8gm3n8": "/images/hlv-online-classic/1.jpg",
  "1EKgLB-TBbor5w_AFsNcPAYnPUbbiVSzK": "/images/hlv-online-classic/17.jpg",
  "1kcT1b_QLJ9FkAJAtZ8pOxnfvXT6Ividt": "/images/hlv-online-classic/7.jpg",
  "1lbHCnSD3z6yyr0ilcxK8AW3GhdFefeXN": "/images/hlv-online-classic/8.jpg",
  "1cvZtNdX-n2coqjUjD8WGDqLtFwBSxB0T": "/images/hlv-onlive/1.jpg",
  "1Xz1Kz5ppNhRzYzztR2baJzjDHVlXlFLB": "/images/cup-hoc-xem-bong/1.jpg",
  "1DbZF75YQNZgmHSjpwKP7MOI_Rx3nUo7K": "/images/cup-hoc-xem-bong/7.jpg",
  "1TQDqofOdKf6DpSWdXQUdRs3fvkJXnXhv": "/images/cup-hoc-xem-bong/8.jpg",
};

export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // 1. YouTube
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|user\/\S+|live\/\S+))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  // 2. Google Drive Video Preview
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  );
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0`;
  }

  return null;
}

export function getDirectVideoUrl(url?: string): string | null {
  if (!url) return null;
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  );
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.usercontent.google.com/download?id=${gdriveMatch[1]}&export=download`;
  }
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("/download")) {
    return url;
  }
  return null;
}

export function getVideoThumbnail(url: string): string | null {
  if (!url) return null;

  // 1. YouTube
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|user\/\S+|live\/\S+))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 2. Google Drive Video
  const gdriveMatch = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]+)/
  );
  if (gdriveMatch && gdriveMatch[1]) {
    const gid = gdriveMatch[1];
    if (PROJECT_VIDEO_THUMBNAILS[gid]) {
      return PROJECT_VIDEO_THUMBNAILS[gid];
    }
    return `https://lh3.googleusercontent.com/d/${gid}=w1920-h1080`;
  }

  return null;
}

/**
 * Resolves the appropriate media for a given slot ID within a project.
 * Implements strict id = filename convention:
 * slot 1 -> 1.jpg, 1.png, or video with thumbnail 1.jpg
 */
export function resolveSlotMedia(
  project?: ProjectDetail,
  slotId?: number,
  defaultType: "Video" | "Image" | "Logo" = "Image"
): SlotResolvedMedia | null {
  if (!project || slotId === undefined || slotId === null) return null;
  const pid = project.id;

  // 1. Special case embeds in projectsData
  if (pid === "hlv-onlive" && slotId === 7) {
    return {
      url: "https://www.youtube.com/live/h4IuJqvGYZY",
      type: "Video",
      isVideo: true,
      title: `${project.title} - Video #${slotId}`,
    };
  }

  if (pid === "cup-hoc-xem-bong" && slotId === 17) {
    return {
      url: "https://www.youtube.com/watch?v=ep_oOmFukpY",
      type: "Video",
      isVideo: true,
      title: `${project.title} - Video #${slotId}`,
    };
  }

  // 2. Search project.media array
  if (project.media && project.media.length > 0) {
    // Check videos first by thumbnail mapping
    for (const m of project.media) {
      if (m.kind === "video" || m.kind === "embed") {
        for (const [gid, thumb] of Object.entries(PROJECT_VIDEO_THUMBNAILS)) {
          if (m.src.includes(gid) && thumb.includes(`/${pid}/${slotId}.`)) {
            return {
              url: m.src,
              thumbnail: thumb,
              type: "Video",
              isVideo: true,
              title: m.title || `${project.title} - Slot #${slotId}`,
            };
          }
        }
      }
    }

    // Check images or files matching `/${slotId}.` or `/${slotId}(` or `/${slotId}.jpg.png`
    for (const m of project.media) {
      const matchRegex = new RegExp(
        `/(?:${pid}/)?${slotId}(?:\\.[a-z0-9.]+)?\\.(?:png|jpg|jpeg|webp)(?:\\?|$)`,
        "i"
      );
      if (matchRegex.test(m.src)) {
        const isVid = m.kind === "video" || m.kind === "embed";
        return {
          url: m.src,
          thumbnail: isVid ? getVideoThumbnail(m.src) || undefined : undefined,
          type: isVid ? "Video" : defaultType,
          isVideo: isVid,
          title: m.title || `${project.title} - Slot #${slotId}`,
        };
      }
    }

    // Fallback for modern-football slot 22 -> 23.png, slot 23 -> 24.png if 22 is missing
    if (pid === "modern-football") {
      if (slotId === 22) {
        const item = project.media.find((m) => m.src.includes("/23.png"));
        if (item) return { url: item.src, type: "Image", isVideo: false, title: `${project.title} - Slot #22` };
      }
      if (slotId === 23) {
        const item = project.media.find((m) => m.src.includes("/24.png"));
        if (item) return { url: item.src, type: "Image", isVideo: false, title: `${project.title} - Slot #23` };
      }
    }
  }

  return null;
}
