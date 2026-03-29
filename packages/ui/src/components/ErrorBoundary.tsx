import React from "react";
import { NoticePanel } from "./NoticePanel";
import { Button } from "./Button";
import { Stack } from "./Layout";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional fallback UI; default uses NoticePanel + retry */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors in the subtree and shows a themed recovery UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }
      return (
        <div className="p-6 max-w-lg mx-auto font-sans">
          <Stack gap={4}>
            <NoticePanel variant="error" title="Jotain meni pieleen">
              {error.message || "Tapahtui odottamaton virhe."}
            </NoticePanel>
            <Button type="button" variant="outline" onClick={this.reset}>
              Yritä uudelleen
            </Button>
          </Stack>
        </div>
      );
    }
    return this.props.children;
  }
}
