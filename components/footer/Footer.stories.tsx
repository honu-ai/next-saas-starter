import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Footer from './Footer';
import content from '../../content.json';

const meta: Meta<typeof Footer> = {
  title: 'Landing Page/Sections/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    companyName: content.footer.companyName,
    description: content.footer.description,
  },
};
