import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '../colors';

const meta: Meta = {
  title: 'Design System/Tokens/Colors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const SurfaceColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Surface Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors.surface).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded border border-gray-300" 
              style={{ backgroundColor: value }}
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const TextColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Text Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors.text).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded border border-gray-300 flex items-center justify-center text-2xl font-bold" 
              style={{ color: value }}
            >
              Aa
            </div>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const InteractiveColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Interactive Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors.interactive).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded border border-gray-300" 
              style={{ backgroundColor: value }}
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FeedbackColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Feedback Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors.feedback).map(([name, value]) => (
          <div key={name} className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded border border-gray-300" 
              style={{ backgroundColor: value }}
            />
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-600">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
