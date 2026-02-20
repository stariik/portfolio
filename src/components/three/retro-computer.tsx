"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text, useCursor } from "@react-three/drei";
import * as THREE from "three";

function Screen({ hovered }: { hovered: boolean }) {
  const screenRef = useRef<THREE.Mesh>(null);
  const [textIndex, setTextIndex] = useState(0);

  const codeLines = [
    "> Hello World_",
    "> const dev = 'Tornike'",
    "> npm run awesome",
    "> Building dreams...",
    "> Loading creativity",
  ];

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      const baseIntensity = hovered ? 0.8 : 0.5;
      material.emissiveIntensity = baseIntensity + Math.sin(state.clock.elapsedTime * 10) * 0.1;
    }

    // Change text every 3 seconds
    if (Math.floor(state.clock.elapsedTime) % 3 === 0 && Math.floor(state.clock.elapsedTime * 10) % 30 === 0) {
      setTextIndex((prev) => (prev + 1) % codeLines.length);
    }
  });

  return (
    <group>
      {/* Screen glow backdrop */}
      <mesh position={[0, 0.6, 0.29]}>
        <planeGeometry args={[2.5, 1.9]} />
        <meshBasicMaterial color="#E86A17" transparent opacity={hovered ? 0.15 : 0.08} />
      </mesh>

      {/* Main screen */}
      <mesh ref={screenRef} position={[0, 0.6, 0.31]}>
        <planeGeometry args={[2.3, 1.7]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#E86A17"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Scanlines effect */}
      <mesh position={[0, 0.6, 0.315]}>
        <planeGeometry args={[2.3, 1.7]} />
        <meshBasicMaterial
          transparent
          opacity={0.03}
          color="#000000"
        />
      </mesh>

      {/* Terminal text */}
      <Text
        position={[-0.9, 1.1, 0.32]}
        fontSize={0.08}
        color="#E86A17"
        anchorX="left"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        TORNIKE_OS v1.0.0
      </Text>

      <Text
        position={[-0.9, 0.85, 0.32]}
        fontSize={0.06}
        color="#888888"
        anchorX="left"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        ─────────────────────────
      </Text>

      <Text
        position={[-0.9, 0.6, 0.32]}
        fontSize={0.12}
        color="#F07B1A"
        anchorX="left"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        {codeLines[textIndex]}
      </Text>

      <Text
        position={[-0.9, 0.35, 0.32]}
        fontSize={0.08}
        color="#C9924A"
        anchorX="left"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        Full-Stack Developer
      </Text>

      <Text
        position={[-0.9, 0.1, 0.32]}
        fontSize={0.06}
        color="#666666"
        anchorX="left"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        React | Next.js | TypeScript | Node.js
      </Text>
    </group>
  );
}

function KeyboardKey({ position, width = 0.18, height = 0.1, isSpecial = false }: {
  position: [number, number, number];
  width?: number;
  height?: number;
  isSpecial?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useCursor(hovered);

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      scale={pressed ? [0.95, 0.5, 0.95] : [1, 1, 1]}
    >
      <boxGeometry args={[width, 0.04, height]} />
      <meshStandardMaterial
        color={isSpecial ? "#E86A17" : hovered ? "#3D3429" : "#2D251E"}
        metalness={0.1}
        roughness={0.9}
        emissive={hovered ? "#E86A17" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

export function RetroComputer() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={[0, 0, 0]}
        scale={0.85}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Monitor outer frame */}
        <RoundedBox args={[3.2, 2.7, 0.6]} radius={0.15} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#1A1512" metalness={0.4} roughness={0.6} />
        </RoundedBox>

        {/* Monitor body */}
        <RoundedBox args={[3, 2.5, 0.5]} radius={0.1} position={[0, 0.5, 0.06]}>
          <meshStandardMaterial color="#2D251E" metalness={0.3} roughness={0.7} />
        </RoundedBox>

        {/* Monitor bezel */}
        <RoundedBox args={[2.6, 2, 0.1]} radius={0.05} position={[0, 0.6, 0.25]}>
          <meshStandardMaterial color="#1A1512" metalness={0.2} roughness={0.8} />
        </RoundedBox>

        {/* Screen */}
        <Screen hovered={hovered} />

        {/* Vent holes on the side */}
        {[...Array(5)].map((_, i) => (
          <mesh key={`vent-${i}`} position={[1.45, 0.3 + i * 0.2, 0]}>
            <boxGeometry args={[0.05, 0.08, 0.3]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        ))}

        {/* Monitor brand label */}
        <mesh position={[0, -0.35, 0.26]}>
          <planeGeometry args={[0.6, 0.12]} />
          <meshStandardMaterial color="#C9924A" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Monitor Stand - neck */}
        <RoundedBox args={[0.4, 0.9, 0.35]} radius={0.05} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#1A1512" metalness={0.3} roughness={0.7} />
        </RoundedBox>

        {/* Monitor Stand - base */}
        <group position={[0, -1.25, 0]}>
          <RoundedBox args={[1.8, 0.1, 1]} radius={0.03}>
            <meshStandardMaterial color="#1A1512" metalness={0.4} roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[1.4, 0.05, 0.7]} radius={0.02} position={[0, 0.07, 0]}>
            <meshStandardMaterial color="#2D251E" metalness={0.3} roughness={0.7} />
          </RoundedBox>
        </group>

        {/* Power LED */}
        <mesh position={[1.2, -0.35, 0.27]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={hovered ? 3 : 1.5}
          />
        </mesh>

        {/* Power button */}
        <mesh position={[1.0, -0.35, 0.27]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#2D251E" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Keyboard base */}
        <group position={[0, -1.35, 1.3]}>
          <RoundedBox args={[2.8, 0.12, 1]} radius={0.04}>
            <meshStandardMaterial color="#1A1512" metalness={0.2} roughness={0.8} />
          </RoundedBox>

          {/* Keyboard palm rest */}
          <RoundedBox args={[2.6, 0.06, 0.25]} radius={0.02} position={[0, 0.05, 0.35]}>
            <meshStandardMaterial color="#2D251E" metalness={0.1} roughness={0.9} />
          </RoundedBox>

          {/* Keyboard keys - Row 1 (function keys) */}
          {[...Array(12)].map((_, i) => (
            <KeyboardKey
              key={`f-${i}`}
              position={[-1.15 + i * 0.2, 0.08, -0.35]}
              width={0.15}
              height={0.08}
            />
          ))}

          {/* Keyboard keys - Row 2 (numbers) */}
          {[...Array(13)].map((_, i) => (
            <KeyboardKey
              key={`num-${i}`}
              position={[-1.2 + i * 0.2, 0.08, -0.2]}
              isSpecial={i === 0}
            />
          ))}

          {/* Keyboard keys - Row 3 (qwerty) */}
          {[...Array(12)].map((_, i) => (
            <KeyboardKey
              key={`row3-${i}`}
              position={[-1.1 + i * 0.2, 0.08, -0.05]}
            />
          ))}

          {/* Keyboard keys - Row 4 (asdf) */}
          {[...Array(11)].map((_, i) => (
            <KeyboardKey
              key={`row4-${i}`}
              position={[-1.0 + i * 0.2, 0.08, 0.1]}
            />
          ))}

          {/* Keyboard keys - Row 5 (zxcv) */}
          {[...Array(10)].map((_, i) => (
            <KeyboardKey
              key={`row5-${i}`}
              position={[-0.9 + i * 0.2, 0.08, 0.25]}
            />
          ))}

          {/* Spacebar */}
          <KeyboardKey
            position={[0, 0.08, 0.25]}
            width={0.8}
            height={0.1}
            isSpecial
          />
        </group>

        {/* Mouse */}
        <group position={[1.8, -1.28, 1.3]}>
          <RoundedBox args={[0.35, 0.08, 0.5]} radius={0.08}>
            <meshStandardMaterial color="#2D251E" metalness={0.3} roughness={0.7} />
          </RoundedBox>
          {/* Mouse buttons */}
          <mesh position={[0, 0.05, -0.1]}>
            <boxGeometry args={[0.14, 0.02, 0.15]} />
            <meshStandardMaterial color="#1A1512" />
          </mesh>
          <mesh position={[0, 0.05, -0.1]}>
            <boxGeometry args={[0.01, 0.025, 0.1]} />
            <meshStandardMaterial color="#E86A17" />
          </mesh>
          {/* Scroll wheel */}
          <mesh position={[0, 0.06, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
            <meshStandardMaterial color="#E86A17" />
          </mesh>
        </group>

        {/* Coffee mug */}
        <group position={[-1.8, -1.2, 1.1]}>
          {/* Mug body */}
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.25, 16]} />
            <meshStandardMaterial color="#E86A17" metalness={0.1} roughness={0.8} />
          </mesh>
          {/* Mug handle */}
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#E86A17" />
          </mesh>
          {/* Coffee */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#3D2314" />
          </mesh>
          {/* Steam */}
          {[0, 1, 2].map((i) => (
            <mesh key={`steam-${i}`} position={[-0.03 + i * 0.03, 0.2 + i * 0.05, 0]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3 - i * 0.08} />
            </mesh>
          ))}
        </group>

        {/* Desk plant */}
        <group position={[2.2, -1.1, 0.8]}>
          {/* Pot */}
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.18, 16]} />
            <meshStandardMaterial color="#C9924A" roughness={0.9} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
            <meshStandardMaterial color="#3D2314" />
          </mesh>
          {/* Plant stem and leaves */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`leaf-${i}`}
              position={[Math.sin(i * 1.5) * 0.05, 0.15 + i * 0.06, Math.cos(i * 1.5) * 0.05]}
              rotation={[0.3, i * 0.8, 0.2]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#4A7C59" />
            </mesh>
          ))}
        </group>

        {/* Ambient glow under monitor */}
        <pointLight position={[0, -0.5, 0.5]} intensity={0.3} color="#E86A17" distance={2} />
      </group>
    </Float>
  );
}
