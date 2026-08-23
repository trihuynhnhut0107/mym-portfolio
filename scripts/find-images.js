import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directories
const ROOT_DIR = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT_DIR, "public/images");
const LOGOS_DIR = path.join(ROOT_DIR, "public/logos");
const DATA_FILE = path.join(ROOT_DIR, "src/data/projectsData.ts");

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

/**
 * Universal Native Image Dimension Reader
 * Supports PNG, JPEG (all SOF variations), WebP (VP8/VP8L/VP8X), GIF, SVG, and BMP.
 */
export function getImageDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (!buffer || buffer.length < 8) return null;

    // 1. PNG (IHDR chunk at byte 16)
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      if (buffer.length < 24) return null;
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
        type: "png",
      };
    }

    // 2. JPEG (Scan markers for SOF0..SOF15)
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length - 1) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // Standalone markers
        if (
          marker === 0xd8 ||
          marker === 0xd9 ||
          (marker >= 0xd0 && marker <= 0xd7) ||
          marker === 0x01
        ) {
          offset += 2;
          continue;
        }
        // SOF markers containing dimensions
        if (
          [
            0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd,
            0xce, 0xcf,
          ].includes(marker)
        ) {
          if (offset + 8 < buffer.length) {
            const height = buffer.readUInt16BE(offset + 5);
            const width = buffer.readUInt16BE(offset + 7);
            return { width, height, type: "jpeg" };
          }
        }
        if (offset + 3 < buffer.length) {
          const blockLength = buffer.readUInt16BE(offset + 2);
          offset += 2 + blockLength;
        } else {
          break;
        }
      }
    }

    // 3. WebP (VP8, VP8L, VP8X)
    if (
      buffer.length >= 30 &&
      buffer.toString("utf8", 0, 4) === "RIFF" &&
      buffer.toString("utf8", 8, 12) === "WEBP"
    ) {
      const format = buffer.toString("utf8", 12, 16);
      if (format === "VP8 " && buffer.length >= 30) {
        return {
          width: buffer.readUInt16LE(26) & 0x3fff,
          height: buffer.readUInt16LE(28) & 0x3fff,
          type: "webp",
        };
      } else if (format === "VP8L" && buffer.length >= 25) {
        const b0 = buffer[21],
          b1 = buffer[22],
          b2 = buffer[23],
          b3 = buffer[24];
        return {
          width: 1 + (((b1 & 0x3f) << 8) | b0),
          height:
            1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
          type: "webp",
        };
      } else if (format === "VP8X" && buffer.length >= 30) {
        return {
          width: 1 + buffer.readUIntLE(24, 3),
          height: 1 + buffer.readUIntLE(27, 3),
          type: "webp",
        };
      }
    }

    // 4. GIF (GIF87a / GIF89a)
    if (
      buffer.length >= 10 &&
      (buffer.toString("utf8", 0, 6) === "GIF87a" ||
        buffer.toString("utf8", 0, 6) === "GIF89a")
    ) {
      return {
        width: buffer.readUInt16LE(6),
        height: buffer.readUInt16LE(8),
        type: "gif",
      };
    }

    // 5. BMP
    if (buffer.length >= 26 && buffer[0] === 0x42 && buffer[1] === 0x4d) {
      return {
        width: buffer.readInt32LE(18),
        height: Math.abs(buffer.readInt32LE(22)),
        type: "bmp",
      };
    }

    // 6. SVG (viewBox or width/height attributes)
    if (filePath.endsWith(".svg")) {
      const content = buffer.toString("utf8");
      const vbMatch = content.match(/viewBox=["\x27]([\d.\s-]+)["\x27]/i);
      if (vbMatch) {
        const parts = vbMatch[1].trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          return { width: parts[2], height: parts[3], type: "svg" };
        }
      }
      const wMatch = content.match(/width=["\x27]([\d.]+)p?x?["\x27]/i);
      const hMatch = content.match(/height=["\x27]([\d.]+)p?x?["\x27]/i);
      if (wMatch && hMatch) {
        return {
          width: parseFloat(wMatch[1]),
          height: parseFloat(hMatch[1]),
          type: "svg",
        };
      }
    }
  } catch (err) {
    // Return null if unreadable
  }
  return null;
}

/**
 * Aspect Ratio Classification Rules:
 * - Square (1:1): 0.88 <= ratio <= 1.15
 * - Horizontal (16:9 / Landscape): ratio >= 1.25
 * - Vertical (9:16 / Portrait): ratio <= 0.88
 */
export function classifyAspectRatio(width, height) {
  if (!width || !height || height === 0) return "unknown";
  const ratio = width / height;

  if (ratio >= 0.88 && ratio <= 1.15) {
    return "square"; // 1:1 Logo
  } else if (ratio < 0.88) {
    return "vertical"; // 9:16 Vertical
  } else {
    return "horizontal"; // 16:9 Horizontal
  }
}

/**
 * Project Configurations with Prepared Video Links
 */
export const PROJECT_CONFIGS = [
  {
    id: "zen-tactics",
    title: "Zen Tactics",
    year: "2021",
    tag: "(Livestream Channel)",
    category: "youtube",
    folders: ["images/zen-tactics", "logos/zen-tactics"],
    description:
      "The Zen system represents a multi-year journey of redefining digital sports and entertainment media in Vietnam. Born from a desire to move beyond basic streams, we have consistently pushed the boundaries of content creation—transitioning from pioneering regional tactical analysis to football broadcasting, large scale live esports events.",
    vision:
      "Our work—from pioneering high-end tactical boards in football to crossing down esports strategy—is designed to dismantle the barrier between 'hardcore information' and 'audience understanding'. By utilizing dynamic motion graphics and reliable storytelling, we turn technical analysis into a rewarding viewing experience.",
    statsNodes: [
      { value: "64K", label: "SUBS" },
      { value: "44K", label: "FOLLOW" },
      { value: "6.3M", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "modern-football",
    title: "Modern Football",
    year: "2022",
    tag: "(Sport YT Channel)",
    category: "youtube",
    folders: ["images/modern-football"],
    description:
      "Modern Football (2022): The analytical successor to Zentactics. This project assumes the core analytical DNA of its predecessor while introducing a brand new visual identity. With a vibrant design language, Modern Football bridges today's complex tactical analysis with young audiences.",
    vision:
      "Our vision is to set the gold standard in sports media by making intricate tactical setups accessible and visually thrilling for the next generation of sports enthusiasts.",
    statsNodes: [
      { value: "24K", label: "SUBS" },
      { value: "30K", label: "FOLLOW" },
      { value: "4M", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "tactics-duo",
    title: "The Tactics Duo",
    year: "2022",
    tag: "(Outsource Channel)",
    category: "outsource",
    folders: ["images/tactics-duo"],
    description:
      "Focused on pre-match tactical breakdown and heavy graphic design execution. Achieved a peak traffic of over 600K views within a single year despite having modest subscriber counts.",
    vision:
      "Demonstrating that high production value, precise motion graphics, and deep football analysis can achieve extreme viral efficiency.",
    statsNodes: [
      { value: "2.9K", label: "SUBS" },
      { value: "4.7K", label: "FOLLOW" },
      { value: "646K", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "zen-fifa",
    title: "Zen FIFA23 eWorld Cup",
    year: "2023",
    tag: "(Public Event)",
    category: "events",
    folders: ["images/zen-fifa-eworldcup"],
    description:
      "The first major Esports offline tournament organized under the Modern Football brand. One of the largest offline EA FC tournaments hosted in Ho Chi Minh City.",
    vision:
      "Unifying offline competitive gaming with high-production online broadcast graphics, setting new standards for grass-roots esports tournaments in Vietnam.",
    statsNodes: [
      { value: "100+", label: "PLAYERS" },
      { value: "8+", label: "TEAMS" },
      { value: "50K", label: "REACH" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "hlv-online",
    title: "HLV Online",
    year: "2023",
    tag: "(Sport YT Channel)",
    category: "youtube",
    folders: ["images/hlv-onlive"],
    description:
      "HLV Online represents our signature milestone and most successful sport media brand to date. By combining modern visual motion graphics, deep-dive tactical analytics, and interactive storytelling.",
    vision:
      "To redefine digital football media by proving that tactical depth and mass accessibility are not mutually exclusive.",
    statsNodes: [
      { value: "164K", label: "SUBS" },
      { value: "133K", label: "FOLLOW" },
      { value: "39M", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "hlv-classic",
    title: "HLV Online Classic",
    year: "2024",
    tag: "(Sport YT Channel)",
    category: "youtube",
    folders: ["images/hlv-online-classic"],
    description:
      "A retro, narrative-driven approach to iconic football moments. Focusing on nostalgic events to restore pure, emotional human connection with dedicated football audiences.",
    vision:
      "Restoring pure human connection and emotional storytelling to iconic moments in sports history.",
    statsNodes: [
      { value: "31K", label: "SUBS" },
      { value: "3.3M", label: "VIEWS" },
      { value: "93K", label: "HOURS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "cup-hoc",
    title: "Cup Hoc Xem Bong",
    year: "2025",
    tag: "(Sport YT Channel)",
    category: "youtube",
    folders: ["images/cup-hoc-xem-bong"],
    description:
      "A reality show format dedicated to finding and nurturing young commentary and analytical talent in football esports, forming the foundation for the next media generation.",
    vision:
      "Building an incubator ecosystem for high-potential digital sports creators.",
    statsNodes: [
      { value: "11K", label: "SUBS" },
      { value: "51K", label: "FOLLOW" },
      { value: "1.6M", label: "VIEWS" },
    ],
    horizontalVideos: ["https://www.youtube.com/watch?v=mSsx4nwU9Kw"],
    verticalVideos: ["https://www.youtube.com/shorts/LEgSRAPu1V4"],
  },
  {
    id: "the-watcher",
    title: "The Watcher",
    year: "2025",
    tag: "(Website & Platform)",
    category: "website",
    folders: ["images/zentlemen"],
    description:
      "A premium subscription-based editorial blog platform designed with a dark, minimalist aesthetic, smooth scroll interactions, and a custom admin CMS panel.",
    vision:
      "Merging editorial journalism with modern software engineering for next-generation digital publishing.",
    statsNodes: [
      { value: "100%", label: "CUSTOM UI" },
      { value: "CMS", label: "ADMIN" },
      { value: "2025", label: "LAUNCH" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "zen-cine",
    title: "Zen Cine",
    year: "2022",
    tag: "(Media Channel)",
    category: "youtube",
    folders: ["images/zen-cine"],
    description: "Cinematic and narrative digital entertainment experiences.",
    vision: "Elevating visual storytelling standards in sports entertainment.",
    statsNodes: [
      { value: "10K", label: "SUBS" },
      { value: "500K", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "zen-esport",
    title: "Zen Esport",
    year: "2023",
    tag: "(Esports Event)",
    category: "events",
    folders: ["images/zen-esport"],
    description: "High-production esports tournament coverage and motion design.",
    vision: "Pioneering state of the art esports live broadcasts.",
    statsNodes: [
      { value: "50K", label: "REACH" },
      { value: "10+", label: "EVENTS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
  {
    id: "lien-minh-fun",
    title: "Lien Minh Fun",
    year: "2023",
    tag: "(Community Channel)",
    category: "youtube",
    folders: ["images/lien-minh-fun"],
    description: "Gaming community content and creative motion design assets.",
    vision: "Connecting gaming communities through innovative visual design.",
    statsNodes: [
      { value: "15K", label: "FOLLOW" },
      { value: "1M", label: "VIEWS" },
    ],
    horizontalVideos: [],
    verticalVideos: [],
  },
];

/**
 * Scan a single folder (relative to public/) and return classified images.
 */
export function scanFolder(relFolder) {
  const fullPath = path.join(ROOT_DIR, "public", relFolder);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath);
  const items = [];

  for (const file of files) {
    const filePath = path.join(fullPath, file);
    if (fs.statSync(filePath).isDirectory()) continue;
    if (!/\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(file)) continue;

    const dims = getImageDimensions(filePath);
    if (!dims || dims.width === 0 || dims.height === 0) continue;

    const ratio = dims.width / dims.height;
    const category = classifyAspectRatio(dims.width, dims.height);
    const relUrl = `/${relFolder}/${file}`.replace(/\/+/g, "/");

    let targetRatio = 1.0;
    if (category === "horizontal") targetRatio = 16 / 9;
    else if (category === "vertical") targetRatio = 9 / 16;
    const ratioDelta = Math.abs(ratio - targetRatio);

    items.push({
      file,
      url: relUrl,
      width: dims.width,
      height: dims.height,
      ratio: Number(ratio.toFixed(2)),
      ratioDelta,
      pixels: dims.width * dims.height,
      category,
      type: dims.type,
    });
  }

  return items;
}

/**
 * Scan all images for a given project configuration.
 */
export function scanProjectImages(projectConfig) {
  const allItems = [];
  for (const folder of projectConfig.folders) {
    allItems.push(...scanFolder(folder));
  }

  // De-duplicate by URL
  const seenUrls = new Set();
  const uniqueItems = allItems.filter((item) => {
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });

  // Split strictly by category
  const square = uniqueItems.filter((i) => i.category === "square");
  const horizontal = uniqueItems.filter((i) => i.category === "horizontal");
  const vertical = uniqueItems.filter((i) => i.category === "vertical");

  // Sort each category by highest resolution first, then best ratio match
  const sorter = (a, b) => b.pixels - a.pixels || a.ratioDelta - b.ratioDelta;
  square.sort(sorter);
  horizontal.sort(sorter);
  vertical.sort(sorter);

  return {
    square,
    horizontal,
    vertical,
    total: uniqueItems.length,
    allItems: uniqueItems,
  };
}

/**
 * Strictly map images into the project detail grid slots without forcing incorrect placeholders:
 * - logos: 1:1 square images only (up to 2). If none, leaves [].
 * - horizontalImages: 16:9 horizontal images only (up to 15). If none, leaves [].
 * - verticalImages: 9:16 vertical images only (up to 4). If none, leaves [].
 * - horizontalVideos: 16:9 video embed URLs only (YouTube/Vimeo). Never filled with images!
 * - verticalVideos: 9:16 video embed URLs only (YouTube Shorts/Vimeo). Never filled with images!
 */
export function allocateProjectGridAssets(scanned, projectConfig = null) {
  // 1. Logos: Only authentic square images
  const logos = scanned.square.slice(0, 2).map((item) => item.url);

  // 2. Horizontal Images: Authentic horizontal images only (up to 15 slots)
  const horizontalImages = scanned.horizontal
    .slice(0, 15)
    .map((item) => item.url);

  // 3. Vertical Images: Authentic vertical images only (up to 4 slots)
  const verticalImages = scanned.vertical.slice(0, 4).map((item) => item.url);

  // 4. Videos: Strictly ONLY actual video links (YouTube, Vimeo, mp4). Never put images into video slots!
  const horizontalVideos = projectConfig?.horizontalVideos || [];
  const verticalVideos = projectConfig?.verticalVideos || [];

  return {
    logos,
    horizontalImages,
    verticalImages,
    horizontalVideos,
    verticalVideos,
    videos: horizontalVideos, // For backward compatibility
  };
}

/**
 * Generate formatted TypeScript projectsData.ts source code
 */
export function generateProjectsDataTs(projectsWithAssets) {
  const entries = projectsWithAssets
    .map((p) => {
      return `  "${p.id}": {
    id: ${JSON.stringify(p.id)},
    year: ${JSON.stringify(p.year)},
    title: ${JSON.stringify(p.title)},
    tag: ${JSON.stringify(p.tag)},
    category: ${JSON.stringify(p.category)},
    description:
      ${JSON.stringify(p.description)},
    vision:
      ${JSON.stringify(p.vision)},
    statsNodes: ${JSON.stringify(p.statsNodes, null, 6)},
    logos: ${JSON.stringify(p.assets.logos, null, 6)},
    horizontalImages: ${JSON.stringify(p.assets.horizontalImages, null, 6)},
    verticalImages: ${JSON.stringify(p.assets.verticalImages, null, 6)},
    horizontalVideos: ${JSON.stringify(p.assets.horizontalVideos, null, 6)},
    verticalVideos: ${JSON.stringify(p.assets.verticalVideos, null, 6)},
    videos: ${JSON.stringify(p.assets.videos, null, 6)},
  },`;
    })
    .join("\n");

  return `export interface ProjectDetail {
  id: string;
  year: string;
  title: string;
  tag: string;
  category: string;
  description: string;
  vision: string;
  statsNodes: Array<{ value: string; label: string }>;
  logos: string[]; // 1:1 square logo image paths
  horizontalImages: string[]; // 16:9 horizontal image paths
  verticalImages: string[]; // 9:16 vertical image paths
  horizontalVideos: string[]; // 16:9 YouTube/Vimeo video embed URLs
  verticalVideos: string[]; // 9:16 YouTube Shorts/Vimeo video embed URLs
  videos: string[]; // 16:9 video embed URLs (backward compatibility)
}

export const PROJECTS_DETAIL_DATA: Record<string, ProjectDetail> = {
${entries}
};
`;
}

/**
 * Print CLI Table / Summary for a project
 */
function printProjectSummary(projectConfig, scanned, allocated) {
  console.log(
    `\n${colors.bright}${colors.cyan}======================================================${colors.reset}`
  );
  console.log(
    `${colors.bright}📂 Project: ${colors.green}${projectConfig.title}${colors.reset} ${colors.gray}(ID: ${projectConfig.id})${colors.reset}`
  );
  console.log(
    `${colors.dim}📁 Folders: ${projectConfig.folders.join(", ")}${colors.reset}`
  );
  console.log(
    `${colors.cyan}------------------------------------------------------${colors.reset}`
  );

  console.log(`${colors.bright}📊 Detected Image Assets:${colors.reset}`);
  console.log(
    `  • ${colors.yellow}Square (1:1)${colors.reset}:      ${scanned.square.length} images found`
  );
  scanned.square.forEach((img) => {
    console.log(
      `    ${colors.gray}- ${img.file} (${img.width}x${img.height}, ratio: ${img.ratio})${colors.reset}`
    );
  });

  console.log(
    `  • ${colors.blue}Horizontal (16:9)${colors.reset}:  ${scanned.horizontal.length} images found`
  );
  scanned.horizontal.forEach((img) => {
    console.log(
      `    ${colors.gray}- ${img.file} (${img.width}x${img.height}, ratio: ${img.ratio})${colors.reset}`
    );
  });

  console.log(
    `  • ${colors.magenta}Vertical (9:16)${colors.reset}:    ${scanned.vertical.length} images found`
  );
  scanned.vertical.forEach((img) => {
    console.log(
      `    ${colors.gray}- ${img.file} (${img.width}x${img.height}, ratio: ${img.ratio})${colors.reset}`
    );
  });

  console.log(
    `\n${colors.bright}🎯 Grid Allocation (Strict Zero-Forcing & Video Separation):${colors.reset}`
  );
  console.log(
    `  • Logos (1:1 Square, max 2):         ${allocated.logos.length > 0 ? colors.green + allocated.logos.length + " filled" : colors.red + "0 (Wireframe placeholder active)"}${colors.reset}`
  );
  console.log(
    `  • Horizontal Images (16:9, max 15):  ${allocated.horizontalImages.length > 0 ? colors.green + allocated.horizontalImages.length + " filled" : colors.red + "0 (Wireframe placeholder active)"}${colors.reset}`
  );
  console.log(
    `  • Vertical Images (9:16, max 4):     ${allocated.verticalImages.length > 0 ? colors.green + allocated.verticalImages.length + " filled" : colors.red + "0 (Wireframe placeholder active)"}${colors.reset}`
  );
  console.log(
    `  • 16:9 Videos (YouTube/Vimeo):       ${allocated.horizontalVideos.length > 0 ? colors.green + allocated.horizontalVideos.length + " video links" : colors.red + "0 (Wireframe placeholder active)"}${colors.reset}`
  );
  console.log(
    `  • 9:16 Videos (Shorts/Vimeo):        ${allocated.verticalVideos.length > 0 ? colors.green + allocated.verticalVideos.length + " video links" : colors.red + "0 (Wireframe placeholder active)"}${colors.reset}`
  );
}

/**
 * Dynamically load project video links from public/project-videos.ts
 */
export function loadProjectVideosConfig() {
  const tsPath = path.join(ROOT_DIR, "public/project-videos.ts");

  if (fs.existsSync(tsPath)) {
    try {
      const content = fs.readFileSync(tsPath, "utf8");
      const match = content.match(
        /PROJECT_VIDEOS\s*(?::\s*[^=]+)?=\s*({[\s\S]*?});/
      );
      if (match) {
        return new Function(`return (${match[1]});`)();
      }
    } catch (e) {
      console.warn("Notice: Could not parse public/project-videos.ts:", e.message);
    }
  }

  return {};
}

/**
 * Main CLI Entry Point
 */
export async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${colors.bright}${colors.cyan}🖼️  Project Detail Image Grid Asset Finder${colors.reset}

${colors.bright}USAGE:${colors.reset}
  node scripts/find-images.js [project-name] [options]
  npm run find-images [project-name] [options]

${colors.bright}ARGUMENTS:${colors.reset}
  [project-name]        Name or ID of a project or folder (e.g. zen-tactics, cup-hoc, modern-football)
                        If omitted or '--all' is provided, all projects are scanned.

${colors.bright}OPTIONS:${colors.reset}
  --all                 Process all known project folders in public/images/
  --write, --update     Update src/data/projectsData.ts with detected asset orders
  --dry-run             Scan and report without writing to disk
  --json                Output results in JSON format
  --help, -h            Show this help manual

${colors.bright}EXAMPLES:${colors.reset}
  node scripts/find-images.js zen-tactics
  node scripts/find-images.js cup-hoc-xem-bong
  node scripts/find-images.js --all --write
`);
    return;
  }

  const isJson = args.includes("--json");
  const shouldWrite = args.includes("--write") || args.includes("--update");
  const isDryRun = args.includes("--dry-run");
  const isAll = args.includes("--all") || args.length === 0;

  // Load custom video configurations from public/project-videos.ts or public/project-videos.json
  const videoConfigs = loadProjectVideosConfig();

  // Merge external video configurations into base configs
  const mergedConfigs = PROJECT_CONFIGS.map((config) => {
    const custom = videoConfigs[config.id] || videoConfigs[config.folders?.[0]?.replace("images/", "")];
    return {
      ...config,
      horizontalVideos: custom?.horizontalVideos || config.horizontalVideos || [],
      verticalVideos: custom?.verticalVideos || config.verticalVideos || [],
    };
  });

  // Filter project configs if a specific project was requested
  const targetArg = args.find((a) => !a.startsWith("-"));
  let configsToProcess = mergedConfigs;

  if (targetArg && !isAll) {
    const cleanTarget = targetArg.toLowerCase().trim();
    configsToProcess = PROJECT_CONFIGS.filter(
      (c) =>
        c.id.toLowerCase().includes(cleanTarget) ||
        c.title.toLowerCase().includes(cleanTarget) ||
        c.folders.some((f) => f.toLowerCase().includes(cleanTarget))
    );

    if (configsToProcess.length === 0) {
      const folderCandidate = path.join(IMAGES_DIR, cleanTarget);
      if (fs.existsSync(folderCandidate)) {
        configsToProcess = [
          {
            id: cleanTarget,
            title: cleanTarget
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            year: new Date().getFullYear().toString(),
            tag: "(Project)",
            category: "media",
            folders: [`images/${cleanTarget}`],
            description: "Custom project showcase.",
            vision: "Design and content excellence.",
            statsNodes: [{ value: "100%", label: "MEDIA" }],
            horizontalVideos: [],
            verticalVideos: [],
          },
        ];
      } else {
        console.error(
          `${colors.red}❌ Error: No project or folder matching '${targetArg}' found in public/images/${colors.reset}`
        );
        process.exit(1);
      }
    }
  }

  const processed = [];

  for (const config of configsToProcess) {
    const scanned = scanProjectImages(config);
    const allocated = allocateProjectGridAssets(scanned, config);

    processed.push({
      ...config,
      scanned,
      assets: allocated,
    });

    if (!isJson) {
      printProjectSummary(config, scanned, allocated);
    }
  }

  if (isJson) {
    console.log(JSON.stringify(processed, null, 2));
    return;
  }

  // Update src/data/projectsData.ts if requested
  if (shouldWrite && !isDryRun) {
    let allProcessed = processed;
    if (processed.length < PROJECT_CONFIGS.length) {
      allProcessed = PROJECT_CONFIGS.map((config) => {
        const match = processed.find((p) => p.id === config.id);
        if (match) return match;
        const scanned = scanProjectImages(config);
        const allocated = allocateProjectGridAssets(scanned, config);
        return { ...config, scanned, assets: allocated };
      });
    }

    const code = generateProjectsDataTs(allProcessed);
    fs.writeFileSync(DATA_FILE, code, "utf8");
    console.log(
      `\n${colors.bright}${colors.green}🎉 Successfully updated src/data/projectsData.ts with verified asset allocations!${colors.reset}`
    );
  } else if (!isDryRun && isAll) {
    console.log(
      `\n${colors.dim}💡 Tip: Run with ${colors.cyan}--write${colors.dim} or ${colors.cyan}npm run organize-images${colors.dim} to apply changes to src/data/projectsData.ts.${colors.reset}\n`
    );
  }
}

// Execute if run as script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
