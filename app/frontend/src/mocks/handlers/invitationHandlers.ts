/**
 * MSW handlers for Invitation API endpoints
 */

import { http, HttpResponse, delay } from 'msw';
import { mockGroups } from '../fixtures/groups.fixture';
import { mockMembers } from '../fixtures/members.fixture';
import { mockInvitations } from '../fixtures/invitations.fixture';
import { mockInviteLinks } from '../fixtures/inviteLinks.fixture';
import { CreateInvitationDto, InvitationStatus } from '../../types/Invitation';
import { CreateInviteLinkDto } from '../../types/InviteLink';
import { GroupRole } from '../../types/GroupMember';

// Constants for mock authentication
const MOCK_USER_ID = 'user-1';

// In-memory store
let invitations = [...mockInvitations];
let inviteLinks = [...mockInviteLinks];

// Helpers that operate on the mutable stores
const findInvitationByToken = (token: string) =>
  invitations.find((invitation) => invitation.token === token);

const getPendingInvitations = (groupId: string) =>
  invitations.filter(
    (invitation) =>
      invitation.groupId === groupId && invitation.status === InvitationStatus.PENDING,
  );

const getActiveInviteLinks = (groupId: string) =>
  inviteLinks.filter((link) => link.groupId === groupId && link.isActive);

const getInviteLinkByToken = (token: string) => inviteLinks.find((link) => link.token === token);

// Helper to generate random delay
const randomDelay = () => delay(200 + Math.random() * 300);

// Helper to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper to generate random token
const generateToken = (length: number = 32): string => {
  // Use crypto.getRandomValues() for better security
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const invitationHandlers = [
  // GET /api/invitations/:token - Get invitation details by token
  http.get('/api/invitations/:token', async ({ params }) => {
    await randomDelay();

    const { token } = params;
    const invitation = findInvitationByToken(token as string);

    if (!invitation) {
      return HttpResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Return invitation details
    return HttpResponse.json(invitation, { status: 200 });
  }),

  // POST /api/invitations - Send email invitation
  http.post('/api/invitations', async ({ request }) => {
    await randomDelay();

    const body = (await request.json()) as CreateInvitationDto & { groupId: string };

    // Validation: Email
    if (!body.email || !isValidEmail(body.email)) {
      return HttpResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Validation: Role
    if (!Object.values(GroupRole).includes(body.role)) {
      return HttpResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if email already invited (pending)
    const existingInvitation = invitations.find(
      (inv) =>
        inv.email === body.email &&
        inv.groupId === body.groupId &&
        inv.status === InvitationStatus.PENDING,
    );

    if (existingInvitation) {
      return HttpResponse.json({ error: 'This email has already been invited' }, { status: 400 });
    }

    // Get group and inviter details from fixtures
    const groupId = body.groupId || 'group-1';
    const group = mockGroups.find((g) => g.id === groupId);
    const inviter = mockMembers.find((m) => m.userId === MOCK_USER_ID);

    const newInvitation = {
      id: `invitation-${crypto.randomUUID()}`,
      groupId,
      groupName: group?.name || 'Unknown Group',
      inviterId: MOCK_USER_ID,
      inviterName: inviter?.name || 'Unknown User',
      email: body.email,
      role: body.role,
      token: `inv-token-${generateToken(16)}`,
      status: InvitationStatus.PENDING,
      message: body.message,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    invitations.push(newInvitation);

    return HttpResponse.json(newInvitation, { status: 201 });
  }),

  // POST /api/invitations/:token/accept - Accept invitation
  http.post('/api/invitations/:token/accept', async ({ params }) => {
    await randomDelay();

    const { token } = params;
    const invitation = findInvitationByToken(token as string);

    if (!invitation) {
      return HttpResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      return HttpResponse.json({ error: 'This invitation has expired' }, { status: 400 });
    }

    // Check if already accepted
    if (invitation.status === InvitationStatus.ACCEPTED) {
      return HttpResponse.json(
        { error: 'This invitation has already been accepted' },
        { status: 400 },
      );
    }

    // Check if declined
    if (invitation.status === InvitationStatus.DECLINED) {
      return HttpResponse.json({ error: 'This invitation has been declined' }, { status: 400 });
    }

    // Update invitation status
    const invitationIndex = invitations.findIndex((inv) => inv.token === token);
    if (invitationIndex !== -1) {
      invitations[invitationIndex] = {
        ...invitations[invitationIndex],
        status: InvitationStatus.ACCEPTED,
      };
    }

    // Add member to the group (import members from groupHandlers would cause circular dependency,
    // so we need to access it through the module)
    const newMember = {
      id: `member-${crypto.randomUUID()}`,
      groupId: invitation.groupId,
      userId: MOCK_USER_ID,
      name: invitation.email.split('@')[0],
      email: invitation.email,
      role: invitation.role,
      joinedAt: new Date().toISOString(),
    };

    // Access members array from mockMembers and add the new member
    mockMembers.push(newMember);

    return HttpResponse.json(
      {
        message: 'Invitation accepted successfully',
        groupId: invitation.groupId,
        role: invitation.role,
      },
      { status: 200 },
    );
  }),

  // POST /api/invitations/:token/decline - Decline invitation
  http.post('/api/invitations/:token/decline', async ({ params }) => {
    await randomDelay();

    const { token } = params;
    const invitation = findInvitationByToken(token as string);

    if (!invitation) {
      return HttpResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return HttpResponse.json({ error: 'This invitation cannot be declined' }, { status: 400 });
    }

    // Update invitation status
    const invitationIndex = invitations.findIndex((inv) => inv.token === token);
    if (invitationIndex !== -1) {
      invitations[invitationIndex] = {
        ...invitations[invitationIndex],
        status: InvitationStatus.DECLINED,
      };
    }

    return HttpResponse.json({ message: 'Invitation declined' }, { status: 200 });
  }),

  // GET /api/invitations?groupId=xxx - Get pending invitations for a group
  http.get('/api/invitations', async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const groupId = url.searchParams.get('groupId');

    if (!groupId) {
      return HttpResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

    const pendingInvitations = getPendingInvitations(groupId);
    return HttpResponse.json(pendingInvitations, { status: 200 });
  }),

  // POST /api/invite-links - Generate invite link
  http.post('/api/invite-links', async ({ request }) => {
    await randomDelay();

    const body = (await request.json()) as CreateInviteLinkDto & { groupId: string };

    // Validation: Role
    if (!Object.values(GroupRole).includes(body.role)) {
      return HttpResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Validation: Max uses
    if (body.maxUses !== undefined && body.maxUses !== null && body.maxUses < 1) {
      return HttpResponse.json(
        { error: 'Max uses must be at least 1 or null for unlimited' },
        { status: 400 },
      );
    }

    // Get creator details from fixtures (group variable removed as unused)
    const groupId = body.groupId || 'group-1';
    const creator = mockMembers.find((m) => m.userId === MOCK_USER_ID);

    const newLink = {
      id: `link-${crypto.randomUUID()}`,
      groupId,
      createdBy: MOCK_USER_ID,
      createdByName: creator?.name || 'Unknown User',
      token: generateToken(8).toUpperCase(),
      defaultRole: body.role,
      maxUses: body.maxUses || null,
      usesCount: 0,
      expiresAt: body.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    inviteLinks.push(newLink);

    return HttpResponse.json(newLink, { status: 201 });
  }),

  // POST /api/invite-links/:token/join - Join via invite link
  http.post('/api/invite-links/:token/join', async ({ params }) => {
    await randomDelay();

    const { token } = params;
    const link = getInviteLinkByToken(token as string);

    if (!link) {
      return HttpResponse.json({ error: 'Invite link not found' }, { status: 404 });
    }

    // Check if active
    if (!link.isActive) {
      return HttpResponse.json({ error: 'This invite link has been revoked' }, { status: 400 });
    }

    // Check if expired
    if (new Date(link.expiresAt) < new Date()) {
      return HttpResponse.json({ error: 'This invite link has expired' }, { status: 400 });
    }

    // Check max uses
    if (link.maxUses !== null && link.usesCount >= link.maxUses) {
      return HttpResponse.json(
        { error: 'This invite link has reached its maximum uses' },
        { status: 400 },
      );
    }

    // Update uses count
    const linkIndex = inviteLinks.findIndex((l) => l.token === token);
    if (linkIndex !== -1) {
      inviteLinks[linkIndex] = {
        ...inviteLinks[linkIndex],
        usesCount: inviteLinks[linkIndex].usesCount + 1,
      };
    }

    // Add member to the group
    const newMember = {
      id: `member-${crypto.randomUUID()}`,
      groupId: link.groupId,
      userId: MOCK_USER_ID,
      name: 'New User',
      email: 'newuser@example.com',
      role: link.defaultRole,
      joinedAt: new Date().toISOString(),
    };

    mockMembers.push(newMember);

    return HttpResponse.json(
      {
        message: 'Successfully joined group via invite link',
        groupId: link.groupId,
        role: link.defaultRole,
      },
      { status: 200 },
    );
  }),

  // DELETE /api/invite-links/:id - Revoke invite link
  http.delete('/api/invite-links/:id', async ({ params }) => {
    await randomDelay();

    const { id } = params;
    const linkIndex = inviteLinks.findIndex((link) => link.id === id);

    if (linkIndex === -1) {
      return HttpResponse.json({ error: 'Invite link not found' }, { status: 404 });
    }

    // Deactivate the link
    inviteLinks[linkIndex] = {
      ...inviteLinks[linkIndex],
      isActive: false,
    };

    return HttpResponse.json({ message: 'Invite link revoked successfully' }, { status: 200 });
  }),

  // GET /api/invite-links?groupId=xxx - Get active invite links
  http.get('/api/invite-links', async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const groupId = url.searchParams.get('groupId');

    if (!groupId) {
      return HttpResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

    const activeLinks = getActiveInviteLinks(groupId);
    return HttpResponse.json(activeLinks, { status: 200 });
  }),
];
