'use client';

import { useEffect } from 'react';
import { useErrorReporting } from './useErrorReporting';

// Extend XMLHttpRequest interface to include our custom properties
declare global {
  interface XMLHttpRequest {
    _method?: string;
    _url?: string;
  }
}

/**
 * Component that automatically captures JavaScript errors and network errors
 * and sends them to PostHog for monitoring and analysis
 */
export function AutoErrorCapture() {
  const { reportJSError, reportNetworkError, isReady } = useErrorReporting();

  useEffect(() => {
    if (!isReady) return;

    // Global error handler for unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      reportJSError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: 'window.onerror',
      });
    };

    // Global handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      reportJSError(error, {
        source: 'unhandledrejection',
        promise: event.promise,
      });
    };

    // Patch fetch to capture network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // Report non-successful HTTP responses
        if (!response.ok) {
          const url =
            typeof args[0] === 'string'
              ? args[0]
              : args[0] instanceof URL
                ? args[0].href
                : args[0].url;
          const method = args[1]?.method || 'GET';
          reportNetworkError(url, response.status, response.statusText, method);
        }

        return response;
      } catch (error) {
        // Report network failures
        const url =
          typeof args[0] === 'string'
            ? args[0]
            : args[0] instanceof URL
              ? args[0].href
              : args[0].url;
        const method = args[1]?.method || 'GET';
        reportNetworkError(url, 0, 'Network Error', method);
        throw error;
      }
    };

    // Patch XMLHttpRequest to capture network errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      ...args: any[]
    ) {
      this._method = method;
      this._url = url;
      return (originalXHROpen as any).apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function (...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const xhr = this;

      const originalOnError = xhr.onerror;
      xhr.onerror = function (event) {
        if (xhr._url) {
          reportNetworkError(
            xhr._url,
            xhr.status || 0,
            xhr.statusText || 'Network Error',
            xhr._method || 'GET',
          );
        }
        if (originalOnError) originalOnError.call(xhr, event);
      };

      const originalOnLoad = xhr.onload;
      xhr.onload = function (event) {
        if (xhr.status >= 400 && xhr._url) {
          reportNetworkError(
            xhr._url,
            xhr.status,
            xhr.statusText,
            xhr._method || 'GET',
          );
        }
        if (originalOnLoad) originalOnLoad.call(xhr, event);
      };

      return (originalXHRSend as any).apply(this, args);
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );

      // Restore original fetch and XMLHttpRequest
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
    };
  }, [isReady, reportJSError, reportNetworkError]);

  return null; // This component doesn't render anything
}

export default AutoErrorCapture;
