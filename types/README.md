# Types Directory

TypeScript type definitions and interfaces.

## Structure

```
/types
├── chat.ts              # Chat and messaging types
├── database.ts          # Database schema types (from Prisma)
├── forms.ts             # Form builder types
├── players.ts           # Player management types
├── templates.ts         # Template system types
└── ...                  # Other type definitions
```

## Type Organization

### Database Types (`database.ts`)
Auto-generated from Prisma schema:
```typescript
import { Prisma, User, Organization, Player } from '@prisma/client';
```

### Feature Types
Domain-specific types organized by feature:

**Chat Types (`chat.ts`):**
```typescript
export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt: Date;
  isGroup: boolean;
  name?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  fileUrl?: string;
}
```

**Form Types (`forms.ts`):**
```typescript
export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
}
```

## Type Patterns

### Interfaces vs Types

**Use Interfaces for:**
- Object shapes that may be extended
- Public API contracts
- React component props

```typescript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Can be extended
export interface AdminProfile extends UserProfile {
  permissions: string[];
}
```

**Use Types for:**
- Unions and intersections
- Mapped types
- Utility type compositions

```typescript
export type Status = 'pending' | 'approved' | 'rejected';

export type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

### Generic Types

```typescript
export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Utility Types

```typescript
// Make all properties optional
export type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties required
export type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Pick specific properties
export type UserBasic = Pick<User, 'id' | 'name' | 'email'>;

// Omit specific properties
export type UserPublic = Omit<User, 'password' | 'salt'>;
```

## Common Patterns

### Props Types

```typescript
// Component props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// With HTML attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

### API Types

```typescript
// Request/Response types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  user: User;
  token: string;
}

// API endpoints
export type ApiEndpoints = {
  '/api/users': {
    GET: { response: User[] };
    POST: {
      request: CreateUserRequest;
      response: CreateUserResponse;
    };
  };
};
```

### Form Types

```typescript
// Form values
export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

// Form errors
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type LoginFormErrors = FormErrors<LoginFormValues>;
```

### State Types

```typescript
// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Async data
export interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
```

## Prisma Integration

### Generated Types

Prisma generates types automatically from your schema:

```typescript
import { User, Player, Organization } from '@prisma/client';
```

### Relations

Include related data types:

```typescript
import { Prisma } from '@prisma/client';

// User with organization
export type UserWithOrganization = Prisma.UserGetPayload<{
  include: { organization: true };
}>;

// Player with all relations
export type PlayerFull = Prisma.PlayerGetPayload<{
  include: {
    organization: true;
    notes: true;
    events: true;
  };
}>;
```

### Partial Types

```typescript
// For updates
export type UserUpdate = Prisma.UserUpdateInput;

// For creation
export type UserCreate = Prisma.UserCreateInput;
```

## Best Practices

1. **Naming** - Use clear, descriptive names (e.g., `User`, `UserProfile`, `CreateUserRequest`)
2. **Organization** - Group related types in the same file
3. **Reusability** - Create generic types for common patterns
4. **Documentation** - Add JSDoc comments for complex types
5. **Strict Types** - Avoid `any`, use `unknown` if needed
6. **Enums vs Unions** - Prefer union types over enums for simple cases
7. **Immutability** - Use `Readonly<T>` for immutable data
8. **Null Safety** - Use strict null checks, avoid optional chaining abuse

## Type Guards

```typescript
export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}

export function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Invalid user');
  }
}
```

## Related Documentation

- TypeScript Documentation: https://www.typescriptlang.org/docs/
- Prisma Types: https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety
- Database Schema: `/prisma/README.md`
