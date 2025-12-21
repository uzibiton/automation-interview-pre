# HLD-002: Group Management with Role-Based Permissions - High-Level Design

## Document Information

| Field                   | Value                                        |
| ----------------------- | -------------------------------------------- |
| **ID**                  | HLD-002                                      |
| **Feature/System Name** | Group Management with Role-Based Permissions |
| **Document Type**       | High-Level Design                            |
| **Role**                | Tech Lead / Software Architect               |
| **Name**                | Uzi Biton                                    |
| **Date Created**        | 2025-12-21                                   |
| **Last Updated**        | 2025-12-21                                   |
| **Status**              | 📝 Draft                                     |
| **Version**             | 1.0                                          |

## Traceability

| Document Type    | ID       | Link                                                                            |
| ---------------- | -------- | ------------------------------------------------------------------------------- |
| **Requirements** | REQ-002  | [Requirements Document](../../product/requirements/REQ-002-group-management.md) |
| **Test Plan**    | TEST-002 | [Test Plan](../../qa/test-plans/TEST-002-group-management.md)                   |
| **GitHub Issue** | #69      | [GitHub Issue](https://github.com/uzibiton/automation-interview-pre/issues/69)  |

---

## 1. Overview

### 1.1 Purpose

Design a multi-user group management system with role-based access control (RBAC) to enable collaborative expense tracking. This system allows multiple users to share expenses within groups while maintaining granular permission control through roles (Owner, Admin, Member, Viewer).

### 1.2 Scope

**In Scope:**

- Group CRUD operations (create, read, update, delete)
- Member invitation system (email, shareable link, direct registration)
- Role-based permission enforcement at API layer
- Group membership management (add, remove, change role)
- JWT token enhancement to include group context
- Database schema for groups, memberships, invitations
- Email notifications for invitations and membership changes
- Audit logging for security-sensitive operations
- UI components for group management

**Out of Scope:**

- Multiple groups per user (MVP limitation)
- Expense splitting/settlement calculations
- Real-time notifications (WebSocket)
- Approval workflows for expenses
- Group discovery or public groups
- Mobile push notifications
- Billing/payment integration

### 1.3 Goals & Objectives

- **Goal 1**: Enable seamless multi-user collaboration on expense tracking
- **Goal 2**: Implement secure, testable role-based permission system
- **Goal 3**: Maintain backward compatibility (single-user experience unchanged)
- **Goal 4**: Demonstrate enterprise-grade authorization patterns for portfolio
- **Goal 5**: Achieve >90% test coverage for permission logic
- **Goal 6**: Support 50+ members per group with <300ms API response time

---

## 2. System Context

### 2.1 Current State

**Existing Architecture:**

- **Frontend**: React + TypeScript (Vite), Material-UI
- **Auth Service** (Port 3001): NestJS, Google OAuth, JWT tokens (24h expiry)
- **API Service** (Port 3002): NestJS, Expense CRUD, AuthGuard for JWT validation
- **Database**: PostgreSQL (local) / Firestore (production)
- **Gateway**: Nginx reverse proxy routing requests

**Current User Flow:**

1. User logs in via Google OAuth → Auth Service generates JWT
2. JWT contains `{ userId, email, name }`
3. Frontend stores JWT, includes in `Authorization: Bearer <token>` header
4. API Service validates JWT via Auth Service `/auth/verify` endpoint
5. API Service filters expenses by `user_id` from JWT
6. Single-user isolation: Users only see their own expenses

**Limitations:**

- No concept of shared expense visibility
- No user collaboration features
- No permission management
- Users are completely isolated

### 2.2 Proposed State

**Enhanced Architecture:**

- **New Service Option 1**: Extend existing Auth Service with group management
- **New Service Option 2**: Create separate Groups Service (recommended for separation of concerns)
- **Database**: Add 5 new tables (groups, group_members, invitations, invite_links, audit_log)
- **JWT Enhancement**: Add `{ groupId, role }` to token payload
- **Email Service**: Existing email infrastructure in Auth Service
- **Permission Middleware**: New RBAC guard in API Service

**Enhanced User Flow:**

1. User creates group → becomes Owner
2. Owner invites members → invitation emails sent
3. Member accepts invitation → added to group with assigned role
4. Member logs in → JWT includes group context
5. API requests include group context → permission check
6. Users see all group expenses with creator attribution

**Key Decision: Service Architecture**

**Option A: Extend Auth Service** (Selected for MVP)

- ✅ Faster implementation (no new service deployment)
- ✅ Reuse existing email infrastructure
- ✅ Single authentication/authorization service
- ❌ Auth Service becomes larger, less single-responsibility
- ❌ Harder to scale group features independently

**Option B: New Groups Service**

- ✅ Better separation of concerns (SRP)
- ✅ Independent scaling of group features
- ✅ Cleaner codebase organization
- ❌ Additional service deployment complexity
- ❌ Additional inter-service communication
- ❌ More infrastructure overhead

**Decision Rationale**: For MVP, extend Auth Service to minimize deployment complexity. Future Phase 2 can extract to separate service if needed.

### 2.3 Stakeholders

| Role          | Name      | Interest/Concern                   |
| ------------- | --------- | ---------------------------------- |
| Product Owner | Uzi Biton | Feature completeness, user value   |
| Tech Lead     | Uzi Biton | Architecture, maintainability      |
| DevOps        | Uzi Biton | Deployment, scalability            |
| QA Lead       | Uzi Biton | Test coverage, security validation |

---

## 3. Architecture Overview

### 3.1 System Architecture Diagram

#### Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx Gateway                        │
│                      (Port 80 - Entry Point)                 │
└───────────────┬─────────────────────────────────────────────┘
                │
    ┌───────────┼───────────┬─────────────────┐
    │           │           │                 │
    ▼           ▼           ▼                 ▼
┌────────┐ ┌─────────┐ ┌──────────┐    ┌──────────┐
│Frontend│ │  Auth   │ │   API    │    │PostgreSQL│
│ React  │ │ Service │ │ Service  │    │ Database │
│ :3000  │ │ :3001   │ │ :3002    │    │ :5432    │
└────────┘ └─────────┘ └──────────┘    └──────────┘
    │           │           │                 │
    └───────────┴───────────┴─────────────────┘
                     │
              ┌──────┴──────┐
              │   Google    │
              │   OAuth     │
              └─────────────┘
```

#### Enhanced Architecture (with Groups)

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx Gateway                        │
│                      (Port 80 - Entry Point)                 │
└───────────────┬─────────────────────────────────────────────┘
                │
    ┌───────────┼───────────┬─────────────────┐
    │           │           │                 │
    ▼           ▼           ▼                 ▼
┌────────┐ ┌─────────┐ ┌──────────┐    ┌──────────┐
│Frontend│ │  Auth   │ │   API    │    │PostgreSQL│
│        │ │ Service │ │ Service  │    │ Database │
│ React  │ │ + Group │ │ + RBAC   │    │          │
│ + Group│ │ Mgmt    │ │ Guard    │    │ + Groups │
│ UI     │ │         │ │          │    │  Tables  │
│ :3000  │ │ :3001   │ │ :3002    │    │ :5432    │
└────┬───┘ └────┬────┘ └────┬─────┘    └──────────┘
     │          │           │                 │
     │          │           │                 │
     └──────────┴───────────┴─────────────────┘
                │                    │
         ┌──────┴──────┐      ┌──────┴──────┐
         │   Google    │      │   Email     │
         │   OAuth     │      │   Service   │
         └─────────────┘      └─────────────┘
                                 (SMTP/API)
```

### 3.2 Component Overview

| Component           | Technology         | Purpose                          | Changes for Groups                     | Scalability |
| ------------------- | ------------------ | -------------------------------- | -------------------------------------- | ----------- |
| Frontend            | React + TypeScript | User interface                   | + Group management UI components       | Horizontal  |
| Auth Service        | NestJS             | Auth + Group management          | + Group module, invitation logic       | Horizontal  |
| API Service         | NestJS             | Business logic + RBAC            | + RBAC guard, group context validation | Horizontal  |
| PostgreSQL Database | PostgreSQL 14+     | Data persistence                 | + 5 new tables, + group_id to expenses | Vertical    |
| Email Service       | SMTP/SendGrid      | Invitation & notification emails | (Existing, reused)                     | N/A         |
| Google OAuth        | External Service   | User authentication              | (No changes)                           | N/A         |

---

## 4. Data Flow

### 4.1 Group Creation Flow

```
┌──────┐                                                    ┌────────────┐
│ User │                                                    │ Database   │
└───┬──┘                                                    └──────┬─────┘
    │ 1. POST /groups {name, description}                        │
    ▼                                                             │
┌─────────┐                                                       │
│Frontend │                                                       │
└────┬────┘                                                       │
     │ 2. Include JWT in Authorization header                    │
     ▼                                                            │
┌──────────┐                                                      │
│Auth      │ 3. Verify JWT, extract user_id                      │
│Service   │ 4. Validate: user not already in group             │
│          │ 5. BEGIN TRANSACTION                                │
│          │ ─────────────────────────────────────────────────► │
│          │ 6. INSERT INTO groups (id, name, created_by)        │
│          │ ◄───────────────────────────────────────────────── │
│          │ 7. INSERT INTO group_members (group_id, user_id, role='owner')
│          │ ─────────────────────────────────────────────────► │
│          │ 8. INSERT INTO audit_log (action='group_created')   │
│          │ ─────────────────────────────────────────────────► │
│          │ 9. COMMIT                                           │
│          │ ◄───────────────────────────────────────────────── │
│          │ 10. Generate new JWT with {groupId, role='owner'}  │
└────┬─────┘                                                      │
     │ 11. Return: {group, new_token}                            │
     ▼                                                            │
┌─────────┐                                                       │
│Frontend │ 12. Store new JWT, redirect to group dashboard       │
└─────────┘                                                       │
```

### 4.2 Email Invitation Flow

```
┌────────┐                                          ┌──────────┐        ┌────────┐
│Owner/  │                                          │Email     │        │Invitee │
│Admin   │                                          │Service   │        │        │
└────┬───┘                                          └─────┬────┘        └────┬───┘
     │ 1. POST /groups/:id/invitations/email             │                  │
     │    {email, role, message}                         │                  │
     ▼                                                    │                  │
┌──────────┐                                              │                  │
│Auth      │ 2. Verify JWT, check Owner/Admin role       │                  │
│Service   │ 3. Check email not already member           │                  │
│          │ 4. Generate secure invitation token         │                  │
│          │ 5. INSERT INTO invitations                  │                  │
│          │    (group_id, email, token, expires_at)     │                  │
│          │ ─────────────────────────────────────────► │                  │
│          │ 6. Send invitation email with link          │                  │
│          │                                              ├─────────────────►│
│          │ ◄───────────────────────────────────────── │ 7. Email received│
└────┬─────┘                                              │                  │
     │ 8. Return success                                 │                  │
     ▼                                                    │                  │
┌────────┐                                                │                  │
│Owner/  │ 9. Confirmation shown                         │                  │
│Admin   │                                                │                  │
└────────┘                                                │                  │
                                                          │                  │
                                                          │    ┌─────────────┘
                                                          │    │ 10. Click link
                                                          │    ▼
                                                          │ ┌─────────┐
                                                          │ │Frontend │
                                                          │ └────┬────┘
                                                          │      │ 11. GET /invite/{token}
                                                          │      ▼
                                                          │ ┌──────────┐
                                                          │ │Auth      │
                                                          │ │Service   │ 12. Verify token, show group info
                                                          │ └────┬─────┘
                                                          │      │ 13. POST /invitations/{token}/accept
                                                          │      ▼
                                                          │ ┌──────────┐
                                                          │ │Auth      │ 14. Add to group_members
                                                          │ │Service   │ 15. Mark invitation accepted
                                                          │ └────┬─────┘ 16. Generate JWT with group context
                                                          │      │ 17. Return new JWT
                                                          │      ▼
                                                          │ ┌─────────┐
                                                          │ │Frontend │ 18. Redirect to group expenses
                                                          │ └─────────┘
```

### 4.3 Permission-Enforced API Request Flow

```
┌──────┐                                                    ┌────────────┐
│Member│                                                    │ Database   │
└───┬──┘                                                    └──────┬─────┘
    │ 1. POST /expenses {amount, category, date}                 │
    ▼                                                             │
┌─────────┐                                                       │
│Frontend │ 2. Include JWT (with groupId, role)                  │
└────┬────┘                                                       │
     │                                                            │
     ▼                                                            │
┌──────────┐                                                      │
│API       │ 3. Extract JWT from Authorization header            │
│Service   │ 4. Validate JWT via Auth Service /auth/verify       │
│          │ ◄───────────────────────────────────────────────   │
│          │ 5. JWT payload: {userId, groupId, role='member'}    │
│          │                                                      │
│          │ 6. RBAC Guard: Check role can add expenses          │
│          │    -> Member role ✅ CAN add expenses               │
│          │                                                      │
│          │ 7. Inject group_id and created_by into request      │
│          │                                                      │
│          │ 8. INSERT INTO expenses                             │
│          │    (group_id, created_by, amount, category, date)   │
│          │ ─────────────────────────────────────────────────► │
│          │ ◄───────────────────────────────────────────────── │
│          │ 9. INSERT INTO audit_log (action='expense_created') │
│          │ ─────────────────────────────────────────────────► │
└────┬─────┘                                                      │
     │ 10. Return created expense                                │
     ▼                                                            │
┌─────────┐                                                       │
│Frontend │ 11. Update expense list                              │
└─────────┘                                                       │
```

### 4.4 Data Flow Description

**Key Flow Characteristics:**

1. **JWT Token Enhancement**: JWT now includes `{ userId, groupId, role }` after user joins group
2. **Dual Validation**: Auth Service validates JWT, API Service validates permissions
3. **Transaction Safety**: Group operations use database transactions for consistency
4. **Audit Trail**: All permission-sensitive operations logged
5. **Invitation Security**: Tokens are cryptographically secure, time-limited, single-use (email) or usage-limited (links)

---

## 5. Component Design

### 5.1 Frontend

**Technology Stack:**

- React 18+
- TypeScript 5+
- Vite (build tool)
- Material-UI (component library)
- React Query (state management)
- React Router v6

**New Components:**

```
src/
├── components/
│   ├── groups/
│   │   ├── GroupCreationDialog.tsx          # Create new group
│   │   ├── GroupSettingsPage.tsx            # Group settings & management
│   │   ├── MembersListTable.tsx             # Display members with actions
│   │   ├── InvitationModal.tsx              # Tabbed invitation modal
│   │   │   ├── EmailInviteTab.tsx           # Email invitation form
│   │   │   ├── LinkInviteTab.tsx            # Generate shareable link
│   │   │   └── DirectRegisterTab.tsx        # Direct member registration
│   │   ├── RoleSelector.tsx                 # Dropdown for role selection
│   │   ├── MemberActionsMenu.tsx            # Member management actions
│   │   └── GroupBadge.tsx                   # Display group info
│   │
│   ├── expenses/
│   │   └── ExpenseList.tsx                  # Enhanced with creator info
│   │
│   └── layout/
│       └── AppBar.tsx                       # Enhanced with group switcher (future)
│
├── contexts/
│   └── GroupContext.tsx                     # Global group state
│
├── hooks/
│   ├── useGroup.ts                          # Group operations
│   ├── useInvitations.ts                    # Invitation management
│   └── usePermissions.ts                    # Permission checks
│
├── services/
│   ├── groupService.ts                      # Group API calls
│   └── invitationService.ts                 # Invitation API calls
│
└── types/
    ├── group.ts                             # Group, Member types
    └── permissions.ts                       # Role, Permission types
```

**State Management:**

**Global State (React Context):**

```typescript
interface GroupContextState {
  currentGroup: Group | null;
  userRole: Role | null;
  permissions: Permissions;
  isLoading: boolean;
  error: Error | null;
}
```

**Server State (React Query):**

- `useGroup(groupId)` - Fetch group details
- `useMembers(groupId)` - Fetch member list
- `useInvitations(groupId)` - Fetch pending invitations
- `useCreateGroup()` - Create group mutation
- `useInviteMember()` - Invite member mutation
- `useUpdateRole()` - Change role mutation
- `useRevokeMember()` - Remove member mutation

**Routing:**

New routes added:

```typescript
<Route path="/groups/create" element={<GroupCreationPage />} />
<Route path="/groups/:id/settings" element={<GroupSettingsPage />} />
<Route path="/invite/:token" element={<AcceptInvitationPage />} />
```

Protected routes enhanced with group permission check:

```typescript
<Route
  path="/expenses"
  element={
    <RequireAuth>
      <RequireGroupMember>
        <ExpensesPage />
      </RequireGroupMember>
    </RequireAuth>
  }
/>
```

**Permission Hooks:**

```typescript
// Check if user has specific permission
const canInviteMembers = usePermission('invite_members');

// Check if user can perform action on resource
const canEditExpense = usePermission('edit_expense', expense);

// Get all permissions for current role
const permissions = usePermissions();
```

---

### 5.2 Backend Services

#### 5.2.1 Auth Service (Enhanced with Group Management)

**New Module Structure:**

```
auth-service/src/
├── groups/
│   ├── groups.module.ts
│   ├── groups.controller.ts              # Group CRUD endpoints
│   ├── groups.service.ts                 # Group business logic
│   ├── group.entity.ts                   # Group entity
│   ├── group-member.entity.ts            # GroupMember entity
│   └── dto/
│       ├── create-group.dto.ts
│       ├── update-group.dto.ts
│       └── add-member.dto.ts
│
├── invitations/
│   ├── invitations.module.ts
│   ├── invitations.controller.ts         # Invitation endpoints
│   ├── invitations.service.ts            # Invitation logic
│   ├── invitation.entity.ts              # Email invitation entity
│   ├── invite-link.entity.ts             # Shareable link entity
│   └── dto/
│       ├── email-invitation.dto.ts
│       ├── link-invitation.dto.ts
│       └── direct-register.dto.ts
│
├── permissions/
│   ├── permissions.service.ts            # Permission check logic
│   ├── roles.enum.ts                     # Role definitions
│   └── permissions.constants.ts          # Permission matrix
│
├── audit/
│   ├── audit.module.ts
│   ├── audit.service.ts                  # Audit logging
│   └── audit-log.entity.ts               # Audit log entity
│
└── email/
    ├── email.module.ts
    ├── email.service.ts                  # Email sending
    └── templates/
        ├── invitation-email.html
        ├── welcome-email.html
        └── role-change-email.html
```

**New Endpoints:**

```typescript
// Groups
POST   /groups                           # Create group (REQ-002 FR-001)
GET    /groups/:id                       # Get group details
PATCH  /groups/:id                       # Update group
DELETE /groups/:id                       # Delete group (Owner only)

// Group Members
GET    /groups/:id/members               # List members (REQ-002 FR-006)
PATCH  /groups/:id/members/:userId/role  # Change role (REQ-002 FR-006)
DELETE /groups/:id/members/:userId       # Revoke membership (REQ-002 FR-006)
POST   /groups/:id/members/:userId/reset-password  # Reset password (REQ-002 FR-006)

// Invitations - Email
POST   /groups/:id/invitations/email     # Send email invitation (REQ-002 FR-002)
GET    /groups/:id/invitations           # List pending invitations
DELETE /invitations/:id                  # Cancel invitation

// Invitations - Link
POST   /groups/:id/invitations/link      # Generate invite link (REQ-002 FR-003)
GET    /groups/:id/invitations/links     # List active links
DELETE /invite-links/:id                 # Revoke invite link

// Invitations - Accept/Decline
GET    /invite/:token                    # Get invitation details (public)
POST   /invite/:token/accept             # Accept invitation (public)
POST   /invite/:token/decline            # Decline invitation (public)

// Direct Registration
POST   /groups/:id/members/register      # Register member directly (REQ-002 FR-004)
```

**Service Logic:**

```typescript
// groups.service.ts
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private membersRepository: Repository<GroupMember>,
    private auditService: AuditService,
  ) {}

  async createGroup(userId: string, dto: CreateGroupDto): Promise<Group> {
    // 1. Check user not already in a group (MVP constraint)
    const existingMembership = await this.membersRepository.findOne({
      where: { userId },
    });
    if (existingMembership) {
      throw new ConflictException('User already belongs to a group');
    }

    // 2. Start transaction
    return await this.groupsRepository.manager.transaction(async (manager) => {
      // 3. Create group
      const group = manager.create(Group, {
        name: dto.name,
        description: dto.description,
        createdBy: userId,
      });
      await manager.save(group);

      // 4. Add creator as Owner
      const membership = manager.create(GroupMember, {
        groupId: group.id,
        userId,
        role: Role.OWNER,
      });
      await manager.save(membership);

      // 5. Audit log
      await this.auditService.log({
        groupId: group.id,
        actorId: userId,
        action: 'group_created',
        details: { groupName: dto.name },
      });

      return group;
    });
  }

  // ... more methods
}
```

```typescript
// invitations.service.ts
@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    private emailService: EmailService,
    private groupsService: GroupsService,
  ) {}

  async sendEmailInvitation(
    groupId: string,
    inviterId: string,
    dto: EmailInvitationDto,
  ): Promise<Invitation> {
    // 1. Verify inviter has permission
    await this.groupsService.checkPermission(groupId, inviterId, 'invite_members');

    // 2. Check email not already member
    const existingMember = await this.membersRepository.findOne({
      where: { email: dto.email },
    });
    if (existingMember) {
      throw new ConflictException('User already a member');
    }

    // 3. Check no pending invitation
    const existingInvitation = await this.invitationsRepository.findOne({
      where: { email: dto.email, status: InvitationStatus.PENDING },
    });
    if (existingInvitation) {
      throw new ConflictException('Invitation already sent');
    }

    // 4. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // 5. Create invitation
    const invitation = this.invitationsRepository.create({
      groupId,
      inviterId,
      email: dto.email,
      role: dto.role || Role.MEMBER,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      message: dto.message,
    });
    await this.invitationsRepository.save(invitation);

    // 6. Send email
    await this.emailService.sendInvitation(invitation);

    return invitation;
  }

  // ... more methods
}
```

**Permission Service:**

```typescript
// permissions.service.ts
@Injectable()
export class PermissionsService {
  private readonly PERMISSION_MATRIX = {
    [Role.OWNER]: [
      'view_expenses',
      'add_expense',
      'edit_own_expense',
      'edit_any_expense',
      'delete_own_expense',
      'delete_any_expense',
      'view_members',
      'invite_members',
      'change_roles',
      'revoke_members',
      'reset_passwords',
      'edit_group',
      'delete_group',
    ],
    [Role.ADMIN]: [
      'view_expenses',
      'add_expense',
      'edit_own_expense',
      'edit_any_expense',
      'delete_own_expense',
      'delete_any_expense',
      'view_members',
      'invite_members',
      'change_roles',
      'revoke_members',
      'reset_passwords',
      'edit_group',
    ],
    [Role.MEMBER]: [
      'view_expenses',
      'add_expense',
      'edit_own_expense',
      'delete_own_expense',
      'view_members',
    ],
    [Role.VIEWER]: ['view_expenses', 'view_members'],
  };

  hasPermission(role: Role, permission: string): boolean {
    return this.PERMISSION_MATRIX[role]?.includes(permission) || false;
  }

  checkPermission(role: Role, permission: string): void {
    if (!this.hasPermission(role, permission)) {
      throw new ForbiddenException(`Role ${role} does not have permission: ${permission}`);
    }
  }

  getUserPermissions(role: Role): string[] {
    return this.PERMISSION_MATRIX[role] || [];
  }
}
```

**JWT Enhancement:**

```typescript
// auth.service.ts
async generateToken(user: User, groupMembership?: GroupMember): Promise<string> {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
  };

  // Add group context if user is in a group
  if (groupMembership) {
    payload.groupId = groupMembership.groupId;
    payload.role = groupMembership.role;
  }

  return this.jwtService.sign(payload, {
    expiresIn: '24h',
  });
}

interface JwtPayload {
  sub: string;         // user_id
  email: string;
  name: string;
  groupId?: string;    // null if user not in group
  role?: Role;         // null if user not in group
}
```

---

#### 5.2.2 API Service (Enhanced with RBAC)

**New Guards:**

```
api-service/src/
└── guards/
    ├── auth.guard.ts              # Existing JWT validation
    ├── rbac.guard.ts              # NEW: Role-based permission check
    └── group-context.guard.ts     # NEW: Ensure request has group context
```

**RBAC Guard Implementation:**

```typescript
// rbac.guard.ts
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get required permission from decorator metadata
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) {
      return true; // No permission required
    }

    // 2. Get user from request (set by AuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user; // { userId, groupId, role }

    if (!user || !user.role) {
      throw new UnauthorizedException('User not in a group');
    }

    // 3. Check permission
    const hasPermission = this.checkPermission(user.role, requiredPermission);
    if (!hasPermission) {
      throw new ForbiddenException(
        `Role ${user.role} does not have permission: ${requiredPermission}`,
      );
    }

    return true;
  }

  private checkPermission(role: Role, permission: string): boolean {
    // Same permission matrix as Auth Service
    const PERMISSION_MATRIX = {
      /* ... */
    };
    return PERMISSION_MATRIX[role]?.includes(permission) || false;
  }
}
```

**Permission Decorator:**

```typescript
// permissions.decorator.ts
export const RequirePermission = (permission: string) => SetMetadata('permission', permission);
```

**Enhanced Expense Endpoints:**

```typescript
// expenses.controller.ts
@Controller('expenses')
@UseGuards(AuthGuard, RbacGuard)
export class ExpensesController {
  @Post()
  @RequirePermission('add_expense') // Member, Admin, Owner
  async create(@Req() req, @Body() dto: CreateExpenseDto) {
    // Inject group_id and created_by from JWT
    return this.expensesService.create({
      ...dto,
      groupId: req.user.groupId,
      createdBy: req.user.userId,
    });
  }

  @Get()
  @RequirePermission('view_expenses') // All roles
  async findAll(@Req() req) {
    // Filter by group_id from JWT
    return this.expensesService.findByGroup(req.user.groupId);
  }

  @Patch(':id')
  @RequirePermission('edit_own_expense') // Member+ (additional check in service)
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @RequirePermission('delete_own_expense') // Member+ (additional check in service)
  async remove(@Req() req, @Param('id') id: string) {
    return this.expensesService.remove(id, req.user);
  }
}
```

**Enhanced Expense Service:**

```typescript
// expenses.service.ts
async update(id: string, dto: UpdateExpenseDto, user: JwtPayload): Promise<Expense> {
  const expense = await this.findOne(id);

  // Check ownership if not Admin/Owner
  if (user.role === Role.MEMBER) {
    if (expense.createdBy !== user.userId) {
      throw new ForbiddenException('You can only edit your own expenses');
    }
  }

  // Admin/Owner can edit any expense
  return this.expensesRepository.save({
    ...expense,
    ...dto,
  });
}
```

---

### 5.3 Database Design

**Database Type**: PostgreSQL 14+ (local/dev), Firestore (production)

#### 5.3.1 New Tables

**Table: groups**

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Indexes
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_is_active ON groups(is_active);
CREATE UNIQUE INDEX idx_groups_name_lower ON groups(LOWER(name));
```

**Table: group_members**

```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_group_user UNIQUE (group_id, user_id),
  CONSTRAINT unique_user_single_group UNIQUE (user_id)  -- MVP: one group per user
);

-- Indexes
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);
```

**Table: invitations**

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'viewer')),
  token VARCHAR(64) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  message TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMP,

  -- Constraints
  CONSTRAINT check_expiration CHECK (expires_at > created_at)
);

-- Indexes
CREATE UNIQUE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email_status ON invitations(email, status);
CREATE INDEX idx_invitations_group_id ON invitations(group_id);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);
```

**Table: invite_links**

```sql
CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(64) NOT NULL UNIQUE,
  default_role VARCHAR(20) NOT NULL CHECK (default_role IN ('member', 'viewer')),
  max_uses INTEGER,  -- NULL = unlimited
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,  -- NULL = never expires
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_invite_links_token ON invite_links(token);
CREATE INDEX idx_invite_links_group_id_active ON invite_links(group_id, is_active);
```

**Table: audit_log**

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  target_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_log_group_id ON audit_log(group_id, created_at DESC);
CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
```

#### 5.3.2 Modified Tables

**Table: expenses (add group context)**

```sql
ALTER TABLE expenses
ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
ADD COLUMN created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT;

-- Migration: For existing expenses, set created_by = user_id, group_id = NULL
UPDATE expenses SET created_by = user_id WHERE created_by IS NULL;

-- Indexes
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
```

**Note**: `group_id` is nullable for backward compatibility. Single-user expenses have `group_id = NULL`. Group expenses have `group_id` set.

---

## 6. API Design

### 6.1 RESTful Principles

- Resource-based URLs (`/groups`, `/invitations`)
- HTTP verbs (GET, POST, PATCH, DELETE)
- Stateless communication
- JSON request/response format
- Consistent error responses

### 6.2 Authentication & Authorization

**Authentication (unchanged):**

- JWT tokens in `Authorization: Bearer <token>` header
- Token expiration: 24 hours
- Validated by Auth Service `/auth/verify` endpoint

**Authorization (new):**

- JWT payload includes `{ groupId, role }`
- API Service uses `RbacGuard` to check permissions
- Permission checks based on role + resource ownership
- Unauthorized: 401, Forbidden: 403

### 6.3 Error Handling

**Standard Error Response:**

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "Role member does not have permission: delete_any_expense",
  "timestamp": "2025-12-21T10:00:00Z",
  "path": "/api/expenses/123"
}
```

**Error Codes:**

- `400` Bad Request: Invalid input (validation failed)
- `401` Unauthorized: No JWT or invalid JWT
- `403` Forbidden: Insufficient permissions
- `404` Not Found: Resource doesn't exist
- `409` Conflict: Business rule violation (e.g., user already in group)
- `500` Internal Server Error: Unexpected error

### 6.4 Pagination

**Query Parameters:**

```
GET /groups/:id/members?page=1&limit=20
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 7. Security Design

### 7.1 Authentication & Authorization

**Multi-Layer Security:**

1. **Network Layer**: HTTPS/TLS for all communications
2. **Authentication Layer**: JWT validation on every request
3. **Authorization Layer**: RBAC guard checks permissions
4. **Data Layer**: Row-level security (group_id filtering)

**JWT Security:**

- Signed with HS256 (HMAC SHA-256)
- Secret key stored in environment variables
- 24-hour expiration (short-lived)
- Refresh token mechanism (existing)
- Tokens regenerated on group join/role change

**Session Management:**

- Revoked members: Sessions invalidated via version increment in `users` table
- Role changes: Force token refresh on next request
- Logout: Token blacklist (optional future enhancement)

### 7.2 Data Security

**Input Validation:**

- DTOs with class-validator decorators
- Email format validation
- SQL injection prevention: Parameterized queries (TypeORM)
- XSS prevention: Output encoding, CSP headers

**Sensitive Data:**

- Passwords: bcrypt hashing (existing)
- Invitation tokens: `crypto.randomBytes(32)` (256-bit entropy)
- Audit logs: Include IP address, user agent for forensics

**Data Access Control:**

- Users can only see their group's data
- API filters by `group_id` from JWT
- Direct object references validated (IDOR prevention)

### 7.3 API Security

**Rate Limiting:**

- 100 requests/minute per user (existing)
- Special limits for invitation endpoints: 20/hour per group

**CORS Configuration:**

- Allowed origins: `process.env.FRONTEND_URL`
- Credentials: true
- Methods: GET, POST, PATCH, DELETE

**Invitation Security:**

- Email tokens: Single-use, 7-day expiration
- Invite links: Usage limits, optional expiration, revocable
- Token length: 64 characters (hex-encoded 32 bytes)

### 7.4 Audit Logging

**Logged Actions:**

- `group_created`, `group_deleted`
- `member_invited`, `member_joined`, `member_revoked`
- `role_changed`, `password_reset`
- `invitation_accepted`, `invitation_declined`
- Failed authorization attempts

**Audit Log Retention:**

- 90 days in active database
- Archived to cold storage after 90 days
- GDPR compliance: Users can request deletion

---

## 8. Performance & Scalability

### 8.1 Performance Requirements

| Operation             | Target Response Time | Notes                       |
| --------------------- | -------------------- | --------------------------- |
| Create group          | < 500ms              | Includes transaction commit |
| List members (50)     | < 300ms              | With pagination             |
| Send email invitation | < 2s                 | Email delivery async        |
| Permission check      | < 50ms               | In-memory permission matrix |
| Get group expenses    | < 500ms              | Indexed by group_id         |
| Generate invite link  | < 200ms              | Token generation is fast    |

### 8.2 Scalability Strategy

**Horizontal Scaling:**

- Auth Service: Stateless, scales to N instances
- API Service: Stateless, scales to N instances
- Load balancer: Nginx or Cloud Run load balancing

**Database Scaling:**

- PostgreSQL: Vertical scaling (larger instance)
- Read replicas for heavy read workloads (future)
- Connection pooling: PgBouncer (future)

**Caching Strategy (future Phase 2):**

- Redis cache for frequently accessed data:
  - Group details: Cache key `group:{id}`, TTL 5 minutes
  - Member list: Cache key `group:{id}:members`, TTL 5 minutes
  - Permission matrix: In-memory (static data)
- Cache invalidation on writes (group updates, member changes)

### 8.3 Database Optimization

**Indexes:**

- All foreign keys indexed (group_id, user_id)
- Composite index: `(group_id, user_id)` on group_members
- Unique index: `LOWER(name)` on groups for case-insensitive uniqueness
- Covering index: `(group_id, status)` on invitations

**Query Optimization:**

- Use `SELECT` with specific columns (avoid `SELECT *`)
- Join optimization: Fetch group with members in single query
- Pagination: `LIMIT` + `OFFSET` with total count caching

**Connection Pooling:**

- TypeORM connection pool: Max 10 connections per service instance
- Connection reuse across requests

---

## 9. Infrastructure & Deployment

### 9.1 Deployment Architecture

**Platform**: Google Cloud Run (serverless containers)

**Services:**

- **auth-service**: 512Mi memory, scales 1-10 instances (min 1 for warm start)
- **api-service**: 512Mi memory, scales 0-10 instances
- **frontend**: 256Mi memory, scales 0-10 instances

**Database:**

- **Local/Dev**: PostgreSQL 14 (Docker container)
- **Production**: Cloud SQL for PostgreSQL OR Firestore

**Container Registry**: Google Container Registry (gcr.io)

### 9.2 Environments

| Environment | Purpose                | URL                          | Database            |
| ----------- | ---------------------- | ---------------------------- | ------------------- |
| Local       | Development            | http://localhost             | PostgreSQL          |
| Staging     | Pre-production testing | https://staging-expenses.app | Cloud SQL/Firestore |
| Production  | Live system            | https://expenses.app         | Cloud SQL/Firestore |

### 9.3 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: Deploy Groups Feature
on:
  push:
    branches: [main]
    paths:
      - 'app/services/auth-service/**'
      - 'app/services/api-service/**'
      - 'app/frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run unit tests (Auth Service groups module)
      - Run unit tests (API Service RBAC guard)
      - Run integration tests (Group API endpoints)
      - Run E2E tests (Playwright - group creation, invitation flows)

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker images (auth-service, api-service, frontend)
      - Push to Google Container Registry
      - Deploy to Cloud Run (auth-service, api-service, frontend)
      - Run smoke tests
      - Notify on failure
```

**Feature Flag:**

```typescript
// Environment variable: ENABLE_GROUPS_FEATURE=true/false
const GROUPS_ENABLED = process.env.ENABLE_GROUPS_FEATURE === 'true';

// In frontend
if (GROUPS_ENABLED) {
  // Show "Create Group" button
}

// In backend
if (!GROUPS_ENABLED) {
  throw new ForbiddenException('Groups feature not enabled');
}
```

### 9.4 Database Migrations

**Migration Strategy:**

1. Create new tables (groups, group_members, invitations, invite_links, audit_log)
2. Add `group_id`, `created_by` columns to expenses (nullable)
3. Deploy backend with feature flag disabled
4. Test in staging
5. Enable feature flag in production

**Migration Scripts:**

```bash
# TypeORM migration
npm run migration:create -- CreateGroupsTables

# Run migration
npm run migration:run

# Rollback if needed
npm run migration:revert
```

**Rollback Plan:**

1. Disable feature flag
2. Revert code deployment
3. Run reverse migration (drop tables, remove columns)
4. Data remains intact for future retry

---

## 10. Monitoring & Observability

### 10.1 Logging

**Structured Logging (JSON format):**

```json
{
  "timestamp": "2025-12-21T10:00:00Z",
  "level": "info",
  "service": "auth-service",
  "correlationId": "abc123",
  "userId": "user-id",
  "groupId": "group-id",
  "action": "group_created",
  "message": "Group created successfully",
  "duration": 120
}
```

**Log Levels:**

- **DEBUG**: Permission checks, detailed flow
- **INFO**: Group creation, member joins, invitations sent
- **WARN**: Expired tokens, rate limit warnings
- **ERROR**: Failed database transactions, email delivery failures

**Correlation IDs**: Track requests across services

### 10.2 Metrics

**Application Metrics:**

- Group creation rate (per hour/day)
- Invitation sent/accepted/declined counts
- Permission denial rate (403 errors)
- API response times (p50, p95, p99)
- Database query times

**Business Metrics:**

- Active groups count
- Average group size
- Invitation acceptance rate
- Role distribution (Owner/Admin/Member/Viewer percentages)

**Infrastructure Metrics:**

- CPU usage per service
- Memory usage per service
- Request count per service
- Error rate (5xx responses)

### 10.3 Alerting

**Critical Alerts:**

- Service down (health check failures)
- High error rate (>5% of requests failing)
- Database connection failures
- Email service unavailable

**Warning Alerts:**

- Slow API responses (p95 > 1s)
- High permission denial rate (>10%)
- Low invitation acceptance rate (<40%)

**Tools:**

- Google Cloud Monitoring (alerts via email/Slack)
- Sentry for error tracking (optional)

---

## 11. Error Handling & Recovery

### 11.1 Error Handling Strategy

**Transaction Rollback:**

- All group operations use database transactions
- Failure at any step rolls back entire operation
- Example: Group creation fails → rollback group + membership

**Graceful Degradation:**

- Email service failure → Queue for retry, show warning to user
- Permission check failure → Deny request, log error
- Database slow → Return 503 Service Unavailable with retry-after header

**Idempotency:**

- Invitation acceptance: Check if already accepted before processing
- Group creation: Use unique constraint on name to prevent duplicates

### 11.2 Disaster Recovery

**Backup Strategy:**

- PostgreSQL: Daily automated backups (retention: 30 days)
- Firestore: Point-in-time recovery (built-in)
- Export audit logs weekly to Cloud Storage

**Recovery Procedures:**

- **Data loss**: Restore from latest backup (RPO: 24 hours)
- **Service outage**: Restart Cloud Run services, check logs
- **Database corruption**: Restore from backup, replay missed transactions

**Recovery Metrics:**

- **RTO** (Recovery Time Objective): < 4 hours
- **RPO** (Recovery Point Objective): < 24 hours

---

## 12. Testing Strategy

### 12.1 Test Levels

**Unit Tests (>90% coverage required):**

- Permission matrix logic (all role × permission combinations)
- Group creation validation
- Invitation token generation
- JWT payload enhancement
- Role change logic

**Integration Tests:**

- Group API endpoints (all CRUD operations)
- Invitation endpoints (email, link, direct register)
- Member management endpoints
- RBAC guard permission checks
- Database transactions

**E2E Tests (Playwright):**

```
Test Suite: Group Management
├── Create Group Flow
│   ├── TC-001: User creates group, becomes Owner
│   ├── TC-002: User tries to create second group, gets error
│   └── TC-003: Group name uniqueness validation
│
├── Email Invitation Flow
│   ├── TC-004: Owner sends invitation
│   ├── TC-005: Invitee accepts invitation, joins as Member
│   ├── TC-006: Invitee declines invitation
│   └── TC-007: Expired invitation shows error
│
├── Invite Link Flow
│   ├── TC-008: Admin generates invite link
│   ├── TC-009: User clicks link, joins group
│   ├── TC-010: Link usage limit enforced
│   └── TC-011: Admin revokes link
│
├── Permission Enforcement
│   ├── TC-012: Member can add expense, sees all group expenses
│   ├── TC-013: Viewer cannot add expense (403)
│   ├── TC-014: Member can edit own expense only
│   ├── TC-015: Admin can edit any expense
│   └── TC-016: Member cannot invite others (403)
│
└── Member Management
    ├── TC-017: Admin changes member role
    ├── TC-018: Admin revokes membership
    ├── TC-019: Owner cannot be revoked
    └── TC-020: Admin resets member password
```

**Security Tests:**

- Authorization bypass attempts (horizontal privilege escalation)
- Insecure direct object references (IDOR) - access other groups
- SQL injection on text inputs (group name, email)
- XSS on group description
- Token tampering (modify role in JWT)

### 12.2 Test Data

**Test Users:**

```sql
-- Owner
INSERT INTO users VALUES ('owner-id', 'owner@test.com', 'Alice Owner', ...);

-- Admin
INSERT INTO users VALUES ('admin-id', 'admin@test.com', 'Bob Admin', ...);

-- Member
INSERT INTO users VALUES ('member-id', 'member@test.com', 'Charlie Member', ...);

-- Viewer
INSERT INTO users VALUES ('viewer-id', 'viewer@test.com', 'Diana Viewer', ...);
```

**Test Group:**

```sql
INSERT INTO groups VALUES ('test-group-id', 'Test Family', 'Our test group', 'owner-id', ...);
INSERT INTO group_members VALUES ('test-group-id', 'owner-id', 'owner', ...);
INSERT INTO group_members VALUES ('test-group-id', 'admin-id', 'admin', ...);
INSERT INTO group_members VALUES ('test-group-id', 'member-id', 'member', ...);
INSERT INTO group_members VALUES ('test-group-id', 'viewer-id', 'viewer', ...);
```

**Detailed Test Plan**: [TEST-002-group-management.md](../../qa/test-plans/TEST-002-group-management.md)

---

## 13. Dependencies

### 13.1 External Dependencies

| Dependency            | Purpose                  | Version   | Critical | Fallback            |
| --------------------- | ------------------------ | --------- | -------- | ------------------- |
| Google OAuth API      | User authentication      | OAuth 2.0 | Yes      | None (blocks login) |
| SMTP Service/SendGrid | Email delivery           | N/A       | No       | Queue for retry     |
| PostgreSQL            | Data persistence (local) | 14+       | Yes      | Firestore           |
| Cloud SQL/Firestore   | Data persistence (prod)  | N/A       | Yes      | None                |

### 13.2 Internal Dependencies

| Service      | Depends On    | Purpose                   |
| ------------ | ------------- | ------------------------- |
| Frontend     | Auth Service  | JWT validation, group API |
| Frontend     | API Service   | Expense CRUD              |
| API Service  | Auth Service  | JWT verification          |
| Auth Service | Database      | Data persistence          |
| Auth Service | Email Service | Invitations               |

### 13.3 Dependency Management

**NPM Packages:**

- Version pinning in `package.json` and `package-lock.json`
- Regular dependency updates (monthly security scan)
- Use `npm audit` in CI/CD pipeline

**Docker Base Images:**

- Use specific versions (not `latest`)
- Example: `node:18-alpine` (not `node:latest`)

---

## 14. Assumptions & Constraints

### 14.1 Assumptions

- Users have stable internet connection
- Users have modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Email delivery is reliable (98% success rate)
- Group sizes remain small (< 50 members) for MVP
- Users understand role concepts (Owner, Admin, Member, Viewer)
- One group per user is sufficient for MVP use cases

### 14.2 Constraints

**Technical:**

- JWT token size: Keep payload small (<1KB) to avoid HTTP header limits
- PostgreSQL local development only (production uses Firestore or Cloud SQL)
- Single-service limitation: Cannot split Auth Service mid-development

**Business:**

- Timeline: 2-3 months for MVP implementation
- Resources: Solo developer (portfolio project)
- Budget: No additional service costs beyond existing infrastructure

**Legal:**

- GDPR compliance: Users can delete their data
- Audit logs retained for 90 days minimum

---

## 15. Risks & Mitigation

| Risk                                      | Impact | Probability | Mitigation Strategy                                                  |
| ----------------------------------------- | ------ | ----------- | -------------------------------------------------------------------- |
| Permission logic bugs causing data leaks  | High   | Medium      | >90% test coverage, security code review, E2E permission tests       |
| Email delivery failures                   | High   | Medium      | Retry queue, log failures, warn users, alternative: copy invite link |
| JWT token size exceeds HTTP header limit  | Medium | Low         | Keep payload minimal (only groupId, role), monitor token size        |
| Database migration failures               | High   | Low         | Test migrations in staging, rollback plan, transaction safety        |
| Session invalidation on role change       | Medium | Medium      | Implement token versioning, force refresh on role change             |
| Abuse of invite links (spam)              | Medium | Medium      | Rate limiting, usage limits, expiration, admin revocation            |
| Performance degradation with large groups | Medium | Low         | Proper indexing, pagination, caching (Phase 2)                       |
| Complexity of RBAC testing                | Low    | High        | Comprehensive test matrix, automated E2E tests for all roles         |

---

## 16. Future Enhancements (Post-MVP)

**Phase 2 (3-6 months):**

- Multiple groups per user (user can switch between groups)
- Expense splitting/settlement calculations
- Group budget goals
- Enhanced audit log UI (activity feed)

**Phase 3 (6-12 months):**

- Real-time notifications (WebSocket)
- Approval workflows for expenses
- Export/import group data (CSV, Excel)
- Mobile app with push notifications

**Phase 4 (12+ months):**

- Public groups or group discovery
- Sub-groups or nested groups
- Advanced reporting (expense trends, category analysis)
- Third-party integrations (bank APIs, accounting software)

---

## 17. Approval

| Role            | Name      | Signature | Date |
| --------------- | --------- | --------- | ---- |
| Tech Lead       | Uzi Biton |           | TBD  |
| DevOps Lead     | Uzi Biton |           | TBD  |
| Security Review | Uzi Biton |           | TBD  |
| QA Lead         | Uzi Biton |           | TBD  |

---

## 18. Change Log

| Version | Date       | Author    | Changes                      |
| ------- | ---------- | --------- | ---------------------------- |
| 1.0     | 2025-12-21 | Uzi Biton | Initial HLD document created |

---

## 19. References

- [REQ-002: Requirements Document](../../product/requirements/REQ-002-group-management.md)
- [TEST-002: Test Plan](../../qa/test-plans/TEST-002-group-management.md)
- [GitHub Issue #69](https://github.com/uzibiton/automation-interview-pre/issues/69)
- [Application Architecture](../../../app/README.md)
- [API Reference](../API_REFERENCE.md)
- [Testing Strategy](../../qa/TEST_STRATEGY.md)

---

**Document Status**: 📝 Draft - Ready for Review  
**Next Steps**: Create TEST-002 (Test Plan), then break down into implementation tasks
