import { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';
import Logo from './Logo';

const brandName = 'Honu';

const meta: Meta<typeof Logo> = {
  component: Logo,
  title: 'Components/Logo',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    href: '/',
    brandName,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the logo circle with first letter exists
    canvas.getByText(brandName.charAt(0));

    // Verify the brand name text exists
    canvas.getByText(brandName);
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
