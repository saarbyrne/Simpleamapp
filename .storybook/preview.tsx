import type { Preview } from '@storybook/react';
import '../app/globals.css';
import React from 'react';
import { ThemeDecorator } from './decorators/ThemeDecorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'page',
          value: '#f8f8f8',
        },
      ],
    },
    badgesConfig: {
      stable: {
        title: 'Stable',
        styles: {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          color: '#ffffff',
        },
      },
      beta: {
        title: 'Beta',
        styles: {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          color: '#ffffff',
        },
      },
      deprecated: {
        title: 'Deprecated',
        styles: {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          color: '#ffffff',
        },
      },
      new: {
        title: 'New',
        styles: {
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          color: '#ffffff',
        },
      },
    },
  },
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
