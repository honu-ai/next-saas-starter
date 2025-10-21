import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import HeroSection from './HeroSection';
import content from '../../content.json';

export default {
  title: 'Landing Page/Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: StoryFn<typeof HeroSection> = (args) => (
  <HeroSection {...args} />
);

export const Default = Template.bind({});
Default.args = {
  href: content.hero.href,
  ctaText: content.hero.ctaText,
  heroText: content.hero.heroText,
  heroDescriptionHeading: content.hero.heroDescriptionHeading,
  heroDescription: content.hero.heroDescription,
  product: content.metadata.product,
};
