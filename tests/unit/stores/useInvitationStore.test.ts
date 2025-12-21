/**
 * Unit tests for useInvitationStore
 *
 * Tests the invitation store actions and state management
 * with mocked API responses
 */

import { useInvitationStore } from '../../../app/frontend/src/stores/useInvitationStore';
import { GroupRole } from '../../../app/frontend/src/types/GroupMember';
import { InvitationStatus } from '../../../app/frontend/src/types/Invitation';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock successful API responses
const mockFetchSuccess = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

// Helper to mock API errors
const mockFetchError = (status: number, error: string) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: error,
    json: async () => ({ error }),
  });
};

describe('useInvitationStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useInvitationStore.getState().reset();
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useInvitationStore.getState();
      
      expect(state.invitations).toEqual([]);
      expect(state.links).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('fetchInvitations', () => {
    it('should fetch invitations successfully', async () => {
      const mockInvitations = [
        {
          id: 'invitation-1',
          groupId: 'group-1',
          groupName: 'Test Group',
          inviterId: 'user-1',
          inviterName: 'John Doe',
          email: 'test@example.com',
          role: GroupRole.MEMBER,
          token: 'test-token',
          status: InvitationStatus.PENDING,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      mockFetchSuccess(mockInvitations);

      await useInvitationStore.getState().fetchInvitations('group-1');

      const state = useInvitationStore.getState();
      expect(state.invitations).toEqual(mockInvitations);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle fetch invitations error', async () => {
      mockFetchError(500, 'Server error');

      await expect(
        useInvitationStore.getState().fetchInvitations('group-1')
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.invitations).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toContain('Failed to fetch invitations');
    });

    it('should set loading state during fetch', async () => {
      mockFetchSuccess([]);

      const fetchPromise = useInvitationStore.getState().fetchInvitations('group-1');
      
      // Check loading state is true during fetch (before promise resolves)
      expect(useInvitationStore.getState().loading).toBe(true);
      
      await fetchPromise;
      
      // Check loading state is false after fetch
      expect(useInvitationStore.getState().loading).toBe(false);
    });
  });

  describe('sendEmailInvitation', () => {
    it('should send email invitation successfully', async () => {
      const mockInvitation = {
        id: 'invitation-2',
        groupId: 'group-1',
        groupName: 'Test Group',
        inviterId: 'user-1',
        inviterName: 'John Doe',
        email: 'newuser@example.com',
        role: GroupRole.ADMIN,
        token: 'new-token',
        status: InvitationStatus.PENDING,
        message: 'Welcome!',
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      mockFetchSuccess(mockInvitation);

      const result = await useInvitationStore.getState().sendEmailInvitation(
        'group-1',
        'newuser@example.com',
        GroupRole.ADMIN,
        'Welcome!'
      );

      expect(result).toEqual(mockInvitation);
      
      const state = useInvitationStore.getState();
      expect(state.invitations).toContainEqual(mockInvitation);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle invalid email error', async () => {
      mockFetchError(400, 'Valid email is required');

      await expect(
        useInvitationStore.getState().sendEmailInvitation(
          'group-1',
          'invalid-email',
          GroupRole.MEMBER
        )
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toContain('Failed to send invitation');
    });

    it('should handle duplicate invitation error', async () => {
      mockFetchError(400, 'This email has already been invited');

      await expect(
        useInvitationStore.getState().sendEmailInvitation(
          'group-1',
          'duplicate@example.com',
          GroupRole.MEMBER
        )
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.error).toContain('Failed to send invitation');
    });
  });

  describe('fetchInviteLinks', () => {
    it('should fetch invite links successfully', async () => {
      const mockLinks = [
        {
          id: 'link-1',
          groupId: 'group-1',
          createdBy: 'user-1',
          createdByName: 'John Doe',
          token: 'ABCD1234',
          defaultRole: GroupRole.MEMBER,
          maxUses: 10,
          usesCount: 3,
          expiresAt: new Date().toISOString(),
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];

      mockFetchSuccess(mockLinks);

      await useInvitationStore.getState().fetchInviteLinks('group-1');

      const state = useInvitationStore.getState();
      expect(state.links).toEqual(mockLinks);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle fetch invite links error', async () => {
      mockFetchError(403, 'Unauthorized');

      await expect(
        useInvitationStore.getState().fetchInviteLinks('group-1')
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.links).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toContain('Failed to fetch invite links');
    });
  });

  describe('generateInviteLink', () => {
    it('should generate invite link successfully', async () => {
      const mockLink = {
        id: 'link-2',
        groupId: 'group-1',
        createdBy: 'user-1',
        createdByName: 'John Doe',
        token: 'EFGH5678',
        defaultRole: GroupRole.VIEWER,
        maxUses: null,
        usesCount: 0,
        expiresAt: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      mockFetchSuccess(mockLink);

      const result = await useInvitationStore.getState().generateInviteLink(
        'group-1',
        GroupRole.VIEWER,
        null
      );

      expect(result).toEqual(mockLink);
      
      const state = useInvitationStore.getState();
      expect(state.links).toContainEqual(mockLink);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should generate link with max uses', async () => {
      const mockLink = {
        id: 'link-3',
        groupId: 'group-1',
        createdBy: 'user-1',
        createdByName: 'John Doe',
        token: 'IJKL9012',
        defaultRole: GroupRole.MEMBER,
        maxUses: 5,
        usesCount: 0,
        expiresAt: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      mockFetchSuccess(mockLink);

      const result = await useInvitationStore.getState().generateInviteLink(
        'group-1',
        GroupRole.MEMBER,
        5
      );

      expect(result).toEqual(mockLink);
      expect(result.maxUses).toBe(5);
    });

    it('should handle invalid role error', async () => {
      mockFetchError(400, 'Invalid role');

      await expect(
        useInvitationStore.getState().generateInviteLink(
          'group-1',
          'invalid-role' as GroupRole,
          10
        )
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.error).toContain('Failed to generate invite link');
    });
  });

  describe('revokeLink', () => {
    it('should revoke invite link successfully', async () => {
      // First, add a link to the store
      const mockLink = {
        id: 'link-1',
        groupId: 'group-1',
        createdBy: 'user-1',
        createdByName: 'John Doe',
        token: 'ABCD1234',
        defaultRole: GroupRole.MEMBER,
        maxUses: 10,
        usesCount: 3,
        expiresAt: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      useInvitationStore.setState({ links: [mockLink] });

      mockFetchSuccess({ message: 'Invite link revoked successfully' });

      await useInvitationStore.getState().revokeLink('link-1');

      const state = useInvitationStore.getState();
      expect(state.links[0].isActive).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should handle revoke link not found error', async () => {
      mockFetchError(404, 'Invite link not found');

      await expect(
        useInvitationStore.getState().revokeLink('non-existent-id')
      ).rejects.toThrow();

      const state = useInvitationStore.getState();
      expect(state.error).toContain('Failed to revoke invite link');
    });
  });

  describe('Utility Actions', () => {
    it('should clear error', () => {
      useInvitationStore.setState({ error: 'Some error' });
      
      useInvitationStore.getState().clearError();
      
      expect(useInvitationStore.getState().error).toBe(null);
    });

    it('should reset store to initial state', () => {
      const mockInvitation = {
        id: 'invitation-1',
        groupId: 'group-1',
        groupName: 'Test Group',
        inviterId: 'user-1',
        inviterName: 'John Doe',
        email: 'test@example.com',
        role: GroupRole.MEMBER,
        token: 'test-token',
        status: InvitationStatus.PENDING,
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      useInvitationStore.setState({
        invitations: [mockInvitation],
        links: [],
        loading: true,
        error: 'Some error',
      });

      useInvitationStore.getState().reset();

      const state = useInvitationStore.getState();
      expect(state.invitations).toEqual([]);
      expect(state.links).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should handle network timeout', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

      await expect(
        useInvitationStore.getState().fetchInvitations('group-1')
      ).rejects.toThrow('Network timeout');

      const state = useInvitationStore.getState();
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network timeout');
    });

    it('should handle empty response', async () => {
      mockFetchSuccess([]);

      await useInvitationStore.getState().fetchInvitations('group-1');

      const state = useInvitationStore.getState();
      expect(state.invitations).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should preserve existing state when adding new invitation', async () => {
      const existingInvitation = {
        id: 'invitation-1',
        groupId: 'group-1',
        groupName: 'Test Group',
        inviterId: 'user-1',
        inviterName: 'John Doe',
        email: 'existing@example.com',
        role: GroupRole.MEMBER,
        token: 'existing-token',
        status: InvitationStatus.PENDING,
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      useInvitationStore.setState({ invitations: [existingInvitation] });

      const newInvitation = {
        id: 'invitation-2',
        groupId: 'group-1',
        groupName: 'Test Group',
        inviterId: 'user-1',
        inviterName: 'John Doe',
        email: 'new@example.com',
        role: GroupRole.ADMIN,
        token: 'new-token',
        status: InvitationStatus.PENDING,
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      mockFetchSuccess(newInvitation);

      await useInvitationStore.getState().sendEmailInvitation(
        'group-1',
        'new@example.com',
        GroupRole.ADMIN
      );

      const state = useInvitationStore.getState();
      expect(state.invitations).toHaveLength(2);
      expect(state.invitations).toContainEqual(existingInvitation);
      expect(state.invitations).toContainEqual(newInvitation);
    });
  });
});
