import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useWebGLContext } from "./useWebGLContext";

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
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
    return <div className='w-full h-auto absolute inset-0 z-[-1] bg-gray-900' />;
  }

  return (
    <div className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 1] }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          console.log('Stars Canvas created successfully');
          gl.setClearColor('#000000', 0);
        }}
        onError={(error) => {
          console.error('Stars Canvas error:', error);
        }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
