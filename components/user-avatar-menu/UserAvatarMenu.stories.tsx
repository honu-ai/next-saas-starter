import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import UserAvatarMenu from './UserAvatarMenu';

export default {
  title: 'Dashboard/Components/UserAvatarMenu',
  component: UserAvatarMenu,
} as Meta;

const Template: StoryFn<typeof UserAvatarMenu> = (args) => (
  <UserAvatarMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
  user: {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    passwordHash: 'hashedpassword',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null,
    credits: null,
  },
  handleSignOut: () => alert('Signed out'),
};
