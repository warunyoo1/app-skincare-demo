import { useEffect, useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

export type SurfaceFinish = "none" | "stone";

// Subtle, deterministic mineral grain. It modulates the chosen CI colour;
// it never replaces source product photography or uses external texture URLs.
function createStoneMaps(repeatX: number, repeatY: number) {
  const size = 256;
  const colour = document.createElement("canvas");
  const relief = document.createElement("canvas");
  colour.width = colour.height = relief.width = relief.height = size;
  const colourContext = colour.getContext("2d")!;
  const reliefContext = relief.getContext("2d")!;
  const pixels = colourContext.createImageData(size, size);
  const heights = reliefContext.createImageData(size, size);
  let seed = 71;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (seed * 16807) % 2147483647;
      const grain = (seed % 1000) / 1000;
      const vein = Math.pow(
        Math.abs(Math.sin(y * 0.052 + Math.sin(x * 0.023) * 1.4)),
        10,
      );
      const tone = Math.round(250 - grain * 6 - vein * 6);
      const height = Math.round(170 + grain * 22 - vein * 13);
      const index = (y * size + x) * 4;
      pixels.data.set([tone, tone, tone - 1, 255], index);
      heights.data.set([height, height, height, 255], index);
    }
  }
  colourContext.putImageData(pixels, 0, 0);
  reliefContext.putImageData(heights, 0, 0);
  const colourMap = new CanvasTexture(colour);
  colourMap.colorSpace = SRGBColorSpace;
  const reliefMap = new CanvasTexture(relief);
  for (const texture of [colourMap, reliefMap]) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = 4;
  }
  return { colourMap, reliefMap };
}

export function useSurfaceMaps(
  finish: SurfaceFinish = "none",
  repeatX = 1,
  repeatY = 1,
) {
  const maps = useMemo(
    () => (finish === "stone" ? createStoneMaps(repeatX, repeatY) : null),
    [finish, repeatX, repeatY],
  );
  useEffect(
    () => () => {
      maps?.colourMap.dispose();
      maps?.reliefMap.dispose();
    },
    [maps],
  );
  return maps;
}
