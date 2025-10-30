import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import { Button } from '@/components/ui/button';

// Component that throws an error for testing
function ErrorThrowingComponent() {
  useEffect(() => {
    throw new Error('This is a test error thrown from ErrorThrowingComponent');
  }, []);
  return null;
}

// Component with a button that throws an error
function ButtonThrowsError() {
  const handleClick = () => {
    throw new Error('Error triggered by button click');
  };

  return (
    <div className='p-8'>
      <h2 className='mb-4 text-xl font-bold'>Error Boundary Test</h2>
      <p className='mb-4'>Click the button below to trigger an error:</p>
      <Button onClick={handleClick}>Throw Error</Button>
    </div>
  );
}

const meta: Meta<typeof GlobalErrorBoundary> = {
  title: 'Dashboard/Components/GlobalErrorBoundary',
  component: GlobalErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A React Error Boundary component that catches JavaScript errors anywhere in the component tree, logs them to PostHog, and displays a fallback UI.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalErrorBoundary>;

// Normal state - no error
export const Normal: Story = {
  args: {
    children: (
      <div className='p-8'>
        <h1 className='mb-4 text-2xl font-bold'>
          Normal Component - No Errors
        </h1>
        <p>
          This shows the normal state when no errors occur. The Error Boundary
          wraps this content but doesn&apos;t interfere with normal rendering.
        </p>
      </div>
    ),
  },
};

// Error state - automatic error throw
export const WithError: Story = {
  args: {
    children: <ErrorThrowingComponent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the error boundary catching a thrown error and displaying the fallback UI.',
      },
    },
  },
};

// Error state with custom fallback
export const WithCustomFallback: Story = {
  args: {
    children: <ErrorThrowingComponent />,
    fallback: (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
          <h2 className='mb-4 text-xl font-bold text-red-600'>
            Custom Error Fallback
          </h2>
          <p className='text-gray-700'>
            This is a custom fallback UI provided to the Error Boundary.
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story shows a custom fallback UI instead of the default error screen.',
      },
    },
  },
};

// Interactive - button that throws error
export const Interactive: Story = {
  args: {
    children: <ButtonThrowsError />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click the button to trigger an error and see the error boundary in action.',
      },
    },
  },
};

// Error boundary with callback
export const WithErrorCallback: Story = {
  args: {
    children: <ErrorThrowingComponent />,
    onError: (error, errorInfo) => {
      console.log('Error caught by boundary:', error.message);
      console.log('Component stack:', errorInfo.componentStack);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the onError callback being triggered. Check the browser console to see the logged error details.',
      },
    },
  },
};
