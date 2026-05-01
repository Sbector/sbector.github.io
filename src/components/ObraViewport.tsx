import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Bounds, Lightformer } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

interface ModelProps {
  src: string;
  onProgress: (progress: number) => void;
  onLoaded: () => void;
}

function Model({ src, onProgress, onLoaded }: ModelProps) {
  const gltf = useLoader(
    GLTFLoader,
    src,
    (loader) => {
      const draco = new DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      (loader as any).setDRACOLoader(draco);
    },
    (event: ProgressEvent) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress((event.loaded / event.total) * 100);
      }
    }
  );

  useEffect(() => {
    onLoaded();
  }, [gltf]);

  const { scene } = gltf as any;

  scene.traverse((child: any) => {
    if (child instanceof THREE.Mesh && child.material) {
      const material = child.material as THREE.MeshStandardMaterial;
      if (!material.roughnessMap) material.roughness = 1;
      if (!material.metalnessMap) material.metalness = 0;
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

interface LoadingBarProps {
  progress: number;
  isLoading: boolean;
}

function LoadingBar({ progress, isLoading }: LoadingBarProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${
      isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="relative w-full h-1 bg-neutral-900">
        <div 
          className="absolute h-full bg-white transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute -bottom-6 right-2 text-xs font-mono text-white bg-black/50 px-2 py-1 rounded">
        {Math.round(progress)}%
      </div>
    </div>
  );
}

export default function ObraViewport({ 
  src, 
  autoRotate = true, 
  environment = 'custom'
}: ObraViewportProps) {
  const [currentEnvironment, setCurrentEnvironment] = useState<string>(environment);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProgress(0);
    setIsLoading(true);
  }, [src]);

  const handleProgress = useCallback((p: number) => setProgress(p), []);

  const handleLoaded = useCallback(() => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  return (
    <div className="relative w-full h-full">
      <LoadingBar progress={progress} isLoading={isLoading} />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1, alpha: true }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Bounds fit clip>
            <Model src={src} onProgress={handleProgress} onLoaded={handleLoaded} />
          </Bounds>
          <OrbitControls 
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.3}
            enableZoom={true}
            enablePan={true}
          />
          {currentEnvironment === 'custom' ? (
            <Environment resolution={32} backgroundIntensity={0} background={false}>
              <Lightformer position-z={-30} scale={40} intensity={5} form="ring" />
              <Lightformer position-z={30} scale={40} intensity={5} form="ring" />
            </Environment>
          ) : (
            <Environment preset={currentEnvironment as any} background={false} />
          )}
        </Suspense>
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm items-center">
        {/* Auto-rotate toggle */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1.5"
          title={isAutoRotating ? 'Desactivar rotación automática' : 'Activar rotación automática'}
          style={{
            backgroundColor: isAutoRotating ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            color: isAutoRotating ? 'white' : 'rgb(163, 230, 53)'
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <div className="h-4 w-px bg-neutral-600" />
        
        {/* Environment selector */}
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
