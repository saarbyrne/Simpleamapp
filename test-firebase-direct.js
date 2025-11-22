require('dotenv').config();
const admin = require('firebase-admin');

async function testFirebaseAdminSDK() {
  console.log('🧪 Testing Firebase Admin SDK Setup...\n');

  try {
    // Check environment variables
    console.log('1. Checking environment variables...');
    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID',
      'FIREBASE_CLIENT_X509_CERT_URL'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.log(`❌ Missing: ${varName}`);
        return;
      }
      console.log(`✅ ${varName}: ${varName.includes('PRIVATE_KEY') ? '***SET***' : 'present'}`);
    }

    // Test Firebase Admin SDK initialization
    console.log('\n2. Testing Firebase Admin SDK initialization...');

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    console.log('✅ Firebase Admin SDK initialized successfully');

    // Test creating a custom token (without actual user data)
    console.log('\n3. Testing custom token generation...');

    // We'll use a dummy user ID for testing
    const testUserId = 'test-user-123';
    const customToken = await admin.auth().createCustomToken(testUserId, {
      organizationId: 'test-org',
      permissions: ['read'],
    });

    console.log('✅ Custom token generated successfully');
    console.log('Token length:', customToken.length);
    console.log('Token preview:', customToken.substring(0, 50) + '...');

    // Clean up
    await admin.app().delete();
    console.log('✅ Firebase Admin SDK cleaned up');

    console.log('\n🎉 Firebase Admin SDK test completed successfully!');
    console.log('✅ All Firebase authentication components are working');

  } catch (error) {
    console.error('❌ Firebase Admin SDK test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFirebaseAdminSDK();
