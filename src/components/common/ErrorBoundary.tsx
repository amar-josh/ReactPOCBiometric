import { Component, ErrorInfo, ReactNode } from "react";

import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorBoundaryWrapper />;
    }

    return this.props.children;
  }
}
