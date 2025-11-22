# Scripts Directory

Build, maintenance, and utility scripts for development and operations.

## Available Scripts

### Development
- **`dev`** - Start development server (Next.js)
- **`build`** - Build production bundle
- **`start`** - Start production server
- **`lint`** - Run ESLint checks
- **`type-check`** - Run TypeScript type checking

### Database
- **`db:push`** - Push Prisma schema changes to database
- **`db:migrate`** - Create and run database migrations
- **`db:studio`** - Open Prisma Studio GUI
- **`db:seed`** - Seed database with initial data
- **`db:reset`** - Reset database (dangerous!)

### Testing
- **`test`** - Run unit tests
- **`test:watch`** - Run tests in watch mode
- **`test:e2e`** - Run end-to-end tests
- **`test:coverage`** - Generate test coverage report

### Code Quality
- **`format`** - Format code with Prettier
- **`format:check`** - Check code formatting
- **`lint:fix`** - Auto-fix linting issues

## Script Usage

### Running Scripts

```bash
# Using npm
npm run dev
npm run build

# Using pnpm
pnpm dev
pnpm build

# Using yarn
yarn dev
yarn build
```

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
```

### Pre-deployment Checklist

```bash
# 1. Run type checking
npm run type-check

# 2. Run linting
npm run lint

# 3. Run tests
npm run test

# 4. Build production bundle
npm run build

# 5. Test production build locally
npm run start
```

## Custom Scripts

### Database Seeding (`/scripts/seed.ts`)

Seeds database with initial data:
- Demo users
- Sample organizations
- Test players
- Example forms and templates

```bash
npm run db:seed
```

### Data Migration Scripts

Located in `/scripts/migrations/`:
- One-off data transformations
- Bulk updates
- Data imports

```bash
node scripts/migrations/migrate-player-data.js
```

### Maintenance Scripts

Located in `/scripts/maintenance/`:
- Cleanup old files
- Archive inactive data
- Generate reports

```bash
node scripts/maintenance/cleanup-uploads.js
```

## Environment Variables

Scripts may require environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Firebase (for chat)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Storage
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

See `/docs/setup/` for detailed environment setup.

## Package Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}
```

## Creating Custom Scripts

### TypeScript Scripts

```typescript
// scripts/my-script.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Script logic here
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
npx tsx scripts/my-script.ts
```

### Bash Scripts

```bash
#!/bin/bash
# scripts/backup-db.sh

echo "Backing up database..."
pg_dump $DATABASE_URL > backup.sql
echo "Backup complete!"
```

Make executable:
```bash
chmod +x scripts/backup-db.sh
./scripts/backup-db.sh
```

## Best Practices

1. **Idempotency** - Scripts should be safe to run multiple times
2. **Error Handling** - Always handle errors gracefully
3. **Logging** - Provide clear output about what's happening
4. **Confirmation** - Ask for confirmation before destructive operations
5. **Documentation** - Document what each script does
6. **Testing** - Test scripts in non-production environments first
7. **Rollback** - Provide rollback mechanisms for migrations

## Continuous Integration

Scripts used in CI/CD pipelines:

```yaml
# .github/workflows/ci.yml
- name: Type Check
  run: npm run type-check

- name: Lint
  run: npm run lint

- name: Test
  run: npm run test

- name: Build
  run: npm run build
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset connection pool
npm run db:push
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Try building again
npm run build
```

### Type Errors

```bash
# Regenerate Prisma types
npx prisma generate

# Clear TypeScript cache
rm -rf .tsbuildinfo
npm run type-check
```

## Related Documentation

- Database Schema: `/prisma/README.md`
- Setup Guide: `/docs/setup/`
- Deployment: `/docs/deployment/`
