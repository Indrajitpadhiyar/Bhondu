import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>
            
            <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
              Something went wrong.
            </h2>
            <p className="text-zinc-400 mb-6 text-sm">
              An unexpected error occurred in our interface. We've logged this error and will investigate it.
            </p>

            {this.state.error && (
              <div className="bg-zinc-900 border border-zinc-800 text-left p-4 rounded-lg text-xs font-mono text-pink-400 overflow-x-auto mb-6 max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-[1.02] active:scale-95 duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
