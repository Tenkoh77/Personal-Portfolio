import React, { useEffect, useState } from 'react';

// Global context tracking
let globalActiveContexts = new Set();
let globalContextCounter = 0;

export const registerGlobalContext = (id) => {
  globalActiveContexts.add(id);
  globalContextCounter++;
  console.log(`Global context registered: ${id}, total: ${globalActiveContexts.size}`);
};

export const unregisterGlobalContext = (id) => {
  globalActiveContexts.delete(id);
  console.log(`Global context unregistered: ${id}, total: ${globalActiveContexts.size}`);
};

export const getGlobalContextCount = () => globalActiveContexts.size;

const WebGLContextManager = () => {
  const [contextCount, setContextCount] = useState(0);
  const [contextList, setContextList] = useState([]);

  useEffect(() => {
    const updateCount = () => {
      const count = getGlobalContextCount();
      setContextCount(count);
      setContextList(Array.from(globalActiveContexts));
    };

    // Update count every second
    const interval = setInterval(updateCount, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm z-50 max-w-xs">
      <div className="font-bold mb-1">WebGL Contexts: {contextCount}</div>
      {contextList.length > 0 && (
        <div className="text-xs">
          {contextList.map((ctx, i) => (
            <div key={i} className="truncate">{ctx}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebGLContextManager;