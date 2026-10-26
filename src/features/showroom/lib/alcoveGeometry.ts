import * as THREE from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

// Both outlines use the same resolution so the inset follows the bronze rim.
const CURVE_SEGMENTS = 64;

export function createAlcoveGeometry() {
  const outer = new THREE.Shape();
  outer.moveTo(-1.22, 0);
  outer.lineTo(1.22, 0);
  outer.lineTo(1.22, 2.55);
  outer.absarc(0, 2.55, 1.22, 0, Math.PI, false);
  outer.lineTo(-1.22, 0);
  const panel = new THREE.ShapeGeometry(outer.clone(), CURVE_SEGMENTS);

  const hole = new THREE.Path();
  hole.moveTo(-1.08, 0.05);
  hole.lineTo(-1.08, 2.55);
  hole.absarc(0, 2.55, 1.08, Math.PI, 0, true);
  hole.lineTo(1.08, 0.05);
  hole.lineTo(-1.08, 0.05);
  outer.holes.push(hole);

  const frame = new THREE.ExtrudeGeometry(outer, {
    depth: 0.1,
    curveSegments: CURVE_SEGMENTS,
    bevelEnabled: true,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    bevelSegments: 6,
    steps: 1,
  });

  // Extrusion creates separate face vertices. Smooth their lighting across the
  // curve and bevel, preserving the hard corners of the frame's flat sections.
  const originalNormals = frame.getAttribute("normal").clone();
  toCreasedNormals(frame, Math.PI / 3);
  // Keep the broad bronze front flat. Blending the bevel's normals into its
  // triangulated cap creates triangular highlights on an otherwise flat rim.
  const normals = frame.getAttribute("normal");
  for (const group of frame.groups) {
    if (group.materialIndex !== 0) continue;
    for (let i = group.start; i < group.start + group.count; i++) {
      normals.setXYZ(
        i,
        originalNormals.getX(i),
        originalNormals.getY(i),
        originalNormals.getZ(i),
      );
    }
  }
  return { panel, frame };
}
