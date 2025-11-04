import type { Meta, StoryObj } from '@storybook/react';
import { spacingTokens } from '../spacing';

const meta: Meta = {
  title: 'Design System/Tokens/Spacing',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const BaseScale: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Base Spacing Scale</h2>
      <div className="space-y-2">
        {Object.entries(spacingTokens.spacing).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium">{name}</div>
            <div className="text-sm text-gray-600 w-20">{value}</div>
            <div 
              className="bg-blue-500 h-8" 
              style={{ width: value }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ComponentSpacing: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Component Spacing</h2>
      <div className="space-y-4">
        {Object.entries(spacingTokens.component).map(([name, value]) => (
          <div key={name} className="border-b pb-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-40 text-sm font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
            <div className="bg-blue-100 border border-blue-500">
              <div 
                className="bg-blue-500 h-8" 
                style={{ width: value }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LayoutSpacing: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Layout Spacing</h2>
      <div className="space-y-4">
        {Object.entries(spacingTokens.layout).map(([name, value]) => (
          <div key={name} className="border-b pb-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-40 text-sm font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
            <div className="bg-green-100 border border-green-500">
              <div 
                className="bg-green-500 h-8" 
                style={{ width: value }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const GapScale: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Gap Scale</h2>
      <div className="space-y-2">
        {Object.entries(spacingTokens.gap).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium">{name}</div>
            <div className="text-sm text-gray-600 w-20">{value}</div>
            <div 
              className="bg-purple-500 h-8" 
              style={{ width: value }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};
