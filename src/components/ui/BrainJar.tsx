"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/brain_in_a_jar.glb";

function BrainModel({
  scrollProgressRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            (m as THREE.MeshStandardMaterial).envMapIntensity = 1.1;
          });
        } else {
          (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.1;
        }
      }
    });
    return c;
  }, [scene]);

  const idleSpin = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = scrollProgressRef.current;

    const entryEnd = 0.55;
    const entryT = Math.min(1, p / entryEnd);
    const eased = 1 - Math.pow(1 - entryT, 3);

    // Rise from below view into the centre
    group.position.y = -3.2 + eased * 3.2;

    // Scale up slightly as it arrives
    const scale = 0.6 + eased * 0.4;
    group.scale.setScalar(scale);

    // Scroll-driven twist during entry, then gentle idle spin forever
    idleSpin.current += delta * (0.25 + (1 - entryT) * 0.6);
    const entryRot = entryT * Math.PI * 1.4;
    group.rotation.y = entryRot + idleSpin.current;

    // Slight tilt that flattens as it settles
    group.rotation.x = -0.08 * (1 - entryT);
  });

  return <primitive ref={groupRef} object={cloned} dispose={null} />;
}

export default function BrainJar({
  scrollProgressRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#35d0ff" />
      <pointLight position={[3, 3, 2]} intensity={0.4} color="#8b7bff" />

      <BrainModel scrollProgressRef={scrollProgressRef} />

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={3}
      />
      <Environment preset="city" />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
