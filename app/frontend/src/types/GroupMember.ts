/**
 * Group Member-related type definitions
 */

export enum GroupRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  name: string;
  email: string;
  role: GroupRole;
  avatar?: string;
  joinedAt: string;
}

export interface ChangeRoleDto {
  role: GroupRole;
}

/**
 * Permission Matrix - defines what each role can do
 */
export interface PermissionMatrix {
  view_expenses: GroupRole[];
  add_expense: GroupRole[];
  edit_own_expense: GroupRole[];
  edit_any_expense: GroupRole[];
  delete_own_expense: GroupRole[];
  delete_any_expense: GroupRole[];
  view_members: GroupRole[];
  invite_members: GroupRole[];
  change_roles: GroupRole[];
  revoke_members: GroupRole[];
  reset_passwords: GroupRole[];
  edit_group: GroupRole[];
  delete_group: GroupRole[];
}

/**
 * Default permission matrix
 */
export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  view_expenses: [GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER],
  add_expense: [GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER],
  edit_own_expense: [GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER],
  edit_any_expense: [GroupRole.OWNER, GroupRole.ADMIN],
  delete_own_expense: [GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER],
  delete_any_expense: [GroupRole.OWNER, GroupRole.ADMIN],
  view_members: [GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER, GroupRole.VIEWER],
  invite_members: [GroupRole.OWNER, GroupRole.ADMIN],
  change_roles: [GroupRole.OWNER, GroupRole.ADMIN],
  revoke_members: [GroupRole.OWNER, GroupRole.ADMIN],
  reset_passwords: [GroupRole.OWNER, GroupRole.ADMIN],
  edit_group: [GroupRole.OWNER, GroupRole.ADMIN],
  delete_group: [GroupRole.OWNER],
};
