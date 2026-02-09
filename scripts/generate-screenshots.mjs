import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

// Colors matching the app theme
const bg = "#110d1b";
const violet = "#7c3aed";
const lightViolet = "#8b5cf6";
const textColor = "#e2e8f0";
const mutedColor = "#94a3b8";

function createScreenshotSvg(width, height) {
  const isWide = width > height;
  const titleSize = isWide ? 48 : 36;
  const subtitleSize = isWide ? 24 : 18;
  const iconBlockSize = isWide ? 32 : 24;
  const gap = isWide ? 6 : 4;

  // Mini pixel "P" icon centered above text
  const iconOriginX = width / 2 - iconBlockSize * 2.5;
  const iconOriginY = height / 2 - (isWide ? 120 : 100);

  const pixelP = [
    // Left bar
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    // Top
    [1, 0], [2, 0], [3, 0],
    // Right bump
    [3, 1],
    // Middle
    [1, 2], [2, 2], [3, 2],
  ];

  const blocks = pixelP
    .map(([col, row]) => {
      const x = iconOriginX + col * (iconBlockSize + gap);
      const y = iconOriginY + row * (iconBlockSize + gap);
      const fill = col >= 3 ? lightViolet : violet;
      return `<rect x="${x}" y="${y}" width="${iconBlockSize}" height="${iconBlockSize}" rx="4" fill="${fill}"/>`;
    })
    .join("\n    ");

  const textY = iconOriginY + 5 * (iconBlockSize + gap) + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>

  <!-- Pixel P icon -->
  ${blocks}

  <!-- App name -->
  <text x="${width / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="${textColor}">Pix3lPrompt</text>

  <!-- Subtitle -->
  <text x="${width / 2}" y="${textY + titleSize + 10}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${subtitleSize}" fill="${mutedColor}">Intelligent Prompt Editor for AI Generators</text>
</svg>`;
}

// Desktop screenshot (wide)
const desktopSvg = createScreenshotSvg(1280, 720);
await sharp(Buffer.from(desktopSvg))
  .png()
  .toFile(join(iconsDir, "screenshot-desktop.png"));
console.log("Generated screenshot-desktop.png (1280x720)");

// Mobile screenshot
const mobileSvg = createScreenshotSvg(390, 844);
await sharp(Buffer.from(mobileSvg))
  .png()
  .toFile(join(iconsDir, "screenshot-mobile.png"));
console.log("Generated screenshot-mobile.png (390x844)");

console.log("Done!");
