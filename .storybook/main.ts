import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../design-system/**/*.mdx',
    '../design-system/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                require.resolve('@babel/preset-react'),
                {
                  runtime: 'automatic',
                  development: true,
                },
              ],
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
      ],
    });

    if (!config.resolve) {
      config.resolve = { extensions: ['.ts', '.tsx'], alias: {} };
    } else {
      config.resolve.extensions = [...(config.resolve.extensions || []), '.ts', '.tsx'];
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '..'),
      '@/components': path.resolve(__dirname, '../components'),
      '@/design-system': path.resolve(__dirname, '../design-system'),
    };

    return config;
  },
};

export default config;
