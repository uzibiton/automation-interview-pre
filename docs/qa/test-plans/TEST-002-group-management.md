# TEST-002: Group Management with Role-Based Permissions - Test Plan

## Test Plan Information

| Field               | Value                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| **Test Plan ID**    | TEST-002                                                              |
| **Feature/Release** | Group Management with Role-Based Permissions                          |
| **Role**            | SDET / QA Lead                                                        |
| **Name**            | Uzi Biton                                                             |
| **Date Created**    | 2025-12-21                                                            |
| **Last Updated**    | 2025-12-21                                                            |
| **Status**          | 📝 Draft                                                              |
| **Related Issues**  | [#69](https://github.com/uzibiton/automation-interview-pre/issues/69) |

## Traceability

| Document Type    | ID      | Link                                                                            |
| ---------------- | ------- | ------------------------------------------------------------------------------- |
| **Requirements** | REQ-002 | [Requirements Document](../../product/requirements/REQ-002-group-management.md) |
| **Design**       | HLD-002 | [High-Level Design](../../dev/designs/HLD-002-group-management.md)              |
| **GitHub Issue** | #69     | [GitHub Issue](https://github.com/uzibiton/automation-interview-pre/issues/69)  |

---

## 1. Objective

**Purpose**: Validate that multiple users can collaborate on expense tracking within groups with properly enforced role-based permissions (Owner, Admin, Member, Viewer).

**Goals**:

- ✅ Users can create groups and become Owners
- ✅ Owners/Admins can invite members via email, shareable links, and direct registration
- ✅ All invitation methods work correctly (email accept/decline, link usage, direct registration)
- ✅ Role-based permissions are correctly enforced (16 permission checks across 4 roles)
- ✅ Members can view and add shared expenses with proper creator attribution
- ✅ Admins can manage members (change roles, revoke access, reset passwords)
- ✅ JWT tokens correctly include group context (groupId, role)
- ✅ Audit logging captures all security-sensitive operations
- ✅ System prevents unauthorized access (403 Forbidden) for insufficient permissions
- ✅ Data isolation ensures users only access their group's data

---

## 2. Scope

### In Scope

**Core Functionality:**

- Group creation and deletion (Owner only)
- Member invitation system (3 methods: email, link, direct registration)
- Role-based access control (Owner, Admin, Member, Viewer)
- Permission enforcement at API layer
- Group membership management (add, remove, change role)
- Shared expense viewing with creator attribution
- JWT token enhancement with group context
- Audit logging for security operations

**Test Types:**

- Unit tests for permission logic (>90% coverage target)
- Integration tests for all API endpoints
- E2E tests for critical user flows (Playwright)
- Security tests for authorization bypass attempts
- Performance tests for member list queries
- Negative tests for permission violations
- Boundary tests (empty groups, large groups, edge cases)

**Environments:**

- Local (Docker Compose with PostgreSQL)
- Staging (Cloud Run with Cloud SQL/Firestore)
- Production (Cloud Run with Cloud SQL/Firestore)

### Out of Scope

**Deferred to Future Phases:**

- Multiple groups per user (MVP limitation)
- Expense splitting/settlement calculations
- Real-time notifications (WebSocket)
- Approval workflows for expenses
- Group budget goals
- Activity feed UI
- Export/import group data
- Mobile app push notifications

**Technical Limitations:**

- Performance testing with 1000+ members per group
- Load testing with 1000+ concurrent group operations
- Chaos engineering (database failover, network partitions)

---

## 3. Test Strategy

### Test Coverage Checklist

**Legend**: ✅ Planned | ⬜ Not Needed | ⚠️ Needed but Deferred

#### Functional Testing

- ✅ **Unit Tests** - Permission matrix logic, role validation, business rules
  - **Coverage target**: >90% for permission logic, group service, invitation service
  - **Tools**: Jest (backend NestJS services)
  - **Test cases**: 50+ unit tests covering all permission combinations
  - **Tag**: `@testcase TC-002-XXX` in test descriptions
- ✅ **Integration Tests** - API endpoint validation, database operations
  - **Coverage target**: All 15 new API endpoints
  - **Tools**: Supertest (NestJS integration testing)
  - **Test cases**: 45+ integration tests (3+ per endpoint: happy path, error cases, edge cases)
  - **Tag**: Link to API specs in HLD-002
- ✅ **E2E Tests** - Complete user flows from UI to backend (Playwright)
  - **Coverage target**: 20 critical user journeys
  - **Tools**: Playwright
  - **Test cases**: Create group → Invite → Accept → View expenses → Permission checks
  - **Tag**: `@testcase TC-002-XXX` in test.describe()
- ✅ **Component Tests** - Group management UI components (React Testing Library)
  - **Coverage target**: GroupCreationDialog, MembersListTable, InvitationModal, RoleSelector
  - **Tools**: React Testing Library, Vitest
  - **Test cases**: 25+ component tests for UI logic and interactions
- ⬜ **API/Contract Tests** - Not needed (monolithic services, no external contracts)
- ✅ **Manual Exploratory Tests** - Edge cases, UX validation, cross-role interactions
  - **What to do**: Explore permission boundaries, test unusual role combinations
  - **Document findings**: Create regression test cases for bugs found

#### Non-Functional Testing

- ✅ **Performance Tests** - Member list queries, group creation under load
  - **Metrics**: Response time <300ms for 50 members, <500ms for group creation
  - **Tools**: k6 or Artillery for load testing
  - **Test cases**: 5 performance scenarios
  - **Scenarios**:
    - 50 members list retrieval
    - 100 concurrent group creations
    - 50 concurrent invitation sends
- ✅ **Security Tests** - Authorization bypass, IDOR, injection attacks (CRITICAL)
  - **Checks**: OWASP Top 10, permission bypass, token tampering, horizontal privilege escalation
  - **Tools**: Manual security testing, npm audit, OWASP ZAP (optional)
  - **Test cases**: 15 security test scenarios
  - **Focus**:
    - Horizontal privilege escalation (access other groups)
    - Role elevation attempts (Member → Admin)
    - Token tampering (modify groupId/role in JWT)
    - SQL injection on group name, email inputs
- ⚠️ **Accessibility Tests** - Keyboard navigation, screen reader support (deferred to Phase 2)
  - **Reason**: Accessibility important but not blocking MVP
  - **Future**: WCAG 2.1 Level AA compliance testing
- ⬜ **Visual Regression Tests** - Not critical for MVP (manual UI review sufficient)
- ⚠️ **Reliability Tests** - Chaos engineering, database failover (deferred to Phase 2)
- ✅ **Compatibility Tests** - Browser matrix, responsive design
  - **Coverage**: Chrome, Firefox, Safari, Edge (latest 2 versions)
  - **Devices**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
  - **Test cases**: 12 compatibility scenarios
- ✅ **Usability Tests** - Role clarity, invitation flow UX
  - **Metrics**: Task completion rate, user confusion points
  - **Method**: Observe 5 users: create group, invite member, change role
- ✅ **Localization Tests** - English/Hebrew support, RTL layout
  - **Coverage**: All new UI strings, date/time formats, RTL for Hebrew
  - **Test cases**: 8 localization scenarios

#### Specialized Testing

- ✅ **Mobile Tests** - Responsive design, touch interactions
  - **Devices**: iOS (iPhone 12+), Android (Pixel 5+)
  - **Test cases**: 10 mobile-specific scenarios
- ✅ **Database Tests** - Migration validation, data integrity, transaction safety
  - **What to do**: Run migrations, verify constraints, test rollback
  - **Test cases**: 8 database scenarios
  - **Focus**:
    - Migration creates all 5 tables correctly
    - Foreign key constraints enforced
    - Unique constraints prevent duplicate memberships
    - Transaction rollback on group creation failure
- ✅ **Smoke Tests** - Critical path after deployment (5-minute suite)
  - **What to do**: Run after every deployment to staging/production
  - **Test cases**: 5 smoke tests
  - **Flow**: Login → Create group → Invite member → View shared expense
- ✅ **Regression Tests** - Verify existing features still work
  - **Coverage**: Expense CRUD, categories, authentication, single-user mode
  - **Test cases**: Re-run existing E2E suite (40+ tests)
- ✅ **Boundary Tests** - Edge cases, empty states, limits
  - **Test cases**: 15 boundary scenarios
  - **Examples**:
    - Empty group (0 members)
    - Single member group
    - 50 member group (performance boundary)
    - Expired invitation tokens
    - Invite link max uses reached
- ✅ **Negative Tests** - Invalid inputs, permission violations, error handling
  - **Test cases**: 25 negative scenarios
  - **Examples**:
    - Viewer tries to add expense (403)
    - Member tries to invite others (403)
    - Invalid email format
    - Duplicate group name
    - User already in group

#### Static Analysis Testing

- ✅ **Code Quality Checks** - ESLint, Prettier, SonarQube
  - **Pass criteria**: 0 linting errors, complexity score <10
  - **Run**: Pre-commit hooks, CI/CD pipeline
- ✅ **Type Safety** - TypeScript strict mode
  - **Pass criteria**: 0 TypeScript errors
  - **Run**: `tsc --noEmit` in CI/CD

**Coverage Summary:**

- **Implemented**: 18 test categories (75%)
- **Planned**: 18 test categories (all functional/security critical)
- **Deferred**: 2 test categories (12.5%) - Accessibility, Reliability
- **Not Needed**: 2 test categories (12.5%)
- **Critical Focus**: Security tests (authorization), E2E flows, Unit tests (permission logic)

---

## 4. Entry Criteria

- [ ] Feature implemented (Auth Service groups module, API Service RBAC guard)
- [ ] Database migrations completed (5 new tables created)
- [ ] Test environments configured (local, staging)
- [ ] Test data prepared (5 test users with different roles)
- [ ] E2E test infrastructure updated (Playwright fixtures for groups)
- [ ] Test user accounts created:
  - `owner@test.local` (Owner role)
  - `admin@test.local` (Admin role)
  - `member@test.local` (Member role)
  - `viewer@test.local` (Viewer role)
  - `unassigned@test.local` (No group)

---

## 5. Exit Criteria

- [ ] All high-priority test cases executed (pass rate ≥95%)
- [ ] No critical or high-severity bugs open
- [ ] Test coverage targets met:
  - Unit tests: ≥90% coverage for permission logic
  - Integration tests: 100% of API endpoints tested
  - E2E tests: All 20 critical flows passing
- [ ] Security tests passed (no OWASP Top 10 vulnerabilities, no permission bypass)
- [ ] Performance targets met (<300ms member list, <500ms group creation)
- [ ] Regression tests passed (no impact on existing features)
- [ ] Documentation updated (test results, known issues)
- [ ] Sign-off from QA Lead and Tech Lead

---

## 6. Test Cases Summary

### 6.1 Group Management (10 test cases)

| TC ID      | Priority | Title                           | Description                                 | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------- | ------------------------------------------- | ------------ | ---- | ------ |
| TC-002-001 | High     | Create Group as New User        | User creates group, becomes Owner           | FR-001       | ✅   | ✅     |
| TC-002-002 | High     | Group Name Uniqueness           | Duplicate group name rejected               | FR-001       | ✅   | ✅     |
| TC-002-003 | Medium   | Group Name Validation           | Group name 3-100 chars validation           | FR-001       | ✅   | ✅     |
| TC-002-004 | High     | One Group Per User (MVP)        | User in group cannot create another         | FR-001       | ✅   | ✅     |
| TC-002-005 | High     | Owner Views Group Members       | Owner sees all members with roles           | FR-006       | ✅   | ✅     |
| TC-002-006 | High     | Admin Views Group Members       | Admin sees all members (same as Owner view) | FR-006       | ✅   | ✅     |
| TC-002-007 | Medium   | Member Views Group Members      | Member sees read-only member list           | FR-006       | ✅   | ✅     |
| TC-002-008 | High     | Delete Group (Owner Only)       | Owner deletes group, all members removed    | FR-001       | ✅   | ⬜     |
| TC-002-009 | High     | Delete Group Denied (Non-Owner) | Admin/Member cannot delete group (403)      | FR-001       | ✅   | ⬜     |
| TC-002-010 | Low      | Group Description Optional      | Group can be created without description    | FR-001       | ✅   | ⬜     |

### 6.2 Email Invitation System (10 test cases)

| TC ID      | Priority | Title                               | Description                                     | Requirements | Auto | Manual |
| ---------- | -------- | ----------------------------------- | ----------------------------------------------- | ------------ | ---- | ------ |
| TC-002-011 | High     | Owner Sends Email Invitation        | Owner invites member, email sent                | FR-002       | ✅   | ✅     |
| TC-002-012 | High     | Admin Sends Email Invitation        | Admin invites member, email sent                | FR-002       | ✅   | ✅     |
| TC-002-013 | High     | Invitee Accepts Invitation          | User clicks link, joins as Member               | FR-002       | ✅   | ✅     |
| TC-002-014 | High     | Invitee Declines Invitation         | User clicks decline, invitation marked declined | FR-002       | ✅   | ✅     |
| TC-002-015 | High     | Expired Invitation Error            | User clicks expired link, error shown           | FR-002       | ✅   | ✅     |
| TC-002-016 | Medium   | Duplicate Email Invitation Rejected | Cannot invite email already invited             | FR-002       | ✅   | ⬜     |
| TC-002-017 | High     | Member Cannot Send Invitation (403) | Member tries to invite, gets 403                | FR-002       | ✅   | ✅     |
| TC-002-018 | High     | Viewer Cannot Send Invitation (403) | Viewer tries to invite, gets 403                | FR-002       | ✅   | ⬜     |
| TC-002-019 | Medium   | Invitation with Personal Message    | Message included in email                       | FR-002       | ✅   | ✅     |
| TC-002-020 | Medium   | Cancel Pending Invitation           | Admin cancels invitation, token invalidated     | FR-002       | ✅   | ⬜     |

### 6.3 Invite Link System (8 test cases)

| TC ID      | Priority | Title                         | Description                               | Requirements | Auto | Manual |
| ---------- | -------- | ----------------------------- | ----------------------------------------- | ------------ | ---- | ------ |
| TC-002-021 | High     | Admin Generates Invite Link   | Admin creates link with 7-day expiration  | FR-003       | ✅   | ✅     |
| TC-002-022 | High     | User Joins via Invite Link    | User clicks link, joins as Member         | FR-003       | ✅   | ✅     |
| TC-002-023 | High     | Invite Link Max Uses Enforced | Link disabled after max uses reached      | FR-003       | ✅   | ✅     |
| TC-002-024 | High     | Expired Invite Link Error     | Expired link shows error message          | FR-003       | ✅   | ✅     |
| TC-002-025 | High     | Admin Revokes Invite Link     | Admin disables link, subsequent uses fail | FR-003       | ✅   | ✅     |
| TC-002-026 | Medium   | Invite Link with Viewer Role  | Link created with default Viewer role     | FR-003       | ✅   | ⬜     |
| TC-002-027 | High     | Member Cannot Generate Link   | Member tries to generate link, gets 403   | FR-003       | ✅   | ✅     |
| TC-002-028 | Low      | QR Code Generated for Link    | QR code displayed for easy sharing        | FR-003       | ⬜   | ✅     |

### 6.4 Direct Member Registration (6 test cases)

| TC ID      | Priority | Title                                 | Description                                | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------------- | ------------------------------------------ | ------------ | ---- | ------ |
| TC-002-029 | High     | Admin Registers Member Directly       | Admin creates user account, adds to group  | FR-004       | ✅   | ✅     |
| TC-002-030 | High     | Temp Password Email Sent              | New user receives email with temp password | FR-004       | ✅   | ✅     |
| TC-002-031 | High     | First Login Forces Password Change    | User with temp password must change it     | FR-004       | ✅   | ✅     |
| TC-002-032 | High     | Duplicate Email Registration Rejected | Cannot register email that exists          | FR-004       | ✅   | ⬜     |
| TC-002-033 | High     | Member Cannot Register Others (403)   | Member tries to register, gets 403         | FR-004       | ✅   | ✅     |
| TC-002-034 | Medium   | Name Validation (2-100 chars)         | Name must be 2-100 characters              | FR-004       | ✅   | ⬜     |

### 6.5 Role-Based Permissions (16 test cases)

| TC ID      | Priority | Title                                | Description                                      | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------------ | ------------------------------------------------ | ------------ | ---- | ------ |
| TC-002-035 | High     | Owner Has All Permissions            | Owner can perform all actions                    | FR-005       | ✅   | ✅     |
| TC-002-036 | High     | Admin Cannot Delete Group            | Admin tries to delete group, gets 403            | FR-005       | ✅   | ✅     |
| TC-002-037 | High     | Admin Can Edit Any Expense           | Admin edits expense created by Member            | FR-005       | ✅   | ✅     |
| TC-002-038 | High     | Member Can Add Expense               | Member adds expense successfully                 | FR-005       | ✅   | ✅     |
| TC-002-039 | High     | Member Can Edit Own Expense          | Member edits their own expense                   | FR-005       | ✅   | ✅     |
| TC-002-040 | High     | Member Cannot Edit Others' Expense   | Member tries to edit Admin's expense, gets 403   | FR-005       | ✅   | ✅     |
| TC-002-041 | High     | Member Cannot Delete Others' Expense | Member tries to delete Owner's expense, gets 403 | FR-005       | ✅   | ✅     |
| TC-002-042 | High     | Viewer Can View Expenses             | Viewer sees all group expenses (read-only)       | FR-005       | ✅   | ✅     |
| TC-002-043 | High     | Viewer Cannot Add Expense            | Viewer tries to add expense, gets 403            | FR-005       | ✅   | ✅     |
| TC-002-044 | High     | Viewer Cannot Edit Expense           | Viewer tries to edit expense, gets 403           | FR-005       | ✅   | ✅     |
| TC-002-045 | High     | Viewer Cannot Delete Expense         | Viewer tries to delete expense, gets 403         | FR-005       | ✅   | ✅     |
| TC-002-046 | High     | Member Cannot Invite Others          | Member tries to invite, gets 403                 | FR-005       | ✅   | ✅     |
| TC-002-047 | High     | Admin Can Change Member Role         | Admin promotes Member to Admin                   | FR-005       | ✅   | ✅     |
| TC-002-048 | High     | Admin Cannot Change Owner Role       | Admin tries to change Owner role, gets 403       | FR-005       | ✅   | ✅     |
| TC-002-049 | High     | Owner Cannot Revoke Own Membership   | Owner tries to leave, error shown                | FR-005       | ✅   | ⬜     |
| TC-002-050 | High     | Admin Can Revoke Member              | Admin removes Member from group                  | FR-005       | ✅   | ✅     |

### 6.6 Member Management (8 test cases)

| TC ID      | Priority | Title                           | Description                                   | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------- | --------------------------------------------- | ------------ | ---- | ------ |
| TC-002-051 | High     | Admin Changes Member to Viewer  | Role downgrade applied, permissions updated   | FR-006       | ✅   | ✅     |
| TC-002-052 | High     | Owner Promotes Member to Admin  | Role upgrade applied, new permissions granted | FR-006       | ✅   | ✅     |
| TC-002-053 | High     | Role Change Email Notification  | Member receives email about role change       | FR-006       | ✅   | ✅     |
| TC-002-054 | High     | Admin Revokes Member Membership | Member removed, session invalidated           | FR-006       | ✅   | ✅     |
| TC-002-055 | High     | Revoked Member Loses Access     | Revoked member gets 403 on next request       | FR-006       | ✅   | ✅     |
| TC-002-056 | High     | Admin Resets Member Password    | Temp password sent to member email            | FR-006       | ✅   | ✅     |
| TC-002-057 | Medium   | Admin Cannot Reset Own Password | Admin uses standard forgot password flow      | FR-006       | ✅   | ⬜     |
| TC-002-058 | High     | Audit Log Records All Changes   | Role changes, revocations logged              | FR-006       | ✅   | ⬜     |

### 6.7 Shared Expense Viewing (6 test cases)

| TC ID      | Priority | Title                          | Description                                  | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------ | -------------------------------------------- | ------------ | ---- | ------ |
| TC-002-059 | High     | Member Sees All Group Expenses | Member views expenses from all members       | US-009       | ✅   | ✅     |
| TC-002-060 | High     | Expense Shows Creator Name     | Each expense displays who created it         | US-009       | ✅   | ✅     |
| TC-002-061 | High     | Member Adds Expense to Group   | Expense visible to all group members         | US-010       | ✅   | ✅     |
| TC-002-062 | High     | Viewer Sees All Group Expenses | Viewer views all expenses (read-only)        | US-009       | ✅   | ✅     |
| TC-002-063 | Medium   | Expense List Filtered by Group | User only sees their group's expenses        | US-009       | ✅   | ✅     |
| TC-002-064 | Medium   | Empty Group Shows Empty State  | New group with no expenses shows placeholder | US-009       | ✅   | ✅     |

### 6.8 JWT & Authentication (6 test cases)

| TC ID      | Priority | Title                               | Description                                  | Requirements | Auto | Manual |
| ---------- | -------- | ----------------------------------- | -------------------------------------------- | ------------ | ---- | ------ |
| TC-002-065 | High     | JWT Includes Group Context          | Token payload has {groupId, role}            | HLD-002      | ✅   | ⬜     |
| TC-002-066 | High     | JWT Regenerated on Group Join       | New token issued after invitation acceptance | HLD-002      | ✅   | ✅     |
| TC-002-067 | High     | JWT Regenerated on Role Change      | New token issued after role update           | HLD-002      | ✅   | ✅     |
| TC-002-068 | High     | Session Invalidated on Revocation   | Revoked member's token rejected              | HLD-002      | ✅   | ✅     |
| TC-002-069 | High     | User Without Group Has Null Context | Single-user JWT has groupId=null, role=null  | HLD-002      | ✅   | ⬜     |
| TC-002-070 | High     | Token Expiration (24 hours)         | Token expires after 24 hours                 | HLD-002      | ✅   | ⬜     |

### 6.9 Security Tests (15 test cases)

| TC ID      | Priority | Title                            | Description                                | Requirements | Auto | Manual |
| ---------- | -------- | -------------------------------- | ------------------------------------------ | ------------ | ---- | ------ |
| TC-002-071 | Critical | Horizontal Privilege Escalation  | User cannot access other group's data      | HLD-002      | ✅   | ✅     |
| TC-002-072 | Critical | Token Tampering (Modify groupId) | Modified token rejected                    | HLD-002      | ✅   | ✅     |
| TC-002-073 | Critical | Token Tampering (Modify role)    | Role change in token rejected              | HLD-002      | ✅   | ✅     |
| TC-002-074 | Critical | IDOR - Access Other Group by ID  | Direct group ID access denied              | HLD-002      | ✅   | ✅     |
| TC-002-075 | Critical | IDOR - Access Other Member by ID | Direct member ID access denied             | HLD-002      | ✅   | ✅     |
| TC-002-076 | High     | SQL Injection on Group Name      | Malicious SQL in group name sanitized      | HLD-002      | ✅   | ✅     |
| TC-002-077 | High     | SQL Injection on Email           | Malicious SQL in email sanitized           | HLD-002      | ✅   | ⬜     |
| TC-002-078 | High     | XSS on Group Name                | Script tags in group name encoded          | HLD-002      | ✅   | ✅     |
| TC-002-079 | High     | XSS on Group Description         | Script tags in description encoded         | HLD-002      | ✅   | ⬜     |
| TC-002-080 | High     | CSRF Protection on State Changes | CSRF tokens validated on POST/PATCH/DELETE | HLD-002      | ✅   | ⬜     |
| TC-002-081 | High     | Rate Limiting on Invitations     | 20 invitations/hour enforced               | HLD-002      | ✅   | ⬜     |
| TC-002-082 | High     | Rate Limiting on API Requests    | 100 requests/minute enforced               | HLD-002      | ✅   | ⬜     |
| TC-002-083 | Critical | Elevation of Privilege Attempt   | Member cannot promote self to Admin        | HLD-002      | ✅   | ✅     |
| TC-002-084 | High     | Invitation Token Guessing        | Brute force token attempts blocked         | HLD-002      | ⬜   | ✅     |
| TC-002-085 | High     | Audit Log Tampering Prevention   | Audit logs immutable, append-only          | HLD-002      | ✅   | ⬜     |

### 6.10 Performance Tests (5 test cases)

| TC ID      | Priority | Title                          | Description                         | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------ | ----------------------------------- | ------------ | ---- | ------ |
| TC-002-086 | High     | Member List Query (50 members) | Response time <300ms                | HLD-002      | ✅   | ⬜     |
| TC-002-087 | High     | Group Creation Response Time   | <500ms including transaction commit | HLD-002      | ✅   | ⬜     |
| TC-002-088 | Medium   | Permission Check Overhead      | <50ms per request                   | HLD-002      | ✅   | ⬜     |
| TC-002-089 | Medium   | 100 Concurrent Group Creations | 95% complete successfully           | HLD-002      | ✅   | ⬜     |
| TC-002-090 | Medium   | Email Delivery Time            | <5 seconds to send invitation email | HLD-002      | ⬜   | ✅     |

### 6.11 Boundary & Edge Cases (10 test cases)

| TC ID      | Priority | Title                             | Description                                 | Requirements | Auto | Manual |
| ---------- | -------- | --------------------------------- | ------------------------------------------- | ------------ | ---- | ------ |
| TC-002-091 | High     | Empty Group (0 Members)           | Owner deletes all members except self       | FR-001       | ✅   | ⬜     |
| TC-002-092 | High     | Single Member Group (Owner Only)  | Owner views empty member list               | FR-001       | ✅   | ✅     |
| TC-002-093 | Medium   | 50 Member Group Performance       | Member list loads in <300ms                 | HLD-002      | ✅   | ⬜     |
| TC-002-094 | High     | Group Name Max Length (100 chars) | 100-char name accepted, 101 rejected        | FR-001       | ✅   | ⬜     |
| TC-002-095 | High     | Group Name Min Length (3 chars)   | 3-char name accepted, 2 rejected            | FR-001       | ✅   | ⬜     |
| TC-002-096 | Medium   | Group Name Special Characters     | Emoji, accents, Unicode handled             | FR-001       | ✅   | ✅     |
| TC-002-097 | High     | Invitation Token Expired Exactly  | Token expires at exact expiration timestamp | FR-002       | ✅   | ⬜     |
| TC-002-098 | Medium   | Invite Link Zero Max Uses         | Link with max_uses=0 never usable           | FR-003       | ✅   | ⬜     |
| TC-002-099 | Medium   | Concurrent Role Changes           | Two admins change same member's role        | FR-006       | ✅   | ⬜     |
| TC-002-100 | Medium   | Concurrent Invitation Accepts     | Same email invited twice, accepts both      | FR-002       | ✅   | ⬜     |

### 6.12 Negative Tests (10 test cases)

| TC ID      | Priority | Title                                | Description                                    | Requirements | Auto | Manual |
| ---------- | -------- | ------------------------------------ | ---------------------------------------------- | ------------ | ---- | ------ |
| TC-002-101 | High     | Invalid Email Format                 | Email validation rejects invalid formats       | FR-002       | ✅   | ⬜     |
| TC-002-102 | High     | Empty Group Name                     | Cannot create group without name               | FR-001       | ✅   | ⬜     |
| TC-002-103 | High     | Invalid Role Value                   | API rejects role not in enum (owner/admin/...) | FR-005       | ✅   | ⬜     |
| TC-002-104 | High     | Null User ID in Request              | Missing user context returns 401               | HLD-002      | ✅   | ⬜     |
| TC-002-105 | High     | Invalid Group ID Format              | Non-UUID group ID rejected                     | HLD-002      | ✅   | ⬜     |
| TC-002-106 | High     | Group ID Doesn't Exist               | 404 for non-existent group                     | HLD-002      | ✅   | ⬜     |
| TC-002-107 | High     | Member ID Doesn't Exist              | 404 when changing role of non-existent member  | FR-006       | ✅   | ⬜     |
| TC-002-108 | Medium   | Invite Link Invalid Token            | Random token returns 404                       | FR-003       | ✅   | ⬜     |
| TC-002-109 | Medium   | Email Invitation Invalid Token       | Tampered token rejected                        | FR-002       | ✅   | ⬜     |
| TC-002-110 | Medium   | Request Without Authorization Header | Missing JWT returns 401                        | HLD-002      | ✅   | ⬜     |

---

## 7. Detailed Test Cases (Sample)

### TC-002-001: Create Group as New User

**Priority**: High | **Type**: Functional | **Requirement**: FR-001  
**Precondition**: User logged in, not in any group

| Step | Action                                | Expected Result                                   |
| ---- | ------------------------------------- | ------------------------------------------------- |
| 1    | Navigate to Dashboard                 | "Create Group" button visible                     |
| 2    | Click "Create Group"                  | Group creation dialog opens                       |
| 3    | Enter group name "Smith Family"       | Name input accepts text                           |
| 4    | Enter description "Our family budget" | Description textarea accepts text                 |
| 5    | Click "Create" button                 | Dialog closes, loading indicator shown            |
| 6    | Wait for API response                 | Group created, user redirected to group dashboard |
| 7    | Verify user role badge                | "Owner" badge displayed                           |
| 8    | Check JWT token (dev tools)           | Token includes `{groupId: "...", role: "owner"}`  |
| 9    | Navigate to Members page              | User listed as Owner                              |

**Status**: 🔄 Pending  
**Automation**: Playwright E2E test  
**Estimated Time**: 30 seconds

---

### TC-002-035: Owner Has All Permissions

**Priority**: High | **Type**: Functional | **Requirement**: FR-005  
**Precondition**: Owner logged into group with 3+ members

| Permission         | Action                           | Expected Result          |
| ------------------ | -------------------------------- | ------------------------ |
| view_expenses      | Navigate to Expenses page        | All group expenses shown |
| add_expense        | Click "Add Expense", submit form | Expense created (200)    |
| edit_any_expense   | Edit expense created by Member   | Edit succeeds (200)      |
| delete_any_expense | Delete expense created by Admin  | Delete succeeds (200)    |
| view_members       | Navigate to Members page         | All members shown        |
| invite_members     | Click "Invite Member"            | Invitation modal opens   |
| change_roles       | Change Member to Admin           | Role updated (200)       |
| revoke_members     | Remove Admin from group          | Member removed (200)     |
| reset_passwords    | Reset Member password            | Temp password sent (200) |
| edit_group         | Edit group name                  | Group updated (200)      |
| delete_group       | Click "Delete Group", confirm    | Group deleted (200)      |

**Status**: 🔄 Pending  
**Automation**: Playwright E2E test (permission matrix)  
**Estimated Time**: 5 minutes

---

### TC-002-043: Viewer Cannot Add Expense

**Priority**: High | **Type**: Negative | **Requirement**: FR-005  
**Precondition**: Viewer logged into group

| Step | Action                                   | Expected Result                                     |
| ---- | ---------------------------------------- | --------------------------------------------------- |
| 1    | Navigate to Expenses page                | Expense list visible (read-only)                    |
| 2    | Verify "Add Expense" button              | Button disabled or hidden                           |
| 3    | API test: POST /expenses with Viewer JWT | HTTP 403 Forbidden                                  |
| 4    | Check error message                      | "Role viewer does not have permission: add_expense" |
| 5    | Verify audit log                         | Failed attempt logged                               |

**Status**: 🔄 Pending  
**Automation**: Integration test (Supertest) + E2E (Playwright)  
**Estimated Time**: 1 minute

---

### TC-002-071: Horizontal Privilege Escalation

**Priority**: Critical | **Type**: Security | **Requirement**: HLD-002  
**Precondition**: Two groups exist (Group A, Group B), user is member of Group A

| Step | Action                                     | Expected Result                                         |
| ---- | ------------------------------------------ | ------------------------------------------------------- |
| 1    | Login as User A (member of Group A)        | JWT includes `groupId: "group-a-id"`                    |
| 2    | API: GET /groups/group-b-id                | HTTP 403 Forbidden                                      |
| 3    | API: GET /groups/group-b-id/members        | HTTP 403 Forbidden                                      |
| 4    | API: GET /expenses?groupId=group-b-id      | HTTP 403 Forbidden (group ID filtered from JWT)         |
| 5    | Tamper JWT: Change groupId to "group-b-id" | Token signature validation fails, HTTP 401 Unauthorized |
| 6    | Verify audit log                           | Access attempts logged with user ID and IP              |

**Status**: 🔄 Pending  
**Automation**: Integration test (Supertest) + Manual security testing  
**Estimated Time**: 5 minutes

---

### TC-002-086: Member List Query Performance (50 members)

**Priority**: High | **Type**: Performance | **Requirement**: HLD-002  
**Precondition**: Group with 50 members created

| Step | Action                                  | Expected Result                    |
| ---- | --------------------------------------- | ---------------------------------- |
| 1    | Setup: Create group with 50 members     | Test data prepared                 |
| 2    | API: GET /groups/:id/members            | Response time <300ms (p95)         |
| 3    | Verify response includes all 50 members | Total count = 50                   |
| 4    | Check database query plan               | Index on group_id used             |
| 5    | Run 100 times, measure p50, p95, p99    | p50 <200ms, p95 <300ms, p99 <500ms |

**Status**: 🔄 Pending  
**Automation**: k6 load test script  
**Estimated Time**: 5 minutes (setup) + 2 minutes (execution)

---

## 8. Test Data Requirements

### 8.1 User Accounts

```sql
-- Owner
INSERT INTO users (id, email, name, google_id)
VALUES ('owner-id', 'owner@test.local', 'Alice Owner', 'google-owner-123');

-- Admin
INSERT INTO users (id, email, name, google_id)
VALUES ('admin-id', 'admin@test.local', 'Bob Admin', 'google-admin-456');

-- Member
INSERT INTO users (id, email, name, google_id)
VALUES ('member-id', 'member@test.local', 'Charlie Member', 'google-member-789');

-- Viewer
INSERT INTO users (id, email, name, google_id)
VALUES ('viewer-id', 'viewer@test.local', 'Diana Viewer', 'google-viewer-012');

-- Unassigned (no group)
INSERT INTO users (id, email, name, google_id)
VALUES ('unassigned-id', 'unassigned@test.local', 'Eve Unassigned', 'google-unassigned-345');
```

### 8.2 Test Group

```sql
-- Test Group
INSERT INTO groups (id, name, description, created_by)
VALUES ('test-group-id', 'Test Family', 'Automated test group', 'owner-id');

-- Group Memberships
INSERT INTO group_members (group_id, user_id, role) VALUES
('test-group-id', 'owner-id', 'owner'),
('test-group-id', 'admin-id', 'admin'),
('test-group-id', 'member-id', 'member'),
('test-group-id', 'viewer-id', 'viewer');
```

### 8.3 Test Expenses

```sql
-- Expenses created by different members
INSERT INTO expenses (id, group_id, created_by, amount, category, description, date) VALUES
('expense-owner-1', 'test-group-id', 'owner-id', 100.00, 'Food', 'Grocery shopping', '2025-12-20'),
('expense-admin-1', 'test-group-id', 'admin-id', 50.00, 'Transportation', 'Gas', '2025-12-19'),
('expense-member-1', 'test-group-id', 'member-id', 25.00, 'Entertainment', 'Movie tickets', '2025-12-18');
```

### 8.4 Test Invitations

```sql
-- Pending email invitation
INSERT INTO invitations (id, group_id, inviter_id, email, role, token, status, expires_at)
VALUES ('invite-1', 'test-group-id', 'owner-id', 'newmember@test.com', 'member',
        'test-token-abc123', 'pending', NOW() + INTERVAL '7 days');

-- Expired invitation
INSERT INTO invitations (id, group_id, inviter_id, email, role, token, status, expires_at)
VALUES ('invite-expired', 'test-group-id', 'admin-id', 'expired@test.com', 'member',
        'expired-token-xyz', 'expired', NOW() - INTERVAL '1 day');
```

### 8.5 Test Invite Links

```sql
-- Active invite link
INSERT INTO invite_links (id, group_id, created_by, token, default_role, max_uses, uses_count, expires_at, is_active)
VALUES ('link-1', 'test-group-id', 'admin-id', 'link-token-123', 'member', 10, 3,
        NOW() + INTERVAL '7 days', true);

-- Expired link
INSERT INTO invite_links (id, group_id, created_by, token, default_role, max_uses, uses_count, expires_at, is_active)
VALUES ('link-expired', 'test-group-id', 'owner-id', 'link-expired-456', 'member', NULL, 0,
        NOW() - INTERVAL '1 day', true);
```

---

## 9. Test Environment Setup

### 9.1 Local Environment (Docker Compose)

**Requirements:**

- Docker Desktop installed
- PostgreSQL 14+ (via Docker)
- Node.js 18+ (for running tests)

**Setup Steps:**

```bash
# 1. Start services
docker-compose up -d

# 2. Run database migrations
cd app/services/auth-service
npm run migration:run

# 3. Seed test data
psql -h localhost -U testuser -d testdb -f tests/fixtures/seed-groups-test-data.sql

# 4. Verify services
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # API Service
```

### 9.2 Staging Environment (Cloud Run)

**Requirements:**

- Google Cloud project configured
- Cloud SQL or Firestore database
- CI/CD pipeline deployed services

**Test User Access:**

- Email: `staging-owner@test.com` (Owner)
- Email: `staging-admin@test.com` (Admin)
- Email: `staging-member@test.com` (Member)
- Email: `staging-viewer@test.com` (Viewer)

### 9.3 Test Tools Installation

```bash
# Install test dependencies
cd tests
npm install

# Playwright browsers
npx playwright install

# Verify installations
npm run test:unit -- --version
npx playwright --version
```

---

## 10. Test Execution Schedule

### Phase 1: Unit & Integration Tests (Week 1-2)

| Day       | Activity                                | Owner | Status |
| --------- | --------------------------------------- | ----- | ------ |
| Day 1-3   | Unit tests: Permission logic            | QA    | 🔄     |
| Day 4-5   | Unit tests: Group service               | QA    | 🔄     |
| Day 6-7   | Unit tests: Invitation service          | QA    | 🔄     |
| Day 8-10  | Integration tests: Group endpoints      | QA    | 🔄     |
| Day 11-12 | Integration tests: Invitation endpoints | QA    | 🔄     |
| Day 13-14 | Integration tests: Member management    | QA    | 🔄     |

### Phase 2: E2E & Security Tests (Week 3-4)

| Day       | Activity                               | Owner | Status |
| --------- | -------------------------------------- | ----- | ------ |
| Day 15-17 | E2E tests: Group creation & invitation | QA    | 🔄     |
| Day 18-20 | E2E tests: Permission enforcement      | QA    | 🔄     |
| Day 21-22 | Security tests: OWASP Top 10           | QA    | 🔄     |
| Day 23-24 | Security tests: Authorization bypass   | QA    | 🔄     |
| Day 25-26 | Performance tests: Load scenarios      | QA    | 🔄     |
| Day 27-28 | Regression tests: Existing features    | QA    | 🔄     |

### Phase 3: Manual & Exploratory (Week 5)

| Day       | Activity                            | Owner | Status |
| --------- | ----------------------------------- | ----- | ------ |
| Day 29-30 | Manual exploratory testing          | QA    | 🔄     |
| Day 31    | Usability testing (5 users)         | QA    | 🔄     |
| Day 32    | Cross-browser compatibility testing | QA    | 🔄     |
| Day 33    | Mobile responsive testing           | QA    | 🔄     |
| Day 34    | Localization testing (EN/HE)        | QA    | 🔄     |
| Day 35    | Test report & sign-off              | QA    | 🔄     |

---

## 11. Risks & Mitigation

| Risk                                      | Impact | Probability | Mitigation Strategy                                             |
| ----------------------------------------- | ------ | ----------- | --------------------------------------------------------------- |
| Complex permission matrix hard to test    | High   | Medium      | Automated matrix testing, test all role × permission combos     |
| JWT token issues (size, validation)       | High   | Low         | Unit tests for token generation, E2E tests for token validation |
| Email delivery failures in test env       | Medium | Medium      | Mock email service for unit tests, stub for integration tests   |
| Database migration failures               | High   | Low         | Test migrations in isolated DB, rollback plan ready             |
| Performance degradation with large groups | Medium | Low         | Load testing with 50+ members, optimize queries with indexes    |
| Security vulnerabilities missed           | High   | Medium      | Comprehensive security test suite, manual penetration testing   |
| Invitation token collision (uniqueness)   | Low    | Low         | Cryptographically secure tokens (32 bytes), uniqueness enforced |
| Audit log performance impact              | Low    | Low         | Async logging, indexed queries, retention policy (90 days)      |

---

## 12. Deliverables

### 12.1 Test Artifacts

- [ ] Test execution report (EXEC-002-group-management.md)
- [ ] Unit test coverage report (>90% for permission logic)
- [ ] Integration test results (all endpoints green)
- [ ] E2E test results (Playwright HTML report)
- [ ] Security test findings (vulnerability scan report)
- [ ] Performance test results (k6 HTML report)
- [ ] Bug reports (GitHub issues for any defects found)

### 12.2 Test Automation

- [ ] Unit tests: `tests/unit/groups/*.spec.ts` (50+ tests)
- [ ] Integration tests: `tests/integration/groups/*.spec.ts` (45+ tests)
- [ ] E2E tests: `tests/e2e/groups/*.spec.ts` (20 test suites)
- [ ] Security tests: `tests/security/groups/*.spec.ts` (15 tests)
- [ ] Performance tests: `tests/performance/groups/*.k6.js` (5 scenarios)

### 12.3 Documentation

- [ ] Test plan (this document)
- [ ] Test case specifications (detailed test cases)
- [ ] Test data setup scripts (`tests/fixtures/seed-groups-test-data.sql`)
- [ ] Known issues & workarounds
- [ ] Regression test suite documentation

---

## 13. Approval & Sign-Off

| Role            | Name      | Signature | Date |
| --------------- | --------- | --------- | ---- |
| QA Lead         | Uzi Biton |           | TBD  |
| Tech Lead       | Uzi Biton |           | TBD  |
| Product Owner   | Uzi Biton |           | TBD  |
| Security Review | Uzi Biton |           | TBD  |

---

## 14. Change Log

| Version | Date       | Author    | Changes                   |
| ------- | ---------- | --------- | ------------------------- |
| 1.0     | 2025-12-21 | Uzi Biton | Initial test plan created |

---

## 15. References

- [REQ-002: Requirements Document](../../product/requirements/REQ-002-group-management.md)
- [HLD-002: High-Level Design](../../dev/designs/HLD-002-group-management.md)
- [GitHub Issue #69](https://github.com/uzibiton/automation-interview-pre/issues/69)
- [Testing Strategy](../TEST_STRATEGY.md)
- [E2E Testing Guide](../E2E_TESTING_GUIDE.md)
- [API Reference](../../dev/API_REFERENCE.md)

---

**Document Status**: 📝 Draft - Ready for Review  
**Next Steps**: Begin test implementation (Unit tests → Integration → E2E → Security)  
**Total Test Cases**: 110 test cases covering functional, security, performance, and edge cases
