"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}

function FloatingBox({ position, color, speed = 1, rotationIntensity = 1, floatIntensity = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    meshRef.current.rotation.y += 0.005 * speed;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, color, speed = 1, floatIntensity = 1 }: ShapeProps) {
  return (
    <Float speed={speed * 2} floatIntensity={floatIntensity}>
      <mesh position={position}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color, speed = 1, rotationIntensity = 1, floatIntensity = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01 * speed;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({ position, color, speed = 1, floatIntensity = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.008 * speed;
    meshRef.current.rotation.x += 0.005 * speed;
  });

  return (
    <Float speed={speed * 2} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} wireframe />
      </mesh>
    </Float>
  );
}

export function FloatingShapes() {
  return (
    <group>
      <FloatingBox
        position={[-3, 1.5, -2]}
        color="#E86A17"
        speed={0.8}
        floatIntensity={0.5}
      />
      <FloatingSphere
        position={[3, -1, -3]}
        color="#F07B1A"
        speed={1.2}
        floatIntensity={0.7}
      />
      <FloatingTorus
        position={[-2.5, -1.5, -1]}
        color="#C9924A"
        speed={1}
        floatIntensity={0.6}
      />
      <FloatingOctahedron
        position={[2.5, 2, -2.5]}
        color="#C2873D"
        speed={0.9}
        floatIntensity={0.8}
      />
      <FloatingBox
        position={[4, 0, -4]}
        color="#FFB366"
        speed={0.7}
        floatIntensity={0.4}
      />
      <FloatingSphere
        position={[-4, 0.5, -3]}
        color="#E86A17"
        speed={1.1}
        floatIntensity={0.5}
      />
    </group>
  );
}
