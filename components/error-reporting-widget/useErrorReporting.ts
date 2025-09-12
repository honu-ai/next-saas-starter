'use client';

import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';
import { ErrorReport, UseErrorReportingOptions } from './types';

export function useErrorReporting(options: UseErrorReportingOptions = {}) {
  const posthog = usePostHog();

  const {
    autoCapture = true,
    includeUserAgent = true,
    includeUrl = true,
    includeSessionData = true,
  } = options;

  const reportError = useCallback(
    async (
      errorReport: Omit<
        ErrorReport,
        'timestamp' | 'url' | 'userAgent' | 'sessionId'
      >,
    ) => {
      if (!posthog) {
        console.warn('PostHog not initialized - error report not sent');
        return false;
      }

      try {
        // Enhance the error report with additional context
        const enhancedReport: ErrorReport = {
          ...errorReport,
          timestamp: new Date().toISOString(),
          ...(includeUrl && { url: window.location.href }),
          ...(includeUserAgent && { userAgent: navigator.userAgent }),
          ...(includeSessionData && { sessionId: posthog.get_session_id() }),
        };

        // Send as a custom PostHog event
        posthog.capture('user_error_report', {
          error_title: enhancedReport.title,
          error_description: enhancedReport.description,
          error_severity: enhancedReport.severity,
          error_category: enhancedReport.category,
          error_url: enhancedReport.url,
          error_user_agent: enhancedReport.userAgent,
          error_timestamp: enhancedReport.timestamp,
          error_session_id: enhancedReport.sessionId,
          error_additional_context: enhancedReport.additionalContext,
          // Add some useful PostHog properties
          $set: {
            last_error_report: enhancedReport.timestamp,
            total_error_reports: '$increment',
          },
        });

        // Also send as a separate event for easier filtering/analysis
        posthog.capture(
          `error_${enhancedReport.category}_${enhancedReport.severity}`,
          {
            title: enhancedReport.title,
            description: enhancedReport.description,
            context: enhancedReport.additionalContext,
          },
        );

        return true;
      } catch (error) {
        console.error('Failed to send error report:', error);
        return false;
      }
    },
    [posthog, includeUrl, includeUserAgent, includeSessionData],
  );

  const reportJSError = useCallback(
    (error: Error, errorInfo?: any) => {
      if (!autoCapture || !posthog) return;

      posthog.capture('javascript_error', {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        error_info: errorInfo,
        error_url: window.location.href,
        error_timestamp: new Date().toISOString(),
        error_user_agent: navigator.userAgent,
      });
    },
    [posthog, autoCapture],
  );

  const reportNetworkError = useCallback(
    (
      url: string,
      status: number,
      statusText: string,
      method: string = 'GET',
    ) => {
      if (!autoCapture || !posthog) return;

      posthog.capture('network_error', {
        error_url: url,
        error_status: status,
        error_status_text: statusText,
        error_method: method,
        error_timestamp: new Date().toISOString(),
        page_url: window.location.href,
      });
    },
    [posthog, autoCapture],
  );

  return {
    reportError,
    reportJSError,
    reportNetworkError,
    isReady: !!posthog,
  };
}
