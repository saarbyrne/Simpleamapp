const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkThemeColumn() {
  try {
    console.log('Checking if theme column exists in users table...');

    // Try to select a user with the theme field
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        theme: true,
        email: true
      }
    });

    if (user) {
      console.log('✅ Theme column exists!');
      console.log('User ID:', user.id);
      console.log('Theme value:', user.theme);
      console.log('Email:', user.email);
    } else {
      console.log('⚠️  No users found in database');
    }
  } catch (error) {
    console.error('❌ Error accessing theme column:', error.message);
    if (error.message.includes('theme')) {
      console.log('Theme column does not exist in database');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkThemeColumn();