
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ios-system-bg flex items-center justify-center p-4">
          <div className="bg-ios-secondary-bg rounded-ios-xl p-ios-lg max-w-md w-full text-center shadow-ios-lg border border-ios-gray-5/50">
            <div className="text-ios-red text-6xl mb-ios-md">⚠️</div>
            <h2 className="ios-text-title-2 font-bold text-ios-label mb-ios-sm">
              Something went wrong
            </h2>
            <p className="ios-text-body text-ios-secondary-label mb-ios-lg">
              An error occurred while loading the page. Please refresh to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-ios-blue hover:bg-ios-blue-dark text-white px-ios-lg py-ios-md rounded-ios-lg font-semibold transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
