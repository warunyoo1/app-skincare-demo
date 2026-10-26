// The render and floor collision use the same rack footprint.
export const SKINCARE_SHELVES = [
  { id: "skincare-left", x: -5.55, z: 3.5, rotation: Math.PI / 2 },
  { id: "skincare-right", x: 5.55, z: 3.5, rotation: -Math.PI / 2 },
] as const;
export const SKINCARE_SHELF_SIZE = { width: 2.46, depth: 0.74 };
