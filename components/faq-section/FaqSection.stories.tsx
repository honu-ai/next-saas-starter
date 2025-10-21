import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import FaqSection, { FaqSectionProps } from './FaqSection';
import content from '../../content.json';

export default {
  title: 'Landing Page/Sections/FaqSection',
  component: FaqSection,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: StoryFn<FaqSectionProps> = (args) => <FaqSection {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: content.faq.title,
  subtitle: content.faq.subtitle,
  faqs: content.faq.items,
};

export const CustomFaqs = Template.bind({});
CustomFaqs.args = {
  faqs: [
    {
      question: 'What is a custom FAQ question?',
      answer:
        'This is a custom FAQ answer that demonstrates how to pass custom FAQs to the component.',
    },
    {
      question: 'Can I add my own FAQs?',
      answer:
        'Yes, you can pass your own array of FAQ items to customize the content displayed in this section.',
    },
  ],
};
