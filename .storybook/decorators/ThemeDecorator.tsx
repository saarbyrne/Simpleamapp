import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';

export const ThemeDecorator: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <Story />;
};
