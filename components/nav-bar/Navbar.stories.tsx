import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import Navbar from './Navbar';
import { NavbarProps } from './Navbar';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

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

export const HiddenOnDashboard = Template.bind({});
HiddenOnDashboard.args = {
  links: [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ],
};

HiddenOnDashboard.parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/dashboard',
    },
  },
  docs: {
    description: {
      story:
        'The Navbar component returns null when on dashboard pages to avoid interfering with the dashboard layout.',
    },
  },
};

export const WithLoginAndSignUpButtons = Template.bind({});

WithLoginAndSignUpButtons.args = {
  links: [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ],
  children: (
    <div className='flex flex-col gap-2 space-x-3 md:block md:flex-row md:items-center'>
      <Button className='rounded-full border border-black bg-transparent px-5 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800'>
        Log In
      </Button>
      <Button className='rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800'>
        Sign Up
      </Button>
    </div>
  ),
};

WithLoginAndSignUpButtons.parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/',
    },
  },
};

export const WithDashboardLink = Template.bind({});

WithDashboardLink.args = {
  links: [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ],
  children: (
    <div className='flex flex-col items-center md:flex-row'>
      <Button className='group bg-primary text-primary-foreground relative overflow-hidden rounded-full px-6 py-2 text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg'>
        Dashboard
        <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
      </Button>
    </div>
  ),
};

WithDashboardLink.parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/',
    },
  },
};
