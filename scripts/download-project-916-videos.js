#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PROJECT_916_VIDEOS = [
  { project: "zen-tactics", slot: 7, fileId: "1gJsr_2d2FDO2fGnXxOUk1_hiGYoCuqKs", name: "7.mp4" },
  { project: "zen-tactics", slot: 8, fileId: "1--QabvWWob7rTjmlqAS5BO8VJIDddazM", name: "8.mp4" },
  { project: "modern-football", slot: 7, fileId: "1B5vdu5vfm48xU6MLpZ7xZ3QKkarEcdF1", name: "7.mp4" },
  { project: "modern-football", slot: 8, fileId: "1PFRTMcV4vx8kqdQF30PV6SKNRgy0H7MW", name: "8.mp4" },
  { project: "hlv-online", slot: 7, fileId: "1z7Hfv3E0Kgocw-lZVOvqFPZ7gVP4OKjI", name: "7.mp4" },
  { project: "hlv-online", slot: 8, fileId: "1nwYORA8hSB9U7ALh6SH5pe69HvCAy8nf", name: "8.mp4" },
  { project: "hlv-online-classic", slot: 7, fileId: "1kcT1b_QLJ9FkAJAtZ8pOxnfvXT6Ividt", name: "7.mp4" },
  { project: "hlv-online-classic", slot: 8, fileId: "1lbHCnSD3z6yyr0ilcxK8AW3GhdFefeXN", name: "8.mp4" },
  { project: "cup-hoc-xem-bong", slot: 7, fileId: "1DbZF75YQNZgmHSjpwKP7MOI_Rx3nUo7K", name: "7.mp4" },
  { project: "cup-hoc-xem-bong", slot: 8, fileId: "1TQDqofOdKf6DpSWdXQUdRs3fvkJXnXhv", name: "8.mp4" },
];

async function downloadVideo(item) {
  const targetDir = path.join(ROOT, "public/videos", item.project);
  await mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, item.name);

  const url = `https://drive.usercontent.google.com/download?id=${item.fileId}&export=download&confirm=t`;
  console.log(`Downloading [${item.project}] ${item.name} (${item.fileId})...`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${item.project}/${item.name}: HTTP ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (!buffer.length) {
    throw new Error(`Empty response for ${item.project}/${item.name}`);
  }

  await writeFile(targetPath, buffer);
  console.log(`Saved [${item.project}] ${item.name} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

async function main() {
  console.log(`Starting download of ${PROJECT_916_VIDEOS.length} 9:16 portrait videos for Project Detail pages...`);
  for (const item of PROJECT_916_VIDEOS) {
    try {
      await downloadVideo(item);
    } catch (err) {
      console.error(`Error downloading ${item.project}/${item.name}:`, err.message);
    }
  }
  console.log("All 9:16 videos download complete!");
}

main();
