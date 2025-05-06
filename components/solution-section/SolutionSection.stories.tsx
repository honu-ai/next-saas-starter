import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SolutionSection from './SolutionSection';

const meta: Meta<typeof SolutionSection> = {
  title: 'Components/SolutionSection',
  component: SolutionSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SolutionSection>;

export const Default: Story = {};
