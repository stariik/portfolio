"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { Particles } from "./particles";
import { FloatingShapes } from "./floating-shapes";
import { RetroComputer } from "./retro-computer";
import { CameraRig } from "./camera-rig";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

function SceneContent() {
  return (
    <>
      <CameraRig intensity={0.5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#E86A17" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9924A" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#FFB366"
      />

      <RetroComputer />
      <FloatingShapes />
      <Particles count={300} spread={15} size={0.02} />

      <Environment preset="city" />
      <Preload all />
    </>
  );
}

function SceneFallback({ className }: { className?: string }) {
  return <div className={className} />;
}

interface SceneProps {
  className?: string;
}

export function Scene({ className }: SceneProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
  }, []);

  // Still loading/checking
  if (webGLSupported === null) {
    return <div className={className} />;
  }

  // WebGL not supported
  if (!webGLSupported) {
    return <SceneFallback className={className} />;
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
