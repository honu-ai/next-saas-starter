import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import DashboardNav from './DashboardNav';
import { DashboardNavProps } from './DashboardNav';
import UserAvatarMenu from '../user-avatar-menu';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  passwordHash: 'hashedpassword',
  role: 'owner' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  stripeProductId: null,
  planName: null,
  subscriptionStatus: null,
  credits: null,
};

export default {
  title: 'Dashboard/Components/DashboardNav',
  component: DashboardNav,
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

const Template: StoryFn<DashboardNavProps> = (args) => (
  <DashboardNav {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: <UserAvatarMenu user={mockUser} handleSignOut={() => {}} />,
};
