import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
const svgPath = join(iconsDir, "icon.svg");

const sizes = [192, 512];

for (const size of sizes) {
  const output = join(iconsDir, `icon-${size}x${size}.png`);
  await sharp(svgPath).resize(size, size).png().toFile(output);
  console.log(`Generated ${output}`);
}

// Apple touch icon (180x180)
const applePath = join(iconsDir, "apple-touch-icon.png");
await sharp(svgPath).resize(180, 180).png().toFile(applePath);
console.log(`Generated ${applePath}`);

console.log("Done!");
