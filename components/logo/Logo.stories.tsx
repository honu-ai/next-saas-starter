import { Meta, StoryObj } from '@storybook/nextjs';
import { within } from 'storybook/test';
import Logo from './Logo';
import content from '../../content.json';

const meta: Meta<typeof Logo> = {
  component: Logo,
  title: 'Landing Page/Components/Logo',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    href: '/',
    brandName: content.metadata.brandName,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the logo circle with first letter exists
    canvas.getByText(content.metadata.brandName.charAt(0));

    // Verify the brand name text exists
    canvas.getByText(content.metadata.brandName);
  },
};

export const CustomBrandName: Story = {
  args: {
    href: '/',
    brandName: 'Acme',
  },
};

export const CustomLink: Story = {
  args: {
    href: '/dashboard',
    brandName: 'Quantum',
  },
};
