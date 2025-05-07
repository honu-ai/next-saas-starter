import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import BenefitsSection from './BenefitsSection';

const meta: Meta<typeof BenefitsSection> = {
  title: 'Components/BenefitsSection',
  component: BenefitsSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BenefitsSection>;

export const Default: Story = {};

// A simple test for component rendering
export const WithComponentTest: Story = {
  play: async ({ canvasElement }) => {
    // Testing that the component renders without errors
    const canvas = document.body.querySelector('#storybook-root');

    // Check if title renders correctly
    const title = canvas?.querySelector('h2');
    if (title) {
      // Verify title content
      const hasText = title.textContent?.includes('Transform Your Content');
      if (!hasText) {
        throw new Error('Title does not contain expected text');
      }
    } else {
      throw new Error('Title not found');
    }

    // Check if benefit cards render
    const cards = canvas?.querySelectorAll(
      '.hover\\:border-rankwell-purple\\/50',
    );
    if (!cards || cards.length !== 3) {
      throw new Error(
        'Expected 3 benefit cards but found ' + (cards?.length || 0),
      );
    }
  },
};
