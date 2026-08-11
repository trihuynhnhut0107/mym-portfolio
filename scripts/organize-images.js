import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Native Buffer Image Dimension Parser for PNG & JPEG
function getImageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];

      // SOF0 (0xC0) to SOF2 (0xC2)
      if (
        marker === 0xc0 ||
        marker === 0xc1 ||
        marker === 0xc2 ||
        marker === 0xc3 ||
        marker === 0xc5 ||
        marker === 0xc6 ||
        marker === 0xc7
      ) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height };
      }

      const blockLength = buffer.readUInt16BE(offset + 2);
      offset += 2 + blockLength;
    }
  }

  return null;
}

const imagesDir = path.join(__dirname, "../public/images");
const logosDir = path.join(__dirname, "../public/logos");

console.log("🔍 Detecting resolutions and aspect ratios for all project images...\n");

function analyzeDirectory(dirPath, relativePrefix) {
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const results = [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...analyzeDirectory(fullPath, `${relativePrefix}/${file}`));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      try {
        const dims = getImageDimensions(fullPath);
        if (dims) {
          const ratio = dims.width / dims.height;
          let category = "horizontal"; // default 16:9
          if (ratio >= 0.9 && ratio <= 1.1) {
            category = "square"; // 1:1 Logo
          } else if (ratio < 0.9) {
            category = "vertical"; // 9:16 Vertical
          } else {
            category = "horizontal"; // 16:9 Horizontal
          }

          results.push({
            file: `${relativePrefix}/${file}`,
            width: dims.width,
            height: dims.height,
            ratio: ratio.toFixed(2),
            category,
          });
        }
      } catch (err) {
        // Skip unparseable files
      }
    }
  }

  return results;
}

const allImages = analyzeDirectory(imagesDir, "/images");
const allLogos = analyzeDirectory(logosDir, "/logos");

// Group by project folder name
const grouped = {};

[...allImages, ...allLogos].forEach((img) => {
  const parts = img.file.split("/");
  const folder = parts[2] || "root";
  if (!grouped[folder]) {
    grouped[folder] = { square: [], horizontal: [], vertical: [] };
  }
  grouped[folder][img.category].push(img.file);
});

// Map project ID to folder names
const PROJECT_FOLDER_MAP = {
  "zen-tactics": ["zen-tactics"],
  "modern-football": ["modern-football"],
  "tactics-duo": ["tactics-duo"],
  "zen-fifa": ["zen-fifa-eworldcup"],
  "hlv-online": ["hlv-onlive"],
  "hlv-classic": ["hlv-online-classic"],
  "cup-hoc": ["cup-hoc-xem-bong"],
  "the-watcher": ["zentlemen"],
};

// Generate updated src/data/projectsData.ts file
const projectsDataFile = path.join(__dirname, "../src/data/projectsData.ts");

const generatedProjectsData = `export interface ProjectDetail {
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
  videos: string[]; // 16:9 and 9:16 video or poster paths
}

export const PROJECTS_DETAIL_DATA: Record<string, ProjectDetail> = {
  "zen-tactics": {
    id: "zen-tactics",
    year: "2021",
    title: "Zen Tactics",
    tag: "(Livestream Channel)",
    category: "youtube",
    description:
      "The Zen system represents a multi-year journey of redefining digital sports and entertainment media in Vietnam. Born from a desire to move beyond basic streams, we have consistently pushed the boundaries of content creation—transitioning from pioneering regional tactical analysis to football broadcasting, large scale live esports events.",
    vision:
      "Our work—from pioneering high-end tactical boards in football to crossing down esports strategy—is designed to dismantle the barrier between 'hardcore information' and 'audience understanding'. By utilizing dynamic motion graphics and reliable storytelling, we turn technical analysis into a rewarding viewing experience.",
    statsNodes: [
      { value: "64K", label: "SUBS" },
      { value: "44K", label: "FOLLOW" },
      { value: "6.3M", label: "VIEWS" },
    ],
    logos: ${JSON.stringify(grouped["zen-tactics"]?.square?.length ? grouped["zen-tactics"].square : ["/logos/zen-tactics/1.jpg", "/logos/zen-tactics/3.jpg"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["zen-tactics"]?.horizontal?.length ? grouped["zen-tactics"].horizontal : ["/images/zen-tactics/472789356_898720405677394_7598917261126547216_n.jpg"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["zen-tactics"]?.vertical?.length ? grouped["zen-tactics"].vertical : ["/images/zen-tactics/475056694_910641067818661_514620898112741635_n.jpg"], null, 6)},
    videos: ${JSON.stringify(grouped["zen-tactics"]?.horizontal?.slice(0, 3) || ["/images/zen-tactics/472789356_898720405677394_7598917261126547216_n.jpg"], null, 6)},
  },
  "modern-football": {
    id: "modern-football",
    year: "2022",
    title: "Modern Football",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "Modern Football (2022): The analytical successor to Zentactics. This project assumes the core analytical DNA of its predecessor while introducing a brand new visual identity. With a vibrant design language, Modern Football bridges today's complex tactical analysis with young audiences.",
    vision:
      "Our vision is to set the gold standard in sports media by making intricate tactical setups accessible and visually thrilling for the next generation of sports enthusiasts.",
    statsNodes: [
      { value: "24K", label: "SUBS" },
      { value: "30K", label: "FOLLOW" },
      { value: "4M", label: "VIEWS" },
    ],
    logos: ${JSON.stringify(grouped["modern-football"]?.square?.length ? grouped["modern-football"].square : ["/logos/zen-tactics/1.jpg"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["modern-football"]?.horizontal?.length ? grouped["modern-football"].horizontal : ["/images/modern-football/1.jpg"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["modern-football"]?.vertical?.length ? grouped["modern-football"].vertical : ["/images/modern-football/5.png"], null, 6)},
    videos: ${JSON.stringify(grouped["modern-football"]?.horizontal?.slice(0, 3) || ["/images/modern-football/1.jpg"], null, 6)},
  },
  "tactics-duo": {
    id: "tactics-duo",
    year: "2022",
    title: "The Tactics Duo",
    tag: "(Outsource Channel)",
    category: "outsource",
    description:
      "Focused on pre-match tactical breakdown and heavy graphic design execution. Achieved a peak traffic of over 600K views within a single year despite having modest subscriber counts.",
    vision:
      "Demonstrating that high production value, precise motion graphics, and deep football analysis can achieve extreme viral efficiency.",
    statsNodes: [
      { value: "2.9K", label: "SUBS" },
      { value: "4.7K", label: "FOLLOW" },
      { value: "646K", label: "VIEWS" },
    ],
    logos: ${JSON.stringify(grouped["tactics-duo"]?.square?.length ? grouped["tactics-duo"].square : ["/images/tactics-duo/309459643_3421573241395550_5199766547589067483_n.jpg"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["tactics-duo"]?.horizontal?.length ? grouped["tactics-duo"].horizontal : ["/images/tactics-duo/309459643_3421573241395550_5199766547589067483_n.jpg"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["tactics-duo"]?.vertical?.length ? grouped["tactics-duo"].vertical : ["/images/tactics-duo/309459643_3421573241395550_5199766547589067483_n.jpg"], null, 6)},
    videos: ${JSON.stringify(grouped["tactics-duo"]?.horizontal?.slice(0, 3) || ["/images/tactics-duo/309459643_3421573241395550_5199766547589067483_n.jpg"], null, 6)},
  },
  "zen-fifa": {
    id: "zen-fifa",
    year: "2023",
    title: "Zen FIFA23 eWorld Cup",
    tag: "(Public Event)",
    category: "events",
    description:
      "The first major Esports offline tournament organized under the Modern Football brand. One of the largest offline EA FC tournaments hosted in Ho Chi Minh City.",
    vision:
      "Unifying offline competitive gaming with high-production online broadcast graphics, setting new standards for grass-roots esports tournaments in Vietnam.",
    statsNodes: [
      { value: "100+", label: "PLAYERS" },
      { value: "8+", label: "TEAMS" },
      { value: "50K", label: "REACH" },
    ],
    logos: ${JSON.stringify(grouped["zen-fifa-eworldcup"]?.square?.length ? grouped["zen-fifa-eworldcup"].square : ["/images/zen-fifa-eworldcup/475831082_944879471080415_4984727195396708880_n.jpg"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["zen-fifa-eworldcup"]?.horizontal?.length ? grouped["zen-fifa-eworldcup"].horizontal : ["/images/zen-fifa-eworldcup/475831082_944879471080415_4984727195396708880_n.jpg"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["zen-fifa-eworldcup"]?.vertical?.length ? grouped["zen-fifa-eworldcup"].vertical : ["/images/zen-fifa-eworldcup/475934640_944876517747377_6869799041919072697_n.jpg"], null, 6)},
    videos: ${JSON.stringify(grouped["zen-fifa-eworldcup"]?.horizontal?.slice(0, 3) || ["/images/zen-fifa-eworldcup/475831082_944879471080415_4984727195396708880_n.jpg"], null, 6)},
  },
  "hlv-online": {
    id: "hlv-online",
    year: "2023",
    title: "HLV Online",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "HLV Online represents our signature milestone and most successful sport media brand to date. By combining modern visual motion graphics, deep-dive tactical analytics, and interactive storytelling.",
    vision:
      "To redefine digital football media by proving that tactical depth and mass accessibility are not mutually exclusive.",
    statsNodes: [
      { value: "164K", label: "SUBS" },
      { value: "133K", label: "FOLLOW" },
      { value: "39M", label: "VIEWS" },
    ],
    logos: ${JSON.stringify(grouped["hlv-onlive"]?.square?.length ? grouped["hlv-onlive"].square : ["/images/hlv-onlive/12.jpg"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["hlv-onlive"]?.horizontal?.length ? grouped["hlv-onlive"].horizontal : ["/images/hlv-onlive/12.jpg"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["hlv-onlive"]?.vertical?.length ? grouped["hlv-onlive"].vertical : ["/images/hlv-onlive/2.png"], null, 6)},
    videos: ${JSON.stringify(grouped["hlv-onlive"]?.horizontal?.slice(0, 3) || ["/images/hlv-onlive/12.jpg"], null, 6)},
  },
  "hlv-classic": {
    id: "hlv-classic",
    year: "2024",
    title: "HLV Online Classic",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "A retro, narrative-driven approach to iconic football moments. Focusing on nostalgic events to restore pure, emotional human connection with dedicated football audiences.",
    vision:
      "Restoring pure human connection and emotional storytelling to iconic moments in sports history.",
    statsNodes: [
      { value: "31K", label: "SUBS" },
      { value: "3.3M", label: "VIEWS" },
      { value: "93K", label: "HOURS" },
    ],
    logos: ${JSON.stringify(grouped["hlv-online-classic"]?.square?.length ? grouped["hlv-online-classic"].square : ["/images/hlv-online-classic/Bayern_Munnich_Ribery_Robben.png"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["hlv-online-classic"]?.horizontal?.length ? grouped["hlv-online-classic"].horizontal : ["/images/hlv-online-classic/Bayern_Munnich_Ribery_Robben.png"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["hlv-online-classic"]?.vertical?.length ? grouped["hlv-online-classic"].vertical : ["/images/hlv-online-classic/Paul Scholes.png"], null, 6)},
    videos: ${JSON.stringify(grouped["hlv-online-classic"]?.horizontal?.slice(0, 3) || ["/images/hlv-online-classic/Bayern_Munnich_Ribery_Robben.png"], null, 6)},
  },
  "cup-hoc": {
    id: "cup-hoc",
    year: "2025",
    title: "Cup Hoc Xem Bong",
    tag: "(Sport YT Channel)",
    category: "youtube",
    description:
      "A reality show format dedicated to finding and nurturing young commentary and analytical talent in football esports, forming the foundation for the next media generation.",
    vision:
      "Building an incubator ecosystem for high-potential digital sports creators.",
    statsNodes: [
      { value: "11K", label: "SUBS" },
      { value: "51K", label: "FOLLOW" },
      { value: "1.6M", label: "VIEWS" },
    ],
    logos: ${JSON.stringify(grouped["cup-hoc-xem-bong"]?.square?.length ? grouped["cup-hoc-xem-bong"].square : ["/images/cup-hoc-xem-bong/Mark logo.png"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["cup-hoc-xem-bong"]?.horizontal?.length ? grouped["cup-hoc-xem-bong"].horizontal : ["/images/cup-hoc-xem-bong/Mark logo.png"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["cup-hoc-xem-bong"]?.vertical?.length ? grouped["cup-hoc-xem-bong"].vertical : ["/images/cup-hoc-xem-bong/6a.png"], null, 6)},
    videos: ${JSON.stringify(grouped["cup-hoc-xem-bong"]?.horizontal?.slice(0, 3) || ["/images/cup-hoc-xem-bong/Mark logo.png"], null, 6)},
  },
  "the-watcher": {
    id: "the-watcher",
    year: "2025",
    title: "The Watcher",
    tag: "(Website & Platform)",
    category: "website",
    description:
      "A premium subscription-based editorial blog platform designed with a dark, minimalist aesthetic, smooth scroll interactions, and a custom admin CMS panel.",
    vision:
      "Merging editorial journalism with modern software engineering for next-generation digital publishing.",
    statsNodes: [
      { value: "100%", label: "CUSTOM UI" },
      { value: "CMS", label: "ADMIN" },
      { value: "2025", label: "LAUNCH" },
    ],
    logos: ${JSON.stringify(grouped["zentlemen"]?.square?.length ? grouped["zentlemen"].square : ["/images/zentlemen/image.png"], null, 6)},
    horizontalImages: ${JSON.stringify(grouped["zentlemen"]?.horizontal?.length ? grouped["zentlemen"].horizontal : ["/images/zentlemen/image.png"], null, 6)},
    verticalImages: ${JSON.stringify(grouped["zentlemen"]?.vertical?.length ? grouped["zentlemen"].vertical : ["/images/zentlemen/image copy.png"], null, 6)},
    videos: ${JSON.stringify(grouped["zentlemen"]?.horizontal?.slice(0, 3) || ["/images/zentlemen/image.png"], null, 6)},
  },
};
`;

fs.writeFileSync(projectsDataFile, generatedProjectsData);
console.log("\n🎉 Automatically updated src/data/projectsData.ts with detected asset orders!");
