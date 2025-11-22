import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the in-memory rate limit store before each test
    // We need to access the internal store - this is a bit hacky for testing
    // In production, this would be handled by the in-memory store resetting
  })

  it('should allow requests within the limit', () => {
    const userId = 'test-user'
    const config = RATE_LIMITS.AI_CHAT

    // First request should succeed
    const result1 = checkRateLimit(userId, config)
    expect(result1.success).toBe(true)
    expect(result1.remaining).toBe(config.maxRequests - 1)
  })

  it('should block requests over the limit', () => {
    const userId = 'test-user'
    const config = { maxRequests: 2, windowMs: 1000 }

    // Use up the limit
    checkRateLimit(userId, config)
    checkRateLimit(userId, config)

    // Third request should be blocked
    const result = checkRateLimit(userId, config)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after window expires', async () => {
    const userId = 'test-user'
    const config = { maxRequests: 1, windowMs: 100 }

    // Use up the limit
    checkRateLimit(userId, config)

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150))

    // Should allow new request
    const result = checkRateLimit(userId, config)
    expect(result.success).toBe(true)
  })

  it('should handle different endpoints with different limits', () => {
    const userId = 'test-user'

    // AI Chat: 20 requests/minute
    const chatResult = checkRateLimit(`${userId}-chat`, RATE_LIMITS.AI_CHAT)
    expect(chatResult.success).toBe(true)

    // Login: 5 attempts/15 minutes (much stricter)
    const loginResult = checkRateLimit(`${userId}-login`, RATE_LIMITS.LOGIN)
    expect(loginResult.success).toBe(true)

    // Different limits should be enforced separately
    expect(RATE_LIMITS.AI_CHAT.maxRequests).not.toBe(RATE_LIMITS.LOGIN.maxRequests)
  })

  it('should provide correct rate limit headers', () => {
    const userId = 'test-user'
    const config = { maxRequests: 5, windowMs: 60000 }

    const result = checkRateLimit(userId, config)

    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('remaining')
    expect(result).toHaveProperty('resetTime')
    expect(result.limit).toBe(config.maxRequests)
    expect(result.remaining).toBeLessThanOrEqual(config.maxRequests)
  })
})
