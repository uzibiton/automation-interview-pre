/**
 * Mock fixture data for invite links
 */

import { InviteLink } from '../../types/InviteLink';
import { GroupRole } from '../../types/GroupMember';

export const mockInviteLinks: InviteLink[] = [
  {
    id: 'link-1',
    groupId: 'group-001',
    createdBy: 'user-1',
    createdByName: 'John Doe',
    token: 'ABC12345',
    defaultRole: GroupRole.MEMBER,
    maxUses: 1,
    usesCount: 0,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'link-2',
    groupId: 'group-001',
    createdBy: 'user-2',
    createdByName: 'Jane Smith',
    token: 'DEF67890',
    defaultRole: GroupRole.VIEWER,
    maxUses: 10,
    usesCount: 3,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 'link-3',
    groupId: 'group-001',
    createdBy: 'user-1',
    createdByName: 'John Doe',
    token: 'GHI11111',
    defaultRole: GroupRole.MEMBER,
    maxUses: null, // Unlimited uses
    usesCount: 15,
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Expired 1 day ago
    isActive: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

export const getActiveInviteLinks = (groupId: string): InviteLink[] => {
  return mockInviteLinks.filter((link) => link.groupId === groupId && link.isActive);
};

export const getInviteLinkByToken = (token: string): InviteLink | undefined => {
  return mockInviteLinks.find((link) => link.token === token);
};
