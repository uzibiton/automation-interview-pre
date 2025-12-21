/**
 * Invite Link-related type definitions
 */

import { GroupRole } from './GroupMember';

export interface InviteLink {
  id: string;
  groupId: string;
  createdBy: string;
  createdByName: string;
  token: string;
  defaultRole: GroupRole;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateInviteLinkDto {
  role: GroupRole;
  maxUses?: number | null;
  expiresAt?: string;
}

export interface JoinViaInviteLinkDto {
  token: string;
}
