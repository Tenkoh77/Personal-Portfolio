// Global WebGL recovery utilities
let recoveryCallbacks = new Set();

export const registerRecoveryCallback = (callback) => {
  recoveryCallbacks.add(callback);
  return () => recoveryCallbacks.delete(callback);
};

export const triggerRecovery = () => {
  console.log('Triggering WebGL context recovery...');
  recoveryCallbacks.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error in recovery callback:', error);
    }
  });
};

export const forceContextCleanup = () => {
  // Force cleanup of all WebGL contexts
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach(canvas => {
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (gl) {
        // Force context loss
        const extension = gl.getExtension('WEBGL_lose_context');
        if (extension) {
          extension.loseContext();
        }
      }
    } catch (error) {
      console.warn('Could not force context loss for canvas:', error);
    }
  });

  // Trigger recovery
  setTimeout(triggerRecovery, 100);
};

// Make it available globally for error boundaries
if (typeof window !== 'undefined') {
  window.forceWebGLCleanup = forceContextCleanup;
  window.triggerWebGLRecovery = triggerRecovery;
}