import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import ThemeToggle from './';
import { ThemeToggleProps } from './ThemeToggle';

export default {
  title: 'Dashboard/Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: StoryFn<ThemeToggleProps> = () => <ThemeToggle />;

export const Default = Template.bind({});
