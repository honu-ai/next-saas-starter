import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  docs: {
    defaultName: 'Documentation',
  },
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
};
export default config;
