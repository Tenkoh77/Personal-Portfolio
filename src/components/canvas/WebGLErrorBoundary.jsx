import React from 'react';

class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorMessage: error.message || 'WebGL Error occurred'
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('WebGL Error Boundary caught an error:', error, errorInfo);

    // Check if it's a context lost error
    if (error.message && error.message.includes('Context Lost')) {
      console.warn('WebGL context was lost, attempting to recover...');

      // Force cleanup of all contexts
      if (window.forceWebGLCleanup) {
        window.forceWebGLCleanup();
      }

      // Try to recover after a short delay
      setTimeout(() => {
        this.setState({ hasError: false, errorMessage: '' });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-lg font-semibold mb-2">WebGL Error</h3>
            <p className="text-sm text-gray-300 mb-4">{this.state.errorMessage}</p>
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;