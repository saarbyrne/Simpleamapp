'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../theme-provider';
import { Button } from './button';
import { Icon } from './icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon
            icon={SunIcon}
            decorative
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            icon={MoonIcon}
            decorative
            className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple toggle between light and dark (no system option)
 */
export function ThemeToggleSimple() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon
        icon={SunIcon}
        size="md"
        decorative
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Icon
        icon={MoonIcon}
        size="md"
        decorative
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}
