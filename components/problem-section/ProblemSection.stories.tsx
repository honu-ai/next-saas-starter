import type { Meta, StoryObj } from '@storybook/react';
import ProblemSection from './ProblemSection';

const meta: Meta<typeof ProblemSection> = {
  title: 'Components/ProblemSection',
  component: ProblemSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProblemSection>;

export const Default: Story = {
  args: {},
};

export const CustomContent: Story = {
  args: {
    title: 'The Market <span className="text-primary">Challenge</span>',
    subtitle:
      'Modern marketing requires new approaches and strategies to succeed in today&apos;s competitive landscape.',
    result: 'What happens next?',
    resultSubtitle:
      'Companies that adapt will thrive, while others fall behind.',
    cards: [
      {
        icon: 'Clock',
        title: 'Increased Competition',
        description:
          'More businesses are investing in digital marketing, making it harder to stand out.',
      },
      {
        icon: 'TrendingDown',
        title: 'Changing Metrics',
        description:
          'Success is measured differently now, with engagement and conversion trumping impressions.',
      },
      {
        icon: 'Frown',
        title: 'ROI Pressure',
        description:
          'Marketing departments are under increasing pressure to demonstrate clear return on investment.',
      },
    ],
  },
};
