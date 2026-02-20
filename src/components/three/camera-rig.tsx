"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  intensity?: number;
}

export function CameraRig({ intensity = 0.5 }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame(() => {
    // Move camera based on mouse position
    vec.current.set(pointer.x * intensity, pointer.y * intensity * 0.5, camera.position.z);
    camera.position.lerp(vec.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
