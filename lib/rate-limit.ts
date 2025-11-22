/**
 * Rate Limiting Implementation
 *
 * Security: Prevents API abuse, DoS attacks, and cost explosion (especially for AI endpoints)
 *
 * NOTE: This is an in-memory implementation suitable for single-instance deployments.
 * For production multi-instance deployments, consider using:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel Edge Config
 * - Redis/Valkey with ioredis
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (will reset on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number

  /**
   * Time window in milliseconds
   */
  windowMs: number

  /**
   * Optional: Custom identifier (defaults to user ID or IP)
   */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  limit: number
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (user ID, IP, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `ratelimit:${identifier}`
  const now = Date.now()

  // Clean up expired entries every 1000 requests
  if (rateLimitStore.size > 1000) {
    cleanupExpiredEntries()
  }

  // Get or create entry
  let entry = rateLimitStore.get(key)

  // Reset if window has passed
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(key, entry)
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      limit: config.maxRequests
    }
  }

  // Increment counter
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    limit: config.maxRequests
  }
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // AI endpoints (expensive operations)
  AI_CHAT: {
    maxRequests: 20,
    windowMs: 60 * 1000 // 20 requests per minute
  },
  AI_INSIGHTS: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000 // 10 requests per hour
  },
  AI_SETTINGS: {
    maxRequests: 5,
    windowMs: 60 * 1000 // 5 requests per minute
  },

  // Data endpoints
  FORMS_SUBMIT: {
    maxRequests: 30,
    windowMs: 60 * 1000 // 30 submissions per minute
  },
  FILE_UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 1000 // 10 uploads per minute
  },

  // Auth endpoints
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 5 attempts per 15 minutes
  },

  // General API
  API_DEFAULT: {
    maxRequests: 100,
    windowMs: 60 * 1000 // 100 requests per minute
  }
} as const

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
  }
}

/**
 * Create a rate-limited response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again after ${new Date(result.resetTime).toISOString()}`,
      limit: result.limit,
      remaining: 0,
      resetTime: result.resetTime
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        ...getRateLimitHeaders(result)
      }
    }
  )
}
