import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Navbar from './Navbar';
import { NavbarProps } from './Navbar';

export default {
  title: 'Landing Page/Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
} as Meta;

const Template: StoryFn<NavbarProps> = (args) => <Navbar {...args} />;

export const Default = Template.bind({});
Default.args = {
  links: [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ],
};

export const WithActiveLink = Template.bind({});
WithActiveLink.args = {
  links: [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ],
};
WithActiveLink.parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '#benefits',
    },
  },
};
