'use client';

import * as React from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme) || defaultTheme : defaultTheme)
  );
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    if (disableTransitionOnChange) {
      const css = document.createElement('style');
      css.appendChild(
        document.createTextNode(
          '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
        )
      );
      document.head.appendChild(css);

      // Force reflow
      (() => window.getComputedStyle(document.body))();

      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
      return;
    }

    const activeTheme = theme === 'system' ? 'light' : theme;
    root.classList.add(activeTheme);
    setResolvedTheme(activeTheme);
  }, [theme, enableSystem, disableTransitionOnChange]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
      },
      resolvedTheme,
    }),
    [theme, resolvedTheme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
