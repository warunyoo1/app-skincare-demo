import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { Product } from "../../products/data/catalog";
import { Label } from "./Primitives";
export function ProductVessel({
  product,
  position,
  open = false,
  onSelect,
}: {
  product: Product;
  position: [number, number, number];
  open?: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<Group>(null);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)"),
    [],
  );
  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.035 : 1;
    if (Math.abs(group.current.scale.x - target) < 0.0001) return;
    const scale = reducedMotion.matches
      ? target
      : MathUtils.damp(
          group.current.scale.x,
          target,
          14,
          Math.min(delta, 0.05),
        );
    group.current.scale.setScalar(scale);
  });
  const down = useRef<[number, number]>([0, 0]);
  const blue = product.id.endsWith("blue");
  function over(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }
  return (
    <group
      ref={group}
      position={position}
      onPointerOver={over}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        down.current = [e.clientX, e.clientY];
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (
          Math.hypot(e.clientX - down.current[0], e.clientY - down.current[1]) <
          8
        )
          onSelect(product.id);
      }}
    >
      <mesh position={[0, 0.54, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 1.05, 40]} />
        <meshStandardMaterial
          color={product.color}
          metalness={blue ? 0.55 : 0.08}
          roughness={blue ? 0.27 : 0.34}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.195, 0.195, 0.23, 40]} />
        <meshStandardMaterial
          color={product.color}
          metalness={blue ? 0.7 : 0.1}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.196, 0.196, 0.012, 40]} />
        <meshStandardMaterial
          color={blue ? "#3664ae" : "#d1cbbf"}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <Label
        text="POUCH24"
        position={[0, 0.18, 0.198]}
        width={0.3}
        height={0.06}
        color={blue ? "#ece4ca" : "#2a3856"}
      />
      {!open && (
        <Label
          text="Queen’s Balm"
          position={[0, 0.7, 0.194]}
          width={0.3}
          height={0.043}
          color={blue ? "#f6f3ee" : "#2a3856"}
        />
      )}
      {open && (
        <>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.21, 40]} />
            <meshStandardMaterial color="#f6e1a1" roughness={0.47} />
          </mesh>
          <mesh position={[0, 1.205, 0]}>
            <sphereGeometry
              args={[0.16, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color="#f6e1a1" roughness={0.47} />
          </mesh>
        </>
      )}
      {hovered && (
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.27, 0.29, 48]} />
          <meshBasicMaterial color="#b08a5a" />
        </mesh>
      )}
    </group>
  );
}
