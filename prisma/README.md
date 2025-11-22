# Prisma Directory

Database schema, migrations, and SQL scripts.

## Structure

```
/prisma
├── schema.prisma        # Database schema definition
├── /migrations          # Auto-generated migrations
└── /scripts             # Manual SQL scripts
    ├── /setup           # Initial setup scripts
    ├── /maintenance     # Maintenance scripts
    └── /testing         # Testing scripts
```

## Schema Overview

### Core Models

**Users & Authentication:**
- `User` - User accounts
- `Organization` - Organizations/teams
- `Session` - User sessions

**Players & Staff:**
- `Player` - Player roster
- `Staff` - Staff members
- `PlayerNote` - Notes on players

**Forms & Data Collection:**
- `Form` - Custom forms
- `FormField` - Form field definitions
- `FormResponse` - Form submissions
- `FormFieldResponse` - Individual field answers

**Calendar & Events:**
- `Event` - Calendar events
- `EventAttendance` - Attendance tracking

**Templates:**
- `Template` - Reusable templates
- `TemplateCategory` - Template categories

**Files:**
- `File` - File uploads and metadata

**Reports:**
- `Report` - Generated reports
- `ReportTemplate` - Report templates

**Planner:**
- `SessionPlan` - Training session plans
- `Drill` - Drill library

## Schema Commands

### Development

```bash
# Push schema changes to database (no migration)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Format schema file
npx prisma format
```

### Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name add_new_field

# Apply pending migrations (production)
npx prisma migrate deploy

# Reset database (dev only - destructive!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Introspection

```bash
# Pull schema from existing database
npx prisma db pull

# Diff between schema and database
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma
```

## Schema Patterns

### Model Definition

```prisma
model Player {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String?  @unique

  // Relations
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  notes     PlayerNote[]
  events    EventAttendance[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([organizationId])
  @@index([email])
  @@map("players")
}
```

### Relations

**One-to-Many:**
```prisma
model Organization {
  id      String   @id @default(cuid())
  name    String

  // One organization has many players
  players Player[]
}

model Player {
  id             String @id @default(cuid())
  organizationId String

  // Each player belongs to one organization
  organization   Organization @relation(fields: [organizationId], references: [id])
}
```

**Many-to-Many:**
```prisma
model Event {
  id        String   @id @default(cuid())
  title     String

  // Many events have many players (through attendance)
  attendance EventAttendance[]
}

model Player {
  id        String   @id @default(cuid())
  name      String

  // Many players attend many events
  attendance EventAttendance[]
}

model EventAttendance {
  id        String   @id @default(cuid())

  eventId   String
  event     Event    @relation(fields: [eventId], references: [id])

  playerId  String
  player    Player   @relation(fields: [playerId], references: [id])

  status    String   // 'present', 'absent', 'late'

  @@unique([eventId, playerId])
}
```

### Indexes

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique  // Implicit unique index
  name  String

  organizationId String

  // Explicit indexes for query performance
  @@index([organizationId])
  @@index([email, organizationId]) // Composite index
  @@unique([email, organizationId]) // Unique constraint
}
```

## Migrations

### Creating Migrations

```bash
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_player_position

# This generates:
# /migrations/20240101000000_add_player_position/migration.sql
```

### Migration Files

```sql
-- migrations/20240101000000_add_player_position/migration.sql
ALTER TABLE "players" ADD COLUMN "position" TEXT;

CREATE INDEX "players_position_idx" ON "players"("position");
```

### Migration Best Practices

1. **Descriptive Names** - Use clear migration names
2. **Small Changes** - One logical change per migration
3. **Test Locally** - Always test migrations before production
4. **Backup First** - Backup production DB before migrating
5. **Review SQL** - Check generated SQL before applying
6. **Rollback Plan** - Have a rollback strategy ready

## SQL Scripts

### Setup Scripts (`/scripts/setup`)

Initial database setup:
- `complete-schema.sql` - Full schema definition
- `migration.sql` - Initial migration
- `migration-complete.sql` - Complete migration with data

### Maintenance Scripts (`/scripts/maintenance`)

One-off database updates:
- `add-search-vectors.sql` - Add full-text search
- `add-missing-user-columns.sql` - Add user columns
- `create-reports-tables.sql` - Create report tables
- `add-planner-module-complete.sql` - Add planner tables

### Testing Scripts (`/scripts/testing`)

Scripts for development/testing:
- `create-test-user.sql` - Create test user accounts

### Running SQL Scripts

```bash
# PostgreSQL
psql $DATABASE_URL < prisma/scripts/setup/migration.sql

# Or using Prisma
npx prisma db execute --file prisma/scripts/setup/migration.sql --schema prisma/schema.prisma
```

## Database Seeding

Create seed script:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Team',
      plan: 'free',
    },
  });

  // Create demo user
  await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      organizationId: org.id,
    },
  });

  console.log('✓ Database seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx prisma db seed
```

## Environment Configuration

```env
# Development
DATABASE_URL="postgresql://user:pass@localhost:5432/simpleam_dev"

# Production
DATABASE_URL="postgresql://user:pass@host:5432/simpleam_prod"

# Connection pooling (recommended for serverless)
DATABASE_URL="postgresql://user:pass@host:5432/simpleam_prod?pgbouncer=true&connection_limit=1"
```

## Performance Optimization

### Indexes

Add indexes for frequently queried fields:
```prisma
@@index([organizationId])
@@index([email])
@@index([createdAt])
```

### Pagination

Use cursor-based pagination for large datasets:
```typescript
const players = await prisma.player.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastId },
  orderBy: { createdAt: 'desc' },
});
```

### Select Only Needed Fields

```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't select large fields if not needed
  },
});
```

## Troubleshooting

### Schema Sync Issues

```bash
# Reset local database (dev only!)
npx prisma migrate reset

# Pull schema from database
npx prisma db pull

# Push schema to database
npx prisma db push
```

### Migration Conflicts

```bash
# Resolve conflicts
npx prisma migrate resolve --applied 20240101000000_migration_name

# Or mark as rolled back
npx prisma migrate resolve --rolled-back 20240101000000_migration_name
```

### Type Generation Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and regenerate
rm -rf node_modules/.prisma
npm install
```

## Related Documentation

- Prisma Documentation: https://www.prisma.io/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Database Setup: `/docs/setup/`
- Types: `/types/README.md`
