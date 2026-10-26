import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

export function AmbientShadow({
  x,
  z,
  width,
  depth,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
}) {
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 14, 64, 64, 64);
    gradient.addColorStop(0, "#302b2470");
    gradient.addColorStop(0.48, "#302b2445");
    gradient.addColorStop(1, "#302b2400");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={[x, -0.008, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial
        map={map}
        transparent
        depthWrite={false}
        opacity={0.5}
        toneMapped={false}
      />
    </mesh>
  );
}

export function ProductTray({
  position,
  radius = 0.43,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.014, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius + 0.018, radius + 0.018, 0.028, 64]} />
        <meshStandardMaterial
          color="#b08a5a"
          metalness={0.75}
          roughness={0.42}
        />
      </mesh>
      <mesh position={[0, 0.032, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius, 0.017, 64]} />
        <meshStandardMaterial color="#f6f3ee" roughness={0.52} />
      </mesh>
    </group>
  );
}

export function ArchitecturalTrim() {
  return (
    <>
      {[-6.16, 6.16].map((x) => (
        <group key={x}>
          <mesh position={[x, 5.06, -2]}>
            <boxGeometry args={[0.035, 0.025, 7.4]} />
            <meshBasicMaterial color="#fff0d7" toneMapped={false} />
          </mesh>
          <mesh position={[x, 0.12, 0]}>
            <boxGeometry args={[0.055, 0.24, 11.9]} />
            <meshStandardMaterial color="#c9c0b1" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 5.06, -5.79]}>
        <boxGeometry args={[12.28, 0.025, 0.035]} />
        <meshBasicMaterial color="#fff0d7" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.16, -5.82]}>
        <boxGeometry args={[12.3, 0.026, 0.035]} />
        <meshStandardMaterial
          color="#b08a5a"
          metalness={0.65}
          roughness={0.45}
        />
      </mesh>
    </>
  );
}
