import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as THREE from "three";
import { Interior } from "./Interior";
import { CameraRig } from "./CameraRig";
import type { Journey, Movement } from "./CameraRig";
function Reflections() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const render = generator.fromScene(environment, 0.04);
    scene.environment = render.texture;
    scene.environmentIntensity = 0.5;
    return () => {
      scene.environment = null;
      render.dispose();
      environment.dispose();
      generator.dispose();
    };
  }, [gl, scene]);
  return null;
}
export default function ShowroomScene({
  onSelect,
  journey,
  overview,
  paused,
  movement,
  onManualMove,
  onReady,
}: {
  onSelect: (id: string) => void;
  journey: Journey;
  overview: boolean;
  paused: boolean;
  movement: React.RefObject<Movement>;
  onManualMove: () => void;
  onReady: () => void;
}) {
  const [lost, setLost] = useState(false);
  if (lost)
    return (
      <div className="scene-fallback">
        <p>การแสดงผล 3D หยุดชั่วคราว</p>
        <button onClick={() => window.location.reload()}>โหลดร้านใหม่</button>
      </div>
    );
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.9, 8.6], fov: 58, near: 0.1, far: 70 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#f1ece3");
        gl.domElement.setAttribute(
          "aria-label",
          "ร้าน Curated Seoul แบบ 3D ลากเพื่อมองและใช้ W A S D เพื่อเดิน",
        );
        gl.domElement.tabIndex = 0;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            setLost(true);
          },
          { once: true },
        );
        onReady();
      }}
    >
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#fffaf0", "#c8b8a4", 1.05]} />
      <directionalLight
        position={[-3, 7, 6]}
        intensity={2.25}
        color="#fff3e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.025}
      />
      <Reflections />
      <Suspense fallback={null}>
        <Interior onSelect={onSelect} />
      </Suspense>
      <CameraRig
        journey={journey}
        overview={overview}
        paused={paused}
        movement={movement}
        onManualMove={onManualMove}
      />
    </Canvas>
  );
}
