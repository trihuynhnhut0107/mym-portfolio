/**
 * Legacy wrapper forwarding to scripts/find-images.js
 */
import { main } from "./find-images.js";

// If called directly with node scripts/organize-images.js, default to --all --write unless arguments provided
if (process.argv.length <= 2) {
  process.argv.push("--all", "--write");
}

main();
