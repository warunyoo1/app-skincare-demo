import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { START, moveWithCollision, findWalkRoute } from "../lib/navigation";
import type { Pose } from "../lib/navigation";
export type Movement = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};
export type Journey = { key: number; pose: Pose };
export function CameraRig({
  journey,
  overview,
  paused,
  movement,
  onManualMove,
}: {
  journey: Journey;
  overview: boolean;
  paused: boolean;
  movement: React.RefObject<Movement>;
  onManualMove: () => void;
}) {
  const { camera, gl } = useThree();
  const pose = useRef<Pose>({ ...START });
  const keys = useRef(new Set<string>());
  const moving = useRef(false);
  const target = useRef<Pose | null>(null);
  const previous = useRef<{ x: number; y: number; moved: number } | null>(null);
  const quat = useRef(new THREE.Quaternion());
  const reduced = useRef(false);
  const route = useRef<Pose[]>([]);
  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);
  useEffect(() => {
    if (!overview) {
      route.current = findWalkRoute(pose.current, journey.pose);
      target.current = route.current.shift() ?? null;
      moving.current = Boolean(target.current);
      if (reduced.current) {
        pose.current = { ...journey.pose };
        target.current = null;
        route.current = [];
        moving.current = false;
      }
    } else {
      target.current = null;
      route.current = [];
      moving.current = false;
      camera.position.set(9, 10, 13);
      camera.lookAt(0, 1.2, -1);
    }
  }, [journey, overview, camera]);
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (
        paused ||
        overview ||
        (e.target as HTMLElement).closest(
          'input,textarea,select,button,[role="dialog"]',
        )
      )
        return;
      if (
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.code)
      ) {
        e.preventDefault();
        keys.current.add(e.code);
      }
    };
    const keyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    const clear = () => {
      keys.current.clear();
      previous.current = null;
      Object.assign(movement.current, {
        forward: false,
        backward: false,
        left: false,
        right: false,
      });
    };
    const down = (e: PointerEvent) => {
      if (paused || overview || e.button !== 0) return;
      previous.current = { x: e.clientX, y: e.clientY, moved: 0 };
    };
    const move = (e: PointerEvent) => {
      const p = previous.current;
      if (!p || paused || overview) return;
      const dx = e.clientX - p.x;
      pose.current.yaw -= dx * 0.004;
      p.moved += Math.abs(dx);
      p.x = e.clientX;
      p.y = e.clientY;
      if (p.moved > 4) {
        target.current = null;
        moving.current = false;
      }
    };
    const up = () => {
      previous.current = null;
    };
    const canvas = gl.domElement;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", clear);
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      clear();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", clear);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [camera, gl, overview, paused, movement]);
  useFrame((_, delta) => {
    if (overview) return;
    const d = Math.min(delta, 0.05);
    let p = pose.current;
    const m = movement.current;
    const forward =
      Number(
        keys.current.has("KeyW") || keys.current.has("ArrowUp") || m.forward,
      ) -
      Number(
        keys.current.has("KeyS") || keys.current.has("ArrowDown") || m.backward,
      );
    const side =
      Number(
        keys.current.has("KeyD") || keys.current.has("ArrowRight") || m.right,
      ) -
      Number(
        keys.current.has("KeyA") || keys.current.has("ArrowLeft") || m.left,
      );
    if (!paused && (forward || side)) {
      if (target.current) {
        target.current = null;
        moving.current = false;
      }
      const norm = Math.hypot(forward, side);
      p = moveWithCollision(
        p,
        ((-Math.sin(p.yaw) * forward + Math.cos(p.yaw) * side) * d * 2.7) /
          norm,
        ((-Math.cos(p.yaw) * forward - Math.sin(p.yaw) * side) * d * 2.7) /
          norm,
      );
      pose.current = p;
      if (!moving.current) {
        moving.current = true;
        onManualMove();
      }
    }
    if (target.current && !paused) {
      const t = target.current;
      const alpha = reduced.current ? 1 : 1 - Math.exp(-d * 3.5);
      p = {
        x: THREE.MathUtils.lerp(p.x, t.x, alpha),
        z: THREE.MathUtils.lerp(p.z, t.z, alpha),
        yaw: THREE.MathUtils.lerp(p.yaw, t.yaw, alpha),
      };
      pose.current = p;
      if (Math.hypot(p.x - t.x, p.z - t.z) < 0.025) {
        pose.current = { ...t };
        target.current = route.current.shift() ?? null;
        moving.current = Boolean(target.current);
      }
    }
    camera.position.set(p.x, 1.9, p.z);
    quat.current.setFromEuler(new THREE.Euler(-0.065, p.yaw, 0, "YXZ"));
    camera.quaternion.copy(quat.current);
  });
  return overview ? (
    <OrbitControls
      target={[0, 1.2, -1]}
      minDistance={6}
      maxDistance={24}
      maxPolarAngle={Math.PI / 2.2}
      enablePan={false}
    />
  ) : null;
}
