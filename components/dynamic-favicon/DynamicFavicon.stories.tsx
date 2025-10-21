import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import DynamicFavicon from './DynamicFavicon';

const meta: Meta<typeof DynamicFavicon> = {
  component: DynamicFavicon,
  title: 'Landing Page/Components/DynamicFavicon',
  tags: ['autodocs'],
  parameters: {
    // This component doesn't have visual output in Storybook
    docs: {
      description: {
        component:
          'A component that dynamically generates a favicon based on the first letter of the brand name from content.json.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicFavicon>;

export const Default: Story = {};
