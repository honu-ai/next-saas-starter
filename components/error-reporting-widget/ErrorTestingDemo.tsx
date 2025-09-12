'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useErrorReporting } from './useErrorReporting';
import { toast } from 'sonner';

/**
 * Demo component for testing error reporting functionality
 * Only include this in development builds or testing environments
 */
export function ErrorTestingDemo() {
  const [networkErrorCount, setNetworkErrorCount] = useState(0);
  const { reportError, reportJSError, reportNetworkError } =
    useErrorReporting();

  const triggerJSError = () => {
    // Trigger an unhandled JavaScript error
    setTimeout(() => {
      throw new Error('Test JavaScript error from ErrorTestingDemo');
    }, 100);
    toast.info('JavaScript error will be thrown in 100ms');
  };

  const triggerNetworkError = async () => {
    try {
      // Attempt to fetch a non-existent endpoint
      await fetch('/api/non-existent-endpoint');
    } catch (error) {
      setNetworkErrorCount((prev) => prev + 1);
      toast.info('Network error captured automatically');
    }
  };

  const triggerManualReport = async () => {
    await reportError({
      title: 'Test Manual Error Report',
      description:
        'This is a test error report created programmatically from the demo component.',
      severity: 'medium',
      category: 'bug',
      additionalContext: {
        testType: 'manual_report',
        timestamp: new Date().toISOString(),
        demoComponent: true,
      },
    });
    toast.success('Manual error report sent');
  };

  const triggerReactError = () => {
    // This will trigger the error boundary
    throw new Error('Test React component error');
  };

  const triggerPromiseRejection = () => {
    // Trigger an unhandled promise rejection
    Promise.reject(new Error('Test unhandled promise rejection'));
    toast.info('Unhandled promise rejection triggered');
  };

  const triggerCustomNetworkError = () => {
    reportNetworkError(
      'https://api.example.com/test',
      500,
      'Internal Server Error',
      'POST',
    );
    toast.info('Custom network error reported');
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't render in production
  }

  return (
    <Card className='m-4 mx-auto max-w-2xl'>
      <CardHeader>
        <CardTitle>🧪 Error Reporting Test Suite</CardTitle>
        <CardDescription>
          Test the error reporting functionality. These buttons will trigger
          various types of errors that should be captured and sent to PostHog.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <Button onClick={triggerJSError} variant='outline' className='w-full'>
            🐛 Trigger JS Error
          </Button>

          <Button
            onClick={triggerNetworkError}
            variant='outline'
            className='w-full'
          >
            🌐 Trigger Network Error ({networkErrorCount})
          </Button>

          <Button
            onClick={triggerManualReport}
            variant='outline'
            className='w-full'
          >
            📝 Send Manual Report
          </Button>

          <Button
            onClick={triggerReactError}
            variant='outline'
            className='w-full border-red-200 text-red-600 hover:bg-red-50'
          >
            ⚛️ Trigger React Error
          </Button>

          <Button
            onClick={triggerPromiseRejection}
            variant='outline'
            className='w-full'
          >
            🔄 Promise Rejection
          </Button>

          <Button
            onClick={triggerCustomNetworkError}
            variant='outline'
            className='w-full'
          >
            📡 Custom Network Error
          </Button>
        </div>

        <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20'>
          <h4 className='mb-2 font-semibold text-blue-800 dark:text-blue-200'>
            Testing Instructions:
          </h4>
          <ul className='space-y-1 text-sm text-blue-700 dark:text-blue-300'>
            <li>• Click each button to test different error scenarios</li>
            <li>• Check your browser console for error messages</li>
            <li>• Verify events appear in your PostHog dashboard</li>
            <li>• The floating bug widget should also be available</li>
            <li>• React errors will trigger the error boundary</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ErrorTestingDemo;
