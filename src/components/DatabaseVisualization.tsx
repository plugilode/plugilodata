import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Howl } from 'howler';
import gsap from 'gsap';

interface DatabaseVisualizationProps {
  onDatabaseSelect: (name: string) => void;
}

// Sound effects
const zoomSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.5
});

// Main databases configuration
const mainDatabases = [
  { name: 'MongoDB', position: [0, 0, 0], color: '#00ff00' },
  { name: 'TrustedShops', position: [-8, 4, 0], color: '#00ffff' },
  { name: 'GelbeSeiten', position: [8, 4, 0], color: '#ffff00' },
  { name: 'Billiger.de', position: [-8, -4, 0], color: '#ff00ff' },
  { name: 'Guenstiger.de', position: [8, -4, 0], color: '#ff8800' },
  { name: 'Google', position: [0, 8, 0], color: '#4285f4' },
  { name: 'WLW', position: [0, -8, 0], color: '#ff0000' }
];

// MongoDB sub-databases
const mongoSubDatabases = [
  { name: 'AI Agent', position: [-2, 2, 0] },
  { name: 'Company', position: [2, 2, 0] },
  { name: 'Plugilo Website', position: [0, 3, 0] },
  { name: 'People', position: [-2, -2, 0] },
  { name: 'GoogleAPI', position: [2, -2, 0] },
  { name: 'AI Agent 1', position: [-1, 0, 2] },
  { name: 'AI Agent 2', position: [1, 0, 2] },
  { name: 'AI Agent 3', position: [-1, 0, -2] },
  { name: 'AI Agent 4', position: [1, 0, -2] }
];

// Particle system for database visualization
const Particles = ({ color }: { color: string }) => {
  const count = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(clock.getElapsedTime() + i) * 0.01;
        positions[i3 + 1] += Math.cos(clock.getElapsedTime() + i) * 0.01;
        positions[i3 + 2] += Math.sin(clock.getElapsedTime() + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} transparent opacity={0.6} />
    </points>
  );
};

// Microchip-style database visualization
const MicrochipDatabase = ({ name, position, color, scale = 1, onClick, isHovered }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      if (isHovered.current) {
        groupRef.current.scale.setScalar(scale * (1.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05));
      } else {
        groupRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => isHovered.current = true}
        onPointerOut={() => isHovered.current = false}
      >
        <boxGeometry args={[2, 0.2, 2]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <Particles color={color} />
      <Text
        ref={textRef}
        position={[0, 1, 0]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

const Scene = ({ onDatabaseSelect }: DatabaseVisualizationProps) => {
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const isHovered = useRef(false);
  const { camera } = useThree();

  const handleDatabaseClick = (name: string) => {
    zoomSound.play();
    if (name === 'MongoDB' && !selectedDatabase) {
      setSelectedDatabase(name);
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 1,
        ease: 'power2.inOut'
      });
    } else {
      onDatabaseSelect(name);
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {!selectedDatabase ? (
        // Main databases view
        mainDatabases.map((db) => (
          <MicrochipDatabase
            key={db.name}
            name={db.name}
            position={db.position}
            color={db.color}
            onClick={() => handleDatabaseClick(db.name)}
            isHovered={isHovered}
          />
        ))
      ) : (
        // MongoDB sub-databases view
        mongoSubDatabases.map((db) => (
          <MicrochipDatabase
            key={db.name}
            name={db.name}
            position={db.position}
            color="#00ff00"
            scale={0.7}
            onClick={() => handleDatabaseClick(db.name)}
            isHovered={isHovered}
          />
        ))
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        maxDistance={30}
        minDistance={5}
      />
    </>
  );
};

export const DatabaseVisualization: React.FC<DatabaseVisualizationProps> = ({ onDatabaseSelect }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <Scene onDatabaseSelect={onDatabaseSelect} />
      </Canvas>
    </div>
  );
};