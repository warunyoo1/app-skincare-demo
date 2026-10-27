import fs from "node:fs/promises";
import sharp from "sharp";

const source = ".assets-original/Curated_SEOUL_logo_POUCH24_blue.png";
const target = "public/assets/logo-current.webp";
const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
let minX = info.width,
  minY = info.height,
  maxX = -1,
  maxY = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] <= 1) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}
if (maxX < 0) throw new Error("Logo has no visible pixels");
await fs.mkdir("public/assets", { recursive: true });
// Ignore isolated alpha=1 export noise in the margins. Preserve the wordmark's
// antialiased pixels and native resolution without resampling its source colour.
await sharp(source)
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  })
  .extend({
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ lossless: true })
  .toFile(target);
const manifestPath = "public/assets/sources.json";
const manifest = JSON.parse(
  (await fs.readFile(manifestPath, "utf8")).replace(/^\uFEFF/, ""),
);
manifest.files = manifest.files.filter(
  (file) => file.asset !== "logo-current.webp",
);
manifest.files.push({
  asset: "logo-current.webp",
  source:
    "https://drive.google.com/file/d/1aJyEdmc84Aa84WWkei65q48hGnWy--jJ/view",
  originalFileName: "Curated_SEOUL_logo_POUCH24_blue.png",
});
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  "Prepared current Curated Seoul logo with original colour and alpha.",
);
