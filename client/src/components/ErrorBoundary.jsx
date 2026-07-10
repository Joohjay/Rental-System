import { Component } from 'react';
import ErrorBoundaryFallback from '../pages/ErrorBoundaryFallback';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} resetError={this.handleReset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
