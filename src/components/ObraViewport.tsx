import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Bounds, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  src: string;
}

function Model({ src }: ModelProps) {
  const { scene } = useGLTF(src);
  
  // Apply material defaults: roughness = 1 (no shine), metalness = 0 (not metallic)
  // Only apply if maps don't exist (preserve baked textures)
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const material = child.material as THREE.MeshStandardMaterial;
      
      if (!material.roughnessMap) {
        material.roughness = 1;
      }
      
      if (!material.metalnessMap) {
        material.metalness = 0;
      }
    }
  });
  
  return <primitive object={scene} />;
}

interface ObraViewportProps {
  src: string;
  autoRotate?: boolean;
  environment?: string;
}

const ENVIRONMENT_PRESETS = [
  { id: 'custom', label: 'Custom' },
  { id: 'studio', label: 'Studio' },
  { id: 'dawn', label: 'Dawn' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'forest', label: 'Forest' },
  { id: 'city', label: 'City' },
] as const;

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-neutral-400">
      <span className="text-sm">Cargando modelo...</span>
    </div>
  );
}

export default function ObraViewport({ 
  src, 
  autoRotate = true, 
  environment = 'custom'
}: ObraViewportProps) {
  const [currentEnvironment, setCurrentEnvironment] = useState<string>(environment);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1, alpha: true }}
      >
        <ambientLight intensity={2} />
        <Suspense fallback={null}>
          <Bounds fit clip>
            <Model src={src} />
          </Bounds>
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={true}
          />
          {currentEnvironment === 'custom' ? (
            <Environment resolution={32} backgroundIntensity={0.1}>
              <Lightformer position-z={-30} scale={40} intensity={4} form="ring" />
              <Lightformer position-z={30} scale={40} intensity={4} form="ring" />
            </Environment>
          ) : (
            <Environment preset={currentEnvironment as any} />
          )}
        </Suspense>
      </Canvas>
      
      {/* Environment selector overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg px-4 py-2 backdrop-blur-sm">
        {ENVIRONMENT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setCurrentEnvironment(preset.id)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              currentEnvironment === preset.id
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
