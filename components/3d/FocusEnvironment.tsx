'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from '@/components/StateContext';

interface FocusProps {
  theme: 'sanctum' | 'cosmos' | 'zen';
  isTicking: boolean;
}

function SanctumScene({ isTicking }: { isTicking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isTicking ? 0.15 : 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial 
            wireframe 
            color="#0EA5E9" 
            emissive="#0284C7" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>

      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#14B8A6" emissive="#14B8A6" emissiveIntensity={0.8} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3.4, 0.02, 16, 100]} />
        <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function CosmosScene({ isTicking }: { isTicking: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 400;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 15;
      pos[i + 1] = (Math.random() - 0.5) * 15;
      pos[i + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (isTicking ? 0.08 : 0.02);
      pointsRef.current.rotation.x += delta * (isTicking ? 0.04 : 0.01);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#A78BFA" transparent opacity={0.8} />
      </points>
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#1E1B4B" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function ZenScene({ isTicking }: { isTicking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isTicking ? 0.12 : 0.04);
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group>
      <Float speed={1.2} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial 
            color="#78350F" 
            emissive="#F59E0B" 
            emissiveIntensity={0.3} 
            wireframe 
          />
        </mesh>
      </Float>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <ringGeometry args={[2.2, 2.3, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export const FocusEnvironment: React.FC<FocusProps> = ({ theme, isTicking }) => {
  const { reducedMotion } = useAppState();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none" aria-hidden="true">
        <div className="w-80 h-80 rounded-full border border-sky-400" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} color="#38BDF8" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#F97316" />
        
        {theme === 'sanctum' && <SanctumScene isTicking={isTicking} />}
        {theme === 'cosmos' && <CosmosScene isTicking={isTicking} />}
        {theme === 'zen' && <ZenScene isTicking={isTicking} />}
      </Canvas>
    </div>
  );
};
