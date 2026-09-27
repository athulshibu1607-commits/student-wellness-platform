'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { 
  CalendarCheck, 
  Hourglass, 
  Heart, 
  Bot, 
  Users2, 
  BarChart3, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface OrbitNode {
  id: string;
  name: string;
  category: string;
  color: string;
  emissive: string;
  href: string;
  description: string;
  orbitRadius: number;
  speed: number;
  initialAngle: number;
}

const ORBIT_SYSTEMS: OrbitNode[] = [
  {
    id: 'planner',
    name: 'Academic Planner',
    category: 'Workload Cockpit',
    color: '#38BDF8',
    emissive: '#0284C7',
    href: '/planner',
    description: '4-column Kanban workflow organizing problem sets, lab milestones, and exam targets.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: 0
  },
  {
    id: 'focus',
    name: 'Focus Sanctum',
    category: 'Deep Work',
    color: '#14B8A6',
    emissive: '#0D9488',
    href: '/focus',
    description: '3D ambient environments paired with binaural procedural soundscapes and flow timers.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: (Math.PI / 3) * 1
  },
  {
    id: 'wellness',
    name: 'Wellness & Biofeedback',
    category: 'Cognitive Recovery',
    color: '#F97316',
    emissive: '#EA580C',
    href: '/wellness',
    description: 'Pranayama 4-7-8 breathing orb, non-clinical stress tracking, and recovery pacing.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: (Math.PI / 3) * 2
  },
  {
    id: 'mentor',
    name: 'MentorAI',
    category: 'Socratic Tutor',
    color: '#A855F7',
    emissive: '#7E22CE',
    href: '/mentor',
    description: 'Empathetic engineering companion guiding logic, architecture, and cognitive stamina.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: (Math.PI / 3) * 3
  },
  {
    id: 'community',
    name: 'Engineering Circles',
    category: 'Peer Synergy',
    color: '#06B6D4',
    emissive: '#0891B2',
    href: '/community',
    description: 'Peer study pods, anonymous doubt resolution, and collaborative engineering discussions.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: (Math.PI / 3) * 4
  },
  {
    id: 'progress',
    name: 'Velocity Analytics',
    category: 'Longitudinal Trends',
    color: '#10B981',
    emissive: '#059669',
    href: '/progress',
    description: 'Study hours distribution, subject allocation, and non-clinical workload pressure trends.',
    orbitRadius: 2.7,
    speed: 0.35,
    initialAngle: (Math.PI / 3) * 5
  }
];

function OrbitSatellite({
  node,
  selectedId,
  onSelect
}: {
  node: OrbitNode;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isSelected = selectedId === node.id;

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * node.speed + node.initialAngle;
    // Orbit on tilted plane
    const x = Math.cos(time) * node.orbitRadius;
    const z = Math.sin(time) * node.orbitRadius;
    const y = Math.sin(time * 1.5) * 0.4;
    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
      scale={isSelected ? 1.4 : 1.0}
    >
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.emissive}
        emissiveIntensity={isSelected ? 1.5 : 0.8}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

function AcademicEcosystem({
  selectedId,
  onSelect
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.15;
      wireframeRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
      ringRef.current.rotation.x -= delta * 0.08;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Academic Core - Analytical Polyhedral Wireframe */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            wireframe
            color="#0EA5E9"
            emissive="#0284C7"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Orbiting Orbital Gyro Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.7, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#14B8A6"
          emissive="#14B8A6"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Dynamic Inner Core - Cognitive Clarity & Wellness */}
      <Sphere ref={coreRef} args={[0.85, 48, 48]}>
        <MeshDistortMaterial
          color="#0B132B"
          emissive="#0EA5E9"
          emissiveIntensity={0.4}
          distort={0.35}
          speed={1.8}
          roughness={0.15}
          metalness={0.85}
        />
      </Sphere>

      {/* 6 Orbiting System Satellites */}
      {ORBIT_SYSTEMS.map((node) => (
        <OrbitSatellite
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}

      {/* Atmospheric Star Particles */}
      <points>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 120 }, () => (Math.random() - 0.5) * 9)
              ),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#38BDF8" transparent opacity={0.6} />
      </points>
    </group>
  );
}

// 2D SVG Fallback for devices without WebGL or with reduced motion
function Fallback2D({
  selectedNode,
  onSelect
}: {
  selectedNode: OrbitNode;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" aria-hidden="true">
      <div className="w-56 h-56 rounded-full border border-teal-500/30 flex items-center justify-center relative">
        <div className="w-40 h-40 rounded-full border border-sky-400/40 border-dashed animate-spin flex items-center justify-center" style={{ animationDuration: '24s' }}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-600/40 via-teal-500/30 to-amber-500/20 blur-sm flex items-center justify-center">
            <span className="text-sky-300 text-xs font-bold">Jijnasu</span>
          </div>
        </div>
        {ORBIT_SYSTEMS.map((node, i) => {
          const angle = (i / ORBIT_SYSTEMS.length) * 2 * Math.PI;
          const x = 50 + 40 * Math.cos(angle);
          const y = 50 + 40 * Math.sin(angle);
          return (
            <button
              key={node.id}
              onClick={() => onSelect(node.id)}
              className="absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: node.color,
                boxShadow: `0 0 10px ${node.color}`
              }}
              title={node.name}
            />
          );
        })}
      </div>
    </div>
  );
}

export const HeroScene: React.FC = () => {
  const { reducedMotion } = useAppState();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('planner');

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const activeNode = ORBIT_SYSTEMS.find(s => s.id === selectedId) || ORBIT_SYSTEMS[0];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Visualizer Canvas */}
      <div className="w-full h-[340px] sm:h-[400px] relative pointer-events-auto">
        {!reducedMotion && hasWebGL ? (
          <Canvas
            camera={{ position: [0, 1.2, 5.8], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38BDF8" />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#F97316" />
            <AcademicEcosystem
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Canvas>
        ) : (
          <Fallback2D
            selectedNode={activeNode}
            onSelect={setSelectedId}
          />
        )}

        {/* Orbit Node Selector Pills Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-center gap-1.5 flex-wrap pointer-events-auto">
          {ORBIT_SYSTEMS.map((node) => {
            const isSelected = node.id === selectedId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white/15 text-white border-white/30 shadow-md backdrop-blur-md'
                    : 'bg-[#080D1A]/60 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
                style={{
                  borderColor: isSelected ? node.color : undefined
                }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: node.color }} />
                {node.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive System Inspection Panel */}
      <div className="w-full mt-2 bg-[#080D1A]/90 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeNode.color }}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                {activeNode.category}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {activeNode.name}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-md">
              {activeNode.description}
            </p>
          </div>

          <Link
            href={activeNode.href}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all hover:scale-105 cursor-pointer flex-shrink-0"
            style={{
              backgroundColor: activeNode.color
            }}
          >
            <span>Explore {activeNode.name.split(' ')[0]}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
