/**
 * Spacing Design Tokens
 * 
 * Spacing follows Tailwind's default scale (0.25rem increments).
 * Use Tailwind spacing utilities (p-*, m-*, gap-*, etc.) instead of hardcoded values.
 * 
 * Base unit: 0.25rem (4px)
 */

export const spacing = {
  // Base spacing scale (in rem)
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '1.5': '0.375rem',  // 6px
  '2': '0.5rem',      // 8px
  '2.5': '0.625rem',  // 10px
  '3': '0.75rem',     // 12px
  '3.5': '0.875rem',  // 14px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '7': '1.75rem',     // 28px
  '8': '2rem',        // 32px
  '9': '2.25rem',     // 36px
  '10': '2.5rem',     // 40px
  '11': '2.75rem',    // 44px
  '12': '3rem',       // 48px
  '14': '3.5rem',     // 56px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '28': '7rem',       // 112px
  '32': '8rem',       // 128px
  '36': '9rem',       // 144px
  '40': '10rem',      // 160px
  '44': '11rem',      // 176px
  '48': '12rem',      // 192px
  '52': '13rem',      // 208px
  '56': '14rem',      // 224px
  '60': '15rem',      // 240px
  '64': '16rem',      // 256px
  '72': '18rem',      // 288px
  '80': '20rem',      // 320px
  '96': '24rem',      // 384px
} as const

/**
 * Common spacing patterns
 */
export const spacingPatterns = {
  // Component padding
  cardPadding: 'p-4',        // 16px
  cardPaddingLarge: 'p-6',   // 24px
  buttonPadding: 'px-4 py-2', // 16px horizontal, 8px vertical
  
  // Component gaps
  formGap: 'gap-4',          // 16px between form fields
  listGap: 'gap-2',          // 8px between list items
  gridGap: 'gap-6',          // 24px grid gap
  
  // Section spacing
  sectionMargin: 'mb-8',     // 32px between sections
  sectionPadding: 'py-8',    // 32px vertical padding
  
  // Container spacing
  containerPadding: 'px-4 md:px-6 lg:px-8', // Responsive padding
} as const

/**
 * Usage Examples:
 * 
 * // Padding
 * <div className="p-4">Padding all sides</div>
 * <div className="px-4 py-2">Horizontal and vertical</div>
 * 
 * // Margin
 * <div className="m-4">Margin all sides</div>
 * <div className="mx-auto">Center horizontally</div>
 * 
 * // Gap (for flexbox/grid)
 * <div className="flex gap-4">Items with gap</div>
 * 
 * // Using spacing patterns
 * <div className={spacingPatterns.cardPadding}>
 */
