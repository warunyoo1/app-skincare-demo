import { useEffect, useMemo } from "react";
import { SRGBColorSpace } from "three";
import { useTexture } from "@react-three/drei";
import { products } from "../../products/data/catalog";
import { Block, Label, Photo } from "./Primitives";
import { ProductVessel } from "./ProductVessel";
import { createAlcoveGeometry } from "../lib/alcoveGeometry";
import { SKINCARE_SHELVES } from "../config/fixtures";
import { SkincareShelf } from "./SkincareShelf";
import { brandLogo } from "../../../shared/brand/brand";
import { createPhotoGeometry } from "../lib/photoGeometry";
import { useSurfaceMaps } from "../materials/useSurfaceMaps";
import {
  AmbientShadow,
  ArchitecturalTrim,
  ProductTray,
} from "./DisplayDetails";
function Alcove({ x, shelves = false }: { x: number; shelves?: boolean }) {
  const geometry = useMemo(createAlcoveGeometry, []);
  return (
    <group position={[x, 0.15, -5.5]}>
      <mesh geometry={geometry.panel} position={[0, 0, -0.015]} receiveShadow>
        <meshStandardMaterial color="#e5dfd3" roughness={0.8} />
      </mesh>
      <mesh geometry={geometry.frame} castShadow>
        <meshStandardMaterial
          color="#b08a5a"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      {shelves &&
        [0.65, 1.6].map((y) => (
          <Block
            key={y}
            position={[0, y, 0.2]}
            size={[2.15, 0.065, 0.7]}
            color="#f6f3ee"
          />
        ))}
    </group>
  );
}
function BrandMark() {
  const original = useTexture(brandLogo.src);
  const map = useMemo(() => {
    const texture = original.clone();
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [original]);
  useEffect(() => () => map.dispose(), [map]);
  const panel = useMemo(() => createPhotoGeometry(3.9, 0.92, 0.1), []);
  const image = map.image as HTMLImageElement;
  return (
    <group position={[0, 4.65, -5.8]}>
      <mesh geometry={panel} position={[0, 0, -0.025]}>
        <meshBasicMaterial color="#f6f3ee" toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[3.25, (3.25 * image.height) / image.width]} />
        <meshBasicMaterial
          map={map}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
function Floor() {
  const maps = useSurfaceMaps("stone", 4, 5)!;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.015, 1.5]}
      receiveShadow
    >
      <planeGeometry args={[18, 20]} />
      <meshStandardMaterial
        map={maps.colourMap}
        bumpMap={maps.reliefMap}
        bumpScale={0.004}
        roughnessMap={maps.reliefMap}
        color="#e7e0d4"
        roughness={0.85}
      />
    </mesh>
  );
}
function Plant() {
  return (
    <group position={[-5.2, 0, -4.3]}>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.22, 0.72, 32]} />
        <meshStandardMaterial color="#d1c8b8" roughness={0.8} />
      </mesh>
      {[-1, 0, 1].map((v) => (
        <group key={v} rotation={[v * 0.15, 0, v * 0.19]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.012, 0.018, 1.7, 8]} />
            <meshStandardMaterial color="#6b7254" />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[i % 2 ? -0.13 : 0.13, 1.1 + i * 0.26, 0]}
              rotation={[0.1, 0, i % 2 ? -0.4 : 0.4]}
            >
              <sphereGeometry args={[0.15, 12, 10]} />
              <meshStandardMaterial color="#7a8661" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
export function Interior({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <>
      <Floor />
      <ArchitecturalTrim />
      <AmbientShadow x={-1.1} z={-0.2} width={3.4} depth={3.2} />
      <AmbientShadow x={1.4} z={-0.75} width={2.6} depth={2.6} />
      {SKINCARE_SHELVES.map((shelf) => (
        <SkincareShelf key={shelf.id} {...shelf} onSelect={onSelect} />
      ))}
      <Block position={[0, 2.8, -6]} size={[12.5, 5.6, 0.25]} color="#2a3856" />
      <Block position={[-6.3, 2.6, 0]} size={[0.2, 5.2, 12]} color="#f6f3ee" />
      <Block position={[6.3, 2.6, 0]} size={[0.2, 5.2, 12]} color="#f6f3ee" />
      <Block position={[0, 5.25, -2]} size={[12.5, 0.16, 8]} color="#e6dfd2" />
      <BrandMark />
      {[-3.8, 0, 3.8].map((x) => (
        <Alcove key={x} x={x} shelves={x === -3.8} />
      ))}
      <Photo
        src="/assets/editorial.webp"
        position={[0, 1.95, -5.43]}
        width={1.72}
        height={2.16}
        cornerRadius={0.16}
        frame={false}
      />
      <Photo
        src="/assets/ritual.webp"
        position={[3.8, 2.15, -5.43]}
        width={1.72}
        height={1.5}
        frame={false}
      />
      <Label
        text="The daily ritual"
        position={[3.8, 1.1, -5.1]}
        width={1.7}
        height={0.23}
        serif
      />
      <Label
        text="A moment for yourself."
        position={[3.8, 0.87, -5.1]}
        width={1.7}
        height={0.11}
      />
      <group position={[-3.8, 0.83, -5.05]}>
        <group position={[-0.43, 0, 0]} scale={0.62}>
          <ProductVessel
            product={products[0]}
            position={[0, 0, 0]}
            open
            onSelect={onSelect}
          />
        </group>
        <group position={[0.43, 0, 0]} scale={0.62}>
          <ProductVessel
            product={products[1]}
            position={[0, 0, 0]}
            open
            onSelect={onSelect}
          />
        </group>
      </group>
      <Label
        text="Discover the texture"
        position={[-3.8, 2.9, -5.24]}
        width={1.85}
        height={0.27}
        serif
      />
      <Label
        text="POUCH24 · Queen’s Balm"
        position={[-3.8, 2.56, -5.24]}
        width={1.85}
        height={0.13}
      />
      <group position={[-1.1, 0, -0.2]}>
        <Block
          position={[0, 0.06, 0]}
          size={[1.99, 0.12, 1.84]}
          radius={0.04}
          color="#595147"
        />
        <Block
          position={[0, 0.64, 0]}
          size={[2.15, 1.04, 2]}
          radius={0.3}
          color="#d9d1c2"
          finish="stone"
        />
        <Block
          position={[0, 1.17, 0]}
          size={[2.21, 0.06, 2.06]}
          radius={0.22}
          color="#b08a5a"
          metalness={0.65}
          roughness={0.35}
        />
        <Block
          position={[0, 1.215, 0]}
          size={[2.18, 0.045, 2.03]}
          radius={0.22}
          color="#f6f3ee"
          roughness={0.4}
          finish="stone"
        />
        <ProductTray position={[0, 1.24, -0.1]} />
        <group position={[0, 1.285, -0.1]} scale={0.8}>
          <ProductVessel
            product={products[0]}
            position={[0, 0, 0]}
            onSelect={onSelect}
          />
        </group>
        <Label
          text="Queen’s Balm"
          position={[0, 0.7, 1.005]}
          width={1.55}
          height={0.25}
          serif
        />
        <Label
          text="POUCH24"
          position={[0, 0.41, 1.005]}
          width={1.1}
          height={0.1}
        />
      </group>
      <group position={[1.4, 0, -0.75]}>
        <Block
          position={[0, 0.06, 0]}
          size={[1.34, 0.12, 1.34]}
          radius={0.04}
          color="#252c3e"
        />
        <Block
          position={[0, 0.83, 0]}
          size={[1.5, 1.42, 1.5]}
          radius={0.22}
          color="#2a3856"
        />
        <Block
          position={[0, 1.555, 0]}
          size={[1.55, 0.04, 1.55]}
          radius={0.18}
          color="#b08a5a"
          metalness={0.7}
          roughness={0.32}
        />
        <ProductTray position={[0, 1.58, -0.05]} radius={0.34} />
        <group position={[0, 1.625, -0.05]} scale={0.65}>
          <ProductVessel
            product={products[1]}
            position={[0, 0, 0]}
            onSelect={onSelect}
          />
        </group>
        <Label
          text="Soft ivory"
          position={[0, 0.9, 0.755]}
          width={1.2}
          height={0.22}
          serif
          color="#f6f3ee"
        />
      </group>
      <Photo
        src="/assets/water.webp"
        position={[6.17, 2.5, 0.7]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.35}
        height={3.1}
      />
      <Photo
        src="/assets/texture.webp"
        position={[-6.17, 2.45, 0.6]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.2}
        height={2.7}
      />
      <Label
        text="Beauty, thoughtfully chosen."
        position={[0, 0.01, 5.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={4.2}
        height={0.45}
        serif
        color="#8d7c67"
      />
      <Plant />
      {[-4, 0, 4].map((x) => (
        <group key={x}>
          <mesh position={[x, 4.6, -3.8]}>
            <cylinderGeometry args={[0.06, 0.075, 0.24, 16]} />
            <meshStandardMaterial
              color="#b08a5a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <pointLight
            position={[x, 3.9, -3.9]}
            intensity={7.5}
            distance={7}
            decay={2}
            color="#fff0d8"
          />
        </group>
      ))}
    </>
  );
}
