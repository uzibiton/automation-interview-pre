# TASKS-002: Group Management Implementation Tasks

## Overview

**Feature**: Group Management with Role-Based Permissions  
**Parent Issue**: [#69](https://github.com/uzibiton/automation-interview-pre/issues/69)  
**Requirements**: [REQ-002](../product/requirements/REQ-002-group-management.md)  
**Design**: [HLD-002](designs/HLD-002-group-management.md)  
**Test Plan**: [TEST-002](../qa/test-plans/TEST-002-group-management.md)

**GitHub Issues**: [View all TASK-002 issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002+)

---

## Task Summary

| Phase         | Tasks  | Effort (days)  | Priority |
| ------------- | ------ | -------------- | -------- |
| Phase 0: DB   | 2      | 2-3            | Critical |
| Phase 1: Auth | 8      | 10-12          | Critical |
| Phase 2: API  | 4      | 5-6            | Critical |
| Phase 3: UI   | 9      | 13.5-17        | High     |
| Phase 4: Test | 5      | 10-12          | High     |
| **Total**     | **28** | **41-50 days** | -        |

---

## UI-First Development Approach 🎨

**Strategy**: Build frontend components first using mock data to enable parallel development and faster iteration.

### Mock Development Setup

1. **Mock Data Structure** (0.5 days):
   - Create TypeScript interfaces matching backend DTOs
   - Define fixture data for groups, members, invitations, invite links
   - Store in `app/frontend/src/mocks/fixtures/`

2. **Mock API Layer** (1 day):
   - Option A: Mock Service Worker (MSW) for intercepting HTTP requests
   - Option B: Create `MockGroupService` with same interface as real service
   - Simulate realistic delays (200-500ms)
   - Simulate error scenarios (validation, 403, 404, 500)

3. **Environment Toggle** (0.5 days):
   - Environment variable: `VITE_USE_MOCK_API=true`
   - Switch between mock and real API without code changes
   - Keep mocks for E2E tests and development

### Benefits

- ✅ No backend dependency - start UI development immediately
- ✅ Faster iteration - no waiting for API responses
- ✅ Easier testing - predictable mock data
- ✅ Better collaboration - designers/frontend can work independently
- ✅ Reusable for E2E tests and demos

### Integration Path

1. Build all Phase 3 UI components with mocks (13.5-17 days)
2. Run component tests and E2E tests with mocks
3. Build backend (Phase 0-2) in parallel or after (17-21 days)
4. Switch to real API: Change `VITE_USE_MOCK_API=false`
5. Run integration tests with real backend
6. Fix any API contract mismatches

---

## Phase 0: Database Schema (2-3 days) 🔴 CRITICAL

### TASK-002-001: Create Database Migrations

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: None

**Requirements**: FR-001, FR-002, FR-003, FR-004, FR-006  
**Design**: HLD-002 Section 5 (Database Schema)

**Description**: Create TypeORM migrations for 5 new tables

**Acceptance Criteria**:

- [ ] Migration file created: `YYYYMMDDHHMMSS-CreateGroupsTables.ts`
- [ ] Tables created:
  - [ ] `groups` (id, name, description, created_by, created_at, updated_at)
  - [ ] `group_members` (id, group_id, user_id, role, joined_at)
  - [ ] `invitations` (id, group_id, inviter_id, email, role, token, status, expires_at, created_at)
  - [ ] `invite_links` (id, group_id, created_by, token, default_role, max_uses, uses_count, expires_at, is_active, created_at)
  - [ ] `audit_log` (id, group_id, user_id, action, target_type, target_id, details, ip_address, created_at)
- [ ] Foreign keys configured with CASCADE deletes
- [ ] Indexes created:
  - [ ] `idx_group_members_group_id` (group_id)
  - [ ] `idx_group_members_user_id` (user_id)
  - [ ] `idx_group_members_group_user` (group_id, user_id) UNIQUE
  - [ ] `idx_invitations_email` (email)
  - [ ] `idx_invitations_token` (token) UNIQUE
  - [ ] `idx_invite_links_token` (token) UNIQUE
  - [ ] `idx_audit_log_group_id` (group_id)
  - [ ] `idx_audit_log_created_at` (created_at)
- [ ] Constraints enforced:
  - [ ] UNIQUE (group_id, user_id) on group_members
  - [ ] CHECK (max_uses >= 0 OR max_uses IS NULL) on invite_links
  - [ ] CHECK (role IN ('owner', 'admin', 'member', 'viewer')) on group_members
- [ ] Migration tested: up and down

**Files**:

- `app/services/auth-service/src/migrations/YYYYMMDDHHMMSS-CreateGroupsTables.ts`

**Labels**: `database`, `migration`, `critical`

---

### TASK-002-002: Add Group Fields to Users Table

**Priority**: Critical | **Effort**: 0.5 days | **Dependencies**: TASK-002-001

**Requirements**: FR-001  
**Design**: HLD-002 Section 5.6 (User Table Updates)

**Description**: Add group context to users table (optional - can be derived from group_members)

**Acceptance Criteria**:

- [ ] Migration created: `YYYYMMDDHHMMSS-AddGroupFieldsToUsers.ts`
- [ ] Optional: Add `current_group_id` column to `users` table (nullable FK to groups)
- [ ] Alternative: Query group from `group_members` join (no schema change)
- [ ] Decision documented in migration comments
- [ ] Migration tested: up and down

**Files**:

- `app/services/auth-service/src/migrations/YYYYMMDDHHMMSS-AddGroupFieldsToUsers.ts` (if needed)

**Labels**: `database`, `migration`, `optional`

**Decision Note**: May skip if group context derived from group_members JOIN. Evaluate performance tradeoff.

---

## Phase 1: Auth Service Backend (10-12 days) 🔴 CRITICAL

### TASK-002-003: Create Group Entity and DTOs

**Priority**: Critical | **Effort**: 1 day | **Dependencies**: TASK-002-001

**Requirements**: FR-001  
**Design**: HLD-002 Section 4.1.1 (Groups Module)

**Description**: TypeORM entities and DTOs for groups

**Acceptance Criteria**:

- [ ] Entity created: `Group.entity.ts`
  - [ ] All fields from schema mapped
  - [ ] Relations defined: `@OneToMany(() => GroupMember)`
  - [ ] Timestamps: `@CreateDateColumn`, `@UpdateDateColumn`
- [ ] DTOs created:
  - [ ] `CreateGroupDto` (name, description)
  - [ ] `UpdateGroupDto` (name?, description?)
  - [ ] `GroupResponseDto` (id, name, description, createdBy, memberCount, createdAt)
- [ ] Validation decorators: `@IsString()`, `@Length(3, 100)`, `@IsOptional()`
- [ ] Unit tests: DTO validation (min/max length, required fields)

**Files**:

- `app/services/auth-service/src/groups/entities/group.entity.ts`
- `app/services/auth-service/src/groups/dto/create-group.dto.ts`
- `app/services/auth-service/src/groups/dto/update-group.dto.ts`
- `app/services/auth-service/src/groups/dto/group-response.dto.ts`

**Labels**: `backend`, `auth-service`, `entities`

---

### TASK-002-004: Create GroupMember, Invitation, InviteLink Entities

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-002-003

**Requirements**: FR-002, FR-003, FR-004, FR-006  
**Design**: HLD-002 Section 5 (Database Schema)

**Description**: TypeORM entities for member management

**Acceptance Criteria**:

- [ ] Entities created:
  - [ ] `GroupMember.entity.ts` (group, user, role, joinedAt)
  - [ ] `Invitation.entity.ts` (group, inviter, email, role, token, status, expiresAt)
  - [ ] `InviteLink.entity.ts` (group, createdBy, token, defaultRole, maxUses, usesCount, expiresAt, isActive)
  - [ ] `AuditLog.entity.ts` (group, user, action, targetType, targetId, details, ipAddress)
- [ ] Enums created:
  - [ ] `GroupRole` enum (OWNER, ADMIN, MEMBER, VIEWER)
  - [ ] `InvitationStatus` enum (PENDING, ACCEPTED, DECLINED, EXPIRED)
- [ ] Relations defined (ManyToOne to Group, User)
- [ ] DTOs created for all entities
- [ ] Unit tests: DTO validation

**Files**:

- `app/services/auth-service/src/groups/entities/group-member.entity.ts`
- `app/services/auth-service/src/groups/entities/invitation.entity.ts`
- `app/services/auth-service/src/groups/entities/invite-link.entity.ts`
- `app/services/auth-service/src/groups/entities/audit-log.entity.ts`
- `app/services/auth-service/src/groups/enums/group-role.enum.ts`
- `app/services/auth-service/src/groups/enums/invitation-status.enum.ts`

**Labels**: `backend`, `auth-service`, `entities`

---

### TASK-002-005: Implement Groups Service (CRUD)

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: TASK-002-003, TASK-002-004

**Requirements**: FR-001  
**Design**: HLD-002 Section 4.1.1 (Groups Module)

**Description**: Business logic for group management

**Acceptance Criteria**:

- [ ] Service created: `GroupsService`
- [ ] Methods implemented:
  - [ ] `createGroup(userId, dto)` - Create group, user becomes Owner
  - [ ] `getGroupById(groupId, userId)` - Get group details
  - [ ] `updateGroup(groupId, userId, dto)` - Update name/description (Owner/Admin)
  - [ ] `deleteGroup(groupId, userId)` - Delete group (Owner only)
  - [ ] `getUserGroup(userId)` - Get user's current group
- [ ] Business rules enforced:
  - [ ] User can only be in one group (check before create)
  - [ ] Only Owner can delete group
  - [ ] Group name unique check
- [ ] Transactions used for group creation (group + member + audit log)
- [ ] Unit tests: All methods, edge cases (duplicate name, no permission)
- [ ] Test coverage: >90%

**Files**:

- `app/services/auth-service/src/groups/services/groups.service.ts`
- `app/services/auth-service/src/groups/services/groups.service.spec.ts`

**Labels**: `backend`, `auth-service`, `service-layer`

---

### TASK-002-006: Implement Invitations Service

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: TASK-002-004

**Requirements**: FR-002  
**Design**: HLD-002 Section 4.1.2 (Invitations Module)

**Description**: Email invitation logic

**Acceptance Criteria**:

- [ ] Service created: `InvitationsService`
- [ ] Methods implemented:
  - [ ] `sendEmailInvitation(groupId, inviterId, email, role, message?)` - Create invitation, send email
  - [ ] `acceptInvitation(token, userId)` - Join group, update JWT
  - [ ] `declineInvitation(token)` - Mark declined
  - [ ] `cancelInvitation(invitationId, userId)` - Cancel pending (Admin)
  - [ ] `getPendingInvitations(groupId)` - List pending invitations
- [ ] Token generation: `crypto.randomBytes(32).toString('hex')`
- [ ] Expiration: 7 days from creation
- [ ] Status transitions: PENDING → ACCEPTED/DECLINED/EXPIRED
- [ ] Email integration: Queue job (or mock for MVP)
- [ ] Unit tests: All flows, expired token, duplicate email
- [ ] Test coverage: >90%

**Files**:

- `app/services/auth-service/src/groups/services/invitations.service.ts`
- `app/services/auth-service/src/groups/services/invitations.service.spec.ts`

**Labels**: `backend`, `auth-service`, `service-layer`

---

### TASK-002-007: Implement InviteLinks Service

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-002-004

**Requirements**: FR-003  
**Design**: HLD-002 Section 4.1.2 (Invitations Module)

**Description**: Shareable invite link logic

**Acceptance Criteria**:

- [ ] Service created: `InviteLinksService`
- [ ] Methods implemented:
  - [ ] `generateInviteLink(groupId, userId, role, maxUses?)` - Create link
  - [ ] `joinViaInviteLink(token, userId)` - Join via link
  - [ ] `revokeInviteLink(linkId, userId)` - Disable link (Admin)
  - [ ] `getActiveLinks(groupId)` - List active links
- [ ] Token generation: Short alphanumeric (8 chars)
- [ ] Max uses tracking: Increment on each use, disable when reached
- [ ] Expiration: 7 days from creation
- [ ] Unit tests: Max uses, expired link, revoked link
- [ ] Test coverage: >90%

**Files**:

- `app/services/auth-service/src/groups/services/invite-links.service.ts`
- `app/services/auth-service/src/groups/services/invite-links.service.spec.ts`

**Labels**: `backend`, `auth-service`, `service-layer`

---

### TASK-002-008: Implement Members Management Service

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-002-004

**Requirements**: FR-004, FR-006  
**Design**: HLD-002 Section 4.1.3 (Permissions Module)

**Description**: Member CRUD and role management

**Acceptance Criteria**:

- [ ] Service created: `MembersService`
- [ ] Methods implemented:
  - [ ] `getGroupMembers(groupId)` - List all members with roles
  - [ ] `changeRole(groupId, memberId, newRole, userId)` - Update role (Admin)
  - [ ] `removeMember(groupId, memberId, userId)` - Revoke access (Admin)
  - [ ] `registerDirectMember(groupId, userId, email, name, role)` - Direct registration (Admin)
  - [ ] `resetMemberPassword(groupId, memberId, userId)` - Reset password (Admin)
- [ ] Business rules:
  - [ ] Cannot change Owner role
  - [ ] Cannot revoke Owner
  - [ ] Admin cannot remove themselves
- [ ] Audit logging for all sensitive operations
- [ ] Unit tests: All methods, permission checks
- [ ] Test coverage: >90%

**Files**:

- `app/services/auth-service/src/groups/services/members.service.ts`
- `app/services/auth-service/src/groups/services/members.service.spec.ts`

**Labels**: `backend`, `auth-service`, `service-layer`

---

### TASK-002-009: Implement Permission Matrix Service

**Priority**: Critical | **Effort**: 1 day | **Dependencies**: TASK-002-004

**Requirements**: FR-005  
**Design**: HLD-002 Section 4.1.3 (Permissions Module)

**Description**: Permission checking logic

**Acceptance Criteria**:

- [ ] Service created: `PermissionsService`
- [ ] Permission constants defined:
  ```typescript
  export const PERMISSIONS = {
    view_expenses: ['owner', 'admin', 'member', 'viewer'],
    add_expense: ['owner', 'admin', 'member'],
    edit_own_expense: ['owner', 'admin', 'member'],
    edit_any_expense: ['owner', 'admin'],
    delete_own_expense: ['owner', 'admin', 'member'],
    delete_any_expense: ['owner', 'admin'],
    view_members: ['owner', 'admin', 'member', 'viewer'],
    invite_members: ['owner', 'admin'],
    change_roles: ['owner', 'admin'],
    revoke_members: ['owner', 'admin'],
    reset_passwords: ['owner', 'admin'],
    edit_group: ['owner', 'admin'],
    delete_group: ['owner'],
  };
  ```
- [ ] Methods implemented:
  - [ ] `hasPermission(role, permission)` - Check if role has permission
  - [ ] `canEditExpense(role, expenseCreatorId, userId)` - Edit permission check
  - [ ] `canDeleteExpense(role, expenseCreatorId, userId)` - Delete permission check
- [ ] Unit tests: All 16 permission combinations
- [ ] Test coverage: 100% (critical security code)

**Files**:

- `app/services/auth-service/src/groups/services/permissions.service.ts`
- `app/services/auth-service/src/groups/services/permissions.service.spec.ts`
- `app/services/auth-service/src/groups/constants/permissions.constant.ts`

**Labels**: `backend`, `auth-service`, `service-layer`, `security`

---

### TASK-002-010: Create Groups Controller with API Endpoints

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-002-005, TASK-002-006, TASK-002-007, TASK-002-008

**Requirements**: All API-XXX specs in REQ-002  
**Design**: HLD-002 Section 6 (API Endpoints)

**Description**: REST API endpoints for groups

**Acceptance Criteria**:

- [ ] Controller created: `GroupsController`
- [ ] Endpoints implemented:
  - [ ] `POST /groups` - Create group (API-001)
  - [ ] `GET /groups/:id` - Get group details (API-002)
  - [ ] `PATCH /groups/:id` - Update group (API-003)
  - [ ] `DELETE /groups/:id` - Delete group (API-004)
  - [ ] `GET /groups/:id/members` - List members (API-005)
  - [ ] `POST /groups/:id/invitations` - Send email invitation (API-006)
  - [ ] `POST /invitations/:token/accept` - Accept invitation (API-007)
  - [ ] `POST /invitations/:token/decline` - Decline invitation (API-008)
  - [ ] `POST /groups/:id/invite-links` - Generate invite link (API-009)
  - [ ] `POST /invite-links/:token/join` - Join via link (API-010)
  - [ ] `PATCH /groups/:id/members/:memberId` - Change role (API-011)
  - [ ] `DELETE /groups/:id/members/:memberId` - Revoke member (API-012)
  - [ ] `POST /groups/:id/members/:memberId/reset-password` - Reset password (API-013)
- [ ] Guards applied: `@UseGuards(JwtAuthGuard, GroupRoleGuard)`
- [ ] Decorators: `@Roles('owner', 'admin')`, `@GroupContext()`
- [ ] Validation pipes: `@Body(ValidationPipe)`
- [ ] Response formatting: Consistent structure
- [ ] Integration tests: All endpoints (Supertest)
- [ ] Test coverage: 100% of endpoints

**Files**:

- `app/services/auth-service/src/groups/controllers/groups.controller.ts`
- `app/services/auth-service/src/groups/controllers/groups.controller.spec.ts`

**Labels**: `backend`, `auth-service`, `api`, `critical`

---

## Phase 2: API Service Updates (5-6 days) 🔴 CRITICAL

### TASK-002-011: Update JWT Payload with Group Context

**Priority**: Critical | **Effort**: 1 day | **Dependencies**: TASK-002-004

**Requirements**: FR-005  
**Design**: HLD-002 Section 7.1 (JWT Enhancement)

**Description**: Add groupId and role to JWT payload

**Acceptance Criteria**:

- [ ] JWT payload interface updated:
  ```typescript
  interface JwtPayload {
    sub: string; // userId
    email: string;
    name: string;
    groupId: string | null; // NEW
    role: GroupRole | null; // NEW
    iat: number;
    exp: number;
  }
  ```
- [ ] Auth Service: Token generation includes group context
- [ ] Auth Service: Token regenerated on group join, role change, revocation
- [ ] API Service: JWT strategy extracts groupId and role
- [ ] Unit tests: Token generation with/without group
- [ ] Integration tests: Token validation

**Files**:

- `app/services/auth-service/src/auth/interfaces/jwt-payload.interface.ts`
- `app/services/auth-service/src/auth/services/auth.service.ts`
- `app/services/api-service/src/auth/strategies/jwt.strategy.ts`

**Labels**: `backend`, `auth`, `jwt`, `critical`

---

### TASK-002-012: Create RBAC Guard for API Service

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: TASK-002-009, TASK-002-011

**Requirements**: FR-005  
**Design**: HLD-002 Section 4.2.1 (RBAC Guard)

**Description**: Permission enforcement guard for API endpoints

**Acceptance Criteria**:

- [ ] Guard created: `RbacGuard`
- [ ] Decorator created: `@RequirePermission('add_expense')`
- [ ] Guard logic:
  - [ ] Extract groupId and role from JWT
  - [ ] Check if role has required permission
  - [ ] Throw 403 Forbidden if insufficient
- [ ] Special cases:
  - [ ] Users without groups can access single-user mode
  - [ ] Owner bypass for own resources
- [ ] Applied to expense endpoints:
  - [ ] `POST /expenses` → `@RequirePermission('add_expense')`
  - [ ] `PATCH /expenses/:id` → `@RequirePermission('edit_expense')` + ownership check
  - [ ] `DELETE /expenses/:id` → `@RequirePermission('delete_expense')` + ownership check
- [ ] Unit tests: All permission scenarios (16+ tests)
- [ ] Integration tests: 403 responses for violations
- [ ] Test coverage: 100%

**Files**:

- `app/services/api-service/src/auth/guards/rbac.guard.ts`
- `app/services/api-service/src/auth/decorators/require-permission.decorator.ts`
- `app/services/api-service/src/auth/guards/rbac.guard.spec.ts`

**Labels**: `backend`, `api-service`, `security`, `critical`

---

### TASK-002-013: Update Expenses Service for Group Context

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-002-011

**Requirements**: US-009, US-010  
**Design**: HLD-002 Section 4.2.2 (Expenses Filtering)

**Description**: Filter expenses by groupId, add creator attribution

**Acceptance Criteria**:

- [ ] Expense entity updated: Add `createdBy` field (user name)
- [ ] Expenses service methods updated:
  - [ ] `findAll(userId, groupId)` - Filter by group if groupId not null
  - [ ] `create(userId, groupId, dto)` - Include createdBy name
  - [ ] `update(id, userId, groupId, dto)` - Verify group ownership
  - [ ] `delete(id, userId, groupId)` - Verify group ownership
- [ ] Query logic:
  - [ ] If `groupId` is null → single-user mode (filter by userId)
  - [ ] If `groupId` is not null → group mode (filter by groupId)
- [ ] Horizontal privilege escalation prevention (groupId from JWT only)
- [ ] Unit tests: Single-user mode, group mode, permission checks
- [ ] Integration tests: Cross-group access denied
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/expenses/expenses.service.ts`
- `app/services/api-service/src/expenses/expenses.service.spec.ts`

**Labels**: `backend`, `api-service`, `expenses`, `critical`

---

### TASK-002-014: Update Categories Service for Group Context

**Priority**: Medium | **Effort**: 1 day | **Dependencies**: TASK-002-011

**Requirements**: Non-functional requirement (categories shared per group)  
**Design**: HLD-002 Section 4.2.2

**Description**: Filter categories by groupId

**Acceptance Criteria**:

- [ ] Categories service methods updated:
  - [ ] `findAll(userId, groupId)` - Filter by group
  - [ ] `create(userId, groupId, dto)` - Associate with group
- [ ] Query logic: Same as expenses (single-user vs group mode)
- [ ] Unit tests: Group filtering
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/categories/categories.service.ts`
- `app/services/api-service/src/categories/categories.service.spec.ts`

**Labels**: `backend`, `api-service`, `categories`

---

## Phase 3: Frontend UI (12-15 days) 🟡 HIGH

### TASK-002-015: Setup Mock API Infrastructure

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: None

**Requirements**: All Phase 3 tasks  
**Design**: Mock-first development strategy

**Description**: Create mock API layer and fixture data for UI development

**Acceptance Criteria**:

**1. TypeScript Interfaces** (app/frontend/src/types/):

- [ ] `Group.ts`: Group, CreateGroupDto, UpdateGroupDto
- [ ] `GroupMember.ts`: GroupMember, Role enum, PermissionMatrix
- [ ] `Invitation.ts`: Invitation, InvitationStatus, CreateInvitationDto
- [ ] `InviteLink.ts`: InviteLink, CreateInviteLinkDto

**2. Mock Fixture Data** (app/frontend/src/mocks/fixtures/):

- [ ] `groups.fixture.ts`: 2 test groups
  - Family Expenses (4 members: Owner, Admin, Member, Viewer)
  - Work Team (3 members)
- [ ] `members.fixture.ts`: 7 test members with avatars
- [ ] `invitations.fixture.ts`: 5 invitations (pending, accepted, expired, declined)
- [ ] `inviteLinks.fixture.ts`: 3 invite links (single-use, multi-use 3/10, expired)
- [ ] `expenses.fixture.ts`: 15 expenses with `createdBy` field

**3. Mock Service Implementation**:

- [ ] Option A: **Mock Service Worker (MSW)** (Recommended)
  - Install: `npm install -D msw@latest`
  - Create handlers: `app/frontend/src/mocks/handlers/groupHandlers.ts`
  - Setup: `app/frontend/src/mocks/browser.ts`
  - Initialize in main.tsx with conditional check
- [ ] Option B: **Mock Service Classes**
  - `MockGroupService.ts`, `MockInvitationService.ts`
  - Same interface as real services
  - Import based on environment variable

**4. Mock API Endpoints** (MSW Handlers):

- [ ] `GET /api/groups/current` → Returns current user's group
- [ ] `POST /api/groups` → Creates group, returns 201
- [ ] `PATCH /api/groups/:id` → Updates group
- [ ] `DELETE /api/groups/:id` → Deletes group (Owner only)
- [ ] `GET /api/groups/:id/members` → Returns members array
- [ ] `PATCH /api/groups/:id/members/:memberId/role` → Changes role
- [ ] `DELETE /api/groups/:id/members/:memberId` → Removes member
- [ ] `POST /api/invitations` → Sends email invitation
- [ ] `POST /api/invitations/accept/:token` → Accepts invitation
- [ ] `POST /api/invite-links` → Generates shareable link
- [ ] `DELETE /api/invite-links/:id` → Revokes link
- [ ] `GET /api/expenses` → Returns expenses with groupId filter

**5. Realistic Behavior**:

- [ ] Random delays: 200-500ms using `ctx.delay()`
- [ ] Validation errors: Empty names, invalid emails
- [ ] Authorization errors: 403 for insufficient permissions
- [ ] Not found errors: 404 for invalid IDs
- [ ] State persistence: Use in-memory store or sessionStorage

**6. Environment Configuration**:

- [ ] `.env.development`:
  ```
  VITE_USE_MOCK_API=true
  VITE_API_BASE_URL=http://localhost:3002
  ```
- [ ] Conditional initialization in `main.tsx`:
  ```typescript
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
  ```

**7. Documentation**:

- [ ] README: How to toggle mock mode
- [ ] Comments: Explain each handler's behavior
- [ ] Examples: Sample requests/responses

**Files**:

- `app/frontend/src/types/Group.ts`
- `app/frontend/src/types/GroupMember.ts`
- `app/frontend/src/types/Invitation.ts`
- `app/frontend/src/types/InviteLink.ts`
- `app/frontend/src/mocks/fixtures/*.ts` (5 files)
- `app/frontend/src/mocks/handlers/groupHandlers.ts`
- `app/frontend/src/mocks/handlers/invitationHandlers.ts`
- `app/frontend/src/mocks/browser.ts`
- `app/frontend/src/main.tsx` (updated)
- `app/frontend/.env.development`
- `app/frontend/README.md` (updated)

**Labels**: `frontend`, `mocks`, `setup`, `critical`

---

### TASK-002-016: Create Group Management Store (Zustand)

**Priority**: High | **Effort**: 1 day | **Dependencies**: TASK-002-015

**Requirements**: FR-001, FR-006  
**Design**: HLD-002 Section 4.3.1

**Description**: Global state management for groups

**Acceptance Criteria**:

- [ ] Store created: `useGroupStore`
- [ ] State defined:
  ```typescript
  interface GroupState {
    currentGroup: Group | null;
    members: GroupMember[];
    invitations: Invitation[];
    inviteLinks: InviteLink[];
    loading: boolean;
    error: string | null;
  }
  ```
- [ ] Actions defined:
  - [ ] `fetchCurrentGroup()`
  - [ ] `createGroup(dto)`
  - [ ] `updateGroup(id, dto)`
  - [ ] `deleteGroup(id)`
  - [ ] `fetchMembers()`
  - [ ] `changeRole(memberId, role)`
  - [ ] `removeMember(memberId)`
- [ ] **Mock API integration**: Use MSW handlers from TASK-002-015
- [ ] Environment toggle: `import.meta.env.VITE_USE_MOCK_API`
- [ ] Unit tests: Store actions with mocked responses
- [ ] Test coverage: >80%

**Mock Requirements**:

- [ ] Mock data: 1 test group with 4 members (Owner, Admin, Member, Viewer)
- [ ] Mock delays: 200-500ms to simulate network
- [ ] Mock errors: 400 (validation), 403 (forbidden), 404 (not found)

**Files**:

- `app/frontend/src/stores/useGroupStore.ts`
- `app/frontend/src/stores/useGroupStore.test.ts`

**Labels**: `frontend`, `state-management`

---

### TASK-002-017: Create Invitation Store (Zustand)

**Priority**: High | **Effort**: 0.5 days | **Dependencies**: TASK-002-015

**Requirements**: FR-002, FR-003  
**Design**: HLD-002 Section 4.3.1

**Description**: State management for invitations

**Acceptance Criteria**:

- [ ] Store created: `useInvitationStore`
- [ ] State defined: invitations, links, loading, error
- [ ] Actions defined:
  - [ ] `sendEmailInvitation(email, role, message)`
  - [ ] `generateInviteLink(role, maxUses)`
  - [ ] `revokeLink(linkId)`
  - [ ] `fetchInvitations()`
- [ ] **Mock API integration**: Use MSW handlers from TASK-002-015
- [ ] Unit tests: Store actions with mocked responses

**Mock Requirements**:

- [ ] Mock data: 2 pending invitations, 1 accepted, 1 expired
- [ ] Mock invite links: 1 single-use link, 1 multi-use link (3/10 used)

**Files**:

- `app/frontend/src/stores/useInvitationStore.ts`
- `app/frontend/src/stores/useInvitationStore.test.ts`

**Labels**: `frontend`, `state-management`

---

### TASK-002-018: Create Group Creation Dialog Component

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-002-016

**Requirements**: US-001 (FR-001)  
**Design**: HLD-002 Section 4.3.2

**Description**: UI for creating a group

**Acceptance Criteria**:

- [ ] Component created: `GroupCreationDialog.tsx`
- [ ] Form fields:
  - [ ] Group name (required, 3-100 chars)
  - [ ] Description (optional, 0-500 chars)
- [ ] Validation: Real-time validation, error messages
- [ ] Submit: Call `createGroup()` from store
- [ ] Success: Close dialog, show toast, redirect to group dashboard
- [ ] Error handling: Display API errors
- [ ] Accessibility: Keyboard navigation, ARIA labels
- [ ] Component tests: Render, validation, submit
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/components/groups/GroupCreationDialog.tsx`
- `app/frontend/src/components/groups/GroupCreationDialog.test.tsx`

**Labels**: `frontend`, `ui`, `component`

---

### TASK-002-019: Create Members List Table Component

**Priority**: High | **Effort**: 2 days | **Dependencies**: TASK-002-016

**Requirements**: US-006 (FR-006)  
**Design**: HLD-002 Section 4.3.3

**Description**: Display group members with roles

**Acceptance Criteria**:

- [ ] Component created: `MembersListTable.tsx`
- [ ] Columns: Avatar, Name, Email, Role, Joined Date, Actions
- [ ] Actions (conditional):
  - [ ] Change Role (Admin/Owner only)
  - [ ] Remove Member (Admin/Owner only)
  - [ ] Reset Password (Admin/Owner only)
- [ ] Role badge styling: Different colors per role
- [ ] Empty state: "No members yet"
- [ ] Loading state: Skeleton loaders
- [ ] Pagination: If >20 members
- [ ] Component tests: Render, actions, permissions
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/components/groups/MembersListTable.tsx`
- `app/frontend/src/components/groups/MembersListTable.test.tsx`

**Labels**: `frontend`, `ui`, `component`

---

### TASK-002-020: Create Invitation Modal Component

**Priority**: High | **Effort**: 2 days | **Dependencies**: TASK-002-017

**Requirements**: US-002, US-003 (FR-002, FR-003)  
**Design**: HLD-002 Section 4.3.3

**Description**: UI for inviting members (email + link)

**Acceptance Criteria**:

- [ ] Component created: `InvitationModal.tsx`
- [ ] Tabs:
  - [ ] "Email Invitation" tab
  - [ ] "Shareable Link" tab
- [ ] Email tab:
  - [ ] Email input (with validation)
  - [ ] Role selector (Admin, Member, Viewer)
  - [ ] Optional message textarea
  - [ ] "Send Invitation" button
- [ ] Link tab:
  - [ ] Role selector
  - [ ] Max uses input (optional)
  - [ ] "Generate Link" button
  - [ ] Display generated link with copy button
  - [ ] QR code display (optional)
- [ ] Success feedback: Toast notifications
- [ ] Error handling: Display API errors
- [ ] Component tests: Email send, link generation
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/components/groups/InvitationModal.tsx`
- `app/frontend/src/components/groups/InvitationModal.test.tsx`

**Labels**: `frontend`, `ui`, `component`

---

### TASK-002-021: Create Role Change Dialog Component ✅

**Priority**: High | **Effort**: 1 day | **Dependencies**: TASK-002-016

**Requirements**: US-007 (FR-006)  
**Design**: HLD-002 Section 4.3.3

**Description**: UI for changing member role

**Status**: ✅ COMPLETED | **PR**: #133 | **Merged**: Pending

**Acceptance Criteria**:

- [x] Component created: `RoleChangeDialog.tsx`
- [x] Props: `memberId`, `currentRole`, `onConfirm`
- [x] UI elements:
  - [x] Member name display
  - [x] Current role badge
  - [x] New role selector (radio buttons)
  - [x] Confirmation message
  - [x] "Change Role" button
- [x] Validation: Cannot change Owner role (disabled)
- [x] Success: Close dialog, refresh members list, show toast
- [x] Component tests: Render, validation, submit
- [x] Test coverage: >80%

**Files**:

- `app/frontend/src/components/groups/RoleChangeDialog.tsx`
- `app/frontend/src/components/groups/RoleChangeDialog.example.tsx`
- `app/frontend/src/components/groups/RoleChangeDialog.README.md`

**Labels**: `frontend`, `ui`, `component`

---

### TASK-002-022: Create Group Dashboard Page

**Priority**: High | **Effort**: 2 days | **Dependencies**: TASK-002-016, TASK-002-018, TASK-002-019

**Requirements**: US-001, US-006  
**Design**: HLD-002 Section 4.3.2

**Description**: Main group management page

**Acceptance Criteria**:

- [ ] Page created: `GroupDashboard.tsx` (`/group`)
- [ ] Layout sections:
  - [ ] Header: Group name, description, settings button
  - [ ] Stats cards: Total members, Total expenses, Member roles breakdown
  - [ ] Members section: `<MembersListTable />` component
  - [ ] Invitations section: Pending invitations list
- [ ] Actions:
  - [ ] "Invite Member" button (Owner/Admin) → Opens `<InvitationModal />`
  - [ ] "Edit Group" button (Owner/Admin)
  - [ ] "Delete Group" button (Owner only)
- [ ] Empty state: "Create a group to collaborate"
- [ ] Responsive design: Mobile, tablet, desktop
- [ ] Integration tests: Navigation, actions
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/pages/GroupDashboard.tsx`
- `app/frontend/src/pages/GroupDashboard.test.tsx`

**Labels**: `frontend`, `ui`, `page`

---

### TASK-002-023: Update Expense List to Show Creator Attribution

**Priority**: High | **Effort**: 1 day | **Dependencies**: TASK-002-015 (mock expense data)

**Requirements**: US-009  
**Design**: HLD-002 Section 4.3.4

**Description**: Display who created each expense

**Acceptance Criteria**:

- [ ] Expense list item updated:
  - [ ] Add "Created by: [name]" text
  - [ ] Avatar icon next to creator name
- [ ] Styling: Subtle color for creator info
- [ ] Filter: Optional "My Expenses" toggle
- [ ] Component tests: Creator display
- [ ] Test coverage: >80%

**Mock Requirements**:

- [ ] Mock expense data: Include `createdBy` field with user names
- [ ] Mock data: 10 expenses with 4 different creators (matching group members)

**Files**:

- `app/frontend/src/components/expenses/ExpenseListItem.tsx`
- `app/frontend/src/components/expenses/ExpenseListItem.test.tsx`

**Labels**: `frontend`, `ui`, `expenses`

---

### TASK-002-024: Create Invitation Acceptance Page

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-002-017

**Requirements**: US-004 (FR-002, FR-003)  
**Design**: HLD-002 Section 4.3.5

**Description**: Page for accepting email/link invitations

**Acceptance Criteria**:

- [ ] Page created: `InvitationAcceptance.tsx` (`/invitations/:token`)
- [ ] URL parameter: `token` from email or invite link
- [ ] On load:
  - [ ] Fetch invitation details
  - [ ] Display group name, inviter name, role
- [ ] Actions:
  - [ ] "Accept" button → Call `acceptInvitation(token)`
  - [ ] "Decline" button → Call `declineInvitation(token)`
- [ ] Success (Accept): Redirect to group dashboard, show welcome toast
- [ ] Success (Decline): Show confirmation, redirect to home
- [ ] Error states:
  - [ ] Invalid token: "Invitation not found"
  - [ ] Expired token: "This invitation has expired"
  - [ ] Already accepted: "You are already a member"
- [ ] Loading state: Spinner
- [ ] E2E tests: Accept flow, decline flow, error cases
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/pages/InvitationAcceptance.tsx`
- `app/frontend/src/pages/InvitationAcceptance.test.tsx`

**Labels**: `frontend`, `ui`, `page`

---

## Phase 4: Testing & QA (10-12 days) 🟡 HIGH

### TASK-002-025: Write Unit Tests (Backend Services)

**Priority**: High | **Effort**: 3 days | **Dependencies**: Phase 1 tasks

**Requirements**: TEST-002  
**Design**: TEST-002 Section 3 (Test Strategy)

**Description**: Comprehensive unit testing for all services

**Acceptance Criteria**:

- [ ] Coverage targets:
  - [ ] `PermissionsService`: 100% (critical security)
  - [ ] `GroupsService`: >90%
  - [ ] `InvitationsService`: >90%
  - [ ] `InviteLinksService`: >90%
  - [ ] `MembersService`: >90%
- [ ] Test categories:
  - [ ] Happy path tests
  - [ ] Edge cases (empty, boundary, null)
  - [ ] Error cases (validation, permissions)
  - [ ] Business rule enforcement
- [ ] Mocking: Repository methods, external services
- [ ] Total unit tests: 50+ tests
- [ ] All tests passing: ✅

**Files**:

- `app/services/auth-service/src/groups/**/*.spec.ts`

**Labels**: `testing`, `unit-tests`, `backend`

---

### TASK-002-026: Write Integration Tests (API Endpoints)

**Priority**: High | **Effort**: 3 days | **Dependencies**: Phase 1, Phase 2 tasks

**Requirements**: TEST-002  
**Design**: TEST-002 Section 6 (Test Cases)

**Description**: API endpoint testing with Supertest

**Acceptance Criteria**:

- [ ] Coverage: All 15 API endpoints
- [ ] Test scenarios per endpoint:
  - [ ] Happy path (200/201)
  - [ ] Validation errors (400)
  - [ ] Unauthorized (401)
  - [ ] Forbidden (403)
  - [ ] Not found (404)
- [ ] Test fixtures: Create test users, groups, expenses
- [ ] Teardown: Clean database after each test
- [ ] Total integration tests: 45+ tests (3+ per endpoint)
- [ ] All tests passing: ✅

**Files**:

- `tests/integration/groups/groups.spec.ts`
- `tests/integration/groups/invitations.spec.ts`
- `tests/integration/groups/members.spec.ts`

**Labels**: `testing`, `integration-tests`, `backend`

---

### TASK-002-026: Write E2E Tests (Critical User Flows)

**Priority**: High | **Effort**: 4 days | **Dependencies**: Phase 1, Phase 2, Phase 3 tasks

**Requirements**: TEST-002  
**Design**: TEST-002 Sections 6.1-6.8 (Test Cases)

**Description**: End-to-end testing with Playwright

**Acceptance Criteria**:

- [ ] Test suites:
  - [ ] `group-creation.spec.ts` (TC-002-001 to TC-002-010)
  - [ ] `email-invitations.spec.ts` (TC-002-011 to TC-002-020)
  - [ ] `invite-links.spec.ts` (TC-002-021 to TC-002-028)
  - [ ] `member-management.spec.ts` (TC-002-051 to TC-002-058)
  - [ ] `permissions.spec.ts` (TC-002-035 to TC-002-050)
  - [ ] `shared-expenses.spec.ts` (TC-002-059 to TC-002-064)
- [ ] Critical flows:
  - [ ] Owner creates group → Invites member → Member accepts → Views shared expenses
  - [ ] Admin changes role → Permissions updated
  - [ ] Member attempts forbidden action → 403 error
- [ ] Page Object Model: Reusable page objects for groups
- [ ] Test fixtures: Test users, groups
- [ ] Total E2E tests: 20 test suites
- [ ] All tests passing: ✅

**Files**:

- `tests/e2e/groups/group-creation.spec.ts`
- `tests/e2e/groups/email-invitations.spec.ts`
- `tests/e2e/groups/invite-links.spec.ts`
- `tests/e2e/groups/member-management.spec.ts`
- `tests/e2e/groups/permissions.spec.ts`
- `tests/e2e/groups/shared-expenses.spec.ts`

**Labels**: `testing`, `e2e-tests`, `playwright`

---

### TASK-002-028: Security Testing (Manual + Automated)

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: Phase 1, Phase 2 tasks

**Requirements**: TEST-002  
**Design**: TEST-002 Section 6.9 (Security Tests)

**Description**: OWASP Top 10 and authorization testing

**Acceptance Criteria**:

- [ ] Security test cases (TC-002-071 to TC-002-085):
  - [ ] Horizontal privilege escalation (TC-002-071) ✅
  - [ ] Token tampering (TC-002-072, TC-002-073) ✅
  - [ ] IDOR attacks (TC-002-074, TC-002-075) ✅
  - [ ] SQL injection (TC-002-076, TC-002-077) ✅
  - [ ] XSS attacks (TC-002-078, TC-002-079) ✅
  - [ ] CSRF protection (TC-002-080) ✅
  - [ ] Rate limiting (TC-002-081, TC-002-082) ✅
  - [ ] Elevation of privilege (TC-002-083) ✅
- [ ] Automated tests: Integration tests for auth bypass
- [ ] Manual testing: Token tampering, IDOR via Postman/curl
- [ ] npm audit: No vulnerabilities
- [ ] All security tests passing: ✅
- [ ] Security report documented

**Files**:

- `tests/security/groups/authorization.spec.ts`
- `tests/security/groups/injection.spec.ts`
- `docs/qa/test-plans/EXEC-002-security-report.md`

**Labels**: `testing`, `security`, `critical`

---

### TASK-002-029: Performance Testing (Load Tests)

**Priority**: Medium | **Effort**: 2 days | **Dependencies**: Phase 1, Phase 2 tasks

**Requirements**: TEST-002  
**Design**: TEST-002 Section 6.10 (Performance Tests)

**Description**: Load testing with k6

**Acceptance Criteria**:

- [ ] Performance test scenarios:
  - [ ] TC-002-086: Member list query (50 members) <300ms ✅
  - [ ] TC-002-087: Group creation <500ms ✅
  - [ ] TC-002-088: Permission check overhead <50ms ✅
  - [ ] TC-002-089: 100 concurrent group creations (95% success) ✅
- [ ] k6 scripts created:
  - [ ] `member-list-load.k6.js`
  - [ ] `group-creation-load.k6.js`
- [ ] Metrics captured: Response time (p50, p95, p99), error rate, throughput
- [ ] HTML reports generated
- [ ] All performance targets met: ✅

**Files**:

- `tests/performance/groups/member-list-load.k6.js`
- `tests/performance/groups/group-creation-load.k6.js`
- `tests/reports/performance-002.html`

**Labels**: `testing`, `performance`

---

## Task Dependencies Diagram

```
Phase 0: Database
  TASK-002-001 (Migrations) ──┐
  TASK-002-002 (User fields)  │
                              │
Phase 1: Auth Service         │
  TASK-002-003 (Entities) ────┤
  TASK-002-004 (More Entities)│
          │                   │
          ├─ TASK-002-005 (Groups Service)
          ├─ TASK-002-006 (Invitations Service)
          ├─ TASK-002-007 (InviteLinks Service)
          ├─ TASK-002-008 (Members Service)
          ├─ TASK-002-009 (Permissions Service)
          │
          └─ TASK-002-010 (Groups Controller) ──┐
                                                │
Phase 2: API Service                           │
  TASK-002-011 (JWT Update) ───────────────────┤
          │                                     │
          ├─ TASK-002-012 (RBAC Guard)          │
          ├─ TASK-002-013 (Expenses Update)     │
          └─ TASK-002-014 (Categories Update)   │
                                                │
Phase 3: Frontend                              │
  TASK-002-015 (Group Store) ──────────────────┤
  TASK-002-016 (Invitation Store)              │
          │                                     │
          ├─ TASK-002-017 (Group Dialog)        │
          ├─ TASK-002-018 (Members Table)       │
          ├─ TASK-002-019 (Invitation Modal)    │
          ├─ TASK-002-020 (Role Dialog)         │
          ├─ TASK-002-021 (Dashboard Page)      │
          ├─ TASK-002-022 (Expense Updates)     │
          └─ TASK-002-023 (Acceptance Page)     │
                                                │
Phase 4: Testing                               │
  TASK-002-024 (Unit Tests) ───────────────────┤
  TASK-002-025 (Integration Tests)             │
  TASK-002-026 (E2E Tests)                     │
  TASK-002-027 (Security Tests)                │
  TASK-002-028 (Performance Tests) ────────────┘
```

---

## GitHub Issues Template

### Issue Creation Instructions

**How to Create GitHub Issues from Tasks:**

1. Go to [New Issue](https://github.com/uzibiton/automation-interview-pre/issues/new/choose)
2. Use the task template below
3. Add labels: `TASK-002`, phase label (e.g., `phase-0-db`), priority label, tech stack labels
4. Link to parent issue #69 using "Part of #69" in the description
5. Add dependencies using "Depends on #XXX" for blocking tasks

**View Tasks**: [All TASK-002 issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002+)

### Issue Title Format

`[TASK-002-XXX] Short Description`

Examples:

- `[TASK-002-001] Create Database Migrations for Groups Tables`
- `[TASK-002-005] Implement Groups Service (CRUD)`
- `[TASK-002-027] Security Testing (OWASP Top 10)`

### Issue Body Template

```markdown
**Part of**: #69 (Group Management with Role-Based Permissions)

## Task Information

**Task ID**: TASK-002-XXX  
**Priority**: Critical/High/Medium  
**Effort**: X days  
**Phase**: Phase X - [Name]  
**Tracking**: [TASKS-002 Document](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md#task-002-xxx)

## Requirements

- **FR/US**: [List relevant requirements from REQ-002]
- **Design**: [Link to HLD-002 section]

## Description

[Brief description from TASKS-002 document]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] ...

## Dependencies

- **Depends on**: #XXX, #YYY (Tasks that must be completed first)
- **Blocks**: #ZZZ (Tasks that are waiting for this)

## Files to Create/Modify

- `path/to/file1.ts`
- `path/to/file2.ts`

## Testing Requirements

- [ ] Unit tests written (>X% coverage)
- [ ] Integration tests written
- [ ] E2E tests written (if applicable)

## Labels

Add these labels:

- `TASK-002` (required for tracking)
- `phase-X-name` (e.g., `phase-0-db`, `phase-1-auth`, `phase-2-api`, `phase-3-ui`, `phase-4-test`)
- Priority: `priority-critical`, `priority-high`, or `priority-medium`
- Tech stack: `backend`, `frontend`, `database`, `testing`, `security`
- Service: `auth-service`, `api-service`, `frontend`

## Related Documents

- [REQ-002: Requirements](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/product/requirements/REQ-002-group-management.md)
- [HLD-002: Design](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/designs/HLD-002-group-management.md)
- [TEST-002: Test Plan](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/qa/test-plans/TEST-002-group-management.md)
- [TASKS-002: All Tasks](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md)
```

### Example Issue: TASK-002-001

**Title**: `[TASK-002-001] Create Database Migrations for Groups Tables`

**Body**:

```markdown
**Part of**: #69 (Group Management with Role-Based Permissions)

## Task Information

**Task ID**: TASK-002-001  
**Priority**: Critical  
**Effort**: 1.5 days  
**Phase**: Phase 0 - Database Schema  
**Tracking**: [TASKS-002 Document](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md#task-002-001-create-database-migrations)

##Parent Issue\*\*: [#69](https://github.com/uzibiton/automation-interview-pre/issues/69)

**Next Steps**:

1. Create GitHub issues for all 26 tasks using the template above
2. Link dependencies between tasks (use "Depends on #XXX")
3. Link all tasks to parent issue #69 (use "Part of #69")
4. Add appropriate labels for filtering
5. Start with Phase 0 tasks (TASK-002-001, TASK-002-002)

**Track Progress**: [View all TASK-002 issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002+)

- **FR-001**: Group creation and management
- **FR-002**: Email invitation system
- **FR-003**: Shareable invite links
- **FR-004**: Direct member registration
- **FR-006**: Member management
- **Design**: HLD-002 Section 5 (Database Schema)

## Description

Create TypeORM migrations for 5 new tables required for group management functionality: groups, group_members, invitations, invite_links, and audit_log.

## Acceptance Criteria

- [ ] Migration file created: `YYYYMMDDHHMMSS-CreateGroupsTables.ts`
- [ ] Tables created with all required columns:
  - [ ] `groups` (id, name, description, created_by, created_at, updated_at)
  - [ ] `group_members` (id, group_id, user_id, role, joined_at)
  - [ ] `invitations` (id, group_id, inviter_id, email, role, token, status, expires_at, created_at)
  - [ ] `invite_links` (id, group_id, created_by, token, default_role, max_uses, uses_count, expires_at, is_active, created_at)
  - [ ] `audit_log` (id, group_id, user_id, action, target_type, target_id, details, ip_address, created_at)
- [ ] Foreign keys configured with CASCADE deletes
- [ ] All indexes created (8 indexes total)
- [ ] Constraints enforced (UNIQUE, CHECK)
- [ ] Migration tested: up and down

## Dependencies

- **Depends on**: None (First task in Phase 0)
- **Blocks**: #XXX (TASK-002-002), #YYY (TASK-002-003), #ZZZ (TASK-002-004)

## Files to Create/Modify

- `app/services/auth-service/src/migrations/YYYYMMDDHHMMSS-CreateGroupsTables.ts`

## Testing Requirements

- [ ] Migration runs successfully (up)
- [ ] Migration rolls back successfully (down)
- [ ] All constraints and indexes verified

## Labels

`TASK-002`, `phase-0-db`, `priority-critical`, `backend`, `database`, `auth-service`

## Related Documents

- [REQ-002: Requirements](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/product/requirements/REQ-002-group-management.md)
- [HLD-002: Design](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/designs/HLD-002-group-management.md#5-database-schema)
- [TEST-002: Test Plan](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/qa/test-plans/TEST-002-group-management.md)
- [TASKS-002: All Tasks](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md)
```

**Labels to add**: `TASK-002`, `phase-0-db`, `priority-critical`, `backend`, `database`, `auth-service`

```

---

## Implementation Notes

### Critical Path

1. **Phase 0 (Database)** → **Phase 1 (Auth Service)** → **Phase 2 (API Service)** → **Phase 3 (Frontend)** → **Phase 4 (Testing)**
2. Cannot parallelize across phases (strict dependencies)
3. Within phases, some tasks can run in parallel:
   - Phase 1: TASK-002-005 to TASK-002-009 (after entities done)
   - Phase 3: TASK-002-017 to TASK-002-020 (after stores done)

### Risk Mitigation

- **Database migrations**: Test thoroughly in dev before staging
- **JWT changes**: Ensure backward compatibility (graceful degradation)
- **Security**: Complete TASK-002-027 before production deployment
- **Performance**: Run TASK-002-028 on staging with realistic data

### Success Metrics

- [ ] All 26 tasks completed
- [ ] Test coverage: Unit >90%, Integration 100%, E2E 20 flows
- [ ] No critical/high security vulnerabilities
- [ ] Performance targets met (p95 <300ms)
- [ ] Zero production incidents in first 2 weeks

---

## Approval & Sign-Off

| Role         | Name      | Date | Approved |
| ------------ | --------- | ---- | -------- |
| Tech Lead    | Uzi Biton | TBD  | ⬜       |
| QA Lead      | Uzi Biton | TBD  | ⬜       |
| Product Lead | Uzi Biton | TBD  | ⬜       |

---

**Total Implementation Time**: 39-48 days (8-10 weeks)
**Team Size**: 1-2 developers + 1 QA engineer
**Status**: 📝 Ready for Implementation
**Next Step**: Create GitHub issues for Phase 0 tasks
```
