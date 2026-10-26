import { SKINCARE_SHELVES, SKINCARE_SHELF_SIZE } from "../config/fixtures.ts";
export type Pose = { x: number; z: number; yaw: number };
export const START: Pose = { x: 0, z: 8.6, yaw: 0 };
export const destinations = [
  {
    id: "entrance",
    label: "หน้าร้าน",
    description: "Refined selections from Seoul",
    pose: START,
  },
  {
    id: "collection",
    label: "Queen’s Balm",
    description: "เลือกผลิตภัณฑ์ที่อยากรู้จัก",
    pose: { x: 0, z: 3.15, yaw: 0 },
  },
  {
    id: "skincare",
    label: "ชั้นสกินแคร์",
    description: "เลือกชมผลิตภัณฑ์บนชั้น",
    pose: { x: -2.7, z: 3.5, yaw: Math.PI / 2 },
  },
  {
    id: "ritual",
    label: "มุมทดลอง",
    description: "สัมผัสรายละเอียดของคอลเลกชัน",
    pose: { x: -3.8, z: -1.9, yaw: 0 },
  },
  {
    id: "story",
    label: "ภาพแบรนด์",
    description: "A quieter kind of beauty",
    pose: { x: 3.8, z: -1.9, yaw: 0 },
  },
] as const;
const obstacles = [
  { x: -1.1, z: -0.2, w: 2.15, d: 2.0 },
  { x: 1.4, z: -0.75, w: 1.5, d: 1.5 },
  ...SKINCARE_SHELVES.map((shelf) => ({
    x: shelf.x,
    z: shelf.z,
    w: SKINCARE_SHELF_SIZE.depth,
    d: SKINCARE_SHELF_SIZE.width,
  })),
];
export function isWalkable(x: number, z: number) {
  return (
    Number.isFinite(x) &&
    Number.isFinite(z) &&
    x > -5.65 &&
    x < 5.65 &&
    z > -4.35 &&
    z < 9.3 &&
    !obstacles.some(
      (o) =>
        Math.abs(x - o.x) < o.w / 2 + 0.38 &&
        Math.abs(z - o.z) < o.d / 2 + 0.38,
    )
  );
}
export function moveWithCollision(p: Pose, dx: number, dz: number): Pose {
  let { x, z } = p;
  if (isWalkable(x + dx, z)) x += dx;
  if (isWalkable(x, z + dz)) z += dz;
  return { ...p, x, z };
}
export function isClearSegment(a: Pose, b: Pose) {
  const steps = Math.max(1, Math.ceil(Math.hypot(a.x - b.x, a.z - b.z) / 0.08));
  for (let i = 0; i <= steps; i++)
    if (
      !isWalkable(
        a.x + ((b.x - a.x) * i) / steps,
        a.z + ((b.z - a.z) * i) / steps,
      )
    )
      return false;
  return true;
}
// Small deterministic floor grid. Navigation never moves a camera through a display island.
export function findWalkRoute(from: Pose, to: Pose): Pose[] {
  if (!isWalkable(from.x, from.z) || !isWalkable(to.x, to.z)) return [];
  if (isClearSegment(from, to)) return [to];
  const step = 0.35,
    cols = 32,
    rows = 39;
  const point = (id: number): Pose => ({
    x: -5.4 + (id % cols) * step,
    z: -4.15 + Math.floor(id / cols) * step,
    yaw: to.yaw,
  });
  const valid = new Set(
    Array.from({ length: cols * rows }, (_, id) => id).filter((id) => {
      const p = point(id);
      return isWalkable(p.x, p.z);
    }),
  );
  const nearest = (p: Pose) =>
    [...valid]
      .sort(
        (a, b) =>
          Math.hypot(point(a).x - p.x, point(a).z - p.z) -
          Math.hypot(point(b).x - p.x, point(b).z - p.z),
      )
      .find((id) => isClearSegment(p, point(id)));
  const start = nearest(from),
    end = nearest(to);
  if (start === undefined || end === undefined) return [];
  const queue = [start],
    parents = new Map<number, number>();
  parents.set(start, -1);
  for (let i = 0; i < queue.length && !parents.has(end); i++) {
    const id = queue[i],
      col = id % cols,
      row = Math.floor(id / cols);
    for (const [x, z] of [
      [col + 1, row],
      [col - 1, row],
      [col, row + 1],
      [col, row - 1],
    ]) {
      const next = z * cols + x;
      if (
        x < 0 ||
        x >= cols ||
        z < 0 ||
        z >= rows ||
        !valid.has(next) ||
        parents.has(next)
      )
        continue;
      parents.set(next, id);
      queue.push(next);
    }
  }
  if (!parents.has(end)) return [];
  const raw: Pose[] = [to];
  for (let id = end; id !== -1; id = parents.get(id)!) raw.unshift(point(id));
  const route: Pose[] = [];
  let previous = from,
    index = 0;
  while (index < raw.length) {
    let furthest = index;
    for (let j = index; j < raw.length; j++)
      if (isClearSegment(previous, raw[j])) furthest = j;
    route.push(raw[furthest]);
    previous = raw[furthest];
    index = furthest + 1;
  }
  return route;
}
