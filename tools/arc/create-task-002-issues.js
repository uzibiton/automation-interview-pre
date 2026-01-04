#!/usr/bin/env node

/**
 * Create Missing TASK-002 GitHub Issues
 *
 * Creates GitHub issues for Phase 0-2 (backend) and Phase 4 (testing)
 * Phase 3 (UI) issues already exist (#116-126)
 */

import { execSync } from 'child_process';

// Missing issues mapping
const MISSING_ISSUES = [
  // Phase 0: Database (2 tasks)
  {
    id: '001',
    title: 'Create Database Migrations',
    phase: 'phase-0-db',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-0-db', 'priority-critical', 'backend', 'database', 'migration'],
    effort: '1.5 days',
    description:
      'Create TypeORM migrations for 5 new tables (groups, group_members, invitations, invite_links, audit_log)',
  },
  {
    id: '002',
    title: 'Add Group Fields to Users Table',
    phase: 'phase-0-db',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-0-db', 'priority-critical', 'backend', 'database', 'migration'],
    effort: '0.5 days',
    description: 'Add group context to users table (optional - can be derived from group_members)',
  },

  // Phase 1: Auth Service (8 tasks)
  {
    id: '003',
    title: 'Create Group Entity and DTOs',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service'],
    effort: '1 day',
    description: 'TypeORM entities and DTOs for groups with validation',
  },
  {
    id: '004',
    title: 'Create GroupMember, Invitation, InviteLink Entities',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service'],
    effort: '1.5 days',
    description:
      'TypeORM entities for member management (GroupMember, Invitation, InviteLink, AuditLog)',
  },
  {
    id: '005',
    title: 'Implement Groups Service (CRUD)',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service'],
    effort: '2 days',
    description: 'Business logic for group management (create, get, update, delete)',
  },
  {
    id: '006',
    title: 'Implement Invitations Service',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service'],
    effort: '2 days',
    description: 'Email invitation logic (send, accept, decline, cancel)',
  },
  {
    id: '007',
    title: 'Implement InviteLinks Service',
    phase: 'phase-1-auth',
    priority: 'priority-high',
    labels: ['TASK-002', 'phase-1-auth', 'priority-high', 'backend', 'auth-service'],
    effort: '1.5 days',
    description: 'Shareable invite link logic (generate, join, revoke)',
  },
  {
    id: '008',
    title: 'Implement Members Management Service',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service'],
    effort: '1.5 days',
    description: 'Member CRUD and role management (list, change role, remove, register)',
  },
  {
    id: '009',
    title: 'Implement Permission Matrix Service',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: [
      'TASK-002',
      'phase-1-auth',
      'priority-critical',
      'backend',
      'auth-service',
      'security',
    ],
    effort: '1 day',
    description: 'Permission checking logic with role-based access control',
  },
  {
    id: '010',
    title: 'Create Groups Controller with API Endpoints',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'auth-service', 'api'],
    effort: '1.5 days',
    description: 'REST API endpoints for groups (13 endpoints total)',
  },

  // Phase 2: API Service (4 tasks)
  {
    id: '011',
    title: 'Update JWT Payload with Group Context',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'auth', 'security'],
    effort: '1 day',
    description: 'Add groupId and role to JWT payload for authorization',
  },
  {
    id: '012',
    title: 'Create RBAC Guard for API Service',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'api-service', 'security'],
    effort: '2 days',
    description: 'Permission enforcement guard for API endpoints with @RequirePermission decorator',
  },
  {
    id: '013',
    title: 'Update Expenses Service for Group Context',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'api-service'],
    effort: '1.5 days',
    description: 'Filter expenses by groupId, add creator attribution',
  },
  {
    id: '014',
    title: 'Update Categories Service for Group Context',
    phase: 'phase-2-api',
    priority: 'priority-medium',
    labels: ['TASK-002', 'phase-2-api', 'priority-medium', 'backend', 'api-service'],
    effort: '1 day',
    description: 'Filter categories by groupId for group-specific categories',
  },

  // Phase 4: Testing (5 tasks)
  {
    id: '025',
    title: 'Write Unit Tests (Backend Services)',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-002', 'phase-4-test', 'priority-high', 'testing', 'backend'],
    effort: '3 days',
    description: 'Comprehensive unit testing for all services (>90% coverage, 50+ tests)',
  },
  {
    id: '026',
    title: 'Write Integration Tests (API Endpoints)',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-002', 'phase-4-test', 'priority-high', 'testing', 'backend', 'integration'],
    effort: '3 days',
    description: 'API endpoint testing with Supertest (all 15 endpoints, 45+ tests)',
  },
  {
    id: '027',
    title: 'Write E2E Tests (Critical User Flows)',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-002', 'phase-4-test', 'priority-high', 'testing', 'e2e'],
    effort: '4 days',
    description: 'End-to-end testing with Playwright (20 test suites covering critical flows)',
  },
  {
    id: '028',
    title: 'Security Testing (Manual + Automated)',
    phase: 'phase-4-test',
    priority: 'priority-critical',
    labels: ['TASK-002', 'phase-4-test', 'priority-critical', 'testing', 'security', 'audit'],
    effort: '2 days',
    description: 'OWASP Top 10 and authorization testing (15 security test cases)',
  },
  {
    id: '029',
    title: 'Performance Testing (Load Tests)',
    phase: 'phase-4-test',
    priority: 'priority-medium',
    labels: ['TASK-002', 'phase-4-test', 'priority-medium', 'testing', 'performance'],
    effort: '2 days',
    description: 'Load testing with k6 (4 performance scenarios, HTML reports)',
  },
];

// Additional labels needed
const ADDITIONAL_LABELS = [
  { name: 'phase-1-auth', description: 'Auth service backend phase', color: 'D93F0B' },
  { name: 'phase-2-api', description: 'API updates phase', color: 'D93F0B' },
  { name: 'auth-service', description: 'Auth service component', color: '5319E7' },
  { name: 'api-service', description: 'API service component', color: '5319E7' },
  { name: 'auth', description: 'Authentication/authorization', color: 'B60205' },
];

console.log('=== Creating Additional Labels ===\n');
ADDITIONAL_LABELS.forEach((label) => {
  try {
    execSync(
      `gh label create "${label.name}" --description "${label.description}" --color "${label.color}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe',
      },
    );
    console.log(`✓ Created label: ${label.name}`);
  } catch (error) {
    if (error.stderr && error.stderr.includes('already exists')) {
      console.log(`  Label already exists: ${label.name}`);
    } else {
      console.error(`✗ Failed to create label ${label.name}:`, error.message);
    }
  }
});

console.log('\n=== Creating Missing GitHub Issues ===\n');

MISSING_ISSUES.forEach((task, index) => {
  const taskId = `TASK-002-${task.id}`;
  const title = `[${taskId}] ${task.title}`;
  const labels = task.labels.join(',');
  const body = `**Priority**: ${task.priority.replace('priority-', '')} | **Effort**: ${task.effort}

**Phase**: ${task.phase}  
**Description**: ${task.description}

**Reference**: [TASKS-002 Document](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md#task-002-${task.id})

**Detailed Acceptance Criteria**: See TASKS-002 document for complete checklist (8-15 criteria per task)

---
*Auto-generated from TASKS-002-group-management.md*`;

  try {
    const result = execSync(
      `gh issue create --title "${title}" --label "${labels}" --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe',
      },
    );

    const issueUrl = result.trim();
    const issueNumber = issueUrl.split('/').pop();

    console.log(`✓ Created #${issueNumber}: ${taskId} ${task.title}`);
  } catch (error) {
    console.error(`✗ Failed to create ${taskId}:`, error.message);
  }

  // Small delay to avoid rate limiting
  if ((index + 1) % 5 === 0) {
    const sleepMs = 2000;
    console.log(`  [Pausing ${sleepMs}ms to avoid rate limiting...]`);
    execSync(`node -e "setTimeout(() => {}, ${sleepMs})"`, { stdio: 'pipe' });
  }
});

console.log('\n=== Summary ===');
console.log(`Total issues created: ${MISSING_ISSUES.length}`);
console.log(
  '\nVerify: https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-002',
);
