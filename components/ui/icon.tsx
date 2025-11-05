import * as React from 'react';
import { type LucideIcon, type LucideProps } from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { cn } from './utils';
import type { IconSize, IconColor, IconStrokeWidth } from '@/design-system/tokens/icons';

export interface IconProps extends Omit<LucideProps, 'size' | 'color' | 'strokeWidth'> {
  /**
   * The Lucide icon component to render
   */
  icon: LucideIcon;

  /**
   * Size of the icon using design token sizes
   * @default 'md'
   */
  size?: IconSize;

  /**
   * Color of the icon using design token colors
   * @default 'inherit' (inherits from parent)
   */
  color?: IconColor;

  /**
   * Stroke width of the icon
   * @default 'regular'
   */
  strokeWidth?: IconStrokeWidth;

  /**
   * Label for accessibility (required for semantic icons)
   */
  label?: string;

  /**
   * Whether the icon is purely decorative (no semantic meaning)
   * @default false
   */
  decorative?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Icon Component
 *
 * A standardized wrapper around Lucide React icons that applies
 * design system tokens for consistent sizing, spacing, and colors.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Icon icon={CheckIcon} />
 *
 * // With custom size and color
 * <Icon icon={AlertIcon} size="lg" color="error" />
 *
 * // Decorative icon (no label needed)
 * <Icon icon={StarIcon} decorative />
 *
 * // Semantic icon (requires label)
 * <Icon icon={InfoIcon} label="Information" />
 * ```
 */
export function Icon({
  icon: LucideIcon,
  size = 'md',
  color = 'inherit',
  strokeWidth = 'regular',
  label,
  decorative = false,
  className,
  ...props
}: IconProps) {
  const iconSize = tokens.icons.size[size];
  const iconColor = tokens.icons.color[color];
  const iconStrokeWidth = tokens.icons.strokeWidth[strokeWidth];

  // Accessibility attributes
  const a11yProps = decorative
    ? tokens.icons.accessibility.decorative
    : {
        role: 'img',
        'aria-label': label,
      };

  // Warn in development if semantic icon is missing a label
  if (process.env.NODE_ENV === 'development' && !decorative && !label) {
    console.warn(
      'Icon: Semantic icons should have a label for accessibility. Either provide a `label` prop or set `decorative={true}`.'
    );
  }

  return (
    <LucideIcon
      className={cn('inline-block flex-shrink-0', className)}
      style={{
        width: iconSize,
        height: iconSize,
        color: iconColor,
      }}
      strokeWidth={iconStrokeWidth}
      {...a11yProps}
      {...props}
    />
  );
}

/**
 * IconButton Helper
 * Creates an icon with button-optimized sizing and spacing
 */
export function IconButton({
  icon,
  label,
  className,
  ...props
}: Omit<IconProps, 'size' | 'strokeWidth'>) {
  return (
    <Icon
      icon={icon}
      size="md"
      strokeWidth="medium"
      label={label}
      className={cn('mr-2', className)}
      {...props}
    />
  );
}

/**
 * IconInline Helper
 * Creates an icon optimized for inline text usage
 */
export function IconInline({
  icon,
  className,
  ...props
}: Omit<IconProps, 'size' | 'strokeWidth'>) {
  return (
    <Icon
      icon={icon}
      size="sm"
      strokeWidth="regular"
      decorative
      className={cn('inline align-text-bottom', className)}
      {...props}
    />
  );
}

/**
 * IconNav Helper
 * Creates an icon optimized for navigation menus
 */
export function IconNav({
  icon,
  label,
  className,
  ...props
}: Omit<IconProps, 'size' | 'strokeWidth'>) {
  return (
    <Icon
      icon={icon}
      size="md"
      strokeWidth="regular"
      label={label}
      className={cn('mr-3', className)}
      {...props}
    />
  );
}

/**
 * IconEmptyState Helper
 * Creates a large icon for empty states
 */
export function IconEmptyState({
  icon,
  label,
  className,
  ...props
}: Omit<IconProps, 'size' | 'strokeWidth'>) {
  return (
    <Icon
      icon={icon}
      size="2xl"
      strokeWidth="thin"
      label={label}
      className={cn('mx-auto', className)}
      {...props}
    />
  );
}

export default Icon;
