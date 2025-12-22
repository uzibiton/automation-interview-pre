/**
 * Mock fixture data for groups
 */

import { Group } from '../../types/Group';

export const mockGroups: Group[] = [
  {
    id: 'group-001',
    name: 'Family Expenses',
    description: 'Shared household expenses for our family',
    createdBy: 'user-1',
    memberCount: 4,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'group-2',
    name: 'Work Team',
    description: 'Team lunch and office expenses',
    createdBy: 'user-5',
    memberCount: 3,
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
  },
];

export const getCurrentUserGroup = (): Group => mockGroups[0];
