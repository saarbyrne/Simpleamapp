/**
 * Platform Admin Module
 *
 * Centralized exports for platform administration functionality.
 * Import from '@/lib/platform-admin' for convenience.
 *
 * @example
 * ```typescript
 * import { checkPlatformAdmin, requirePlatformAdmin } from '@/lib/platform-admin';
 * import { PLATFORM_ADMIN_CONFIG } from '@/lib/platform-admin';
 * import { validateAdminAction } from '@/lib/platform-admin';
 * ```
 */

// Core platform admin utilities and permission checks
export * from './platform-admin';

// Platform admin configuration
export * from './platform-admin-config';

// Validation utilities for admin actions
export * from './platform-admin-validation';
