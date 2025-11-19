import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

const VoxelField = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Configuration
  const gridSize = 20;
  const gap = 0.5;
  const count = gridSize * gridSize;
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  // Initialize positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * gap;
        const z = (j - gridSize / 2) * gap;
        const y = 0;
        temp.push({ x, y, z, initialY: y, speed: Math.random() * 0.002 + 0.001, offset: Math.random() * Math.PI * 2 });
      }
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Animate light
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.5) * 10;
      lightRef.current.position.z = Math.cos(time * 0.5) * 10;
    }

    particles.forEach((particle, i) => {
      const { x, z, speed, offset } = particle;
      
      // Wave motion
      const y = Math.sin(time * 2 + x * 0.5 + z * 0.5) * 1 + Math.sin(time * 1.5 + offset) * 0.5;
      
      dummy.position.set(x, y, z);
      
      // Rotate slightly based on height
      dummy.rotation.x = Math.sin(time + x) * 0.1;
      dummy.rotation.z = Math.cos(time + z) * 0.1;
      
      const scale = 1 + Math.max(0, y * 0.2);
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Color based on height
      // Slate-800 to Blue-500/Cyan-400
      const intensity = (y + 2) / 4; // Normalize roughly 0-1
      color.setHSL(0.6, 0.8, 0.2 + intensity * 0.4); // Blue hue
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1} distance={20} decay={2} />
      <ambientLight intensity={0.5} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial 
          roughness={0.4} 
          metalness={0.6} 
        />
      </instancedMesh>
    </>
  );
};

const PixelBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 45 }}
        dpr={[1, 2]} // Optimize for retina
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#F8FAFC', 5, 25]} />
        <VoxelField />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default PixelBackground;
