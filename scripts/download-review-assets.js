#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROTECTED_LOGO = path.join(ROOT, "public/logos/portfolio/official-logo-1.svg");

const FOLDERS = [
  ["project-logos", "1uEZT-NwwqQ1HXPyzhVQEY6fHoxjZuT3L", "public/logos/project-logos"],
  ["creative-productions", "1eOBEahXZrsxYW4lIWcBT1Es77lql9I86", "public/images/creative-productions"],
  ["zen-tactics", "1h7kUv0uqex-zf8xzdd3HqhPYEzh-tjIl", "public/images/zen-tactics"],
  ["modern-football", "1ExiXUEtc5Fx0ZS6FzhVqMSHlIOONXyzY", "public/images/modern-football"],
  ["zen-cine-esports", "1qEItQdzRfi5bCcTF1DqtwShirj7hFxa7", "public/images/zen-cine-esports"],
  ["tactics-duo", "1FZnOBVccqcRdX9XnGXXak4rmH0Bhl7C7", "public/images/tactics-duo"],
  ["zen-fifa-eworldcup", "1eimUNkbgE703JMs1zstQ__VHWrf0yQTn", "public/images/zen-fifa-eworldcup"],
  ["hlv-online", "1pXHoQuGgCjwyS8QigjH2K5EV5bK7NHt1", "public/images/hlv-online"],
  ["hlv-online-classic", "15R3KtogcFRJq75MA38cGGGHf1CpCAbEs", "public/images/hlv-online-classic"],
  ["hlv-onlive", "1eJeygkYWAfWQ0UIDBO2K7bhHlGd10HFE", "public/images/hlv-onlive"],
  ["cup-hoc-xem-bong", "1DCJnL7EmxuSPUPR7VsTTuoB1mFiJIBD0", "public/images/cup-hoc-xem-bong"],
  ["qua-bong-cuoi-nem-ngon", "1UDkPRax6aBcoszWgNYRKzvHURy0WLEmV", "public/images/qua-bong-cuoi-nem-ngon"],
  ["content-creator", "1fIAldxMHrTvt0RvtCVokOo_5Ur5G3K_b", "public/images/content-creator"],
  ["graphic-designer", "1kl0A-tkZRm4cEpXzPsdVfiqKNIj3ee8w", "public/images/graphic-designer"],
  ["cinematic-video-editor", "1BuqI9_Jqqtw9lBA0Vq72IV6JRod87O9I", "public/images/cinematic-video-editor"],
];

const hash = (data) => createHash("sha256").update(data).digest("hex");

async function listFolder(folderId) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not read folder ${folderId}: ${response.status}`);
  const html = await response.text();
  const entries = [...html.matchAll(/id=["']entry-([\w-]+)["'][\s\S]*?<div class=["']flip-entry-title["'][^>]*>([^<]+)<\/div>/g)]
    .map(([, id, name]) => ({ id, name: name.trim() }))
    .filter(({ name }) => /\.(?:png|jpe?g|webp|gif|svg|mp4|webm|mov)$/i.test(name));

  if (!entries.length) throw new Error(`No named media found in ${folderId}`);
  return entries;
}

async function downloadFile(file, targetDir) {
  const response = await fetch(`https://drive.usercontent.google.com/download?id=${file.id}&export=download&confirm=t`);
  if (!response.ok) throw new Error(`Could not download ${file.name}: ${response.status}`);
  const content = Buffer.from(await response.arrayBuffer());
  if (!content.length) throw new Error(`Downloaded empty file: ${file.name}`);
  await writeFile(path.join(targetDir, file.name), content);
}

async function main() {
  const before = hash(await readFile(PROTECTED_LOGO));
  const manifest = {};

  for (const [name, folderId, directory] of FOLDERS) {
    const targetDir = path.join(ROOT, directory);
    await mkdir(targetDir, { recursive: true });
    const files = await listFolder(folderId);
    await Promise.all(files.map((file) => downloadFile(file, targetDir)));
    manifest[name] = files.map((file) => file.name);
    console.log(`${name}: ${files.length} files`);
  }

  const after = hash(await readFile(PROTECTED_LOGO));
  if (before !== after) throw new Error("Protected MYM logo changed; aborting.");
  await writeFile(path.join(ROOT, "public/review-assets-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
