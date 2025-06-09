
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, useGLTF, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Computer model component
const ComputerModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate the laptop model
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + 0.1;
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]} position={[0, 0.2, 0]}>
        <boxGeometry args={[1, 0.05, 0.8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        
        {/* Laptop Screen */}
        <mesh position={[0, 0.35, -0.35]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.95, 0.7, 0.05]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          
          {/* Screen Display */}
          <mesh position={[0, 0, 0.026]}>
            <planeGeometry args={[0.85, 0.6]} />
            <meshBasicMaterial color="#3B82F6" />
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[0.7, 0.5]} />
              <meshBasicMaterial color="#0F172A" />
              
              {/* IT INVENTORY text */}
              <Text
                position={[0, 0.15, 0.001]}
                fontSize={0.08}
                color="#F59E0B"
                anchorX="center"
                anchorY="middle"
              >
                IT INVENTORY
              </Text>
            </mesh>
          </mesh>
        </mesh>
        
        {/* Keyboard */}
        <mesh position={[0, 0.03, 0.15]}>
          <boxGeometry args={[0.9, 0.01, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.6} />
        </mesh>
      </mesh>
    </Float>
  );
};

// 3D Key model
const Key = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime();
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <group position={position}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 32]} />
          <meshStandardMaterial color="#FCD34D" metalness={0.8} roughness={0.2} />
          
          {/* Key head */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.05]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Key teeth */}
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.02]} />
            <meshStandardMaterial color="#FCD34D" metalness={0.8} roughness={0.2} />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
};

// Adapter model
const Adapter = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
  });
  
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={meshRef}>
          {/* Adapter body */}
          <boxGeometry args={[0.4, 0.2, 0.2]} />
          <meshStandardMaterial color="#64748B" metalness={0.6} roughness={0.3} />
          
          {/* Power cable */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} />
          </mesh>
          
          {/* Power plug */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
};

// Mouse model
const Mouse = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.1;
    meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
  });
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position}>
        <mesh ref={meshRef}>
          {/* Mouse body */}
          <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.6} />
          
          {/* Mouse buttons */}
          <mesh position={[0, 0.05, -0.07]}>
            <boxGeometry args={[0.1, 0.01, 0.12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} roughness={0.7} />
          </mesh>
          
          {/* Mouse scroll wheel */}
          <mesh position={[0, 0.06, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
            <meshStandardMaterial color="#64748B" metalness={0.5} roughness={0.5} />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
};

// Hard Drive model
const HardDrive = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
  });
  
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        <mesh ref={meshRef}>
          {/* Hard drive case */}
          <boxGeometry args={[0.5, 0.1, 0.35]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          
          {/* Connection ports */}
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.02, 0.05, 0.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} />
          </mesh>
          
          {/* Label */}
          <mesh position={[0, 0.051, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 0.25]} />
            <meshBasicMaterial color="#94A3B8" />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
};

// Floating particles effect for background
const Particles = ({ count = 50 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ]);
    }
    return positions;
  }, [count]);

  const sizes = useMemo(() => {
    return Array.from({ length: count }, () => Math.random() * 0.1 + 0.03);
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 16;
      const matrix = new THREE.Matrix4();
      
      // Update position with a slight movement
      const x = particlePositions[i][0] + Math.sin(state.clock.getElapsedTime() * 0.2 + i) * 0.02;
      const y = particlePositions[i][1] + Math.cos(state.clock.getElapsedTime() * 0.2 + i) * 0.02;
      const z = particlePositions[i][2] + Math.sin(state.clock.getElapsedTime() * 0.1 + i) * 0.02;
      
      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(sizes[i], sizes[i], sizes[i]));
      
      mesh.current.setMatrixAt(i, matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#4B72B0" transparent opacity={0.5} />
    </instancedMesh>
  );
};

// Code blocks effect
const CodeBlock = ({ position, rotation, scale }: { position: [number, number, number], rotation?: [number, number, number], scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.001;
  });
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]} scale={scale || 1}>
      <boxGeometry args={[0.8, 0.5, 0.05]} />
      <meshBasicMaterial>
        <MeshDistortMaterial
          color="#1E40AF"
          distort={0.3}
          speed={2}
          opacity={0.5}
          transparent={true}
        />
      </meshBasicMaterial>
      
      {/* Code text */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.04}
        color="#F8FAFC"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {"{inventory.map(item => <AssignmentCard key={item.id} />)}"}
      </Text>
    </mesh>
  );
};

const LoginScene: React.FC = () => {
  return (
    <Canvas 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]} // Optimize performance while maintaining quality
      performance={{ min: 0.5 }} // Further performance optimization
    >
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 5, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3B82F6" />
      
      <group position={[0, -0.5, 0]}>
        <ComputerModel />
        
        {/* Additional IT Equipment */}
        <Key position={[-2, 0.5, -1]} />
        <Key position={[2, 0.5, -1]} />
        <Adapter position={[-2.5, -0.5, -2]} />
        <Adapter position={[3, 0.2, -1.5]} />
        <Mouse position={[2, -0.3, 0.5]} />
        <Mouse position={[-1.5, -0.4, 1]} />
        <HardDrive position={[1.5, -1, -1]} />
        <HardDrive position={[-2, -0.8, -0.5]} />
        
        {/* Code blocks representing inventory management */}
        <CodeBlock position={[-3, 1.5, -3]} rotation={[0.2, 0.5, 0]} />
        <CodeBlock position={[3.5, 2, -2]} rotation={[-0.3, -0.2, 0.1]} scale={0.8} />
        <CodeBlock position={[2, 1, -4]} rotation={[0.1, -0.4, -0.2]} scale={0.7} />
        
        {/* Background particles for visual effect */}
        <Particles count={80} />
      </group>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default LoginScene;
