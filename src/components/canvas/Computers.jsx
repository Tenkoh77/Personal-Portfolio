import { Suspense, useEffect, useState, useRef } from 'react';
import {Canvas} from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import CanvasLoader from '../Loader';
import { useWebGLContext } from './useWebGLContext';

const Computers = ({ isMobile }) => {
  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity ={0.4}
      groundColor="black" />
      <pointLight pointLight position={[0, 1, 0]} intensity={70}/>
      <spotLight
        position={[0, 1, -1]}
        angle={0.12}
        penumbra={50}
        intensity={50}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.48 : 0.65}
        position={isMobile ? [0, -2.3, -1.8] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.12]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef();
  const { registerContext, unregisterContext, isActive, canCreateContext } = useWebGLContext();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }

     mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
     mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

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
        frameloop="demand"
        shadows
        camera={{ position: [20, 3, 5], fov: 25}}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          console.log('Canvas created successfully');
          gl.setClearColor('#000000', 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = gl.PCFSoftShadowMap;
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
        style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={<CanvasLoader/>}>
            <OrbitControls
             enableZoom={false}
             maxPolarAngle={Math.PI / 2}
             minPolarAngle={Math.PI / 2}
             />
             <Computers isMobile={isMobile} />
          </Suspense>
        <Preload all/>
      </Canvas>
    </div>
  )
}
 export default ComputersCanvas