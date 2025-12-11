import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Box, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

const IconScene = ({ type }: { type: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  const material = (
    <MeshDistortMaterial
      color="#ffffff"
      roughness={0.2}
      metalness={0.9}
      distort={0.3}
      speed={2}
      transparent
      opacity={0.8}
    />
  );

  switch (type) {
    case 'database': // Metric Explosion
      return (
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <group>
            <Octahedron args={[1.2, 0]} ref={meshRef}>
              <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.3} />
            </Octahedron>
            <Sphere args={[0.6, 32, 32]}>
              {material}
            </Sphere>
          </group>
        </Float>
      );
    case 'heart': // Amex Heart Core
      return (
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere args={[1, 64, 64]} ref={meshRef}>
             <MeshDistortMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={1}
              distort={0.6}
              speed={3}
            />
          </Sphere>
        </Float>
      );
    case 'terminal': // Terminal V2
      return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Box args={[1.5, 1, 0.1]} ref={meshRef}>
            <meshPhysicalMaterial 
              color="#ffffff" 
              roughness={0.2} 
              metalness={0.8} 
              clearcoat={1} 
              transparent 
              opacity={0.5} 
            />
          </Box>
        </Float>
      );
    case 'api': // Data Fusion API
      return (
        <Float speed={6} rotationIntensity={2} floatIntensity={1}>
          <Torus args={[0.8, 0.2, 16, 32]} ref={meshRef}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </Torus>
        </Float>
      );
    case 'ecosystem': // Ecosystem Expansion
      return (
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere args={[1.2, 32, 32]} ref={meshRef}>
            <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.2} />
          </Sphere>
          <Sphere args={[0.8, 32, 32]}>
             <meshPhysicalMaterial 
              color="#ffffff" 
              roughness={0} 
              metalness={0.2} 
              transmission={1} 
              thickness={2}
            />
          </Sphere>
        </Float>
      );
    default:
      return null;
  }
};

export const Roadmap3DIcon = ({ type }: { type: string }) => {
  return (
    <div className="w-24 h-24 relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <IconScene type={type} />
      </Canvas>
    </div>
  );
};
