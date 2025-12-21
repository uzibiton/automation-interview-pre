/**
 * Invitation Store using Zustand
 *
 * Global state management for invitations and invite links.
 * Uses Mock Service Worker (MSW) API handlers from TASK-002-015.
 */

import { create } from 'zustand';
import { Invitation, CreateInvitationDto } from '../types/Invitation';
import { InviteLink, CreateInviteLinkDto } from '../types/InviteLink';
import { GroupRole } from '../types/GroupMember';
import { env } from '../config/env';

/**
 * Invitation Store State Interface
 */
interface InvitationState {
  // State
  invitations: Invitation[];
  links: InviteLink[];
  loading: boolean;
  error: string | null;

  // Actions - Invitation Management
  fetchInvitations: (groupId: string) => Promise<void>;
  sendEmailInvitation: (
    groupId: string,
    email: string,
    role: GroupRole,
    message?: string,
  ) => Promise<Invitation>;

  // Actions - Invite Link Management
  fetchInviteLinks: (groupId: string) => Promise<void>;
  generateInviteLink: (
    groupId: string,
    role: GroupRole,
    maxUses?: number | null,
  ) => Promise<InviteLink>;
  revokeLink: (linkId: string) => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

/**
 * Helper function to make API requests
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = env.USE_MOCK_API
    ? `/api${endpoint}` // MSW intercepts requests to /api/*
    : `${env.API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
  invitations: [],
  links: [],
  loading: false,
  error: null,
};

/**
 * Zustand Store for Invitation Management
 */
export const useInvitationStore = create<InvitationState>((set) => ({
  ...initialState,

  // Action: Fetch pending invitations for a group
  fetchInvitations: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const invitations = await apiRequest<Invitation[]>(`/invitations?groupId=${groupId}`);
      set({ invitations, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invitations';
      set({ error: errorMessage, loading: false, invitations: [] });
      throw error;
    }
  },

  // Action: Send email invitation
  sendEmailInvitation: async (
    groupId: string,
    email: string,
    role: GroupRole,
    message?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const dto: CreateInvitationDto & { groupId: string } = {
        groupId,
        email,
        role,
        message,
      };

      const invitation = await apiRequest<Invitation>('/invitations', {
        method: 'POST',
        body: JSON.stringify(dto),
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

  // Action: Fetch active invite links for a group
  fetchInviteLinks: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const links = await apiRequest<InviteLink[]>(`/invite-links?groupId=${groupId}`);
      set({ links, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invite links';
      set({ error: errorMessage, loading: false, links: [] });
      throw error;
    }
  },

  // Action: Generate invite link
  generateInviteLink: async (groupId: string, role: GroupRole, maxUses?: number | null) => {
    set({ loading: true, error: null });
    try {
      const dto: CreateInviteLinkDto & { groupId: string } = {
        groupId,
        role,
        maxUses: maxUses ?? null,
      };

      const inviteLink = await apiRequest<InviteLink>('/invite-links', {
        method: 'POST',
        body: JSON.stringify(dto),
      });

      // Add to local state
      set((state) => ({
        links: [...state.links, inviteLink],
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
  revokeLink: async (linkId: string) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<{ message: string }>(`/invite-links/${linkId}`, {
        method: 'DELETE',
      });

      // Update local state to mark as inactive
      set((state) => ({
        links: state.links.map((link) =>
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
