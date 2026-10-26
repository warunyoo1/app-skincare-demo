import fs from "node:fs/promises";
import sharp from "sharp";
await fs.mkdir("public/assets", { recursive: true });
const tasks = [
  ["photo-0.jpg", "editorial.webp", 1200],
  ["photo-1.png", "balm-ivory.webp", 700],
  ["photo-2.png", "balm-blue.webp", 700],
  ["photo-3.png", "balm-blue-open.webp", 700],
  ["photo-4.png", "balm-ivory-open.webp", 700],
  ["product-ref-1.jpg", "ritual.webp", 1200],
  ["product-ref-2.jpg", "texture.webp", 1200],
  ["product-ref-4.jpg", "water.webp", 1200],
];
for (const [source, target, width] of tasks)
  await sharp(".assets-original/" + source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile("public/assets/" + target);
for (const color of ["navy", "bronze", "ivory"])
  await sharp(".assets-original/logo-" + color + ".png")
    .trim()
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ lossless: true })
    .toFile("public/assets/logo-" + color + ".webp");
console.log("Prepared " + (tasks.length + 3) + " local brand assets.");
