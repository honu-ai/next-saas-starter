import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ErrorReportingOnboarding } from './ErrorReportingOnboarding';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle } from 'lucide-react';

const meta: Meta<typeof ErrorReportingOnboarding> = {
  title: 'Dashboard/Components/ErrorReportingOnboarding',
  component: ErrorReportingOnboarding,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const OnboardingDemo = () => {
  useEffect(() => {
    const seen = localStorage.getItem('error-reporting-onboarding-seen');

    if (seen) {
      localStorage.removeItem('error-reporting-onboarding-seen');
    }
    return () => {
      localStorage.removeItem('error-reporting-onboarding-seen');
    };
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-8'>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-blue-600' />
            Error Reporting Onboarding Demo
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground'>
            This component shows a modal that introduces users to the error
            reporting feature. It automatically appears with a 2-second delay
            the first time a user visits the application.
          </p>

          <div className='space-y-2'>
            <h4 className='font-semibold'>How it works:</h4>
            <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
              <li>The modal appears automatically on first visit</li>
              <li>
                Once dismissed, it won&apos;t show again (stored in
                localStorage)
              </li>
              <li>
                <strong>In this story:</strong> The modal will reappear each
                time you navigate away and come back
              </li>
              <li>
                localStorage is automatically cleared when you return to this
                story
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              💡 <strong>Tip:</strong> Close the modal and navigate to another
              story, then come back to see it appear again.
            </p>
          </div>
        </CardContent>
      </Card>
      <ErrorReportingOnboarding delay={0} />
    </div>
  );
};

type Story = StoryObj<typeof ErrorReportingOnboarding>;

export const Default: Story = {
  render: () => <OnboardingDemo />,
};
