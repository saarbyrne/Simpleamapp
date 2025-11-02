# **Mission**

# **Mission**

#### My missions revolve around long-term vision, innovation and a focus on solving major problems through highly ambitious goals. Key tactics include creating undeniably superior products, breaking down problems with first-principles thinking, and maintaining a lean and fast-paced company culture with intense urgency. By understanding the users goals and the possibilities from technology I can more easily innovate and provide value. Another major factor will always be cost reduction, I will ruthlessly cut costs. Everywhere I can automate I will, as long as its sensible.

#### **Market responsiveness:** Greater control allows companies to be more agile and respond quickly to market demands and shifts in consumer preferences.

#### **Direct-to-consumer sales:** control sales channels by selling directly to consumers through its own showrooms and online stores, bypassing traditional dealerships.

## **Mission: Redefine athlete management**

Athlete management systems like Kitman Labs and teamworks are built on legacy systems and they will take a few years to fully adapt to AI tech. The companies are large and have ingrained processes. Two major opportunities exist

1. To beat these incumbents by offering high quality low cost tools created by a small team using AI. Replicating the current tools and offerings but for less.   
2. Reimagine what sports software should be for athlete management at top sports teams with AI involved

Both of these elements make this market highly open to disruption. 

On top of that both companies have made large acquisitions, Kitman paying for Looker, Teamworks buying several companies. Large deals with leagues have made these organisations soft. 

Contracts are no more than 2/3 years in length. Making the opportunity ripe.   
Cost would be the driving factor. Can I bring down the cost and increase the value for clubs.

# **Product Principles**

## **Principles**

### **Buy over build, build over buy**

What's most cost effective, what's cheaper.

### **Make it modular**

We don't want to rebuild the same tool in multiple areas. Build it once and reuse it. Think Notion for sports teams.

### **Keep it on brand**

Needs to look simple and straightforward.

### **Keep it basic and simple**

Needs to be simple and straightforward.

### **Naming: call it the thing, not the action**

EG Folder, not project. Spreadsheet, not workload. We sell functionality, not product features. User do as they wish with the tools.

### **Abstract as much as possible**

Don't commit to a sport. Things like positions, formations, we need to allow for definition, but not prescribe. This has to be easy to define for the user, we don't do it.

# **Sections**

## **Website**

About  
Offerings  
Community links: Discord, reddit or Whatsapp community for feedback TBD)  
Roadmap 

## **Simple AM App**

Players  
Forms  
Reports  
Calendar  
Notes  
Spreadsheets  
Canvas  
Files  
Planner  
Data Management  
System Settings  
User Profile  
AI  
Templates Hub

## **Administration**

Organisations  
Users  
Template  
Roadmap 

# **Tech stack**

\#\# Technical Stack (Confirmed)  
\- Frontend: Next.js 14+ (App Router)  
\- UI: shadcn/ui \+ Tailwind CSS  
\- Database: Supabase (PostgreSQL)  
\- ORM: Prisma  
\- Auth: Supabase Auth  
\- State: TanStack Query \+ Zustand  
\- Tables: TanStack Table  
\- Forms: React Hook Form \+ Zod  
\- Charts: Recharts  
\- File Storage: Supabase Storage  
\- Email: Resend  
\- Background Jobs: BullMQ \+ Redis  
\`\`\`

# **To Dos**

## **Gaps & Questions**

### **1\. What's Missing from the Doc?**

**System Settings & User Profile** \- You mentioned these but haven't fully documented:

* Organization settings (branding, billing, user management)  
* User profile (account settings, notifications, password)  
* Should I create full specs for these?

**Mobile Strategy** \- You mention "mobile first" but:

* Is there a native mobile app planned, or just responsive web?  
* Which workflows are truly mobile-critical?  
* Progressive Web App (PWA) vs native?

**Authentication Flow** \- Not detailed:

* How do users sign up?  
* Magic links for players (you mentioned) \- full flow?  
* SSO integrations (Google, Microsoft)?

**Onboarding** \- Critical for adoption:

* What does first-time user experience look like?  
* Sample data/templates to get started?  
* Guided setup wizard?

**Search** \- Mentioned but not spec'd:

* Global search across all entities?  
* What's searchable, how's it implemented?

---

### **2\. Technical Questions**

**Database Choice:**

* You mention Supabase \+ Prisma \- correct combo  
* But: Postgres or Supabase's built-in?  
* RLS (Row Level Security) patterns for permissions?

**Real-time Features:**

* Supabase has real-time built-in  
* Which features need live updates?  
* Collaborative editing on spreadsheets/notes?

**File Storage:**

* Supabase Storage is good  
* But for large video files (match footage), need CDN?  
* Compression/processing pipeline?

**Background Jobs:**

* You mention BullMQ \+ Redis  
* What needs to run in background?  
  * Form distribution schedules  
  * Report generation  
  * AI insight calculations  
  * Import jobs  
* Infrastructure for this?

---

### **3\. Business/Go-to-Market Questions**

**Pricing:**

* You mention Free \+ Paid but no details  
* What's in free tier? (Users, storage, features?)  
* Paid tier pricing? ($X/user/month? $X/org/month?)  
* Competitive pricing vs Kitman/Teamworks?

**MVP Scope:**

* Can't build everything at once  
* What's Phase 1 (launch), Phase 2 (3-6 months), Phase 3 (6-12 months)?  
* Which features are must-have vs nice-to-have?

**Target Customer:**

* You say "top sports teams" \- how top?  
* Professional clubs? College/university? Youth academies?  
* Different needs by level?

**Sales Strategy:**

* Direct sales to clubs?  
* Self-service signup?  
* Freemium → upsell?

---

### **4\. Implementation Questions**

**Team:**

* You \+ 1 design/FE \+ 1 backend \+ 1 marketing  
* Is this enough to ship v1?  
* Timeline estimate?

**Development Phases:** You have build estimates per feature:

* Forms: 2 weeks  
* Spreadsheets: 3 weeks  
* Calendar: 2.5 weeks  
* Notes: 1.5 weeks  
* Players: 3 weeks  
* Staff: 2.5 weeks  
* Integrations: 4-6 weeks  
* Reports: 5-6 weeks  
* Planning: 3 weeks  
* Files: 2.5 weeks  
* Drawing Canvas: 2.5 weeks  
* AI: 4 weeks  
* Community Hub: 3.5 weeks

**Total: \~39 weeks (9-10 months) of sequential work**

But with parallel work \+ a small team, what's realistic timeline?

**Design System:**

* You mention shadcn throughout  
* Need full design system first?  
* Who's doing designs?

---

## **What Should We Do Next?**

I can help you with:

1. **Prioritize MVP** \- Cut scope to ship faster  
2. **System Settings \+ User Profile specs** \- Complete the missing sections  
3. **Authentication & Onboarding flows** \- Critical for launch  
4. **Detailed technical architecture** \- Database schema, API structure, deployment  
5. **Phased roadmap** \- What to build when  
6. **Pricing strategy** \- Based on competitor analysis  
7. **Pitch deck** \- For funding (you mentioned this in To Dos)

**What's most urgent for you right now?** Are you:

* Ready to start building?  
* Looking for funding first?  
* Validating with potential customers?  
* Assembling a team?

Let me know and I'll help with the next step.

# **Website**

# **SAM Simple Athlete MAnagement**

# **SimpleAM.app**

## **Dollar shave club for sports teams. The Ryanair of sports software. Low cost airlines.** 

Strong brands, like Ryanair and Dollar Shave Club. Utilise modern production and distribution methods. All online. All subscriptions. Very easy to trial, setup, and use. Ronsela of sports. Does exactly what its says on the tin. 

![][image1]

We are provisioning a set off tools and lots of flexibility but that is easy, intuitive and simple to use.

# **Auth Flow**

\#\# Authentication Flow

\#\#\# New User Signup:  
1\. User signs up with email/password (Supabase Auth)  
2\. Creates first organization (becomes admin)  
3\. Redirected to onboarding

\#\#\# Invitation Flow:  
1\. Admin sends invite email  
2\. New user clicks link → Supabase signup  
3\. Auto-joins org with specified permissions  
4\. Redirected to org

\#\#\# Multi-Org Switching:  
\- User has one account  
\- Dropdown to switch between orgs  
\- UI/data filters by current orgId  
\`\`\`

\#\#\# \*\*5. File/Folder Structure\*\*  
\*\*Missing:\*\*  
\- Project organization  
\- Where files go

\*\*Add:\*\*  
\`\`\`  
\#\# Project Structure  
\`\`\`  
/apps  
  /web (Next.js app)  
    /app  
      /(auth)  
        /login  
        /signup  
      /(dashboard)  
        /players  
        /staff  
        /calendar  
        /forms  
        /notes  
        /spreadsheets  
        /reports  
        /files  
        /planner  
        /canvas  
        /settings  
    /components  
      /ui (shadcn)  
      /players  
      /staff  
      /forms  
      ...  
    /lib  
      /api  
      /db (Prisma client)  
      /utils  
/packages  
  /database (Prisma schema)  
  /ui (shared components)

# **Global search**

# **Social Media / Notifications**

# **Social Media & Messaging Integration Specification**

## **Player Management System**

**Document Version:** 1.0  
 **Date:** November 2, 2025  
 **Purpose:** Complete architecture for integrating WhatsApp, Instagram, and other social platforms

---

## **Table of Contents**

1. System Overview  
2. Architecture & Components  
3. Integration Details by Platform  
4. Authentication & Security  
5. Data Flow Diagrams  
6. Implementation Timeline  
7. Cost Estimates  
8. Risk Mitigation

---

## **1\. System Overview**

### **Purpose**

Enable players to sign up, receive notifications, and engage with the team through their preferred social media and messaging platforms.

### **Primary Use Cases**

* Player registration and onboarding  
* Real-time training/match notifications  
* Schedule changes and updates  
* Team announcements  
* Player feedback collection

### **Platforms in Scope**

* **Primary Communication:** WhatsApp (notifications, direct messaging)  
* **Authentication/Signup:** Instagram, Facebook, Google  
* **Secondary:** Telegram (optional), Email (fallback)

---

## **2\. Architecture & Components**

### **2.1 System Architecture Diagram**

┌─────────────────────────────────────────────────────────────────┐  
│                      PLAYER MANAGEMENT SYSTEM                   │  
├─────────────────────────────────────────────────────────────────┤  
│                                                                 │  
│  ┌──────────────────────────────────────────────────────────┐  │  
│  │              Frontend (Web/Mobile App)                   │  │  
│  │  \- Registration Forms                                    │  │  
│  │  \- Player Dashboard                                      │  │  
│  │  \- Notification Center                                   │  │  
│  └──────────────────────────────────────────────────────────┘  │  
│                           ↓ ↑                                   │  
│  ┌──────────────────────────────────────────────────────────┐  │  
│  │              Backend API Server (Node.js/Python)         │  │  
│  │  \- Player Management                                     │  │  
│  │  \- Authentication Service                                │  │  
│  │  \- Notification Engine                                   │  │  
│  │  \- Social Media Integration Layer                        │  │  
│  └──────────────────────────────────────────────────────────┘  │  
│           ↓ ↑                    ↓ ↑                            │  
│  ┌────────────────────┐  ┌─────────────────┐                   │  
│  │   Database         │  │  Message Queue  │                   │  
│  │   (PostgreSQL)     │  │   (Redis/RabbitMQ)                 │  
│  └────────────────────┘  └─────────────────┘                   │  
│                                                                 │  
│  ┌──────────────────────────────────────────────────────────┐  │  
│  │         Third-Party API Integration Layer               │  │  
│  ├──────────────────────────────────────────────────────────┤  │  
│  │                                                          │  │  
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │  │  
│  │  │  WhatsApp    │  │  Instagram   │  │  Facebook   │   │  │  
│  │  │   Business   │  │   Graph API  │  │  Login SDK  │   │  │  
│  │  │     API      │  │              │  │             │   │  │  
│  │  └──────────────┘  └──────────────┘  └─────────────┘   │  │  
│  │                                                          │  │  
│  │  ┌──────────────┐  ┌──────────────┐                     │  │  
│  │  │   Google     │  │   Telegram   │                     │  │  
│  │  │   OAuth 2.0  │  │     Bot      │                     │  │  
│  │  └──────────────┘  └──────────────┘                     │  │  
│  │                                                          │  │  
│  └──────────────────────────────────────────────────────────┘  │  
│                                                                 │  
└─────────────────────────────────────────────────────────────────┘

### **2.2 Key Components**

| Component | Purpose | Technology |
| ----- | ----- | ----- |
| **Authentication Service** | OAuth 2.0 login via social platforms | Auth0, AWS Cognito, or custom |
| **Notification Engine** | Queue and send notifications across channels | Bull/Redis, RabbitMQ, or AWS SQS |
| **Social Media Adapter** | Abstraction layer for each platform | Custom wrapper classes/modules |
| **Player Service** | Manage player data and preferences | REST API |
| **Message Queue** | Handle async notification delivery | Redis, RabbitMQ, AWS SQS |
| **Webhook Handler** | Receive events from platforms | Express.js/FastAPI middleware |
| **Analytics/Logging** | Track deliveries and engagement | Winston, Datadog, or CloudWatch |

---

## **3\. Integration Details by Platform**

### **3.1 WhatsApp Business API Integration**

**Purpose:** Real-time notifications, direct messaging, schedule updates

**Setup Process:**

1. **Register for WhatsApp Business API**

   * Apply at Meta Business Platform  
   * Provide business verification documents  
   * Set up business account  
   * Wait for approval (5-7 days)  
2. **Get API Credentials**

   * Phone number ID  
   * Business Account ID  
   * Permanent access token  
   * Webhook verification token  
3. **Service Provider Options**

   * Direct Meta API (recommended for scale)  
   * Twilio (simpler setup, higher cost per message)  
   * MessageBird, Vonage, or other BSPs

**Implementation Architecture:**

Player Management System  
        ↓  
Notification Queue (Redis)  
        ↓  
WhatsApp Adapter Module  
        ↓  
Twilio/Meta API  
        ↓  
WhatsApp Servers  
        ↓  
Player Phone

**Code Structure (Example \- Node.js):**

// whatsappService.js  
class WhatsAppService {  
  constructor(apiToken, phoneNumberId) {  
    this.apiToken \= apiToken;  
    this.phoneNumberId \= phoneNumberId;  
    this.baseURL \= 'https://graph.instagram.com/v18.0';  
  }

  async sendNotification(playerPhone, message, mediaUrl \= null) {  
    const payload \= {  
      messaging\_product: 'whatsapp',  
      recipient\_type: 'individual',  
      to: playerPhone,  
      type: mediaUrl ? 'image' : 'text',  
    };

    if (mediaUrl) {  
      payload.image \= { link: mediaUrl };  
    } else {  
      payload.text \= { body: message };  
    }

    return this.makeApiCall(payload);  
  }

  async makeApiCall(payload) {  
    // Implementation details  
  }

  async handleWebhook(event) {  
    // Handle delivery confirmations, read receipts, etc.  
  }  
}

module.exports \= WhatsAppService;

**Notification Types:**

| Type | Example | Template |
| ----- | ----- | ----- |
| **Training Reminder** | "Entrenamiento mañana a las 10am en el campo principal" | Pre-formatted |
| **Schedule Change** | "⚠️ El partido del sábado se TRASLADA al domingo 3pm" | Alert template |
| **Match Result** | "¡Victoria 3-2\! Gran partido equipo 🎉" | Rich media |
| **Admin Message** | "Nueva política de asistencia \- ver app para detalles" | Link included |

**Webhook Handling:**

// POST /webhooks/whatsapp  
app.post('/webhooks/whatsapp', (req, res) \=\> {  
  const data \= req.body;  
    
  if (data.object \=== 'whatsapp\_business\_account') {  
    data.entry\[0\].changes\[0\].value.messages?.forEach(msg \=\> {  
      // Log delivery status  
      // Update player activity  
      // Trigger responses if needed  
    });  
  }  
    
  res.sendStatus(200);  
});

**Message Cost Estimates:**

* Direct Meta API: $0.0025-0.015 per message  
* Twilio: $0.0079 per message  
* Volume pricing available for high-volume teams

---

### **3.2 Instagram & Facebook OAuth Login**

**Purpose:** Social signup/login, player discovery, authentication

**Setup Process:**

1. **Create Meta App**

   * Go to developers.facebook.com  
   * Create new app (type: Consumer)  
   * Add Facebook Login product  
   * Add Instagram Graph API  
2. **Configure OAuth Settings**

   * Set authorized redirect URI  
   * Add app domains  
   * Generate app ID and secret  
3. **Implement OAuth Flow**

**OAuth 2.0 Flow Diagram:**

Player clicks "Sign in with Instagram"  
           ↓  
Redirect to Instagram auth endpoint  
           ↓  
Player grants permissions  
           ↓  
Instagram redirects to your callback URL with auth code  
           ↓  
Your backend exchanges code for access token  
           ↓  
Your backend fetches player profile (name, email, profile pic)  
           ↓  
Create/update player in database  
           ↓  
Issue JWT token to frontend  
           ↓  
Redirect to dashboard

**Implementation (Node.js with Passport.js):**

const passport \= require('passport');  
const InstagramStrategy \= require('passport-instagram').Strategy;

passport.use(new InstagramStrategy({  
    clientID: process.env.INSTAGRAM\_APP\_ID,  
    clientSecret: process.env.INSTAGRAM\_APP\_SECRET,  
    callbackURL: "https://yourdomain.com/auth/instagram/callback"  
  },  
  async (accessToken, refreshToken, profile, done) \=\> {  
    try {  
      // Find or create player  
      let player \= await Player.findOne({   
        socialId: profile.id,  
        provider: 'instagram'  
      });

      if (\!player) {  
        player \= await Player.create({  
          socialId: profile.id,  
          provider: 'instagram',  
          email: profile.\_json.email,  
          username: profile.username,  
          profilePic: profile.\_json.profile\_picture\_url,  
          accessToken: accessToken,  
        });  
      }

      return done(null, player);  
    } catch (err) {  
      return done(err);  
    }  
  }  
));

app.get('/auth/instagram',  
  passport.authenticate('instagram'));

app.get('/auth/instagram/callback',  
  passport.authenticate('instagram', { failureRedirect: '/login' }),  
  (req, res) \=\> {  
    // Generate JWT and redirect to dashboard  
    const token \= generateJWT(req.user);  
    res.redirect(\`/dashboard?token=${token}\`);  
  });

**Permissions Requested:**

{  
  "scopes": \[  
    "user\_profile",  
    "user\_media",  
    "email"  
  \]  
}

**Data Mapping:**

| Instagram Data | Player Field | Usage |
| ----- | ----- | ----- |
| `id` | `socialId` | Unique identifier |
| `username` | `username` | Display name |
| `name` | `fullName` | Optional |
| `email` | `email` | Contact |
| `profile_picture_url` | `profilePicture` | Avatar |

---

### **3.3 Google OAuth Login**

**Purpose:** Alternative signup method, easy account recovery

**Setup Process:**

1. **Create Google Cloud Project**

   * Go to console.cloud.google.com  
   * Create OAuth 2.0 credentials (Web application)  
   * Add authorized redirect URIs  
2. **Implementation:**

const GoogleStrategy \= require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({  
    clientID: process.env.GOOGLE\_CLIENT\_ID,  
    clientSecret: process.env.GOOGLE\_CLIENT\_SECRET,  
    callbackURL: "https://yourdomain.com/auth/google/callback"  
  },  
  async (accessToken, refreshToken, profile, done) \=\> {  
    let player \= await Player.findOne({   
      email: profile.emails\[0\].value   
    });

    if (\!player) {  
      player \= await Player.create({  
        email: profile.emails\[0\].value,  
        fullName: profile.displayName,  
        provider: 'google',  
        socialId: profile.id,  
        profilePic: profile.photos\[0\].value,  
      });  
    }

    return done(null, player);  
  }  
));

---

### **3.4 Telegram Bot (Optional)**

**Purpose:** Alternative notification channel, player polling, coaching tools

**Setup:**

1. **Create Bot via BotFather**

   * Message @BotFather on Telegram  
   * Create new bot  
   * Get bot token  
2. **Implementation:**

const TelegramBot \= require('node-telegram-bot-api');  
const token \= process.env.TELEGRAM\_BOT\_TOKEN;  
const bot \= new TelegramBot(token, { polling: true });

// Send notification  
async function sendTelegramNotification(chatId, message) {  
  await bot.sendMessage(chatId, message, {  
    parse\_mode: 'HTML',  
    reply\_markup: {  
      inline\_keyboard: \[  
        \[{ text: 'Ver Detalles', callback\_data: 'view\_details' }\]  
      \]  
    }  
  });  
}

// Handle commands  
bot.onText(/\\/start/, async (msg) \=\> {  
  const chatId \= msg.chat.id;  
  const player \= await Player.findOne({ telegramId: msg.from.id });  
    
  if (\!player) {  
    await bot.sendMessage(chatId,   
      'Por favor, regístrate en la app para usar este bot');  
  }  
});

---

## **4\. Authentication & Security**

### **4.1 Data Protection**

**Storage:**

* Social access tokens: encrypted in database using AES-256  
* Player phone numbers: hashed for WhatsApp lookups  
* Personal data: encrypted at rest

**Example (Node.js):**

const crypto \= require('crypto');

function encryptToken(token) {  
  const cipher \= crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION\_KEY);  
  let encrypted \= cipher.update(token, 'utf8', 'hex');  
  encrypted \+= cipher.final('hex');  
  return encrypted;  
}

function decryptToken(encrypted) {  
  const decipher \= crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION\_KEY);  
  let decrypted \= decipher.update(encrypted, 'hex', 'utf8');  
  decrypted \+= decipher.final('utf8');  
  return decrypted;  
}

### **4.2 API Security**

**Rate Limiting:**

* WhatsApp: 80 messages/second per phone number  
* Instagram: 200 requests/hour per user token  
* Implement queue system to respect limits

**Example:**

const rateLimit \= require('express-rate-limit');

const whatsappLimiter \= rateLimit({  
  windowMs: 15 \* 60 \* 1000,  
  max: 100, // requests per windowMs  
  keyGenerator: (req) \=\> req.body.playerPhone  
});

app.post('/send-notification', whatsappLimiter,   
  sendNotificationHandler);

### **4.3 Permissions & Consent**

**GDPR Compliance:**

* Store explicit consent for each notification channel  
* Allow players to opt-out per channel  
* Maintain audit logs of all communications

**Database Schema:**

CREATE TABLE player\_preferences (  
  id UUID PRIMARY KEY,  
  player\_id UUID NOT NULL,  
  channel VARCHAR(50),  
  opted\_in BOOLEAN DEFAULT true,  
  consent\_date TIMESTAMP,  
  created\_at TIMESTAMP,  
  FOREIGN KEY (player\_id) REFERENCES players(id)  
);

\-- Example rows:  
\-- (uuid1, player1, 'whatsapp', true, 2025-11-02)  
\-- (uuid2, player1, 'instagram\_dm', false, 2025-11-02)  
\-- (uuid3, player1, 'telegram', true, 2025-11-02)

### **4.4 Webhook Verification**

**WhatsApp Webhook Security:**

app.post('/webhooks/whatsapp', (req, res) \=\> {  
  const signature \= req.headers\['x-hub-signature-256'\];  
  const body \= req.rawBody; // Must be raw, not parsed  
    
  const hash \= 'sha256=' \+ crypto  
    .createHmac('sha256', process.env.WHATSAPP\_APP\_SECRET)  
    .update(body)  
    .digest('hex');  
    
  if (hash \!== signature) {  
    return res.sendStatus(403);  
  }  
    
  // Process webhook  
  res.sendStatus(200);  
});

---

## **5\. Data Flow Diagrams**

### **5.1 Player Registration Flow**

┌─────────────┐  
│ Player App  │  
└──────┬──────┘  
       │ 1\. Click "Sign up with Instagram"  
       ↓  
┌─────────────────────┐  
│ Frontend (React)    │  
└──────┬──────────────┘  
       │ 2\. Redirect to OAuth endpoint  
       ↓  
┌─────────────────────┐  
│ Instagram Server    │  
└──────┬──────────────┘  
       │ 3\. Player grants permissions  
       ↓  
┌──────────────────────────┐  
│ Backend /auth/callback   │  
└──────┬───────────────────┘  
       │ 4\. Exchange code for token  
       ↓  
┌──────────────────────────┐  
│ Database \- Create Player │  
└──────┬───────────────────┘  
       │ 5\. Issue JWT token  
       ↓  
┌─────────────┐  
│ Player App  │ \- Ready to use  
└─────────────┘

### **5.2 Notification Sending Flow**

Admin Dashboard  
       │ 1\. Create notification  
       ↓  
┌──────────────────┐  
│ Notification API │ POST /notifications  
└────────┬─────────┘  
         │ 2\. Validate \+ store in DB  
         ↓  
┌──────────────────────────┐  
│ Message Queue (Redis)    │ Job ID: notif\_12345  
└────────┬─────────────────┘  
         │ 3\. Queue workers process  
         ↓ (async)  
    ┌────┴───┬────────┬─────────┐  
    ↓        ↓        ↓         ↓  
 WhatsApp  Telegram Email   In-App  
 Service   Service  Service Service  
    │        │        │         │  
    ↓        ↓        ↓         ↓  
Players receive notifications across channels

### **5.3 Preference Management Flow**

Player Dashboard  
       │ Updates preferences  
       ↓  
┌────────────────────────┐  
│ PATCH /preferences     │  
│ { whatsapp: false,     │  
│   telegram: true }     │  
└────────┬───────────────┘  
         │  
         ↓  
┌──────────────────────────┐  
│ Verify authentication    │  
└────────┬─────────────────┘  
         │  
         ↓  
┌──────────────────────────┐  
│ Update player\_preferences│  
│ table in DB              │  
└────────┬─────────────────┘  
         │  
         ↓  
┌──────────────────────────┐  
│ Return confirmation      │  
└────────┬─────────────────┘  
         │  
         ↓  
Player sees "Preferences Updated"  
Future notifications respect new settings

---

## **6\. Implementation Timeline**

### **Phase 1: Foundation (Weeks 1-2)**

* Set up backend API structure  
* Implement local authentication (username/password)  
* Set up database schema  
* Create admin dashboard scaffold

### **Phase 2: Social Login (Weeks 3-4)**

* Implement Instagram OAuth  
* Implement Google OAuth  
* Add social profile mapping  
* Test login flows

### **Phase 3: WhatsApp Integration (Weeks 5-7)**

* Apply for WhatsApp Business API  
* Implement WhatsApp adapter  
* Set up message queue  
* Build notification templates  
* Implement webhook handling

### **Phase 4: Additional Channels (Weeks 8-9)**

* Integrate Telegram bot  
* Set up email service  
* Add in-app notifications  
* Implement preference management

### **Phase 5: Testing & Deployment (Weeks 10-12)**

* End-to-end testing  
* Load testing  
* Security audit  
* Production deployment

---

## **7\. Cost Estimates (Monthly, 100 Active Players)**

| Service | Cost | Notes |
| ----- | ----- | ----- |
| **WhatsApp** | $0-50 | Depends on message volume (assuming \~500 msgs/month) |
| **Twilio** (if using) | $40-100 | Higher cost but simpler setup |
| **Server hosting** | $50-150 | AWS/DigitalOcean |
| **Database** | $10-30 | PostgreSQL managed |
| **Message queue** | $0-20 | Redis cloud or self-hosted |
| **Storage** | $5-10 | S3 for media |
| **SSL Certificate** | $0 | Let's Encrypt (free) |
| **Domain** | $10-15 | Annual |
| **Total** | \~$125-375/month | Scales with player count |

**For 500+ Players:** Consider enterprise pricing with Meta and volume discounts.

---

## **8\. Risk Mitigation**

### **8.1 Potential Issues & Solutions**

| Risk | Probability | Impact | Mitigation |
| ----- | ----- | ----- | ----- |
| **WhatsApp account banned** | Medium | Critical | Follow meta guidelines strictly, monitor account health, have support team |
| **API rate limits exceeded** | Medium | High | Implement robust queue system, monitor usage, implement backoff strategy |
| **Player data breach** | Low | Critical | Encrypt sensitive data, regular security audits, compliance with local laws |
| **Integration downtime** | Medium | High | Health checks, fallback to email, monitoring & alerts (Datadog/New Relic) |
| **Poor message delivery** | Medium | Medium | Implement retry logic, delivery confirmations, fallback channels |
| **Players opt-out quickly** | High | Medium | Craft relevant messages, respect preferences, provide value |

### **8.2 Monitoring & Alerting**

**Key Metrics to Track:**

// Example monitoring setup  
const prometheus \= require('prom-client');

const messagesSent \= new prometheus.Counter({  
  name: 'messages\_sent\_total',  
  help: 'Total messages sent',  
  labelNames: \['channel', 'status'\]  
});

const deliveryTime \= new prometheus.Histogram({  
  name: 'message\_delivery\_seconds',  
  help: 'Time to deliver message',  
  labelNames: \['channel'\]  
});

// Track failures  
const deliveryFailures \= new prometheus.Counter({  
  name: 'delivery\_failures\_total',  
  help: 'Failed message deliveries',  
  labelNames: \['channel', 'reason'\]  
});

**Alert Rules:**

* Delivery failure rate \> 5%  
* Queue size \> 10,000 messages  
* API response time \> 2 seconds  
* WhatsApp account health score \< 80%

---

## **9\. Database Schema**

\-- Players table  
CREATE TABLE players (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  email VARCHAR(255) UNIQUE,  
  phone\_number VARCHAR(20),  
  full\_name VARCHAR(255),  
  username VARCHAR(255),  
  profile\_picture\_url TEXT,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Social accounts linked to players  
CREATE TABLE social\_accounts (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  player\_id UUID NOT NULL,  
  provider VARCHAR(50), \-- 'instagram', 'google', 'facebook'  
  social\_id VARCHAR(255),  
  access\_token TEXT ENCRYPTED,  
  refresh\_token TEXT ENCRYPTED,  
  created\_at TIMESTAMP,  
  FOREIGN KEY (player\_id) REFERENCES players(id),  
  UNIQUE(player\_id, provider)  
);

\-- Player communication preferences  
CREATE TABLE player\_preferences (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  player\_id UUID NOT NULL,  
  channel VARCHAR(50), \-- 'whatsapp', 'telegram', 'email', 'instagram\_dm'  
  opted\_in BOOLEAN DEFAULT true,  
  consent\_date TIMESTAMP,  
  created\_at TIMESTAMP,  
  updated\_at TIMESTAMP,  
  FOREIGN KEY (player\_id) REFERENCES players(id)  
);

\-- Notifications sent  
CREATE TABLE notifications (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  admin\_id UUID,  
  title VARCHAR(255),  
  content TEXT,  
  type VARCHAR(50), \-- 'training', 'match', 'schedule\_change', 'announcement'  
  scheduled\_for TIMESTAMP,  
  created\_at TIMESTAMP,  
  FOREIGN KEY (admin\_id) REFERENCES admins(id)  
);

\-- Notification delivery tracking  
CREATE TABLE notification\_deliveries (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  notification\_id UUID,  
  player\_id UUID,  
  channel VARCHAR(50),  
  status VARCHAR(50), \-- 'pending', 'sent', 'delivered', 'failed', 'read'  
  provider\_message\_id VARCHAR(255),  
  error\_message TEXT,  
  sent\_at TIMESTAMP,  
  delivered\_at TIMESTAMP,  
  read\_at TIMESTAMP,  
  FOREIGN KEY (notification\_id) REFERENCES notifications(id),  
  FOREIGN KEY (player\_id) REFERENCES players(id)  
);

\-- Webhook logs (for debugging)  
CREATE TABLE webhook\_logs (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  provider VARCHAR(50),  
  event\_type VARCHAR(100),  
  payload JSONB,  
  processed\_at TIMESTAMP,  
  status VARCHAR(50)  
);

---

## **10\. Environment Variables Template**

\# WhatsApp Configuration  
WHATSAPP\_BUSINESS\_PHONE\_ID=1234567890123456  
WHATSAPP\_BUSINESS\_ACCOUNT\_ID=1234567890123456  
WHATSAPP\_ACCESS\_TOKEN=your\_access\_token\_here  
WHATSAPP\_APP\_SECRET=your\_app\_secret\_here

\# Instagram/Facebook OAuth  
INSTAGRAM\_APP\_ID=your\_app\_id  
INSTAGRAM\_APP\_SECRET=your\_app\_secret  
INSTAGRAM\_REDIRECT\_URI=https://yourdomain.com/auth/instagram/callback

\# Google OAuth  
GOOGLE\_CLIENT\_ID=your\_client\_id  
GOOGLE\_CLIENT\_SECRET=your\_client\_secret  
GOOGLE\_REDIRECT\_URI=https://yourdomain.com/auth/google/callback

\# Telegram  
TELEGRAM\_BOT\_TOKEN=your\_bot\_token

\# Database  
DATABASE\_URL=postgresql://user:password@localhost/player\_management

\# Redis (Message Queue)  
REDIS\_URL=redis://localhost:6379

\# Encryption  
ENCRYPTION\_KEY=your\_256\_bit\_key\_in\_hex

\# JWT  
JWT\_SECRET=your\_jwt\_secret\_key  
JWT\_EXPIRY=7d

\# Server  
NODE\_ENV=production  
PORT=3000  
DOMAIN=yourdomain.com

---

## **11\. Next Steps**

1. **Immediate (This week):**

   * Choose between Twilio and direct Meta API for WhatsApp  
   * Register for Instagram App  
   * Create Google Cloud project  
   * Set up development environment  
2. **Short-term (Next 2 weeks):**

   * Deploy backend skeleton  
   * Implement database  
   * Build OAuth flows  
   * Create admin dashboard mock  
3. **Medium-term (Weeks 3-6):**

   * Full WhatsApp integration  
   * Testing with test players  
   * Performance optimization  
   * Security review

# **Players**

## **Players \- Full Picture**

### **What Players Section Does**

1. **Squad list** \- view all players in the org  
2. **Individual profiles** \- bio, stats, contact info, tags  
3. **Activity hub** \- all data related to this player in one place  
4. **View history** \- forms, events, spreadsheets, notes, files linked to them  
5. **Quick actions** \- send form, add note, mark attendance  
6. **Flexible organization** \- filter by tag, position, team, status  
7. **Cross-org linking** \- same player across multiple orgs (data sharing)

---

### **Tech Stack**

* **TanStack Table** \- for squad list/roster view  
* **Custom profile view** \- tabbed interface (similar to Event detail)  
* **shadcn components** \- forms, cards, tabs, badges  
* **Search/filter** \- built with TanStack Table features

---

### **Two Views**

### **1\. Squad List (Roster)**

Table view of all players in org:

\<SquadList\>  
  \<Toolbar\>  
    \<Search placeholder="Search players..." /\>  
    \<FilterSelect label="Position"\>  
      \<option\>All\</option\>  
      \<option\>Goalkeeper\</option\>  
      \<option\>Defender\</option\>  
      \<option\>Midfielder\</option\>  
      \<option\>Forward\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>Available\</option\>  
      \<option\>Injured\</option\>  
      \<option\>Suspended\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Tags"\>  
      \<option\>All\</option\>  
      \<option\>First Team\</option\>  
      \<option\>Academy\</option\>  
      \<option\>U23\</option\>  
    \</FilterSelect\>  
    \<Button\>+ Add Player\</Button\>  
  \</Toolbar\>  
    
  \<Table\>  
    \<thead\>  
      \<tr\>  
        \<th\>Name\</th\>  
        \<th\>Position\</th\>  
        \<th\>Age\</th\>  
        \<th\>Status\</th\>  
        \<th\>Tags\</th\>  
        \<th\>Last Form\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {players.map(player \=\> (  
        \<tr onClick={() \=\> openProfile(player.id)}\>  
          \<td\>  
            \<Avatar src={player.photo} /\>  
            {player.name}  
          \</td\>  
          \<td\>{player.position}\</td\>  
          \<td\>{calculateAge(player.dob)}\</td\>  
          \<td\>\<Badge variant={player.status}\>{player.status}\</Badge\>\</td\>  
          \<td\>{player.tags.map(t \=\> \<Tag\>{t}\</Tag\>)}\</td\>  
          \<td\>{player.lastFormDate}\</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item\>View Profile\</Item\>  
              \<Item\>Send Form\</Item\>  
              \<Item\>Add Note\</Item\>  
              \<Item\>View in Spreadsheets\</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</Table\>  
\</SquadList\>

**Features:**

* Sort by any column  
* Filter by position, status, tags, team  
* Search by name  
* Bulk actions (send form to selected players)  
* Export to CSV  
* Card view alternative (for visual squad display)

---

### **2\. Player Profile (Individual View)**

Detailed view of one player \- **everything about them in one place:**

\<PlayerProfile\>  
  \<Header\>  
    \<Avatar large src={player.photo} /\>  
    \<div\>  
      \<h1\>{player.name}\</h1\>  
      \<p\>\#{player.number} · {player.position}\</p\>  
      \<StatusBadge\>{player.status}\</StatusBadge\>  
      {player.tags.map(t \=\> \<Tag\>{t}\</Tag\>)}  
    \</div\>  
    \<QuickActions\>  
      \<Button\>Send Form\</Button\>  
      \<Button\>Add Note\</Button\>  
      \<Button\>Edit Profile\</Button\>  
      \<Button\>View Across Orgs\</Button\> {/\* if cross-org linked \*/}  
    \</QuickActions\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Overview"\>  
      \<Bio\>  
        \<Field label="Date of Birth"\>{player.dob}\</Field\>  
        \<Field label="Age"\>{calculateAge(player.dob)}\</Field\>  
        \<Field label="Height"\>{player.height}\</Field\>  
        \<Field label="Weight"\>{player.weight}\</Field\>  
        \<Field label="Email"\>{player.email}\</Field\>  
        \<Field label="Phone"\>{player.phone}\</Field\>  
        \<Field label="Emergency Contact"\>{player.emergencyContact}\</Field\>  
      \</Bio\>  
        
      \<RecentActivity\>  
        \<h3\>Recent Activity\</h3\>  
        \- Completed wellness form (2 hours ago)  
        \- Attended Training Session (today)  
        \- Match vs Chelsea (yesterday)  
      \</RecentActivity\>  
    \</Tab\>  
      
    \<Tab label="Forms"\>  
      \<FormResponses\>  
        \<FilterBar\>  
          \<Select label="Form Type"\>  
            \<option\>All\</option\>  
            \<option\>Wellness\</option\>  
            \<option\>Injury Report\</option\>  
            \<option\>Match Readiness\</option\>  
          \</Select\>  
          \<DateRange /\>  
        \</FilterBar\>  
          
        \<ResponseList\>  
          \- Daily Wellness (Jan 15\) \- Sleep: 8/10, Soreness: 3/10  
          \- Daily Wellness (Jan 14\) \- Sleep: 7/10, Soreness: 4/10  
          \- Injury Report (Jan 10\) \- Left ankle soreness  
        \</ResponseList\>  
          
        \<Button\>Export to Spreadsheet\</Button\>  
      \</FormResponses\>  
    \</Tab\>  
      
    \<Tab label="Events"\>  
      \<EventHistory\>  
        \<FilterBar\>  
          \<Select label="Event Type"\>  
            \<option\>All\</option\>  
            \<option\>Training\</option\>  
            \<option\>Match\</option\>  
            \<option\>Medical\</option\>  
          \</Select\>  
          \<DateRange /\>  
        \</FilterBar\>  
          
        \<EventList\>  
          \- Training Session (Jan 15\) \- Attended  
          \- Match vs Chelsea (Jan 14\) \- Started, 90 mins  
          \- Training Session (Jan 13\) \- Attended  
          \- Match vs Arsenal (Jan 7\) \- Injured (did not play)  
        \</EventList\>  
          
        \<AttendanceStats\>  
          \<Stat label="Attendance Rate"\>94%\</Stat\>  
          \<Stat label="Training Sessions"\>45/48\</Stat\>  
          \<Stat label="Matches Played"\>18/20\</Stat\>  
        \</AttendanceStats\>  
      \</EventHistory\>  
    \</Tab\>  
      
    \<Tab label="Performance"\>  
      \<PerformanceData\>  
        {/\* Data from spreadsheets where this player appears \*/}  
          
        \<Section\>  
          \<h3\>Load Tracking\</h3\>  
          \<Chart type="line" data={loadData} /\>  
          \<p\>Average weekly load: 3,200 AU\</p\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Wellness Trends\</h3\>  
          \<Chart type="line" data={wellnessData} /\>  
          \<p\>Average sleep: 7.5 hours\</p\>  
          \<p\>Average soreness: 3.2/10\</p\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Match Stats (This Season)\</h3\>  
          \<Stats\>  
            \<Stat label="Goals"\>12\</Stat\>  
            \<Stat label="Assists"\>8\</Stat\>  
            \<Stat label="Minutes"\>1,620\</Stat\>  
          \</Stats\>  
        \</Section\>  
          
        \<Button\>View in Reports\</Button\>  
      \</PerformanceData\>  
    \</Tab\>  
      
    \<Tab label="Notes"\>  
      \<Notes\>  
        \<FilterBar\>  
          \<Select label="Visibility"\>  
            \<option\>All I Can See\</option\>  
            \<option\>Public\</option\>  
            \<option\>Medical Only\</option\>  
            \<option\>My Private Notes\</option\>  
          \</Select\>  
          \<Select label="Author"\>  
            {/\* Filter by who wrote note \*/}  
          \</Select\>  
          \<TagFilter /\>  
        \</FilterBar\>  
          
        \<NotesList\>  
          {/\* All notes attached to this player \*/}  
          {/\* User only sees notes they have permission for \*/}  
            
          \<NoteCard\>  
            \<NoteHeader\>  
              \<Author\>Dr. Smith (Medical)\</Author\>  
              \<Badge\>Medical Only\</Badge\>  
              \<Time\>2 days ago\</Time\>  
            \</NoteHeader\>  
            \<Content\>  
              Left ankle responding well to treatment.   
              Cleared for full training.  
            \</Content\>  
            \<Tags\>  
              \<Tag\>injury\</Tag\>  
              \<Tag\>recovery\</Tag\>  
            \</Tags\>  
          \</NoteCard\>  
            
          \<NoteCard\>  
            \<NoteHeader\>  
              \<Author\>Coach Johnson\</Author\>  
              \<Badge\>Public\</Badge\>  
              \<Time\>5 days ago\</Time\>  
            \</NoteHeader\>  
            \<Content\>  
              Excellent performance in training.   
              Sharp finishing, good movement off the ball.  
            \</Content\>  
            \<Tags\>  
              \<Tag\>training\</Tag\>  
              \<Tag\>performance\</Tag\>  
            \</Tags\>  
          \</NoteCard\>  
        \</NotesList\>  
          
        \<Button\>+ Add Note\</Button\>  
      \</Notes\>  
    \</Tab\>  
      
    \<Tab label="Files"\>  
      \<FilesList\>  
        \<FilterBar\>  
          \<Select label="File Type"\>  
            \<option\>All\</option\>  
            \<option\>Documents\</option\>  
            \<option\>Images\</option\>  
            \<option\>Videos\</option\>  
          \</Select\>  
        \</FilterBar\>  
          
        \<Files\>  
          \- Medical\_Clearance.pdf (Jan 10\)  
          \- Training\_Highlights.mp4 (Jan 8\)  
          \- Contract\_2025.pdf (Dec 15\)  
        \</Files\>  
          
        \<Button\>+ Upload File\</Button\>  
      \</FilesList\>  
    \</Tab\>  
      
    \<Tab label="Spreadsheets"\>  
      \<LinkedSpreadsheets\>  
        {/\* All spreadsheets where this player has data \*/}  
          
        \<SpreadsheetList\>  
          \- Weekly Load Tracking (50 entries)  
          \- Match Stats 2024/25 (18 matches)  
          \- Injury Log (3 entries)  
          \- GPS Data (45 sessions)  
        \</SpreadsheetList\>  
          
        \<Button\>View All in Spreadsheets Section\</Button\>  
      \</LinkedSpreadsheets\>  
    \</Tab\>  
      
    \<Tab label="Cross-Org"\>  
      {/\* If player is linked to other orgs \*/}  
        
      {player.linkedPersonId && (  
        \<CrossOrgData\>  
          \<h3\>This player also plays for:\</h3\>  
            
          \<LinkedOrgs\>  
            \<OrgCard\>  
              \<h4\>England National Team\</h4\>  
              \<p\>Data sharing: Active\</p\>  
              \<Button\>View England Data\</Button\>  
            \</OrgCard\>  
          \</LinkedOrgs\>  
            
          \<DataSharingStatus\>  
            \<h4\>Shared Data\</h4\>  
            \<p\>✓ Wellness data\</p\>  
            \<p\>✓ Injury history\</p\>  
            \<p\>✓ Load tracking\</p\>  
            \<p\>✗ Internal notes\</p\>  
          \</DataSharingStatus\>  
            
          \<CombinedView\>  
            \<h4\>Combined Performance View\</h4\>  
            {/\* Shows both Man United \+ England data \*/}  
            \<Chart data={combinedData} /\>  
          \</CombinedView\>  
        \</CrossOrgData\>  
      )}  
    \</Tab\>  
  \</Tabs\>  
\</PlayerProfile\>

---

### **Data Model**

model Person {  
  id       String @id  
  orgId    String  
    
  // Basic info  
  name     String  
  role     String // "player" (for this section)  
  email    String?  
  phone    String?  
    
  // Player-specific fields  
  dob      DateTime?  
  height   Int?  
  weight   Int?  
  position String? // user-defined, not prescribed  
  number   Int?  
  status   String? // "available", "injured", "suspended"  
  photo    String?  
    
  // Emergency contact  
  emergencyContact Json? // {name, phone, relationship}  
    
  // Organization  
  tags     String\[\] // "first\_team", "academy", "u23"  
    
  // Cross-org linking  
  linkedPersonId String? // links to same player in other org  
    
  // Relations  
  formResponses  FormResponse\[\]  
  events         Event\[\]  
  attendance     EventAttendance\[\]  
  notes          Note\[\]  
  files          File\[\]  
  spreadsheetRows SpreadsheetRow\[\] // where this player has data  
    
  createdAt DateTime  
  updatedAt DateTime  
}

---

### **Adding a Player**

\<AddPlayerForm\>  
  \<Input label="Name" required /\>  
  \<Input label="Position" placeholder="e.g., Forward, Midfielder" /\>  
  \<Input label="Number" type="number" /\>  
  \<DatePicker label="Date of Birth" /\>  
  \<Input label="Height (cm)" type="number" /\>  
  \<Input label="Weight (kg)" type="number" /\>  
  \<Input label="Email" type="email" /\>  
  \<Input label="Phone" /\>  
    
  \<TagInput label="Tags" placeholder="Add tags..." /\>  
    
  \<Select label="Status"\>  
    \<option\>Available\</option\>  
    \<option\>Injured\</option\>  
    \<option\>Suspended\</option\>  
  \</Select\>  
    
  \<FileUpload label="Photo" accept="image/\*" /\>  
    
  \<Button\>Add Player\</Button\>  
\</AddPlayerForm\>

**Optional: Import from CSV** (bulk add players)

---

### **Quick Actions from List**

**Send Form:**

* Select players from list  
* Click "Send Form"  
* Choose form (or create new)  
* Set distribution (now, scheduled, recurring)  
* Send

**Bulk Tagging:**

* Select players  
* Add/remove tags  
* Update positions  
* Change status

**Export:**

* Export selected players to CSV  
* Include: basic info, tags, recent form data

---

### **Cross-Org Player View**

When viewing player linked to another org:

\<CombinedPlayerView\>  
  \<OrgToggle\>  
    \<Tab active\>Manchester United\</Tab\>  
    \<Tab\>England National Team\</Tab\>  
    \<Tab\>Combined View\</Tab\>  
  \</OrgToggle\>  
    
  {/\* Same profile structure, but data filtered by selected org \*/}  
\</CombinedPlayerView\>

**Combined View shows:**

* All wellness data (both orgs)  
* All events (both orgs)  
* All notes (where sharing permitted)  
* Unified timeline

---

### **Performance Data Aggregation**

**Profile automatically queries:**

* Form responses where `personId = player.id`  
* Events where `player in attendees`  
* Spreadsheet rows where `data.player = player.id`  
* Notes where `attachedToId = player.id && attachedToType = "person"`  
* Files where linked to player

**Displays:**

* Charts/trends (wellness, load, etc.)  
* Attendance stats  
* Recent activity timeline

---

### **AI Integration**

User: "AI, summarize Marcus's performance this month"

AI:  
1\. Queries all data for Marcus (forms, events, spreadsheets, notes)  
2\. Analyzes trends  
3\. Returns: "Marcus has maintained high training attendance (95%).   
   Wellness scores trending down slightly (avg 7/10 vs 8/10 last month).   
   Load within normal range. No injury concerns noted in medical notes."

User: "AI, which players need a wellness check?"

AI:  
1\. Queries all players  
2\. Checks last form submission date  
3\. Returns: "7 players haven't completed wellness form in 48 hours:   
   \[list of players\]"

User viewing player profile: "AI, should I rest this player?"

AI:  
1\. Analyzes player's recent load data  
2\. Reviews wellness scores  
3\. Checks attendance  
4\. Returns: "Recommend monitoring. Load slightly elevated (10% above average).   
   Sleep quality declining (6/10 last 3 days). Consider light training."

---

### **Reporting on Players**

**Reports can query player data:**

* Squad-wide wellness trends  
* Load distribution across players  
* Injury rates by position  
* Attendance by tag (first team vs academy)  
* Performance correlations (load vs wellness, attendance vs match performance)

---

### **Mobile Considerations**

**Squad list:**

* Card view (easier than table on mobile)  
* Quick filters (dropdowns)  
* Tap to view profile

**Player profile:**

* Condensed tabs (swipe between)  
* Priority: Forms, Events, Notes  
* Performance charts simplified

---

### **Styling with shadcn**

* TanStack Table styled with shadcn  
* Profile tabs \= shadcn Tabs component  
* Cards \= shadcn Card component  
* Badges, buttons, inputs \= all shadcn

Full visual consistency.

---

### **Build Effort**

**Squad list:** 3-4 days

* TanStack Table setup  
* Filters/search  
* Bulk actions

**Player profile:** 1.5-2 weeks

* Tabbed interface  
* Query/aggregate all player data  
* Performance charts  
* Cross-org view

**Add/edit player:** 2-3 days

* Form with validation  
* Photo upload  
* CSV import

**Total: \~3 weeks for full Players section**

---

**That's players. Clear?**

# **Notes**

## **Notes \- Full Picture**

### **What Notes Do**

1. **Users create notes** \- coaches, doctors, physios, psychologists, sports scientists  
2. **Flexible privacy** \- public (org-wide), role-specific (medical only), or private (only author)  
3. **Link to entities** \- attach to people, events, injuries, reports, anywhere  
4. **Rich text** \- formatting, lists, links, images  
5. **Collaborative** \- multiple people can add notes to same entity  
6. **Searchable** \- find notes by content, author, date, linked entity  
7. **Reportable** \- aggregate notes, sentiment analysis, patterns

---

### **Tech Stack**

* **Tiptap** (free, MIT) \- modern rich text editor  
  * Extensible  
  * Markdown shortcuts  
  * Collaborative editing (optional)  
  * Custom extensions (mentions, tags)  
* **Alternative:** Lexical (Meta's editor, also free)

---

### **Privacy Levels**

**Public** \- visible to everyone in org **Role-specific** \- only visible to users with specific role

* Medical only  
* Mental health only  
* Coaching staff only **Private** \- only visible to author

model Note {  
  id          String @id  
  orgId       String  
  title       String?  
  content     Json // Tiptap document format  
    
  // Privacy  
  visibility  String // "public", "medical", "mental\_health", "coaches", "private"  
  authorId    String  
  author      User @relation  
    
  // What is this note attached to?  
  attachedToType String? // "person", "event", "injury", "report"  
  attachedToId   String?  
    
  // Or standalone  
  isStandalone Boolean @default(false)  
    
  // Tags for organization  
  tags        String\[\]  
    
  createdAt   DateTime  
  updatedAt   DateTime  
}

---

### **User Flow**

### **Scenario 1: Add Note to Player**

1. User views Marcus Rashford's profile  
2. Clicks "Add Note"  
3. Writes: "Showed great energy in training, but still favoring left ankle"  
4. Sets visibility: "Medical only"  
5. Saves  
6. Note appears in Marcus's profile (only medical staff see it)

### **Scenario 2: Coach Observations During Event**

1. Event: "Training Session \- Jan 15"  
2. Coach clicks Notes tab  
3. Adds note: "Work on passing accuracy with midfielders"  
4. Sets visibility: "Public"  
5. All staff can see this note in event

### **Scenario 3: Psychologist Private Notes**

1. Psychologist meets with player  
2. Adds note to player profile  
3. Writes session notes  
4. Sets visibility: "Private"  
5. Only psychologist can see this note

### **Scenario 4: Standalone Note**

1. User: "Create Note" (not attached to anything)  
2. Writes general observation or idea  
3. Tags: "tactics", "set-pieces"  
4. Can link to entity later

---

### **Note Types (User-Defined)**

Notes don't have prescribed types, but users might create patterns:

* Training observations  
* Match analysis  
* Medical assessments  
* Psychological sessions  
* Tactical ideas  
* Player development notes

**Tags organize notes** instead of rigid types.

---

### **Linking Notes**

**Notes can be attached to:**

* **People** (players, staff)  
* **Events** (matches, training sessions)  
* **Injuries** (if you have injury tracking)  
* **Reports** (embed note in report)  
* **Other notes** (thread/conversation)

**One note can link to multiple entities** (optional):

model NoteLink {  
  id         String @id  
  noteId     String  
  targetType String  
  targetId   String  
    
  @@unique(\[noteId, targetType, targetId\])  
}

This allows: "This note is about Marcus AND this training session AND this injury"

---

### **Rich Text Features**

**Basic formatting:**

* Bold, italic, underline  
* Headings  
* Lists (bullet, numbered)  
* Links

**Advanced (add later):**

* @mentions (tag people)  
* Images/files inline  
* Tables  
* Code blocks (for technical notes)  
* Checkboxes (to-do items)

**Start simple, add features as needed.**

---

### **Tiptap Implementation**

\<NoteEditor\>  
  \<Editor  
    extensions={\[  
      StarterKit, // basic formatting  
      Mention.configure({  
        suggestion: {  
          items: ({ query }) \=\> searchPeople(query)  
        }  
      })  
    \]}  
    content={note.content}  
    onUpdate={({ editor }) \=\> {  
      setContent(editor.getJSON())  
    }}  
  /\>  
    
  \<Select label="Visibility"\>  
    \<option\>Public\</option\>  
    \<option\>Medical only\</option\>  
    \<option\>Mental health only\</option\>  
    \<option\>Coaches only\</option\>  
    \<option\>Private\</option\>  
  \</Select\>  
    
  \<TagInput tags={tags} onChange={setTags} /\>  
    
  \<Button onClick={save}\>Save Note\</Button\>  
\</NoteEditor\>

---

### **Note Display**

**In entity views (e.g., Player Profile):**

\<NotesSection\>  
  \<h3\>Notes\</h3\>  
    
  {/\* User only sees notes they have permission for \*/}  
  {notes.map(note \=\> (  
    \<NoteCard\>  
      \<NoteHeader\>  
        \<Avatar\>{note.author.name}\</Avatar\>  
        \<span\>{note.author.name}\</span\>  
        \<Badge\>{note.visibility}\</Badge\>  
        \<Time\>{note.createdAt}\</Time\>  
      \</NoteHeader\>  
        
      \<NoteContent\>  
        {renderTiptapContent(note.content)}  
      \</NoteContent\>  
        
      \<NoteTags\>  
        {note.tags.map(tag \=\> \<Tag\>{tag}\</Tag\>)}  
      \</NoteTags\>  
    \</NoteCard\>  
  ))}  
    
  \<Button\>+ Add Note\</Button\>  
\</NotesSection\>

---

### **Search & Filter**

**Notes section (global view):**

\<NotesView\>  
  \<Filters\>  
    \<Input placeholder="Search notes..." /\>  
    \<Select label="Author"\>  
      {users.map(u \=\> \<option\>{u.name}\</option\>)}  
    \</Select\>  
    \<Select label="Visibility"\>  
      \<option\>All I can see\</option\>  
      \<option\>Public only\</option\>  
      \<option\>My private notes\</option\>  
    \</Select\>  
    \<Select label="Attached to"\>  
      \<option\>All\</option\>  
      \<option\>Players\</option\>  
      \<option\>Events\</option\>  
      \<option\>Standalone\</option\>  
    \</Select\>  
    \<TagFilter /\>  
    \<DateRange /\>  
  \</Filters\>  
    
  \<NotesList\>  
    {/\* Filtered notes \*/}  
  \</NotesList\>  
\</NotesView\>

---

### **Permissions Logic**

**Row-Level Security (Supabase RLS):**

\-- User can see note if:  
\-- 1\. It's public  
\-- 2\. It's role-specific and user has that role  
\-- 3\. It's private and user is the author

CREATE POLICY "notes\_select\_policy" ON notes  
  FOR SELECT  
  USING (  
    visibility \= 'public'  
    OR (visibility \= 'medical' AND user\_has\_role(auth.uid(), org\_id, 'medical'))  
    OR (visibility \= 'mental\_health' AND user\_has\_role(auth.uid(), org\_id, 'mental\_health'))  
    OR (visibility \= 'coaches' AND user\_has\_role(auth.uid(), org\_id, 'coach'))  
    OR (visibility \= 'private' AND author\_id \= auth.uid())  
  );

**This is enforced at database level. Users can't see notes they shouldn't.**

---

### **Modularity**

**Notes appear:**

* In entity views (player profile, event detail)  
* In global Notes section (filtered list)  
* Embedded in reports  
* Linked from spreadsheets (optional)

**Same note can appear in multiple contexts.**

---

### **AI Integration**

User: "AI, summarize all medical notes for Marcus from the last month"

AI:  
1\. Queries notes attached to Marcus with visibility "medical"  
2\. Filters last 30 days  
3\. Reads content  
4\. Generates summary: "Marcus has been managing left ankle soreness. Treatment includes ice and physio. Cleared for full training as of Jan 10."

User: "AI, analyze sentiment in coach notes from last 10 training sessions"

AI:  
1\. Queries notes attached to training events  
2\. Filters visibility: "public" or "coaches"  
3\. Analyzes content  
4\. Returns: "Overall positive sentiment. Most common themes: passing accuracy needs work, defensive shape improving."

User: "AI, add a note to today's training session about Marcus's performance"

AI:  
1\. Finds today's training event  
2\. Creates note attached to event  
3\. User dictates or types content  
4\. AI formats and saves

---

### **Reporting on Notes**

**Aggregate patterns:**

* How many medical notes per player (injury-prone players?)  
* Common themes in coach observations  
* Frequency of private psychological notes (engagement level?)  
* Notes per event type (are matches generating more observations than training?)

**Cross-reference:**

* Players with most medical notes vs injury history  
* Coach notes mentioning "fatigue" vs load data  
* Psychological note frequency vs performance trends

---

### **Styling with shadcn**

Tiptap is headless (like TanStack Table):

* Style editor toolbar with shadcn buttons  
* Style note cards with shadcn Card component  
* Use shadcn typography for rendered content

Full control over appearance.

---

### **Collaborative Editing (Optional Later)**

Tiptap supports real-time collaboration (multiple users editing same note):

* Uses **Y.js** \+ WebSocket  
* Requires additional infrastructure (WebSocket server)  
* Not essential for MVP, but possible

**Start with:** Single author per note  
 **Add later:** Collaborative editing if users request

---

### **Note Templates (Optional)**

Like forms/spreadsheets, could have note templates:

* Medical assessment template (structured format)  
* Match analysis template (pre-defined sections)  
* Player development review template

**Or keep notes completely freeform.**

Your call based on user feedback.

---

### **Build Effort**

**Core notes system:** 1 week

* Tiptap integration  
* CRUD operations  
* Visibility/permissions  
* Attach to entities

**Search & filter:** 2-3 days

**Tag system:** 2-3 days

**AI integration:** Ongoing (as AI features develop)

**Total: \~1.5 weeks**

# **Files**

## **Files \- Full Picture**

### **What Files Do**

1. **Upload files** \- documents, images, videos, PDFs, any file type  
2. **Organize** \- folders, tags, search  
3. **Link to entities** \- attach to players, events, plans, notes, anywhere  
4. **Preview** \- view images, PDFs in-browser  
5. **Version control** \- track file versions (optional)  
6. **Share** \- generate shareable links, download  
7. **Access control** \- who can see which files (permissions)

---

### **Tech Stack**

* **Supabase Storage** \- file storage backend (free tier: 1GB, then cheap)  
* **react-dropzone** (free, MIT) \- drag-and-drop upload  
* **File preview libraries**:  
  * Images: native browser  
  * PDFs: **react-pdf** or browser native  
  * Videos: native HTML5 video player  
* **TanStack Table** \- file list view  
* **shadcn components** \- cards, dialogs, buttons

---

### **File Types & Use Cases**

**Documents:**

* Player contracts (PDF)  
* Medical reports (PDF, DOCX)  
* Session plans (PDF, DOCX)  
* Scouting reports (PDF)

**Images:**

* Player photos  
* Tactical diagrams  
* Injury photos (medical documentation)  
* Facility photos

**Videos:**

* Match highlights  
* Training session footage  
* Tactical analysis clips  
* Player skill videos

**Data files:**

* GPS data exports (CSV)  
* Medical test results (CSV, XLS)  
* External reports (various formats)

---

### **User Flow**

### **Scenario 1: Upload Files**

\<FileUpload\>  
  \<h2\>Upload Files\</h2\>  
    
  \<Dropzone onDrop={handleDrop}\>  
    \<Icon\>📁\</Icon\>  
    \<p\>Drag and drop files here, or click to browse\</p\>  
    \<p className="text-sm text-muted"\>Up to 100MB per file\</p\>  
  \</Dropzone\>  
    
  {uploading && (  
    \<UploadProgress\>  
      {files.map(file \=\> (  
        \<ProgressItem key={file.name}\>  
          \<FileIcon type={file.type} /\>  
          \<div\>  
            \<strong\>{file.name}\</strong\>  
            \<Progress value={file.progress} /\>  
            \<span\>{file.progress}% \- {formatBytes(file.size)}\</span\>  
          \</div\>  
        \</ProgressItem\>  
      ))}  
    \</UploadProgress\>  
  )}  
    
  \<LinkToEntity\>  
    \<h4\>Attach to (optional):\</h4\>  
    \<Select label="Entity Type"\>  
      \<option value=""\>None (standalone)\</option\>  
      \<option\>Player\</option\>  
      \<option\>Event\</option\>  
      \<option\>Plan\</option\>  
      \<option\>Note\</option\>  
    \</Select\>  
    {entityType && (  
      \<Select label="Select {entityType}"\>  
        {/\* Dynamic list based on type \*/}  
      \</Select\>  
    )}  
  \</LinkToEntity\>  
    
  \<Metadata\>  
    \<h4\>File Details\</h4\>  
    \<Input label="Description" placeholder="Session plan for Chelsea match" /\>  
    \<TagInput label="Tags" placeholder="Add tags..." /\>  
    \<Select label="Visibility"\>  
      \<option\>Public (org-wide)\</option\>  
      \<option\>Medical only\</option\>  
      \<option\>Coaching staff only\</option\>  
      \<option\>Private\</option\>  
    \</Select\>  
  \</Metadata\>  
    
  \<Button onClick={upload}\>Upload Files\</Button\>  
\</FileUpload\>

---

### **Scenario 2: File Library (List View)**

\<FileLibrary\>  
  \<Toolbar\>  
    \<Search placeholder="Search files..." /\>  
    \<FilterSelect label="File Type"\>  
      \<option\>All\</option\>  
      \<option\>Documents\</option\>  
      \<option\>Images\</option\>  
      \<option\>Videos\</option\>  
      \<option\>Data Files\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Attached To"\>  
      \<option\>All\</option\>  
      \<option\>Players\</option\>  
      \<option\>Events\</option\>  
      \<option\>Plans\</option\>  
      \<option\>Standalone\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Uploaded By"\>  
      {staff.map(s \=\> \<option value={s.id}\>{s.name}\</option\>)}  
    \</FilterSelect\>  
    \<DateRange label="Upload Date" /\>  
    \<TagFilter /\>  
    \<Button\>+ Upload Files\</Button\>  
  \</Toolbar\>  
    
  \<ViewToggle\>  
    \<Button variant={view \=== "list" ? "default" : "ghost"} onClick={() \=\> setView("list")}\>  
      \<ListIcon /\>  
    \</Button\>  
    \<Button variant={view \=== "grid" ? "default" : "ghost"} onClick={() \=\> setView("grid")}\>  
      \<GridIcon /\>  
    \</Button\>  
  \</ViewToggle\>  
    
  {view \=== "list" ? (  
    \<FileTable\>  
      \<Table\>  
        \<thead\>  
          \<tr\>  
            \<th\>Name\</th\>  
            \<th\>Type\</th\>  
            \<th\>Size\</th\>  
            \<th\>Uploaded By\</th\>  
            \<th\>Uploaded\</th\>  
            \<th\>Attached To\</th\>  
            \<th\>Actions\</th\>  
          \</tr\>  
        \</thead\>  
        \<tbody\>  
          {files.map(file \=\> (  
            \<tr key={file.id} onClick={() \=\> openFile(file.id)}\>  
              \<td\>  
                \<FileIcon type={file.type} /\>  
                \<span\>{file.name}\</span\>  
              \</td\>  
              \<td\>{file.type}\</td\>  
              \<td\>{formatBytes(file.size)}\</td\>  
              \<td\>  
                \<Avatar src={file.uploadedBy.photo} size="sm" /\>  
                \<span\>{file.uploadedBy.name}\</span\>  
              \</td\>  
              \<td\>{formatDate(file.uploadedAt)}\</td\>  
              \<td\>  
                {file.linkedTo && (  
                  \<Link to={file.linkedTo.url}\>  
                    \<Badge\>{file.linkedTo.type}\</Badge\>  
                    \<span\>{file.linkedTo.name}\</span\>  
                  \</Link\>  
                )}  
              \</td\>  
              \<td\>  
                \<DropdownMenu\>  
                  \<Item onClick={download}\>Download\</Item\>  
                  \<Item onClick={preview}\>Preview\</Item\>  
                  \<Item onClick={share}\>Share Link\</Item\>  
                  \<Item onClick={edit}\>Edit Details\</Item\>  
                  \<Item onClick={deleteFile} variant="destructive"\>Delete\</Item\>  
                \</DropdownMenu\>  
              \</td\>  
            \</tr\>  
          ))}  
        \</tbody\>  
      \</Table\>  
    \</FileTable\>  
  ) : (  
    \<FileGrid\>  
      {files.map(file \=\> (  
        \<FileCard key={file.id} onClick={() \=\> openFile(file.id)}\>  
          {file.type.startsWith("image/") ? (  
            \<Thumbnail src={file.url} alt={file.name} /\>  
          ) : (  
            \<FileIcon type={file.type} large /\>  
          )}  
          \<FileName\>{file.name}\</FileName\>  
          \<FileSize\>{formatBytes(file.size)}\</FileSize\>  
          \<FileDate\>{formatDate(file.uploadedAt)}\</FileDate\>  
        \</FileCard\>  
      ))}  
    \</FileGrid\>  
  )}  
\</FileLibrary\>

---

### **Scenario 3: File Detail/Preview**

\<FileDetail\>  
  \<Header\>  
    \<div\>  
      \<h2\>{file.name}\</h2\>  
      \<Meta\>  
        \<Badge\>{file.type}\</Badge\>  
        \<span\>{formatBytes(file.size)}\</span\>  
        \<span\>Uploaded {formatDate(file.uploadedAt)}\</span\>  
        \<Avatar src={file.uploadedBy.photo} size="sm" /\>  
        \<span\>{file.uploadedBy.name}\</span\>  
      \</Meta\>  
    \</div\>  
    \<Actions\>  
      \<Button onClick={download}\>  
        \<DownloadIcon /\> Download  
      \</Button\>  
      \<Button variant="outline" onClick={share}\>  
        \<ShareIcon /\> Share  
      \</Button\>  
      \<Button variant="outline" onClick={edit}\>  
        \<EditIcon /\> Edit  
      \</Button\>  
      \<Button variant="ghost" onClick={deleteFile}\>  
        \<TrashIcon /\> Delete  
      \</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Preview\>  
    {file.type.startsWith("image/") && (  
      \<ImagePreview src={file.url} alt={file.name} /\>  
    )}  
      
    {file.type \=== "application/pdf" && (  
      \<PDFPreview\>  
        \<Document file={file.url}\>  
          \<Page pageNumber={pageNumber} /\>  
        \</Document\>  
        \<PageControls\>  
          \<Button onClick={prevPage} disabled={pageNumber \=== 1}\>  
            Previous  
          \</Button\>  
          \<span\>Page {pageNumber} of {numPages}\</span\>  
          \<Button onClick={nextPage} disabled={pageNumber \=== numPages}\>  
            Next  
          \</Button\>  
        \</PageControls\>  
      \</PDFPreview\>  
    )}  
      
    {file.type.startsWith("video/") && (  
      \<VideoPreview controls src={file.url} /\>  
    )}  
      
    {\!isPreviewable(file.type) && (  
      \<NoPreview\>  
        \<FileIcon type={file.type} large /\>  
        \<p\>No preview available for this file type\</p\>  
        \<Button onClick={download}\>Download to view\</Button\>  
      \</NoPreview\>  
    )}  
  \</Preview\>  
    
  \<Details\>  
    \<Section\>  
      \<h3\>Description\</h3\>  
      \<p\>{file.description || "No description"}\</p\>  
    \</Section\>  
      
    \<Section\>  
      \<h3\>Tags\</h3\>  
      \<TagList\>  
        {file.tags.map(tag \=\> \<Tag key={tag}\>{tag}\</Tag\>)}  
      \</TagList\>  
    \</Section\>  
      
    \<Section\>  
      \<h3\>Visibility\</h3\>  
      \<Badge\>{file.visibility}\</Badge\>  
    \</Section\>  
      
    {file.linkedTo && (  
      \<Section\>  
        \<h3\>Attached To\</h3\>  
        \<LinkedEntity\>  
          \<Icon type={file.linkedTo.type} /\>  
          \<div\>  
            \<strong\>{file.linkedTo.name}\</strong\>  
            \<p\>{file.linkedTo.type}\</p\>  
          \</div\>  
          \<Button variant="ghost" size="sm"\>View →\</Button\>  
        \</LinkedEntity\>  
      \</Section\>  
    )}  
      
    \<Section\>  
      \<h3\>File Info\</h3\>  
      \<InfoList\>  
        \<InfoItem\>  
          \<span\>File size:\</span\>  
          \<span\>{formatBytes(file.size)}\</span\>  
        \</InfoItem\>  
        \<InfoItem\>  
          \<span\>File type:\</span\>  
          \<span\>{file.type}\</span\>  
        \</InfoItem\>  
        \<InfoItem\>  
          \<span\>Uploaded:\</span\>  
          \<span\>{formatDateTime(file.uploadedAt)}\</span\>  
        \</InfoItem\>  
        \<InfoItem\>  
          \<span\>Direct URL:\</span\>  
          \<Code\>{file.url}\</Code\>  
          \<Button size="sm" variant="ghost" onClick={copyUrl}\>Copy\</Button\>  
        \</InfoItem\>  
      \</InfoList\>  
    \</Section\>  
  \</Details\>  
\</FileDetail\>

---

### **Data Model**

model File {  
  id          String @id  
  orgId       String  
    
  // File details  
  name        String  
  originalName String // before sanitization  
  type        String // MIME type  
  size        Int // bytes  
  url         String // Supabase Storage URL  
    
  // Storage path  
  storagePath String // path in Supabase bucket  
  bucket      String @default("files")  
    
  // Metadata  
  description String?  
  tags        String\[\]  
    
  // Linked to entities  
  linkedToType String? // "player", "event", "plan", "note"  
  linkedToId   String?  
    
  // Visibility  
  visibility  String @default("public") // "public", "medical", "coaches", "private"  
    
  // Upload info  
  uploadedBy  String  
  uploader    User @relation(fields: \[uploadedBy\], references: \[id\])  
  uploadedAt  DateTime @default(now())  
    
  // Version control (optional)  
  version     Int @default(1)  
  previousVersionId String?  
    
  createdAt   DateTime @default(now())  
  updatedAt   DateTime @updatedAt  
}

---

### **Supabase Storage Setup**

// Storage bucket configuration  
const bucket \= supabase.storage.from('files')

// Upload file  
async function uploadFile(file: File, metadata: FileMetadata) {  
  const fileName \= \`${orgId}/${Date.now()}-${sanitize(file.name)}\`  
    
  const { data, error } \= await bucket.upload(fileName, file, {  
    cacheControl: '3600',  
    upsert: false  
  })  
    
  if (error) throw error  
    
  // Get public URL  
  const { data: { publicUrl } } \= bucket.getPublicUrl(fileName)  
    
  // Save to database  
  await prisma.file.create({  
    data: {  
      orgId,  
      name: file.name,  
      originalName: file.name,  
      type: file.type,  
      size: file.size,  
      url: publicUrl,  
      storagePath: fileName,  
      ...metadata  
    }  
  })  
}

// Download file  
async function downloadFile(file: File) {  
  const { data, error } \= await bucket.download(file.storagePath)  
  if (error) throw error  
    
  // Trigger browser download  
  const url \= URL.createObjectURL(data)  
  const a \= document.createElement('a')  
  a.href \= url  
  a.download \= file.name  
  a.click()  
}

// Delete file  
async function deleteFile(file: File) {  
  const { error } \= await bucket.remove(\[file.storagePath\])  
  if (error) throw error  
    
  await prisma.file.delete({ where: { id: file.id } })  
}

---

### **File Organization**

**Folder-like structure using tags:**

\<FileOrganization\>  
  \<Sidebar\>  
    \<h4\>Quick Filters\</h4\>  
    \<FilterList\>  
      \<Filter active\>All Files\</Filter\>  
      \<Filter\>Recent\</Filter\>  
      \<Filter\>My Uploads\</Filter\>  
      \<Divider /\>  
      \<h5\>By Type\</h5\>  
      \<Filter\>Documents\</Filter\>  
      \<Filter\>Images\</Filter\>  
      \<Filter\>Videos\</Filter\>  
      \<Divider /\>  
      \<h5\>By Tags\</h5\>  
      \<Filter\>Contracts\</Filter\>  
      \<Filter\>Medical\</Filter\>  
      \<Filter\>Scouting\</Filter\>  
      \<Filter\>Training\</Filter\>  
      \<Button variant="ghost" size="sm"\>+ Manage Tags\</Button\>  
    \</FilterList\>  
  \</Sidebar\>  
    
  \<FileGrid\>  
    {/\* Files display \*/}  
  \</FileGrid\>  
\</FileOrganization\>

**No physical folders, just tags \+ filters.**

---

### **Sharing Files**

\<ShareFile\>  
  \<h3\>Share "{file.name}"\</h3\>  
    
  \<ShareOptions\>  
    \<Option\>  
      \<Radio value="link" /\>  
      \<div\>  
        \<strong\>Share Link\</strong\>  
        \<p\>Anyone with the link can view (no login)\</p\>  
      \</div\>  
    \</Option\>  
      
    {isShareLinkActive && (  
      \<ShareLink\>  
        \<Input value={shareUrl} readOnly /\>  
        \<ButtonGroup\>  
          \<Button onClick={copyLink}\>Copy Link\</Button\>  
          \<Button variant="ghost" onClick={revokeLink}\>Revoke\</Button\>  
        \</ButtonGroup\>  
        \<ExpiryOptions\>  
          \<Select label="Link expires"\>  
            \<option value=""\>Never\</option\>  
            \<option value="1"\>1 day\</option\>  
            \<option value="7"\>7 days\</option\>  
            \<option value="30"\>30 days\</option\>  
          \</Select\>  
        \</ExpiryOptions\>  
      \</ShareLink\>  
    )}  
      
    \<Option\>  
      \<Radio value="email" /\>  
      \<div\>  
        \<strong\>Email File\</strong\>  
        \<p\>Send file directly to specific people\</p\>  
      \</div\>  
    \</Option\>  
      
    {shareMethod \=== "email" && (  
      \<EmailForm\>  
        \<MultiSelect label="Recipients"\>  
          {staff.map(s \=\> \<option value={s.email}\>{s.name}\</option\>)}  
        \</MultiSelect\>  
        \<Textarea label="Message" placeholder="Optional message..." /\>  
        \<Button\>Send Email\</Button\>  
      \</EmailForm\>  
    )}  
  \</ShareOptions\>  
\</ShareFile\>

---

### **File Linking (Attach to Entities)**

**Player Profile:**

\<PlayerProfile\>  
  \<Tab label="Files"\>  
    \<FilesList\>  
      \<h3\>Attached Files\</h3\>  
      {files.map(file \=\> (  
        \<FileItem key={file.id}\>  
          \<FileIcon type={file.type} /\>  
          \<div\>  
            \<strong\>{file.name}\</strong\>  
            \<span\>{formatBytes(file.size)} · {formatDate(file.uploadedAt)}\</span\>  
          \</div\>  
          \<Button variant="ghost" size="sm" onClick={() \=\> openFile(file.id)}\>  
            View  
          \</Button\>  
        \</FileItem\>  
      ))}  
      \<Button variant="outline"\>+ Upload File\</Button\>  
    \</FilesList\>  
  \</Tab\>  
\</PlayerProfile\>

**Event Detail:**

\<EventDetail\>  
  \<Tab label="Files"\>  
    \<FilesSection\>  
      \- Session\_Plan.pdf (500 KB)  
      \- Opposition\_Scouting.pdf (2.3 MB)  
      \- Match\_Highlights.mp4 (45 MB)  
      \<Button\>+ Upload File\</Button\>  
    \</FilesSection\>  
  \</Tab\>  
\</EventDetail\>

**Notes (inline attachments):**

\<NoteEditor\>  
  \<Tiptap content={note} /\>  
    
  \<Attachments\>  
    \<h4\>Attachments\</h4\>  
    {attachments.map(file \=\> (  
      \<AttachmentChip key={file.id}\>  
        \<FileIcon type={file.type} size="sm" /\>  
        \<span\>{file.name}\</span\>  
        \<Button variant="ghost" size="sm" onClick={() \=\> removeAttachment(file.id)}\>  
          ×  
        \</Button\>  
      \</AttachmentChip\>  
    ))}  
    \<Button variant="outline" size="sm" onClick={attachFile}\>  
      \+ Attach File  
    \</Button\>  
  \</Attachments\>  
\</NoteEditor\>

---

### **Permissions (Visibility)**

**Same pattern as Notes:**

* **Public** \- all staff can see  
* **Medical only** \- only medical staff  
* **Coaches only** \- only coaching staff  
* **Private** \- only uploader

**Enforced with Supabase RLS:**

CREATE POLICY "files\_select\_policy" ON files  
  FOR SELECT  
  USING (  
    visibility \= 'public'  
    OR (visibility \= 'medical' AND user\_has\_role(auth.uid(), org\_id, 'medical\_access'))  
    OR (visibility \= 'coaches' AND user\_has\_role(auth.uid(), org\_id, 'coach'))  
    OR (visibility \= 'private' AND uploaded\_by \= auth.uid())  
  );

---

### **Version Control (Optional \- Add Later)**

model File {  
  // ... existing fields  
    
  version           Int @default(1)  
  previousVersionId String?  
  previousVersion   File? @relation("FileVersions", fields: \[previousVersionId\], references: \[id\])  
  nextVersions      File\[\] @relation("FileVersions")  
}

**Upload new version:**

\<UploadNewVersion\>  
  \<p\>Upload a new version of "{file.name}"\</p\>  
  \<FileUpload onDrop={handleNewVersion} /\>  
  \<p className="text-sm"\>Previous versions will be archived\</p\>  
  \<Button\>Upload New Version\</Button\>  
\</UploadNewVersion\>

**View version history:**

\<VersionHistory\>  
  \<h3\>Version History\</h3\>  
  {versions.map(version \=\> (  
    \<Version key={version.id}\>  
      \<span\>Version {version.version}\</span\>  
      \<span\>{formatDate(version.uploadedAt)}\</span\>  
      \<span\>by {version.uploader.name}\</span\>  
      \<ButtonGroup\>  
        \<Button size="sm" onClick={() \=\> viewVersion(version.id)}\>View\</Button\>  
        \<Button size="sm" onClick={() \=\> downloadVersion(version.id)}\>Download\</Button\>  
        \<Button size="sm" onClick={() \=\> restoreVersion(version.id)}\>Restore\</Button\>  
      \</ButtonGroup\>  
    \</Version\>  
  ))}  
\</VersionHistory\>

**Start without this. Add if users request it.**

---

### **AI Integration**

User: "AI, find all medical reports for Marcus"

AI:  
1\. Queries files linked to Marcus with tags "medical" or type "report"  
2\. Returns: "Found 5 medical reports for Marcus:  
   \- Medical\_Clearance\_Jan10.pdf  
   \- MRI\_Results\_Jan12.pdf  
   \- Physio\_Assessment\_Jan20.pdf  
   ..."

User uploads image: "AI, what's in this tactical diagram?"

AI:  
1\. Analyzes image using vision  
2\. Returns: "This appears to be a 4-3-3 formation diagram with high defensive line. Wingers positioned wide, fullbacks overlapping..."

User: "AI, organize my untagged files"

AI:  
1\. Analyzes file names, types, linked entities  
2\. Suggests tags  
3\. Returns: "I can tag these files:  
   \- Session\_Plan\_\*.pdf → 'training', 'session-plans'  
   \- Medical\_\* → 'medical'  
   \- Scout\_Report\_\* → 'scouting', 'opposition'  
   Apply these tags?"

---

### **Storage Costs**

**Supabase Storage pricing:**

* Free tier: 1GB storage  
* Pro tier ($25/month): 100GB storage  
* Beyond: $0.021/GB/month

**Typical usage:**

* 100 clubs × 2GB average \= 200GB \= \~$25/month extra  
* Affordable at scale

**File size limits:**

* Per file: 50MB (free), 5GB (paid)  
* Set reasonable limits per file type

---

### **Mobile Considerations**

**Files on mobile:**

* Grid view better than table  
* Tap to preview/download  
* Camera integration (take photo → upload)  
* Simple filters

---

### **Styling with shadcn**

* File cards \= shadcn Card  
* Upload zone \= shadcn with custom styling  
* TanStack Table for list view  
* All buttons/modals/inputs \= shadcn

---

### **Build Effort**

**Core file system:** 1 week

* Upload with react-dropzone  
* Supabase Storage integration  
* File CRUD  
* List/grid views

**Preview system:** 3-4 days

* Image preview  
* PDF preview (react-pdf)  
* Video player

**Linking system:** 2-3 days

* Attach files to entities  
* Display in entity views

**Permissions:** 2 days

* Visibility controls  
* RLS policies

**Sharing:** 2 days

* Share links  
* Email files

**Total: \~2.5 weeks for full Files section**

---

**That's files. Clear?**

# **Planner**

## **Planning Tool \- Full Picture**

### **What Planning Tool Does**

1. **Create plans** \- project plans, season plans, rehabilitation plans, development plans  
2. **Set milestones** \- key dates, checkpoints, goals  
3. **Track progress** \- mark milestones complete, update status  
4. **Link to entities** \- attach to players (rehab plan), events (season plan), teams  
5. **Assign ownership** \- who's responsible for what  
6. **Visualize timeline** \- Gantt-style view or simple list  
7. **Collaborate** \- notes, comments, updates on plans

---

### **Tech Stack**

* **Custom build** \- list-based UI with milestones  
* **Timeline visualization** \- simple horizontal timeline (build with CSS/SVG)  
* **shadcn components** \- cards, progress bars, badges  
* **Drag-and-drop** (optional) \- reorder milestones with dnd-kit

---

### **Plan Types (Use Cases)**

**Season Plan:**

* Pre-season preparation  
* Competition phase  
* Post-season recovery  
* Linked to: Team, Events

**Player Development Plan:**

* Technical skills to develop  
* Physical conditioning milestones  
* Performance targets  
* Linked to: Player

**Rehabilitation Plan:**

* Injury assessment  
* Treatment phases  
* Return-to-play milestones  
* Clearance checkpoints  
* Linked to: Player

**Event Plan:**

* Match preparation timeline  
* Opposition analysis  
* Team selection  
* Post-match review  
* Linked to: Event

**Facility/Operations Plan:**

* Pre-season facility prep  
* Equipment procurement  
* Staff training  
* Linked to: Team/Org

---

### **User Flow**

### **Scenario 1: Create Season Plan**

\<CreatePlan\>  
  \<h2\>Create Plan\</h2\>  
    
  \<Select label="Plan Type"\>  
    \<option\>Season Plan\</option\>  
    \<option\>Player Development\</option\>  
    \<option\>Rehabilitation\</option\>  
    \<option\>Event Preparation\</option\>  
    \<option\>Custom\</option\>  
  \</Select\>  
    
  \<Input label="Plan Name" placeholder="2024/25 Season Plan" required /\>  
  \<Textarea label="Description" placeholder="Overall season objectives and phases" /\>  
    
  \<DateRange label="Duration"\>  
    \<DatePicker label="Start Date" /\>  
    \<DatePicker label="End Date" /\>  
  \</DateRange\>  
    
  \<LinkToEntity\>  
    \<h4\>Link to\</h4\>  
    \<Select label="Entity Type"\>  
      \<option\>Team\</option\>  
      \<option\>Player\</option\>  
      \<option\>Event\</option\>  
      \<option\>None (standalone)\</option\>  
    \</Select\>  
    {entityType \=== "player" && (  
      \<Select label="Select Player"\>  
        {players.map(p \=\> \<option value={p.id}\>{p.name}\</option\>)}  
      \</Select\>  
    )}  
  \</LinkToEntity\>  
    
  \<Ownership\>  
    \<h4\>Plan Owner\</h4\>  
    \<Select label="Assigned To"\>  
      {staff.map(s \=\> \<option value={s.id}\>{s.name}\</option\>)}  
    \</Select\>  
  \</Ownership\>  
    
  \<Button\>Create Plan\</Button\>  
\</CreatePlan\>

---

### **Scenario 2: Add Milestones**

\<PlanDetail\>  
  \<Header\>  
    \<div\>  
      \<h1\>2024/25 Season Plan\</h1\>  
      \<p\>Aug 2024 \- May 2025\</p\>  
      \<Badge\>In Progress\</Badge\>  
    \</div\>  
    \<Actions\>  
      \<Button onClick={addMilestone}\>+ Add Milestone\</Button\>  
      \<Button variant="outline"\>Edit Plan\</Button\>  
      \<Button variant="outline"\>Share\</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<ProgressBar\>  
    \<Progress value={45} /\> {/\* 5/11 milestones complete \*/}  
    \<span\>5 of 11 milestones complete (45%)\</span\>  
  \</ProgressBar\>  
    
  \<MilestoneList\>  
    \<Milestone status="complete"\>  
      \<Checkbox checked /\>  
      \<div\>  
        \<h3\>Pre-season Training Camp\</h3\>  
        \<p\>4-week intensive preparation phase\</p\>  
        \<DateBadge\>Jul 1 \- Jul 28\</DateBadge\>  
        \<AssigneeBadge\>Coach Johnson\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge variant="success"\>Complete\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="in\_progress"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>First 10 League Matches\</h3\>  
        \<p\>Build momentum, establish formation\</p\>  
        \<DateBadge\>Aug 15 \- Oct 30\</DateBadge\>  
        \<Progress value={60} /\> {/\* 6/10 matches played \*/}  
        \<AssigneeBadge\>Coach Johnson\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge variant="warning"\>In Progress\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="pending"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Winter Break Review\</h3\>  
        \<p\>Performance analysis, tactical adjustments\</p\>  
        \<DateBadge\>Dec 20 \- Jan 5\</DateBadge\>  
        \<AssigneeBadge\>Technical Director\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge\>Pending\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="pending"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Top 4 Push\</h3\>  
        \<p\>Final 15 matches, Champions League qualification\</p\>  
        \<DateBadge\>Feb 1 \- May 15\</DateBadge\>  
        \<AssigneeBadge\>Coach Johnson\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge\>Pending\</StatusBadge\>  
    \</Milestone\>  
  \</MilestoneList\>  
\</PlanDetail\>

---

### **Scenario 3: Rehabilitation Plan**

\<RehabPlan\>  
  \<Header\>  
    \<div\>  
      \<h1\>Marcus Rashford \- Ankle Recovery\</h1\>  
      \<PlayerLink\>  
        \<Avatar src={player.photo} /\>  
        \<span\>Marcus Rashford\</span\>  
      \</PlayerLink\>  
      \<p\>Jan 10 \- Feb 25 (6 weeks)\</p\>  
      \<Badge variant="warning"\>In Progress\</Badge\>  
    \</div\>  
    \<Actions\>  
      \<Button\>+ Add Milestone\</Button\>  
      \<Button variant="outline"\>Medical Notes\</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<ProgressBar\>  
    \<Progress value={50} /\>  
    \<span\>Week 3 of 6\</span\>  
  \</ProgressBar\>  
    
  \<MilestoneList\>  
    \<Milestone status="complete"\>  
      \<Checkbox checked /\>  
      \<div\>  
        \<h3\>Initial Assessment\</h3\>  
        \<p\>MRI scan, diagnosis, treatment plan established\</p\>  
        \<DateBadge\>Jan 10\</DateBadge\>  
        \<AssigneeBadge\>Dr. Smith\</AssigneeBadge\>  
        \<LinkedNote\>Medical assessment attached →\</LinkedNote\>  
      \</div\>  
      \<StatusBadge variant="success"\>Complete\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="complete"\>  
      \<Checkbox checked /\>  
      \<div\>  
        \<h3\>Phase 1: Rest & Ice\</h3\>  
        \<p\>2 weeks rest, anti-inflammatory treatment\</p\>  
        \<DateBadge\>Jan 10 \- Jan 24\</DateBadge\>  
        \<AssigneeBadge\>Dr. Smith\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge variant="success"\>Complete\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="in\_progress"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Phase 2: Mobility & Strength\</h3\>  
        \<p\>Range of motion exercises, light gym work\</p\>  
        \<DateBadge\>Jan 25 \- Feb 7\</DateBadge\>  
        \<Progress value={60} /\>  
        \<AssigneeBadge\>Physio Team\</AssigneeBadge\>  
        \<LinkedForm\>Daily rehab progress form →\</LinkedForm\>  
      \</div\>  
      \<StatusBadge variant="warning"\>In Progress\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="pending"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Phase 3: Running & Change of Direction\</h3\>  
        \<p\>Linear running, agility drills\</p\>  
        \<DateBadge\>Feb 8 \- Feb 18\</DateBadge\>  
        \<AssigneeBadge\>Performance Coach\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge\>Pending\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="pending"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Phase 4: Return to Training\</h3\>  
        \<p\>Modified training, gradual reintegration\</p\>  
        \<DateBadge\>Feb 19 \- Feb 25\</DateBadge\>  
        \<AssigneeBadge\>Coach Johnson\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge\>Pending\</StatusBadge\>  
    \</Milestone\>  
      
    \<Milestone status="pending"\>  
      \<Checkbox /\>  
      \<div\>  
        \<h3\>Medical Clearance\</h3\>  
        \<p\>Final assessment, cleared for match selection\</p\>  
        \<DateBadge\>Feb 25\</DateBadge\>  
        \<AssigneeBadge\>Dr. Smith\</AssigneeBadge\>  
      \</div\>  
      \<StatusBadge\>Pending\</StatusBadge\>  
    \</Milestone\>  
  \</MilestoneList\>  
\</RehabPlan\>

---

### **Data Model**

model Plan {  
  id          String @id  
  orgId       String  
  name        String  
  description String?  
    
  // Type/category  
  type        String // "season", "player\_development", "rehabilitation", "event\_prep", "custom"  
    
  // Duration  
  startDate   DateTime  
  endDate     DateTime  
    
  // Status  
  status      String @default("not\_started") // "not\_started", "in\_progress", "complete", "on\_hold"  
    
  // Linked to entities  
  linkedToType String? // "player", "event", "team"  
  linkedToId   String?  
    
  // Ownership  
  ownerId     String // who's responsible  
  owner       User @relation(fields: \[ownerId\], references: \[id\])  
    
  // Milestones  
  milestones  Milestone\[\]  
    
  // Visibility  
  isPublic    Boolean @default(false)  
    
  createdBy   String  
  createdAt   DateTime  
  updatedAt   DateTime  
}

model Milestone {  
  id          String @id  
  planId      String  
  plan        Plan @relation(fields: \[planId\], references: \[id\])  
    
  title       String  
  description String?  
    
  // Timeline  
  startDate   DateTime?  
  endDate     DateTime?  
  dueDate     DateTime? // if single deadline  
    
  // Order  
  order       Int // for sorting  
    
  // Status  
  status      String @default("pending") // "pending", "in\_progress", "complete", "blocked"  
  completedAt DateTime?  
  completedBy String?  
    
  // Assignment  
  assignedTo  String? // user ID  
  assignee    User? @relation(fields: \[assignedTo\], references: \[id\])  
    
  // Progress (0-100)  
  progress    Int @default(0)  
    
  // Links to other entities  
  links       MilestoneLink\[\]  
    
  // Comments/updates  
  comments    MilestoneComment\[\]  
    
  createdAt   DateTime  
  updatedAt   DateTime  
}

model MilestoneLink {  
  id           String @id  
  milestoneId  String  
  milestone    Milestone @relation(fields: \[milestoneId\], references: \[id\])  
    
  targetType   String // "note", "form", "event", "file", "spreadsheet"  
  targetId     String  
    
  @@unique(\[milestoneId, targetType, targetId\])  
}

model MilestoneComment {  
  id          String @id  
  milestoneId String  
  milestone   Milestone @relation(fields: \[milestoneId\], references: \[id\])  
    
  content     String  
  authorId    String  
  author      User @relation(fields: \[authorId\], references: \[id\])  
    
  createdAt   DateTime  
}

---

### **Timeline Visualization**

\<TimelineView\>  
  \<Timeline\>  
    {/\* Horizontal timeline showing all milestones \*/}  
    \<TimelineAxis\>  
      {months.map(month \=\> (  
        \<MonthMarker key={month}\>{month}\</MonthMarker\>  
      ))}  
    \</TimelineAxis\>  
      
    \<TimelineTrack\>  
      {milestones.map(milestone \=\> (  
        \<MilestoneBar  
          key={milestone.id}  
          start={milestone.startDate}  
          end={milestone.endDate}  
          status={milestone.status}  
          onClick={() \=\> openMilestone(milestone.id)}  
        \>  
          \<span\>{milestone.title}\</span\>  
        \</MilestoneBar\>  
      ))}  
    \</TimelineTrack\>  
      
    \<TodayMarker /\>  
  \</Timeline\>  
\</TimelineView\>

**Simple CSS-based timeline (not full Gantt chart):**

* Horizontal bars for milestones  
* Color-coded by status  
* Click to view details  
* No dependencies (keep it simple)

---

### **Add/Edit Milestone**

\<MilestoneForm\>  
  \<h3\>Add Milestone\</h3\>  
    
  \<Input label="Title" placeholder="Pre-season training camp" required /\>  
  \<Textarea label="Description" placeholder="4-week intensive preparation" /\>  
    
  \<DatePicker label="Start Date" /\>  
  \<DatePicker label="End Date" /\>  
    
  \<Select label="Status"\>  
    \<option\>Pending\</option\>  
    \<option\>In Progress\</option\>  
    \<option\>Complete\</option\>  
    \<option\>Blocked\</option\>  
  \</Select\>  
    
  \<Select label="Assigned To"\>  
    \<option\>None\</option\>  
    {staff.map(s \=\> \<option value={s.id}\>{s.name}\</option\>)}  
  \</Select\>  
    
  \<Slider label="Progress" min={0} max={100} value={progress} /\>  
    
  \<LinkEntities\>  
    \<h4\>Link to:\</h4\>  
    \<Button variant="outline"\>+ Link Note\</Button\>  
    \<Button variant="outline"\>+ Link Form\</Button\>  
    \<Button variant="outline"\>+ Link Event\</Button\>  
    \<Button variant="outline"\>+ Link File\</Button\>  
  \</LinkEntities\>  
    
  \<ButtonGroup\>  
    \<Button\>Save Milestone\</Button\>  
    \<Button variant="ghost" onClick={cancel}\>Cancel\</Button\>  
  \</ButtonGroup\>  
\</MilestoneForm\>

---

### **Milestone Detail View**

\<MilestoneDetail\>  
  \<Header\>  
    \<div\>  
      \<h2\>{milestone.title}\</h2\>  
      \<p\>{milestone.description}\</p\>  
    \</div\>  
    \<Actions\>  
      \<Button onClick={markComplete}\>Mark Complete\</Button\>  
      \<Button variant="outline" onClick={edit}\>Edit\</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Details\>  
    \<Field label="Status"\>  
      \<StatusBadge variant={milestone.status}\>{milestone.status}\</StatusBadge\>  
    \</Field\>  
    \<Field label="Timeline"\>  
      {milestone.startDate} \- {milestone.endDate}  
    \</Field\>  
    \<Field label="Assigned To"\>  
      \<Avatar src={milestone.assignee?.photo} /\>  
      \<span\>{milestone.assignee?.name}\</span\>  
    \</Field\>  
    \<Field label="Progress"\>  
      \<ProgressBar value={milestone.progress} /\>  
      \<span\>{milestone.progress}%\</span\>  
    \</Field\>  
  \</Details\>  
    
  \<LinkedEntities\>  
    \<h3\>Linked Items\</h3\>  
    {milestone.links.map(link \=\> (  
      \<LinkedItem key={link.id}\>  
        \<Icon type={link.targetType} /\>  
        \<span\>{link.targetName}\</span\>  
        \<Button variant="ghost" size="sm"\>View →\</Button\>  
      \</LinkedItem\>  
    ))}  
    \<Button variant="outline"\>+ Add Link\</Button\>  
  \</LinkedEntities\>  
    
  \<Comments\>  
    \<h3\>Updates & Comments\</h3\>  
    {milestone.comments.map(comment \=\> (  
      \<Comment key={comment.id}\>  
        \<Avatar src={comment.author.photo} /\>  
        \<div\>  
          \<strong\>{comment.author.name}\</strong\>  
          \<Time\>{comment.createdAt}\</Time\>  
          \<p\>{comment.content}\</p\>  
        \</div\>  
      \</Comment\>  
    ))}  
      
    \<CommentForm\>  
      \<Textarea placeholder="Add update or comment..." /\>  
      \<Button\>Post Comment\</Button\>  
    \</CommentForm\>  
  \</Comments\>  
\</MilestoneDetail\>

---

### **Plan Templates**

\<PlanTemplates\>  
  \<h2\>Plan Templates\</h2\>  
    
  \<TemplateGrid\>  
    \<TemplateCard\>  
      \<Icon\>⚽\</Icon\>  
      \<h3\>Season Plan\</h3\>  
      \<p\>Pre-season, competition phase, post-season\</p\>  
      \<Badge\>5 milestones\</Badge\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    \<TemplateCard\>  
      \<Icon\>🏥\</Icon\>  
      \<h3\>Rehabilitation Plan (6 weeks)\</h3\>  
      \<p\>Standard injury recovery protocol\</p\>  
      \<Badge\>6 milestones\</Badge\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    \<TemplateCard\>  
      \<Icon\>📈\</Icon\>  
      \<h3\>Player Development (Season)\</h3\>  
      \<p\>Technical, physical, tactical progression\</p\>  
      \<Badge\>8 milestones\</Badge\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    \<TemplateCard\>  
      \<Icon\>🎯\</Icon\>  
      \<h3\>Match Preparation (1 week)\</h3\>  
      \<p\>Weekly match prep workflow\</p\>  
      \<Badge\>7 milestones\</Badge\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
  \</TemplateGrid\>  
\</PlanTemplates\>

---

### **Plans Overview**

\<PlansOverview\>  
  \<Toolbar\>  
    \<Search placeholder="Search plans..." /\>  
    \<FilterSelect label="Type"\>  
      \<option\>All\</option\>  
      \<option\>Season Plans\</option\>  
      \<option\>Rehabilitation\</option\>  
      \<option\>Player Development\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>In Progress\</option\>  
      \<option\>Complete\</option\>  
      \<option\>Not Started\</option\>  
    \</FilterSelect\>  
    \<Button\>+ Create Plan\</Button\>  
  \</Toolbar\>  
    
  \<PlansList\>  
    \<PlanCard\>  
      \<h3\>2024/25 Season Plan\</h3\>  
      \<p\>Team-wide season objectives and phases\</p\>  
      \<Progress value={45} /\>  
      \<span\>5 of 11 milestones complete\</span\>  
      \<Meta\>  
        \<Badge\>Season\</Badge\>  
        \<AssigneeBadge\>Coach Johnson\</AssigneeBadge\>  
        \<DateBadge\>Aug 2024 \- May 2025\</DateBadge\>  
      \</Meta\>  
    \</PlanCard\>  
      
    \<PlanCard\>  
      \<h3\>Marcus Rashford \- Ankle Recovery\</h3\>  
      \<p\>6-week rehabilitation protocol\</p\>  
      \<Progress value={50} /\>  
      \<span\>Week 3 of 6\</span\>  
      \<Meta\>  
        \<Badge variant="warning"\>Rehabilitation\</Badge\>  
        \<PlayerLink\>  
          \<Avatar src={player.photo} size="sm" /\>  
          \<span\>Marcus Rashford\</span\>  
        \</PlayerLink\>  
        \<AssigneeBadge\>Dr. Smith\</AssigneeBadge\>  
        \<DateBadge\>Jan 10 \- Feb 25\</DateBadge\>  
      \</Meta\>  
    \</PlanCard\>  
  \</PlansList\>  
\</PlansOverview\>

---

### **Linking Plans to Entities**

**Player Profile:**

\<PlayerProfile\>  
  \<Tab label="Plans"\>  
    \<PlansSection\>  
      \<h3\>Active Plans\</h3\>  
      \<PlanList\>  
        \- Ankle Recovery (Rehabilitation) \- 50% complete  
        \- Season Development Goals \- 30% complete  
      \</PlanList\>  
      \<Button\>+ Create Plan for Marcus\</Button\>  
    \</PlansSection\>  
  \</Tab\>  
\</PlayerProfile\>

**Event Detail:**

\<EventDetail\>  
  \<Tab label="Preparation Plan"\>  
    \<EventPlan\>  
      {/\* Match preparation milestones \*/}  
      \- Opposition analysis (Complete)  
      \- Team selection (In Progress)  
      \- Tactical session (Pending)  
      \- Pre-match briefing (Pending)  
    \</EventPlan\>  
  \</Tab\>  
\</EventDetail\>

---

### **AI Integration**

User: "AI, create a rehabilitation plan for Marcus's ankle injury"

AI:  
1\. Uses "Rehabilitation Plan" template  
2\. Fills in: Player (Marcus), Duration (6 weeks from today)  
3\. Creates milestones: Assessment, Rest, Mobility, Running, Return, Clearance  
4\. Assigns to medical staff  
5\. Returns: "Rehab plan created for Marcus. View plan →"

User viewing plan: "AI, are we on track with this plan?"

AI:  
1\. Analyzes milestone completion vs timeline  
2\. Checks current progress  
3\. Returns: "Plan is on track. 50% complete at week 3 of 6\. Phase 2 progressing well. Next milestone (Running phase) starts in 4 days."

User: "AI, summarize all active plans"

AI:  
1\. Queries all plans with status "in\_progress"  
2\. Returns: "3 active plans:  
   \- Season Plan (45% complete, on track)  
   \- Marcus rehabilitation (50% complete, on track)  
   \- Bruno development plan (20% complete, behind schedule)"

---

### **Mobile Considerations**

**Plans list:**

* Card view with progress bars  
* Filter by status/type  
* Tap to view details

**Plan detail:**

* Vertical milestone list (easier than timeline on mobile)  
* Swipe to mark complete  
* Simple comment form

---

### **Styling with shadcn**

* Progress bars \= shadcn Progress component  
* Cards \= shadcn Card  
* Badges \= shadcn Badge  
* Timeline \= custom CSS with shadcn colors  
* All inputs/buttons \= shadcn

---

### **Build Effort**

**Core planning system:** 1.5 weeks

* Plan CRUD  
* Milestone CRUD  
* List view  
* Basic detail view

**Timeline visualization:** 3-4 days

* Horizontal timeline  
* Status colors  
* Interactive

**Linking system:** 3 days

* Link plans to entities  
* Link milestones to notes/forms/files

**Templates:** 2-3 days

* Pre-built plan templates  
* Template application

**Comments/collaboration:** 2 days

* Comment system  
* Updates feed

# **Spreadsheets**

## **Spreadsheets \- Full Picture**

### **What Spreadsheets Do**

1. **Users create spreadsheets** \- define columns with types  
2. **Paste/import data** \- from Excel, CSV, or manual entry  
3. **Work in sandbox** \- data lives in React state (not saved yet)  
4. **Save to database** \- user decides when to persist  
5. **Reference entities** \- link to people, events, teams in system  
6. **Report on data** \- saved spreadsheets queryable in Reports section

---

### **Tech Stack**

* **React Datasheet Grid** \- Excel-like grid with paste, edit, keyboard nav  
* **Custom column types** \- for person, event, team references  
* **Templates** \- pre-built spreadsheets users can download/use  
* **CSV import/export** \- with type hints for entity mapping

---

### **Column Types**

**Basic types:**

* Text  
* Number  
* Date

**Entity references:**

* Person (links to player/staff)  
* Event (links to calendar events)  
* Team (internal teams or opposition)

**Formulas** (add later):

* Total Load \= Duration × RPE

---

### **User Flow**

### **Scenario 1: Use Template**

1. User: "Create spreadsheet"  
2. System: "Start blank or use template?"  
3. User: "Template → Weekly Player Load"  
4. Spreadsheet created with typed columns (Player, Date, RPE, Duration)  
5. User fills data (Player column \= dropdown of people)  
6. Clicks "Save to Database"

### **Scenario 2: Paste from Excel**

1. User creates blank spreadsheet  
2. Copies 50 rows from Excel  
3. Pastes into grid (data in sandbox)  
4. User reviews, fixes errors  
5. Clicks "Save to Database"  
6. System maps player names to Person records

### **Scenario 3: Copy Columns**

1. User has "Weekly Load" spreadsheet  
2. User creates new "Injury Log"  
3. User: "Copy columns from Weekly Load"  
4. Selects "Player" column  
5. New spreadsheet inherits typed Player column

---

### **Data Model**

prisma  
model Spreadsheet {  
  id        String @id  
  name      String  
  orgId     String  
  createdBy String  
    
  // Column definitions  
  columns   Json // \[{name: "Player", type: "person"}, {name: "Load", type: "number"}\]  
    
  // Actual data  
  rows      SpreadsheetRow\[\]  
}

model SpreadsheetRow {  
  id            String @id  
  spreadsheetId String  
  data          Json // {player: "person\_123", load: 850, date: "2025-01-15"}  
  createdAt     DateTime

}

---

### **Templates**

Pre-built spreadsheets:

* Weekly Player Load  
* Daily Wellness Tracking  
* Injury Log  
* Match Stats  
* Training Attendance  
* GPS Data Import

**Template structure:**

json  
{  
  name: "Weekly Player Load",  
  columns: \[  
    {name: "Player", type: "person", settings: {filter: "players"}},  
    {name: "Date", type: "date"},  
    {name: "Session Type", type: "text"},  
    {name: "Duration", type: "number"},  
    {name: "RPE", type: "number"},  
    {name: "Total Load", type: "formula", formula: "duration \* rpe"}  
  \]

}

Community Hub for user-created templates.

---

### **CSV Import with Type Hints**

**Option A: Naming convention**

csv  
player\_name,date,rpe,duration  
Marcus Rashford,2025-01-15,7,90

Bruno Fernandes,2025-01-15,6,85

System infers types from column names.

**Option B: Metadata row**

csv  
\#person,\#date,\#number,\#number

Marcus Rashford,2025-01-15,7,90

First row tells system exact types.

User uploads → System shows preview → User confirms mapping → Imports to database.

---

### **Entity Mapping**

When user pastes "Marcus Rashford" in Person column:

1. System searches for Person with name matching "Marcus Rashford"  
2. If found: Links to `person_123`  
3. If not found: Shows dialog "Map this name to a person" or "Create new person"  
4. User confirms mapping  
5. Data saved with proper references

---

### **Sandbox → Save Pattern**

tsx  
\<Spreadsheet\>  
  \<Toolbar\>  
    {\!isSaved && (  
      \<\>  
        \<Badge variant\="warning"\>Unsaved changes\</Badge\>  
        \<Button onClick\={save}\>Save to Database\</Button\>  
      \</\>  
    )}  
    {isSaved && (  
      \<Badge variant\="success"\>Saved\</Badge\>  
    )}  
  \</Toolbar\>  
    
  \<DataSheetGrid   
    value\={rows}  
    onChange\={setRows} *// just React state*  
  /\>  
\</Spreadsheet\>  
\`\`\`

\*\*Benefits:\*\*  
\- Fast editing (no database round-trips)  
\- User reviews before saving  
\- Can discard if mistake  
\- Autosave option available

\---

\#\#\# \*\*AI Integration\*\*  
\`\`\`  
User: "AI, create a load tracking sheet for all first team players for this week"

AI:  
1\. Fetches people with tag "first\_team"  
2\. Creates spreadsheet with columns: Player (person), Date, Load (number)  
3\. Pre\-populates rows with each player \+ dates for this week  
4\. User just fills in load values  
5\. Saves to database  
\`\`\`  
\`\`\`  
User: "AI, clean up this data and add weekly averages"

AI:  
1\. Analyzes current spreadsheet data  
2\. Fixes formatting issues  
3\. Adds "Weekly Average" column with calculated values  
4\. Returns updated rows

5\. User reviews and saves

---

### **Reporting Integration**

Once saved, Reports section can:

* Query all spreadsheets in org  
* Filter by spreadsheet type (load tracking, wellness, etc.)  
* Aggregate data (average load per player)  
* Visualize trends (charts, graphs)  
* Cross-reference with forms data

Example:

* Spreadsheet: "Weekly Load" (player load data)  
* Form: "Daily Wellness" (sleep, soreness)  
* Report: "Load vs Recovery" (correlate high load with poor sleep)

---

### **Styling with shadcn**

React Datasheet Grid can be styled with CSS:

* Match shadcn color scheme  
* Use shadcn borders, spacing  
* Custom cell renderers use shadcn components (Select, Input, DatePicker)

Medium effort but achievable.

# **Reports**

## **Reports \- Full Picture**

### **What Reports Do**

1. **Visualize data** \- charts, graphs, dashboards from spreadsheets/forms/events  
2. **Cross-reference** \- combine data from multiple sources (wellness \+ load \+ attendance)  
3. **Templates** \- pre-built reports users can use  
4. **Custom reports** \- users build their own  
5. **Export** \- PDF, image, share link  
6. **Scheduling** \- auto-generate weekly/monthly reports  
7. **AI-powered** \- generate insights, identify patterns

---

### **Tech Stack**

* **Recharts** or **Chart.js** (free, MIT) \- charting library  
* **Custom report builder** \- drag-and-drop interface (you build)  
* **PDF generation** \- jsPDF or Puppeteer  
* **Query builder** \- filter/aggregate data from spreadsheets/forms  
* **shadcn components** \- cards, tabs, filters

---

### **Report Types**

### **1\. Pre-built Reports (Templates)**

**Player Reports:**

* Player Performance Summary (wellness, load, attendance)  
* Injury History & Recovery  
* Match Statistics Season Summary  
* Training Load Trends (4-week rolling average)

**Team Reports:**

* Squad Wellness Overview (heatmap)  
* Attendance Report (by event type, date range)  
* Load Distribution Across Squad  
* Form Completion Rates

**Medical Reports:**

* Injury Incidence Rate  
* Time Loss Injuries  
* Medical Clearance Status  
* Return to Play Progress

**Performance Reports:**

* GPS Data Analysis (distance, high-speed runs)  
* Match Day Report (stats, observations, notes)  
* Training Session Analysis  
* Weekly/Monthly Summary

---

### **2\. Custom Reports (User-Built)**

Users select:

* **Data source** \- which spreadsheet(s), form(s), event data  
* **Visualization** \- chart type (line, bar, pie, table, heatmap)  
* **Filters** \- date range, players, tags, event types  
* **Aggregation** \- average, sum, count, min, max  
* **Layout** \- single chart or multi-section dashboard

---

### **User Flow**

### **Scenario 1: Use Pre-built Report**

\<ReportTemplates\>  
  \<h2\>Report Templates\</h2\>  
    
  \<TemplateGrid\>  
    \<TemplateCard\>  
      \<Icon\>👤\</Icon\>  
      \<h3\>Player Performance Summary\</h3\>  
      \<p\>Wellness, load, and attendance for individual player\</p\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    \<TemplateCard\>  
      \<Icon\>👥\</Icon\>  
      \<h3\>Squad Wellness Overview\</h3\>  
      \<p\>Team-wide wellness heatmap and trends\</p\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    \<TemplateCard\>  
      \<Icon\>🏥\</Icon\>  
      \<h3\>Injury Report\</h3\>  
      \<p\>Injury incidence and time loss analysis\</p\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
  \</TemplateGrid\>  
\</ReportTemplates\>

**After selecting template:**

\<ConfigureReport\>  
  \<h3\>Player Performance Summary\</h3\>  
    
  \<Select label="Select Player" required\>  
    {players.map(p \=\> \<option value={p.id}\>{p.name}\</option\>)}  
  \</Select\>  
    
  \<DateRange label="Date Range" default="last\_30\_days" /\>  
    
  \<PreviewReport\>  
    {/\* Live preview of report \*/}  
  \</PreviewReport\>  
    
  \<ButtonGroup\>  
    \<Button\>View Report\</Button\>  
    \<Button variant="outline"\>Save as PDF\</Button\>  
    \<Button variant="outline"\>Schedule\</Button\>  
  \</ButtonGroup\>  
\</ConfigureReport\>

---

### **Scenario 2: Build Custom Report**

\<CustomReportBuilder\>  
  \<h2\>Build Custom Report\</h2\>  
    
  \<Steps\>  
    \<Step active\>1. Select Data\</Step\>  
    \<Step\>2. Choose Visualization\</Step\>  
    \<Step\>3. Configure & Preview\</Step\>  
  \</Steps\>  
    
  {/\* Step 1: Select Data \*/}  
  \<DataSelection\>  
    \<h3\>Select Data Source\</h3\>  
      
    \<DataSourceList\>  
      \<DataSource\>  
        \<Checkbox /\>  
        \<Icon\>📊\</Icon\>  
        \<div\>  
          \<strong\>Weekly Load Tracking\</strong\>  
          \<p\>Spreadsheet · 250 rows\</p\>  
        \</div\>  
      \</DataSource\>  
        
      \<DataSource\>  
        \<Checkbox /\>  
        \<Icon\>📋\</Icon\>  
        \<div\>  
          \<strong\>Daily Wellness\</strong\>  
          \<p\>Form · 1,200 responses\</p\>  
        \</div\>  
      \</DataSource\>  
        
      \<DataSource\>  
        \<Checkbox /\>  
        \<Icon\>📅\</Icon\>  
        \<div\>  
          \<strong\>Training Sessions\</strong\>  
          \<p\>Events · 48 events\</p\>  
        \</div\>  
      \</DataSource\>  
    \</DataSourceList\>  
      
    \<Button\>Next: Choose Visualization\</Button\>  
  \</DataSelection\>  
    
  {/\* Step 2: Choose Visualization \*/}  
  \<VisualizationType\>  
    \<h3\>How do you want to visualize this data?\</h3\>  
      
    \<ChartTypes\>  
      \<ChartOption\>  
        \<Icon\>📈\</Icon\>  
        \<span\>Line Chart\</span\>  
        \<p\>Show trends over time\</p\>  
      \</ChartOption\>  
        
      \<ChartOption\>  
        \<Icon\>📊\</Icon\>  
        \<span\>Bar Chart\</span\>  
        \<p\>Compare values across categories\</p\>  
      \</ChartOption\>  
        
      \<ChartOption\>  
        \<Icon\>🥧\</Icon\>  
        \<span\>Pie Chart\</span\>  
        \<p\>Show proportions\</p\>  
      \</ChartOption\>  
        
      \<ChartOption\>  
        \<Icon\>🔥\</Icon\>  
        \<span\>Heatmap\</span\>  
        \<p\>Visualize patterns in data\</p\>  
      \</ChartOption\>  
        
      \<ChartOption\>  
        \<Icon\>📋\</Icon\>  
        \<span\>Table\</span\>  
        \<p\>Raw data view with sorting\</p\>  
      \</ChartOption\>  
    \</ChartTypes\>  
      
    \<Button\>Next: Configure\</Button\>  
  \</VisualizationType\>  
    
  {/\* Step 3: Configure \*/}  
  \<Configure\>  
    \<h3\>Configure Your Report\</h3\>  
      
    \<Config\>  
      \<Select label="X-axis"\>  
        \<option\>Date\</option\>  
        \<option\>Player\</option\>  
        \<option\>Event\</option\>  
      \</Select\>  
        
      \<Select label="Y-axis / Value"\>  
        \<option\>Load (sum)\</option\>  
        \<option\>Wellness Score (average)\</option\>  
        \<option\>Distance (average)\</option\>  
      \</Select\>  
        
      \<Filters\>  
        \<h4\>Filters\</h4\>  
        \<FilterRow\>  
          \<Select label="Players"\>  
            \<option\>All Players\</option\>  
            \<option\>First Team Only\</option\>  
            \<option\>Specific Players...\</option\>  
          \</Select\>  
        \</FilterRow\>  
        \<FilterRow\>  
          \<DateRange label="Date Range" /\>  
        \</FilterRow\>  
        \<FilterRow\>  
          \<TagFilter label="Tags" /\>  
        \</FilterRow\>  
      \</Filters\>  
        
      \<ChartOptions\>  
        \<h4\>Chart Options\</h4\>  
        \<Input label="Chart Title" placeholder="Load vs Wellness" /\>  
        \<Checkbox\>Show legend\</Checkbox\>  
        \<Checkbox\>Show data labels\</Checkbox\>  
        \<ColorPicker label="Color scheme" /\>  
      \</ChartOptions\>  
    \</Config\>  
      
    \<LivePreview\>  
      \<h4\>Preview\</h4\>  
      {/\* Chart renders here as user configures \*/}  
    \</LivePreview\>  
      
    \<ButtonGroup\>  
      \<Button\>Create Report\</Button\>  
      \<Button variant="outline"\>Save as Template\</Button\>  
    \</ButtonGroup\>  
  \</Configure\>  
\</CustomReportBuilder\>

---

### **Scenario 3: Multi-Section Dashboard**

\<DashboardBuilder\>  
  \<h2\>Build Dashboard\</h2\>  
    
  \<Canvas\>  
    {/\* Drag and drop report sections \*/}  
    \<Section size="full"\>  
      \<h3\>Squad Wellness \- Last 7 Days\</h3\>  
      \<HeatmapChart data={wellnessData} /\>  
    \</Section\>  
      
    \<Section size="half"\>  
      \<h3\>Average Load by Position\</h3\>  
      \<BarChart data={loadByPosition} /\>  
    \</Section\>  
      
    \<Section size="half"\>  
      \<h3\>Attendance Rate\</h3\>  
      \<DonutChart data={attendanceData} /\>  
      \<Stat\>94% overall\</Stat\>  
    \</Section\>  
      
    \<Section size="full"\>  
      \<h3\>Load Trends \- Last 4 Weeks\</h3\>  
      \<LineChart data={loadTrends} /\>  
    \</Section\>  
  \</Canvas\>  
    
  \<Sidebar\>  
    \<h4\>Add Section\</h4\>  
    \<Button\>+ Chart\</Button\>  
    \<Button\>+ Table\</Button\>  
    \<Button\>+ Stats Card\</Button\>  
    \<Button\>+ Text/Notes\</Button\>  
  \</Sidebar\>  
\</DashboardBuilder\>

---

### **Data Model**

model Report {  
  id          String @id  
  orgId       String  
  name        String  
  description String?  
    
  // Type  
  type        String // "single\_chart", "dashboard", "table"  
    
  // Based on template?  
  templateId  String?  
    
  // Report configuration  
  config      Json // {  
              //   dataSources: \[{type: "spreadsheet", id: "123"}\],  
              //   visualization: "line\_chart",  
              //   xAxis: "date",  
              //   yAxis: "load",  
              //   filters: {dateRange: "last\_30\_days", players: \["player\_123"\]},  
              //   chartOptions: {title: "Load Trends", showLegend: true}  
              // }  
    
  // Multi-section dashboard  
  sections    Json? // \[{type: "chart", config: {...}}, {type: "table", config: {...}}\]  
    
  // Scheduling  
  schedule    ReportSchedule?  
    
  // Access  
  isPublic    Boolean @default(false)  
  shareToken  String? @unique  
    
  createdBy   String  
  createdAt   DateTime  
  updatedAt   DateTime  
}

model ReportSchedule {  
  id          String @id  
  reportId    String @unique  
  report      Report @relation  
    
  frequency   String // "daily", "weekly", "monthly"  
  time        String // "09:00"  
  dayOfWeek   Int? // 1-7 for weekly  
  dayOfMonth  Int? // 1-31 for monthly  
    
  // Who gets it  
  recipients  String\[\] // user IDs or email addresses  
  format      String // "pdf", "link"  
    
  isActive    Boolean @default(true)  
  lastSent    DateTime?  
  nextSend    DateTime?  
}

model ReportTemplate {  
  id          String @id  
  orgId       String?  
  name        String  
  description String  
  category    String // "player", "team", "medical", "performance"  
    
  // Template config (same structure as Report.config)  
  config      Json  
  sections    Json?  
    
  // Global vs user-created  
  isGlobal    Boolean @default(false)  
  createdBy   String?  
    
  // Community Hub  
  downloads   Int @default(0)  
  rating      Float?  
    
  createdAt   DateTime  
}

---

### **Report Display**

\<ReportView\>  
  \<Header\>  
    \<div\>  
      \<h1\>{report.name}\</h1\>  
      \<p\>{report.description}\</p\>  
      \<Badge\>{report.type}\</Badge\>  
    \</div\>  
    \<Actions\>  
      \<Button variant="outline" onClick={refresh}\>  
        \<RefreshIcon /\> Refresh  
      \</Button\>  
      \<Button variant="outline" onClick={exportPDF}\>  
        \<DownloadIcon /\> Export PDF  
      \</Button\>  
      \<Button variant="outline" onClick={share}\>  
        \<ShareIcon /\> Share  
      \</Button\>  
      \<Button variant="ghost" onClick={edit}\>  
        \<EditIcon /\> Edit  
      \</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Filters\>  
    {/\* User can adjust filters without editing report \*/}  
    \<DateRangePicker value={dateRange} onChange={setDateRange} /\>  
    \<PlayerFilter value={players} onChange={setPlayers} /\>  
    \<TagFilter value={tags} onChange={setTags} /\>  
    \<Button onClick={applyFilters}\>Apply\</Button\>  
  \</Filters\>  
    
  \<ReportContent\>  
    {report.type \=== "single\_chart" && (  
      \<ChartSection\>  
        \<Chart config={report.config} data={reportData} /\>  
      \</ChartSection\>  
    )}  
      
    {report.type \=== "dashboard" && (  
      \<DashboardGrid\>  
        {report.sections.map(section \=\> (  
          \<Section key={section.id} size={section.size}\>  
            {section.type \=== "chart" && \<Chart config={section.config} /\>}  
            {section.type \=== "table" && \<Table config={section.config} /\>}  
            {section.type \=== "stats" && \<StatsCard config={section.config} /\>}  
          \</Section\>  
        ))}  
      \</DashboardGrid\>  
    )}  
      
    {report.type \=== "table" && (  
      \<TableView\>  
        \<Table data={reportData} config={report.config} /\>  
      \</TableView\>  
    )}  
  \</ReportContent\>  
    
  \<Notes\>  
    \<h3\>Report Notes\</h3\>  
    \<Tiptap content={notes} onChange={setNotes} /\>  
  \</Notes\>  
\</ReportView\>

---

### **Scheduled Reports**

\<ScheduleReport\>  
  \<h3\>Schedule Report: {report.name}\</h3\>  
    
  \<Select label="Frequency"\>  
    \<option\>Daily\</option\>  
    \<option\>Weekly\</option\>  
    \<option\>Monthly\</option\>  
  \</Select\>  
    
  {frequency \=== "weekly" && (  
    \<Select label="Day of Week"\>  
      \<option\>Monday\</option\>  
      \<option\>Tuesday\</option\>  
      {/\* ... \*/}  
    \</Select\>  
  )}  
    
  {frequency \=== "monthly" && (  
    \<Select label="Day of Month"\>  
      \<option\>1st\</option\>  
      \<option\>15th\</option\>  
      \<option\>Last day\</option\>  
    \</Select\>  
  )}  
    
  \<TimePicker label="Time" value="09:00" /\>  
    
  \<MultiSelect label="Recipients"\>  
    {staff.map(s \=\> \<option value={s.email}\>{s.name}\</option\>)}  
  \</MultiSelect\>  
    
  \<RadioGroup label="Format"\>  
    \<Radio value="pdf"\>PDF attachment\</Radio\>  
    \<Radio value="link"\>Link to view online\</Radio\>  
  \</RadioGroup\>  
    
  \<Button\>Schedule Report\</Button\>  
\</ScheduleReport\>

**Background job:**

* Runs at scheduled time  
* Generates report with current data  
* Exports to PDF or creates share link  
* Emails to recipients

---

### **Sharing Reports**

\<ShareReport\>  
  \<h3\>Share Report\</h3\>  
    
  \<ShareOptions\>  
    \<Option\>  
      \<strong\>Public Link\</strong\>  
      \<p\>Anyone with the link can view (no login)\</p\>  
      \<Input value={shareUrl} readOnly /\>  
      \<Button\>Copy Link\</Button\>  
    \</Option\>  
      
    \<Option\>  
      \<strong\>Embed Code\</strong\>  
      \<p\>Embed this report in a website\</p\>  
      \<Textarea value={embedCode} readOnly /\>  
      \<Button\>Copy Code\</Button\>  
    \</Option\>  
      
    \<Option\>  
      \<strong\>Email\</strong\>  
      \<p\>Send report to specific people\</p\>  
      \<MultiSelect label="Recipients" /\>  
      \<Button\>Send\</Button\>  
    \</Option\>  
  \</ShareOptions\>  
\</ShareReport\>

---

### **Cross-Referencing Data**

**Example: Load vs Wellness Report**

// Query data from multiple sources  
const loadData \= await getSpreadsheetData(spreadsheetId, {  
  dateRange: last30Days,  
  players: selectedPlayers  
})

const wellnessData \= await getFormResponses(formId, {  
  dateRange: last30Days,  
  players: selectedPlayers  
})

// Combine data by player and date  
const combinedData \= players.map(player \=\> {  
  return dates.map(date \=\> ({  
    player: player.name,  
    date: date,  
    load: loadData.find(d \=\> d.player \=== player.id && d.date \=== date)?.load,  
    wellness: wellnessData.find(d \=\> d.player \=== player.id && d.date \=== date)?.wellness  
  }))  
}).flat()

// Visualize correlation  
\<ScatterPlot   
  data={combinedData}  
  xAxis="load"  
  yAxis="wellness"  
  title="Load vs Wellness Correlation"  
/\>

---

### **Report Templates (Pre-built)**

**Player Performance Summary:**

{  
  "name": "Player Performance Summary",  
  "type": "dashboard",  
  "sections": \[  
    {  
      "type": "stats",  
      "title": "Overview",  
      "metrics": \["attendance\_rate", "avg\_wellness", "total\_load"\]  
    },  
    {  
      "type": "chart",  
      "visualization": "line",  
      "title": "Wellness Trend",  
      "dataSource": "wellness\_form",  
      "xAxis": "date",  
      "yAxis": "wellness\_score"  
    },  
    {  
      "type": "chart",  
      "visualization": "bar",  
      "title": "Load by Week",  
      "dataSource": "load\_spreadsheet",  
      "xAxis": "week",  
      "yAxis": "total\_load"  
    },  
    {  
      "type": "table",  
      "title": "Recent Forms",  
      "dataSource": "all\_forms",  
      "limit": 10  
    }  
  \]  
}

**Squad Wellness Overview:**

{  
  "name": "Squad Wellness Overview",  
  "type": "dashboard",  
  "sections": \[  
    {  
      "type": "chart",  
      "visualization": "heatmap",  
      "title": "Wellness Heatmap (Last 7 Days)",  
      "dataSource": "wellness\_form",  
      "rows": "players",  
      "columns": "dates",  
      "values": "wellness\_score"  
    },  
    {  
      "type": "stats",  
      "title": "Team Averages",  
      "metrics": \["avg\_sleep", "avg\_soreness", "avg\_energy"\]  
    },  
    {  
      "type": "chart",  
      "visualization": "bar",  
      "title": "Players Below Threshold",  
      "dataSource": "wellness\_form",  
      "filter": {"wellness\_score": {"$lt": 6}},  
      "xAxis": "player",  
      "yAxis": "count"  
    }  
  \]  
}

---

### **AI Integration**

User: "AI, create a report showing load trends for first team players this month"

AI:  
1\. Identifies data source (load spreadsheet)  
2\. Filters: players with tag "first\_team", current month  
3\. Creates line chart: date vs load  
4\. Returns: "Report created. View Load Trends →"

User viewing report: "AI, why is Marcus's wellness declining?"

AI:  
1\. Analyzes Marcus's wellness data from report  
2\. Cross-references with load data  
3\. Checks recent notes/events  
4\. Returns: "Marcus's wellness declined after high-load week (week of Jan 8). Load was 15% above average. Medical notes mention minor ankle soreness on Jan 10."

User: "AI, generate insights from this squad wellness report"

AI:  
1\. Analyzes heatmap patterns  
2\. Identifies outliers  
3\. Correlates with other data  
4\. Returns: "Key insights:   
   \- 3 players consistently below 6/10 wellness  
   \- Team wellness drops on Thursdays (post-Wednesday training)  
   \- Soreness correlates with match frequency"

---

### **Reporting on Reports**

**Meta-analytics:**

* Which reports are viewed most?  
* Which templates are most popular?  
* What data sources are most queried?  
* Report generation trends

**Use this to:**

* Improve templates  
* Optimize queries  
* Suggest reports to users

---

### **Mobile Considerations**

**Reports on mobile:**

* Prioritize single-chart views (simpler than dashboards)  
* Swipe between dashboard sections  
* Simplified filters  
* Share link \> PDF export (smaller file)

---

### **Styling with shadcn**

* Recharts styled to match shadcn colors  
* Report cards \= shadcn Card  
* Filters \= shadcn Select, DatePicker, etc.  
* Stats cards \= shadcn Card with custom styling

---

### **Build Effort**

**Pre-built report templates:** 1 week

* 5-10 templates  
* Config-driven rendering

**Custom report builder:** 2 weeks

* Data source selection  
* Visualization picker  
* Filter/config UI  
* Live preview

**Chart rendering:** 1 week

* Recharts integration  
* Multiple chart types  
* Styling

**PDF export:** 3-4 days

* Generate from HTML  
* Styling for print

**Scheduling:** 3-4 days

* Background jobs  
* Email delivery

**Sharing:** 2-3 days

* Public links  
* Embed codes

**Total: \~5-6 weeks for full Reports section**

# **Calendar**

## **Calendar \- Full Picture**

### **What Calendar Does**

1. **Users create events** \- training sessions, matches, meetings, medical appointments  
2. **Use templates** \- pre-configured workflows (Match Day, Training Session, etc.)  
3. **Assign people** \- who's attending/involved  
4. **Event as container** \- holds spreadsheets, notes, drawings, forms, files specific to that event  
5. **Track attendance** \- mark who attended, absent, injured  
6. **Trigger forms** \- send wellness form 90min after training  
7. **Sync externally** \- Google Calendar, Outlook integration  
8. **Report on events** \- aggregate data across event types

---

### **Tech Stack**

* **React Big Calendar** (free, MIT) \- month/week/day views  
* **date-fns** \- date manipulation  
* **Custom list view** \- simple table view  
* **rrule** \- recurring events (iCalendar standard)  
* **iCal export** \- download to external calendars  
* **OAuth integrations** \- Google Calendar API, Microsoft Graph

---

### **Event Templates**

**Pre-configured workflows for different event types:**

**Match Day Template:**

* Match Stats spreadsheet (goals, assists, minutes)  
* Opposition Analysis spreadsheet  
* Formation drawing (pitch with player positions)  
* Coach Observations notes (coaches only)  
* Medical Notes (medical staff only)  
* Post-Match Report form (sent 30min after to coaches)  
* Files section (scouting reports, highlights)

**Training Session Template:**

* GPS Data spreadsheet (distance, high speed runs)  
* Drill Performance spreadsheet  
* Session Plan drawing  
* Wellness Check form (sent 90min after to players)  
* Coach notes

**Medical Assessment Template:**

* Assessment Form  
* Injury notes (medical only)  
* Treatment plan document  
* Follow-up scheduled

Users can:

* Use templates as-is  
* Customize per event  
* Create new templates  
* Share templates in Community Hub

---

### **User Flow**

### **Scenario 1: Create Event from Template**

1. User: "Create Event"  
2. Selects: "Match Day" template  
3. Fills: Date, Opposition (Chelsea), Attendees  
4. Event created with all pre-configured sections  
5. User fills Match Stats spreadsheet during/after game  
6. Adds coach notes post-match  
7. Post-Match Report form auto-sends 30min after event ends

### **Scenario 2: Recurring Events**

1. User: "Create Training Session"  
2. Sets: Monday, Wednesday, Friday at 10:00am  
3. Repeat for 12 weeks  
4. System creates 36 events (each with template sections)  
5. User can edit individual instances

### **Scenario 3: Track Attendance**

1. Event: "Training Session \- Jan 15"  
2. After session, staff marks attendance  
3. Each player: Attended, Absent, Injured, or Excused  
4. Attendance data saved, reportable

---

### **Data Model**

prisma  
model EventTemplate {  
  id          String @id  
  orgId       String  
  name        String // "Match Day", "Training Session"  
    
  // What sections are enabled  
  sections    Json // {spreadsheets: true, notes: true, drawing: true, forms: true, files: true}  
    
  // Pre-configured sections  
  sectionConfigs Json // {  
                 //   spreadsheets: \[{name: "Match Stats", template: "..."}\],  
                 //   forms: \[{name: "Post-Match Report", trigger: "after", delay: 30}\]  
                 // }  
    
  isGlobal    Boolean  
  createdBy   String?  
}

model Event {  
  id          String @id  
  orgId       String  
  title       String  
    
  // Based on template  
  templateId  String?  
  template    EventTemplate? @relation  
    
  // When/Where  
  startTime   DateTime  
  endTime     DateTime  
  location    String?  
    
  // Who  
  attendees   Person\[\]  
    
  // Opposition (for matches)  
  oppositionId String?  
  opposition   Team? @relation  
    
  // Recurrence  
  recurrenceRule Json?  
  parentEventId  String?  
    
  // Event-specific data containers  
  spreadsheets EventSpreadsheet\[\]  
  notes        EventNote\[\]  
  drawings     EventDrawing\[\]  
  forms        EventForm\[\]  
  files        EventFile\[\]  
    
  // Attendance  
  attendance  EventAttendance\[\]  
    
  createdBy   String  
  createdAt   DateTime  
}

model EventAttendance {  
  id        String @id  
  eventId   String  
  personId  String  
  status    String // "attending", "absent", "injured", "excused"  
    
  @@unique(\[eventId, personId\])

}

---

### **Event Detail View**

tsx  
\<EventDetail\>  
  \<Header\>  
    \<h1\>Manchester United vs Chelsea\</h1\>  
    \<p\>Match | Jan 15, 2025 | 3:00 PM\</p\>  
    \<Badge\>Based on: Match Day template\</Badge\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label\="Overview"\>  
      {*/\* Basic info: date, attendees, location, opposition \*/*}  
    \</Tab\>  
      
    \<Tab label\="Spreadsheets"\>  
      \- Match Stats (18/25 players entered)  
      \- Opposition Analysis (completed)  
      \[+ Add Spreadsheet\]  
    \</Tab\>  
      
    \<Tab label\="Notes"\>  
      \- Coach Observations (3 notes)  
      \- Medical Notes (1 note)  
      \[+ Add Note\]  
    \</Tab\>  
      
    \<Tab label\="Drawings"\>  
      \- Formation (completed)  
      \- Set Pieces (in progress)  
      \[+ Add Drawing\]  
    \</Tab\>  
      
    \<Tab label\="Forms"\>  
      \- Post-Match Report (3/5 completed)  
      \[+ Add Form\]  
    \</Tab\>  
      
    \<Tab label\="Files"\>  
      \- Scouting Report.pdf  
      \- Match Highlights.mp4  
      \[+ Upload File\]  
    \</Tab\>  
  \</Tabs\>

\</EventDetail\>

---

### **Form Triggers**

prisma  
model FormTrigger {  
  id          String @id  
  formId      String  
  eventType   String // "training", "match"  
  timing      String // "before", "after"  
  delay       Int // minutes (90 \= 90min after)  
  recipientType String // "attendees", "all\_players"  
  isActive    Boolean  
}  
\`\`\`

\*\*Flow:\*\*  
1\. Event "Training Session" ends at 11:00am  
2\. System checks FormTriggers for "training" type  
3\. Finds: "Send wellness form 90min after"  
4\. At 12:30pm, sends form to all attendees  
5\. Responses linked to event

\---

\#\#\# \*\*Views\*\*

\*\*Month view\*\* \- see all events in month    
\*\*Week view\*\* \- time slots, drag to resize/move    
\*\*Day view\*\* \- detailed schedule    
\*\*List view\*\* \- table with filters (date range, event type, person)

\---

\#\#\# \*\*External Calendar Sync\*\*

\*\*Google Calendar:\*\*  
\- OAuth connection  
\- Two-way sync  
\- Events created in SimpleAM → appear in Google  
\- Events from Google → imported to SimpleAM

\*\*Outlook/Microsoft 365:\*\*  
\- Same via Microsoft Graph API

\*\*iCal export:\*\*  
\- Download .ics file  
\- Import to any calendar app

\---

\#\#\# \*\*Template Marketplace (Community Hub)\*\*

\*\*Global templates\*\* (you provide):  
\- Match Day  
\- Training Session  
\- Recovery Session  
\- Medical Assessment

\*\*User-created templates:\*\*  
\- Save customized events as templates  
\- Share with community  
\- Download/rate others' templates  
\- Sport-specific (Football Match Day vs Rugby Match Day)

\---

\#\#\# \*\*AI Integration\*\*  
\`\`\`  
User: "AI, set up a match day event for Chelsea on Saturday"

AI:  
1\. Uses "Match Day" template  
2\. Creates event: "vs Chelsea", Saturday 3pm  
3\. Adds opposition team from system  
4\. Pre-populates Match Stats with squad  
5\. Sets up Formation drawing  
6\. Schedules Post-Match Report form  
7\. User reviews and saves  
\`\`\`  
\`\`\`  
User: "AI, who has the best attendance this month?"

AI:  
1\. Queries all events in January  
2\. Calculates attendance % per player

3\. Returns ranked list

---

### **Reporting on Events**

**Query across events:**

* Total goals by Marcus across all Match Days this season  
* Average GPS distance per Training Session  
* Form completion rates by event type  
* Attendance patterns (who misses most sessions?)

**Cross-reference with other data:**

* High load in training → poor wellness scores next day  
* Attendance at training → performance in matches

---

### **Modularity**

**Event data can be:**

* Event-specific only (exists just for this event)  
* Linked to global entities (Match Stats spreadsheet also appears in Spreadsheets section)

**User decides per item.**

Everything connects.

# **Forms**

## **Forms \- Full Picture**

### **What Forms Do**

1. **Staff creates forms** \- custom fields, any structure  
2. **Distribute to people** \- one-time, scheduled, or event-triggered  
3. **People fill out forms** \- via magic link (no login)  
4. **Responses stored** \- linked to person, reportable  
5. **Track completion** \- who filled it, who's pending, send reminders

---

### **Tech Stack**

* **React Hook Form \+ Zod** \- form state \+ validation  
* **Custom form builder** \- list-based UI to create forms (you build)  
* **Custom form renderer** \- renders JSON schema with shadcn components (you build)  
* **Resend** \- email magic links  
* **BullMQ \+ Redis** \- scheduling and background jobs

---

### **Distribution Methods**

1. **One-time** \- send to specific people now  
2. **Scheduled** \- daily at 12:30pm to all players  
3. **Event-triggered** \- 90min after every training session

---

### **Access Pattern**

**Magic links (no login required):**

* Player gets email: "Complete your wellness check"  
* Clicks link → form opens (pre-filled with their name)  
* Fills form → submits  
* Link expires

**Staff portal (logged in):**

* Staff selects player from dropdown  
* Fills form for that player  
* Submits (creates response linked to player)

---

### **Data Model**

prisma

model Form {

  id          String

  name        String

  fields      Json // \[{label: "Sleep", type: "rating"}\]


  distributions FormDistribution\[\]

  responses     FormResponse\[\]

}

model FormDistribution {

  id          String

  formId      String

  type        String // "one\_time", "scheduled", "recurring"

  recipients  String\[\] // person IDs

  sendAt      DateTime?

  schedule    Json? // {time: "12:30", days: \["mon","tue"\]}

}

model FormResponse {

  id          String

  formId      String

  personId    String

  data        Json // {field\_1: 8, field\_2: "sore"}

  submittedAt DateTime

  status      String // "pending" or "completed"

}

\`\`\`

\---

\#\#\# \*\*Templates\*\*

Pre-built forms (like spreadsheets):

\- Daily Wellness

\- Injury Report

\- Match Readiness

\- Training Feedback

Community Hub for sharing custom forms.

\---

\#\#\# \*\*AI Integration\*\*

\`\`\`

User: "AI, create a post-match feedback form"

AI generates JSON schema:

{

  fields: \[

    {label: "Performance Rating", type: "rating"},

    {label: "What went well?", type: "textarea"},

    {label: "Areas to improve", type: "textarea"}

  \]

}

Form created, ready to send.

---

### **Tracking & Reminders**

Dashboard shows:

* Who completed form (18/25)  
* Who's pending (7)  
* Send reminders (auto or manual)

---

### **Reporting**

Form responses queryable:

* All wellness data for Marcus (last 30 days)  
* Team average sleep quality  
* Filter: who reported soreness?  
* Import into spreadsheets  
* Visualize in reports section

# **Staff**

## **Staff \- Full Picture**

### **What Staff Section Does**

1. **Staff list** \- view all staff in the org  
2. **Individual profiles** \- roles (tags), contact info, permissions  
3. **Permission management** \- assign system permissions (medical access, admin, etc.)  
4. **Role management** \- assign flexible role tags (Head Coach, Physio, etc.)  
5. **Quick actions** \- message, edit permissions/roles, view activity  
6. **Flexible organization** \- filter by role tags, permissions  
7. **Cross-org membership** \- staff can work with multiple orgs

---

### **Tech Stack**

* **TanStack Table** \- for staff list view  
* **Custom profile view** \- simpler than player profiles  
* **shadcn components** \- forms, cards, badges  
* **Search/filter** \- built with TanStack Table features

---

### **Roles vs Permissions**

**Roles** \= Job function tags (user-defined, flexible)

* Examples: "Head Coach", "Assistant Coach", "Physiotherapist", "Sports Psychologist"  
* Descriptive labels  
* Org creates their own  
* Can have multiple

**Permissions** \= System access controls (fixed set)

* `admin` \- manage org, users, billing  
* `medical_access` \- view medical notes/data  
* `mental_health_access` \- view psychology notes/data  
* `manage_players` \- add/edit/remove players  
* `manage_events` \- create/edit events  
* `manage_forms` \- create/distribute forms  
* `view_reports` \- access reports section

---

### **Two Views**

### **1\. Staff List**

Table view of all staff in org:

\<StaffList\>  
  \<Toolbar\>  
    \<Search placeholder="Search staff..." /\>  
    \<FilterSelect label="Role"\>  
      \<option\>All\</option\>  
      {/\* User-defined roles \*/}  
      \<option\>Head Coach\</option\>  
      \<option\>Assistant Coach\</option\>  
      \<option\>Physiotherapist\</option\>  
      \<option\>Performance Analyst\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Permissions"\>  
      \<option\>All\</option\>  
      \<option\>Admin\</option\>  
      \<option\>Medical Access\</option\>  
      \<option\>Mental Health Access\</option\>  
    \</FilterSelect\>  
    \<Button\>+ Add Staff\</Button\>  
    \<Button\>Invite User\</Button\>  
  \</Toolbar\>  
    
  \<Table\>  
    \<thead\>  
      \<tr\>  
        \<th\>Name\</th\>  
        \<th\>Roles\</th\>  
        \<th\>Permissions\</th\>  
        \<th\>Email\</th\>  
        \<th\>Last Active\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {staff.map(person \=\> (  
        \<tr onClick={() \=\> openProfile(person.id)}\>  
          \<td\>  
            \<Avatar src={person.photo} /\>  
            {person.name}  
          \</td\>  
          \<td\>  
            {person.roles.map(role \=\> \<Badge\>{role}\</Badge\>)}  
          \</td\>  
          \<td\>  
            {person.permissions.map(perm \=\> (  
              \<Badge variant="outline"\>{perm}\</Badge\>  
            ))}  
          \</td\>  
          \<td\>{person.email}\</td\>  
          \<td\>{person.lastActive}\</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item\>View Profile\</Item\>  
              \<Item\>Edit Roles\</Item\>  
              \<Item\>Edit Permissions\</Item\>  
              \<Item\>Remove from Org\</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</Table\>  
\</StaffList\>

**Features:**

* Sort by any column  
* Filter by role tags or permissions  
* Search by name, email  
* Export to CSV

---

### **2\. Staff Profile (Individual View)**

\<StaffProfile\>  
  \<Header\>  
    \<Avatar large src={person.photo} /\>  
    \<div\>  
      \<h1\>{person.name}\</h1\>  
      \<div\>  
        {person.roles.map(role \=\> \<Badge\>{role}\</Badge\>)}  
      \</div\>  
    \</div\>  
    \<Actions\>  
      \<Button\>Edit Profile\</Button\>  
      \<Button\>Edit Roles & Permissions\</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Overview"\>  
      \<ContactInfo\>  
        \<Field label="Email"\>{person.email}\</Field\>  
        \<Field label="Phone"\>{person.phone}\</Field\>  
        \<Field label="Joined"\>{person.createdAt}\</Field\>  
        \<Field label="Last Active"\>{person.lastActive}\</Field\>  
      \</ContactInfo\>  
        
      \<Roles\>  
        \<h3\>Roles (Job Functions)\</h3\>  
        \<p\>Descriptive labels for what this person does\</p\>  
        \<TagList\>  
          {person.roles.map(role \=\> \<Tag\>{role}\</Tag\>)}  
        \</TagList\>  
        \<Button\>Edit Roles\</Button\>  
      \</Roles\>  
        
      \<Permissions\>  
        \<h3\>System Permissions\</h3\>  
        \<p\>What this person can access and manage\</p\>  
          
        \<PermissionList\>  
          \<Permission active={hasPermission('admin')}\>  
            \<Icon\>⚙️\</Icon\>  
            \<div\>  
              \<strong\>Admin\</strong\>  
              \<p\>Manage org settings, users, billing\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('medical\_access')}\>  
            \<Icon\>🏥\</Icon\>  
            \<div\>  
              \<strong\>Medical Access\</strong\>  
              \<p\>View and create medical notes/data\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('mental\_health\_access')}\>  
            \<Icon\>🧠\</Icon\>  
            \<div\>  
              \<strong\>Mental Health Access\</strong\>  
              \<p\>View and create psychology notes\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('manage\_players')}\>  
            \<Icon\>👥\</Icon\>  
            \<div\>  
              \<strong\>Manage Players\</strong\>  
              \<p\>Add, edit, remove players\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('manage\_events')}\>  
            \<Icon\>📅\</Icon\>  
            \<div\>  
              \<strong\>Manage Events\</strong\>  
              \<p\>Create and edit calendar events\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('manage\_forms')}\>  
            \<Icon\>📋\</Icon\>  
            \<div\>  
              \<strong\>Manage Forms\</strong\>  
              \<p\>Create and distribute forms\</p\>  
            \</div\>  
          \</Permission\>  
            
          \<Permission active={hasPermission('view\_reports')}\>  
            \<Icon\>📊\</Icon\>  
            \<div\>  
              \<strong\>View Reports\</strong\>  
              \<p\>Access reports section\</p\>  
            \</div\>  
          \</Permission\>  
        \</PermissionList\>  
          
        \<Button\>Edit Permissions\</Button\>  
      \</Permissions\>  
    \</Tab\>  
      
    \<Tab label="Activity"\>  
      \<RecentActivity\>  
        \<h3\>Recent Activity\</h3\>  
        \<ActivityList\>  
          \- Added note to Marcus Rashford (2 hours ago)  
          \- Created form "Daily Wellness" (yesterday)  
          \- Updated Match Stats spreadsheet (2 days ago)  
          \- Added players to training session (3 days ago)  
        \</ActivityList\>  
      \</RecentActivity\>  
        
      \<ActivityStats\>  
        \<Stat label="Notes Created"\>45\</Stat\>  
        \<Stat label="Forms Created"\>12\</Stat\>  
        \<Stat label="Events Created"\>28\</Stat\>  
      \</ActivityStats\>  
    \</Tab\>  
      
    \<Tab label="Notes"\>  
      {/\* Notes created by this staff member \*/}  
      \<StaffNotes\>  
        \<FilterBar\>  
          \<Select label="Visibility"\>  
            \<option\>All My Notes\</option\>  
            \<option\>Public\</option\>  
            \<option\>Private\</option\>  
          \</Select\>  
          \<Select label="Attached to"\>  
            \<option\>All\</option\>  
            \<option\>Players\</option\>  
            \<option\>Events\</option\>  
            \<option\>Standalone\</option\>  
          \</Select\>  
        \</FilterBar\>  
          
        \<NotesList\>  
          {/\* All notes authored by this staff member \*/}  
        \</NotesList\>  
      \</StaffNotes\>  
    \</Tab\>  
  \</Tabs\>  
\</StaffProfile\>

---

### **Data Model**

model User {  
  id            String @id  
  email         String @unique  
  name          String  
  phone         String?  
  photo         String?  
    
  // Supabase auth ID  
  authId        String @unique  
    
  // Org memberships  
  memberships   OrgMember\[\]  
    
  // Activity  
  lastActive    DateTime?  
  createdAt     DateTime  
}

model OrgMember {  
  id     String @id  
    
  userId String  
  user   User @relation(fields: \[userId\], references: \[id\])  
    
  orgId  String  
  org    Organization @relation(fields: \[orgId\], references: \[id\])  
    
  // Roles (flexible, user-defined tags)  
  roles  String\[\] // \["Head Coach", "Performance Analyst"\]  
    
  // System permissions (fixed set)  
  permissions String\[\] // \["admin", "medical\_access", "manage\_players"\]  
    
  joinedAt DateTime @default(now())  
    
  @@unique(\[userId, orgId\])  
}

**Key: Staff \= Users (can log in, have accounts)**

---

### **Adding Staff**

**Two methods:**

### **Method 1: Invite Existing User**

\<InviteStaffModal\>  
  \<Input label="Email" type="email" required /\>  
    
  \<TagInput label="Roles" placeholder="Add roles..."\>  
    {/\* User types: "Head Coach", "Performance Analyst" \*/}  
  \</TagInput\>  
    
  \<CheckboxGroup label="System Permissions"\>  
    \<Checkbox\>Admin\</Checkbox\>  
    \<Checkbox\>Medical Access\</Checkbox\>  
    \<Checkbox\>Mental Health Access\</Checkbox\>  
    \<Checkbox\>Manage Players\</Checkbox\>  
    \<Checkbox\>Manage Events\</Checkbox\>  
    \<Checkbox\>Manage Forms\</Checkbox\>  
    \<Checkbox\>View Reports\</Checkbox\>  
  \</CheckboxGroup\>  
    
  \<Button\>Send Invite\</Button\>  
\</InviteStaffModal\>

**Flow:**

1. Admin enters email \+ roles \+ permissions  
2. System sends invite email  
3. User clicks link → joins org  
4. User can now access org with assigned permissions

### **Method 2: Create Staff Directly**

\<AddStaffForm\>  
  \<Input label="Name" required /\>  
  \<Input label="Email" type="email" required /\>  
  \<Input label="Phone" /\>  
    
  \<TagInput label="Roles" placeholder="Add roles..." /\>  
    
  \<CheckboxGroup label="System Permissions"\>  
    \<Checkbox\>Admin\</Checkbox\>  
    \<Checkbox\>Medical Access\</Checkbox\>  
    \<Checkbox\>Mental Health Access\</Checkbox\>  
    \<Checkbox\>Manage Players\</Checkbox\>  
    \<Checkbox\>Manage Events\</Checkbox\>  
    \<Checkbox\>Manage Forms\</Checkbox\>  
    \<Checkbox\>View Reports\</Checkbox\>  
  \</CheckboxGroup\>  
    
  \<Button\>Add Staff & Send Invite\</Button\>  
\</AddStaffForm\>

---

### **Editing Roles**

\<EditRolesModal\>  
  \<h3\>Edit Roles for {staff.name}\</h3\>  
  \<p\>Roles are flexible labels describing job functions\</p\>  
    
  \<TagInput   
    label="Roles"   
    value={staff.roles}  
    placeholder="Add or remove roles..."  
    suggestions={commonRoles} // "Head Coach", "Physio", etc.  
  /\>  
    
  \<Button\>Save Changes\</Button\>  
\</EditRolesModal\>

**Roles are just tags \- completely flexible.**

---

### **Editing Permissions**

\<EditPermissionsModal\>  
  \<h3\>Edit System Permissions for {staff.name}\</h3\>  
  \<p\>Control what this person can access and manage\</p\>  
    
  \<CheckboxGroup\>  
    \<Checkbox checked={has('admin')}\>  
      \<div\>  
        \<strong\>Admin\</strong\>  
        \<p\>Full access: manage org settings, users, billing\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('medical\_access')}\>  
      \<div\>  
        \<strong\>Medical Access\</strong\>  
        \<p\>View and create medical notes, access injury data\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('mental\_health\_access')}\>  
      \<div\>  
        \<strong\>Mental Health Access\</strong\>  
        \<p\>View and create psychology notes, private sessions\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('manage\_players')}\>  
      \<div\>  
        \<strong\>Manage Players\</strong\>  
        \<p\>Add, edit, remove players from squad\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('manage\_events')}\>  
      \<div\>  
        \<strong\>Manage Events\</strong\>  
        \<p\>Create and edit calendar events\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('manage\_forms')}\>  
      \<div\>  
        \<strong\>Manage Forms\</strong\>  
        \<p\>Create forms and manage distributions\</p\>  
      \</div\>  
    \</Checkbox\>  
      
    \<Checkbox checked={has('view\_reports')}\>  
      \<div\>  
        \<strong\>View Reports\</strong\>  
        \<p\>Access reports and analytics section\</p\>  
      \</div\>  
    \</Checkbox\>  
  \</CheckboxGroup\>  
    
  \<Button\>Save Changes\</Button\>  
\</EditPermissionsModal\>

**Permissions are fixed, controlled access.**

---

### **Permission Checks**

**Throughout the app:**

// Can user see medical notes?  
const canSeeMedicalNotes \=   
  user.permissions.includes('medical\_access') ||   
  user.permissions.includes('admin')

// Can user edit org settings?  
const canEditOrg \= user.permissions.includes('admin')

// Can user create events?  
const canCreateEvents \=   
  user.permissions.includes('manage\_events') ||   
  user.permissions.includes('admin')

// Can user add players?  
const canAddPlayers \=   
  user.permissions.includes('manage\_players') ||   
  user.permissions.includes('admin')

**Admin permission \= access to everything.**

---

### **Removing Staff**

\<RemoveStaffModal\>  
  \<h3\>Remove {staff.name} from {org.name}?\</h3\>  
    
  \<Warning\>  
    This will:  
    \- Remove their access to this org  
    \- They'll keep their account and other org memberships  
    \- Their historical data (notes, forms created) will remain  
  \</Warning\>  
    
  \<Button variant="destructive"\>Remove from Org\</Button\>  
  \<Button variant="ghost"\>Cancel\</Button\>  
\</RemoveStaffModal\>

**Removal:**

* User removed from `OrgMember` table  
* Can no longer access this org  
* User account and other memberships intact  
* Historical data (notes authored, forms created) remains

---

### **Multi-Org Staff**

**User can be staff in multiple orgs:**

\<OrgSwitcher\>  
  \<CurrentOrg\>  
    \<Avatar src={currentOrg.logo} /\>  
    \<div\>  
      \<strong\>{currentOrg.name}\</strong\>  
      \<p\>{currentMembership.roles.join(', ')}\</p\>  
    \</div\>  
  \</CurrentOrg\>  
    
  \<Divider /\>  
    
  \<OrgList\>  
    \<h4\>Switch Organization\</h4\>  
    {user.memberships.map(membership \=\> (  
      \<OrgOption onClick={() \=\> switchOrg(membership.orgId)}\>  
        \<Avatar src={membership.org.logo} /\>  
        \<div\>  
          \<strong\>{membership.org.name}\</strong\>  
          \<p\>{membership.roles.join(', ')}\</p\>  
          \<Badges\>  
            {membership.permissions.map(p \=\> (  
              \<Badge variant="outline"\>{p}\</Badge\>  
            ))}  
          \</Badges\>  
        \</div\>  
      \</OrgOption\>  
    ))}  
  \</OrgList\>  
    
  \<Divider /\>  
    
  \<Button\>+ Create New Org\</Button\>  
\</OrgSwitcher\>

**When staff switches orgs:**

* UI shows that org's data only (RLS enforces this)  
* Permissions change based on membership in that org  
* Different roles/permissions per org  
* Completely separate contexts

---

### **Staff Activity Log**

model ActivityLog {  
  id        String @id  
  userId    String  
  orgId     String  
    
  action    String // "created\_note", "sent\_form", "updated\_player"  
  entityType String? // "note", "form", "player", "event"  
  entityId   String?  
    
  metadata  Json? // additional context  
    
  timestamp DateTime @default(now())  
}

**Tracked actions:**

* Created note  
* Sent form  
* Added player  
* Created event  
* Updated spreadsheet  
* Edited permissions  
* Invited user

**Used for:**

* Staff profile activity tab  
* Audit trail  
* Usage analytics

---

### **AI Integration**

User: "AI, who are the most active staff members this month?"

AI:  
1\. Queries ActivityLog for current month  
2\. Groups by userId  
3\. Returns: "Top 3: Coach Johnson (45 actions), Dr. Smith (medical, 38 actions), Sarah (performance analyst, 32 actions)"

Admin: "AI, suggest permission changes based on activity"

AI:  
1\. Analyzes who's creating medical notes without medical\_access  
2\. Checks who's frequently blocked by permissions  
3\. Returns: "Consider giving medical\_access to: Dr. Wilson (creating many medical notes as workaround)"

User: "AI, summarize what Coach Johnson did this week"

AI:  
1\. Queries ActivityLog for Coach Johnson, last 7 days  
2\. Returns: "Created 3 training events, sent wellness form to 25 players, added 8 notes to player profiles, updated Match Stats spreadsheet"

---

### **Reporting on Staff**

**Reports can track:**

* Staff activity levels (who's using the system most?)  
* Permission utilization (which permissions are most used?)  
* Contribution patterns (who creates most notes/forms/events?)  
* Role distribution (how many coaches vs medical staff?)

---

### **Mobile Considerations**

**Staff list:**

* Card view (easier than table on mobile)  
* Quick filters (roles, permissions)  
* Tap to call/email directly

**Staff profile:**

* Simplified permissions view (icons \+ labels)  
* Contact actions prominent (call, email buttons)  
* Activity feed condensed

---

### **Styling with shadcn**

* TanStack Table styled with shadcn  
* Permission cards \= shadcn Card component  
* Role tags \= shadcn Badge component  
* Permission badges \= shadcn Badge (outline variant)  
* All inputs/buttons/modals \= shadcn

Full visual consistency.

---

### **Build Effort**

**Staff list:** 2-3 days

* TanStack Table setup  
* Filters (roles \+ permissions)  
* Invite flow

**Staff profile:** 4-5 days

* Profile view with tabs  
* Roles vs permissions display  
* Activity log display

**Permission system:** 1 week

* Edit roles/permissions UI  
* Permission checks throughout app  
* RLS policies for permissions  
* Testing all permission combinations

**Activity logging:** 2-3 days

* Log actions throughout app  
* Display in staff profile  
* Analytics queries

# **Integrations**

## **Integrations \- Full Picture**

### **What Integrations Do**

1. **Import data** \- pull GPS data, video stats, external spreadsheets into system  
2. **Export data** \- push data to Google Sheets, BI tools, other platforms  
3. **Two-way sync** \- keep data synchronized with Google Calendar, Outlook  
4. **Webhooks** \- trigger actions in other apps (Zapier, Make, n8n)  
5. **API access** \- developers can build on top of SimpleAM  
6. **AI integrations** \- MCP server for AI-native access

---

### **Tech Stack**

* **CSV/Excel processing** \- universal data import/export  
* **OAuth libraries** \- Google, Microsoft authentication  
* **Zapier/Make webhooks** \- automation platform integrations  
* **MCP (Model Context Protocol)** \- AI-native integration layer  
* **REST API** \- programmatic access to all data  
* **Background jobs (BullMQ)** \- async import processing

---

### **Integration Methods (Priority Order)**

---

### **1\. CSV/Excel Import/Export (Phase 1 \- Must Have)**

**Universal data exchange \- works with ALL vendors**

\<ImportData\>  
  \<h2\>Import Data\</h2\>  
    
  \<Select label="What are you importing?"\>  
    \<option\>GPS/Load Data (Catapult, STATSports, etc.)\</option\>  
    \<option\>Match Stats\</option\>  
    \<option\>Wellness Data\</option\>  
    \<option\>Player Roster\</option\>  
    \<option\>Custom Data\</option\>  
  \</Select\>  
    
  \<FileUpload   
    accept=".csv,.xlsx,.xls"   
    onUpload={handleUpload}  
  \>  
    Drag and drop or click to upload  
  \</FileUpload\>  
    
  {/\* After upload: Preview and map \*/}  
  \<DataPreview\>  
    \<h3\>Preview & Map Columns\</h3\>  
    \<Table\>  
      \<thead\>  
        \<tr\>  
          \<th\>Your Column\</th\>  
          \<th\>Maps To\</th\>  
          \<th\>Preview\</th\>  
        \</tr\>  
      \</thead\>  
      \<tbody\>  
        \<tr\>  
          \<td\>Player Name\</td\>  
          \<td\>  
            \<Select\>  
              \<option\>Person (Player)\</option\>  
              \<option\>Text\</option\>  
            \</Select\>  
          \</td\>  
          \<td\>Marcus Rashford, Bruno Fernandes...\</td\>  
        \</tr\>  
        \<tr\>  
          \<td\>Total Distance\</td\>  
          \<td\>  
            \<Select\>  
              \<option\>Number\</option\>  
              \<option\>Text\</option\>  
            \</Select\>  
          \</td\>  
          \<td\>8,450, 7,230...\</td\>  
        \</tr\>  
        \<tr\>  
          \<td\>Session Date\</td\>  
          \<td\>  
            \<Select\>  
              \<option\>Date\</option\>  
              \<option\>Text\</option\>  
            \</Select\>  
          \</td\>  
          \<td\>2025-01-15, 2025-01-16...\</td\>  
        \</tr\>  
      \</tbody\>  
    \</Table\>  
      
    \<PlayerMapping\>  
      \<h4\>Match Players\</h4\>  
      \<p\>Found 23 player names. Match to existing players or create new:\</p\>  
      \<MappingList\>  
        \<MappingRow\>  
          \<span\>Marcus Rashford\</span\>  
          \<Arrow\>→\</Arrow\>  
          \<Select\>  
            \<option\>Marcus Rashford (existing)\</option\>  
            \<option\>Create new player\</option\>  
          \</Select\>  
        \</MappingRow\>  
        {/\* Repeat for each player \*/}  
      \</MappingList\>  
    \</PlayerMapping\>  
  \</DataPreview\>  
    
  \<ImportDestination\>  
    \<h3\>Where should this data go?\</h3\>  
    \<RadioGroup\>  
      \<Radio value="new"\>  
        \<strong\>Create new spreadsheet\</strong\>  
        \<Input placeholder="Spreadsheet name" /\>  
      \</Radio\>  
      \<Radio value="existing"\>  
        \<strong\>Add to existing spreadsheet\</strong\>  
        \<Select\>  
          \<option\>Weekly Load Tracking\</option\>  
          \<option\>GPS Data 2024/25\</option\>  
        \</Select\>  
      \</Radio\>  
    \</RadioGroup\>  
  \</ImportDestination\>  
    
  \<Button size="lg"\>Import Data\</Button\>  
\</ImportData\>

**Export flow:**

\<ExportData\>  
  \<h2\>Export Data\</h2\>  
    
  \<Select label="What do you want to export?"\>  
    \<option\>All Players\</option\>  
    \<option\>Specific Spreadsheet\</option\>  
    \<option\>Form Responses\</option\>  
    \<option\>Event Attendance\</option\>  
    \<option\>Complete Data Dump\</option\>  
  \</Select\>  
    
  \<DateRange label="Date Range" /\>  
    
  \<Select label="Format"\>  
    \<option\>CSV\</option\>  
    \<option\>Excel (.xlsx)\</option\>  
    \<option\>JSON\</option\>  
  \</Select\>  
    
  \<Button\>Export\</Button\>  
\</ExportData\>

**Why this is priority:**

* Works TODAY with zero partnerships  
* Catapult, STATSports, every vendor has CSV export  
* Users already doing this manually (you make it easier)  
* Universal fallback for any data source

---

### **2\. Google Workspace Integration (Phase 1 \- Must Have)**

**OAuth connection to Google services**

\<GoogleIntegration\>  
  \<IntegrationCard\>  
    \<Logo\>Google\</Logo\>  
    \<h3\>Google Workspace\</h3\>  
    \<p\>Sync calendar, import sheets, access drive files\</p\>  
      
    {\!connected ? (  
      \<Button onClick={connectGoogle}\>  
        \<GoogleIcon /\> Connect Google Account  
      \</Button\>  
    ) : (  
      \<\>  
        \<Badge variant="success"\>Connected as {user.email}\</Badge\>  
          
        \<SyncOptions\>  
          \<h4\>What to sync:\</h4\>  
          \<Checkbox checked\>Google Calendar → SimpleAM Events\</Checkbox\>  
          \<Checkbox checked\>SimpleAM Events → Google Calendar\</Checkbox\>  
          \<Checkbox\>Import data from Google Sheets\</Checkbox\>  
          \<Checkbox\>Export spreadsheets to Google Sheets\</Checkbox\>  
        \</SyncOptions\>  
          
        \<LastSync\>Last synced: 5 minutes ago\</LastSync\>  
          
        \<ButtonGroup\>  
          \<Button variant="outline"\>Sync Now\</Button\>  
          \<Button variant="outline" onClick={configure}\>Configure\</Button\>  
          \<Button variant="ghost" onClick={disconnect}\>Disconnect\</Button\>  
        \</ButtonGroup\>  
      \</\>  
    )}  
  \</IntegrationCard\>  
\</GoogleIntegration\>

**Features:**

* **Calendar sync** (two-way)  
* **Import from Google Sheets** (one-click)  
* **Export to Google Sheets** (one-click)  
* **OAuth flow** (secure, standard)

**Cost: $0** (Google API is free)

---

### **3\. Your REST API (Phase 1 \- Must Have)**

**Programmatic access for developers**

\<APIAccess\>  
  \<h2\>Developer API\</h2\>  
  \<p\>Build custom integrations with SimpleAM\</p\>  
    
  \<ApiKeys\>  
    \<h3\>API Keys\</h3\>  
    \<p\>Use these keys to authenticate API requests\</p\>  
      
    {apiKeys.map(key \=\> (  
      \<KeyRow\>  
        \<div\>  
          \<strong\>{key.name}\</strong\>  
          \<Code\>{key.preview}•••••••••\</Code\>  
        \</div\>  
        \<div\>  
          \<span\>Created: {key.createdAt}\</span\>  
          \<span\>Last used: {key.lastUsed || 'Never'}\</span\>  
        \</div\>  
        \<ButtonGroup\>  
          \<Button size="sm" variant="ghost"\>  
            \<CopyIcon /\> Copy  
          \</Button\>  
          \<Button size="sm" variant="ghost" onClick={() \=\> revoke(key.id)}\>  
            \<TrashIcon /\> Revoke  
          \</Button\>  
        \</ButtonGroup\>  
      \</KeyRow\>  
    ))}  
      
    \<Button onClick={createKey}\>+ Create New API Key\</Button\>  
  \</ApiKeys\>  
    
  \<QuickStart\>  
    \<h3\>Quick Start\</h3\>  
    \<Code language="bash"\>  
      curl \-H "Authorization: Bearer YOUR\_API\_KEY" \\  
           https://api.simpleam.app/v1/players  
    \</Code\>  
  \</QuickStart\>  
    
  \<Documentation\>  
    \<h3\>API Documentation\</h3\>  
    \<DocLink href="/docs/api"\>  
      \<BookIcon /\>  
      \<div\>  
        \<strong\>View Full API Docs\</strong\>  
        \<p\>Complete reference for all endpoints\</p\>  
      \</div\>  
      \<ArrowIcon /\>  
    \</DocLink\>  
  \</Documentation\>  
    
  \<RateLimits\>  
    \<h3\>Rate Limits\</h3\>  
    \<LimitBar\>  
      \<span\>Requests this hour: {usage} / 1,000\</span\>  
      \<Progress value={usage / 10} /\>  
    \</LimitBar\>  
    \<p\>Limit resets in {resetTime} minutes\</p\>  
  \</RateLimits\>  
\</APIAccess\>

**API endpoints:**

\# Players  
GET    /api/v1/players  
POST   /api/v1/players  
GET    /api/v1/players/:id  
PATCH  /api/v1/players/:id  
DELETE /api/v1/players/:id

\# Events  
GET    /api/v1/events  
POST   /api/v1/events  
GET    /api/v1/events/:id

\# Forms  
GET    /api/v1/forms  
GET    /api/v1/forms/:id/responses  
POST   /api/v1/forms/:id/responses

\# Spreadsheets  
GET    /api/v1/spreadsheets  
GET    /api/v1/spreadsheets/:id  
POST   /api/v1/spreadsheets/:id/rows

\# Notes  
GET    /api/v1/notes  
POST   /api/v1/notes

**Authentication:**

Authorization: Bearer sk\_live\_abc123...

**Rate limits:**

* 1,000 requests/hour per key  
* 10,000 requests/day per org

---

### **4\. MCP Server (Phase 1 \- Must Have)**

**AI-native integration layer**

\<MCPIntegration\>  
  \<h2\>AI Integrations (MCP)\</h2\>  
  \<p\>Connect AI tools like Claude Desktop to your SimpleAM data\</p\>  
    
  \<ServerInfo\>  
    \<h3\>MCP Server URL\</h3\>  
    \<Code\>mcp://simpleam.app/{orgId}\</Code\>  
    \<Button size="sm" variant="outline"\>  
      \<CopyIcon /\> Copy URL  
    \</Button\>  
  \</ServerInfo\>  
    
  \<SetupInstructions\>  
    \<h3\>Setup in Claude Desktop\</h3\>  
    \<Steps\>  
      \<Step\>  
        \<StepNumber\>1\</StepNumber\>  
        \<div\>  
          \<strong\>Open Claude Desktop settings\</strong\>  
          \<p\>Click Settings → Developer → MCP Servers\</p\>  
        \</div\>  
      \</Step\>  
      \<Step\>  
        \<StepNumber\>2\</StepNumber\>  
        \<div\>  
          \<strong\>Add SimpleAM MCP server\</strong\>  
          \<Code\>mcp://simpleam.app/{orgId}\</Code\>  
        \</div\>  
      \</Step\>  
      \<Step\>  
        \<StepNumber\>3\</StepNumber\>  
        \<div\>  
          \<strong\>Authorize access\</strong\>  
          \<p\>Follow prompts to connect your org\</p\>  
        \</div\>  
      \</Step\>  
    \</Steps\>  
  \</SetupInstructions\>  
    
  \<Permissions\>  
    \<h3\>Data Access Permissions\</h3\>  
    \<p\>Control what AI tools can access:\</p\>  
      
    \<PermissionList\>  
      \<Permission\>  
        \<Checkbox checked\>Read players\</Checkbox\>  
        \<p\>List and view player data\</p\>  
      \</Permission\>  
      \<Permission\>  
        \<Checkbox checked\>Read events\</Checkbox\>  
        \<p\>View calendar events\</p\>  
      \</Permission\>  
      \<Permission\>  
        \<Checkbox checked\>Read forms\</Checkbox\>  
        \<p\>View form responses and data\</p\>  
      \</Permission\>  
      \<Permission\>  
        \<Checkbox\>Create notes\</Checkbox\>  
        \<p\>AI can add notes to players/events\</p\>  
      \</Permission\>  
      \<Permission\>  
        \<Checkbox\>Create events\</Checkbox\>  
        \<p\>AI can schedule events\</p\>  
      \</Permission\>  
    \</PermissionList\>  
  \</Permissions\>  
    
  \<UseCases\>  
    \<h3\>What You Can Do\</h3\>  
    \<UseCaseList\>  
      \<UseCase\>  
        \<Icon\>💬\</Icon\>  
        \<div\>  
          \<strong\>"Show me all players with wellness scores below 6"\</strong\>  
          \<p\>Claude queries your data and returns results\</p\>  
        \</div\>  
      \</UseCase\>  
      \<UseCase\>  
        \<Icon\>📊\</Icon\>  
        \<div\>  
          \<strong\>"Analyze load data for the last month"\</strong\>  
          \<p\>AI accesses spreadsheets and provides insights\</p\>  
        \</div\>  
      \</UseCase\>  
      \<UseCase\>  
        \<Icon\>📅\</Icon\>  
        \<div\>  
          \<strong\>"Schedule recovery sessions for injured players"\</strong\>  
          \<p\>AI creates events based on injury data\</p\>  
        \</div\>  
      \</UseCase\>  
    \</UseCaseList\>  
  \</UseCases\>  
\</MCPIntegration\>

**MCP tools exposed:**

const tools \= \[  
  {  
    name: "list\_players",  
    description: "Get all players in the organization",  
    inputSchema: {  
      type: "object",  
      properties: {  
        tags: { type: "array", items: { type: "string" } },  
        status: { type: "string", enum: \["available", "injured", "suspended"\] }  
      }  
    }  
  },  
  {  
    name: "get\_player\_wellness",  
    description: "Get wellness form responses for a player",  
    inputSchema: {  
      type: "object",  
      properties: {  
        playerId: { type: "string", required: true },  
        days: { type: "number", default: 30 }  
      }  
    }  
  },  
  {  
    name: "query\_spreadsheet",  
    description: "Query data from a spreadsheet",  
    inputSchema: {  
      type: "object",  
      properties: {  
        spreadsheetId: { type: "string", required: true },  
        filters: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "create\_event",  
    description: "Create a calendar event",  
    inputSchema: {  
      type: "object",  
      properties: {  
        title: { type: "string", required: true },  
        startTime: { type: "string", required: true },  
        attendees: { type: "array", items: { type: "string" } }  
      }  
    }  
  }  
\]

**Why this is critical:**

* Differentiator (most sports software doesn't have this)  
* AI-native \= future-proof  
* Enables custom AI agents  
* Zero additional cost to build

---

### **5\. Zapier Webhooks (Phase 2 \- Should Have)**

**Connect to 5,000+ apps**

\<ZapierIntegration\>  
  \<h2\>Zapier\</h2\>  
  \<p\>Automate workflows with 5,000+ apps\</p\>  
    
  \<ConnectionStatus\>  
    \<Badge variant="success"\>Available\</Badge\>  
    \<p\>SimpleAM is ready for Zapier integrations\</p\>  
  \</ConnectionStatus\>  
    
  \<SetupWebhook\>  
    \<h3\>Set Up Webhook\</h3\>  
    \<p\>Configure which events trigger Zapier workflows:\</p\>  
      
    \<WebhookConfig\>  
      \<Input   
        label="Webhook URL"   
        placeholder="https://hooks.zapier.com/..."   
        value={webhookUrl}  
      /\>  
        
      \<CheckboxGroup label="Trigger Events"\>  
        \<Checkbox\>New form response\</Checkbox\>  
        \<Checkbox\>Player added\</Checkbox\>  
        \<Checkbox\>Event created\</Checkbox\>  
        \<Checkbox\>Note created\</Checkbox\>  
        \<Checkbox\>Spreadsheet updated\</Checkbox\>  
      \</CheckboxGroup\>  
        
      \<Button\>Save Webhook\</Button\>  
    \</WebhookConfig\>  
  \</SetupWebhook\>  
    
  \<PopularZaps\>  
    \<h3\>Popular Workflows\</h3\>  
    \<ZapList\>  
      \<ZapExample\>  
        \<ZapFlow\>  
          \<span\>Form completed\</span\>  
          \<Arrow /\>  
          \<span\>Add row to Google Sheets\</span\>  
        \</ZapFlow\>  
      \</ZapExample\>  
      \<ZapExample\>  
        \<ZapFlow\>  
          \<span\>Player injured\</span\>  
          \<Arrow /\>  
          \<span\>Send Slack notification\</span\>  
        \</ZapFlow\>  
      \</ZapExample\>  
      \<ZapExample\>  
        \<ZapFlow\>  
          \<span\>Event created\</span\>  
          \<Arrow /\>  
          \<span\>Add to Notion database\</span\>  
        \</ZapFlow\>  
      \</ZapExample\>  
    \</ZapList\>  
  \</PopularZaps\>  
    
  \<CreateZap\>  
    \<Button onClick={() \=\> window.open('https://zapier.com/apps/simpleam')}\>  
      Create a Zap  
    \</Button\>  
  \</CreateZap\>  
\</ZapierIntegration\>

**User cost:** $20-$50/month (users pay Zapier, not you) **Your cost:** $0 (hosting webhooks only)

---

### **6\. Microsoft 365 Integration (Phase 2 \- Should Have)**

**Same pattern as Google**

\<MicrosoftIntegration\>  
  \<IntegrationCard\>  
    \<Logo\>Microsoft\</Logo\>  
    \<h3\>Microsoft 365\</h3\>  
    \<p\>Sync Outlook calendar, import Excel files\</p\>  
      
    {/\* Same structure as Google integration \*/}  
  \</IntegrationCard\>  
\</MicrosoftIntegration\>

**Features:**

* Outlook Calendar sync  
* Excel import/export  
* OneDrive file access

**Cost: $0** (Microsoft Graph API is free)

---

### **7\. Sports Vendor APIs (Phase 3 \- Nice to Have)**

**Direct integrations when partnerships mature**

\<VendorIntegrations\>  
  \<h2\>Sports Data Vendors\</h2\>  
  \<p\>Direct API connections (when available)\</p\>  
    
  \<VendorList\>  
    \<VendorCard status="coming\_soon"\>  
      \<Logo\>STATSports\</Logo\>  
      \<h3\>STATSports\</h3\>  
      \<p\>Automatic GPS data import\</p\>  
      \<Badge\>Coming Soon\</Badge\>  
      \<p\>We're working with STATSports to enable direct integration\</p\>  
      \<Button variant="outline"\>Request Early Access\</Button\>  
    \</VendorCard\>  
      
    \<VendorCard status="not\_available"\>  
      \<Logo\>Catapult\</Logo\>  
      \<h3\>Catapult\</h3\>  
      \<p\>Automatic load monitoring import\</p\>  
      \<Badge variant="secondary"\>Not Available\</Badge\>  
      \<p\>Use CSV import for now. Vote for this integration:\</p\>  
      \<Button variant="outline"\>Vote (234 votes)\</Button\>  
    \</VendorCard\>  
  \</VendorList\>  
    
  \<RequestIntegration\>  
    \<h3\>Request an Integration\</h3\>  
    \<p\>Which vendor would you like us to integrate with?\</p\>  
    \<Input placeholder="Vendor name" /\>  
    \<Button\>Submit Request\</Button\>  
  \</RequestIntegration\>  
\</VendorIntegrations\>

**Strategy:**

* Show as "coming soon" to gather demand  
* Use vote counts to prioritize  
* Approach vendors with proof of demand  
* Build only when partnership secured

---

### **Data Model**

model Integration {  
  id          String @id  
  orgId       String  
    
  provider    String // "google", "microsoft", "zapier", "statsports"  
  type        String // "oauth", "api\_key", "webhook"  
    
  // Auth (encrypted)  
  credentials Json // {accessToken, refreshToken, apiKey}  
    
  // Configuration  
  config      Json // {syncCalendar: true, syncFrequency: "hourly"}  
    
  // Status  
  isActive    Boolean @default(true)  
  lastSync    DateTime?  
  errorCount  Int @default(0)  
  lastError   String?  
    
  createdAt   DateTime  
  updatedAt   DateTime  
}

model Webhook {  
  id          String @id  
  orgId       String  
    
  url         String  
  events      String\[\] // \["form.completed", "player.added"\]  
  secret      String // for signature verification  
    
  isActive    Boolean @default(true)  
  lastTriggered DateTime?  
  failCount     Int @default(0)  
}

model ImportJob {  
  id            String @id  
  orgId         String  
  integrationId String?  
    
  source        String // "csv\_upload", "google\_sheets", "statsports\_api"  
  type          String // "players", "gps\_data", "form\_responses"  
    
  // Status  
  status        String // "pending", "processing", "completed", "failed"  
  progress      Int @default(0)  
  totalRows     Int?  
  processedRows Int @default(0)  
  errorRows     Int @default(0)  
    
  // Results  
  result        Json? // {created: 10, updated: 5, errors: \[...\]}  
    
  createdAt     DateTime  
  completedAt   DateTime?  
}

model ApiKey {  
  id        String @id  
  orgId     String  
  userId    String  
    
  name      String  
  key       String @unique // hashed  
  preview   String // first/last chars for display  
    
  lastUsed  DateTime?  
  expiresAt DateTime?  
    
  createdAt DateTime  
}

---

### **Build Effort**

**Phase 1 (Must have \- Launch):**

* CSV/Excel import/export: 1 week  
* Google Workspace OAuth: 1 week  
* REST API: 1 week  
* MCP server: 1 week **Total: 4 weeks**

**Phase 2 (Should have \- First 6 months):**

* Zapier webhooks: 3-4 days  
* Microsoft 365 OAuth: 1 week  
* iCal sync: 2-3 days **Total: 2.5 weeks**

**Phase 3 (Nice to have \- When partnerships happen):**

* Per vendor API: 3-5 days each  
* Ongoing as opportunities arise

---

### **AI Integration**

User: "AI, import my GPS data from this CSV"

AI:  
1\. Checks CSV format  
2\. Maps columns to players  
3\. Creates import job  
4\. Returns: "Imported GPS data for 23 players. View in GPS Data spreadsheet."

User: "AI, sync my Google Calendar"

AI:  
1\. Checks if Google connected  
2\. Configures sync settings  
3\. Triggers initial sync  
4\. Returns: "Calendar synced. 45 events imported."

# **Canvas**

## **Drawing Canvas \- Full Picture**

### **What Drawing Canvas Does**

1. **Create drawings** \- tactical boards, formations, drills, session plans  
2. **Sport-specific tools** \- pitch backgrounds, player icons, equipment icons  
3. **Basic drawing tools** \- shapes, arrows, text, freehand  
4. **Templates** \- pre-built formations, common drills, set pieces  
5. **Save & share** \- save drawings, attach to events/plans/notes  
6. **Export** \- PNG, PDF, share link  
7. **Collaborative** (optional) \- multiple users can edit

---

### **Tech Stack**

* **Excalidraw** (free, MIT) \- mature, feature-rich drawing library  
  * Shapes, arrows, text, freehand  
  * Export to PNG, SVG  
  * Collaborative editing (optional)  
  * Extensible with custom elements

**Why Excalidraw:**

* Better than building from scratch (months of work)  
* Users already understand it  
* Can add sport-specific templates on top  
* Free, MIT license

**Alternative:** Build custom with Konva/Fabric.js (much more work)

---

### **Drawing Types (Use Cases)**

**Formations:**

* Starting XI positions  
* Defensive/attacking shapes  
* Player roles and movements

**Tactics:**

* Pressing triggers  
* Build-up patterns  
* Set piece routines

**Training Drills:**

* Drill layouts  
* Player movements  
* Equipment placement

**Session Plans:**

* Field setup  
* Station layouts  
* Progression diagrams

**Opposition Analysis:**

* Opposition formation  
* Key players  
* Weaknesses/threats

---

### **User Flow**

### **Scenario 1: Create Formation Drawing**

\<CreateDrawing\>  
  \<h2\>Create Drawing\</h2\>  
    
  \<Select label="Template"\>  
    \<option value=""\>Blank Canvas\</option\>  
    \<option\>Football Pitch (Full)\</option\>  
    \<option\>Football Pitch (Half)\</option\>  
    \<option\>4-3-3 Formation\</option\>  
    \<option\>4-4-2 Formation\</option\>  
    \<option\>Training Drill (4 stations)\</option\>  
    \<option\>Corner Kick Setup\</option\>  
  \</Select\>  
    
  \<Input label="Drawing Name" placeholder="4-3-3 High Press" required /\>  
  \<Textarea label="Description" placeholder="High defensive line, press triggers..." /\>  
    
  \<LinkToEntity\>  
    \<h4\>Attach to (optional):\</h4\>  
    \<Select label="Entity Type"\>  
      \<option value=""\>None (standalone)\</option\>  
      \<option\>Event\</option\>  
      \<option\>Plan\</option\>  
      \<option\>Note\</option\>  
    \</Select\>  
  \</LinkToEntity\>  
    
  \<Button\>Create Drawing\</Button\>  
\</CreateDrawing\>

---

### **Scenario 2: Drawing Editor**

\<DrawingEditor\>  
  \<Header\>  
    \<div\>  
      \<h2\>{drawing.name}\</h2\>  
      \<Badge\>Unsaved changes\</Badge\>  
    \</div\>  
    \<Actions\>  
      \<Button onClick={save}\>  
        \<SaveIcon /\> Save  
      \</Button\>  
      \<Button variant="outline" onClick={exportPNG}\>  
        \<DownloadIcon /\> Export PNG  
      \</Button\>  
      \<Button variant="outline" onClick={share}\>  
        \<ShareIcon /\> Share  
      \</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Toolbar\>  
    {/\* Excalidraw's native toolbar \*/}  
    \<ToolSection\>  
      \<Tool active\>Selection\</Tool\>  
      \<Tool\>Rectangle\</Tool\>  
      \<Tool\>Circle\</Tool\>  
      \<Tool\>Arrow\</Tool\>  
      \<Tool\>Line\</Tool\>  
      \<Tool\>Text\</Tool\>  
      \<Tool\>Pen\</Tool\>  
    \</ToolSection\>  
      
    {/\* Custom sport-specific tools \*/}  
    \<ToolSection\>  
      \<h4\>Sport Elements\</h4\>  
      \<Tool onClick={() \=\> addPitch()}\>  
        \<Icon\>⚽\</Icon\> Pitch  
      \</Tool\>  
      \<Tool onClick={() \=\> addPlayer()}\>  
        \<Icon\>👤\</Icon\> Player  
      \</Tool\>  
      \<Tool onClick={() \=\> addCone()}\>  
        \<Icon\>🔺\</Icon\> Cone  
      \</Tool\>  
      \<Tool onClick={() \=\> addBall()}\>  
        \<Icon\>⚽\</Icon\> Ball  
      \</Tool\>  
      \<Tool onClick={() \=\> addGoal()}\>  
        \<Icon\>🥅\</Icon\> Goal  
      \</Tool\>  
    \</ToolSection\>  
      
    \<ToolSection\>  
      \<h4\>Your Squad\</h4\>  
      \<PlayerList\>  
        {squad.map(player \=\> (  
          \<PlayerChip   
            key={player.id}  
            draggable  
            onDragEnd={() \=\> addPlayerToCanvas(player)}  
          \>  
            \<Avatar src={player.photo} size="xs" /\>  
            \<span\>{player.name}\</span\>  
          \</PlayerChip\>  
        ))}  
      \</PlayerList\>  
    \</ToolSection\>  
  \</Toolbar\>  
    
  \<Canvas\>  
    \<Excalidraw  
      initialData={drawing.data}  
      onChange={handleChange}  
      UIOptions={{  
        canvasActions: {  
          loadScene: false,  
          export: false,  
          saveAsImage: false  
        }  
      }}  
    /\>  
  \</Canvas\>  
    
  \<PropertiesPanel\>  
    \<h4\>Properties\</h4\>  
    {selectedElement && (  
      \<\>  
        \<ColorPicker label="Color" /\>  
        \<Slider label="Stroke Width" /\>  
        \<Input label="Label" /\>  
      \</\>  
    )}  
  \</PropertiesPanel\>  
\</DrawingEditor\>

---

### **Scenario 3: Drawing Library**

\<DrawingLibrary\>  
  \<Toolbar\>  
    \<Search placeholder="Search drawings..." /\>  
    \<FilterSelect label="Type"\>  
      \<option\>All\</option\>  
      \<option\>Formations\</option\>  
      \<option\>Drills\</option\>  
      \<option\>Tactics\</option\>  
      \<option\>Set Pieces\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Created By"\>  
      {staff.map(s \=\> \<option value={s.id}\>{s.name}\</option\>)}  
    \</FilterSelect\>  
    \<TagFilter /\>  
    \<Button\>+ New Drawing\</Button\>  
  \</Toolbar\>  
    
  \<DrawingGrid\>  
    {drawings.map(drawing \=\> (  
      \<DrawingCard key={drawing.id} onClick={() \=\> openDrawing(drawing.id)}\>  
        \<Thumbnail\>  
          {/\* Preview image of drawing \*/}  
          \<img src={drawing.thumbnailUrl} alt={drawing.name} /\>  
        \</Thumbnail\>  
        \<CardContent\>  
          \<h3\>{drawing.name}\</h3\>  
          \<p\>{drawing.description}\</p\>  
          \<Meta\>  
            \<Avatar src={drawing.createdBy.photo} size="sm" /\>  
            \<span\>{drawing.createdBy.name}\</span\>  
            \<span\>{formatDate(drawing.createdAt)}\</span\>  
            {drawing.tags.map(tag \=\> \<Tag key={tag}\>{tag}\</Tag\>)}  
          \</Meta\>  
        \</CardContent\>  
        \<CardActions\>  
          \<Button size="sm" variant="ghost" onClick={edit}\>Edit\</Button\>  
          \<Button size="sm" variant="ghost" onClick={duplicate}\>Duplicate\</Button\>  
          \<Button size="sm" variant="ghost" onClick={exportPNG}\>Export\</Button\>  
        \</CardActions\>  
      \</DrawingCard\>  
    ))}  
  \</DrawingGrid\>  
\</DrawingLibrary\>

---

### **Data Model**

model Drawing {  
  id          String @id  
  orgId       String  
  name        String  
  description String?  
    
  // Type/category  
  type        String? // "formation", "drill", "tactics", "set\_piece", "session\_plan"  
  tags        String\[\]  
    
  // Excalidraw data  
  data        Json // Excalidraw scene data  
    
  // Preview image  
  thumbnailUrl String? // PNG preview for library view  
    
  // Linked to entities  
  linkedToType String? // "event", "plan", "note"  
  linkedToId   String?  
    
  // Template  
  isTemplate  Boolean @default(false)  
    
  // Sharing  
  isPublic    Boolean @default(false)  
  shareToken  String? @unique  
    
  createdBy   String  
  creator     User @relation(fields: \[createdBy\], references: \[id\])  
  createdAt   DateTime @default(now())  
  updatedAt   DateTime @updatedAt  
}

---

### **Excalidraw Integration**

import { Excalidraw } from "@excalidraw/excalidraw"

function DrawingCanvas() {  
  const \[excalidrawAPI, setExcalidrawAPI\] \= useState(null)  
    
  const handleChange \= (elements, appState) \=\> {  
    // Auto-save drawing data  
    saveDraft({  
      elements,  
      appState  
    })  
  }  
    
  const addCustomElement \= (type: string) \=\> {  
    if (\!excalidrawAPI) return  
      
    // Add sport-specific element  
    const element \= createSportElement(type) // pitch, player, cone, etc.  
      
    excalidrawAPI.updateScene({  
      elements: \[...excalidrawAPI.getSceneElements(), element\]  
    })  
  }  
    
  return (  
    \<Excalidraw  
      ref={(api) \=\> setExcalidrawAPI(api)}  
      initialData={drawing.data}  
      onChange={handleChange}  
      UIOptions={{  
        canvasActions: {  
          changeViewBackgroundColor: true,  
          clearCanvas: true,  
          export: false, // we handle this  
          loadScene: false, // we handle this  
          saveAsImage: false, // we handle this  
        }  
      }}  
    /\>  
  )  
}

---

### **Sport-Specific Elements**

**Pre-built shapes/templates:**

// Football pitch (SVG)  
const footballPitch \= {  
  type: "image",  
  x: 0,  
  y: 0,  
  width: 1000,  
  height: 600,  
  fileId: "pitch\_svg", // SVG of football pitch  
  scale: \[1, 1\]  
}

// Player icon  
const playerIcon \= {  
  type: "ellipse",  
  x: 100,  
  y: 100,  
  width: 40,  
  height: 40,  
  strokeColor: "\#1971c2",  
  backgroundColor: "\#a5d8ff",  
  fillStyle: "solid",  
  label: "M. Rashford", // from squad list  
}

// Cone  
const coneIcon \= {  
  type: "triangle",  
  x: 200,  
  y: 200,  
  width: 20,  
  height: 30,  
  strokeColor: "\#f76707",  
  backgroundColor: "\#ffd8a8",  
}

// Arrow (movement)  
const movementArrow \= {  
  type: "arrow",  
  x: 100,  
  y: 100,  
  points: \[\[0, 0\], \[100, 50\]\],  
  strokeColor: "\#000",  
  strokeWidth: 2,  
}

**Custom toolbar buttons add these to canvas.**

---

### **Drawing Templates**

**Pre-built templates users can start from:**

model DrawingTemplate {  
  id          String @id  
  orgId       String?  
  name        String  
  description String  
  category    String // "formation", "drill", "set\_piece"  
  sport       String // "football", "rugby", "basketball"  
    
  // Template data  
  data        Json // Excalidraw scene  
  thumbnailUrl String  
    
  // Global vs user-created  
  isGlobal    Boolean @default(false)  
  createdBy   String?  
    
  // Community Hub  
  downloads   Int @default(0)  
  rating      Float?  
    
  createdAt   DateTime  
}

**Global templates (you provide):**

* 4-3-3 Formation  
* 4-4-2 Formation  
* 3-5-2 Formation  
* Corner Kick Routine  
* Free Kick Wall Setup  
* Pressing Drill  
* Passing Drill (4 stations)  
* Small-Sided Game Layout

**User templates:**

* Save their drawing as template  
* Share in Community Hub  
* Download others' templates

---

### **Export Options**

\<ExportDrawing\>  
  \<h3\>Export Drawing\</h3\>  
    
  \<ExportOptions\>  
    \<Option\>  
      \<Radio value="png" /\>  
      \<div\>  
        \<strong\>PNG Image\</strong\>  
        \<p\>High-resolution image (1920×1080)\</p\>  
      \</div\>  
    \</Option\>  
      
    \<Option\>  
      \<Radio value="svg" /\>  
      \<div\>  
        \<strong\>SVG\</strong\>  
        \<p\>Vector format (scalable)\</p\>  
      \</div\>  
    \</Option\>  
      
    \<Option\>  
      \<Radio value="pdf" /\>  
      \<div\>  
        \<strong\>PDF\</strong\>  
        \<p\>Print-ready document\</p\>  
      \</div\>  
    \</Option\>  
  \</ExportOptions\>  
    
  \<ExportSettings\>  
    \<Checkbox\>Include background\</Checkbox\>  
    \<Checkbox\>Include grid\</Checkbox\>  
    \<Select label="Scale"\>  
      \<option\>1x (standard)\</option\>  
      \<option\>2x (high-res)\</option\>  
      \<option\>4x (print)\</option\>  
    \</Select\>  
  \</ExportSettings\>  
    
  \<Button onClick={exportDrawing}\>Export\</Button\>  
\</ExportDrawing\>

**Export implementation:**

// PNG export  
const exportToPNG \= async () \=\> {  
  const canvas \= await excalidrawAPI.exportToCanvas({  
    elements: excalidrawAPI.getSceneElements(),  
    appState: excalidrawAPI.getAppState(),  
    files: excalidrawAPI.getFiles(),  
  })  
    
  canvas.toBlob((blob) \=\> {  
    saveAs(blob, \`${drawing.name}.png\`)  
  })  
}

// SVG export  
const exportToSVG \= async () \=\> {  
  const svg \= await excalidrawAPI.exportToSvg({  
    elements: excalidrawAPI.getSceneElements(),  
    appState: excalidrawAPI.getAppState(),  
    files: excalidrawAPI.getFiles(),  
  })  
    
  const svgString \= new XMLSerializer().serializeToString(svg)  
  const blob \= new Blob(\[svgString\], { type: 'image/svg+xml' })  
  saveAs(blob, \`${drawing.name}.svg\`)  
}

---

### **Linking Drawings**

**Event Detail:**

\<EventDetail\>  
  \<Tab label="Drawings"\>  
    \<DrawingsSection\>  
      \<h3\>Attached Drawings\</h3\>  
      {drawings.map(drawing \=\> (  
        \<DrawingItem key={drawing.id}\>  
          \<Thumbnail src={drawing.thumbnailUrl} /\>  
          \<div\>  
            \<strong\>{drawing.name}\</strong\>  
            \<span\>{drawing.description}\</span\>  
          \</div\>  
          \<ButtonGroup\>  
            \<Button size="sm" onClick={() \=\> openDrawing(drawing.id)}\>Edit\</Button\>  
            \<Button size="sm" variant="outline"\>View\</Button\>  
          \</ButtonGroup\>  
        \</DrawingItem\>  
      ))}  
      \<Button variant="outline"\>+ Create Drawing\</Button\>  
    \</DrawingsSection\>  
  \</Tab\>  
\</EventDetail\>

**Plan Milestone:**

\<MilestoneDetail\>  
  \<LinkedEntities\>  
    \<h3\>Linked Items\</h3\>  
    {milestone.links.map(link \=\> (  
      link.type \=== "drawing" && (  
        \<LinkedDrawing key={link.id}\>  
          \<Thumbnail src={link.drawing.thumbnailUrl} /\>  
          \<span\>{link.drawing.name}\</span\>  
          \<Button variant="ghost" size="sm"\>View →\</Button\>  
        \</LinkedDrawing\>  
      )  
    ))}  
  \</LinkedEntities\>  
\</MilestoneDetail\>

---

### **Collaborative Editing (Optional \- Add Later)**

**Excalidraw supports real-time collaboration:**

// With WebSocket server  
\<Excalidraw  
  {...props}  
  isCollaborating={true}  
  onCollabButtonClick={() \=\> shareDrawing()}  
/\>

**Requires:**

* WebSocket server  
* Y.js or similar CRDT  
* More infrastructure

**Recommendation:** Start without it. Add if users request.

---

### **AI Integration**

User: "AI, create a 4-3-3 formation drawing"

AI:  
1\. Uses "4-3-3 Formation" template  
2\. Creates drawing with pitch \+ 11 players positioned  
3\. Labels positions (GK, LB, CB, CB, RB, CM, CM, CM, LW, ST, RW)  
4\. Returns: "Formation drawing created. View drawing →"

User uploads image of tactical board: "AI, convert this to a drawing"

AI:  
1\. Analyzes image  
2\. Identifies: pitch, player positions, arrows  
3\. Creates Excalidraw elements matching image  
4\. Returns: "Drawing created from image. Edit drawing →"

User viewing drawing: "AI, suggest improvements to this pressing setup"

AI:  
1\. Analyzes formation/positions  
2\. Identifies gaps or issues  
3\. Returns: "Suggestions:  
   \- Move LW higher to close passing lane  
   \- CB positioning too deep, compress space  
   \- Consider dropping CM to cover counter-attack"

---

### **Community Hub Templates**

**Browse drawing templates:**

\<TemplateMarketplace\>  
  \<h2\>Drawing Templates\</h2\>  
    
  \<Categories\>  
    \<Category active\>All\</Category\>  
    \<Category\>Formations\</Category\>  
    \<Category\>Drills\</Category\>  
    \<Category\>Set Pieces\</Category\>  
    \<Category\>Tactics\</Category\>  
  \</Categories\>  
    
  \<FilterBySport\>  
    \<Filter active\>Football\</Filter\>  
    \<Filter\>Rugby\</Filter\>  
    \<Filter\>Basketball\</Filter\>  
  \</FilterBySport\>  
    
  \<TemplateGrid\>  
    \<TemplateCard\>  
      \<Thumbnail src={template.thumbnailUrl} /\>  
      \<h3\>4-3-3 High Press\</h3\>  
      \<p\>Aggressive high defensive line formation\</p\>  
      \<Meta\>  
        \<Badge\>Formation\</Badge\>  
        \<span\>1.2k downloads\</span\>  
        \<Rating value={4.5} /\>  
      \</Meta\>  
      \<Button\>Use Template\</Button\>  
    \</TemplateCard\>  
      
    {/\* More templates... \*/}  
  \</TemplateGrid\>  
\</TemplateMarketplace\>

**Users can:**

* Browse global templates  
* Download/use templates  
* Rate templates  
* Upload their own templates to community

---

### **Mobile Considerations**

**Drawing on mobile:**

* Excalidraw works on mobile but limited  
* Touch gestures for pan/zoom  
* Simplified toolbar  
* Better for viewing than creating

**Recommendation:**

* Desktop-first for creating  
* Mobile for viewing/light edits  
* Export to image for mobile sharing

---

### **Styling with shadcn**

* Excalidraw has its own UI (can't easily restyle)  
* Wrapper UI (library, toolbar additions) uses shadcn  
* Drawing cards \= shadcn Card  
* All modals/buttons outside canvas \= shadcn

---

### **Build Effort**

**Core drawing system:** 1 week

* Excalidraw integration  
* Save/load drawings  
* Drawing library view

**Sport-specific elements:** 3-4 days

* Pitch backgrounds (SVG assets)  
* Player/equipment icons  
* Custom toolbar buttons

**Templates:** 2-3 days

* Template system  
* Pre-built templates (create 10-15)  
* Template application

**Export:** 2 days

* PNG/SVG/PDF export  
* Export settings

**Linking:** 2 days

* Attach drawings to entities  
* Display in entity views

**Total: \~2.5 weeks for Drawing CanvasAI \- Full Picture**

**What AI Does**

**Natural language queries \- "Show me players with low wellness", "Create a report on load trends"**

**Data analysis \- Identify patterns, correlations, anomalies**

**Automated insights \- Proactive suggestions based on data**

**Content generation \- Create notes, summaries, reports**

**Predictions \- Injury risk, performance trends**

**Task automation \- Schedule events, send forms, organize data**

**Conversational interface \- Chat with your data**

**Tech Stack**

**Anthropic API (Claude) \- primary AI engine**

**MCP server (already covered in Integrations) \- AI accesses your data**

**Chat interface \- custom-built with streaming responses**

**Tool calling \- AI can execute actions (create events, send forms, etc.)**

**Vector database (optional) \- for semantic search over notes/documents**

**AI Architecture**

**User asks question**

    **↓**

**Claude receives query \+ has access to MCP tools**

    **↓**

**Claude calls tools to fetch data:**

  **\- list\_players**

  **\- query\_spreadsheet**

  **\- get\_form\_responses**

  **\- search\_notes**

    **↓**

**Claude analyzes data**

    **↓**

**Claude responds with insights \+ takes actions if requested**

**AI Interface**

**Main AI Chat**

**tsx\<AIChat\>**

  **\<ChatContainer\>**

    **\<MessageList\>**

      **{messages.map(message \=\> (**

        **\<Message key={message.id} role={message.role}\>**

          **{message.role \=== "user" ? (**

            **\<UserMessage\>**

              **\<Avatar src={currentUser.photo} /\>**

              **\<MessageContent\>{message.content}\</MessageContent\>**

            **\</UserMessage\>**

          **) : (**

            **\<AssistantMessage\>**

              **\<AIAvatar\>🤖\</AIAvatar\>**

              **\<MessageContent\>**

                **\<Markdown\>{message.content}\</Markdown\>**

                

                **{/\* If AI created something, show quick action \*/}**

                **{message.actions?.map(action \=\> (**

                  **\<ActionCard key={action.id}\>**

                    **\<Icon type={action.type} /\>**

                    **\<div\>**

                      **\<strong\>{action.title}\</strong\>**

                      **\<p\>{action.description}\</p\>**

                    **\</div\>**

                    **\<Button size="sm" onClick={() \=\> viewAction(action)}\>**

                      **View →**

                    **\</Button\>**

                  **\</ActionCard\>**

                **))}**

              **\</MessageContent\>**

            **\</AssistantMessage\>**

          **)}**

        **\</Message\>**

      **))}**

      

      **{isTyping && (**

        **\<TypingIndicator\>**

          **\<AIAvatar\>🤖\</AIAvatar\>**

          **\<span\>AI is thinking...\</span\>**

        **\</TypingIndicator\>**

      **)}**

    **\</MessageList\>**

    

    **\<InputArea\>**

      **\<Textarea**

        **placeholder="Ask anything about your team..."**

        **value={input}**

        **onChange={(e) \=\> setInput(e.target.value)}**

        **onKeyDown={handleKeyDown}**

      **/\>**

      **\<ButtonGroup\>**

        **\<Button onClick={send} disabled={\!input.trim()}\>**

          **\<SendIcon /\> Send**

        **\</Button\>**

        **\<Button variant="ghost" onClick={attachContext}\>**

          **\<AttachIcon /\> Attach**

        **\</Button\>**

      **\</ButtonGroup\>**

    **\</InputArea\>**

  **\</ChatContainer\>**


  **\<Sidebar\>**

    **\<SuggestedQueries\>**

      **\<h4\>Suggested Queries\</h4\>**

      **\<Query onClick={() \=\> ask("Show me players with wellness below 6")}\>**

        **Players with low wellness**

      **\</Query\>**

      **\<Query onClick={() \=\> ask("Create a load vs wellness report")}\>**

        **Load vs wellness analysis**

      **\</Query\>**

      **\<Query onClick={() \=\> ask("Who hasn't completed wellness form today?")}\>**

        **Form completion status**

      **\</Query\>**

      **\<Query onClick={() \=\> ask("Summarize this week's training")}\>**

        **Weekly training summary**

      **\</Query\>**

    **\</SuggestedQueries\>**

    

    **\<ConversationHistory\>**

      **\<h4\>Recent Conversations\</h4\>**

      **{recentChats.map(chat \=\> (**

        **\<ChatItem key={chat.id} onClick={() \=\> loadChat(chat.id)}\>**

          **\<span\>{chat.preview}\</span\>**

          **\<Time\>{formatDate(chat.timestamp)}\</Time\>**

        **\</ChatItem\>**

      **))}**

    **\</ConversationHistory\>**

  **\</Sidebar\>**

**\</AIChat\>**

**\`\`\`**

**\---**

**\#\#\# \*\*Example Conversations\*\***

**\#\#\# \*\*Query & Analysis\*\***

**\`\`\`**

**User: "Show me all players with wellness scores below 6 this week"**

**AI: \[calls list\_players, then get\_form\_responses with filters\]**

**AI: "I found 4 players with wellness scores below 6 this week:**

**1\. Marcus Rashford \- Average: 5.2/10**

   **\- Sleep quality declining (5/10 avg)**

   **\- Soreness: 6/10**

   

**2\. Bruno Fernandes \- Average: 5.8/10**

   **\- High fatigue (7/10)**

   **\- Sleep: 6/10**

   

**3\. Harry Maguire \- Average: 5.5/10**

   **\- Recovering from minor knock**

   **\- Energy levels low**

   

**4\. Luke Shaw \- Average: 5.3/10**

   **\- Soreness in hamstring**

   **\- Sleep disrupted**

**Would you like me to:**

**\- Create a recovery event for these players?**

**\- Send them a check-in form?**

**\- Generate a medical report?"**

**\`\`\`**

**\---**

**\`\`\`**

**User: "Create a report showing load vs wellness correlation for the last month"**

**AI: \[calls query\_spreadsheet for load data, get\_form\_responses for wellness\]**

**AI: "I've created a Load vs Wellness report for the last 30 days.**

**Key findings:**

**\- Strong negative correlation (-0.72) between load and next-day wellness**

**\- Players with \>3000 AU weekly load show 15% lower wellness scores**

**\- Recovery time: wellness returns to baseline after 48-72 hours post-high load**

**\[Report created: Load vs Wellness Analysis\]**

**\[View Report →\]**

**Recommendations:**

**\- Consider load management for players exceeding 3200 AU/week**

**\- Schedule recovery sessions after high-load weeks**

**\- Monitor Bruno Fernandes closely (consistently high load \+ declining wellness)"**

**\`\`\`**

**\---**

**\#\#\# \*\*Task Automation\*\***

**\`\`\`**

**User: "Schedule recovery sessions for all players with wellness below 6"**

**AI: \[calls list\_players with filter, then create\_event\]**

**AI: "I've scheduled recovery sessions for 4 players:**

**✓ Marcus Rashford \- Tomorrow 9am (Recovery Session)**

**✓ Bruno Fernandes \- Tomorrow 9am (Recovery Session)**

**✓ Harry Maguire \- Tomorrow 10am (Recovery Session)**

**✓ Luke Shaw \- Tomorrow 10am (Recovery Session)**

**Each session includes:**

**\- Light gym work**

**\- Stretching**

**\- Ice bath**

**\- Sports massage**

**I've also:**

**\- Notified the physio team**

**\- Sent calendar invites**

**\- Added notes with each player's specific concerns**

**\[View Calendar →\]"**

**\`\`\`**

**\---**

**\`\`\`**

**User: "Send daily wellness form to all first team players"**

**AI: \[calls list\_players with tag filter, then distribute\_form\]**

**AI: "Wellness form sent to 25 first team players.**

**Distribution:**

**\- Scheduled: Daily at 8:00 AM**

**\- Reminder: 6:00 PM if not completed**

**\- Duration: Ongoing (until you stop it)**

**Players will receive:**

**\- Mobile push notification**

**\- Email reminder**

**\- SMS reminder (if enabled)**

**\[View Form Responses →\]"**

**\`\`\`**

**\---**

**\#\#\# \*\*Content Generation\*\***

**\`\`\`**

**User: "Write a summary of today's training session"**

**AI: \[calls get\_event with today's date, get\_attendance, search\_notes\]**

**AI: "Today's Training Session Summary**

**Date: November 1, 2025**

**Duration: 90 minutes**

**Attendance: 23/25 players**

**Session Focus:**

**\- Build-up patterns vs low block**

**\- Final third decision making**

**\- Set piece routines**

**Key Observations:**

**\- High intensity maintained throughout**

**\- Marcus Rashford sharp in finishing drills**

**\- Defensive shape improved from last session**

**\- Bruno Fernandes experimenting with deeper position**

**Areas for Development:**

**\- Width in build-up (fullbacks not high enough)**

**\- Timing of forward runs**

**\- Communication in defensive transitions**

**Individual Notes:**

**\- Luke Shaw returned to full training (no restrictions)**

**\- Harry Maguire cautious approach (minor discomfort)**

**Next Session Focus:**

**\- Opposition analysis (Chelsea)**

**\- Pressing triggers**

**\- Transitional play**

**\[Save as Note →\]"**

**\`\`\`**

**\---**

**\#\#\# \*\*Predictions & Insights\*\***

**\`\`\`**

**User: "Which players are at high injury risk?"**

**AI: \[analyzes load data, wellness trends, injury history, training load ratios\]**

**AI: "Injury Risk Assessment (November 1, 2025\)**

**🔴 High Risk (3 players):**

**1\. Marcus Rashford**

   **\- Acute:Chronic load ratio: 1.45 (threshold: 1.3)**

   **\- Wellness declining (5.2/10 avg last 7 days)**

   **\- Previous hamstring issue (Jan 2025\)**

   **\- Recommendation: 25% load reduction this week**

**2\. Bruno Fernandes**

   **\- Consistent high load (3400 AU/week avg)**

   **\- Fatigue accumulating (7/10)**

   **\- No rest days in 14 days**

   **\- Recommendation: Rest day \+ light session**

**3\. Luke Shaw**

   **\- Recent return from injury**

   **\- Load spike (2800 AU this week vs 1200 last week)**

   **\- Hamstring soreness reported**

   **\- Recommendation: Modified training, monitoring**

**🟡 Moderate Risk (5 players):**

**\[List...\]**

**Actions I recommend:**

**1\. Schedule recovery sessions for high-risk players**

**2\. Modify training load for next 7 days**

**3\. Increase monitoring frequency (daily check-ins)**

**4\. Medical review for Marcus and Luke**

**Would you like me to implement these actions?"**

**Contextual AI (In-App)**

**AI available everywhere, context-aware:**

**tsx// In Player Profile**

**\<PlayerProfile\>**

  **\<AIButton onClick={openAI}\>**

    **Ask AI about Marcus**

  **\</AIButton\>**

**\</PlayerProfile\>**

**// Opens AI chat with context:**

**// "You're viewing Marcus Rashford's profile. How can I help?"**

**// User can ask:**

**// \- "Should I rest him this week?"**

**// \- "Summarize his performance this month"**

**// \- "Create a development plan for him"**

**tsx// In Event Detail**

**\<EventDetail\>**

  **\<AIButton onClick={openAI}\>**

    **AI Analysis**

  **\</AIButton\>**

**\</EventDetail\>**

**// Opens with context:**

**// "You're viewing Training Session (Nov 1). How can I help?"**

**// User can ask:**

**// \- "Who performed best?"**

**// \- "Create a match report"**

**// \- "Compare to last week's session"**

**tsx// In Reports**

**\<ReportView\>**

  **\<AIButton onClick={askAI}\>**

    **Explain this data**

  **\</AIButton\>**

**\</ReportView\>**

**// AI analyzes the report and explains insights**

**AI Tools (MCP)**

**Tools Claude can call to interact with SimpleAM:**

**typescriptconst tools \= \[**

  **// Data retrieval**

  **{**

    **name: "list\_players",**

    **description: "Get all players, optionally filtered",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **tags: { type: "array" },**

        **status: { type: "string" }**

      **}**

    **}**

  **},**

  **{**

    **name: "get\_player",**

    **description: "Get detailed player information",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **playerId: { type: "string", required: true }**

      **}**

    **}**

  **},**

  **{**

    **name: "query\_spreadsheet",**

    **description: "Query data from a spreadsheet",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **spreadsheetId: { type: "string" },**

        **filters: { type: "object" },**

        **dateRange: { type: "object" }**

      **}**

    **}**

  **},**

  **{**

    **name: "get\_form\_responses",**

    **description: "Get form responses with filters",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **formId: { type: "string" },**

        **playerId: { type: "string" },**

        **dateRange: { type: "object" }**

      **}**

    **}**

  **},**

  **{**

    **name: "search\_notes",**

    **description: "Search notes by content, tags, or entity",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **query: { type: "string" },**

        **attachedTo: { type: "string" },**

        **tags: { type: "array" }**

      **}**

    **}**

  **},**

  **{**

    **name: "list\_events",**

    **description: "Get calendar events",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **dateRange: { type: "object" },**

        **type: { type: "string" }**

      **}**

    **}**

  **},**


  **// Actions**

  **{**

    **name: "create\_event",**

    **description: "Create a calendar event",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **title: { type: "string", required: true },**

        **startTime: { type: "string", required: true },**

        **endTime: { type: "string" },**

        **attendees: { type: "array" },**

        **type: { type: "string" }**

      **}**

    **}**

  **},**

  **{**

    **name: "distribute\_form",**

    **description: "Send form to players",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **formId: { type: "string", required: true },**

        **playerIds: { type: "array", required: true },**

        **schedule: { type: "object" }**

      **}**

    **}**

  **},**

  **{**

    **name: "create\_note",**

    **description: "Create a note",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **content: { type: "string", required: true },**

        **attachTo: { type: "object" },**

        **tags: { type: "array" },**

        **visibility: { type: "string" }**

      **}**

    **}**

  **},**

  **{**

    **name: "create\_report",**

    **description: "Generate a report",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **type: { type: "string" },**

        **config: { type: "object" }**

      **}**

    **}**

  **},**

  **{**

    **name: "create\_plan",**

    **description: "Create a plan with milestones",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **name: { type: "string", required: true },**

        **type: { type: "string" },**

        **startDate: { type: "string" },**

        **milestones: { type: "array" }**

      **}**

    **}**

  **},**


  **// Analysis**

  **{**

    **name: "analyze\_load\_wellness",**

    **description: "Analyze correlation between load and wellness",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **playerIds: { type: "array" },**

        **dateRange: { type: "object" }**

      **}**

    **}**

  **},**

  **{**

    **name: "calculate\_injury\_risk",**

    **description: "Calculate injury risk for players",**

    **inputSchema: {**

      **type: "object",**

      **properties: {**

        **playerIds: { type: "array" }**

      **}**

    **}**

  **}**

**\]**

**Proactive AI Insights**

**AI monitors data and sends alerts:**

**tsx\<AIInsights\>**

  **\<h3\>AI Insights\</h3\>**


  **\<InsightCard priority="high"\>**

    **\<Icon\>⚠️\</Icon\>**

    **\<div\>**

      **\<strong\>3 players at high injury risk\</strong\>**

      **\<p\>Acute load spike detected for Marcus, Bruno, and Luke\</p\>**

      **\<Time\>Detected 2 hours ago\</Time\>**

    **\</div\>**

    **\<ButtonGroup\>**

      **\<Button size="sm"\>View Details\</Button\>**

      **\<Button size="sm" variant="outline"\>Take Action\</Button\>**

    **\</ButtonGroup\>**

  **\</InsightCard\>**


  **\<InsightCard priority="medium"\>**

    **\<Icon\>📊\</Icon\>**

    **\<div\>**

      **\<strong\>Wellness trending down this week\</strong\>**

      **\<p\>Team average: 6.8/10 (down from 7.5/10 last week)\</p\>**

      **\<Time\>Detected today\</Time\>**

    **\</div\>**

    **\<Button size="sm"\>View Report\</Button\>**

  **\</InsightCard\>**


  **\<InsightCard priority="low"\>**

    **\<Icon\>✅\</Icon\>**

    **\<div\>**

      **\<strong\>Form completion rate improved\</strong\>**

      **\<p\>Daily wellness: 92% completion (up from 78%)\</p\>**

      **\<Time\>This week\</Time\>**

    **\</div\>**

    **\<Button size="sm" variant="ghost"\>Dismiss\</Button\>**

  **\</InsightCard\>**

**\</AIInsights\>**

**Triggers for insights:**

**Load spikes**

**Wellness decline**

**Form completion changes**

**Attendance patterns**

**Injury risk changes**

**Performance anomalies**

**Data Model**

**prismamodel AIConversation {**

  **id        String @id**

  **orgId     String**

  **userId    String**

  **user      User @relation(fields: \[userId\], references: \[id\])**


  **title     String // auto-generated summary**

  **messages  AIMessage\[\]**


  **// Context**

  **contextType String? // "player", "event", "report"**

  **contextId   String?**


  **createdAt DateTime @default(now())**

  **updatedAt DateTime @updatedAt**

**}**

**model AIMessage {**

  **id             String @id**

  **conversationId String**

  **conversation   AIConversation @relation(fields: \[conversationId\], references: \[id\])**


  **role           String // "user" or "assistant"**

  **content        String @db.Text**


  **// If AI took actions**

  **actions        Json? // \[{type: "event\_created", id: "event\_123"}\]**


  **// Tool calls made**

  **toolCalls      Json?**


  **createdAt      DateTime @default(now())**

**}**

**model AIInsight {**

  **id          String @id**

  **orgId       String**


  **type        String // "injury\_risk", "wellness\_decline", "load\_spike"**

  **priority    String // "high", "medium", "low"**


  **title       String**

  **description String**

  **data        Json // detailed data backing insight**


  **// Related entities**

  **playerIds   String\[\]**


  **// Status**

  **status      String @default("active") // "active", "dismissed", "acted\_on"**


  **createdAt   DateTime @default(now())**

  **dismissedAt DateTime?**

**}**

**AI Settings**

**tsx\<AISettings\>**

  **\<h2\>AI Settings\</h2\>**


  **\<Section\>**

    **\<h3\>Proactive Insights\</h3\>**

    **\<p\>AI monitors your data and alerts you to important patterns\</p\>**

    

    **\<ToggleGroup\>**

      **\<Toggle checked={settings.injuryRiskAlerts}\>**

        **\<strong\>Injury Risk Alerts\</strong\>**

        **\<p\>Get notified when players show high injury risk\</p\>**

      **\</Toggle\>**

      

      **\<Toggle checked={settings.wellnessAlerts}\>**

        **\<strong\>Wellness Alerts\</strong\>**

        **\<p\>Alert when team wellness declines significantly\</p\>**

      **\</Toggle\>**

      

      **\<Toggle checked={settings.loadAlerts}\>**

        **\<strong\>Load Monitoring\</strong\>**

        **\<p\>Alert on acute load spikes or dangerous ratios\</p\>**

      **\</Toggle\>**

      

      **\<Toggle checked={settings.formCompletionAlerts}\>**

        **\<strong\>Form Completion\</strong\>**

        **\<p\>Alert when form completion drops below threshold\</p\>**

      **\</Toggle\>**

    **\</ToggleGroup\>**

  **\</Section\>**


  **\<Section\>**

    **\<h3\>Alert Frequency\</h3\>**

    **\<Select value={settings.frequency}\>**

      **\<option\>Real-time\</option\>**

      **\<option\>Daily digest\</option\>**

      **\<option\>Weekly summary\</option\>**

    **\</Select\>**

  **\</Section\>**


  **\<Section\>**

    **\<h3\>Data Access\</h3\>**

    **\<p\>Control what data AI can access\</p\>**

    

    **\<CheckboxGroup\>**

      **\<Checkbox checked\>Player wellness data\</Checkbox\>**

      **\<Checkbox checked\>Load/GPS data\</Checkbox\>**

      **\<Checkbox checked\>Medical notes\</Checkbox\>**

      **\<Checkbox checked\>Form responses\</Checkbox\>**

      **\<Checkbox checked\>Event attendance\</Checkbox\>**

      **\<Checkbox\>Private notes\</Checkbox\>**

    **\</CheckboxGroup\>**

  **\</Section\>**


  **\<Button\>Save Settings\</Button\>**

**\</AISettings\>**

**AI Cost Management**

**Anthropic API pricing:**

**Claude Sonnet 4: $3 per million input tokens, $15 per million output tokens**

**Average conversation: \~5k tokens \= $0.075**

**1000 conversations/month \= \~$75**

**Cost control:**

**Rate limiting per user/org**

**Token limits per conversation**

**Caching for repeated queries**

**Efficient tool calls (fetch only needed data)**

**Build Effort**

**Chat interface: 1 week**

**Chat UI with streaming**

**Message history**

**Suggested queries**

**Tool integration: 1 week**

**Implement all MCP tools**

**Tool calling logic**

**Error handling**

**Contextual AI: 3-4 days**

**AI buttons throughout app**

**Context passing**

**Proactive insights: 1 week**

**Background jobs analyzing data**

**Alert generation**

**Insight cards**

**AI settings: 2-3 days**

**Settings UI**

**Preferences storage**

**Total: \~4 weeks for AI system**

# **AI**

## **AI \- Full Picture**

### **What AI Does**

1. **Natural language queries** \- "Show me players with low wellness", "Create a report on load trends"  
2. **Data analysis** \- Identify patterns, correlations, anomalies  
3. **Automated insights** \- Proactive suggestions based on data  
4. **Content generation** \- Create notes, summaries, reports  
5. **Predictions** \- Injury risk, performance trends  
6. **Task automation** \- Schedule events, send forms, organize data  
7. **Conversational interface** \- Chat with your data

---

### **Tech Stack**

* **Anthropic API (Claude)** \- primary AI engine  
* **MCP server** (already covered in Integrations) \- AI accesses your data  
* **Chat interface** \- custom-built with streaming responses  
* **Tool calling** \- AI can execute actions (create events, send forms, etc.)  
* **Vector database (optional)** \- for semantic search over notes/documents

---

### **AI Architecture**

User asks question  
    ↓  
Claude receives query \+ has access to MCP tools  
    ↓  
Claude calls tools to fetch data:  
  \- list\_players  
  \- query\_spreadsheet  
  \- get\_form\_responses  
  \- search\_notes  
    ↓  
Claude analyzes data  
    ↓

Claude responds with insights \+ takes actions if requested

---

### **AI Interface**

### **Main AI Chat**

tsx  
\<AIChat\>  
  \<ChatContainer\>  
    \<MessageList\>  
      {messages.map(message \=\> (  
        \<Message key\={message.id} role\={message.role}\>  
          {message.role \=== "user" ? (  
            \<UserMessage\>  
              \<Avatar src\={currentUser.photo} /\>  
              \<MessageContent\>{message.content}\</MessageContent\>  
            \</UserMessage\>  
          ) : (  
            \<AssistantMessage\>  
              \<AIAvatar\>🤖\</AIAvatar\>  
              \<MessageContent\>  
                \<Markdown\>{message.content}\</Markdown\>  
                  
                {*/\* If AI created something, show quick action \*/*}  
                {message.actions?.map(action \=\> (  
                  \<ActionCard key\={action.id}\>  
                    \<Icon type\={action.type} /\>  
                    \<div\>  
                      \<strong\>{action.title}\</strong\>  
                      \<p\>{action.description}\</p\>  
                    \</div\>  
                    \<Button size\="sm" onClick\={() \=\> viewAction(action)}\>  
                      View →  
                    \</Button\>  
                  \</ActionCard\>  
                ))}  
              \</MessageContent\>  
            \</AssistantMessage\>  
          )}  
        \</Message\>  
      ))}  
        
      {isTyping && (  
        \<TypingIndicator\>  
          \<AIAvatar\>🤖\</AIAvatar\>  
          \<span\>AI is thinking...\</span\>  
        \</TypingIndicator\>  
      )}  
    \</MessageList\>  
      
    \<InputArea\>  
      \<Textarea  
        placeholder\="Ask anything about your team..."  
        value\={input}  
        onChange\={(e) \=\> setInput(e.target.value)}  
        onKeyDown\={handleKeyDown}  
      /\>  
      \<ButtonGroup\>  
        \<Button onClick\={send} disabled\={\!input.trim()}\>  
          \<SendIcon /\> Send  
        \</Button\>  
        \<Button variant\="ghost" onClick\={attachContext}\>  
          \<AttachIcon /\> Attach  
        \</Button\>  
      \</ButtonGroup\>  
    \</InputArea\>  
  \</ChatContainer\>  
    
  \<Sidebar\>  
    \<SuggestedQueries\>  
      \<h4\>Suggested Queries\</h4\>  
      \<Query onClick\={() \=\> ask("Show me players with wellness below 6")}\>  
        Players with low wellness  
      \</Query\>  
      \<Query onClick\={() \=\> ask("Create a load vs wellness report")}\>  
        Load vs wellness analysis  
      \</Query\>  
      \<Query onClick\={() \=\> ask("Who hasn't completed wellness form today?")}\>  
        Form completion status  
      \</Query\>  
      \<Query onClick\={() \=\> ask("Summarize this week's training")}\>  
        Weekly training summary  
      \</Query\>  
    \</SuggestedQueries\>  
      
    \<ConversationHistory\>  
      \<h4\>Recent Conversations\</h4\>  
      {recentChats.map(chat \=\> (  
        \<ChatItem key\={chat.id} onClick\={() \=\> loadChat(chat.id)}\>  
          \<span\>{chat.preview}\</span\>  
          \<Time\>{formatDate(chat.timestamp)}\</Time\>  
        \</ChatItem\>  
      ))}  
    \</ConversationHistory\>  
  \</Sidebar\>  
\</AIChat\>  
\`\`\`

\---

\#\#\# \*\*Example Conversations\*\*

\#\#\# \*\*Query & Analysis\*\*  
\`\`\`  
User: "Show me all players with wellness scores below 6 this week"

AI: \[calls list\_players, then get\_form\_responses with filters\]

AI: "I found 4 players with wellness scores below 6 this week:

1\. Marcus Rashford \- Average: 5.2/10  
   \- Sleep quality declining (5/10 avg)  
   \- Soreness: 6/10  
     
2\. Bruno Fernandes \- Average: 5.8/10  
   \- High fatigue (7/10)  
   \- Sleep: 6/10  
     
3\. Harry Maguire \- Average: 5.5/10  
   \- Recovering from minor knock  
   \- Energy levels low  
     
4\. Luke Shaw \- Average: 5.3/10  
   \- Soreness in hamstring  
   \- Sleep disrupted

Would you like me to:  
\- Create a recovery event for these players?  
\- Send them a check\-in form?  
\- Generate a medical report?"  
\`\`\`

\---  
\`\`\`  
User: "Create a report showing load vs wellness correlation for the last month"

AI: \[calls query\_spreadsheet for load data, get\_form\_responses for wellness\]

AI: "I've created a Load vs Wellness report for the last 30 days.

Key findings:  
\- Strong negative correlation (\-0.72) between load and next\-day wellness  
\- Players with \>3000 AU weekly load show 15% lower wellness scores  
\- Recovery time: wellness returns to baseline after 48\-72 hours post\-high load

\[Report created: Load vs Wellness Analysis\]  
\[View Report →\]

Recommendations:  
\- Consider load management for players exceeding 3200 AU/week  
\- Schedule recovery sessions after high\-load weeks  
\- Monitor Bruno Fernandes closely (consistently high load \+ declining wellness)"  
\`\`\`

\---

\#\#\# \*\*Task Automation\*\*  
\`\`\`  
User: "Schedule recovery sessions for all players with wellness below 6"

AI: \[calls list\_players with filter, then create\_event\]

AI: "I've scheduled recovery sessions for 4 players:

✓ Marcus Rashford \- Tomorrow 9am (Recovery Session)  
✓ Bruno Fernandes \- Tomorrow 9am (Recovery Session)  
✓ Harry Maguire \- Tomorrow 10am (Recovery Session)  
✓ Luke Shaw \- Tomorrow 10am (Recovery Session)

Each session includes:  
\- Light gym work  
\- Stretching  
\- Ice bath  
\- Sports massage

I've also:  
\- Notified the physio team  
\- Sent calendar invites  
\- Added notes with each player's specific concerns

\[View Calendar →\]"  
\`\`\`

\---  
\`\`\`  
User: "Send daily wellness form to all first team players"

AI: \[calls list\_players with tag filter, then distribute\_form\]

AI: "Wellness form sent to 25 first team players.

Distribution:  
\- Scheduled: Daily at 8:00 AM  
\- Reminder: 6:00 PM if not completed  
\- Duration: Ongoing (until you stop it)

Players will receive:  
\- Mobile push notification  
\- Email reminder  
\- SMS reminder (if enabled)

\[View Form Responses →\]"  
\`\`\`

\---

\#\#\# \*\*Content Generation\*\*  
\`\`\`  
User: "Write a summary of today's training session"

AI: \[calls get\_event with today's date, get\_attendance, search\_notes\]

AI: "Today's Training Session Summary  
Date: November 1, 2025  
Duration: 90 minutes  
Attendance: 23/25 players

Session Focus:  
\- Build\-up patterns vs low block  
\- Final third decision making  
\- Set piece routines

Key Observations:  
\- High intensity maintained throughout  
\- Marcus Rashford sharp in finishing drills  
\- Defensive shape improved from last session  
\- Bruno Fernandes experimenting with deeper position

Areas for Development:  
\- Width in build\-up (fullbacks not high enough)  
\- Timing of forward runs  
\- Communication in defensive transitions

Individual Notes:  
\- Luke Shaw returned to full training (no restrictions)  
\- Harry Maguire cautious approach (minor discomfort)

Next Session Focus:  
\- Opposition analysis (Chelsea)  
\- Pressing triggers  
\- Transitional play

\[Save as Note →\]"  
\`\`\`

\---

\#\#\# \*\*Predictions & Insights\*\*  
\`\`\`  
User: "Which players are at high injury risk?"

AI: \[analyzes load data, wellness trends, injury history, training load ratios\]

AI: "Injury Risk Assessment (November 1, 2025)

🔴 High Risk (3 players):  
1\. Marcus Rashford  
   \- Acute:Chronic load ratio: 1.45 (threshold: 1.3)  
   \- Wellness declining (5.2/10 avg last 7 days)  
   \- Previous hamstring issue (Jan 2025)  
   \- Recommendation: 25% load reduction this week

2\. Bruno Fernandes  
   \- Consistent high load (3400 AU/week avg)  
   \- Fatigue accumulating (7/10)  
   \- No rest days in 14 days  
   \- Recommendation: Rest day \+ light session

3\. Luke Shaw  
   \- Recent return from injury  
   \- Load spike (2800 AU this week vs 1200 last week)  
   \- Hamstring soreness reported  
   \- Recommendation: Modified training, monitoring

🟡 Moderate Risk (5 players):  
\[List...\]

Actions I recommend:  
1\. Schedule recovery sessions for high\-risk players  
2\. Modify training load for next 7 days  
3\. Increase monitoring frequency (daily check\-ins)  
4\. Medical review for Marcus and Luke

Would you like me to implement these actions?"

---

### **Contextual AI (In-App)**

**AI available everywhere, context-aware:**

tsx  
*// In Player Profile*  
\<PlayerProfile\>  
  \<AIButton onClick\={openAI}\>  
    Ask AI about Marcus  
  \</AIButton\>  
\</PlayerProfile\>

*// Opens AI chat with context:*  
*// "You're viewing Marcus Rashford's profile. How can I help?"*

*// User can ask:*  
*// \- "Should I rest him this week?"*  
*// \- "Summarize his performance this month"*

*// \- "Create a development plan for him"*

tsx  
*// In Event Detail*  
\<EventDetail\>  
  \<AIButton onClick\={openAI}\>  
    AI Analysis  
  \</AIButton\>  
\</EventDetail\>

*// Opens with context:*  
*// "You're viewing Training Session (Nov 1). How can I help?"*

*// User can ask:*  
*// \- "Who performed best?"*  
*// \- "Create a match report"*

*// \- "Compare to last week's session"*

tsx  
*// In Reports*  
\<ReportView\>  
  \<AIButton onClick\={askAI}\>  
    Explain this data  
  \</AIButton\>  
\</ReportView\>

*// AI analyzes the report and explains insights*

---

### **AI Tools (MCP)**

**Tools Claude can call to interact with SimpleAM:**

typescript  
const tools \= \[  
  *// Data retrieval*  
  {  
    name: "list\_players",  
    description: "Get all players, optionally filtered",  
    inputSchema: {  
      type: "object",  
      properties: {  
        tags: { type: "array" },  
        status: { type: "string" }  
      }  
    }  
  },  
  {  
    name: "get\_player",  
    description: "Get detailed player information",  
    inputSchema: {  
      type: "object",  
      properties: {  
        playerId: { type: "string", required: true }  
      }  
    }  
  },  
  {  
    name: "query\_spreadsheet",  
    description: "Query data from a spreadsheet",  
    inputSchema: {  
      type: "object",  
      properties: {  
        spreadsheetId: { type: "string" },  
        filters: { type: "object" },  
        dateRange: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "get\_form\_responses",  
    description: "Get form responses with filters",  
    inputSchema: {  
      type: "object",  
      properties: {  
        formId: { type: "string" },  
        playerId: { type: "string" },  
        dateRange: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "search\_notes",  
    description: "Search notes by content, tags, or entity",  
    inputSchema: {  
      type: "object",  
      properties: {  
        query: { type: "string" },  
        attachedTo: { type: "string" },  
        tags: { type: "array" }  
      }  
    }  
  },  
  {  
    name: "list\_events",  
    description: "Get calendar events",  
    inputSchema: {  
      type: "object",  
      properties: {  
        dateRange: { type: "object" },  
        type: { type: "string" }  
      }  
    }  
  },  
    
  *// Actions*  
  {  
    name: "create\_event",  
    description: "Create a calendar event",  
    inputSchema: {  
      type: "object",  
      properties: {  
        title: { type: "string", required: true },  
        startTime: { type: "string", required: true },  
        endTime: { type: "string" },  
        attendees: { type: "array" },  
        type: { type: "string" }  
      }  
    }  
  },  
  {  
    name: "distribute\_form",  
    description: "Send form to players",  
    inputSchema: {  
      type: "object",  
      properties: {  
        formId: { type: "string", required: true },  
        playerIds: { type: "array", required: true },  
        schedule: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "create\_note",  
    description: "Create a note",  
    inputSchema: {  
      type: "object",  
      properties: {  
        content: { type: "string", required: true },  
        attachTo: { type: "object" },  
        tags: { type: "array" },  
        visibility: { type: "string" }  
      }  
    }  
  },  
  {  
    name: "create\_report",  
    description: "Generate a report",  
    inputSchema: {  
      type: "object",  
      properties: {  
        type: { type: "string" },  
        config: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "create\_plan",  
    description: "Create a plan with milestones",  
    inputSchema: {  
      type: "object",  
      properties: {  
        name: { type: "string", required: true },  
        type: { type: "string" },  
        startDate: { type: "string" },  
        milestones: { type: "array" }  
      }  
    }  
  },  
    
  *// Analysis*  
  {  
    name: "analyze\_load\_wellness",  
    description: "Analyze correlation between load and wellness",  
    inputSchema: {  
      type: "object",  
      properties: {  
        playerIds: { type: "array" },  
        dateRange: { type: "object" }  
      }  
    }  
  },  
  {  
    name: "calculate\_injury\_risk",  
    description: "Calculate injury risk for players",  
    inputSchema: {  
      type: "object",  
      properties: {  
        playerIds: { type: "array" }  
      }  
    }  
  }

\]

---

### **Proactive AI Insights**

**AI monitors data and sends alerts:**

tsx  
\<AIInsights\>  
  \<h3\>AI Insights\</h3\>  
    
  \<InsightCard priority\="high"\>  
    \<Icon\>⚠️\</Icon\>  
    \<div\>  
      \<strong\>3 players at high injury risk\</strong\>  
      \<p\>Acute load spike detected for Marcus, Bruno, and Luke\</p\>  
      \<Time\>Detected 2 hours ago\</Time\>  
    \</div\>  
    \<ButtonGroup\>  
      \<Button size\="sm"\>View Details\</Button\>  
      \<Button size\="sm" variant\="outline"\>Take Action\</Button\>  
    \</ButtonGroup\>  
  \</InsightCard\>  
    
  \<InsightCard priority\="medium"\>  
    \<Icon\>📊\</Icon\>  
    \<div\>  
      \<strong\>Wellness trending down this week\</strong\>  
      \<p\>Team average: 6.8/10 (down from 7.5/10 last week)\</p\>  
      \<Time\>Detected today\</Time\>  
    \</div\>  
    \<Button size\="sm"\>View Report\</Button\>  
  \</InsightCard\>  
    
  \<InsightCard priority\="low"\>  
    \<Icon\>✅\</Icon\>  
    \<div\>  
      \<strong\>Form completion rate improved\</strong\>  
      \<p\>Daily wellness: 92% completion (up from 78%)\</p\>  
      \<Time\>This week\</Time\>  
    \</div\>  
    \<Button size\="sm" variant\="ghost"\>Dismiss\</Button\>  
  \</InsightCard\>

\</AIInsights\>

**Triggers for insights:**

* Load spikes  
* Wellness decline  
* Form completion changes  
* Attendance patterns  
* Injury risk changes  
* Performance anomalies

---

### **Data Model**

prisma  
model AIConversation {  
  id        String @id  
  orgId     String  
  userId    String  
  user      User @relation(fields: \[userId\], references: \[id\])  
    
  title     String // auto-generated summary  
  messages  AIMessage\[\]  
    
  // Context  
  contextType String? // "player", "event", "report"  
  contextId   String?  
    
  createdAt DateTime @default(now())  
  updatedAt DateTime @updatedAt  
}

model AIMessage {  
  id             String @id  
  conversationId String  
  conversation   AIConversation @relation(fields: \[conversationId\], references: \[id\])  
    
  role           String // "user" or "assistant"  
  content        String @db.Text  
    
  // If AI took actions  
  actions        Json? // \[{type: "event\_created", id: "event\_123"}\]  
    
  // Tool calls made  
  toolCalls      Json?  
    
  createdAt      DateTime @default(now())  
}

model AIInsight {  
  id          String @id  
  orgId       String  
    
  type        String // "injury\_risk", "wellness\_decline", "load\_spike"  
  priority    String // "high", "medium", "low"  
    
  title       String  
  description String  
  data        Json // detailed data backing insight  
    
  // Related entities  
  playerIds   String\[\]  
    
  // Status  
  status      String @default("active") // "active", "dismissed", "acted\_on"  
    
  createdAt   DateTime @default(now())  
  dismissedAt DateTime?

}

---

### **AI Settings**

tsx  
\<AISettings\>  
  \<h2\>AI Settings\</h2\>  
    
  \<Section\>  
    \<h3\>Proactive Insights\</h3\>  
    \<p\>AI monitors your data and alerts you to important patterns\</p\>  
      
    \<ToggleGroup\>  
      \<Toggle checked\={settings.injuryRiskAlerts}\>  
        \<strong\>Injury Risk Alerts\</strong\>  
        \<p\>Get notified when players show high injury risk\</p\>  
      \</Toggle\>  
        
      \<Toggle checked\={settings.wellnessAlerts}\>  
        \<strong\>Wellness Alerts\</strong\>  
        \<p\>Alert when team wellness declines significantly\</p\>  
      \</Toggle\>  
        
      \<Toggle checked\={settings.loadAlerts}\>  
        \<strong\>Load Monitoring\</strong\>  
        \<p\>Alert on acute load spikes or dangerous ratios\</p\>  
      \</Toggle\>  
        
      \<Toggle checked\={settings.formCompletionAlerts}\>  
        \<strong\>Form Completion\</strong\>  
        \<p\>Alert when form completion drops below threshold\</p\>  
      \</Toggle\>  
    \</ToggleGroup\>  
  \</Section\>  
    
  \<Section\>  
    \<h3\>Alert Frequency\</h3\>  
    \<Select value\={settings.frequency}\>  
      \<option\>Real-time\</option\>  
      \<option\>Daily digest\</option\>  
      \<option\>Weekly summary\</option\>  
    \</Select\>  
  \</Section\>  
    
  \<Section\>  
    \<h3\>Data Access\</h3\>  
    \<p\>Control what data AI can access\</p\>  
      
    \<CheckboxGroup\>  
      \<Checkbox checked\>Player wellness data\</Checkbox\>  
      \<Checkbox checked\>Load/GPS data\</Checkbox\>  
      \<Checkbox checked\>Medical notes\</Checkbox\>  
      \<Checkbox checked\>Form responses\</Checkbox\>  
      \<Checkbox checked\>Event attendance\</Checkbox\>  
      \<Checkbox\>Private notes\</Checkbox\>  
    \</CheckboxGroup\>  
  \</Section\>  
    
  \<Button\>Save Settings\</Button\>

\</AISettings\>

---

### **AI Cost Management**

**Anthropic API pricing:**

* Claude Sonnet 4: $3 per million input tokens, $15 per million output tokens  
* Average conversation: \~5k tokens \= $0.075  
* 1000 conversations/month \= \~$75

**Cost control:**

* Rate limiting per user/org  
* Token limits per conversation  
* Caching for repeated queries  
* Efficient tool calls (fetch only needed data)

---

### **Build Effort**

**Chat interface:** 1 week

* Chat UI with streaming  
* Message history  
* Suggested queries

**Tool integration:** 1 week

* Implement all MCP tools  
* Tool calling logic  
* Error handling

**Contextual AI:** 3-4 days

* AI buttons throughout app  
* Context passing

**Proactive insights:** 1 week

* Background jobs analyzing data  
* Alert generation  
* Insight cards

**AI settings:** 2-3 days

* Settings UI  
* Preferences storage

**Total: \~4 weeks for AI system**

# **Templates Hub**

# **Templates Hub \- Full Picture**

What Templates Hub Does  
Share templates \- forms, reports, drawings, plans  
Discover templates \- browse what others have shared  
Rate & review \- community feedback on templates  
Download/use \- one-click to use community templates  
Global templates \- SimpleAM-provided templates (starter pack)  
User uploads \- users can publish their templates  
Categories & search \- organized, discoverable  
Template Types  
Forms:

Daily Wellness Check  
Injury Report  
Match Readiness  
Recovery Session Feedback  
Parent Consent Forms  
Reports:

Player Performance Summary  
Squad Wellness Overview  
Load Distribution Analysis  
Injury Incidence Report  
Drawings:

4-3-3 Formation  
Pressing Drill  
Corner Kick Routine  
Passing Pattern  
Plans:

Season Plan Template  
6-Week Rehab Protocol  
Player Development (Season)  
Match Week Preparation  
User Flow  
Browse Templates  
tsx  
\<CommunityHub\>  
  \<Header\>  
    \<h1\>Community Hub\</h1\>  
    \<p\>Discover and share templates with the SimpleAM community\</p\>  
  \</Header\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search templates..." /\>  
    \<FilterSelect label="Type"\>  
      \<option\>All\</option\>  
      \<option\>Forms\</option\>  
      \<option\>Reports\</option\>  
      \<option\>Drawings\</option\>  
      \<option\>Plans\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Sport"\>  
      \<option\>All Sports\</option\>  
      \<option\>Football\</option\>  
      \<option\>Rugby\</option\>  
      \<option\>Basketball\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Category"\>  
      \<option\>All\</option\>  
      \<option\>Wellness\</option\>  
      \<option\>Performance\</option\>  
      \<option\>Medical\</option\>  
      \<option\>Tactics\</option\>  
    \</FilterSelect\>  
    \<Select label="Sort"\>  
      \<option\>Most Popular\</option\>  
      \<option\>Highest Rated\</option\>  
      \<option\>Newest\</option\>  
    \</Select\>  
    \<Button onClick={openUpload}\>+ Share Template\</Button\>  
  \</Toolbar\>  
    
  \<FeaturedSection\>  
    \<h2\>Featured Templates\</h2\>  
    \<TemplateCarousel\>  
      {featuredTemplates.map(template \=\> (  
        \<FeaturedCard key={template.id}\>  
          \<Preview src={template.previewImage} /\>  
          \<h3\>{template.name}\</h3\>  
          \<p\>{template.description}\</p\>  
          \<Meta\>  
            \<Badge variant="primary"\>Featured\</Badge\>  
            \<Rating value={template.rating} /\>  
            \<span\>{template.downloads} downloads\</span\>  
          \</Meta\>  
          \<Button\>Use Template\</Button\>  
        \</FeaturedCard\>  
      ))}  
    \</TemplateCarousel\>  
  \</FeaturedSection\>  
    
  \<TemplateGrid\>  
    \<SectionHeader\>  
      \<h2\>All Templates\</h2\>  
      \<span\>{templates.length} templates\</span\>  
    \</SectionHeader\>  
      
    {templates.map(template \=\> (  
      \<TemplateCard key={template.id}\>  
        \<Preview\>  
          {template.type \=== "drawing" && \<img src={template.previewImage} /\>}  
          {template.type \=== "form" && \<FormIcon /\>}  
          {template.type \=== "report" && \<ReportIcon /\>}  
          {template.type \=== "plan" && \<PlanIcon /\>}  
        \</Preview\>  
          
        \<CardContent\>  
          \<h3\>{template.name}\</h3\>  
          \<p\>{template.description}\</p\>  
            
          \<Meta\>  
            \<Badge\>{template.type}\</Badge\>  
            \<Badge variant="outline"\>{template.category}\</Badge\>  
            \<Rating value={template.rating} /\>  
            \<span\>{template.downloads} downloads\</span\>  
          \</Meta\>  
            
          \<Author\>  
            {template.isOfficial ? (  
              \<\>  
                \<Badge variant="primary"\>Official\</Badge\>  
                \<span\>SimpleAM\</span\>  
              \</\>  
            ) : (  
              \<\>  
                \<Avatar src={template.author.photo} size="sm" /\>  
                \<span\>{template.author.name}\</span\>  
                \<span\>·\</span\>  
                \<span\>{template.author.org}\</span\>  
              \</\>  
            )}  
          \</Author\>  
        \</CardContent\>  
          
        \<CardActions\>  
          \<Button onClick={() \=\> useTemplate(template.id)}\>  
            Use Template  
          \</Button\>  
          \<Button variant="outline" onClick={() \=\> preview(template.id)}\>  
            Preview  
          \</Button\>  
        \</CardActions\>  
      \</TemplateCard\>  
    ))}  
  \</TemplateGrid\>  
\</CommunityHub\>  
Template Detail  
tsx  
\<TemplateDetail\>  
  \<Header\>  
    \<div\>  
      \<h1\>{template.name}\</h1\>  
      \<Meta\>  
        \<Badge\>{template.type}\</Badge\>  
        \<Badge variant="outline"\>{template.category}\</Badge\>  
        \<Badge variant="outline"\>{template.sport}\</Badge\>  
      \</Meta\>  
      \<p\>{template.description}\</p\>  
    \</div\>  
    \<Actions\>  
      \<Button size="lg" onClick={useTemplate}\>  
        Use Template  
      \</Button\>  
      \<Button variant="outline" onClick={favorite}\>  
        \<HeartIcon /\> Save  
      \</Button\>  
      \<Button variant="outline" onClick={share}\>  
        \<ShareIcon /\> Share  
      \</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Stats\>  
    \<Stat\>  
      \<Icon\>⬇️\</Icon\>  
      \<div\>  
        \<strong\>{template.downloads}\</strong\>  
        \<span\>Downloads\</span\>  
      \</div\>  
    \</Stat\>  
    \<Stat\>  
      \<Icon\>⭐\</Icon\>  
      \<div\>  
        \<strong\>{template.rating}/5\</strong\>  
        \<span\>Rating ({template.reviewCount} reviews)\</span\>  
      \</div\>  
    \</Stat\>  
    \<Stat\>  
      \<Icon\>📅\</Icon\>  
      \<div\>  
        \<strong\>{formatDate(template.createdAt)}\</strong\>  
        \<span\>Published\</span\>  
      \</div\>  
    \</Stat\>  
  \</Stats\>  
    
  \<Preview\>  
    \<h3\>Preview\</h3\>  
    {template.type \=== "drawing" && (  
      \<DrawingPreview src={template.previewImage} /\>  
    )}  
    {template.type \=== "form" && (  
      \<FormPreview fields={template.config.fields} /\>  
    )}  
    {template.type \=== "report" && (  
      \<ReportPreview config={template.config} /\>  
    )}  
    {template.type \=== "plan" && (  
      \<PlanPreview milestones={template.config.milestones} /\>  
    )}  
  \</Preview\>  
    
  \<Details\>  
    \<Section\>  
      \<h3\>About This Template\</h3\>  
      \<Markdown\>{template.longDescription}\</Markdown\>  
    \</Section\>  
      
    \<Section\>  
      \<h3\>What's Included\</h3\>  
      \<FeatureList\>  
        {template.features.map(feature \=\> (  
          \<Feature key={feature}\>  
            \<CheckIcon /\>  
            \<span\>{feature}\</span\>  
          \</Feature\>  
        ))}  
      \</FeatureList\>  
    \</Section\>  
      
    \<Section\>  
      \<h3\>Best For\</h3\>  
      \<TagList\>  
        {template.tags.map(tag \=\> \<Tag key={tag}\>{tag}\</Tag\>)}  
      \</TagList\>  
    \</Section\>  
  \</Details\>  
    
  \<Author\>  
    \<h3\>Created By\</h3\>  
    \<AuthorCard\>  
      {template.isOfficial ? (  
        \<\>  
          \<Logo\>SimpleAM\</Logo\>  
          \<div\>  
            \<strong\>SimpleAM\</strong\>  
            \<Badge variant="primary"\>Official\</Badge\>  
            \<p\>Professional templates from SimpleAM\</p\>  
          \</div\>  
        \</\>  
      ) : (  
        \<\>  
          \<Avatar src={template.author.photo} large /\>  
          \<div\>  
            \<strong\>{template.author.name}\</strong\>  
            \<p\>{template.author.role} at {template.author.org}\</p\>  
            \<span\>{template.author.templatesCount} templates\</span\>  
          \</div\>  
        \</\>  
      )}  
    \</AuthorCard\>  
  \</Author\>  
    
  \<Reviews\>  
    \<h3\>Reviews ({template.reviewCount})\</h3\>  
      
    \<RatingSummary\>  
      \<OverallRating\>  
        \<span className="text-4xl"\>{template.rating}\</span\>  
        \<StarRating value={template.rating} /\>  
        \<span\>{template.reviewCount} reviews\</span\>  
      \</OverallRating\>  
        
      \<RatingBreakdown\>  
        \<RatingBar stars={5} count={120} /\>  
        \<RatingBar stars={4} count={45} /\>  
        \<RatingBar stars={3} count={10} /\>  
        \<RatingBar stars={2} count={3} /\>  
        \<RatingBar stars={1} count={2} /\>  
      \</RatingBreakdown\>  
    \</RatingSummary\>  
      
    {currentUserCanReview && (  
      \<Button variant="outline" onClick={writeReview}\>  
        Write a Review  
      \</Button\>  
    )}  
      
    \<ReviewList\>  
      {reviews.map(review \=\> (  
        \<Review key={review.id}\>  
          \<ReviewHeader\>  
            \<Avatar src={review.author.photo} /\>  
            \<div\>  
              \<strong\>{review.author.name}\</strong\>  
              \<StarRating value={review.rating} /\>  
              \<Time\>{formatDate(review.createdAt)}\</Time\>  
            \</div\>  
          \</ReviewHeader\>  
          \<ReviewContent\>{review.content}\</ReviewContent\>  
          \<ReviewActions\>  
            \<Button variant="ghost" size="sm"\>  
              \<ThumbsUpIcon /\> Helpful ({review.helpfulCount})  
            \</Button\>  
          \</ReviewActions\>  
        \</Review\>  
      ))}  
    \</ReviewList\>  
  \</Reviews\>  
\</TemplateDetail\>  
Using a Template  
tsx  
// User clicks "Use Template"

\<UseTemplateModal\>  
  \<h3\>Use "{template.name}"\</h3\>  
    
  {template.type \=== "form" && (  
    \<FormSetup\>  
      \<p\>This will create a new form based on this template\</p\>  
      \<Input label="Form Name" defaultValue={template.name} /\>  
      \<Checkbox\>Customize fields before saving\</Checkbox\>  
      \<Button\>Create Form\</Button\>  
    \</FormSetup\>  
  )}  
    
  {template.type \=== "report" && (  
    \<ReportSetup\>  
      \<p\>This will create a new report based on this template\</p\>  
      \<Input label="Report Name" defaultValue={template.name} /\>  
      \<Select label="Data Source"\>  
        {/\* User selects their spreadsheet/form \*/}  
      \</Select\>  
      \<Button\>Create Report\</Button\>  
    \</ReportSetup\>  
  )}  
    
  {template.type \=== "drawing" && (  
    \<DrawingSetup\>  
      \<p\>This will create a new drawing based on this template\</p\>  
      \<Input label="Drawing Name" defaultValue={template.name} /\>  
      \<Button\>Create Drawing\</Button\>  
    \</DrawingSetup\>  
  )}  
    
  {template.type \=== "plan" && (  
    \<PlanSetup\>  
      \<p\>This will create a new plan based on this template\</p\>  
      \<Input label="Plan Name" defaultValue={template.name} /\>  
      \<DateRange label="Duration" /\>  
      \<Select label="Link to"\>  
        \<option\>None\</option\>  
        \<option\>Player\</option\>  
        \<option\>Event\</option\>  
      \</Select\>  
      \<Button\>Create Plan\</Button\>  
    \</PlanSetup\>  
  )}  
\</UseTemplateModal\>

// After creation:  
// \- Template download count increments  
// \- User redirected to edit their new item  
// \- Template marked as "used" in user's library  
Upload Template  
tsx  
\<UploadTemplate\>  
  \<h2\>Share a Template\</h2\>  
  \<p\>Help the community by sharing your best work\</p\>  
    
  \<Steps\>  
    \<Step active\>1. Select Item\</Step\>  
    \<Step\>2. Add Details\</Step\>  
    \<Step\>3. Preview & Publish\</Step\>  
  \</Steps\>  
    
  {/\* Step 1: Select \*/}  
  \<SelectItem\>  
    \<h3\>What would you like to share?\</h3\>  
      
    \<ItemTypeSelector\>  
      \<ItemType onClick={() \=\> setType("form")}\>  
        \<Icon\>📋\</Icon\>  
        \<span\>Form\</span\>  
      \</ItemType\>  
      \<ItemType onClick={() \=\> setType("report")}\>  
        \<Icon\>📊\</Icon\>  
        \<span\>Report\</span\>  
      \</ItemType\>  
      \<ItemType onClick={() \=\> setType("drawing")}\>  
        \<Icon\>✏️\</Icon\>  
        \<span\>Drawing\</span\>  
      \</ItemType\>  
      \<ItemType onClick={() \=\> setType("plan")}\>  
        \<Icon\>🎯\</Icon\>  
        \<span\>Plan\</span\>  
      \</ItemType\>  
    \</ItemTypeSelector\>  
      
    {type && (  
      \<ItemSelector\>  
        \<Select label={\`Select ${type}\`}\>  
          {userItems\[type\].map(item \=\> (  
            \<option value={item.id}\>{item.name}\</option\>  
          ))}  
        \</Select\>  
      \</ItemSelector\>  
    )}  
      
    \<Button onClick={nextStep}\>Next\</Button\>  
  \</SelectItem\>  
    
  {/\* Step 2: Details \*/}  
  \<TemplateDetails\>  
    \<h3\>Template Details\</h3\>  
      
    \<Input   
      label="Template Name"   
      defaultValue={selectedItem.name}  
      required   
    /\>  
      
    \<Textarea   
      label="Short Description"   
      placeholder="A brief overview of what this template does"  
      maxLength={200}  
      required  
    /\>  
      
    \<Textarea   
      label="Detailed Description"   
      placeholder="Explain when to use this, what it includes, best practices..."  
      rows={10}  
    /\>  
      
    \<Select label="Category" required\>  
      \<option\>Wellness\</option\>  
      \<option\>Performance\</option\>  
      \<option\>Medical\</option\>  
      \<option\>Tactics\</option\>  
      \<option\>Training\</option\>  
    \</Select\>  
      
    \<Select label="Sport" required\>  
      \<option\>Football\</option\>  
      \<option\>Rugby\</option\>  
      \<option\>Basketball\</option\>  
      \<option\>Multi-Sport\</option\>  
    \</Select\>  
      
    \<TagInput   
      label="Tags"   
      placeholder="Add tags to help others find this"  
    /\>  
      
    \<CheckboxGroup label="What's included?"\>  
      {/\* User checks features \*/}  
      \<Checkbox\>Pre-filled fields\</Checkbox\>  
      \<Checkbox\>Conditional logic\</Checkbox\>  
      \<Checkbox\>Custom validation\</Checkbox\>  
    \</CheckboxGroup\>  
      
    {type \=== "drawing" && (  
      \<FileUpload   
        label="Preview Image"   
        accept="image/\*"  
        help="Upload a screenshot of your drawing"  
      /\>  
    )}  
      
    \<ButtonGroup\>  
      \<Button variant="outline" onClick={prevStep}\>Back\</Button\>  
      \<Button onClick={nextStep}\>Next\</Button\>  
    \</ButtonGroup\>  
  \</TemplateDetails\>  
    
  {/\* Step 3: Preview & Publish \*/}  
  \<PublishTemplate\>  
    \<h3\>Preview & Publish\</h3\>  
      
    \<Preview\>  
      {/\* Show how template will appear \*/}  
      \<TemplateCard {...templateData} /\>  
    \</Preview\>  
      
    \<PublishOptions\>  
      \<Checkbox checked\>  
        \<strong\>Make public\</strong\>  
        \<p\>Anyone can discover and use this template\</p\>  
      \</Checkbox\>  
        
      \<Checkbox\>  
        \<strong\>Allow modifications\</strong\>  
        \<p\>Users can customize this template (recommended)\</p\>  
      \</Checkbox\>  
        
      \<Alert\>  
        \<Icon\>ℹ️\</Icon\>  
        \<p\>Your name and organization will be visible to users. Personal data from your org will NOT be shared.\</p\>  
      \</Alert\>  
    \</PublishOptions\>  
      
    \<ButtonGroup\>  
      \<Button variant="outline" onClick={prevStep}\>Back\</Button\>  
      \<Button onClick={publish}\>Publish Template\</Button\>  
    \</ButtonGroup\>  
  \</PublishTemplate\>  
\</UploadTemplate\>  
My Templates  
tsx  
\<MyTemplates\>  
  \<h2\>My Templates\</h2\>  
    
  \<Tabs\>  
    \<Tab label="Published"\>  
      \<TemplateList\>  
        {publishedTemplates.map(template \=\> (  
          \<TemplateRow key={template.id}\>  
            \<Thumbnail src={template.previewImage} /\>  
            \<div\>  
              \<strong\>{template.name}\</strong\>  
              \<Meta\>  
                \<Badge\>{template.type}\</Badge\>  
                \<span\>{template.downloads} downloads\</span\>  
                \<Rating value={template.rating} /\>  
              \</Meta\>  
            \</div\>  
            \<ButtonGroup\>  
              \<Button size="sm" variant="outline"\>View\</Button\>  
              \<Button size="sm" variant="outline"\>Edit\</Button\>  
              \<Button size="sm" variant="ghost"\>Unpublish\</Button\>  
            \</ButtonGroup\>  
          \</TemplateRow\>  
        ))}  
      \</TemplateList\>  
    \</Tab\>  
      
    \<Tab label="Saved"\>  
      {/\* Templates user has favorited \*/}  
      \<SavedTemplates\>  
        {savedTemplates.map(template \=\> (  
          \<TemplateCard key={template.id} /\>  
        ))}  
      \</SavedTemplates\>  
    \</Tab\>  
      
    \<Tab label="Used"\>  
      {/\* Templates user has used \*/}  
      \<UsedHistory\>  
        {usedTemplates.map(template \=\> (  
          \<HistoryRow key={template.id}\>  
            \<span\>{template.name}\</span\>  
            \<span\>Used {formatDate(template.usedAt)}\</span\>  
            \<Button size="sm"\>Use Again\</Button\>  
          \</HistoryRow\>  
        ))}  
      \</UsedHistory\>  
    \</Tab\>  
  \</Tabs\>  
\</MyTemplates\>  
Data Model  
prisma  
model CommunityTemplate {  
  id          String @id  
    
  // Type  
  type        String // "form", "report", "drawing", "plan"  
    
  // Info  
  name        String  
  description String  
  longDescription String? @db.Text  
    
  // Categorization  
  category    String // "wellness", "performance", "medical", "tactics"  
  sport       String // "football", "rugby", "basketball"  
  tags        String\[\]  
  features    String\[\] // what's included  
    
  // Template data  
  config      Json // the actual template configuration  
    
  // Preview  
  previewImage String?  
    
  // Author  
  authorId    String?  
  author      User? @relation(fields: \[authorId\], references: \[id\])  
  orgName     String? // author's org name (for display)  
    
  // Official templates  
  isOfficial  Boolean @default(false)  
  isFeatured  Boolean @default(false)  
    
  // Stats  
  downloads   Int @default(0)  
  rating      Float?  
  reviewCount Int @default(0)  
    
  // Reviews  
  reviews     TemplateReview\[\]  
    
  // Status  
  status      String @default("published") // "draft", "published", "archived"  
    
  createdAt   DateTime @default(now())  
  updatedAt   DateTime @updatedAt  
}

model TemplateReview {  
  id         String @id  
  templateId String  
  template   CommunityTemplate @relation(fields: \[templateId\], references: \[id\])  
    
  userId     String  
  user       User @relation(fields: \[userId\], references: \[id\])  
    
  rating     Int // 1-5  
  content    String @db.Text  
    
  helpfulCount Int @default(0)  
    
  createdAt  DateTime @default(now())  
    
  @@unique(\[templateId, userId\]) // one review per user per template  
}

model TemplateUsage {  
  id         String @id  
  templateId String  
  userId     String  
  orgId      String  
    
  // What they created from it  
  createdType String // "form", "report", etc.  
  createdId   String  
    
  usedAt     DateTime @default(now())  
}  
\`\`\`

\---

\#\#\# \*\*AI Integration\*\*  
\`\`\`  
User: "AI, find me a wellness form template"

AI: \[searches CommunityTemplate with filters\]

AI: "I found 15 wellness form templates. Here are the top 3:

1\. Daily Wellness Check (Official)  
   \- 2.3k downloads, 4.8/5 rating  
   \- Sleep, soreness, mood, energy levels  
   \[Use Template →\]

2\. Comprehensive Wellness Assessment  
   \- 890 downloads, 4.6/5 rating  
   \- 15 questions including nutrition, stress, readiness  
   \[Use Template →\]

3\. Quick Wellness (5 questions)  
   \- 1.5k downloads, 4.7/5 rating  
   \- Fast daily check-in  
   \[Use Template →\]"  
\`\`\`  
\`\`\`  
User: "AI, create a report template from my current report and publish it"

AI:  
1\. Copies report configuration  
2\. Removes org-specific data  
3\. Opens template upload flow pre-filled  
4\. Returns: "Template draft created. Review and publish →"  
Moderation  
For user-uploaded templates:

Automated checks (no profanity, spam)  
Report button (users can flag)  
Admin review queue  
SimpleAM team approves before featuring  
Start simple:

Auto-publish user templates  
Add moderation if abuse occurs  
Build Effort  
Template browsing: 1 week

Browse/search UI  
Template cards  
Filter/sort  
Template detail: 3-4 days

Detail page  
Preview rendering  
Use template flow  
Template upload: 1 week

Upload wizard  
Configuration extraction  
Preview generation  
Reviews & ratings: 3-4 days

Review system  
Rating aggregation  
My Templates: 2-3 days

Published/saved/used lists  
Management UI  
Total: \~3.5 weeks for Community Hub

# **System Settings**

# **System Settings \- Full Picture**

## **What System Settings Does**

1. **User management** \- invite users, assign roles/permissions, view active users  
2. **Billing & subscription** \- plan management, payment methods, usage tracking  
3. **Brand customization** \- colors, logo  
4. **Regional settings** \- timezone, date format, currency, language

---

## **Tech Stack**

* **Settings UI** \- tabbed interface with shadcn components  
* **Image upload** \- for logo/branding (Supabase Storage)  
* **Stripe integration** \- for billing management  
* **Permissions checks** \- only admins can access

---

## **User Flow**

**Access:** Admin permission required

\<SystemSettings\>  
  \<Header\>  
    \<h1\>Organization Settings\</h1\>  
    \<p\>Manage your organization's configuration and preferences\</p\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Users & Permissions"\>  
      \<UserManagement\>  
        \<Section\>  
          \<h3\>Team Members\</h3\>  
            
          \<Toolbar\>  
            \<Search placeholder="Search users..." /\>  
            \<FilterSelect label="Role"\>  
              \<option\>All\</option\>  
              \<option\>Admin\</option\>  
              \<option\>Staff\</option\>  
            \</FilterSelect\>  
            \<Button onClick={inviteUser}\>+ Invite User\</Button\>  
          \</Toolbar\>  
            
          \<UserTable\>  
            \<thead\>  
              \<tr\>  
                \<th\>Name\</th\>  
                \<th\>Email\</th\>  
                \<th\>Roles\</th\>  
                \<th\>Permissions\</th\>  
                \<th\>Status\</th\>  
                \<th\>Last Active\</th\>  
                \<th\>Actions\</th\>  
              \</tr\>  
            \</thead\>  
            \<tbody\>  
              {users.map(user \=\> (  
                \<tr key={user.id}\>  
                  \<td\>  
                    \<Avatar src={user.photo} /\>  
                    {user.name}  
                  \</td\>  
                  \<td\>{user.email}\</td\>  
                  \<td\>  
                    {user.roles.map(role \=\> \<Badge\>{role}\</Badge\>)}  
                  \</td\>  
                  \<td\>  
                    {user.permissions.map(perm \=\> (  
                      \<Badge variant="outline"\>{perm}\</Badge\>  
                    ))}  
                  \</td\>  
                  \<td\>  
                    \<Badge variant={user.status \=== "active" ? "success" : "secondary"}\>  
                      {user.status}  
                    \</Badge\>  
                  \</td\>  
                  \<td\>{formatDate(user.lastActive)}\</td\>  
                  \<td\>  
                    \<DropdownMenu\>  
                      \<Item onClick={() \=\> editUser(user.id)}\>Edit\</Item\>  
                      \<Item onClick={() \=\> resetPassword(user.id)}\>Reset Password\</Item\>  
                      \<Item onClick={() \=\> deactivate(user.id)}\>Deactivate\</Item\>  
                      \<Item onClick={() \=\> remove(user.id)} variant="destructive"\>  
                        Remove  
                      \</Item\>  
                    \</DropdownMenu\>  
                  \</td\>  
                \</tr\>  
              ))}  
            \</tbody\>  
          \</UserTable\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Pending Invitations\</h3\>  
            
          \<InviteList\>  
            {pendingInvites.map(invite \=\> (  
              \<InviteRow key={invite.id}\>  
                \<div\>  
                  \<strong\>{invite.email}\</strong\>  
                  \<p\>Invited {formatDate(invite.sentAt)} by {invite.invitedBy.name}\</p\>  
                \</div\>  
                \<ButtonGroup\>  
                  \<Button size="sm" variant="outline" onClick={() \=\> resendInvite(invite.id)}\>  
                    Resend  
                  \</Button\>  
                  \<Button size="sm" variant="ghost" onClick={() \=\> cancelInvite(invite.id)}\>  
                    Cancel  
                  \</Button\>  
                \</ButtonGroup\>  
              \</InviteRow\>  
            ))}  
          \</InviteList\>  
        \</Section\>  
      \</UserManagement\>  
    \</Tab\>  
      
    \<Tab label="Billing & Subscription"\>  
      \<BillingSettings\>  
        \<Section\>  
          \<h3\>Current Plan\</h3\>  
            
          \<PlanCard\>  
            \<div\>  
              \<Badge variant="primary"\>{subscription.plan}\</Badge\>  
              \<h4\>${subscription.price}/{subscription.interval}\</h4\>  
              \<p\>Next billing date: {formatDate(subscription.nextBilling)}\</p\>  
            \</div\>  
              
            \<Button variant="outline" onClick={changePlan}\>  
              Change Plan  
            \</Button\>  
          \</PlanCard\>  
            
          \<Usage\>  
            \<h4\>Usage This Month\</h4\>  
              
            \<UsageItem\>  
              \<div\>  
                \<strong\>Users\</strong\>  
                \<Progress value={(usage.users / limits.users) \* 100} /\>  
                \<span\>{usage.users} of {limits.users} users\</span\>  
              \</div\>  
            \</UsageItem\>  
              
            \<UsageItem\>  
              \<div\>  
                \<strong\>Storage\</strong\>  
                \<Progress value={(usage.storage / limits.storage) \* 100} /\>  
                \<span\>{formatBytes(usage.storage)} of {formatBytes(limits.storage)}\</span\>  
              \</div\>  
            \</UsageItem\>  
              
            \<UsageItem\>  
              \<div\>  
                \<strong\>AI Queries\</strong\>  
                \<Progress value={(usage.aiQueries / limits.aiQueries) \* 100} /\>  
                \<span\>{usage.aiQueries} of {limits.aiQueries} queries\</span\>  
              \</div\>  
            \</UsageItem\>  
          \</Usage\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Payment Method\</h3\>  
            
          \<PaymentMethod\>  
            \<CardIcon type={paymentMethod.brand} /\>  
            \<div\>  
              \<strong\>{paymentMethod.brand} •••• {paymentMethod.last4}\</strong\>  
              \<p\>Expires {paymentMethod.expMonth}/{paymentMethod.expYear}\</p\>  
            \</div\>  
            \<Button variant="outline" onClick={updatePayment}\>  
              Update  
            \</Button\>  
          \</PaymentMethod\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Billing History\</h3\>  
            
          \<InvoiceTable\>  
            \<thead\>  
              \<tr\>  
                \<th\>Date\</th\>  
                \<th\>Description\</th\>  
                \<th\>Amount\</th\>  
                \<th\>Status\</th\>  
                \<th\>Invoice\</th\>  
              \</tr\>  
            \</thead\>  
            \<tbody\>  
              {invoices.map(invoice \=\> (  
                \<tr key={invoice.id}\>  
                  \<td\>{formatDate(invoice.date)}\</td\>  
                  \<td\>{invoice.description}\</td\>  
                  \<td\>${invoice.amount}\</td\>  
                  \<td\>  
                    \<Badge variant={invoice.status \=== "paid" ? "success" : "warning"}\>  
                      {invoice.status}  
                    \</Badge\>  
                  \</td\>  
                  \<td\>  
                    \<Button size="sm" variant="ghost" onClick={() \=\> downloadInvoice(invoice.id)}\>  
                      \<DownloadIcon /\> Download  
                    \</Button\>  
                  \</td\>  
                \</tr\>  
              ))}  
            \</tbody\>  
          \</InvoiceTable\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Cancel Subscription\</h3\>  
          \<Alert variant="warning"\>  
            \<Icon\>⚠️\</Icon\>  
            \<p\>Cancelling your subscription will disable access at the end of the current billing period.\</p\>  
          \</Alert\>  
          \<Button variant="destructive" onClick={cancelSubscription}\>  
            Cancel Subscription  
          \</Button\>  
        \</Section\>  
      \</BillingSettings\>  
    \</Tab\>  
      
    \<Tab label="Branding"\>  
      \<BrandingSettings\>  
        \<Section\>  
          \<h3\>Organization Logo\</h3\>  
            
          \<ImageUpload   
            label="Logo"  
            current={branding.logo}  
            onUpload={uploadLogo}  
            accept="image/\*"  
            maxSize="2MB"  
            help="Recommended: 512x512px, PNG or SVG"  
          /\>  
            
          \<Preview\>  
            \<h4\>Preview\</h4\>  
            \<LogoPreview src={branding.logo} /\>  
          \</Preview\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Brand Colors\</h3\>  
          \<p\>Customize the appearance of your organization's workspace\</p\>  
            
          \<ColorPickers\>  
            \<ColorPicker   
              label="Primary Color"  
              value={branding.primaryColor}  
              onChange={setPrimaryColor}  
            /\>  
            \<ColorPicker   
              label="Secondary Color"  
              value={branding.secondaryColor}  
              onChange={setSecondaryColor}  
            /\>  
          \</ColorPickers\>  
            
          \<Preview\>  
            \<h4\>Preview\</h4\>  
            \<BrandPreview colors={branding} /\>  
          \</Preview\>  
            
          \<Button variant="outline" onClick={resetColors}\>  
            Reset to Default  
          \</Button\>  
        \</Section\>  
          
        \<Button\>Save Branding\</Button\>  
      \</BrandingSettings\>  
    \</Tab\>  
      
    \<Tab label="Regional Settings"\>  
      \<RegionalSettings\>  
        \<Section\>  
          \<h3\>Timezone & Date Format\</h3\>  
            
          \<Select label="Timezone" value={settings.timezone}\>  
            \<option\>UTC\</option\>  
            \<option\>Europe/London\</option\>  
            \<option\>Europe/Madrid\</option\>  
            \<option\>America/New\_York\</option\>  
            \<option\>America/Los\_Angeles\</option\>  
            \<option\>Asia/Tokyo\</option\>  
            {/\* All timezones \*/}  
          \</Select\>  
            
          \<Select label="Date Format"\>  
            \<option\>DD/MM/YYYY\</option\>  
            \<option\>MM/DD/YYYY\</option\>  
            \<option\>YYYY-MM-DD\</option\>  
          \</Select\>  
            
          \<Select label="Time Format"\>  
            \<option\>12-hour (3:00 PM)\</option\>  
            \<option\>24-hour (15:00)\</option\>  
          \</Select\>  
            
          \<Preview\>  
            \<h4\>Preview\</h4\>  
            \<p\>Date: {formatDate(new Date(), settings.dateFormat)}\</p\>  
            \<p\>Time: {formatTime(new Date(), settings.timeFormat)}\</p\>  
          \</Preview\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Language\</h3\>  
            
          \<Select label="Default Language" value={settings.language}\>  
            \<option value="en"\>English\</option\>  
            \<option value="es"\>Español\</option\>  
            \<option value="fr"\>Français\</option\>  
            \<option value="de"\>Deutsch\</option\>  
            \<option value="pt"\>Português\</option\>  
          \</Select\>  
            
          \<Alert\>  
            \<Icon\>ℹ️\</Icon\>  
            \<p\>This sets the default language for the organization. Individual users can override this in their profile settings.\</p\>  
          \</Alert\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Currency\</h3\>  
            
          \<Select label="Default Currency" value={settings.currency}\>  
            \<option value="EUR"\>EUR (€)\</option\>  
            \<option value="GBP"\>GBP (£)\</option\>  
            \<option value="USD"\>USD ($)\</option\>  
            \<option value="JPY"\>JPY (¥)\</option\>  
          \</Select\>  
            
          \<Preview\>  
            \<h4\>Preview\</h4\>  
            \<p\>Amount: {formatCurrency(1234.56, settings.currency)}\</p\>  
          \</Preview\>  
        \</Section\>  
          
        \<Button\>Save Regional Settings\</Button\>  
      \</RegionalSettings\>  
    \</Tab\>  
  \</Tabs\>  
\</SystemSettings\>

---

## **Data Model**

model Organization {  
  id        String @id  
  name      String  
    
  // Branding  
  logo      String?  
  primaryColor   String @default("\#1971c2")  
  secondaryColor String @default("\#a5d8ff")  
    
  // Regional  
  timezone  String @default("UTC")  
  dateFormat String @default("DD/MM/YYYY")  
  timeFormat String @default("24-hour")  
  language  String @default("en")  
  currency  String @default("EUR")  
    
  // Subscription  
  stripeCustomerId String? @unique  
  subscriptionId   String?  
  plan            String @default("free") // "free", "pro", "enterprise"  
  planInterval    String @default("monthly")  
    
  createdAt DateTime @default(now())  
  updatedAt DateTime @updatedAt  
}

model Subscription {  
  id        String @id  
  orgId     String @unique  
    
  plan      String // "free", "pro", "enterprise"  
  interval  String // "monthly", "yearly"  
  price     Int // in cents  
    
  status    String // "active", "cancelled", "past\_due"  
    
  currentPeriodStart DateTime  
  currentPeriodEnd   DateTime  
    
  cancelAtPeriodEnd Boolean @default(false)  
    
  createdAt DateTime @default(now())  
  updatedAt DateTime @updatedAt  
}

model Invoice {  
  id        String @id  
  orgId     String  
    
  amount    Int // in cents  
  currency  String  
    
  description String  
  status    String // "paid", "pending", "failed"  
    
  stripeInvoiceId String?  
  invoiceUrl      String?  
    
  paidAt    DateTime?  
  createdAt DateTime @default(now())  
}

model UserInvitation {  
  id        String @id  
  orgId     String  
  email     String  
    
  invitedBy String  
  inviter   User @relation(fields: \[invitedBy\], references: \[id\])  
    
  status    String @default("pending") // "pending", "accepted", "expired"  
    
  roles       String\[\]  
  permissions String\[\]  
    
  token     String @unique  
  expiresAt DateTime  
    
  sentAt    DateTime @default(now())  
  acceptedAt DateTime?  
}

---

## **Invite User Flow**

\<InviteUserModal\>  
  \<h3\>Invite Team Member\</h3\>  
    
  \<Input   
    label="Email Address"   
    type="email"   
    required   
  /\>  
    
  \<TagInput   
    label="Roles"   
    placeholder="Add roles..."  
    help="e.g., Head Coach, Physiotherapist"  
  /\>  
    
  \<CheckboxGroup label="Permissions"\>  
    \<Checkbox\>Admin\</Checkbox\>  
    \<Checkbox\>Medical Access\</Checkbox\>  
    \<Checkbox\>Mental Health Access\</Checkbox\>  
    \<Checkbox\>Manage Players\</Checkbox\>  
    \<Checkbox\>Manage Events\</Checkbox\>  
    \<Checkbox\>Manage Forms\</Checkbox\>  
    \<Checkbox\>View Reports\</Checkbox\>  
  \</CheckboxGroup\>  
    
  \<Textarea   
    label="Personal Message (Optional)"  
    placeholder="Add a personal note to the invitation email..."  
  /\>  
    
  \<Button onClick={sendInvite}\>Send Invitation\</Button\>  
\</InviteUserModal\>

**Email sent:**

Subject: You've been invited to join {Org Name} on SimpleAM

Hi,

{Inviter Name} has invited you to join {Org Name} on SimpleAM.

\[Accept Invitation\]

This invitation will expire in 7 days.

---

## **Plan Comparison**

\<ChangePlanModal\>  
  \<h3\>Choose Your Plan\</h3\>  
    
  \<PlanGrid\>  
    \<PlanCard\>  
      \<h4\>Free\</h4\>  
      \<Price\>$0\<span\>/month\</span\>\</Price\>  
        
      \<Features\>  
        \<Feature\>✓ 5 users\</Feature\>  
        \<Feature\>✓ 1GB storage\</Feature\>  
        \<Feature\>✓ Basic features\</Feature\>  
        \<Feature\>✓ Email support\</Feature\>  
      \</Features\>  
        
      \<Button variant="outline" disabled={currentPlan \=== "free"}\>  
        Current Plan  
      \</Button\>  
    \</PlanCard\>  
      
    \<PlanCard featured\>  
      \<Badge\>Most Popular\</Badge\>  
      \<h4\>Pro\</h4\>  
      \<Price\>$49\<span\>/month\</span\>\</Price\>  
        
      \<Features\>  
        \<Feature\>✓ 25 users\</Feature\>  
        \<Feature\>✓ 100GB storage\</Feature\>  
        \<Feature\>✓ All features\</Feature\>  
        \<Feature\>✓ Priority support\</Feature\>  
        \<Feature\>✓ Advanced reports\</Feature\>  
        \<Feature\>✓ AI features\</Feature\>  
      \</Features\>  
        
      \<Button\>Upgrade to Pro\</Button\>  
    \</PlanCard\>  
      
    \<PlanCard\>  
      \<h4\>Enterprise\</h4\>  
      \<Price\>Custom\</Price\>  
        
      \<Features\>  
        \<Feature\>✓ Unlimited users\</Feature\>  
        \<Feature\>✓ Unlimited storage\</Feature\>  
        \<Feature\>✓ Custom features\</Feature\>  
        \<Feature\>✓ Dedicated support\</Feature\>  
        \<Feature\>✓ Custom integrations\</Feature\>  
        \<Feature\>✓ SLA guarantee\</Feature\>  
      \</Features\>  
        
      \<Button variant="outline"\>Contact Sales\</Button\>  
    \</PlanCard\>  
  \</PlanGrid\>  
\</ChangePlanModal\>

---

## **Styling with shadcn**

* Tabs \= shadcn Tabs component  
* All inputs/selects \= shadcn  
* Color picker \= custom with shadcn Popover  
* Tables \= TanStack Table styled with shadcn  
* Cards \= shadcn Card  
* Badges \= shadcn Badge

---

## **Build Effort**

**User Management:** 1 week

* User table/list  
* Invite flow  
* Edit permissions UI  
* Pending invitations

**Billing Integration:** 1 week

* Stripe setup  
* Plan selection  
* Usage tracking  
* Invoice display

**Branding:** 3-4 days

* Logo upload  
* Color picker  
* Preview rendering

**Regional Settings:** 2-3 days

* Timezone/date/currency selects  
* Preview formatting  
* Save preferences

**Total: \~3.5 weeks for System Settings**

---

# **User Profile \- Full Picture**

## **What User Profile Does**

1. **Personal information** \- name, email, photo, phone  
2. **Password management** \- change password, 2FA setup  
3. **Language preference** \- override org default  
4. **Notification preferences** \- email, push, SMS settings  
5. **Sessions** \- view active sessions, logout remotely  
6. **Download data** \- export personal data (GDPR)  
7. **Delete account** \- permanent account deletion

---

## **User Flow**

\<UserProfile\>  
  \<Header\>  
    \<Avatar src={user.photo} size="large" /\>  
    \<div\>  
      \<h1\>{user.name}\</h1\>  
      \<p\>{user.email}\</p\>  
    \</div\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Profile"\>  
      \<ProfileSettings\>  
        \<Section\>  
          \<h3\>Personal Information\</h3\>  
            
          \<ImageUpload   
            label="Profile Photo"  
            current={user.photo}  
            onUpload={uploadPhoto}  
            accept="image/\*"  
            circular  
          /\>  
            
          \<Input   
            label="Full Name"   
            value={user.name}  
            onChange={setName}  
            required  
          /\>  
            
          \<Input   
            label="Email Address"   
            value={user.email}  
            type="email"  
            disabled  
            help="Contact admin to change your email"  
          /\>  
            
          \<Input   
            label="Phone Number"   
            value={user.phone}  
            type="tel"  
          /\>  
            
          \<Button\>Save Changes\</Button\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Organizations\</h3\>  
          \<p\>You are a member of {user.memberships.length} organization(s)\</p\>  
            
          \<OrgList\>  
            {user.memberships.map(membership \=\> (  
              \<OrgCard key={membership.orgId}\>  
                \<Avatar src={membership.org.logo} /\>  
                \<div\>  
                  \<strong\>{membership.org.name}\</strong\>  
                  \<p\>{membership.roles.join(', ')}\</p\>  
                  \<Badges\>  
                    {membership.permissions.map(p \=\> (  
                      \<Badge variant="outline"\>{p}\</Badge\>  
                    ))}  
                  \</Badges\>  
                \</div\>  
                \<Button   
                  variant="ghost"   
                  onClick={() \=\> switchOrg(membership.orgId)}  
                \>  
                  Switch  
                \</Button\>  
              \</OrgCard\>  
            ))}  
          \</OrgList\>  
        \</Section\>  
      \</ProfileSettings\>  
    \</Tab\>  
      
    \<Tab label="Security"\>  
      \<SecuritySettings\>  
        \<Section\>  
          \<h3\>Password\</h3\>  
            
          \<Input   
            label="Current Password"   
            type="password"  
            required  
          /\>  
            
          \<Input   
            label="New Password"   
            type="password"  
            required  
          /\>  
            
          \<Input   
            label="Confirm New Password"   
            type="password"  
            required  
          /\>  
            
          \<PasswordStrength value={passwordStrength} /\>  
            
          \<Button\>Change Password\</Button\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Two-Factor Authentication\</h3\>  
            
          {\!user.has2FA ? (  
            \<\>  
              \<Alert\>  
                \<Icon\>🔒\</Icon\>  
                \<p\>Add an extra layer of security to your account\</p\>  
              \</Alert\>  
                
              \<Button onClick={enable2FA}\>Enable 2FA\</Button\>  
            \</\>  
          ) : (  
            \<\>  
              \<Alert variant="success"\>  
                \<Icon\>✓\</Icon\>  
                \<p\>Two-factor authentication is enabled\</p\>  
              \</Alert\>  
                
              \<BackupCodes\>  
                \<h4\>Backup Codes\</h4\>  
                \<p\>Save these codes in a safe place. You can use them to access your account if you lose your 2FA device.\</p\>  
                  
                \<CodeList\>  
                  {user.backupCodes.map(code \=\> (  
                    \<Code key={code}\>{code}\</Code\>  
                  ))}  
                \</CodeList\>  
                  
                \<ButtonGroup\>  
                  \<Button variant="outline"\>Regenerate Codes\</Button\>  
                  \<Button variant="outline"\>Download Codes\</Button\>  
                \</ButtonGroup\>  
              \</BackupCodes\>  
                
              \<Button variant="destructive" onClick={disable2FA}\>  
                Disable 2FA  
              \</Button\>  
            \</\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Active Sessions\</h3\>  
          \<p\>Devices where you're currently logged in\</p\>  
            
          \<SessionList\>  
            {sessions.map(session \=\> (  
              \<SessionCard key={session.id}\>  
                \<Icon type={session.device} /\>  
                \<div\>  
                  \<strong\>{session.device}\</strong\>  
                  \<p\>{session.location} • {session.browser}\</p\>  
                  \<Time\>Last active: {formatDateTime(session.lastActive)}\</Time\>  
                  {session.isCurrent && \<Badge variant="success"\>Current\</Badge\>}  
                \</div\>  
                {\!session.isCurrent && (  
                  \<Button   
                    variant="ghost"   
                    size="sm"  
                    onClick={() \=\> logoutSession(session.id)}  
                  \>  
                    Logout  
                  \</Button\>  
                )}  
              \</SessionCard\>  
            ))}  
          \</SessionList\>  
            
          \<Button variant="outline" onClick={logoutAllOther}\>  
            Logout All Other Sessions  
          \</Button\>  
        \</Section\>  
      \</SecuritySettings\>  
    \</Tab\>  
      
    \<Tab label="Preferences"\>  
      \<PreferencesSettings\>  
        \<Section\>  
          \<h3\>Language\</h3\>  
            
          \<Select label="Display Language" value={preferences.language}\>  
            \<option value="en"\>English\</option\>  
            \<option value="es"\>Español\</option\>  
            \<option value="fr"\>Français\</option\>  
            \<option value="de"\>Deutsch\</option\>  
            \<option value="pt"\>Português\</option\>  
          \</Select\>  
            
          \<Alert\>  
            \<Icon\>ℹ️\</Icon\>  
            \<p\>This overrides your organization's default language\</p\>  
          \</Alert\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Timezone\</h3\>  
            
          \<Toggle checked={preferences.useOrgTimezone}\>  
            Use organization timezone  
          \</Toggle\>  
            
          {\!preferences.useOrgTimezone && (  
            \<Select label="Your Timezone" value={preferences.timezone}\>  
              \<option\>UTC\</option\>  
              \<option\>Europe/London\</option\>  
              \<option\>Europe/Madrid\</option\>  
              \<option\>America/New\_York\</option\>  
              {/\* All timezones \*/}  
            \</Select\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Date & Time Format\</h3\>  
            
          \<Select label="Date Format" value={preferences.dateFormat}\>  
            \<option\>DD/MM/YYYY\</option\>  
            \<option\>MM/DD/YYYY\</option\>  
            \<option\>YYYY-MM-DD\</option\>  
          \</Select\>  
            
          \<Select label="Time Format" value={preferences.timeFormat}\>  
            \<option\>12-hour (3:00 PM)\</option\>  
            \<option\>24-hour (15:00)\</option\>  
          \</Select\>  
        \</Section\>  
          
        \<Button\>Save Preferences\</Button\>  
      \</PreferencesSettings\>  
    \</Tab\>  
      
    \<Tab label="Notifications"\>  
      \<NotificationSettings\>  
        \<Section\>  
          \<h3\>Email Notifications\</h3\>  
            
          \<ToggleGroup\>  
            \<Toggle checked={notifications.email.formAssigned}\>  
              \<strong\>Form assigned to you\</strong\>  
              \<p\>When you're assigned a form to complete\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.eventReminder}\>  
              \<strong\>Event reminders\</strong\>  
              \<p\>Reminders before scheduled events\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.playerUpdate}\>  
              \<strong\>Player updates\</strong\>  
              \<p\>When players you manage are updated\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.aiInsight}\>  
              \<strong\>AI insights\</strong\>  
              \<p\>When AI detects important patterns\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.weeklyDigest}\>  
              \<strong\>Weekly digest\</strong\>  
              \<p\>Summary of the week's activity\</p\>  
            \</Toggle\>  
          \</ToggleGroup\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Push Notifications\</h3\>  
            
          \<ToggleGroup\>  
            \<Toggle checked={notifications.push.formDue}\>  
              \<strong\>Form due soon\</strong\>  
              \<p\>When forms are due within 1 hour\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.push.eventStarting}\>  
              \<strong\>Event starting\</strong\>  
              \<p\>15 minutes before events\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.push.mentions}\>  
              \<strong\>Mentions\</strong\>  
              \<p\>When someone mentions you in a note\</p\>  
            \</Toggle\>  
          \</ToggleGroup\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>SMS Notifications (Optional)\</h3\>  
            
          \<Toggle checked={notifications.smsEnabled}\>  
            Enable SMS notifications  
          \</Toggle\>  
            
          {notifications.smsEnabled && (  
            \<\>  
              \<Input   
                label="Mobile Number"   
                type="tel"  
                value={user.phone}  
              /\>  
                
              \<ToggleGroup\>  
                \<Toggle checked={notifications.sms.urgent}\>  
                  \<strong\>Urgent alerts only\</strong\>  
                  \<p\>Critical notifications only\</p\>  
                \</Toggle\>  
              \</ToggleGroup\>  
            \</\>  
          )}  
        \</Section\>  
          
        \<Button\>Save Notification Settings\</Button\>  
      \</NotificationSettings\>  
    \</Tab\>  
      
    \<Tab label="Data & Privacy"\>  
      \<DataPrivacySettings\>  
        \<Section\>  
          \<h3\>Download Your Data\</h3\>  
          \<p\>Export all your personal data from SimpleAM\</p\>  
            
          \<CheckboxGroup label="What to include:"\>  
            \<Checkbox checked\>Profile information\</Checkbox\>  
            \<Checkbox checked\>Notes you created\</Checkbox\>  
            \<Checkbox checked\>Forms you completed\</Checkbox\>  
            \<Checkbox checked\>Events you attended\</Checkbox\>  
            \<Checkbox checked\>Files you uploaded\</Checkbox\>  
          \</CheckboxGroup\>  
            
          \<Select label="Format"\>  
            \<option\>JSON\</option\>  
            \<option\>CSV (where applicable)\</option\>  
          \</Select\>  
            
          \<Button onClick={requestDataExport}\>  
            Request Data Export  
          \</Button\>  
            
          \<Alert\>  
            \<Icon\>ℹ️\</Icon\>  
            \<p\>We'll email you a download link when your export is ready (usually within 24 hours)\</p\>  
          \</Alert\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Delete Account\</h3\>  
            
          \<Alert variant="destructive"\>  
            \<Icon\>⚠️\</Icon\>  
            \<div\>  
              \<strong\>Permanent deletion\</strong\>  
              \<p\>This action cannot be undone. All your personal data will be permanently deleted.\</p\>  
            \</div\>  
          \</Alert\>  
            
          \<Details\>  
            \<summary\>What happens when you delete your account?\</summary\>  
            \<ul\>  
              \<li\>Your profile and personal information will be deleted\</li\>  
              \<li\>You'll be removed from all organizations\</li\>  
              \<li\>Content you created (notes, forms) will remain but be anonymized\</li\>  
              \<li\>Your account cannot be recovered after deletion\</li\>  
            \</ul\>  
          \</Details\>  
            
          \<Button variant="destructive" onClick={openDeleteConfirm}\>  
            Delete My Account  
          \</Button\>  
        \</Section\>  
      \</DataPrivacySettings\>  
    \</Tab\>  
  \</Tabs\>  
\</UserProfile\>

---

## **Data Model**

model User {  
  id            String @id  
  email         String @unique  
  name          String  
  phone         String?  
  photo         String?  
    
  // Security  
  passwordHash  String  
  has2FA        Boolean @default(false)  
  twoFactorSecret String?  
  backupCodes   String\[\]  
    
  // Preferences  
  language      String? // overrides org default  
  timezone      String? // overrides org default  
  dateFormat    String?  
  timeFormat    String?  
    
  // Notifications  
  notificationSettings Json? // email, push, sms preferences  
    
  // Auth  
  authId        String @unique // Supabase auth ID  
    
  // Memberships  
  memberships   OrgMember\[\]  
    
  // Activity  
  lastActive    DateTime?  
  createdAt     DateTime @default(now())  
  updatedAt     DateTime @updatedAt  
}

model Session {  
  id         String @id  
  userId     String  
  user       User @relation(fields: \[userId\], references: \[id\])  
    
  // Session info  
  token      String @unique  
  device     String  
  browser    String  
  location   String? // IP-based location  
  ipAddress  String  
    
  lastActive DateTime  
  expiresAt  DateTime  
  createdAt  DateTime @default(now())  
}

---

## **Delete Account Confirmation**

\<DeleteAccountModal\>  
  \<Alert variant="destructive"\>  
    \<Icon\>⚠️\</Icon\>  
    \<strong\>Are you absolutely sure?\</strong\>  
  \</Alert\>  
    
  \<p\>This action cannot be undone. This will permanently delete your account and remove all your personal data from our servers.\</p\>  
    
  \<Input   
    label="Type DELETE to confirm"  
    value={confirmText}  
    onChange={setConfirmText}  
  /\>  
    
  \<ButtonGroup\>  
    \<Button variant="ghost" onClick={cancel}\>Cancel\</Button\>  
    \<Button   
      variant="destructive"   
      disabled={confirmText \!== "DELETE"}  
      onClick={deleteAccount}  
    \>  
      Delete Account  
    \</Button\>  
  \</ButtonGroup\>  
\</DeleteAccountModal\>

---

## **Styling with shadcn**

* Tabs \= shadcn Tabs  
* All inputs/selects \= shadcn  
* Toggles \= shadcn Switch  
* Alerts \= shadcn Alert  
* Avatar \= shadcn Avatar  
* All buttons/cards \= shadcn

---

## **Build Effort**

**Profile Management:** 4-5 days

* Profile edit UI  
* Photo upload  
* Organization list

**Security:** 1 week

* Password change  
* 2FA setup (TOTP)  
* Session management  
* Active sessions display

**Preferences:** 3-4 days

* Language/timezone overrides  
* Date/time format  
* Save preferences

**Notifications:** 4-5 days

* Notification settings UI  
* Email preferences  
* Push notification setup

**Data & Privacy:** 4-5 days

* Data export functionality  
* Delete account flow  
* GDPR compliance

# **User profile**

# **User Profile \- Full Picture**

## **What User Profile Does**

1. **Personal information** \- name, email, photo, phone  
2. **Password management** \- change password, 2FA setup  
3. **Language preference** \- override org default  
4. **Notification preferences** \- email, push, SMS settings  
5. **Sessions** \- view active sessions, logout remotely  
6. **Download data** \- export personal data (GDPR)  
7. **Delete account** \- permanent account deletion

---

## **Tech Stack**

* **Settings UI** \- tabbed interface with shadcn components  
* **Image upload** \- for profile photo (Supabase Storage)  
* **2FA** \- TOTP (Time-based One-Time Password) with QR code  
* **Session management** \- track active devices  
* **Data export** \- background job to generate user data archive

---

## **User Flow**

\<UserProfile\>  
  \<Header\>  
    \<Avatar src={user.photo} size="large" /\>  
    \<div\>  
      \<h1\>{user.name}\</h1\>  
      \<p\>{user.email}\</p\>  
    \</div\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Profile"\>  
      \<ProfileSettings\>  
        \<Section\>  
          \<h3\>Personal Information\</h3\>  
            
          \<ImageUpload   
            label="Profile Photo"  
            current={user.photo}  
            onUpload={uploadPhoto}  
            accept="image/\*"  
            circular  
            maxSize="5MB"  
          /\>  
            
          \<Input   
            label="Full Name"   
            value={user.name}  
            onChange={setName}  
            required  
          /\>  
            
          \<Input   
            label="Email Address"   
            value={user.email}  
            type="email"  
            disabled  
            help="Contact admin to change your email"  
          /\>  
            
          \<Input   
            label="Phone Number"   
            value={user.phone}  
            type="tel"  
            placeholder="+44 7700 900000"  
          /\>  
            
          \<Button\>Save Changes\</Button\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Organizations\</h3\>  
          \<p\>You are a member of {user.memberships.length} organization(s)\</p\>  
            
          \<OrgList\>  
            {user.memberships.map(membership \=\> (  
              \<OrgCard key={membership.orgId}\>  
                \<Avatar src={membership.org.logo} /\>  
                \<div\>  
                  \<strong\>{membership.org.name}\</strong\>  
                  \<p\>{membership.roles.join(', ')}\</p\>  
                  \<Badges\>  
                    {membership.permissions.map(p \=\> (  
                      \<Badge key={p} variant="outline"\>{p}\</Badge\>  
                    ))}  
                  \</Badges\>  
                \</div\>  
                \<Button   
                  variant="ghost"   
                  onClick={() \=\> switchOrg(membership.orgId)}  
                \>  
                  Switch  
                \</Button\>  
              \</OrgCard\>  
            ))}  
          \</OrgList\>  
        \</Section\>  
      \</ProfileSettings\>  
    \</Tab\>  
      
    \<Tab label="Security"\>  
      \<SecuritySettings\>  
        \<Section\>  
          \<h3\>Password\</h3\>  
            
          \<Input   
            label="Current Password"   
            type="password"  
            required  
          /\>  
            
          \<Input   
            label="New Password"   
            type="password"  
            required  
          /\>  
            
          \<Input   
            label="Confirm New Password"   
            type="password"  
            required  
          /\>  
            
          \<PasswordStrength value={passwordStrength}\>  
            \<Progress value={passwordStrength} /\>  
            \<span\>  
              {passwordStrength \< 30 && "Weak"}  
              {passwordStrength \>= 30 && passwordStrength \< 70 && "Medium"}  
              {passwordStrength \>= 70 && "Strong"}  
            \</span\>  
          \</PasswordStrength\>  
            
          \<PasswordRequirements\>  
            \<Requirement met={requirements.length}\>  
              \<Icon\>{requirements.length ? "✓" : "○"}\</Icon\>  
              At least 8 characters  
            \</Requirement\>  
            \<Requirement met={requirements.uppercase}\>  
              \<Icon\>{requirements.uppercase ? "✓" : "○"}\</Icon\>  
              One uppercase letter  
            \</Requirement\>  
            \<Requirement met={requirements.lowercase}\>  
              \<Icon\>{requirements.lowercase ? "✓" : "○"}\</Icon\>  
              One lowercase letter  
            \</Requirement\>  
            \<Requirement met={requirements.number}\>  
              \<Icon\>{requirements.number ? "✓" : "○"}\</Icon\>  
              One number  
            \</Requirement\>  
          \</PasswordRequirements\>  
            
          \<Button\>Change Password\</Button\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Two-Factor Authentication\</h3\>  
            
          {\!user.has2FA ? (  
            \<\>  
              \<Alert\>  
                \<Icon\>🔒\</Icon\>  
                \<div\>  
                  \<strong\>Add an extra layer of security\</strong\>  
                  \<p\>Protect your account with two-factor authentication\</p\>  
                \</div\>  
              \</Alert\>  
                
              \<Button onClick={enable2FA}\>Enable 2FA\</Button\>  
            \</\>  
          ) : (  
            \<\>  
              \<Alert variant="success"\>  
                \<Icon\>✓\</Icon\>  
                \<p\>Two-factor authentication is enabled\</p\>  
              \</Alert\>  
                
              \<BackupCodes\>  
                \<h4\>Backup Codes\</h4\>  
                \<p\>Save these codes in a safe place. You can use them to access your account if you lose your 2FA device.\</p\>  
                  
                \<CodeGrid\>  
                  {user.backupCodes.map(code \=\> (  
                    \<Code key={code}\>{code}\</Code\>  
                  ))}  
                \</CodeGrid\>  
                  
                \<ButtonGroup\>  
                  \<Button variant="outline" onClick={regenerateCodes}\>  
                    Regenerate Codes  
                  \</Button\>  
                  \<Button variant="outline" onClick={downloadCodes}\>  
                    \<DownloadIcon /\> Download  
                  \</Button\>  
                \</ButtonGroup\>  
              \</BackupCodes\>  
                
              \<Button variant="destructive" onClick={disable2FA}\>  
                Disable 2FA  
              \</Button\>  
            \</\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Active Sessions\</h3\>  
          \<p\>Devices where you're currently logged in\</p\>  
            
          \<SessionList\>  
            {sessions.map(session \=\> (  
              \<SessionCard key={session.id}\>  
                \<Icon type={session.device} /\>  
                \<div\>  
                  \<strong\>{session.device}\</strong\>  
                  \<p\>{session.location} • {session.browser}\</p\>  
                  \<Time\>Last active: {formatDateTime(session.lastActive)}\</Time\>  
                  {session.isCurrent && \<Badge variant="success"\>Current Session\</Badge\>}  
                \</div\>  
                {\!session.isCurrent && (  
                  \<Button   
                    variant="ghost"   
                    size="sm"  
                    onClick={() \=\> logoutSession(session.id)}  
                  \>  
                    Logout  
                  \</Button\>  
                )}  
              \</SessionCard\>  
            ))}  
          \</SessionList\>  
            
          \<Button variant="outline" onClick={logoutAllOther}\>  
            Logout All Other Sessions  
          \</Button\>  
        \</Section\>  
      \</SecuritySettings\>  
    \</Tab\>  
      
    \<Tab label="Preferences"\>  
      \<PreferencesSettings\>  
        \<Section\>  
          \<h3\>Language\</h3\>  
            
          \<Select label="Display Language" value={preferences.language}\>  
            \<option value=""\>Use organization default\</option\>  
            \<option value="en"\>English\</option\>  
            \<option value="es"\>Español\</option\>  
            \<option value="fr"\>Français\</option\>  
            \<option value="de"\>Deutsch\</option\>  
            \<option value="pt"\>Português\</option\>  
          \</Select\>  
            
          {preferences.language && (  
            \<Alert\>  
              \<Icon\>ℹ️\</Icon\>  
              \<p\>This overrides your organization's default language\</p\>  
            \</Alert\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Timezone\</h3\>  
            
          \<Toggle checked={\!preferences.customTimezone}\>  
            Use organization timezone ({org.timezone})  
          \</Toggle\>  
            
          {preferences.customTimezone && (  
            \<Select label="Your Timezone" value={preferences.timezone}\>  
              \<option\>UTC\</option\>  
              \<option\>Europe/London\</option\>  
              \<option\>Europe/Madrid\</option\>  
              \<option\>America/New\_York\</option\>  
              \<option\>America/Los\_Angeles\</option\>  
              \<option\>Asia/Tokyo\</option\>  
              {/\* All timezones \*/}  
            \</Select\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Date & Time Format\</h3\>  
            
          \<Select label="Date Format" value={preferences.dateFormat}\>  
            \<option value=""\>Use organization default\</option\>  
            \<option\>DD/MM/YYYY\</option\>  
            \<option\>MM/DD/YYYY\</option\>  
            \<option\>YYYY-MM-DD\</option\>  
          \</Select\>  
            
          \<Select label="Time Format" value={preferences.timeFormat}\>  
            \<option value=""\>Use organization default\</option\>  
            \<option\>12-hour (3:00 PM)\</option\>  
            \<option\>24-hour (15:00)\</option\>  
          \</Select\>  
            
          \<Preview\>  
            \<h4\>Preview\</h4\>  
            \<p\>Date: {formatDate(new Date(), preferences.dateFormat || org.dateFormat)}\</p\>  
            \<p\>Time: {formatTime(new Date(), preferences.timeFormat || org.timeFormat)}\</p\>  
          \</Preview\>  
        \</Section\>  
          
        \<Button\>Save Preferences\</Button\>  
      \</PreferencesSettings\>  
    \</Tab\>  
      
    \<Tab label="Notifications"\>  
      \<NotificationSettings\>  
        \<Section\>  
          \<h3\>Email Notifications\</h3\>  
            
          \<ToggleGroup\>  
            \<Toggle checked={notifications.email.formAssigned}\>  
              \<strong\>Form assigned to you\</strong\>  
              \<p\>When you're assigned a form to complete\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.eventReminder}\>  
              \<strong\>Event reminders\</strong\>  
              \<p\>Reminders before scheduled events\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.eventCancelled}\>  
              \<strong\>Event cancelled or rescheduled\</strong\>  
              \<p\>When events you're attending are changed\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.playerUpdate}\>  
              \<strong\>Player updates\</strong\>  
              \<p\>When players you manage are updated\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.notesMention}\>  
              \<strong\>Mentions in notes\</strong\>  
              \<p\>When someone mentions you in a note\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.aiInsight}\>  
              \<strong\>AI insights\</strong\>  
              \<p\>When AI detects important patterns\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.email.weeklyDigest}\>  
              \<strong\>Weekly digest\</strong\>  
              \<p\>Summary of the week's activity (sent Mondays)\</p\>  
            \</Toggle\>  
          \</ToggleGroup\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Push Notifications\</h3\>  
            
          \<ToggleGroup\>  
            \<Toggle checked={notifications.push.formDue}\>  
              \<strong\>Form due soon\</strong\>  
              \<p\>When forms are due within 1 hour\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.push.eventStarting}\>  
              \<strong\>Event starting soon\</strong\>  
              \<p\>15 minutes before scheduled events\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.push.mentions}\>  
              \<strong\>Mentions\</strong\>  
              \<p\>When someone mentions you\</p\>  
            \</Toggle\>  
              
            \<Toggle checked={notifications.push.urgentAlerts}\>  
              \<strong\>Urgent alerts\</strong\>  
              \<p\>Critical notifications only\</p\>  
            \</Toggle\>  
          \</ToggleGroup\>  
        \</Section\>  
          
        \<Section\>  
          \<h3\>SMS Notifications (Optional)\</h3\>  
            
          \<Toggle checked={notifications.smsEnabled}\>  
            Enable SMS notifications  
          \</Toggle\>  
            
          {notifications.smsEnabled && (  
            \<\>  
              \<Input   
                label="Mobile Number"   
                type="tel"  
                value={user.phone}  
                placeholder="+44 7700 900000"  
                help="Must include country code"  
              /\>  
                
              \<Alert\>  
                \<Icon\>💬\</Icon\>  
                \<p\>Standard SMS rates may apply from your carrier\</p\>  
              \</Alert\>  
                
              \<ToggleGroup\>  
                \<Toggle checked={notifications.sms.urgentOnly}\>  
                  \<strong\>Urgent alerts only\</strong\>  
                  \<p\>Only send critical notifications via SMS\</p\>  
                \</Toggle\>  
                  
                \<Toggle checked={notifications.sms.eventReminders}\>  
                  \<strong\>Event reminders\</strong\>  
                  \<p\>SMS reminder 1 hour before events\</p\>  
                \</Toggle\>  
              \</ToggleGroup\>  
            \</\>  
          )}  
        \</Section\>  
          
        \<Button\>Save Notification Settings\</Button\>  
      \</NotificationSettings\>  
    \</Tab\>  
      
    \<Tab label="Data & Privacy"\>  
      \<DataPrivacySettings\>  
        \<Section\>  
          \<h3\>Download Your Data\</h3\>  
          \<p\>Export all your personal data from SimpleAM (GDPR compliant)\</p\>  
            
          \<CheckboxGroup label="What to include:"\>  
            \<Checkbox checked disabled\>Profile information\</Checkbox\>  
            \<Checkbox checked\>Notes you created\</Checkbox\>  
            \<Checkbox checked\>Forms you completed\</Checkbox\>  
            \<Checkbox checked\>Events you attended\</Checkbox\>  
            \<Checkbox checked\>Files you uploaded\</Checkbox\>  
            \<Checkbox checked\>Drawings you created\</Checkbox\>  
          \</CheckboxGroup\>  
            
          \<Select label="Format"\>  
            \<option\>JSON\</option\>  
            \<option\>CSV (where applicable)\</option\>  
          \</Select\>  
            
          \<Button onClick={requestDataExport}\>  
            Request Data Export  
          \</Button\>  
            
          \<Alert\>  
            \<Icon\>ℹ️\</Icon\>  
            \<p\>We'll email you a download link when your export is ready (usually within 24 hours)\</p\>  
          \</Alert\>  
            
          {pendingExport && (  
            \<ExportStatus\>  
              \<Icon\>⏳\</Icon\>  
              \<div\>  
                \<strong\>Export in progress\</strong\>  
                \<p\>Requested {formatDateTime(pendingExport.requestedAt)}\</p\>  
                \<Progress value={pendingExport.progress} /\>  
              \</div\>  
            \</ExportStatus\>  
          )}  
            
          {completedExports.length \> 0 && (  
            \<\>  
              \<h4\>Previous Exports\</h4\>  
              \<ExportList\>  
                {completedExports.map(exp \=\> (  
                  \<ExportRow key={exp.id}\>  
                    \<div\>  
                      \<strong\>Data export\</strong\>  
                      \<p\>Created {formatDateTime(exp.createdAt)}\</p\>  
                      \<p className="text-sm text-muted"\>  
                        Expires {formatDateTime(exp.expiresAt)}  
                      \</p\>  
                    \</div\>  
                    \<Button   
                      size="sm"   
                      variant="outline"  
                      onClick={() \=\> downloadExport(exp.id)}  
                    \>  
                      \<DownloadIcon /\> Download  
                    \</Button\>  
                  \</ExportRow\>  
                ))}  
              \</ExportList\>  
            \</\>  
          )}  
        \</Section\>  
          
        \<Section\>  
          \<h3\>Delete Account\</h3\>  
            
          \<Alert variant="destructive"\>  
            \<Icon\>⚠️\</Icon\>  
            \<div\>  
              \<strong\>Permanent deletion\</strong\>  
              \<p\>This action cannot be undone. All your personal data will be permanently deleted.\</p\>  
            \</div\>  
          \</Alert\>  
            
          \<Details\>  
            \<summary\>What happens when you delete your account?\</summary\>  
            \<ul\>  
              \<li\>Your profile and personal information will be permanently deleted\</li\>  
              \<li\>You'll be removed from all organizations\</li\>  
              \<li\>Content you created (notes, forms, reports) will remain but be anonymized\</li\>  
              \<li\>Your account cannot be recovered after deletion\</li\>  
              \<li\>Any active subscriptions will be cancelled\</li\>  
            \</ul\>  
          \</Details\>  
            
          \<Button variant="destructive" onClick={openDeleteConfirm}\>  
            Delete My Account  
          \</Button\>  
        \</Section\>  
      \</DataPrivacySettings\>  
    \</Tab\>  
  \</Tabs\>  
\</UserProfile\>

---

## **Enable 2FA Flow**

\<Enable2FAModal\>  
  \<Steps\>  
    \<Step active\>1. Scan QR Code\</Step\>  
    \<Step\>2. Enter Code\</Step\>  
    \<Step\>3. Save Backup Codes\</Step\>  
  \</Steps\>  
    
  {/\* Step 1: QR Code \*/}  
  \<Step1\>  
    \<h3\>Scan QR Code\</h3\>  
    \<p\>Use an authenticator app like Google Authenticator or Authy\</p\>  
      
    \<QRCode value={totpUri} size={256} /\>  
      
    \<Details\>  
      \<summary\>Can't scan the code?\</summary\>  
      \<p\>Enter this key manually in your authenticator app:\</p\>  
      \<Code\>{secret}\</Code\>  
      \<Button size="sm" variant="ghost" onClick={copySecret}\>  
        Copy Key  
      \</Button\>  
    \</Details\>  
      
    \<Button onClick={nextStep}\>Next\</Button\>  
  \</Step1\>  
    
  {/\* Step 2: Verify Code \*/}  
  \<Step2\>  
    \<h3\>Enter Verification Code\</h3\>  
    \<p\>Enter the 6-digit code from your authenticator app\</p\>  
      
    \<OTPInput   
      length={6}  
      value={code}  
      onChange={setCode}  
    /\>  
      
    \<ButtonGroup\>  
      \<Button variant="outline" onClick={prevStep}\>Back\</Button\>  
      \<Button onClick={verifyCode} disabled={code.length \!== 6}\>  
        Verify  
      \</Button\>  
    \</ButtonGroup\>  
  \</Step2\>  
    
  {/\* Step 3: Backup Codes \*/}  
  \<Step3\>  
    \<h3\>Save Your Backup Codes\</h3\>  
    \<Alert variant="warning"\>  
      \<Icon\>⚠️\</Icon\>  
      \<p\>Save these codes in a safe place. You'll need them if you lose access to your authenticator app.\</p\>  
    \</Alert\>  
      
    \<CodeGrid\>  
      {backupCodes.map(code \=\> (  
        \<Code key={code}\>{code}\</Code\>  
      ))}  
    \</CodeGrid\>  
      
    \<ButtonGroup\>  
      \<Button variant="outline" onClick={downloadCodes}\>  
        \<DownloadIcon /\> Download  
      \</Button\>  
      \<Button variant="outline" onClick={printCodes}\>  
        \<PrintIcon /\> Print  
      \</Button\>  
      \<Button variant="outline" onClick={copyCodes}\>  
        \<CopyIcon /\> Copy All  
      \</Button\>  
    \</ButtonGroup\>  
      
    \<Checkbox checked={confirmedSaved} onChange={setConfirmedSaved}\>  
      I have saved my backup codes in a safe place  
    \</Checkbox\>  
      
    \<Button onClick={complete} disabled={\!confirmedSaved}\>  
      Complete Setup  
    \</Button\>  
  \</Step3\>  
\</Enable2FAModal\>

---

## **Delete Account Confirmation**

\<DeleteAccountModal\>  
  \<Alert variant="destructive"\>  
    \<Icon\>⚠️\</Icon\>  
    \<strong\>Are you absolutely sure?\</strong\>  
  \</Alert\>  
    
  \<p\>This action cannot be undone. This will permanently delete your account and remove all your personal data from our servers.\</p\>  
    
  \<WhatHappens\>  
    \<h4\>What will be deleted:\</h4\>  
    \<ul\>  
      \<li\>Your profile and account information\</li\>  
      \<li\>Your personal preferences and settings\</li\>  
      \<li\>Your access to all organizations\</li\>  
      \<li\>Your activity history\</li\>  
    \</ul\>  
      
    \<h4\>What will be kept (anonymized):\</h4\>  
    \<ul\>  
      \<li\>Notes you created (author shown as "Deleted User")\</li\>  
      \<li\>Forms you created\</li\>  
      \<li\>Reports you created\</li\>  
      \<li\>Drawings you created\</li\>  
    \</ul\>  
  \</WhatHappens\>  
    
  \<Input   
    label="Type DELETE to confirm"  
    value={confirmText}  
    onChange={setConfirmText}  
    placeholder="DELETE"  
  /\>  
    
  \<Checkbox checked={confirmedUnderstand}\>  
    I understand this action cannot be undone  
  \</Checkbox\>  
    
  \<ButtonGroup\>  
    \<Button variant="ghost" onClick={cancel}\>Cancel\</Button\>  
    \<Button   
      variant="destructive"   
      disabled={confirmText \!== "DELETE" || \!confirmedUnderstand}  
      onClick={deleteAccount}  
    \>  
      Delete My Account Permanently  
    \</Button\>  
  \</ButtonGroup\>  
\</DeleteAccountModal\>

---

## **Data Model**

model User {  
  id            String @id  
  email         String @unique  
  name          String  
  phone         String?  
  photo         String?  
    
  // Security  
  passwordHash  String  
  has2FA        Boolean @default(false)  
  twoFactorSecret String? // TOTP secret  
  backupCodes   String\[\] // encrypted backup codes  
    
  // Preferences  
  language      String? // overrides org default  
  timezone      String? // overrides org default  
  dateFormat    String?  
  timeFormat    String?  
    
  // Notifications  
  notificationSettings Json? // {email: {...}, push: {...}, sms: {...}}  
    
  // Auth  
  authId        String @unique // Supabase auth ID  
    
  // Memberships  
  memberships   OrgMember\[\]  
    
  // Sessions  
  sessions      Session\[\]  
    
  // Activity  
  lastActive    DateTime?  
  createdAt     DateTime @default(now())  
  updatedAt     DateTime @updatedAt  
}

model Session {  
  id         String @id  
  userId     String  
  user       User @relation(fields: \[userId\], references: \[id\])  
    
  // Session info  
  token      String @unique  
  device     String // "Chrome on Windows", "Safari on iPhone"  
  browser    String // "Chrome 120"  
  os         String // "Windows 10"  
  location   String? // "London, UK" (IP-based)  
  ipAddress  String  
    
  lastActive DateTime  
  expiresAt  DateTime  
  createdAt  DateTime @default(now())  
}

model DataExportRequest {  
  id        String @id  
  userId    String  
  user      User @relation(fields: \[userId\], references: \[id\])  
    
  // What to include  
  includeNotes     Boolean @default(true)  
  includeForms     Boolean @default(true)  
  includeEvents    Boolean @default(true)  
  includeFiles     Boolean @default(true)  
  includeDrawings  Boolean @default(true)  
    
  // Format  
  format    String @default("json") // "json", "csv"  
    
  // Status  
  status    String @default("pending") // "pending", "processing", "completed", "failed"  
  progress  Int @default(0) // 0-100  
    
  // Result  
  fileUrl   String? // download link (expires after 7 days)  
  fileSize  Int? // bytes  
  expiresAt DateTime?  
    
  // Error  
  error     String?  
    
  requestedAt DateTime @default(now())  
  completedAt DateTime?  
}

---

## **Notification Settings Default**

const defaultNotificationSettings \= {  
  email: {  
    formAssigned: true,  
    eventReminder: true,  
    eventCancelled: true,  
    playerUpdate: true,  
    notesMention: true,  
    aiInsight: true,  
    weeklyDigest: true  
  },  
  push: {  
    formDue: true,  
    eventStarting: true,  
    mentions: true,  
    urgentAlerts: true  
  },  
  sms: {  
    enabled: false,  
    urgentOnly: true,  
    eventReminders: false  
  }  
}

---

## **Data Export Background Job**

// Background job that processes data export requests  
async function processDataExport(requestId: string) {  
  const request \= await getExportRequest(requestId)  
    
  try {  
    // Update status  
    await updateExportStatus(requestId, "processing", 0\)  
      
    // Gather data  
    const data: any \= {  
      profile: await getUserProfile(request.userId),  
      preferences: await getUserPreferences(request.userId),  
      memberships: await getUserMemberships(request.userId)  
    }  
      
    await updateExportStatus(requestId, "processing", 20\)  
      
    if (request.includeNotes) {  
      data.notes \= await getUserNotes(request.userId)  
      await updateExportStatus(requestId, "processing", 40\)  
    }  
      
    if (request.includeForms) {  
      data.forms \= await getUserForms(request.userId)  
      await updateExportStatus(requestId, "processing", 60\)  
    }  
      
    if (request.includeEvents) {  
      data.events \= await getUserEvents(request.userId)  
      await updateExportStatus(requestId, "processing", 80\)  
    }  
      
    if (request.includeFiles) {  
      data.files \= await getUserFiles(request.userId)  
    }  
      
    if (request.includeDrawings) {  
      data.drawings \= await getUserDrawings(request.userId)  
    }  
      
    await updateExportStatus(requestId, "processing", 90\)  
      
    // Generate file  
    const fileName \= \`user\_data\_${request.userId}\_${Date.now()}.${request.format}\`  
    const fileContent \= request.format \=== "json"   
      ? JSON.stringify(data, null, 2\)  
      : convertToCSV(data)  
      
    // Upload to storage  
    const fileUrl \= await uploadExportFile(fileName, fileContent)  
    const expiresAt \= addDays(new Date(), 7\) // expires in 7 days  
      
    // Complete  
    await updateExportStatus(requestId, "completed", 100, {  
      fileUrl,  
      fileSize: Buffer.byteLength(fileContent),  
      expiresAt  
    })  
      
    // Send email notification  
    await sendExportReadyEmail(request.userId, fileUrl)  
      
  } catch (error) {  
    await updateExportStatus(requestId, "failed", 0, {  
      error: error.message  
    })  
  }  
}

---

## **Styling with shadcn**

* Tabs \= shadcn Tabs  
* All inputs/selects \= shadcn  
* Toggles \= shadcn Switch  
* Alerts \= shadcn Alert  
* Avatar \= shadcn Avatar  
* Progress bars \= shadcn Progress  
* OTP Input \= custom with shadcn Input styling  
* All buttons/cards \= shadcn

---

## **Mobile Considerations**

**User Profile on mobile:**

* Avatar prominent at top  
* Tabs scroll horizontally  
* Simplified forms (one field per row)  
* Touch-friendly toggles  
* Session cards stack vertically

---

## **AI Integration**

User: "AI, what are my notification settings?"

AI: \[reads user notification settings\]  
AI: "Your notification settings:  
\- Email: You receive all notifications except weekly digest  
\- Push: Enabled for forms, events, and mentions  
\- SMS: Disabled

Would you like to change any of these?"

User: "AI, export all my data"

AI: \[creates data export request\]  
AI: "I've started preparing your data export. This includes:  
\- Your profile information  
\- Notes you created (45 notes)  
\- Forms you completed (120 responses)  
\- Events you attended (68 events)  
\- Files you uploaded (12 files)

You'll receive an email with a download link within 24 hours. The link will be valid for 7 days."

---

## **Build Effort**

**Profile Management:** 4-5 days

* Profile edit UI  
* Photo upload  
* Organization list display

**Security:** 1 week

* Password change with validation  
* 2FA setup (TOTP with QR code)  
* Backup codes generation  
* Session management  
* Active sessions display

**Preferences:** 3-4 days

* Language/timezone overrides  
* Date/time format selection  
* Preview rendering  
* Save preferences

**Notifications:** 4-5 days

* Notification settings UI  
* Email preferences  
* Push notification toggle  
* SMS setup

**Data & Privacy:** 1 week

* Data export request system  
* Background job for export generation  
* Download previous exports  
* Delete account flow  
* Anonymization logic

# **Administration**

# **Administration \- Full Picture**

## **What Administration Does**

**Purpose:** Internal tool for SimpleAM team to manage the platform, troubleshoot issues, and moderate content.

**Key difference:** This is a **separate application** from the main SimpleAM app, with its own interface, but connected to the same database for read/write access.

1. **Organizations management** \- view all orgs, monitor health, troubleshoot issues  
2. **Users management** \- view all users, reset passwords, troubleshoot access issues  
3. **Templates moderation** \- review/approve/reject community templates, feature templates  
4. **Roadmap management** \- manage feature requests from users, prioritize development  
5. **Platform monitoring** \- system health, usage metrics, error tracking

---

## **Tech Stack**

* **Separate Next.js app** \- standalone admin portal (e.g., `admin.simpleam.app`)  
* **Shared database** \- reads/writes same Supabase database as main app  
* **Admin authentication** \- separate login for platform admins only  
* **Tables** \- TanStack Table for data management  
* **Charts** \- Recharts for analytics  
* **Real-time monitoring** \- Supabase real-time subscriptions

---

## **Access Control**

**Who can access:**

* SimpleAM platform administrators only (Anthropic/internal team)  
* NOT organization admins  
* Completely separate authentication system

model PlatformAdmin {  
  id        String @id  
  email     String @unique  
  name      String  
    
  // Separate from regular users  
  passwordHash String  
    
  // Permissions  
  canManageOrgs      Boolean @default(true)  
  canManageUsers     Boolean @default(true)  
  canManageTemplates Boolean @default(true)  
  canManageRoadmap   Boolean @default(true)  
  canViewAnalytics   Boolean @default(true)  
    
  // Audit  
  lastLogin DateTime?  
  createdAt DateTime @default(now())  
}

model AdminAction {  
  id          String @id  
  adminId     String  
  admin       PlatformAdmin @relation(fields: \[adminId\], references: \[id\])  
    
  action      String // "suspended\_org", "banned\_user", "approved\_template"  
  targetType  String // "organization", "user", "template"  
  targetId    String  
    
  reason      String?  
  metadata    Json?  
    
  createdAt   DateTime @default(now())  
}

---

## **Architecture**

┌─────────────────────────────────────┐  
│   Main App (app.simpleam.app)      │  
│   \- Users, Orgs, Players, etc.     │  
│   \- Public-facing application       │  
└──────────────┬──────────────────────┘  
               │  
               │ Shared Database  
               │  
┌──────────────▼──────────────────────┐  
│      Supabase Database              │  
│   \- Organizations table             │  
│   \- Users table                     │  
│   \- All app data                    │  
└──────────────▲──────────────────────┘  
               │  
               │ Read/Write Access  
               │  
┌──────────────┴──────────────────────┐  
│  Admin Portal (admin.simpleam.app)  │  
│   \- Platform admin login            │  
│   \- Organization management         │  
│   \- User management                 │  
│   \- Template moderation             │  
│   \- Roadmap management              │  
└─────────────────────────────────────┘

---

## **User Flow**

### **Admin Login**

\<AdminLogin\>  
  \<Logo\>SimpleAM Admin\</Logo\>  
    
  \<LoginForm\>  
    \<Input   
      label="Admin Email"  
      type="email"  
      required  
    /\>  
      
    \<Input   
      label="Password"  
      type="password"  
      required  
    /\>  
      
    \<Button\>Login to Admin Portal\</Button\>  
  \</LoginForm\>  
    
  \<Alert\>  
    \<Icon\>🔒\</Icon\>  
    \<p\>This is a restricted area for platform administrators only\</p\>  
  \</Alert\>  
\</AdminLogin\>

---

### **Main Dashboard**

\<AdminDashboard\>  
  \<Header\>  
    \<Logo\>SimpleAM Admin Portal\</Logo\>  
    \<AdminInfo\>  
      \<Avatar src={admin.photo} /\>  
      \<span\>{admin.name}\</span\>  
      \<Button variant="ghost" onClick={logout}\>Logout\</Button\>  
    \</AdminInfo\>  
  \</Header\>  
    
  \<Sidebar\>  
    \<NavItem href="/organizations" icon="🏢"\>  
      Organizations  
    \</NavItem\>  
    \<NavItem href="/users" icon="👥"\>  
      Users  
    \</NavItem\>  
    \<NavItem href="/templates" icon="📋"\>  
      Templates  
    \</NavItem\>  
    \<NavItem href="/roadmap" icon="🗺️"\>  
      Roadmap  
    \</NavItem\>  
    \<NavItem href="/analytics" icon="📊"\>  
      Analytics  
    \</NavItem\>  
    \<NavItem href="/audit-log" icon="📝"\>  
      Audit Log  
    \</NavItem\>  
  \</Sidebar\>  
    
  \<MainContent\>  
    {/\* Dynamic content based on selected section \*/}  
  \</MainContent\>  
\</AdminDashboard\>

---

## **1\. Organizations Management**

**Purpose:** Monitor all organizations, troubleshoot issues, manage subscriptions

\<OrganizationsPage\>  
  \<PageHeader\>  
    \<h1\>Organizations\</h1\>  
    \<Stats\>  
      \<Stat label="Total" value={stats.total} /\>  
      \<Stat label="Active" value={stats.active} /\>  
      \<Stat label="Trial" value={stats.trial} /\>  
      \<Stat label="Churned" value={stats.churned} /\>  
    \</Stats\>  
  \</PageHeader\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search by name, email, or ID..." /\>  
    \<FilterSelect label="Plan"\>  
      \<option\>All\</option\>  
      \<option\>Free\</option\>  
      \<option\>Pro\</option\>  
      \<option\>Enterprise\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>Active\</option\>  
      \<option\>Trial\</option\>  
      \<option\>Suspended\</option\>  
    \</FilterSelect\>  
    \<DateFilter label="Created" /\>  
  \</Toolbar\>  
    
  \<OrgsTable\>  
    \<thead\>  
      \<tr\>  
        \<th\>Organization\</th\>  
        \<th\>Plan\</th\>  
        \<th\>Users\</th\>  
        \<th\>Status\</th\>  
        \<th\>Created\</th\>  
        \<th\>MRR\</th\>  
        \<th\>Health\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {orgs.map(org \=\> (  
        \<tr key={org.id}\>  
          \<td\>  
            \<OrgCell\>  
              \<Avatar src={org.logo} /\>  
              \<div\>  
                \<strong\>{org.name}\</strong\>  
                \<Code\>{org.id}\</Code\>  
              \</div\>  
            \</OrgCell\>  
          \</td\>  
          \<td\>\<Badge\>{org.plan}\</Badge\>\</td\>  
          \<td\>{org.userCount}/{org.userLimit}\</td\>  
          \<td\>  
            \<StatusBadge status={org.status} /\>  
          \</td\>  
          \<td\>{formatDate(org.createdAt)}\</td\>  
          \<td\>${org.mrr}\</td\>  
          \<td\>  
            \<HealthIndicator   
              value={org.healthScore}  
              issues={org.issues}  
            /\>  
          \</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item onClick={() \=\> viewDetails(org.id)}\>  
                View Details  
              \</Item\>  
              \<Item onClick={() \=\> viewActivity(org.id)}\>  
                View Activity  
              \</Item\>  
              \<Item onClick={() \=\> impersonate(org.id)}\>  
                Impersonate (Login as Admin)  
              \</Item\>  
              \<Item onClick={() \=\> adjustPlan(org.id)}\>  
                Adjust Plan  
              \</Item\>  
              \<Item onClick={() \=\> resetData(org.id)}\>  
                Reset Demo Data  
              \</Item\>  
              \<Separator /\>  
              \<Item onClick={() \=\> suspend(org.id)} variant="destructive"\>  
                Suspend Organization  
              \</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</OrgsTable\>  
\</OrganizationsPage\>

**Organization Detail View:**

\<OrgDetailPage orgId={orgId}\>  
  \<Header\>  
    \<BackButton /\>  
    \<OrgInfo\>  
      \<Avatar src={org.logo} size="large" /\>  
      \<div\>  
        \<h1\>{org.name}\</h1\>  
        \<Meta\>  
          \<Code\>{org.id}\</Code\>  
          \<Badge\>{org.plan}\</Badge\>  
          \<StatusBadge status={org.status} /\>  
        \</Meta\>  
      \</div\>  
    \</OrgInfo\>  
    \<Actions\>  
      \<Button onClick={impersonate}\>Impersonate\</Button\>  
      \<Button variant="outline" onClick={contact}\>Contact\</Button\>  
    \</Actions\>  
  \</Header\>  
    
  \<Tabs\>  
    \<Tab label="Overview"\>  
      \<Section\>  
        \<h3\>Details\</h3\>  
        \<InfoGrid\>  
          \<InfoItem label="Created"\>{formatDate(org.createdAt)}\</InfoItem\>  
          \<InfoItem label="Last Active"\>{formatDate(org.lastActive)}\</InfoItem\>  
          \<InfoItem label="Timezone"\>{org.timezone}\</InfoItem\>  
          \<InfoItem label="Language"\>{org.language}\</InfoItem\>  
          \<InfoItem label="Primary Contact"\>{org.primaryContact}\</InfoItem\>  
        \</InfoGrid\>  
      \</Section\>  
        
      \<Section\>  
        \<h3\>Subscription\</h3\>  
        \<SubscriptionInfo\>  
          \<Field label="Plan"\>{org.plan}\</Field\>  
          \<Field label="Billing"\>{org.billingInterval}\</Field\>  
          \<Field label="MRR"\>${org.mrr}\</Field\>  
          \<Field label="Next Billing"\>{formatDate(org.nextBilling)}\</Field\>  
          \<Field label="Stripe ID"\>{org.stripeCustomerId}\</Field\>  
        \</SubscriptionInfo\>  
      \</Section\>  
        
      \<Section\>  
        \<h3\>Usage\</h3\>  
        \<UsageMetrics\>  
          \<Metric\>  
            \<Label\>Users\</Label\>  
            \<Progress value={(org.userCount / org.userLimit) \* 100} /\>  
            \<Value\>{org.userCount} / {org.userLimit}\</Value\>  
          \</Metric\>  
          \<Metric\>  
            \<Label\>Storage\</Label\>  
            \<Progress value={(org.storage / org.storageLimit) \* 100} /\>  
            \<Value\>{formatBytes(org.storage)} / {formatBytes(org.storageLimit)}\</Value\>  
          \</Metric\>  
          \<Metric\>  
            \<Label\>AI Queries (this month)\</Label\>  
            \<Progress value={(org.aiQueries / org.aiLimit) \* 100} /\>  
            \<Value\>{org.aiQueries} / {org.aiLimit}\</Value\>  
          \</Metric\>  
        \</UsageMetrics\>  
      \</Section\>  
        
      \<Section\>  
        \<h3\>Health Score\</h3\>  
        \<HealthScore value={org.healthScore} /\>  
        {org.issues.length \> 0 && (  
          \<IssuesList\>  
            {org.issues.map(issue \=\> (  
              \<Issue key={issue.id} severity={issue.severity}\>  
                \<Icon\>{issue.icon}\</Icon\>  
                \<span\>{issue.message}\</span\>  
              \</Issue\>  
            ))}  
          \</IssuesList\>  
        )}  
      \</Section\>  
    \</Tab\>  
      
    \<Tab label="Users"\>  
      \<UsersList orgId={org.id} /\>  
    \</Tab\>  
      
    \<Tab label="Activity"\>  
      \<ActivityLog orgId={org.id} /\>  
    \</Tab\>  
      
    \<Tab label="Support"\>  
      \<SupportTickets orgId={org.id} /\>  
    \</Tab\>  
  \</Tabs\>  
\</OrgDetailPage\>

---

## **2\. Users Management**

**Purpose:** View all users, troubleshoot login issues, reset passwords

\<UsersPage\>  
  \<PageHeader\>  
    \<h1\>Users\</h1\>  
    \<Stats\>  
      \<Stat label="Total" value={stats.total} /\>  
      \<Stat label="Active (30d)" value={stats.active} /\>  
      \<Stat label="New (7d)" value={stats.new} /\>  
    \</Stats\>  
  \</PageHeader\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search by name, email, or ID..." /\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>Active\</option\>  
      \<option\>Inactive\</option\>  
      \<option\>Banned\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Has 2FA"\>  
      \<option\>All\</option\>  
      \<option\>Enabled\</option\>  
      \<option\>Disabled\</option\>  
    \</FilterSelect\>  
  \</Toolbar\>  
    
  \<UsersTable\>  
    \<thead\>  
      \<tr\>  
        \<th\>User\</th\>  
        \<th\>Organizations\</th\>  
        \<th\>Status\</th\>  
        \<th\>2FA\</th\>  
        \<th\>Last Active\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {users.map(user \=\> (  
        \<tr key={user.id}\>  
          \<td\>  
            \<UserCell\>  
              \<Avatar src={user.photo} /\>  
              \<div\>  
                \<strong\>{user.name}\</strong\>  
                \<span\>{user.email}\</span\>  
                \<Code\>{user.id}\</Code\>  
              \</div\>  
            \</UserCell\>  
          \</td\>  
          \<td\>  
            {user.memberships.map(m \=\> (  
              \<OrgChip key={m.orgId}\>  
                {m.org.name}  
              \</OrgChip\>  
            ))}  
          \</td\>  
          \<td\>\<StatusBadge status={user.status} /\>\</td\>  
          \<td\>  
            {user.has2FA ? (  
              \<Badge variant="success"\>Enabled\</Badge\>  
            ) : (  
              \<Badge variant="secondary"\>Disabled\</Badge\>  
            )}  
          \</td\>  
          \<td\>{formatDate(user.lastActive)}\</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item onClick={() \=\> viewDetails(user.id)}\>  
                View Details  
              \</Item\>  
              \<Item onClick={() \=\> viewActivity(user.id)}\>  
                View Activity  
              \</Item\>  
              \<Item onClick={() \=\> resetPassword(user.id)}\>  
                Reset Password  
              \</Item\>  
              \<Item onClick={() \=\> disable2FA(user.id)}\>  
                Disable 2FA  
              \</Item\>  
              \<Item onClick={() \=\> viewSessions(user.id)}\>  
                View Sessions  
              \</Item\>  
              \<Separator /\>  
              \<Item onClick={() \=\> ban(user.id)} variant="destructive"\>  
                Ban User  
              \</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</UsersTable\>  
\</UsersPage\>

---

## **3\. Templates Moderation**

**Purpose:** Review and approve community-submitted templates

\<TemplatesPage\>  
  \<PageHeader\>  
    \<h1\>Community Templates\</h1\>  
    \<Stats\>  
      \<Stat label="Pending Review" value={stats.pending} variant="warning" /\>  
      \<Stat label="Approved" value={stats.approved} /\>  
      \<Stat label="Featured" value={stats.featured} /\>  
    \</Stats\>  
  \</PageHeader\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search templates..." /\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>Pending Review\</option\>  
      \<option\>Approved\</option\>  
      \<option\>Featured\</option\>  
      \<option\>Rejected\</option\>  
    \</FilterSelect\>  
    \<FilterSelect label="Type"\>  
      \<option\>All\</option\>  
      \<option\>Form\</option\>  
      \<option\>Report\</option\>  
      \<option\>Drawing\</option\>  
      \<option\>Plan\</option\>  
    \</FilterSelect\>  
  \</Toolbar\>  
    
  \<TemplatesTable\>  
    \<thead\>  
      \<tr\>  
        \<th\>Template\</th\>  
        \<th\>Type\</th\>  
        \<th\>Author\</th\>  
        \<th\>Status\</th\>  
        \<th\>Downloads\</th\>  
        \<th\>Rating\</th\>  
        \<th\>Submitted\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {templates.map(template \=\> (  
        \<tr key={template.id}\>  
          \<td\>  
            \<TemplateCell\>  
              \<Thumbnail src={template.preview} /\>  
              \<div\>  
                \<strong\>{template.name}\</strong\>  
                \<p\>{template.description}\</p\>  
              \</div\>  
            \</TemplateCell\>  
          \</td\>  
          \<td\>\<Badge\>{template.type}\</Badge\>\</td\>  
          \<td\>  
            {template.isOfficial ? (  
              \<Badge variant="primary"\>Official\</Badge\>  
            ) : (  
              \<span\>{template.author.name}\</span\>  
            )}  
          \</td\>  
          \<td\>\<StatusBadge status={template.status} /\>\</td\>  
          \<td\>{template.downloads}\</td\>  
          \<td\>  
            \<Rating value={template.rating} readonly /\>  
            \<span\>({template.reviewCount})\</span\>  
          \</td\>  
          \<td\>{formatDate(template.createdAt)}\</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item onClick={() \=\> preview(template.id)}\>  
                Preview  
              \</Item\>  
              \<Item onClick={() \=\> approve(template.id)}\>  
                Approve  
              \</Item\>  
              \<Item onClick={() \=\> feature(template.id)}\>  
                Feature  
              \</Item\>  
              \<Item onClick={() \=\> reject(template.id)}\>  
                Reject  
              \</Item\>  
              \<Separator /\>  
              \<Item onClick={() \=\> remove(template.id)} variant="destructive"\>  
                Delete  
              \</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</TemplatesTable\>  
    
  {/\* Priority: Review Queue \*/}  
  \<Section\>  
    \<h3\>Review Queue ({pendingTemplates.length})\</h3\>  
    \<ReviewQueue\>  
      {pendingTemplates.map(template \=\> (  
        \<ReviewCard key={template.id}\>  
          \<Thumbnail src={template.preview} /\>  
          \<Info\>  
            \<h4\>{template.name}\</h4\>  
            \<p\>{template.description}\</p\>  
            \<Meta\>  
              \<Badge\>{template.type}\</Badge\>  
              \<span\>by {template.author.name}\</span\>  
              \<span\>{formatDate(template.submittedAt)}\</span\>  
            \</Meta\>  
          \</Info\>  
          \<Actions\>  
            \<Button size="sm" onClick={() \=\> preview(template.id)}\>  
              Preview  
            \</Button\>  
            \<Button size="sm" onClick={() \=\> approve(template.id)}\>  
              Approve  
            \</Button\>  
            \<Button size="sm" variant="ghost" onClick={() \=\> reject(template.id)}\>  
              Reject  
            \</Button\>  
          \</Actions\>  
        \</ReviewCard\>  
      ))}  
    \</ReviewQueue\>  
  \</Section\>  
\</TemplatesPage\>

---

## **4\. Roadmap Management**

**Purpose:** Manage feature requests from users, prioritize development

\<RoadmapPage\>  
  \<PageHeader\>  
    \<h1\>Product Roadmap\</h1\>  
    \<Stats\>  
      \<Stat label="Total Requests" value={stats.total} /\>  
      \<Stat label="In Progress" value={stats.inProgress} /\>  
      \<Stat label="Planned" value={stats.planned} /\>  
    \</Stats\>  
  \</PageHeader\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search features..." /\>  
    \<FilterSelect label="Status"\>  
      \<option\>All\</option\>  
      \<option\>Under Review\</option\>  
      \<option\>Planned\</option\>  
      \<option\>In Progress\</option\>  
      \<option\>Completed\</option\>  
    \</FilterSelect\>  
    \<Select label="Sort"\>  
      \<option\>Most Votes\</option\>  
      \<option\>Most Recent\</option\>  
      \<option\>Target Date\</option\>  
    \</Select\>  
    \<Button onClick={createFeature}\>+ Add Feature\</Button\>  
  \</Toolbar\>  
    
  \<RoadmapTable\>  
    \<thead\>  
      \<tr\>  
        \<th\>Feature\</th\>  
        \<th\>Status\</th\>  
        \<th\>Votes\</th\>  
        \<th\>Requested By\</th\>  
        \<th\>Target\</th\>  
        \<th\>Actions\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {features.map(feature \=\> (  
        \<tr key={feature.id}\>  
          \<td\>  
            \<FeatureCell\>  
              \<strong\>{feature.title}\</strong\>  
              \<p\>{feature.description}\</p\>  
              \<Badge\>{feature.category}\</Badge\>  
            \</FeatureCell\>  
          \</td\>  
          \<td\>\<StatusBadge status={feature.status} /\>\</td\>  
          \<td\>  
            \<VoteCount\>⬆️ {feature.votes}\</VoteCount\>  
          \</td\>  
          \<td\>{feature.requestCount} users\</td\>  
          \<td\>{feature.targetRelease || "TBD"}\</td\>  
          \<td\>  
            \<DropdownMenu\>  
              \<Item onClick={() \=\> edit(feature.id)}\>  
                Edit  
              \</Item\>  
              \<Item onClick={() \=\> updateStatus(feature.id)}\>  
                Update Status  
              \</Item\>  
              \<Item onClick={() \=\> setTarget(feature.id)}\>  
                Set Target  
              \</Item\>  
              \<Item onClick={() \=\> merge(feature.id)}\>  
                Merge Similar  
              \</Item\>  
            \</DropdownMenu\>  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</RoadmapTable\>  
    
  {/\* Kanban View \*/}  
  \<Section\>  
    \<h3\>Kanban View\</h3\>  
    \<KanbanBoard\>  
      \<Column title="Under Review"\>  
        {features.filter(f \=\> f.status \=== "under\_review").map(feature \=\> (  
          \<FeatureCard key={feature.id} draggable\>  
            \<h5\>{feature.title}\</h5\>  
            \<VoteCount\>⬆️ {feature.votes}\</VoteCount\>  
          \</FeatureCard\>  
        ))}  
      \</Column\>  
        
      \<Column title="Planned"\>  
        {features.filter(f \=\> f.status \=== "planned").map(feature \=\> (  
          \<FeatureCard key={feature.id} draggable\>  
            \<h5\>{feature.title}\</h5\>  
            \<VoteCount\>⬆️ {feature.votes}\</VoteCount\>  
            \<span\>{feature.targetRelease}\</span\>  
          \</FeatureCard\>  
        ))}  
      \</Column\>  
        
      \<Column title="In Progress"\>  
        {features.filter(f \=\> f.status \=== "in\_progress").map(feature \=\> (  
          \<FeatureCard key={feature.id} draggable\>  
            \<h5\>{feature.title}\</h5\>  
            \<Progress value={feature.progress} /\>  
          \</FeatureCard\>  
        ))}  
      \</Column\>  
        
      \<Column title="Completed"\>  
        {features.filter(f \=\> f.status \=== "completed").map(feature \=\> (  
          \<FeatureCard key={feature.id}\>  
            \<h5\>{feature.title}\</h5\>  
            \<Badge variant="success"\>Released\</Badge\>  
          \</FeatureCard\>  
        ))}  
      \</Column\>  
    \</KanbanBoard\>  
  \</Section\>  
\</RoadmapPage\>

---

## **5\. Audit Log**

**Purpose:** Track all admin actions for accountability

\<AuditLogPage\>  
  \<PageHeader\>  
    \<h1\>Audit Log\</h1\>  
  \</PageHeader\>  
    
  \<Toolbar\>  
    \<Search placeholder="Search actions..." /\>  
    \<FilterSelect label="Admin"\>  
      {admins.map(admin \=\> (  
        \<option key={admin.id}\>{admin.name}\</option\>  
      ))}  
    \</FilterSelect\>  
    \<FilterSelect label="Action Type"\>  
      \<option\>All\</option\>  
      \<option\>Organization\</option\>  
      \<option\>User\</option\>  
      \<option\>Template\</option\>  
      \<option\>Roadmap\</option\>  
    \</FilterSelect\>  
    \<DateRangePicker /\>  
  \</Toolbar\>  
    
  \<AuditTable\>  
    \<thead\>  
      \<tr\>  
        \<th\>Timestamp\</th\>  
        \<th\>Admin\</th\>  
        \<th\>Action\</th\>  
        \<th\>Target\</th\>  
        \<th\>Details\</th\>  
      \</tr\>  
    \</thead\>  
    \<tbody\>  
      {actions.map(action \=\> (  
        \<tr key={action.id}\>  
          \<td\>{formatDateTime(action.createdAt)}\</td\>  
          \<td\>  
            \<Avatar src={action.admin.photo} size="sm" /\>  
            {action.admin.name}  
          \</td\>  
          \<td\>\<Badge\>{action.action}\</Badge\>\</td\>  
          \<td\>  
            {action.targetType}: {action.targetId}  
          \</td\>  
          \<td\>  
            {action.reason && \<p\>{action.reason}\</p\>}  
            {action.metadata && (  
              \<Details\>  
                \<summary\>View metadata\</summary\>  
                \<Code\>{JSON.stringify(action.metadata, null, 2)}\</Code\>  
              \</Details\>  
            )}  
          \</td\>  
        \</tr\>  
      ))}  
    \</tbody\>  
  \</AuditTable\>  
\</AuditLogPage\>

---

## **Deployment**

\# Separate app structure  
/apps  
  /web (main app)  
  /admin (admin portal)  
    
\# Deploy separately  
admin.simpleam.app \-\> Admin portal  
app.simpleam.app \-\> Main app

\# Shared packages  
/packages  
  /database (Prisma client)  
  /ui (shared shadcn components)

---

## **Build Effort**

**Phase 1 (MVP):**

* Admin authentication: 3-4 days  
* Organizations list \+ detail: 1 week  
* Users list \+ detail: 1 week **Total: \~2.5 weeks**

**Phase 2:**

* Templates moderation: 1 week  
* Roadmap management: 1 week **Total: 2 weeks**

**Phase 3:**

* Analytics dashboard: 1 week  
* Audit log: 3-4 days **Total: \~1.5 weeks**

**Total for complete Admin Portal: \~6 weeks**

# **Users v people**

## **Foundation Decisions (Locked In)**

### **1\. User & Organization Model**

**Users are independent of organizations**

* One user account can belong to multiple orgs  
* Users switch between orgs via UI dropdown  
* Example: Consultant works with 3 different clubs using one login

**Structure:**

prisma  
model User {  
  id    String @id  
  email String @unique  
  name  String  
    
  memberships OrgMember\[\]  
}

model OrgMember {  
  userId String  
  orgId  String  
  role   String // "admin", "coach", "medical", "mental\_health"  
    
  @@unique(\[userId, orgId\])

}

---

### **2\. Players/Athletes Model**

**Players are People, not Users**

* Staff create Person records for players  
* Players don't sign up or manage accounts  
* Players have limited access (forms, reports) via magic links or access codes  
* No overhead for players—they just participate when asked

**Structure:**

prisma  
model Person {  
  id       String @id  
  name     String  
  email    String?  
  phone    String?  
    
  orgId    String  
  org      Organization @relation  
    
  // Optional limited access  
  accessCode String? @unique  
    
  // Link to same human in other orgs  
  linkedPersonId String?  
    
  // Data  
  wellness  WellnessEntry\[\]  
  injuries  Injury\[\]  
  notes     Note\[\]

}

---

### **3\. Data Ownership**

**Data belongs to the org that collected it**

* Manchester United collects wellness data → Man United owns it  
* England FA collects their own data → England FA owns it  
* Data is not "owned" by the player

**Structure:**

prisma  
model WellnessEntry {  
  id       String @id  
  orgId    String // org that owns this data  
  personId String // which player  
  date     DateTime  
  data     Json

}

---

### **4\. Cross-Organization Data Sharing**

**Same human can exist as separate Person records in different orgs**

* Marcus at Man United \= `person_123`  
* Marcus at England FA \= `person_456`  
* These records are linked via `linkedPersonId`

**Sharing happens via explicit agreements:**

prisma  
model Person {  
  linkedPersonId String? // links to other org's Person record  
}

model DataSharingAgreement {  
  id             String @id  
  sourceOrgId    String // Man United  
  targetOrgId    String // England FA  
  sourcePersonId String // person\_123  
  targetPersonId String // person\_456  
  dataTypes      String\[\] // \["wellness", "injuries", "load"\]  
  expiresAt      DateTime  
  approvedBy     String  
  approvedAt     DateTime

}

**When England views Marcus:**

* Shows England's own data on `person_456`  
* If sharing agreement exists, also shows Man United's data on `person_123`  
* Unified view of all data for "Marcus the human"

[image1]: <data:image/png;base64,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>