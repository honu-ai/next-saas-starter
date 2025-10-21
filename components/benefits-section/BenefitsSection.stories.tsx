import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import BenefitsSection from './BenefitsSection';
import content from '../../content.json';

const meta: Meta<typeof BenefitsSection> = {
  title: 'Landing Page/Sections/BenefitsSection',
  component: BenefitsSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BenefitsSection>;

export const Default: Story = {
  args: {
    badge: content.benefits.badge,
    title: content.benefits.title,
    description: content.benefits.description,
    cards: content.benefits.cards,
    bottomSection: content.benefits.bottomSection,
  },
};

// A simple test for component rendering
export const WithComponentTest: Story = {
  args: {
    badge: content.benefits.badge,
    title: content.benefits.title,
    description: content.benefits.description,
    cards: content.benefits.cards,
    bottomSection: content.benefits.bottomSection,
  },
  play: async ({ canvasElement }) => {
    // Testing that the component renders without errors
    const canvas = document.body.querySelector('#storybook-root');

    // Check if title renders correctly
    const title = canvas?.querySelector('h2');
    if (title) {
      // Verify title content - updated to match actual content
      const hasText = title.textContent?.includes('Go Beyond Basic AI');
      if (!hasText) {
        throw new Error('Title does not contain expected text');
      }
    } else {
      throw new Error('Title not found');
    }

    // Check if benefit cards render
    const cards = canvas?.querySelectorAll('.hover\\:border-primary\\/50');
    if (!cards || cards.length !== 3) {
      throw new Error(
        'Expected 3 benefit cards but found ' + (cards?.length || 0),
      );
    }
  },
};
