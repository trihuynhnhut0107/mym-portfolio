export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

const CHANNELS = { "nem-ngon": "@NemNgon123", "qua-bong-cuoi": "@Quabongkhoc" } as const;
const CACHE_MS = 24 * 60 * 60 * 1000;

const FALLBACK_VIDEOS: Record<keyof typeof CHANNELS, YouTubeVideo[]> = {
  "nem-ngon": [
    { id: "pYrge1VO_n8", title: "Mỡ lợn thật ra cũng bị oan?", thumbnail: "https://i.ytimg.com/vi/pYrge1VO_n8/hqdefault.jpg" },
    { id: "lc_YY3ui4nE", title: "Bánh cam mà không có cam?", thumbnail: "https://i.ytimg.com/vi/lc_YY3ui4nE/hqdefault.jpg" },
    { id: "k2jYkhiD-B0", title: "Đây mới là xiên bẩn thật thụ?", thumbnail: "https://i.ytimg.com/vi/k2jYkhiD-B0/hqdefault.jpg" },
    { id: "Y_A2GSPjNRw", title: "Sushi đã cứu cá ngừ 1 bàn thua?", thumbnail: "https://i.ytimg.com/vi/Y_A2GSPjNRw/hqdefault.jpg" },
    { id: "tlX5CrA7Idg", title: "Gà khổng lồ của Đài Loan bịp phết", thumbnail: "https://i.ytimg.com/vi/tlX5CrA7Idg/hqdefault.jpg" },
  ],
  "qua-bong-cuoi": [
    { id: "BZK-jaIRlnE", title: "Đây là đỉnh cao của bóng đá Đông Nam Á", thumbnail: "https://i.ytimg.com/vi/BZK-jaIRlnE/hqdefault.jpg" },
    { id: "8FrsrqjJOZY", title: "Quả bóng vàng 2026 sẽ thuộc về ai?", thumbnail: "https://i.ytimg.com/vi/8FrsrqjJOZY/hqdefault.jpg" },
    { id: "BtU7vOO4RdM", title: "Tier list big 6 mùa này", thumbnail: "https://i.ytimg.com/vi/BtU7vOO4RdM/hqdefault.jpg" },
    { id: "GHOhFVrc9do", title: "El Clasico năm sau sẽ rất đáng xem", thumbnail: "https://i.ytimg.com/vi/GHOhFVrc9do/hqdefault.jpg" },
    { id: "VuViZOuZ7ps", title: "Dấu ấn của thầy Tạ tại World Cup", thumbnail: "https://i.ytimg.com/vi/VuViZOuZ7ps/hqdefault.jpg" },
  ],
};

export async function getTopChannelVideos(channel: keyof typeof CHANNELS, limit = 5): Promise<YouTubeVideo[]> {
  const fallback = FALLBACK_VIDEOS[channel] || [];
  const key = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!key) return fallback.slice(0, limit);

  const cacheKey = `mym-youtube-${channel}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { expires, videos } = JSON.parse(cached) as { expires: number; videos: YouTubeVideo[] };
      if (expires > Date.now() && Array.isArray(videos) && videos.length > 0) return videos.slice(0, limit);
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const handle = CHANNELS[channel];
    const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${key}`);
    if (!channelResponse.ok) return fallback.slice(0, limit);
    const channelData = await channelResponse.json() as { items?: Array<{ id: string }> };
    const channelId = channelData.items?.[0]?.id;
    if (!channelId) return fallback.slice(0, limit);

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=viewCount&videoEmbeddable=true&maxResults=${limit}&key=${key}`);
    if (!response.ok) return fallback.slice(0, limit);
    const data = await response.json() as { items?: Array<{ id: { videoId?: string }; snippet: { title: string; thumbnails: { high?: { url: string }; medium?: { url: string } } } }> };
    const videos: YouTubeVideo[] = (data.items ?? [])
      .filter((item) => item.id?.videoId)
      .map(({ id, snippet }) => ({
        id: id.videoId!,
        title: snippet.title,
        thumbnail: snippet.thumbnails.high?.url ?? snippet.thumbnails.medium?.url ?? `https://i.ytimg.com/vi/${id.videoId}/hqdefault.jpg`,
      }));

    if (videos.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ expires: Date.now() + CACHE_MS, videos }));
      } catch {}
      return videos;
    }
  } catch {
    // Return fallback on network error
  }

  return fallback.slice(0, limit);
}

