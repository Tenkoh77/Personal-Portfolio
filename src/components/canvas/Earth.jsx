import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { useWebGLContext } from "./useWebGLContext";

import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const canvasRef = useRef();
  const { registerContext, unregisterContext, isActive, canCreateContext } = useWebGLContext();

  useEffect(() => {
    if (canvasRef.current) {
      registerContext(canvasRef.current);
    }

    return () => {
      unregisterContext();
    };
  }, [registerContext, unregisterContext]);

  // Only render if we can create a context or if this context is already active
  if (!canCreateContext() && !isActive()) {
    return <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <p>Loading 3D content...</p>
      </div>
    </div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        ref={canvasRef}
        shadows
        frameloop='demand'
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          console.log('Earth Canvas created successfully');
          gl.setClearColor('#000000', 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = gl.PCFSoftShadowMap;
        }}
        onError={(error) => {
          console.error('Earth Canvas error:', error);
        }}
        style={{ width: '100%', height: '100%' }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Earth />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
