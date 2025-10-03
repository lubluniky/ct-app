import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const ParticleRain = () => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  const particleData = useMemo(() => {
    const data = [];
    const colors = ['#00ff00', '#ff8c42', '#00ccff'];
    
    for (let i = 0; i < 60; i++) {
      data.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 15 + 5,
        z: (Math.random() - 0.5) * 15,
        speed: 0.015 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        length: 0.2 + Math.random() * 0.4,
      });
    }
    return data;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    const dummy = new THREE.Object3D();
    
    particleData.forEach((particle, i) => {
      particle.y -= particle.speed;
      
      if (particle.y < -10) {
        particle.y = 15;
        particle.x = (Math.random() - 0.5) * 20;
        particle.z = (Math.random() - 0.5) * 15;
      }
      
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(0.02, particle.length, 0.02);
      dummy.rotation.set(0, 0, Math.PI / 2);
      dummy.updateMatrix();
      
      particlesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, 60]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ff00" transparent opacity={0.25} />
    </instancedMesh>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ParticleRain />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
    </>
  );
};

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
