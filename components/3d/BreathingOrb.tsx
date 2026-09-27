'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from '@/components/StateContext';

interface OrbMeshProps {
  phase: 'Inhale' | 'Hold' | 'Exhale';
  progress: number; // 0 to 1
}

function BreathingSphere({ phase, progress }: OrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let targetScale = 1.0;
    if (phase === 'Inhale') {
      targetScale = 1.0 + progress * 0.8; // Expands from 1.0 to 1.8
    } else if (phase === 'Hold') {
      targetScale = 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
    } else if (phase === 'Exhale') {
      targetScale = 1.8 - progress * 0.8; // Contracts from 1.8 down to 1.0
    }

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={phase === 'Hold' ? '#0D9488' : phase === 'Exhale' ? '#0369A1' : '#0284C7'}
          emissive={phase === 'Hold' ? '#14B8A6' : '#38BDF8'}
          emissiveIntensity={0.6}
          distort={0.35}
          speed={phase === 'Hold' ? 1.0 : 2.5}
          roughness={0.2}
          metalness={0.4}
        />
      </Sphere>

      {/* Atmospheric glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial 
          color="#38BDF8" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

export const BreathingOrb: React.FC<{
  isRunning: boolean;
  onPhaseChange?: (phase: string) => void;
}> = ({ isRunning, onPhaseChange }) => {
  const { reducedMotion } = useAppState();
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setPhase('Inhale');
      setCountdown(4);
      setProgress(0);
      return;
    }

    const interval = 100; // 100ms ticks
    let elapsed = 0;
    const inhaleDuration = 4000;
    const holdDuration = 7000;
    const exhaleDuration = 8000;
    const totalCycle = inhaleDuration + holdDuration + exhaleDuration;

    const timer = setInterval(() => {
      elapsed = (elapsed + interval) % totalCycle;

      if (elapsed < inhaleDuration) {
        setPhase('Inhale');
        const p = elapsed / inhaleDuration;
        setProgress(p);
        setCountdown(Math.ceil((inhaleDuration - elapsed) / 1000));
        onPhaseChange?.('Inhale');
      } else if (elapsed < inhaleDuration + holdDuration) {
        setPhase('Hold');
        const holdElapsed = elapsed - inhaleDuration;
        setProgress(holdElapsed / holdDuration);
        setCountdown(Math.ceil((holdDuration - holdElapsed) / 1000));
        onPhaseChange?.('Hold');
      } else {
        setPhase('Exhale');
        const exhaleElapsed = elapsed - (inhaleDuration + holdDuration);
        setProgress(exhaleElapsed / exhaleDuration);
        setCountdown(Math.ceil((exhaleDuration - exhaleElapsed) / 1000));
        onPhaseChange?.('Exhale');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isRunning, onPhaseChange]);

  return (
    <div className="relative w-full h-80 flex flex-col items-center justify-center">
      {!reducedMotion ? (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#38BDF8" />
          <pointLight position={[-5, -5, -3]} intensity={1} color="#14B8A6" />
          <BreathingSphere phase={phase} progress={progress} />
        </Canvas>
      ) : (
        <div 
          className="w-44 h-44 rounded-full border-4 border-teal-400 bg-sky-900/30 flex items-center justify-center transition-all duration-700"
          style={{
            transform: phase === 'Inhale' ? 'scale(1.3)' : phase === 'Hold' ? 'scale(1.3)' : 'scale(0.9)',
          }}
        />
      )}

      {/* Synchronized Breath HUD Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-teal-300 font-semibold mb-1">
          {isRunning ? phase : 'Ready to Begin'}
        </span>
        <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          {isRunning ? `${countdown}s` : '4-7-8'}
        </span>
        <span className="text-xs text-slate-300 mt-1 max-w-[200px] text-center">
          {phase === 'Inhale' ? 'Breathe in calmly through your nose' : phase === 'Hold' ? 'Retain focus gently' : 'Exhale slowly through mouth'}
        </span>
      </div>
    </div>
  );
};
