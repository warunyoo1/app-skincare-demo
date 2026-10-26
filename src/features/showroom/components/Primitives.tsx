import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox, useTexture } from "@react-three/drei";
import { createPhotoGeometry } from "../lib/photoGeometry";
import { useSurfaceMaps } from "../materials/useSurfaceMaps";
import type { SurfaceFinish } from "../materials/useSurfaceMaps";
type V3 = [number, number, number];
export function Block({
  position,
  size,
  color = "#f6f3ee",
  radius = 0.035,
  metalness = 0,
  roughness = 0.7,
  finish = "none",
}: {
  position: V3;
  size: V3;
  color?: string;
  radius?: number;
  metalness?: number;
  roughness?: number;
  finish?: SurfaceFinish;
}) {
  const maps = useSurfaceMaps(finish);
  return (
    <RoundedBox
      args={size}
      position={position}
      radius={Math.min(radius, ...size.map((n) => n / 3))}
      smoothness={6}
      bevelSegments={6}
      creaseAngle={0.5}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        map={maps?.colourMap}
        bumpMap={maps?.reliefMap}
        bumpScale={0.006}
        roughnessMap={maps?.reliefMap}
      />
    </RoundedBox>
  );
}
export function Label({
  text,
  position,
  width = 2,
  height = 0.3,
  color = "#2a3856",
  background = "transparent",
  serif = false,
  rotation = [0, 0, 0],
}: {
  text: string;
  position: V3;
  width?: number;
  height?: number;
  color?: string;
  background?: string;
  serif?: boolean;
  rotation?: V3;
}) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = Math.max(80, Math.round((c.width * height) / width));
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${serif ? "400" : "500"} ${Math.round(c.height * 0.68)}px ${serif ? '"Cormorant Garamond"' : '"Poppins","Noto Sans Thai"'},serif`;
    ctx.fillText(text, 512, c.height * 0.54, 980);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, width, height, color, background, serif]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
export function Photo({
  src,
  position,
  width,
  height,
  rotation = [0, 0, 0],
  frame = true,
  cornerRadius = 0.14,
}: {
  src: string;
  position: V3;
  width: number;
  height: number;
  rotation?: V3;
  frame?: boolean;
  cornerRadius?: number;
}) {
  const geometry = useMemo(
    () => createPhotoGeometry(width, height, cornerRadius),
    [width, height, cornerRadius],
  );
  const rim = useMemo(
    () =>
      frame
        ? createPhotoGeometry(width + 0.09, height + 0.09, cornerRadius + 0.045)
        : null,
    [width, height, cornerRadius, frame],
  );
  const original = useTexture(src);
  const texture = useMemo(() => {
    const t = original.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    const im = original.image as HTMLImageElement;
    const aspect = im.width / im.height,
      target = width / height;
    if (aspect > target) {
      t.repeat.x = target / aspect;
      t.offset.x = (1 - t.repeat.x) / 2;
    } else {
      t.repeat.y = aspect / target;
      t.offset.y = (1 - t.repeat.y) / 2;
    }
    return t;
  }, [original, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group position={position} rotation={rotation}>
      {rim && (
        <mesh geometry={rim} position={[0, 0, -0.015]}>
          <meshStandardMaterial
            color="#b08a5a"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
      )}
      <mesh geometry={geometry} position={[0, 0, 0.005]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
