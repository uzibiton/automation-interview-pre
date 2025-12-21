/**
 * Invitation-related type definitions
 */

import { GroupRole } from './GroupMember';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  inviterId: string;
  inviterName: string;
  email: string;
  role: GroupRole;
  token: string;
  status: InvitationStatus;
  message?: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitationDto {
  email: string;
  role: GroupRole;
  message?: string;
}

export interface AcceptInvitationDto {
  token: string;
}

export interface DeclineInvitationDto {
  token: string;
}
