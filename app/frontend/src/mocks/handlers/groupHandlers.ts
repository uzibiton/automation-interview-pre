/**
 * MSW handlers for Group Management API endpoints
 */

import { http, HttpResponse, delay } from 'msw';
import {
  mockGroups,
  getCurrentUserGroup,
} from '../fixtures/groups.fixture';
import {
  mockMembers,
  getMembersByGroupId,
} from '../fixtures/members.fixture';
import { Group, CreateGroupDto, UpdateGroupDto } from '../../types/Group';
import { GroupMember, GroupRole } from '../../types/GroupMember';

// In-memory store for state persistence during testing
let groups = [...mockGroups];
let members = [...mockMembers];

// Helper to generate random delay between 200-500ms
const randomDelay = () => delay(200 + Math.random() * 300);

export const groupHandlers = [
  // GET /api/groups/current - Get current user's group
  http.get('/api/groups/current', async () => {
    await randomDelay();
    const currentGroup = getCurrentUserGroup();
    return HttpResponse.json(currentGroup, { status: 200 });
  }),

  // POST /api/groups - Create a new group
  http.post('/api/groups', async ({ request }) => {
    await randomDelay();

    const body = (await request.json()) as CreateGroupDto;

    // Validation: Empty name
    if (!body.name || body.name.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Group name is required' },
        { status: 400 },
      );
    }

    // Validation: Name too short
    if (body.name.length < 3) {
      return HttpResponse.json(
        { error: 'Group name must be at least 3 characters' },
        { status: 400 },
      );
    }

    // Validation: Name too long
    if (body.name.length > 100) {
      return HttpResponse.json(
        { error: 'Group name must not exceed 100 characters' },
        { status: 400 },
      );
    }

    // Check if user already has a group (business rule)
    const userHasGroup = members.some((m) => m.userId === 'user-1');
    if (userHasGroup) {
      return HttpResponse.json(
        { error: 'User can only be in one group' },
        { status: 400 },
      );
    }

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      createdBy: 'user-1',
      memberCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    groups.push(newGroup);

    // Add creator as Owner
    const ownerMember: GroupMember = {
      id: `member-${Date.now()}`,
      groupId: newGroup.id,
      userId: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: GroupRole.OWNER,
      avatar: 'https://i.pravatar.cc/150?u=john',
      joinedAt: new Date().toISOString(),
    };
    members.push(ownerMember);

    return HttpResponse.json(newGroup, { status: 201 });
  }),

  // GET /api/groups/:id - Get group details
  http.get('/api/groups/:id', async ({ params }) => {
    await randomDelay();

    const { id } = params;
    const group = groups.find((g) => g.id === id);

    if (!group) {
      return HttpResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return HttpResponse.json(group, { status: 200 });
  }),

  // PATCH /api/groups/:id - Update group
  http.patch('/api/groups/:id', async ({ request, params }) => {
    await randomDelay();

    const { id } = params;
    const body = (await request.json()) as UpdateGroupDto;

    const groupIndex = groups.findIndex((g) => g.id === id);
    if (groupIndex === -1) {
      return HttpResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check permissions (simulate - assume user-1 and user-2 are Owner/Admin)
    // In real implementation, this would check JWT token
    const canEdit = true; // Simplified for mock

    if (!canEdit) {
      return HttpResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    // Validation
    if (body.name !== undefined) {
      if (body.name.length < 3 || body.name.length > 100) {
        return HttpResponse.json(
          { error: 'Group name must be between 3 and 100 characters' },
          { status: 400 },
        );
      }
    }

    const updatedGroup = {
      ...groups[groupIndex],
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      updatedAt: new Date().toISOString(),
    };

    groups[groupIndex] = updatedGroup;

    return HttpResponse.json(updatedGroup, { status: 200 });
  }),

  // DELETE /api/groups/:id - Delete group (Owner only)
  http.delete('/api/groups/:id', async ({ params }) => {
    await randomDelay();

    const { id } = params;
    const groupIndex = groups.findIndex((g) => g.id === id);

    if (groupIndex === -1) {
      return HttpResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if user is Owner (simplified - assume user-1 is owner of group-1)
    const isOwner = id === 'group-1'; // Simplified check

    if (!isOwner) {
      return HttpResponse.json(
        { error: 'Only the group owner can delete the group' },
        { status: 403 },
      );
    }

    // Remove group and all members
    groups.splice(groupIndex, 1);
    members = members.filter((m) => m.groupId !== id);

    return HttpResponse.json({ message: 'Group deleted successfully' }, { status: 200 });
  }),

  // GET /api/groups/:id/members - List group members
  http.get('/api/groups/:id/members', async ({ params }) => {
    await randomDelay();

    const { id } = params;
    const groupMembers = getMembersByGroupId(id as string);

    return HttpResponse.json(groupMembers, { status: 200 });
  }),

  // PATCH /api/groups/:groupId/members/:memberId/role - Change member role
  http.patch('/api/groups/:groupId/members/:memberId/role', async ({ request, params }) => {
    await randomDelay();

    const { groupId, memberId } = params;
    const body = (await request.json()) as { role: GroupRole };

    const memberIndex = members.findIndex(
      (m) => m.id === memberId && m.groupId === groupId,
    );

    if (memberIndex === -1) {
      return HttpResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = members[memberIndex];

    // Cannot change Owner role
    if (member.role === GroupRole.OWNER) {
      return HttpResponse.json(
        { error: 'Cannot change owner role' },
        { status: 403 },
      );
    }

    // Validation
    if (!Object.values(GroupRole).includes(body.role)) {
      return HttpResponse.json(
        { error: 'Invalid role' },
        { status: 400 },
      );
    }

    members[memberIndex] = {
      ...member,
      role: body.role,
    };

    return HttpResponse.json(members[memberIndex], { status: 200 });
  }),

  // DELETE /api/groups/:groupId/members/:memberId - Remove member
  http.delete('/api/groups/:groupId/members/:memberId', async ({ params }) => {
    await randomDelay();

    const { groupId, memberId } = params;

    const memberIndex = members.findIndex(
      (m) => m.id === memberId && m.groupId === groupId,
    );

    if (memberIndex === -1) {
      return HttpResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = members[memberIndex];

    // Cannot revoke Owner
    if (member.role === GroupRole.OWNER) {
      return HttpResponse.json(
        { error: 'Cannot revoke group owner' },
        { status: 403 },
      );
    }

    members.splice(memberIndex, 1);

    // Update group member count
    const groupIndex = groups.findIndex((g) => g.groupId === groupId);
    if (groupIndex !== -1) {
      groups[groupIndex].memberCount -= 1;
    }

    return HttpResponse.json({ message: 'Member removed successfully' }, { status: 200 });
  }),
];
