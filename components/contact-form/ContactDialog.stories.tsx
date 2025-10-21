import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { userEvent, within } from 'storybook/test';
import ContactDialog from './ContactDialog';

const meta: Meta<typeof ContactDialog> = {
  title: 'Landing Page/Components/ContactDialog',
  component: ContactDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ContactDialog>;

export const Default: Story = {
  args: {
    triggerText: 'Contact Us',
    title: 'Contact Us',
    description:
      "Fill out the form below and we'll get back to you as soon as possible.",
    showIcon: true,
    variant: 'default',
  },
};

export const WithoutIcon: Story = {
  args: {
    triggerText: 'Contact Us',
    title: 'Contact Us',
    description:
      "Fill out the form below and we'll get back to you as soon as possible.",
    showIcon: false,
    variant: 'default',
  },
};

export const OutlineVariant: Story = {
  args: {
    triggerText: 'Contact Us',
    title: 'Contact Us',
    description:
      "Fill out the form below and we'll get back to you as soon as possible.",
    showIcon: true,
    variant: 'outline',
  },
};

export const WithInteraction: Story = {
  args: {
    triggerText: 'Open Contact Form',
    title: 'Get in Touch',
    description: 'We would love to hear from you!',
    showIcon: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the button to open the dialog
    const button = canvas.getByRole('button', { name: /Open Contact Form/i });
    await userEvent.click(button);

    // Wait for the dialog to appear
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return;

    const dialogCanvas = within(dialog as HTMLElement);

    // Fill in the form
    const nameInput = dialogCanvas.getByPlaceholderText('Name');
    const emailInput = dialogCanvas.getByPlaceholderText('Email');
    const messageInput = dialogCanvas.getByPlaceholderText('Message');

    await userEvent.type(nameInput, 'John Doe', { delay: 50 });
    await userEvent.type(emailInput, 'john.doe@example.com', { delay: 50 });
    await userEvent.type(
      messageInput,
      'This is a test message for the contact form.',
      { delay: 50 },
    );

    // Submit the form
    const submitButton = dialogCanvas.getByRole('button', { name: 'Send' });
    await userEvent.click(submitButton);
  },
};
