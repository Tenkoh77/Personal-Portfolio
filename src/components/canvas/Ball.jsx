import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";
import { useWebGLContext } from "./useWebGLContext";

import CanvasLoader from "../Loader";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
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
          console.log('Ball Canvas created successfully');
          gl.setClearColor('#000000', 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = gl.PCFSoftShadowMap;
        }}
        onError={(error) => {
          console.error('Ball Canvas error:', error);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default BallCanvas;
