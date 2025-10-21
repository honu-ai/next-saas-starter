import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import SolutionSection from './SolutionSection';
import content from '../../content.json';

const meta: Meta<typeof SolutionSection> = {
  title: 'Landing Page/Sections/SolutionSection',
  component: SolutionSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SolutionSection>;

export const Default: Story = {
  args: {
    badge: content.solution.badge,
    title: content.solution.title,
    subtitle: content.solution.subtitle,
    cta: content.solution.cta,
    steps: content.solution.steps,
    product: content.metadata.product,
  },
};
