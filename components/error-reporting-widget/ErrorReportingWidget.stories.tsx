import type { Meta, StoryObj } from '@storybook/react';
import { ErrorReportingWidget } from './ErrorReportingWidget';

const meta: Meta<typeof ErrorReportingWidget> = {
  title: 'Components/ErrorReportingWidget',
  component: ErrorReportingWidget,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A floating error reporting widget that allows users to submit bug reports and feedback through PostHog events.',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      description: 'Position of the floating widget',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the widget button',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'auto'],
      description: 'Theme preference for the widget',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorReportingWidget>;

export const Default: Story = {
  args: {
    position: 'bottom-right',
    size: 'medium',
    theme: 'auto',
  },
};

export const BottomLeft: Story = {
  args: {
    position: 'bottom-left',
    size: 'medium',
    theme: 'auto',
  },
};

export const TopRight: Story = {
  args: {
    position: 'top-right',
    size: 'medium',
    theme: 'auto',
  },
};

export const Large: Story = {
  args: {
    position: 'bottom-right',
    size: 'large',
    theme: 'auto',
  },
};

export const Small: Story = {
  args: {
    position: 'bottom-right',
    size: 'small',
    theme: 'auto',
  },
};

// Mock PostHog for Storybook
export const WithMockPostHog: Story = {
  args: {
    position: 'bottom-right',
    size: 'medium',
    theme: 'auto',
  },
  decorators: [
    (Story) => {
      // Mock PostHog for Storybook environment
      if (typeof window !== 'undefined') {
        (window as any).posthog = {
          capture: (event: string, properties: any) => {
            console.log('Mock PostHog capture:', event, properties);
          },
          get_session_id: () => 'mock-session-id',
        };
      }
      return <Story />;
    },
  ],
};
