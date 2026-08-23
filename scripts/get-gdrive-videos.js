#!/usr/bin/env node

/**
 * 🎬 Google Drive Public Folder Video Extractor
 *
 * Extracts all video files from publicly shared Google Drive folders and
 * generates valid, iframe-embeddable preview URLs:
 * https://drive.google.com/file/d/{FILE_ID}/preview
 *
 * Usage:
 *   node scripts/get-gdrive-videos.js "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
 *   node scripts/get-gdrive-videos.js folder1_url folder2_url --json
 *   node scripts/get-gdrive-videos.js --ts
 *   npm run get-gdrive-videos
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Video extensions & MIME type patterns
const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "mov",
  "m4v",
  "mkv",
  "webm",
  "avi",
  "wmv",
  "flv",
  "ts",
  "3gp",
  "mpeg",
  "mpg",
  "ogv",
]);

// ANSI Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
};

/**
 * Extract clean Google Drive Folder ID from various URL formats
 */
export function extractFolderId(urlOrId) {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();

  // Pattern 1: /folders/FOLDER_ID
  const matchFolders = clean.match(/folders\/([\w-]+)/i);
  if (matchFolders && matchFolders[1]) return matchFolders[1];

  // Pattern 2: id=FOLDER_ID or open?id=FOLDER_ID
  const matchIdParam = clean.match(/[?&]id=([\w-]+)/i);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: direct ID string (typically 25-45 alphanumeric/dash chars)
  if (/^[\w-]{20,60}$/.test(clean)) {
    return clean;
  }

  return null;
}

/**
 * Check if a filename or mimeType belongs to a video
 */
export function isVideoFile(fileName = "", mimeType = "") {
  if (mimeType && mimeType.toLowerCase().startsWith("video/")) {
    return true;
  }
  const extMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (extMatch && VIDEO_EXTENSIONS.has(extMatch[1])) {
    return true;
  }
  return false;
}

/**
 * Create valid iframe embed URL and standard view links for a file ID
 */
export function createVideoUrls(fileId, fileName = "") {
  return {
    id: fileId,
    name: fileName,
    // The standard, universal iframe preview URL for Google Drive videos
    iframePreviewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
    directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920-h1080`,
    iframeHtml: `<iframe src="https://drive.google.com/file/d/${fileId}/preview" width="100%" height="100%" allow="autoplay" allowfullscreen></iframe>`,
  };
}

/**
 * Method 1: Fetch via Google Drive API (if API Key provided)
 */
async function fetchViaApi(folderId, apiKey) {
  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent("files(id, name, mimeType, size, videoMediaMetadata, webViewLink)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.files || !Array.isArray(data.files)) return null;

    return data.files
      .filter((f) => isVideoFile(f.name, f.mimeType))
      .map((f) => createVideoUrls(f.id, f.name));
  } catch (e) {
    return null;
  }
}

/**
 * Method 2: Fetch via Google Drive embedded folderview
 */
async function fetchViaEmbeddedView(folderId) {
  const urls = [
    `https://drive.google.com/embeddedfolderview?id=${folderId}#list`,
    `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
  ];

  const videos = new Map();

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml",
        },
      });

      if (!res.ok) continue;
      const html = await res.text();

      // Pattern A: Match entry links href="https://drive.google.com/file/d/{id}/..."
      const linkRegex = /href=["'](?:https?:\/\/drive\.google\.com)?\/file\/d\/([\w-]+)\/(?:view|preview|edit)[^"']*["']/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const id = match[1];
        if (id && !videos.has(id)) {
          videos.set(id, createVideoUrls(id, `Drive Video ${id.slice(0, 6)}`));
        }
      }

      // Pattern B: Match flip-entry divs with title and id
      // <div class="flip-entry" id="entry-FILE_ID">...<div class="flip-entry-title">Title.mp4</div>
      const entryRegex = /id=["']entry-([\w-]+)["'][^>]*>([\s\S]*?)<\/div>/gi;
      let entryMatch;
      while ((entryMatch = entryRegex.exec(html)) !== null) {
        const id = entryMatch[1];
        const inner = entryMatch[2] || "";
        const titleMatch = inner.match(/class=["']flip-entry-title["'][^>]*>([^<]+)<\/div>/i);
        const name = titleMatch ? titleMatch[1].trim() : `Video ${id.slice(0, 6)}`;

        if (isVideoFile(name)) {
          videos.set(id, createVideoUrls(id, name));
        }
      }
    } catch (e) {
      // Continue to next fallback
    }
  }

  return videos.size > 0 ? Array.from(videos.values()) : null;
}

/**
 * Method 3: Fetch via main Google Drive web folder page and parse script data payload
 */
async function fetchViaWebFolder(folderId) {
  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) return null;
    const html = await res.text();
    const videos = new Map();

    // 1. Look for standard file/d/{id} occurrences
    const fileIdRegex = /\/file\/d\/([\w-]{25,})/g;
    let fileMatch;
    while ((fileMatch = fileIdRegex.exec(html)) !== null) {
      const id = fileMatch[1];
      if (id !== folderId && !videos.has(id)) {
        videos.set(id, createVideoUrls(id, `Video ${id.slice(0, 8)}`));
      }
    }

    // 2. Parse JSON-like arrays with video filenames and IDs: ["FILE_ID","filename.mp4",...]
    const videoExtRegex = /"([\w-]{25,})"\s*,\s*"([^"]+\.(?:mp4|mov|mkv|webm|avi|m4v|flv|ts|3gp))"/gi;
    let jsonMatch;
    while ((jsonMatch = videoExtRegex.exec(html)) !== null) {
      const id = jsonMatch[1];
      const name = jsonMatch[2];
      videos.set(id, createVideoUrls(id, name));
    }

    // 3. Reverse order: "filename.mp4","FILE_ID"
    const revRegex = /"([^"]+\.(?:mp4|mov|mkv|webm|avi|m4v|flv|ts|3gp))"\s*,\s*"([\w-]{25,})"/gi;
    let revMatch;
    while ((revMatch = revRegex.exec(html)) !== null) {
      const name = revMatch[1];
      const id = revMatch[2];
      videos.set(id, createVideoUrls(id, name));
    }

    return videos.size > 0 ? Array.from(videos.values()) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Scan a single Google Drive folder and return all video items
 */
export async function getVideosFromFolder(folderUrlOrId, apiKey = process.env.GOOGLE_API_KEY) {
  const folderId = extractFolderId(folderUrlOrId);
  if (!folderId) {
    throw new Error(`Invalid Google Drive folder URL or ID: "${folderUrlOrId}"`);
  }

  // 1. Try Google API if API key provided
  if (apiKey) {
    const apiResults = await fetchViaApi(folderId, apiKey);
    if (apiResults && apiResults.length > 0) {
      return { folderId, folderUrl: `https://drive.google.com/drive/folders/${folderId}`, videos: apiResults, source: "Google Drive API" };
    }
  }

  // 2. Try Embedded Folder View scraper
  const embeddedResults = await fetchViaEmbeddedView(folderId);
  if (embeddedResults && embeddedResults.length > 0) {
    return { folderId, folderUrl: `https://drive.google.com/drive/folders/${folderId}`, videos: embeddedResults, source: "Embedded View Scraper" };
  }

  // 3. Try Web Folder Page scraper
  const webResults = await fetchViaWebFolder(folderId);
  if (webResults && webResults.length > 0) {
    return { folderId, folderUrl: `https://drive.google.com/drive/folders/${folderId}`, videos: webResults, source: "Web Page Scraper" };
  }

  return {
    folderId,
    folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    videos: [],
    source: "None found (ensure folder is publicly shared to 'Anyone with link')",
  };
}

/**
 * Batch process an array of Google Drive folders
 */
export async function getVideosFromFolderArray(folderUrls = [], options = {}) {
  const results = [];

  for (let i = 0; i < folderUrls.length; i++) {
    const folderInput = folderUrls[i];
    try {
      const res = await getVideosFromFolder(folderInput, options.apiKey);
      results.push({
        input: folderInput,
        ...res,
      });
    } catch (err) {
      results.push({
        input: folderInput,
        error: err.message,
        videos: [],
      });
    }
  }

  return results;
}

/**
 * CLI Manual & Runner
 */
export async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${colors.bright}${colors.cyan}🎬 Google Drive Public Folder Video Extractor${colors.reset}

Extracts all videos from publicly shared Google Drive folders and generates
iframe-embeddable preview URLs: ${colors.green}https://drive.google.com/file/d/{FILE_ID}/preview${colors.reset}

${colors.bright}USAGE:${colors.reset}
  node scripts/get-gdrive-videos.js <folder_url_or_id_1> [folder_url_2 ...] [options]
  npm run get-gdrive-videos -- <folder_url>

${colors.bright}OPTIONS:${colors.reset}
  --json             Output full JSON results
  --ts               Output ready-to-paste TypeScript array format for project-videos.ts
  --api-key <KEY>    Use Google Drive API key (optional, enhances speed & metadata)
  --output <file>    Save results to a JSON file
  --help, -h         Show this manual

${colors.bright}EXAMPLES:${colors.reset}
  node scripts/get-gdrive-videos.js "https://drive.google.com/drive/folders/1ABC_xyz123"
  node scripts/get-gdrive-videos.js "1ABC_xyz123" "1DEF_uvw456" --ts
`);
    return;
  }

  const isJson = args.includes("--json");
  const isTs = args.includes("--ts");
  const apiKeyIndex = args.indexOf("--api-key");
  const apiKey = apiKeyIndex !== -1 ? args[apiKeyIndex + 1] : process.env.GOOGLE_API_KEY;

  const outputIndex = args.indexOf("--output");
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;

  // Filter folder URLs from arguments (exclude flags and flag values)
  const folderUrls = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("-")) {
      if (arg === "--api-key" || arg === "--output") i++;
      continue;
    }
    folderUrls.push(arg);
  }

  // If no folder URLs provided in arguments, prompt default sample array
  if (folderUrls.length === 0) {
    console.log(`
${colors.yellow}⚠️  No Google Drive folder URL provided as arguments.${colors.reset}
${colors.dim}Usage example:${colors.reset}
  node scripts/get-gdrive-videos.js "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
`);
    return;
  }

  if (!isJson) {
    console.log(`\n${colors.bright}${colors.cyan}🔍 Scanning ${folderUrls.length} Google Drive folder(s)...${colors.reset}`);
  }

  const results = await getVideosFromFolderArray(folderUrls, { apiKey });

  if (isJson) {
    console.log(JSON.stringify(results, null, 2));
    if (outputFile) {
      fs.writeFileSync(path.resolve(ROOT_DIR, outputFile), JSON.stringify(results, null, 2), "utf8");
    }
    return;
  }

  // Print results
  for (const folderRes of results) {
    console.log(`\n======================================================`);
    console.log(`📁 Folder: ${colors.bright}${folderRes.input}${colors.reset}`);
    if (folderRes.folderId) {
      console.log(`🆔 ID:     ${colors.cyan}${folderRes.folderId}${colors.reset}`);
    }

    if (folderRes.error) {
      console.log(`${colors.red}❌ Error:  ${folderRes.error}${colors.reset}`);
      continue;
    }

    console.log(`📡 Source: ${colors.dim}${folderRes.source}${colors.reset}`);
    console.log(`🎬 Found:  ${colors.green}${colors.bright}${folderRes.videos.length} video(s)${colors.reset}`);
    console.log(`------------------------------------------------------`);

    if (folderRes.videos.length === 0) {
      console.log(`${colors.yellow}ℹ️  No video files detected in this folder.${colors.reset}`);
      console.log(`${colors.dim}   (Ensure the folder sharing settings are: "Anyone with the link can view")${colors.reset}`);
      continue;
    }

    folderRes.videos.forEach((video, idx) => {
      console.log(`\n  ${colors.bright}#${idx + 1} ${video.name}${colors.reset}`);
      console.log(`     ${colors.cyan}Iframe Embed URL:${colors.reset} ${colors.green}${video.iframePreviewUrl}${colors.reset}`);
      console.log(`     ${colors.dim}Direct View URL:  ${video.viewUrl}${colors.reset}`);
    });

    if (isTs) {
      console.log(`\n${colors.bright}📋 Ready-to-paste TypeScript snippet for public/project-videos.ts:${colors.reset}`);
      const iframeUrls = folderRes.videos.map((v) => `    "${v.iframePreviewUrl}",`).join("\n");
      console.log(`
  horizontalVideos: [
${iframeUrls}
  ],`);
    }
  }

  // Always save results to JSON file (defaults to public/gdrive-videos.json)
  const savePath = outputFile || "public/gdrive-videos.json";
  const absSavePath = path.resolve(ROOT_DIR, savePath);
  fs.writeFileSync(absSavePath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\n${colors.bright}${colors.green}💾 Extracted results automatically saved to:${colors.reset} ${colors.cyan}${savePath}${colors.reset}`);

  console.log(`\n${colors.dim}💡 Tip: All returned URLs use the format https://drive.google.com/file/d/{FILE_ID}/preview which renders seamlessly in <iframe> elements.${colors.reset}\n`);
}

// Execute if run as CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
