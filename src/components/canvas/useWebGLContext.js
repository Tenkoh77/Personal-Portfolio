import { useEffect, useRef } from 'react';

// Global context manager
let activeContexts = new Set();
let contextCounter = 0;
const MAX_CONTEXTS = 4; // Limit to 4 active contexts

export const useWebGLContext = () => {
  const contextId = useRef(null);

  useEffect(() => {
    // Generate unique context ID
    contextId.current = `webgl-context-${contextCounter++}`;

    return () => {
      // Cleanup when component unmounts
      if (contextId.current) {
        activeContexts.delete(contextId.current);
      }
    };
  }, []);

  const registerContext = (canvas) => {
    if (canvas && contextId.current) {
      try {
        // If we're at the limit, remove the oldest context
        if (activeContexts.size >= MAX_CONTEXTS) {
          const oldestContext = Array.from(activeContexts)[0];
          activeContexts.delete(oldestContext);
          console.log(`Removed oldest WebGL context: ${oldestContext}`);
        }

        activeContexts.add(contextId.current);
        console.log(`Registered WebGL context: ${contextId.current}, total: ${activeContexts.size}`);

        // Add context loss listener
        const handleContextLost = (event) => {
          event.preventDefault();
          console.warn(`WebGL context lost for ${contextId.current}`);
          activeContexts.delete(contextId.current);

          // Try to recover by removing this context and allowing a new one
          setTimeout(() => {
            if (activeContexts.size < MAX_CONTEXTS) {
              console.log(`Context ${contextId.current} can be recreated`);
            }
          }, 100);
        };

        const handleContextRestored = () => {
          console.log(`WebGL context restored for ${contextId.current}`);
          activeContexts.add(contextId.current);
        };

        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        // Store the event handlers for cleanup
        canvas._webglHandlers = { handleContextLost, handleContextRestored };

      } catch (error) {
        console.error('Error registering WebGL context:', error);
      }
    }
  };

  const unregisterContext = () => {
    if (contextId.current) {
      activeContexts.delete(contextId.current);
      console.log(`Unregistered WebGL context: ${contextId.current}, total: ${activeContexts.size}`);
    }
  };

  const forceCleanup = () => {
    // Force cleanup all contexts if needed
    activeContexts.clear();
    console.log('Forced cleanup of all WebGL contexts');
  };

  return {
    registerContext,
    unregisterContext,
    forceCleanup,
    contextId: contextId.current,
    isActive: () => activeContexts.has(contextId.current),
    activeContextCount: () => activeContexts.size,
    canCreateContext: () => activeContexts.size < MAX_CONTEXTS
  };
};