/**
 * Group-related type definitions for Group Management feature
 */

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
}

export interface GroupResponseDto {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  memberCount: number;
  createdAt: string;
}
