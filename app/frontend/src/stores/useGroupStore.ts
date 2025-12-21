/**
 * Group Management Store using Zustand
 *
 * Global state management for groups, members, invitations, and invite links.
 * Uses Mock Service Worker (MSW) API handlers from TASK-002-015.
 */

import { create } from 'zustand';
import { Group, CreateGroupDto, UpdateGroupDto } from '../types/Group';
import { GroupMember, GroupRole } from '../types/GroupMember';
import { Invitation, CreateInvitationDto } from '../types/Invitation';
import { InviteLink, CreateInviteLinkDto } from '../types/InviteLink';

/**
 * Group Store State Interface
 */
interface GroupState {
  // State
  currentGroup: Group | null;
  members: GroupMember[];
  invitations: Invitation[];
  inviteLinks: InviteLink[];
  loading: boolean;
  error: string | null;

  // Actions - Group Management
  fetchCurrentGroup: () => Promise<void>;
  createGroup: (dto: CreateGroupDto) => Promise<Group>;
  updateGroup: (id: string, dto: UpdateGroupDto) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;

  // Actions - Member Management
  fetchMembers: (groupId?: string) => Promise<void>;
  changeRole: (groupId: string, memberId: string, role: GroupRole) => Promise<GroupMember>;
  removeMember: (groupId: string, memberId: string) => Promise<void>;

  // Actions - Invitation Management
  fetchInvitations: (groupId: string) => Promise<void>;
  sendEmailInvitation: (groupId: string, dto: CreateInvitationDto) => Promise<Invitation>;
  fetchInviteLinks: (groupId: string) => Promise<void>;
  generateInviteLink: (groupId: string, dto: CreateInviteLinkDto) => Promise<InviteLink>;
  revokeInviteLink: (linkId: string) => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

/**
 * API Base URL - reads from environment variable
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Helper function to make API requests with authentication
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = USE_MOCK_API
    ? `/api${endpoint}` // MSW intercepts requests to /api/*
    : `${API_BASE_URL}${endpoint}`;

  // Get authentication token from localStorage (guarded for Node/Jest environments)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Initial state
 */
const initialState = {
  currentGroup: null,
  members: [],
  invitations: [],
  inviteLinks: [],
  loading: false,
  error: null,
};

/**
 * Zustand Store for Group Management
 */
export const useGroupStore = create<GroupState>((set, get) => ({
  ...initialState,

  // Action: Fetch current user's group
  fetchCurrentGroup: async () => {
    set({ loading: true, error: null });
    try {
      const group = await apiRequest<Group>('/groups/current');
      set({ currentGroup: group, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current group';
      set({ error: errorMessage, loading: false, currentGroup: null });
      throw error;
    }
  },

  // Action: Create a new group
  createGroup: async (dto: CreateGroupDto) => {
    set({ loading: true, error: null });
    try {
      const newGroup = await apiRequest<Group>('/groups', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
      set({ currentGroup: newGroup, loading: false });
      return newGroup;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create group';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Update group details
  updateGroup: async (id: string, dto: UpdateGroupDto) => {
    set({ loading: true, error: null });
    try {
      const updatedGroup = await apiRequest<Group>(`/groups/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
      });
      set({ currentGroup: updatedGroup, loading: false });
      return updatedGroup;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update group';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Delete group
  deleteGroup: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<{ message: string }>(`/groups/${id}`, {
        method: 'DELETE',
      });
      set({ currentGroup: null, members: [], invitations: [], inviteLinks: [], loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete group';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Fetch group members
  fetchMembers: async (groupId?: string) => {
    const id = groupId || get().currentGroup?.id;
    if (!id) {
      set({ error: 'No group ID provided', members: [] });
      return;
    }

    set({ loading: true, error: null });
    try {
      const members = await apiRequest<GroupMember[]>(`/groups/${id}/members`);
      set({ members, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch members';
      set({ error: errorMessage, loading: false, members: [] });
    }
  },

  // Action: Change member role
  changeRole: async (groupId: string, memberId: string, role: GroupRole) => {
    set({ loading: true, error: null });
    try {
      const updatedMember = await apiRequest<GroupMember>(
        `/groups/${groupId}/members/${memberId}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role }),
        },
      );

      // Update the member in the local state
      set((state) => ({
        members: state.members.map((m) => (m.id === memberId ? updatedMember : m)),
        loading: false,
      }));

      return updatedMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change role';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Remove member from group
  removeMember: async (groupId: string, memberId: string) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<{ message: string }>(`/groups/${groupId}/members/${memberId}`, {
        method: 'DELETE',
      });

      // Remove the member from local state and update memberCount
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
        currentGroup: state.currentGroup
          ? { ...state.currentGroup, memberCount: state.currentGroup.memberCount - 1 }
          : null,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Fetch pending invitations
  fetchInvitations: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const invitations = await apiRequest<Invitation[]>(`/invitations?groupId=${groupId}`);
      set({ invitations, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invitations';
      set({ error: errorMessage, loading: false, invitations: [] });
    }
  },

  // Action: Send email invitation
  sendEmailInvitation: async (groupId: string, dto: CreateInvitationDto) => {
    set({ loading: true, error: null });
    try {
      const invitation = await apiRequest<Invitation>('/invitations', {
        method: 'POST',
        body: JSON.stringify({ ...dto, groupId }),
      });

      // Add to local state
      set((state) => ({
        invitations: [...state.invitations, invitation],
        loading: false,
      }));

      return invitation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Fetch active invite links
  fetchInviteLinks: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const inviteLinks = await apiRequest<InviteLink[]>(`/invite-links?groupId=${groupId}`);
      set({ inviteLinks, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invite links';
      set({ error: errorMessage, loading: false, inviteLinks: [] });
    }
  },

  // Action: Generate invite link
  generateInviteLink: async (groupId: string, dto: CreateInviteLinkDto) => {
    set({ loading: true, error: null });
    try {
      const inviteLink = await apiRequest<InviteLink>('/invite-links', {
        method: 'POST',
        body: JSON.stringify({ ...dto, groupId }),
      });

      // Add to local state
      set((state) => ({
        inviteLinks: [...state.inviteLinks, inviteLink],
        loading: false,
      }));

      return inviteLink;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate invite link';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Action: Revoke invite link
  revokeInviteLink: async (linkId: string) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<{ message: string }>(`/invite-links/${linkId}`, {
        method: 'DELETE',
      });

      // Update local state to mark as inactive
      set((state) => ({
        inviteLinks: state.inviteLinks.map((link) =>
          link.id === linkId ? { ...link, isActive: false } : link,
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to revoke invite link';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Utility: Clear error
  clearError: () => set({ error: null }),

  // Utility: Reset store to initial state
  reset: () => set(initialState),
}));
