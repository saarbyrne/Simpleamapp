import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client Singleton
 * 
 * Note: If you see "Error in PostgreSQL connection: Error { kind: Closed }" errors,
 * these are usually harmless. They occur when:
 * - Supabase connection pooler closes idle connections
 * - Prisma automatically reconnects on the next query
 * 
 * To minimize these errors:
 * 1. Ensure DATABASE_URL uses Supabase transaction pooler (port 6543)
 * 2. Add ?connection_limit=1&pool_timeout=10 to DATABASE_URL for serverless
 * 3. These errors don't affect functionality - Prisma handles reconnection automatically
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add connection test function for debugging
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}
