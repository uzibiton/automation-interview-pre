/**
 * Mock fixture data for group members
 */

import { GroupMember, GroupRole } from '../../types/GroupMember';

export const mockMembers: GroupMember[] = [
  {
    id: 'member-1',
    groupId: 'group-001',
    userId: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: GroupRole.OWNER,
    avatar: 'https://i.pravatar.cc/150?u=john',
    joinedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'member-2',
    groupId: 'group-001',
    userId: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: GroupRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=jane',
    joinedAt: '2024-01-16T09:30:00Z',
  },
  {
    id: 'member-3',
    groupId: 'group-001',
    userId: 'user-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: GroupRole.MEMBER,
    avatar: 'https://i.pravatar.cc/150?u=bob',
    joinedAt: '2024-01-17T11:15:00Z',
  },
  {
    id: 'member-4',
    groupId: 'group-001',
    userId: 'user-4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: GroupRole.VIEWER,
    avatar: 'https://i.pravatar.cc/150?u=alice',
    joinedAt: '2024-01-18T13:45:00Z',
  },
  {
    id: 'member-5',
    groupId: 'group-2',
    userId: 'user-5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: GroupRole.OWNER,
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    joinedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'member-6',
    groupId: 'group-2',
    userId: 'user-6',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: GroupRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=diana',
    joinedAt: '2024-02-02T10:00:00Z',
  },
  {
    id: 'member-7',
    groupId: 'group-2',
    userId: 'user-7',
    name: 'Eve Anderson',
    email: 'eve.anderson@example.com',
    role: GroupRole.MEMBER,
    avatar: 'https://i.pravatar.cc/150?u=eve',
    joinedAt: '2024-02-03T15:20:00Z',
  },
];

export const getMembersByGroupId = (groupId: string): GroupMember[] => {
  return mockMembers.filter((member) => member.groupId === groupId);
};
