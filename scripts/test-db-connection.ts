import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n')
    
    // Test 1: Check if we can connect
    console.log('1. Testing connection...')
    await prisma.$connect()
    console.log('   ✅ Connected successfully\n')
    
    // Test 2: Check if tables exist
    console.log('2. Checking if tables exist...')
    const tables = await prisma.$queryRaw<Array<{table_name: string}>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
    console.log(`   ✅ Found ${tables.length} tables:`)
    tables.forEach(t => console.log(`      - ${t.table_name}`))
    console.log('')
    
    // Test 3: Try to query users table
    console.log('3. Testing users table...')
    const userCount = await prisma.user.count()
    console.log(`   ✅ Users table accessible (${userCount} users)\n`)
    
    // Test 4: Try to query organizations table
    console.log('4. Testing organizations table...')
    const orgCount = await prisma.organization.count()
    console.log(`   ✅ Organizations table accessible (${orgCount} organizations)\n`)
    
    console.log('✅ All tests passed! Database is working correctly.')
    
  } catch (error) {
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

