export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

const CHANNELS = { "nem-ngon": "@NemNgon123", "qua-bong-cuoi": "@Quabongkhoc" } as const;
const CACHE_MS = 24 * 60 * 60 * 1000;

export async function getTopChannelVideos(channel: keyof typeof CHANNELS, limit = 8): Promise<YouTubeVideo[]> {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!key) return [];
  const cacheKey = `mym-youtube-${channel}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { expires, videos } = JSON.parse(cached) as { expires: number; videos: YouTubeVideo[] };
    if (expires > Date.now()) return videos;
  }
  const handle = CHANNELS[channel];
  const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${key}`);
  const channelData = await channelResponse.json() as { items?: Array<{ id: string }> };
  const channelId = channelData.items?.[0]?.id;
  if (!channelId) return [];
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=viewCount&videoEmbeddable=true&maxResults=${limit}&key=${key}`);
  const data = await response.json() as { items?: Array<{ id: { videoId: string }; snippet: { title: string; thumbnails: { high?: { url: string }; medium?: { url: string } } } }> };
  const videos = (data.items ?? []).map(({ id, snippet }) => ({ id: id.videoId, title: snippet.title, thumbnail: snippet.thumbnails.high?.url ?? snippet.thumbnails.medium?.url ?? "" }));
  localStorage.setItem(cacheKey, JSON.stringify({ expires: Date.now() + CACHE_MS, videos }));
  return videos;
}
