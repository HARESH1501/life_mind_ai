import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console so we can still see it in DevTools
    console.error("ErrorBoundary caught a React rendering error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI with a premium dark mode aesthetic
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
          <div className="glass-panel p-8 max-w-lg w-full text-center border border-red-500/30 bg-red-500/5 relative overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="text-5xl mb-4 relative z-10">⚠️</div>
            <h1 className="text-2xl font-bold text-red-400 mb-4 relative z-10">Component Crash Detected</h1>
            <p className="text-gray-300 mb-6 text-sm relative z-10">
              The application encountered an unexpected runtime error. We've caught it to prevent the entire frontend server from crashing.
            </p>
            
            <div className="bg-[#111] border border-white/5 p-4 rounded-xl text-left overflow-auto max-h-48 text-xs mb-6 text-red-300 font-mono relative z-10">
              {this.state.error && this.state.error.toString()}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/30 rounded-full font-semibold transition-all duration-300 w-full relative z-10"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
