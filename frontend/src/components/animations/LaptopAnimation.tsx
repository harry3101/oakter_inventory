
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Environment, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { useNavigate } from 'react-router-dom';

const LaptopModel = ({ redirectPath }: { redirectPath: string }) => {
  const navigate = useNavigate();
  const group = useRef<Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, redirectPath]);

  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationProgress(prev => Math.min(prev + 0.02, 1));
    }, 50);
    
    return () => clearInterval(animationTimer);
  }, []);

  useFrame((state) => {
    if (group.current) {
      // Smooth rotation
      group.current.rotation.y += 0.01;
      
      // Bobbing motion
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
      
      // Pulse effect based on animation progress
      const scale = 1 + Math.sin(animationProgress * Math.PI) * 0.05;
      group.current.scale.set(scale, scale, scale);
    }
  });

  // Laptop model created with primitives
  return (
    <group ref={group}>
      {/* Laptop base */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial attach="material" color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Laptop screen */}
      <group position={[0, 0.5, -0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.05, 1.3]} />
          <meshStandardMaterial attach="material" color="#333" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen display with animated glow */}
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.01, 1.2]} />
          <meshStandardMaterial 
            attach="material" 
            color="#0a84ff" 
            emissive="#0a84ff" 
            emissiveIntensity={0.5 + Math.sin(Date.now() * 0.001) * 0.2} 
          />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, 0.01, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.02, 1]} />
        <meshStandardMaterial attach="material" color="#222" />
      </mesh>
      
      {/* Touchpad */}
      <mesh position={[0, 0.02, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.02, 0.5]} />
        <meshStandardMaterial attach="material" color="#555" />
      </mesh>
    </group>
  );
};

interface AnimationProps {
  redirectPath: string;
}

const LaptopAnimation = ({ redirectPath }: AnimationProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100/30); // Complete in about 3 seconds (30 steps)
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
      <div className="text-white text-center mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Loading Assignment</h2>
        <p className="mb-4">Please wait while we prepare your assignment...</p>
        
        {/* Progress bar */}
        <div className="w-64 bg-gray-700 rounded-full h-2.5 mb-4 mx-auto">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }} 
          ></div>
        </div>
      </div>
      
      <div className="w-full h-[60vh]">
        <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <LaptopModel redirectPath={redirectPath} />
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
};

export default LaptopAnimation;
