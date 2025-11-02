import { Component } from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary component for catching and handling React component errors
 * Provides graceful fallback UI when component errors occur
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  /**
   * Static method to update state when an error occurs
   * @param {Error} error - The error that occurred
   * @returns {object} - New state object
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  /**
   * Lifecycle method called when an error occurs
   * @param {Error} error - The error that occurred
   * @param {object} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to error reporting service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  /**
   * Reload the page as a fallback recovery option
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__content">
              <div className="error-boundary__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              
              <h2 className="error-boundary__title">
                Something went wrong
              </h2>
              
              <p className="error-boundary__message">
                {this.props.fallbackMessage || 
                 'An unexpected error occurred. Your tasks are still saved locally.'}
              </p>
              
              <div className="error-boundary__actions">
                <button 
                  className="error-boundary__button error-boundary__button--primary"
                  onClick={this.handleReset}
                >
                  Try Again
                </button>
                
                <button 
                  className="error-boundary__button error-boundary__button--secondary"
                  onClick={this.handleReload}
                >
                  Reload Page
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-boundary__details">
                  <summary className="error-boundary__details-summary">
                    Error Details (Development Only)
                  </summary>
                  <pre className="error-boundary__error-text">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

export default ErrorBoundary;