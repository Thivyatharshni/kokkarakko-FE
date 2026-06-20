import React from 'react';
import ErrorState from './ErrorState';

class ErrorBoundary extends React.Component {
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <ErrorState 
            message="We encountered an unexpected error rendering this component. Please try refreshing the page." 
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
