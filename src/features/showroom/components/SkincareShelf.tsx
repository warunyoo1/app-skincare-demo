import { products } from "../../products/data/catalog";
import { Block, Label } from "./Primitives";
import { ProductVessel } from "./ProductVessel";
import { ProductTray } from "./DisplayDetails";

export function SkincareShelf({
  x,
  z,
  rotation,
  onSelect,
}: {
  x: number;
  z: number;
  rotation: number;
  onSelect: (id: string) => void;
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <Block
        position={[0, 0.28, 0]}
        size={[2.46, 0.56, 0.74]}
        radius={0.08}
        color="#2a3856"
      />
      <Block
        position={[0, 1.44, -0.29]}
        size={[2.4, 2.16, 0.08]}
        color="#f6f3ee"
      />
      {[-1.17, 1.17].map((side) => (
        <Block
          key={side}
          position={[side, 1.36, 0]}
          size={[0.045, 2.5, 0.64]}
          color="#b08a5a"
          metalness={0.65}
          roughness={0.4}
        />
      ))}
      {[0.83, 1.62].map((height, level) => (
        <group key={height}>
          <Block
            position={[0, height, 0.015]}
            size={[2.38, 0.08, 0.67]}
            radius={0.025}
            color="#f6f3ee"
            finish="stone"
          />
          <Block
            position={[0, height - 0.045, 0.352]}
            size={[2.34, 0.018, 0.018]}
            color="#b08a5a"
            metalness={0.65}
            roughness={0.4}
          />
          {products.map((product, index) => (
            <group
              key={product.id}
              position={[-0.52 + index * 1.04, height + 0.045, 0.06]}
            >
              <ProductTray position={[0, 0, 0]} radius={0.13} />
              <group position={[0, 0.045, 0]} scale={0.48}>
                <ProductVessel
                  product={product}
                  position={[0, 0, 0]}
                  open={level === 1}
                  onSelect={onSelect}
                />
              </group>
              <Label
                text={
                  level === 1
                    ? "มุมทดลอง · " + product.variant
                    : product.variant
                }
                position={[0, -0.04, 0.307]}
                width={0.93}
                height={0.1}
              />
            </group>
          ))}
        </group>
      ))}
      <Block
        position={[0, 2.72, 0]}
        size={[2.46, 0.42, 0.66]}
        radius={0.055}
        color="#2a3856"
      />
      <Label
        text="POUCH24"
        position={[0, 2.78, 0.335]}
        width={1.8}
        height={0.18}
        color="#f6f3ee"
      />
      <Label
        text="Queen’s Balm"
        position={[0, 2.57, 0.335]}
        width={1.8}
        height={0.15}
        serif
        color="#d9d1c2"
      />
      <mesh position={[0, 2.495, 0.13]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.12, 0.035]} />
        <meshBasicMaterial color="#fff1d6" />
      </mesh>
      <Label
        text="Skincare, thoughtfully chosen."
        position={[0, 0.3, 0.376]}
        width={1.95}
        height={0.19}
        serif
        color="#f6f3ee"
      />
    </group>
  );
}
