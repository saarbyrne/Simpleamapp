import type { Meta, StoryObj } from '@storybook/react';
import { zIndex } from '../z-index';

const meta: Meta = {
  title: 'Design System/Tokens/Z-Index',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const LayerHierarchy: StoryObj = {
  render: () => {
    const layers = [
      { name: 'Base', values: zIndex.base },
      { name: 'Content', values: zIndex.content },
      { name: 'Navigation', values: zIndex.navigation },
      { name: 'Overlay', values: zIndex.overlay },
      { name: 'Modal', values: zIndex.modal },
      { name: 'Popup', values: zIndex.popup },
      { name: 'Notification', values: zIndex.notification },
      { name: 'Maximum', values: zIndex.maximum },
    ];

    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Z-Index Layer Hierarchy</h2>
        <p className="text-gray-600 mb-8">
          This shows the stacking order of different UI layers. Higher numbers appear on top.
        </p>
        <div className="space-y-4">
          {layers.map((layer) => (
            <div key={layer.name} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{layer.name} Layer</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(layer.values).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{key}</span>
                    <span className="text-gray-600 font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const ComponentZIndex: StoryObj = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Component Z-Index Values</h2>
      <p className="text-gray-600 mb-8">
        Pre-assigned z-index values for specific components.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(zIndex.component).map(([name, value]) => (
          <div key={name} className="flex justify-between p-4 bg-gray-50 rounded border">
            <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="text-gray-600 font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const VisualDemo: StoryObj = {
  render: () => (
    <div className="relative h-96 bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="absolute w-64 h-64 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ zIndex: zIndex.base.base }}
        >
          Base (0)
        </div>
        <div 
          className="absolute w-56 h-56 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ zIndex: zIndex.content.dropdown, left: '60px', top: '60px' }}
        >
          Dropdown (150)
        </div>
        <div 
          className="absolute w-48 h-48 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ zIndex: zIndex.navigation.sidebar, left: '100px', top: '100px' }}
        >
          Sidebar (200)
        </div>
        <div 
          className="absolute w-40 h-40 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ zIndex: zIndex.overlay.modalBackdrop, left: '140px', top: '140px' }}
        >
          Modal Backdrop (400)
        </div>
        <div 
          className="absolute w-32 h-32 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ zIndex: zIndex.modal.dialogContent, left: '180px', top: '180px' }}
        >
          Dialog (450)
        </div>
        <div 
          className="absolute w-24 h-24 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ zIndex: zIndex.popup.tooltip, left: '220px', top: '220px' }}
        >
          Tooltip (550)
        </div>
      </div>
    </div>
  ),
};
