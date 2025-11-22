# Firebase Chat - Quick Start Guide

## 🚀 Get Started in 5 Minutes

Follow these steps to get your Firebase chat system running.

---

## Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/***REMOVED***/settings/general)
2. Scroll to "Your apps" section
3. If you don't see a web app:
   - Click **"Add app"**
   - Select **Web** (</> icon)
   - Name it "SimpleAM Web"
   - Click "Register app"
4. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Step 2: Add Environment Variables

Create or update your `.env.local` file:

```bash
# Firebase Configuration (COPY FROM FIREBASE CONSOLE)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***REMOVED***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***REMOVED***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***REMOVED***.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ Important:** Replace the values with YOUR actual Firebase config values from Step 1.

---

## Step 3: Deploy Firestore Rules

Your Firestore rules are already in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

If you don't have Firebase CLI installed:

```bash
npm install -g firebase-tools
firebase login
```

---

## Step 4: Deploy Storage Rules

```bash
firebase deploy --only storage
```

This deploys the rules in `storage.rules`.

---

## Step 5: Enable Firebase Services

### Enable Authentication:
1. Go to [Firebase Console](https://console.firebase.google.com/project/***REMOVED***/authentication)
2. Click "Get started"
3. Enable "Anonymous" authentication (for now)

### Enable Firestore:
1. Go to [Firestore Database](https://console.firebase.google.com/project/***REMOVED***/firestore)
2. If not enabled, click "Create database"
3. Choose "Start in production mode"
4. Select location: `eur3` (Europe)

### Enable Storage:
1. Go to [Storage](https://console.firebase.google.com/project/***REMOVED***/storage)
2. If not enabled, click "Get started"
3. Start in production mode
4. Choose location: `eur3` (Europe)

---

## Step 6: Restart Your Dev Server

```bash
npm run dev
```

The app will now have access to Firebase credentials.

---

## Step 7: Test the Chat

1. Navigate to: http://localhost:3000/dashboard/chat
2. Click "New Chat"
3. Create a group chat or direct message
4. Send a message
5. Open in another browser tab to see real-time updates

---

## Step 8: Add Navigation Link (Optional)

Add a link to your sidebar/navigation:

```typescript
// In your navigation component
import { ChatNotificationBadge } from '@/components/chat/ChatNotificationBadge';
import { MessageSquare } from 'lucide-react';

<Link href="/dashboard/chat">
  <MessageSquare className="h-5 w-5" />
  Messages
  <ChatNotificationBadge userId={currentUser.id} />
</Link>
```

---

## ✅ You're Done!

Your chat system is now fully functional with:

- ✅ Real-time messaging
- ✅ Group and direct chats
- ✅ File uploads (images, PDFs, documents)
- ✅ Unread message badges
- ✅ Search functionality
- ✅ Mobile responsive design

---

## Next Steps

### Integrate with Your Team Data

Currently, the participant selector uses mock data. To integrate with real data:

**Edit:** `components/chat/CreateChatModal.tsx` (line 38)

Replace:
```typescript
const mockParticipants: Participant[] = [...]
```

With:
```typescript
// Fetch from your API
const { data: teamMembers } = await fetch('/api/team-members');
const availableParticipants = teamMembers.map(member => ({
  id: member.id,
  name: member.name,
  role: member.role,
  avatarUrl: member.avatar,
}));
```

---

## Troubleshooting

### "Firebase configuration not found"
- Check `.env.local` has all variables
- Restart dev server: `npm run dev`

### "Permission denied" in Firestore
- Deploy rules: `firebase deploy --only firestore:rules`
- Verify in Firebase Console > Firestore > Rules tab

### Messages not appearing
- Check Firebase Auth is enabled
- Open browser console for errors
- Verify Firestore is in `eur3` region

### File upload fails
- Deploy storage rules: `firebase deploy --only storage`
- Enable Storage in Firebase Console
- Check Firebase billing plan (Storage requires Blaze plan for production)

---

## Need Help?

1. Check the full integration guide: [FIREBASE_CHAT_INTEGRATION.md](./FIREBASE_CHAT_INTEGRATION.md)
2. Check browser console for errors
3. Verify Firebase Console shows your app registered
4. Test with simple console logs:

```typescript
import { db } from '@/lib/firebase';
console.log('Firebase DB:', db); // Should not be null
```

---

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add all `NEXT_PUBLIC_FIREBASE_*` variables to your hosting provider
2. Redeploy Firestore and Storage rules
3. Enable billing in Firebase (Blaze plan) for Storage
4. Test on production domain

---

That's it! Your chat system is ready to use. 🎉
