---
name: Add user groups and admin role with permissions
about: Implement multi-user support with admin capabilities and user invitations
title: 'FEATURE: Add user groups, admin role, and user invitation system'
labels: enhancement, feature, backend, frontend, authentication
assignees: ''

---

## Feature Description
Add support for user groups with an admin role system. Admins should have full permissions to manage the group, including inviting/adding new users, managing permissions, and controlling group resources.

## Problem / Use Case
- Currently, each user works in isolation with their own data
- No way to share expenses or tasks between team members/family
- No collaboration features for household budgeting or team task management
- No admin capabilities to manage other users
- No way to invite or add users to an account/workspace

## Proposed Solution
Implement a hierarchical user and group system:
1. **Groups** - Organizations/teams/families that contain multiple users
2. **Admin Role** - Users with full permissions to manage the group
3. **Member Role** - Regular users with standard permissions
4. **Invitation System** - Admins can invite users via email

## User Stories

### As an Admin
- I want to create a group so that my family/team can collaborate
- I want to invite users by email to join my group
- I want to assign roles (admin/member) to users in my group
- I want to remove users from my group
- I want to manage group settings and permissions
- I want to see all group members and their activity
- I want to control what members can see and do

### As a Member
- I want to accept invitations to join groups
- I want to see expenses/tasks from my group
- I want to add my own expenses/tasks that group can see
- I want to switch between my personal and group workspaces
- I want to leave a group if I choose

### As a User (Invitee)
- I want to receive invitation emails
- I want to sign up/login to accept invitation
- I want to see who invited me and to which group

## Implementation Tasks

### Database Schema

#### Groups Table
- [ ] Create `groups` table:
  - `id` (UUID, primary key)
  - `name` (string, required)
  - `description` (text, optional)
  - `owner_id` (UUID, foreign key to users)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

#### User Groups Junction Table
- [ ] Create `user_groups` table:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to users)
  - `group_id` (UUID, foreign key to groups)
  - `role` (enum: 'admin', 'member')
  - `joined_at` (timestamp)
  - `invited_by` (UUID, foreign key to users)

#### Invitations Table
- [ ] Create `invitations` table:
  - `id` (UUID, primary key)
  - `group_id` (UUID, foreign key to groups)
  - `email` (string, required)
  - `role` (enum: 'admin', 'member', default: 'member')
  - `invited_by` (UUID, foreign key to users)
  - `token` (string, unique, for invitation link)
  - `status` (enum: 'pending', 'accepted', 'expired', 'declined')
  - `expires_at` (timestamp)
  - `created_at` (timestamp)
  - `accepted_at` (timestamp, nullable)

#### Update Existing Tables
- [ ] Add `group_id` to `expenses` table (nullable, foreign key)
- [ ] Add `group_id` to `tasks` table (nullable, foreign key)
- [ ] Add index on `group_id` columns for performance

### Backend API (Auth Service)

#### Group Management Endpoints
- [ ] `POST /api/groups` - Create new group (authenticated)
- [ ] `GET /api/groups` - List user's groups
- [ ] `GET /api/groups/:id` - Get group details
- [ ] `PUT /api/groups/:id` - Update group (admin only)
- [ ] `DELETE /api/groups/:id` - Delete group (owner only)
- [ ] `GET /api/groups/:id/members` - List group members

#### Member Management Endpoints
- [ ] `GET /api/groups/:id/members/:userId` - Get member details
- [ ] `PUT /api/groups/:id/members/:userId/role` - Update member role (admin only)
- [ ] `DELETE /api/groups/:id/members/:userId` - Remove member (admin only)
- [ ] `POST /api/groups/:id/leave` - Leave group (member)

#### Invitation Endpoints
- [ ] `POST /api/groups/:id/invitations` - Send invitation (admin only)
- [ ] `GET /api/groups/:id/invitations` - List pending invitations (admin only)
- [ ] `DELETE /api/invitations/:id` - Cancel invitation (admin only)
- [ ] `POST /api/invitations/:token/accept` - Accept invitation
- [ ] `POST /api/invitations/:token/decline` - Decline invitation
- [ ] `GET /api/invitations/pending` - Get user's pending invitations

### Backend API (API Service)

#### Update Existing Endpoints
- [ ] Add `group_id` filter to `GET /api/expenses`
- [ ] Add `group_id` to `POST /api/expenses` (optional)
- [ ] Add `group_id` filter to `GET /api/tasks`
- [ ] Add `group_id` to `POST /api/tasks` (optional)

#### Permission Middleware
- [ ] Create `checkGroupAdmin` middleware - verify admin role
- [ ] Create `checkGroupMember` middleware - verify membership
- [ ] Create `checkGroupOwner` middleware - verify owner
- [ ] Apply to protected endpoints

### Authorization & Permissions

#### Permission Matrix
- [ ] **Owner**: All admin permissions + delete group
- [ ] **Admin**: Invite users, manage members, update group, manage all resources
- [ ] **Member**: View group data, create own resources, edit own resources

#### Access Control
- [ ] Users can only access groups they belong to
- [ ] Only admins can invite/remove users
- [ ] Only owners can delete groups
- [ ] Members can only edit/delete their own expenses/tasks
- [ ] Admins can view all group expenses/tasks

### Email Service

#### Email Templates
- [ ] Create invitation email template
- [ ] Create welcome to group email template
- [ ] Create role change notification template
- [ ] Create removal notification template

#### Email Sending
- [ ] Integrate email service (SendGrid, AWS SES, or similar)
- [ ] Send invitation emails with unique token links
- [ ] Send confirmation emails on acceptance
- [ ] Handle email delivery failures

### Frontend Components

#### Group Management UI
- [ ] Create group creation form/modal
- [ ] Create group settings page
- [ ] Create group members list page
- [ ] Create invite user modal
- [ ] Create role management UI
- [ ] Create group switcher dropdown

#### Navigation Updates
- [ ] Add group selector in navbar
- [ ] Show current active group
- [ ] Add "Switch Group" option
- [ ] Add "My Personal" vs "Group" toggle

#### Invitation Flow
- [ ] Create invitation acceptance page (`/invitations/:token`)
- [ ] Show invitation details (group name, inviter)
- [ ] Handle already-logged-in users
- [ ] Handle new user sign-up from invitation
- [ ] Show pending invitations in dashboard

#### Resource Management
- [ ] Add "Personal" vs "Group" filter on expenses page
- [ ] Add "Personal" vs "Group" filter on tasks page
- [ ] Show group name on group resources
- [ ] Add group context to forms (checkbox: "Add to group")

### Testing

#### Unit Tests
- [ ] Test group creation, update, delete
- [ ] Test user invitation flow
- [ ] Test permission checks
- [ ] Test role assignment/changes

#### Integration Tests
- [ ] Test complete invitation workflow
- [ ] Test group switching
- [ ] Test permission enforcement
- [ ] Test resource isolation between groups

#### E2E Tests
- [ ] Test admin creating group and inviting users
- [ ] Test user accepting invitation
- [ ] Test role management
- [ ] Test group resource creation/viewing
- [ ] Test leaving/removing from group

### Documentation
- [ ] Update API documentation with new endpoints
- [ ] Document permission model
- [ ] Add user guide for group features
- [ ] Document invitation flow
- [ ] Update database schema documentation

## Benefits
- ✅ Family budgeting and expense sharing
- ✅ Team collaboration on tasks
- ✅ Centralized expense tracking for organizations
- ✅ Flexible permission model
- ✅ Easy user onboarding via invitations
- ✅ Multi-tenant capable architecture
- ✅ Scalable for future features (billing, analytics per group)

## Acceptance Criteria
- [ ] Admin can create a group
- [ ] Admin can invite users by email
- [ ] Users receive invitation emails with working links
- [ ] Users can accept/decline invitations
- [ ] Admin can assign admin/member roles
- [ ] Admin can remove users from group
- [ ] Members can view group expenses and tasks
- [ ] Members can add expenses/tasks to group
- [ ] Users can switch between personal and group workspaces
- [ ] Permission model correctly enforces access control
- [ ] All existing features work for personal (non-group) data
- [ ] Email notifications are sent for all invitation actions
- [ ] UI clearly shows current group context
- [ ] Tests pass for all new functionality

## Technical Considerations
- Handle users in multiple groups
- Soft delete vs hard delete for groups
- Invitation expiration (default 7 days)
- Unique token generation for invitations
- Rate limiting on invitation sending
- Handle invited user already registered
- Database indexes for performance
- Caching strategy for group membership
- Audit log for admin actions
- GDPR compliance for user removal

## Future Enhancements (Out of Scope)
- Custom roles beyond admin/member
- Fine-grained permissions
- Group billing/subscription plans
- Group analytics dashboard
- Activity feed for group actions
- Comments/discussion on resources

## Migration Plan
- [ ] Create migration scripts for new tables
- [ ] Ensure backward compatibility for existing users
- [ ] All existing data remains as "personal" (no group)
- [ ] Test migration on staging environment

## References
- Database schema: `app/database/init.sql`
- Auth service: `app/services/auth-service/`
- API service: `app/services/api-service/`
- Frontend: `app/frontend/src/`
