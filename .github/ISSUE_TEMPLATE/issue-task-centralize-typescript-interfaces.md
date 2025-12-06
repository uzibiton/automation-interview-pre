---
name: Task - Centralize TypeScript Interfaces
about: Create shared types file to avoid interface duplication across components
title: '[TASK] Centralize TypeScript Interfaces in Shared Types File'
labels: ['task', 'refactoring', 'typescript', 'frontend']
assignees: ''
---

## Description
**Found During:** PR #19 code review - reviewing DashboardHome.tsx

Currently, TypeScript interfaces are defined within individual component files, leading to duplication. Multiple components define similar interfaces (Stats, Expense, Category, etc.) in different files. This violates DRY principle and makes maintenance harder.

## Problem

**Current State:**
```typescript
// DashboardHome.tsx
interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
}

// AnalyticsPage.tsx  
interface AnalyticsStats {
  // Possibly similar or same structure
  ...
}

// ExpenseList.tsx
interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category?: string;
}

// ExpenseForm.tsx
interface Expense {
  // Duplicate definition!
  ...
}
```

**Issues:**
- ❌ Duplicate interface definitions
- ❌ Inconsistent type definitions across components
- ❌ Hard to maintain (change in one place, forget to update others)
- ❌ No single source of truth for types
- ❌ TypeScript benefits (type safety) weakened by duplicates
- ❌ Risk of type mismatches between components

## Proposed Solution

Create a centralized types file: `app/frontend/src/types/index.ts`

**Benefits:**
- ✅ Single source of truth for all types
- ✅ DRY principle - define once, use everywhere
- ✅ Easy to maintain and update
- ✅ Consistent types across the application
- ✅ Better IDE autocomplete and type checking
- ✅ Easier for new developers to understand data structures

## Implementation

### Step 1: Create Types Directory Structure
```
app/frontend/src/types/
  ├── index.ts           # Main types export
  ├── expense.types.ts   # Expense-related types
  ├── user.types.ts      # User-related types
  ├── stats.types.ts     # Statistics types
  └── api.types.ts       # API request/response types
```

### Step 2: Define Shared Interfaces

**types/expense.types.ts:**
```typescript
export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  categoryId?: number;
  categoryName?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  date: string;
  categoryId?: number;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {
  id: number;
}
```

**types/stats.types.ts:**
```typescript
export interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: CategoryStats[];
}

export interface CategoryStats {
  categoryId: number;
  categoryName: string;
  total: number;
  count?: number;
  percentage?: number;
}
```

**types/user.types.ts:**
```typescript
export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}
```

**types/category.types.ts:**
```typescript
export interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}
```

**types/api.types.ts:**
```typescript
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**types/index.ts:**
```typescript
// Re-export all types from one place
export * from './expense.types';
export * from './user.types';
export * from './stats.types';
export * from './category.types';
export * from './api.types';

// Or named exports for better tree-shaking:
export type { Expense, CreateExpenseDto, UpdateExpenseDto } from './expense.types';
export type { User, AuthResponse } from './user.types';
export type { Stats, CategoryStats } from './stats.types';
export type { Category } from './category.types';
export type { ApiError, ApiResponse, PaginatedResponse } from './api.types';
```

### Step 3: Update Components to Use Shared Types

**Before:**
```typescript
// DashboardHome.tsx
interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
}

function DashboardHome({ stats }: { stats: Stats }) {
  // ...
}
```

**After:**
```typescript
// DashboardHome.tsx
import { Stats } from '../types';

function DashboardHome({ stats }: { stats: Stats }) {
  // ...
}
```

### Step 4: Remove Duplicate Interface Definitions

Search and remove all duplicate interfaces from:
- Component files
- Service files
- Hook files
- Utility files

## Acceptance Criteria

### Structure
- [ ] `src/types/` directory created
- [ ] Types organized by domain (expense, user, stats, etc.)
- [ ] Main `index.ts` exports all types
- [ ] Clear naming conventions followed

### Types Defined
- [ ] Expense types (Expense, CreateExpenseDto, UpdateExpenseDto)
- [ ] User types (User, AuthResponse)
- [ ] Stats types (Stats, CategoryStats)
- [ ] Category types
- [ ] API types (ApiError, ApiResponse, PaginatedResponse)
- [ ] Component prop types (if reusable)

### Refactoring
- [ ] All components import from `types/`
- [ ] No duplicate interface definitions
- [ ] All services use shared types
- [ ] API client uses shared types
- [ ] No TypeScript errors after refactoring

### Documentation
- [ ] Add JSDoc comments to complex types
- [ ] Document type usage in README or TYPES.md
- [ ] Add examples for common patterns

### Testing
- [ ] TypeScript compilation passes
- [ ] No type errors in IDE
- [ ] All existing tests still pass
- [ ] Types are properly exported and importable

## Files to Modify

### Create New Files:
- `app/frontend/src/types/index.ts`
- `app/frontend/src/types/expense.types.ts`
- `app/frontend/src/types/user.types.ts`
- `app/frontend/src/types/stats.types.ts`
- `app/frontend/src/types/category.types.ts`
- `app/frontend/src/types/api.types.ts`

### Refactor Existing Files:
- `app/frontend/src/components/DashboardHome.tsx`
- `app/frontend/src/components/AnalyticsPage.tsx`
- `app/frontend/src/components/ExpensesPage.tsx`
- `app/frontend/src/components/ExpenseList.tsx`
- `app/frontend/src/components/ExpenseForm.tsx`
- `app/frontend/src/components/ExpensePieChart.tsx`
- `app/frontend/src/services/expenseService.ts`
- `app/frontend/src/services/authService.ts`
- Any other files with interface definitions

## Implementation Steps

### Phase 1: Audit (30-60 min)
1. Search for all `interface` definitions in the codebase
2. Identify duplicates and similar types
3. Group types by domain (expense, user, stats, etc.)
4. Document which components use which types

### Phase 2: Create Types (1-2 hours)
1. Create `types/` directory structure
2. Define all shared interfaces
3. Add JSDoc comments
4. Export from `index.ts`

### Phase 3: Refactor Components (2-3 hours)
1. Update imports to use shared types
2. Remove local interface definitions
3. Fix any type mismatches
4. Test each component after refactoring

### Phase 4: Validate (30 min)
1. Run TypeScript compiler
2. Run all tests
3. Check IDE for type errors
4. Manual testing of app

## Best Practices

### Type Naming
- Use PascalCase for interfaces and types
- Use `I` prefix only if necessary (not recommended in modern TS)
- Use descriptive names: `CreateExpenseDto` not `ExpenseInput`

### Organization
- Group related types in the same file
- Don't create too many small files
- Keep API types separate from domain types

### Documentation
```typescript
/**
 * Represents an expense in the system.
 * Used across the application for displaying and managing user expenses.
 */
export interface Expense {
  /** Unique identifier */
  id: number;
  
  /** User-provided description of the expense */
  description: string;
  
  /** Amount in the user's currency */
  amount: number;
  
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  
  /** Optional category assignment */
  categoryId?: number;
}
```

### Utility Types
```typescript
// Use TypeScript utility types
export type PartialExpense = Partial<Expense>;
export type ExpenseWithoutId = Omit<Expense, 'id'>;
export type ExpenseKeys = keyof Expense;
```

## Migration Strategy

**Option 1: All at once (Faster but risky)**
- Create all types
- Update all files in one PR
- Test thoroughly

**Option 2: Gradual (Safer, recommended)**
1. Create types directory with all interfaces
2. Start importing in new files
3. Gradually refactor existing files
4. Keep both until migration complete
5. Remove old interfaces last

## Example Usage After Implementation

```typescript
// Component
import { Expense, Stats, User } from '@/types';

interface DashboardProps {
  user: User;
  stats: Stats;
  expenses: Expense[];
}

// Service
import { CreateExpenseDto, ApiResponse } from '@/types';

async function createExpense(data: CreateExpenseDto): Promise<ApiResponse<Expense>> {
  // ...
}

// API Client
import { ApiError } from '@/types';

function handleError(error: ApiError) {
  // ...
}
```

## Priority
**Medium** - Code quality improvement, doesn't affect functionality but improves maintainability

## Related Issues
- PR #19 code review comment about interface centralization
- Future: Consider using Zod or io-ts for runtime type validation

## References
- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [React TypeScript Cheatsheet - Types](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)
- [TypeScript Deep Dive - Project Structure](https://basarat.gitbook.io/typescript/project/project-structure)
