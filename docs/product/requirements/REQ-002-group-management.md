# REQ-002: Group Management with Role-Based Permissions

## Document Information

| Field             | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **ID**            | REQ-002                                                               |
| **Feature**       | Group Management with Role-Based Permissions                          |
| **Role**          | Product Manager / SDET                                                |
| **Name**          | Uzi Biton                                                             |
| **Created**       | 2025-12-21                                                            |
| **Updated**       | 2025-12-21                                                            |
| **Status**        | 📝 Draft                                                              |
| **Priority**      | High                                                                  |
| **Version**       | 1.0                                                                   |
| **Related Issue** | [#69](https://github.com/uzibiton/automation-interview-pre/issues/69) |

## Traceability

| Document Type | ID       | Link                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| **Design**    | HLD-002  | [High-Level Design](../../dev/designs/HLD-002-group-management.md)             |
| **Test Plan** | TEST-002 | [Test Plan](../../qa/test-plans/TEST-002-group-management.md)                  |
| **GitHub**    | #69      | [GitHub Issue](https://github.com/uzibiton/automation-interview-pre/issues/69) |

---

## 1. Executive Summary

Enable multiple users to collaborate on expense tracking within shared groups, with role-based permissions to control member access and group management capabilities. This feature transforms the expense tracker from a single-user application to a collaborative platform for families, roommates, and small teams.

---

## 2. Business Context

### Problem Statement

Currently, the expense tracker is designed for individual users only. Users who want to share expense tracking with family members, roommates, or teams have no way to:

- Share expense visibility across multiple users
- Collaborate on budget tracking
- Delegate expense management responsibilities
- Control who can view or modify expenses

This limits the application's usefulness for common scenarios like family budgeting, roommate expense sharing, and small team expense management.

### Business Goals

- **Goal 1**: Enable collaborative expense tracking for families, roommates, and small teams
- **Goal 2**: Increase user retention by supporting multi-user scenarios
- **Goal 3**: Demonstrate advanced authentication/authorization capabilities for portfolio
- **Goal 4**: Expand market reach to group use cases (estimated 40-60% of potential users)

### Success Metrics

| Metric                       | Target | Measurement Method          |
| ---------------------------- | ------ | --------------------------- |
| Group creation rate          | 25%    | Analytics tracking          |
| Multi-user group adoption    | 15%    | Groups with 2+ active users |
| Invitation acceptance rate   | 60%    | Invites accepted/sent       |
| User retention (group users) | +30%   | 30-day retention comparison |
| Authorization test coverage  | 100%   | Test execution reports      |

---

## 3. Stakeholders

| Role          | Name      | Responsibility             | Contact |
| ------------- | --------- | -------------------------- | ------- |
| Product Owner | Uzi Biton | Feature definition         | -       |
| Tech Lead     | Uzi Biton | Architecture & feasibility | -       |
| SDET Lead     | Uzi Biton | Test strategy & automation | -       |
| UX Designer   | Portfolio | User experience            | -       |

---

## 4. User Stories

### Primary User Stories

#### US-001: Create Group

**As a** registered user  
**I want** to create a new group  
**So that** I can invite others to collaborate on expense tracking

**Acceptance Criteria:**

- [ ] Given logged-in user, when creates group with valid name, then group is created with user as Owner
- [ ] Given logged-in user, when creates group, then group has unique ID and creation timestamp
- [ ] Given logged-in user, when creates group, then user can immediately invite members
- [ ] Given group name >100 characters, when creates group, then validation error displayed
- [ ] Given user already in a group, when creates new group, then error displayed (one group per user for MVP)

**Priority:** High  
**Estimated Effort:** Medium

---

#### US-002: Invite Members via Email

**As a** group Owner/Admin  
**I want** to invite members via email  
**So that** specific people can join my group

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when sends email invitation with valid email, then invitation created and email sent
- [ ] Given invited email, when user clicks link, then directed to accept/decline page
- [ ] Given accepted invitation, when user confirms, then added to group as Member role
- [ ] Given declined invitation, when user declines, then invitation marked as declined
- [ ] Given pending invitation, when Admin cancels, then invitation invalidated

**Priority:** High  
**Estimated Effort:** Large

---

#### US-003: Invite Members via Link

**As a** group Owner/Admin  
**I want** to generate an invite link  
**So that** I can easily share group access with multiple people

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when generates invite link, then unique shareable URL created
- [ ] Given invite link, when user visits URL, then prompted to join group
- [ ] Given invite link, when accepted, then user added to group as Member role
- [ ] Given Owner/Admin, when disables invite link, then link no longer works
- [ ] Given invite link, when expired, then error message displayed

**Priority:** High  
**Estimated Effort:** Medium

---

#### US-004: Register Member Directly

**As a** group Owner/Admin  
**I want** to register a new user directly into my group  
**So that** I can quickly onboard members without waiting for them to sign up

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when registers member with email/name, then new user account created
- [ ] Given newly registered user, when account created, then temporary password generated and emailed
- [ ] Given newly registered user, when first login, then prompted to change password
- [ ] Given duplicate email, when registers member, then error displayed
- [ ] Given registered member, when created, then added to group as Member role

**Priority:** Medium  
**Estimated Effort:** Large

---

#### US-005: View Group Members

**As a** group member  
**I want** to view all members in my group  
**So that** I know who has access to our shared expenses

**Acceptance Criteria:**

- [ ] Given group membership, when views members list, then see all members with their roles
- [ ] Given members list, when displayed, then shows name, email, role, join date
- [ ] Given members list, when displayed, then sorted by role (Owner, Admin, Member, Viewer)
- [ ] Given Owner/Admin role, when views members, then see additional management actions (revoke, change role)
- [ ] Given Member/Viewer role, when views members, then see read-only list

**Priority:** High  
**Estimated Effort:** Small

---

#### US-006: Assign/Change Member Roles

**As a** group Owner/Admin  
**I want** to change a member's role  
**So that** I can grant or restrict permissions as needed

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when changes member role, then role updated immediately
- [ ] Given role change, when completed, then member notified via email
- [ ] Given Owner role, when changes another member to Admin, then both can manage group
- [ ] Given Owner cannot change own role (must transfer ownership)
- [ ] Given role change, when applied, then member's permissions update immediately

**Priority:** High  
**Estimated Effort:** Medium

---

#### US-007: Revoke Group Membership

**As a** group Owner/Admin  
**I want** to remove a member from the group  
**So that** I can control who has access to group expenses

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when revokes membership, then member immediately loses group access
- [ ] Given revoked member, when logs in, then no longer sees group expenses
- [ ] Given revoked member, when notified, then receives email about removal
- [ ] Given Owner cannot revoke own membership (must transfer ownership or delete group)
- [ ] Given Admin cannot revoke Owner membership

**Priority:** High  
**Estimated Effort:** Medium

---

#### US-008: Reset Member Password (Admin)

**As a** group Owner/Admin  
**I want** to reset a member's password  
**So that** I can help members who are locked out

**Acceptance Criteria:**

- [ ] Given Owner/Admin role, when resets member password, then temporary password generated
- [ ] Given password reset, when completed, then member receives email with temp password
- [ ] Given member with temp password, when logs in, then forced to change password
- [ ] Given password reset, when triggered, then audit log entry created
- [ ] Given Owner/Admin cannot reset own password via this method (must use standard forgot password)

**Priority:** Medium  
**Estimated Effort:** Medium

---

#### US-009: View Shared Group Expenses

**As a** group member (any role)  
**I want** to view all expenses in my group  
**So that** I can see our shared spending

**Acceptance Criteria:**

- [ ] Given group membership, when views expenses, then sees all group expenses
- [ ] Given expense list, when displayed, then shows who created each expense
- [ ] Given Viewer role, when views expenses, then cannot edit or delete
- [ ] Given Member role, when views expenses, then can edit/delete own expenses
- [ ] Given Admin/Owner role, when views expenses, then can edit/delete any expense

**Priority:** High  
**Estimated Effort:** Medium

---

#### US-010: Add Expense to Group

**As a** group member (Member, Admin, Owner)  
**I want** to add expenses to my group  
**So that** all members can see our shared spending

**Acceptance Criteria:**

- [ ] Given Member/Admin/Owner role, when adds expense, then expense visible to all group members
- [ ] Given added expense, when saved, then includes creator's identity (created_by field)
- [ ] Given Viewer role, when attempts to add expense, then access denied
- [ ] Given expense creation, when successful, then appears in group expense list immediately
- [ ] Given expense creation, when completed, then audit log entry created

**Priority:** High  
**Estimated Effort:** Small

---

### Edge Cases & Error Scenarios

#### US-ERR-001: Invitation Link Expiration

**As a** user with an expired invite link  
**When** I click the link  
**Then** system should display clear error message and offer to request new invitation

**Acceptance Criteria:**

- [ ] Clear error message: "This invitation has expired"
- [ ] Option to request new invitation from group admin
- [ ] Invitation marked as expired in database
- [ ] No security risk from expired links

---

#### US-ERR-002: Duplicate Group Membership

**As a** user already in a group  
**When** I try to create or join another group  
**Then** system should prevent multiple group memberships with clear error

**Acceptance Criteria:**

- [ ] Clear error message: "You are already a member of a group"
- [ ] Option to leave current group before joining new one
- [ ] No partial state (user must be in exactly 0 or 1 group)
- [ ] Transaction rollback if membership creation fails

---

#### US-ERR-003: Unauthorized Access Attempt

**As a** non-member or insufficient role  
**When** I attempt restricted action  
**Then** system should deny access and log the attempt

**Acceptance Criteria:**

- [ ] HTTP 403 Forbidden response
- [ ] Clear error message about insufficient permissions
- [ ] Audit log entry created with attempt details
- [ ] No data leaked in error response

---

## 5. Functional Requirements

### 5.1 Core Functionality

#### FR-001: Group Creation

**Description:** Registered users can create a new group with a unique name. The creator becomes the group Owner with full permissions.

**Priority:** Must Have  
**Complexity:** Medium

**Inputs:**

- Group name: String, 3-100 characters, required
- Group description: String, optional, max 500 characters

**Processing:**

- Validate user is authenticated
- Validate user is not already in a group
- Generate unique group ID (UUID)
- Create group record with timestamp
- Assign creator as Owner role
- Initialize group settings with defaults

**Outputs:**

- Group object with ID, name, description, created_at
- User's group membership record with Owner role
- Success confirmation

**Business Rules:**

- Group names must be unique per system
- One group per user (MVP limitation)
- Owner role cannot be revoked without transfer
- Group creation requires authentication

**Validation:**

- [ ] Group name: 3-100 characters, alphanumeric and spaces
- [ ] User not already in a group
- [ ] User is authenticated

---

#### FR-002: Email Invitation System

**Description:** Owner and Admin users can invite new members via email. Invited users receive email with acceptance link.

**Priority:** Must Have  
**Complexity:** High

**Inputs:**

- Invitee email address: Valid email format, required
- Role assignment: Member (default) or Viewer
- Personal message: String, optional, max 500 characters

**Processing:**

- Validate sender has Owner or Admin role
- Generate unique invitation token (UUID)
- Create invitation record with expiration (7 days default)
- Send email with invitation link
- Track invitation status (pending, accepted, declined, expired, cancelled)

**Outputs:**

- Invitation object with token, email, status, expires_at
- Email sent to invitee
- Success confirmation to sender

**Business Rules:**

- Invitations expire after 7 days
- One active invitation per email at a time
- Admin/Owner can cancel pending invitations
- Accepted invitation creates group membership
- Email must not be an existing group member

**Validation:**

- [ ] Valid email format
- [ ] Sender has Admin or Owner role
- [ ] Email not already a group member
- [ ] No active invitation for this email exists

---

#### FR-003: Invite Link Generation

**Description:** Owner and Admin users can generate shareable invite links that allow anyone with the link to join the group.

**Priority:** Must Have  
**Complexity:** Medium

**Inputs:**

- Expiration duration: Enum (24h, 7d, 30d, never), default 7d
- Max uses: Integer, optional (null = unlimited)
- Default role: Member or Viewer, default Member

**Processing:**

- Validate user has Owner or Admin role
- Generate unique shareable token (cryptographically secure)
- Create invite link record with settings
- Return shareable URL
- Track link usage count

**Outputs:**

- Invite link URL: `https://app.com/invite/{token}`
- Link metadata (expires_at, max_uses, uses_count)
- QR code (optional future enhancement)

**Business Rules:**

- Links expire based on expiration setting
- Links can be disabled/revoked by Owner/Admin
- Link usage increments counter
- Link reaches max_uses becomes inactive
- Only one active unlimited link per group

**Validation:**

- [ ] User has Owner or Admin role
- [ ] Expiration duration is valid enum value
- [ ] Max uses is positive integer or null

---

#### FR-004: Direct Member Registration

**Description:** Owner and Admin can directly register new users into the group, creating user accounts without requiring self-signup.

**Priority:** Should Have  
**Complexity:** High

**Inputs:**

- Email address: Valid email, required
- Full name: String, 2-100 characters, required
- Role: Member or Viewer, default Member

**Processing:**

- Validate sender has Owner or Admin role
- Check email not already registered
- Generate temporary secure password
- Create user account with temp password flag
- Add user to group with specified role
- Send welcome email with temp password and first-login instructions

**Outputs:**

- User account created
- Group membership created
- Email sent with credentials
- Success confirmation

**Business Rules:**

- Temporary passwords expire after first use
- User must change password on first login
- Email must be unique (not already registered)
- Audit log records who registered whom

**Validation:**

- [ ] Valid email format
- [ ] Email not already registered in system
- [ ] Name 2-100 characters
- [ ] User performing action has Owner/Admin role

---

#### FR-005: Role-Based Access Control

**Description:** System enforces permissions based on user roles within the group.

**Priority:** Must Have  
**Complexity:** High

**Role Permissions Matrix:**

| Action                    | Owner | Admin | Member | Viewer |
| ------------------------- | ----- | ----- | ------ | ------ |
| View group expenses       | ✅    | ✅    | ✅     | ✅     |
| Add new expense           | ✅    | ✅    | ✅     | ❌     |
| Edit own expense          | ✅    | ✅    | ✅     | ❌     |
| Delete own expense        | ✅    | ✅    | ✅     | ❌     |
| Edit any expense          | ✅    | ✅    | ❌     | ❌     |
| Delete any expense        | ✅    | ✅    | ❌     | ❌     |
| View members list         | ✅    | ✅    | ✅     | ✅     |
| Invite members (email)    | ✅    | ✅    | ❌     | ❌     |
| Generate invite link      | ✅    | ✅    | ❌     | ❌     |
| Register members directly | ✅    | ✅    | ❌     | ❌     |
| Change member roles       | ✅    | ✅    | ❌     | ❌     |
| Revoke membership         | ✅    | ✅    | ❌     | ❌     |
| Reset member password     | ✅    | ✅    | ❌     | ❌     |
| Edit group settings       | ✅    | ✅    | ❌     | ❌     |
| Delete group              | ✅    | ❌    | ❌     | ❌     |
| Transfer ownership        | ✅    | ❌    | ❌     | ❌     |
| Leave group               | ❌\*  | ✅    | ✅     | ✅     |

\*Owner must transfer ownership before leaving

**Processing:**

- Every API request validates user's role for the action
- Authorization checked after authentication
- Role stored in group_members table
- Permissions enforced at API layer

**Business Rules:**

- Admin cannot revoke Owner membership
- Owner cannot leave without transferring ownership
- Member can only manage their own expenses
- Viewer is read-only across all features

**Validation:**

- [ ] User authenticated (valid JWT token)
- [ ] User is group member
- [ ] User role has permission for action
- [ ] Action targets are within user's scope

---

#### FR-006: Member Management

**Description:** Owner and Admin can view, manage, and modify group membership and roles.

**Priority:** Must Have  
**Complexity:** Medium

**Inputs:**

- Target member ID: UUID, required
- Action: Enum (change_role, revoke, reset_password)
- New role (for change_role): Enum (Owner, Admin, Member, Viewer)

**Processing:**

- Validate requester has Owner or Admin role
- Validate requester has permission for action
- For change_role: Update member role, send notification
- For revoke: Remove membership, invalidate sessions, send notification
- For reset_password: Generate temp password, send email
- Create audit log entry

**Outputs:**

- Updated membership record (or deleted for revoke)
- Email notification to affected member
- Audit log entry
- Success confirmation

**Business Rules:**

- Admin cannot revoke Owner
- Owner cannot revoke self without transferring ownership
- Role changes take effect immediately
- Revoked members lose all group access instantly

**Validation:**

- [ ] Requester has Owner or Admin role
- [ ] Target member exists in group
- [ ] Action is permitted based on roles
- [ ] Business rules satisfied

---

### 5.2 User Interface Requirements

#### UI-001: Group Creation Screen

**Description:** Interface for creating a new group

**Elements:**

- Group name input field (required)
- Group description textarea (optional)
- Create button
- Cancel button
- Validation error messages

**Interactions:**

- Click Create: Validates inputs, calls API, redirects to group dashboard
- Click Cancel: Returns to previous screen
- Real-time validation on group name
- Loading state during API call

**Wireframe/Mockup:** TBD (HLD phase)

---

#### UI-002: Group Members Management Screen

**Description:** Interface for viewing and managing group members

**Elements:**

- Members list table (name, email, role, join date, actions)
- Invite member button (opens modal)
- Generate invite link button
- Filter/search members input
- Role change dropdown (per member, if authorized)
- Revoke membership button (per member, if authorized)
- Reset password button (per member, if authorized)

**Interactions:**

- Click Invite: Opens invitation modal with tabs (email, link, direct registration)
- Click role dropdown: Shows role options, updates on select
- Click Revoke: Confirmation dialog, then removes member
- Click Reset Password: Confirmation dialog, sends email
- Hover over member row: Highlights row, shows actions

**Wireframe/Mockup:** TBD (HLD phase)

---

#### UI-003: Invitation Modal

**Description:** Multi-tab modal for inviting members

**Elements:**

- Tab navigation (Email, Link, Direct Registration)
- Email tab: Email input, role selector, message textarea, send button
- Link tab: Expiration dropdown, max uses input, generate button, copy link button, QR code display
- Direct Registration tab: Email, name inputs, role selector, register button
- Close button
- Success/error messages

**Interactions:**

- Switch tabs: Shows appropriate form
- Generate link: Calls API, displays link and QR code
- Copy link: Copies to clipboard, shows toast notification
- Send email/register: Validates, calls API, shows success message

**Wireframe/Mockup:** TBD (HLD phase)

---

#### UI-004: Group Settings Screen

**Description:** Interface for managing group settings (Owner/Admin only)

**Elements:**

- Group name input (editable)
- Group description textarea (editable)
- Active invite links list with revoke buttons
- Pending email invitations list with cancel buttons
- Danger zone: Delete group button (Owner only)
- Save changes button

**Interactions:**

- Edit name/description: Enables save button
- Click Save: Updates group, shows success message
- Revoke invite link: Confirmation dialog, disables link
- Cancel invitation: Confirmation dialog, cancels invitation
- Delete group: Strong confirmation dialog, deletes group and redirects

**Wireframe/Mockup:** TBD (HLD phase)

---

### 5.3 API Requirements

#### API-001: Create Group

**Method:** POST  
**Path:** `/api/v1/groups`  
**Auth:** Required (JWT)

**Request:**

```json
{
  "name": "Smith Family Budget",
  "description": "Shared family expenses and budget tracking"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid-v4",
    "name": "Smith Family Budget",
    "description": "Shared family expenses and budget tracking",
    "created_at": "2025-12-21T10:00:00Z",
    "updated_at": "2025-12-21T10:00:00Z",
    "member_count": 1,
    "your_role": "owner"
  }
}
```

**Error Codes:**

- 400: Bad Request - Invalid group name or user already in a group
- 401: Unauthorized - Not authenticated
- 409: Conflict - Group name already exists
- 500: Server Error - Database or system error

---

#### API-002: Invite Member via Email

**Method:** POST  
**Path:** `/api/v1/groups/{groupId}/invitations/email`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:**

```json
{
  "email": "member@example.com",
  "role": "member",
  "message": "Join our family budget tracker!"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "invitation_id": "uuid-v4",
    "email": "member@example.com",
    "role": "member",
    "status": "pending",
    "expires_at": "2025-12-28T10:00:00Z",
    "sent_at": "2025-12-21T10:00:00Z"
  }
}
```

**Error Codes:**

- 400: Bad Request - Invalid email or role
- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions (not Owner/Admin)
- 409: Conflict - Email already a member or has pending invitation
- 500: Server Error - Email service or database error

---

#### API-003: Generate Invite Link

**Method:** POST  
**Path:** `/api/v1/groups/{groupId}/invitations/link`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:**

```json
{
  "expires_in": "7d",
  "max_uses": null,
  "default_role": "member"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "link_id": "uuid-v4",
    "token": "secure-random-token",
    "url": "https://expenses.app/invite/secure-random-token",
    "qr_code": "data:image/png;base64,...",
    "expires_at": "2025-12-28T10:00:00Z",
    "max_uses": null,
    "uses_count": 0,
    "default_role": "member",
    "created_at": "2025-12-21T10:00:00Z"
  }
}
```

**Error Codes:**

- 400: Bad Request - Invalid expiration or max_uses
- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions
- 500: Server Error - Token generation or database error

---

#### API-004: Register Member Directly

**Method:** POST  
**Path:** `/api/v1/groups/{groupId}/members/register`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:**

```json
{
  "email": "newmember@example.com",
  "full_name": "John Doe",
  "role": "member"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "user_id": "uuid-v4",
    "email": "newmember@example.com",
    "full_name": "John Doe",
    "role": "member",
    "temp_password_sent": true,
    "joined_at": "2025-12-21T10:00:00Z"
  }
}
```

**Error Codes:**

- 400: Bad Request - Invalid email or name
- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions
- 409: Conflict - Email already registered
- 500: Server Error - Email service or database error

---

#### API-005: List Group Members

**Method:** GET  
**Path:** `/api/v1/groups/{groupId}/members`  
**Auth:** Required (JWT, any group role)

**Request:** None (query params optional: ?sort=role&order=asc)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "members": [
      {
        "user_id": "uuid-v4",
        "full_name": "Alice Smith",
        "email": "alice@example.com",
        "role": "owner",
        "joined_at": "2025-12-01T10:00:00Z",
        "last_active": "2025-12-21T09:30:00Z"
      },
      {
        "user_id": "uuid-v4",
        "full_name": "Bob Smith",
        "email": "bob@example.com",
        "role": "member",
        "joined_at": "2025-12-15T14:20:00Z",
        "last_active": "2025-12-20T18:00:00Z"
      }
    ],
    "total_count": 2
  }
}
```

**Error Codes:**

- 401: Unauthorized - Not authenticated
- 403: Forbidden - Not a group member
- 404: Not Found - Group doesn't exist
- 500: Server Error - Database error

---

#### API-006: Update Member Role

**Method:** PATCH  
**Path:** `/api/v1/groups/{groupId}/members/{userId}/role`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:**

```json
{
  "role": "admin"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "user_id": "uuid-v4",
    "role": "admin",
    "updated_at": "2025-12-21T10:00:00Z",
    "notification_sent": true
  }
}
```

**Error Codes:**

- 400: Bad Request - Invalid role
- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions or cannot change Owner role
- 404: Not Found - Member not found
- 500: Server Error - Database error

---

#### API-007: Revoke Group Membership

**Method:** DELETE  
**Path:** `/api/v1/groups/{groupId}/members/{userId}`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:** None

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Member removed from group successfully",
  "data": {
    "revoked_user_id": "uuid-v4",
    "revoked_at": "2025-12-21T10:00:00Z",
    "notification_sent": true
  }
}
```

**Error Codes:**

- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions or cannot revoke Owner
- 404: Not Found - Member not found
- 500: Server Error - Database error

---

#### API-008: Reset Member Password

**Method:** POST  
**Path:** `/api/v1/groups/{groupId}/members/{userId}/reset-password`  
**Auth:** Required (JWT, Owner/Admin role)

**Request:** None

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Temporary password sent to member",
  "data": {
    "user_id": "uuid-v4",
    "email_sent": true,
    "reset_at": "2025-12-21T10:00:00Z",
    "temp_password_expires": "2025-12-22T10:00:00Z"
  }
}
```

**Error Codes:**

- 401: Unauthorized - Not authenticated
- 403: Forbidden - Insufficient permissions or cannot reset own password via this endpoint
- 404: Not Found - Member not found
- 500: Server Error - Email service or database error

---

#### API-009: Get Group Expenses (with member context)

**Method:** GET  
**Path:** `/api/v1/groups/{groupId}/expenses`  
**Auth:** Required (JWT, any group role)

**Request:** Query params: ?from=2025-12-01&to=2025-12-31&category=food

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "expenses": [
      {
        "id": "uuid-v4",
        "amount": 45.5,
        "category": "Food",
        "description": "Grocery shopping",
        "date": "2025-12-20",
        "created_by": {
          "user_id": "uuid-v4",
          "full_name": "Alice Smith"
        },
        "created_at": "2025-12-20T15:30:00Z",
        "can_edit": false,
        "can_delete": false
      }
    ],
    "total_count": 1,
    "total_amount": 45.5,
    "your_permissions": {
      "can_add": true,
      "can_edit_own": true,
      "can_edit_any": false,
      "can_delete_any": false
    }
  }
}
```

**Error Codes:**

- 401: Unauthorized - Not authenticated
- 403: Forbidden - Not a group member
- 404: Not Found - Group doesn't exist
- 500: Server Error - Database error

---

## 6. Non-Functional Requirements

### 6.1 Performance

- [ ] Group creation: < 500ms response time
- [ ] Member list retrieval: < 300ms for groups up to 50 members
- [ ] Role permission checks: < 50ms overhead per API request
- [ ] Invitation email delivery: < 5 seconds
- [ ] Concurrent users: Support 100+ simultaneous group operations
- [ ] Database queries: Indexed for group_id and user_id lookups

### 6.2 Security

- [ ] Authentication required: All group endpoints require valid JWT
- [ ] Authorization enforced: Role-based permissions checked on every request
- [ ] Data encryption: All sensitive data encrypted at rest and in transit
- [ ] Input sanitization: Prevent XSS, SQL injection on all inputs
- [ ] Invite tokens: Cryptographically secure random tokens (min 32 bytes entropy)
- [ ] Password requirements: Min 8 chars, complexity rules enforced
- [ ] Temporary passwords: Single-use, expire after 24 hours
- [ ] Rate limiting: 100 requests/minute per user for group operations
- [ ] Audit logging: All permission changes logged with timestamp and actor
- [ ] Session invalidation: Revoked members' sessions terminated immediately

### 6.3 Usability

- [ ] Accessible (WCAG 2.1 Level AA)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Internationalization: English and Hebrew (existing locales)
- [ ] Clear error messages: User-friendly explanations with recovery actions
- [ ] Loading states: Visual feedback for all async operations
- [ ] Success confirmations: Toast notifications for completed actions
- [ ] Help text: Tooltips explaining roles and permissions

### 6.4 Reliability

- [ ] Availability: 99.5% uptime target
- [ ] Error handling: Graceful degradation if email service unavailable
- [ ] Data consistency: ACID transactions for membership changes
- [ ] Rollback capability: Database migrations reversible
- [ ] Backup: Daily automated backups of group and membership data
- [ ] Monitoring: Alerts for failed invitations, permission errors

### 6.5 Maintainability

- [ ] Code documentation: API endpoints documented with OpenAPI/Swagger
- [ ] Automated tests:
  - Unit tests for permission logic (>90% coverage)
  - Integration tests for API endpoints
  - E2E tests for critical flows (invite, accept, permissions)
- [ ] Logging: Structured logs with correlation IDs
- [ ] Monitoring: Metrics for invitation acceptance rate, group creation rate
- [ ] Database migrations: Version-controlled, testable

---

## 7. Data Requirements

### 7.1 Data Model

#### Entity: groups

**Description:** Represents a group that users can join to share expenses

**Attributes:**
| Field | Type | Required | Constraints | Description |
| -------------- | -------- | -------- | ----------------- | ---------------------------- |
| id | UUID | Yes | Primary key | Unique group identifier |
| name | String | Yes | 3-100 chars | Group display name |
| description | Text | No | Max 500 chars | Optional group description |
| created_by | UUID | Yes | FK to users | User who created group |
| created_at | DateTime | Yes | Auto-generated | Group creation timestamp |
| updated_at | DateTime | Yes | Auto-updated | Last modification timestamp |
| is_active | Boolean | Yes | Default true | Soft delete flag |

**Relationships:**

- Has many: group_members
- Has many: expenses
- Has many: invitations
- Belongs to: users (creator)

**Indexes:**

- Primary: id
- Unique: name (case-insensitive)
- Index: created_by, is_active

---

#### Entity: group_members

**Description:** Represents membership relationship between users and groups with role assignment

**Attributes:**
| Field | Type | Required | Constraints | Description |
| ---------- | -------- | -------- | ---------------------------- | ----------------------------- |
| id | UUID | Yes | Primary key | Unique membership identifier |
| group_id | UUID | Yes | FK to groups | Associated group |
| user_id | UUID | Yes | FK to users | Associated user |
| role | Enum | Yes | owner/admin/member/viewer | Member's role and permissions |
| joined_at | DateTime | Yes | Auto-generated | Membership creation timestamp |
| updated_at | DateTime | Yes | Auto-updated | Last role change timestamp |

**Relationships:**

- Belongs to: groups
- Belongs to: users

**Indexes:**

- Primary: id
- Unique: (group_id, user_id) - user can only be in group once
- Index: user_id (for fast user group lookup)
- Index: group_id (for fast member list retrieval)

**Constraints:**

- Exactly one Owner per group (enforced at application layer)
- User can belong to max 1 group (MVP constraint, enforced at application layer)

---

#### Entity: invitations

**Description:** Tracks email-based group invitations

**Attributes:**
| Field | Type | Required | Constraints | Description |
| ----------- | -------- | -------- | ------------------------------------------ | -------------------------- |
| id | UUID | Yes | Primary key | Unique invitation ID |
| group_id | UUID | Yes | FK to groups | Target group |
| inviter_id | UUID | Yes | FK to users | User who sent invitation |
| email | String | Yes | Valid email | Invitee email address |
| role | Enum | Yes | member/viewer | Role to assign on accept |
| token | String | Yes | Unique, secure random | Acceptance token |
| status | Enum | Yes | pending/accepted/declined/expired/canceled | Current invitation status |
| message | Text | No | Max 500 chars | Personal message |
| expires_at | DateTime | Yes | Default +7 days | Expiration timestamp |
| created_at | DateTime | Yes | Auto-generated | Invitation sent timestamp |
| responded_at| DateTime | No | Null until response | Accept/decline timestamp |

**Relationships:**

- Belongs to: groups
- Belongs to: users (inviter)

**Indexes:**

- Primary: id
- Unique: token
- Index: email, status (for checking existing invitations)
- Index: group_id, status
- Index: expires_at (for cleanup jobs)

---

#### Entity: invite_links

**Description:** Tracks shareable invite links for groups

**Attributes:**
| Field | Type | Required | Constraints | Description |
| ------------ | -------- | -------- | ---------------------- | ------------------------------- |
| id | UUID | Yes | Primary key | Unique link ID |
| group_id | UUID | Yes | FK to groups | Target group |
| created_by | UUID | Yes | FK to users | User who created link |
| token | String | Yes | Unique, secure random | URL token |
| default_role | Enum | Yes | member/viewer | Role to assign on join |
| max_uses | Integer | No | Null = unlimited | Maximum number of uses |
| uses_count | Integer | Yes | Default 0 | Current use count |
| expires_at | DateTime | No | Null = never | Expiration timestamp |
| is_active | Boolean | Yes | Default true | Can be disabled by admin |
| created_at | DateTime | Yes | Auto-generated | Link creation timestamp |

**Relationships:**

- Belongs to: groups
- Belongs to: users (creator)

**Indexes:**

- Primary: id
- Unique: token
- Index: group_id, is_active

---

#### Entity: audit_log

**Description:** Tracks all permission-related actions for security and compliance

**Attributes:**
| Field | Type | Required | Constraints | Description |
| ---------- | -------- | -------- | -------------- | ------------------------------ |
| id | UUID | Yes | Primary key | Unique log entry ID |
| group_id | UUID | Yes | FK to groups | Associated group |
| actor_id | UUID | Yes | FK to users | User who performed action |
| target_id | UUID | No | FK to users | User affected by action |
| action | String | Yes | Max 100 chars | Action performed |
| details | JSONB | No | JSON object | Additional action context |
| ip_address | String | No | IPv4/IPv6 | Actor's IP address |
| user_agent | String | No | Max 500 chars | Actor's browser/client |
| created_at | DateTime | Yes | Auto-generated | Action timestamp |

**Relationships:**

- Belongs to: groups
- Belongs to: users (actor)
- Belongs to: users (target, optional)

**Indexes:**

- Primary: id
- Index: group_id, created_at (for audit reports)
- Index: actor_id (for user activity tracking)

**Example Actions:**

- group_created
- member_invited
- member_joined
- role_changed
- member_revoked
- password_reset
- group_deleted

---

### 7.2 Data Migration

- [ ] Migration strategy: New tables, no impact on existing users
- [ ] Existing users: Remain as single-user (not in any group) until they create/join group
- [ ] Expenses: Add group_id column (nullable for backward compatibility)
- [ ] User accounts: No changes to existing auth structure
- [ ] Rollback plan: Drop new tables, remove group_id column from expenses

**Migration Phases:**

1. Create new tables (groups, group_members, invitations, invite_links, audit_log)
2. Add group_id column to expenses table (nullable)
3. Deploy backend with group feature flag (disabled)
4. Test in staging with feature flag enabled
5. Enable feature flag in production for gradual rollout

---

## 8. Integration Requirements

### 8.1 External Systems

#### Integration: Email Service (Existing)

**Purpose:** Send invitation emails, password reset emails, notification emails

**Type:** SMTP / Email API (existing email service in auth-service)

**Data Flow:**

- Direction: Outbound
- Frequency: Real-time (triggered by user actions)
- Volume: Estimated 50-100 emails per day initially

**Authentication:** API Key (existing configuration)

**Error Handling:**

- Retry logic: 3 attempts with exponential backoff
- Fallback: Log failed emails for manual retry, display warning to user
- Queue: Use message queue (future enhancement) for reliability

**Email Templates:**

- Invitation email with accept/decline links
- Welcome email for directly registered members
- Password reset email for admin-initiated resets
- Role change notification
- Membership revocation notification
- Group deletion notification

---

### 8.2 Third-Party Services

- Email service (existing): Invitation and notification delivery
- Future consideration: SMS service for 2FA or SMS invitations

---

## 9. Constraints & Assumptions

### Constraints

**Technical:**

- One group per user (MVP limitation) - enforced at application layer
- PostgreSQL database (existing infrastructure)
- Must integrate with existing auth-service (Google OAuth + JWT)
- Email delivery depends on external service availability

**Business:**

- Timeline: 2-3 months for MVP implementation
- Resources: Solo developer (portfolio project)
- Budget: No additional service costs (use existing email service)

**Legal:**

- GDPR compliance: Users must be able to delete their data (including group membership history)
- Data retention: Audit logs retained for 90 days, then archived

### Assumptions

- Users understand concepts of "groups" and "roles"
- Email is primary communication channel (users have valid email)
- Users accept invitations within 7-day expiration window
- Group sizes will be small (< 20 members) initially
- Admin users are trustworthy (minimal abuse of permissions)

### Dependencies

- [ ] Existing auth-service (Google OAuth + JWT) must support group context in JWT tokens
- [ ] Existing database infrastructure (PostgreSQL)
- [ ] Existing email service configuration
- [ ] Frontend routing and authentication state management

---

## 10. Out of Scope

Explicitly NOT included in this requirement (MVP):

- Multiple groups per user (future Phase 2)
- Expense splitting/settlement calculations (future Phase 2)
- Household budget goals shared across members (future Phase 2)
- Approval workflows for expenses (future Phase 3)
- Activity feed / news feed for group actions (future Phase 3)
- Real-time notifications (WebSocket/push) (future Phase 3)
- File attachments for expenses (existing limitation remains)
- Expense comments/discussions (future Phase 3)
- Sub-groups or nested groups (future Phase 4)
- Public groups or group discovery (future Phase 4)
- Billing/payment integration for premium group features (future Phase 5)
- Mobile app push notifications (future Phase 5)
- Expense recurring rules shared across group (future Phase 2)
- Export/import group data (future Phase 3)

---

## 11. Risks & Mitigation

| Risk                                     | Impact | Probability | Mitigation Strategy                                         |
| ---------------------------------------- | ------ | ----------- | ----------------------------------------------------------- |
| Email delivery failures                  | High   | Medium      | Implement retry queue, log failures, show warnings to users |
| Permission logic bugs causing data leaks | High   | Low         | Comprehensive unit/integration tests, security code review  |
| Complexity of role permissions           | Medium | Medium      | Clear permission matrix, extensive E2E tests for all roles  |
| User confusion about roles               | Medium | Medium      | Clear UI help text, tooltips, onboarding tour               |
| Database performance with large groups   | Medium | Low         | Proper indexing, pagination, query optimization             |
| Existing users resistance to groups      | Low    | Medium      | Feature is opt-in, doesn't affect single-user experience    |
| JWT token size increase with group data  | Low    | Low         | Store minimal group context in JWT (group_id, role only)    |
| Session management after role changes    | High   | Medium      | Invalidate sessions on role change, force token refresh     |
| Spam/abuse of invite links               | Medium | Medium      | Rate limiting, max uses, expiration, admin revocation       |
| Data migration issues                    | High   | Low         | Thorough testing in staging, rollback plan, feature flag    |

---

## 12. Testing Strategy

### Test Coverage

- [x] **Unit tests** for permission logic (>90% coverage required)
  - All role permission combinations
  - Business rule validations (one group per user, Owner cannot leave, etc.)
  - Input validation functions
- [x] **Integration tests** for API endpoints (all endpoints)
  - Happy path for each endpoint
  - Error scenarios (401, 403, 404, 409, 500)
  - Permission enforcement at API layer
- [x] **E2E tests** for critical user flows (Playwright)
  - Create group → Invite member → Accept invitation → View shared expenses
  - Admin changes member role → Member permissions update
  - Owner revokes membership → Member loses access
  - Generate invite link → Share link → New member joins
- [x] **Performance tests** (optional, deferred to HLD phase)
  - Group creation under load (100 concurrent)
  - Member list retrieval with 50 members
  - Permission checks latency
- [x] **Security tests** (critical)
  - Authorization bypass attempts (horizontal privilege escalation)
  - Insecure direct object references (IDOR)
  - SQL injection on text inputs
  - XSS on group name, description
  - CSRF protection on state-changing operations
  - Rate limiting enforcement

### Test Scenarios

High-level test scenarios that must be covered:

1. **Happy path**: Owner creates group → invites member → member accepts → both see shared expenses
2. **Error handling**: Invalid email, expired invitation, unauthorized access attempts
3. **Edge cases**: Group name with special characters, concurrent role changes, revoke during active session
4. **Performance**: 50-member group loads quickly, 100 concurrent group creations
5. **Security**: Cannot access other groups, cannot elevate own role, cannot bypass permissions

**Detailed Test Plan:** [TEST-002-group-management.md](../../qa/test-plans/TEST-002-group-management.md)

---

## 13. Documentation Requirements

- [ ] User documentation: How to create groups, invite members, manage roles (help center articles)
- [ ] API documentation: OpenAPI/Swagger spec for all group endpoints
- [ ] Technical design: [HLD-002](../../dev/designs/HLD-002-group-management.md) (architecture, database schema, API contracts)
- [ ] Deployment guide: Migration scripts, feature flag configuration, rollback procedure
- [ ] Runbook: Common issues, troubleshooting, emergency procedures (e.g., delete group, recover revoked member)

---

## 14. Release Plan

### Rollout Strategy

- [x] **Feature flag**: Groups feature controlled by environment variable (enabled per environment)
- [x] **Phased rollout**:
  - Phase 1: Internal testing (dev team, staging environment)
  - Phase 2: Beta testing (5-10 volunteer users, production with feature flag)
  - Phase 3: General availability (feature flag enabled for all users)
- [x] **Monitoring**: Track group creation rate, invitation acceptance rate, permission errors
- [x] **Feedback collection**: In-app feedback form, GitHub issues

### Rollback Plan

- [x] **Rollback trigger**: Critical bugs (data leaks, permission bypasses), >5% error rate, user complaints
- [x] **Rollback procedure**:
  1. Disable feature flag (groups feature hidden)
  2. Monitor for issues (users can still access existing groups read-only)
  3. Investigate root cause
  4. Fix and re-enable or full rollback (revert code, run reverse migrations)
- [x] **Data considerations**: Groups and memberships remain in database (soft delete), can be restored after fix

---

## 15. Acceptance Criteria Summary

Feature is considered complete when:

- [x] All user stories (US-001 to US-010) implemented and tested
- [x] All functional requirements (FR-001 to FR-006) validated
- [x] All API endpoints (API-001 to API-009) functional with correct error handling
- [x] All UI screens (UI-001 to UI-004) implemented and responsive
- [x] Non-functional requirements met (performance, security, usability)
- [x] Test coverage >90% for unit tests, 100% for E2E critical flows
- [x] Security review passed (no OWASP Top 10 vulnerabilities)
- [x] Documentation completed (user help, API docs, technical design)
- [x] Code reviewed and approved by tech lead
- [x] QA sign-off received (all test plans passed)
- [x] Deployed to production with feature flag (disabled initially)
- [x] Beta testing completed with 5+ users (positive feedback, no critical bugs)
- [x] Feature flag enabled for general availability

---

## 16. Approval

| Role          | Name      | Signature | Date |
| ------------- | --------- | --------- | ---- |
| Product Owner | Uzi Biton |           | TBD  |
| Tech Lead     | Uzi Biton |           | TBD  |
| QA Lead       | Uzi Biton |           | TBD  |

---

## 17. Change Log

| Version | Date       | Author    | Changes                               |
| ------- | ---------- | --------- | ------------------------------------- |
| 1.0     | 2025-12-21 | Uzi Biton | Initial requirements document created |

---

## 18. References

- [GitHub Issue #69](https://github.com/uzibiton/automation-interview-pre/issues/69)
- [HLD-002: Group Management High-Level Design](../../dev/designs/HLD-002-group-management.md)
- [TEST-002: Group Management Test Plan](../../qa/test-plans/TEST-002-group-management.md)
- [Testing Strategy](../../qa/TEST_STRATEGY.md)
- [API Reference](../../dev/API_REFERENCE.md)
- [Application Architecture](../../../app/README.md)
- [Requirements Template](../REQUIREMENTS_TEMPLATE.md)

---

**Document Status**: 📝 Draft - Ready for Review  
**Next Steps**: Create HLD-002 (High-Level Design), TEST-002 (Test Plan), then break down into implementation tasks
