/**
 * Mock fixture data for invitations
 */

import { Invitation, InvitationStatus } from '../../types/Invitation';
import { GroupRole } from '../../types/GroupMember';

export const mockInvitations: Invitation[] = [
  {
    id: 'invitation-1',
    groupId: 'group-1',
    groupName: 'Family Expenses',
    inviterId: 'user-1',
    inviterName: 'John Doe',
    email: 'newmember1@example.com',
    role: GroupRole.MEMBER,
    token: 'inv-token-abc123',
    status: InvitationStatus.PENDING,
    message: 'Welcome to our family expense group!',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'invitation-2',
    groupId: 'group-1',
    groupName: 'Family Expenses',
    inviterId: 'user-2',
    inviterName: 'Jane Smith',
    email: 'newmember2@example.com',
    role: GroupRole.VIEWER,
    token: 'inv-token-def456',
    status: InvitationStatus.PENDING,
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'invitation-3',
    groupId: 'group-1',
    groupName: 'Family Expenses',
    inviterId: 'user-1',
    inviterName: 'John Doe',
    email: 'accepted@example.com',
    role: GroupRole.ADMIN,
    token: 'inv-token-ghi789',
    status: InvitationStatus.ACCEPTED,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'invitation-4',
    groupId: 'group-1',
    groupName: 'Family Expenses',
    inviterId: 'user-1',
    inviterName: 'John Doe',
    email: 'expired@example.com',
    role: GroupRole.MEMBER,
    token: 'inv-token-jkl012',
    status: InvitationStatus.EXPIRED,
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Expired 1 day ago
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: 'invitation-5',
    groupId: 'group-2',
    groupName: 'Work Team',
    inviterId: 'user-5',
    inviterName: 'Charlie Brown',
    email: 'declined@example.com',
    role: GroupRole.MEMBER,
    token: 'inv-token-mno345',
    status: InvitationStatus.DECLINED,
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

export const getPendingInvitations = (groupId: string): Invitation[] => {
  return mockInvitations.filter(
    (inv) => inv.groupId === groupId && inv.status === InvitationStatus.PENDING,
  );
};

export const getInvitationByToken = (token: string): Invitation | undefined => {
  return mockInvitations.find((inv) => inv.token === token);
};
