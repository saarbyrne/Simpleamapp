import type { Meta, StoryObj } from '@storybook/react';
import { typography } from '../typography';

const meta: Meta = {
  title: 'Design System/Tokens/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const DisplayStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Display Styles</h2>
      {Object.entries(typography.display).map(([name, styles]) => (
        <div key={name} className="border-b pb-4">
          <div className="text-sm text-gray-600 mb-2">{name}</div>
          <div style={styles}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {JSON.stringify(styles, null, 2)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const HeadingStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Heading Styles</h2>
      {Object.entries(typography.heading).map(([name, styles]) => (
        <div key={name} className="border-b pb-4">
          <div className="text-sm text-gray-600 mb-2">{name}</div>
          <div style={styles}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {JSON.stringify(styles, null, 2)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const BodyStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Body Styles</h2>
      {Object.entries(typography.body).map(([name, styles]) => (
        <div key={name} className="border-b pb-4">
          <div className="text-sm text-gray-600 mb-2">{name}</div>
          <div style={styles}>
            The quick brown fox jumps over the lazy dog. This is a longer paragraph to show how the body text looks with multiple lines and proper line height.
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {JSON.stringify(styles, null, 2)}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const UIStyles: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">UI Component Styles</h2>
      {Object.entries(typography.ui).map(([name, styles]) => (
        <div key={name} className="border-b pb-4">
          <div className="text-sm text-gray-600 mb-2">{name}</div>
          <div style={styles}>
            The quick brown fox jumps over the lazy dog
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {JSON.stringify(styles, null, 2)}
          </div>
        </div>
      ))}
    </div>
  ),
};
