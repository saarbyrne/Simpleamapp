import type { Meta, StoryObj } from '@storybook/react';
import { elevation } from '../elevation';

const meta: Meta = {
  title: 'Design System/Tokens/Elevation',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const ShadowScale: StoryObj = {
  render: () => (
    <div className="space-y-8 p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Shadow Scale</h2>
      <div className="grid grid-cols-3 gap-8">
        {Object.entries(elevation.shadow).map(([name, value]) => (
          <div key={name} className="text-center">
            <div 
              className="bg-white rounded-lg p-8 mb-2" 
              style={{ boxShadow: value }}
            >
              <div className="text-4xl mb-2">📦</div>
              <div className="font-medium">{name}</div>
            </div>
            <div className="text-xs text-gray-600 font-mono">{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ComponentElevation: StoryObj = {
  render: () => (
    <div className="space-y-8 p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Component Elevation</h2>
      <div className="grid grid-cols-3 gap-8">
        {Object.entries(elevation.component).map(([name, value]) => (
          <div key={name} className="text-center">
            <div 
              className="bg-white rounded-lg p-8 mb-2" 
              style={{ boxShadow: value }}
            >
              <div className="font-medium capitalize">{name}</div>
            </div>
            <div className="text-xs text-gray-600">{name}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ColoredShadows: StoryObj = {
  render: () => (
    <div className="space-y-8 p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Colored Shadows (Focus, Error)</h2>
      <div className="grid grid-cols-3 gap-8">
        {Object.entries(elevation.coloredShadow).map(([name, value]) => (
          <div key={name} className="text-center">
            <div 
              className="bg-white rounded-lg p-8 mb-2" 
              style={{ boxShadow: value }}
            >
              <div className="font-medium capitalize">{name}</div>
            </div>
            <div className="text-xs text-gray-600">{name}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
