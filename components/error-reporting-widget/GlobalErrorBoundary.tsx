'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-report to PostHog if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('react_error_boundary_triggered', {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        error_component_stack: errorInfo.componentStack,
        error_url: window.location.href,
        error_timestamp: new Date().toISOString(),
        error_user_agent: navigator.userAgent,
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    // Trigger the error reporting widget
    const event = new CustomEvent('open-error-report', {
      detail: {
        title: `React Error: ${this.state.error?.name || 'Unknown Error'}`,
        description: `${this.state.error?.message || 'An unexpected error occurred'}\n\nComponent Stack: ${this.state.errorInfo?.componentStack || 'Not available'}`,
        severity: 'high',
        category: 'bug',
        additionalContext: {
          errorStack: this.state.error?.stack,
          componentStack: this.state.errorInfo?.componentStack,
        },
      },
    });
    window.dispatchEvent(event);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='bg-background flex min-h-screen items-center justify-center p-4'>
          <Card className='w-full max-w-lg space-y-4 p-6 text-center'>
            <div className='flex justify-center'>
              <AlertCircle className='h-16 w-16 text-red-500' />
            </div>

            <div className='space-y-2'>
              <h1 className='text-foreground text-2xl font-bold'>
                Oops! Something went wrong
              </h1>
              <p className='text-muted-foreground'>
                We&apos;re sorry, but an unexpected error occurred. Our team has
                been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Card className='border-red-200 bg-red-50 p-4 text-left dark:border-red-800 dark:bg-red-950/20'>
                <h3 className='mb-2 font-semibold text-red-800 dark:text-red-200'>
                  Error Details (Development Mode)
                </h3>
                <pre className='overflow-auto text-xs text-red-700 dark:text-red-300'>
                  {this.state.error.message}
                  {this.state.error.stack && '\n\n' + this.state.error.stack}
                </pre>
              </Card>
            )}

            <div className='flex flex-col gap-2 pt-2 sm:flex-row'>
              <Button
                onClick={this.handleReload}
                variant='outline'
                className='flex-1'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Reload Page
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant='outline'
                className='flex-1'
              >
                <Home className='mr-2 h-4 w-4' />
                Go Home
              </Button>

              <Button onClick={this.handleReportError} className='flex-1'>
                <Bug className='mr-2 h-4 w-4' />
                Report Issue
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
