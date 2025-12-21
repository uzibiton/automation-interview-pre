#!/usr/bin/env node

/**
 * GitHub Issues Creator for TASK-002
 * 
 * This script helps create GitHub issues from TASKS-002 document.
 * 
 * Usage:
 *   node tools/create-task-issues.js [task-number]
 *   
 * Examples:
 *   node tools/create-task-issues.js 015        # Create TASK-002-015
 *   node tools/create-task-issues.js all        # Create all tasks
 *   node tools/create-task-issues.js phase3     # Create all Phase 3 tasks
 */

const tasks = [
  // Phase 0: Database
  {
    id: '001',
    title: 'Create Database Migrations for Groups Tables',
    phase: 'phase-0-db',
    priority: 'priority-critical',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-0-db', 'priority-critical', 'backend', 'database', 'auth-service'],
    dependencies: [],
    blocks: ['002', '003', '004'],
    requirements: 'FR-001, FR-002, FR-003, FR-004, FR-005, FR-006',
    design: 'HLD-002 Section 3.3 (Database Schema)',
  },
  {
    id: '002',
    title: 'Add Group Fields to Users Table',
    phase: 'phase-0-db',
    priority: 'priority-medium',
    effort: '0.5 days',
    labels: ['TASK-002', 'phase-0-db', 'priority-medium', 'backend', 'database', 'auth-service'],
    dependencies: ['001'],
    blocks: [],
    requirements: 'FR-001',
    design: 'HLD-002 Section 3.3',
  },

  // Phase 1: Auth Service
  {
    id: '003',
    title: 'Create Group Entity and DTOs',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '1 day',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['001'],
    blocks: ['005', '010'],
    requirements: 'FR-001',
    design: 'HLD-002 Section 4.1.1',
  },
  {
    id: '004',
    title: 'Create GroupMember, Invitation, InviteLink Entities',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '1 day',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['001'],
    blocks: ['006', '007', '008'],
    requirements: 'FR-002, FR-003, FR-006',
    design: 'HLD-002 Section 4.1.1',
  },
  {
    id: '005',
    title: 'Implement Groups Service (CRUD)',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['003'],
    blocks: ['010'],
    requirements: 'FR-001',
    design: 'HLD-002 Section 4.1.2',
  },
  {
    id: '006',
    title: 'Implement Invitations Service',
    phase: 'phase-1-auth',
    priority: 'priority-high',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-high', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['004'],
    blocks: ['010'],
    requirements: 'FR-002',
    design: 'HLD-002 Section 4.1.2',
  },
  {
    id: '007',
    title: 'Implement InviteLinks Service',
    phase: 'phase-1-auth',
    priority: 'priority-high',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-high', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['004'],
    blocks: ['010'],
    requirements: 'FR-003',
    design: 'HLD-002 Section 4.1.2',
  },
  {
    id: '008',
    title: 'Implement Members Management Service',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'nestjs', 'auth-service'],
    dependencies: ['004'],
    blocks: ['010'],
    requirements: 'FR-006',
    design: 'HLD-002 Section 4.1.2',
  },
  {
    id: '009',
    title: 'Implement Permission Matrix Service',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'security', 'auth-service'],
    dependencies: ['004'],
    blocks: ['010', '012'],
    requirements: 'FR-005',
    design: 'HLD-002 Section 4.1.3',
  },
  {
    id: '010',
    title: 'Create Groups Controller with API Endpoints',
    phase: 'phase-1-auth',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-1-auth', 'priority-critical', 'backend', 'api', 'auth-service'],
    dependencies: ['005', '006', '007', '008', '009'],
    blocks: [],
    requirements: 'FR-001, FR-002, FR-003, FR-006',
    design: 'HLD-002 Section 4.1.4',
  },

  // Phase 2: API Service
  {
    id: '011',
    title: 'Update JWT Payload with Group Context',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    effort: '1 day',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'jwt', 'auth-service'],
    dependencies: ['009'],
    blocks: ['012', '013', '014'],
    requirements: 'FR-005',
    design: 'HLD-002 Section 4.1.5',
  },
  {
    id: '012',
    title: 'Create RBAC Guard for API Service',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'security', 'api-service'],
    dependencies: ['009', '011'],
    blocks: [],
    requirements: 'FR-005',
    design: 'HLD-002 Section 4.2.1',
  },
  {
    id: '013',
    title: 'Update Expenses Service for Group Context',
    phase: 'phase-2-api',
    priority: 'priority-critical',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-2-api', 'priority-critical', 'backend', 'api-service', 'expenses'],
    dependencies: ['011'],
    blocks: [],
    requirements: 'US-009, US-010',
    design: 'HLD-002 Section 4.2.2',
  },
  {
    id: '014',
    title: 'Update Categories Service for Group Context',
    phase: 'phase-2-api',
    priority: 'priority-medium',
    effort: '1 day',
    labels: ['TASK-002', 'phase-2-api', 'priority-medium', 'backend', 'api-service', 'categories'],
    dependencies: ['011'],
    blocks: [],
    requirements: 'Non-functional (categories shared per group)',
    design: 'HLD-002 Section 4.2.2',
  },

  // Phase 3: Frontend
  {
    id: '015',
    title: 'Setup Mock API Infrastructure',
    phase: 'phase-3-ui',
    priority: 'priority-critical',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-critical', 'frontend', 'mocks', 'setup'],
    dependencies: [],
    blocks: ['016', '017', '018', '019', '020', '021', '022', '023', '024'],
    requirements: 'All Phase 3 tasks',
    design: 'Mock-first development strategy',
  },
  {
    id: '016',
    title: 'Create Group Management Store (Zustand)',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '1 day',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'state-management'],
    dependencies: ['015'],
    blocks: ['018', '019', '020', '021'],
    requirements: 'FR-001, FR-006',
    design: 'HLD-002 Section 4.3.1',
  },
  {
    id: '017',
    title: 'Create Invitation Store (Zustand)',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '0.5 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'state-management'],
    dependencies: ['015'],
    blocks: ['020', '024'],
    requirements: 'FR-002, FR-003',
    design: 'HLD-002 Section 4.3.1',
  },
  {
    id: '018',
    title: 'Create Group Creation Dialog Component',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'component'],
    dependencies: ['016'],
    blocks: ['022'],
    requirements: 'US-001 (FR-001)',
    design: 'HLD-002 Section 4.3.2',
  },
  {
    id: '019',
    title: 'Create Members List Table Component',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '2 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'component'],
    dependencies: ['016'],
    blocks: ['022'],
    requirements: 'US-006 (FR-006)',
    design: 'HLD-002 Section 4.3.3',
  },
  {
    id: '020',
    title: 'Create Invitation Modal Component',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '2 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'component'],
    dependencies: ['017'],
    blocks: ['022'],
    requirements: 'US-002, US-003 (FR-002, FR-003)',
    design: 'HLD-002 Section 4.3.3',
  },
  {
    id: '021',
    title: 'Create Role Change Dialog Component',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '1 day',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'component'],
    dependencies: ['016'],
    blocks: ['022'],
    requirements: 'US-007 (FR-006)',
    design: 'HLD-002 Section 4.3.3',
  },
  {
    id: '022',
    title: 'Create Group Dashboard Page',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '2 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'page'],
    dependencies: ['016', '018', '019'],
    blocks: [],
    requirements: 'US-001, US-006',
    design: 'HLD-002 Section 4.3.2',
  },
  {
    id: '023',
    title: 'Update Expense List to Show Creator Attribution',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '1 day',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'expenses'],
    dependencies: ['015'],
    blocks: [],
    requirements: 'US-009',
    design: 'HLD-002 Section 4.3.4',
  },
  {
    id: '024',
    title: 'Create Invitation Acceptance Page',
    phase: 'phase-3-ui',
    priority: 'priority-high',
    effort: '1.5 days',
    labels: ['TASK-002', 'phase-3-ui', 'priority-high', 'frontend', 'ui', 'page'],
    dependencies: ['017'],
    blocks: [],
    requirements: 'US-004 (FR-002, FR-003)',
    design: 'HLD-002 Section 4.3.5',
  },

  // Phase 4: Testing
  {
    id: '025',
    title: 'Write Unit Tests (Backend Services)',
    phase: 'phase-4-testing',
    priority: 'priority-high',
    effort: '3 days',
    labels: ['TASK-002', 'phase-4-testing', 'priority-high', 'testing', 'unit-tests', 'backend'],
    dependencies: [], // Can be done alongside backend development
    blocks: [],
    requirements: 'TEST-002',
    design: 'TEST-002 Section 6.1-6.6',
  },
  {
    id: '026',
    title: 'Write Integration Tests (API Endpoints)',
    phase: 'phase-4-testing',
    priority: 'priority-high',
    effort: '2 days',
    labels: ['TASK-002', 'phase-4-testing', 'priority-high', 'testing', 'integration-tests', 'api'],
    dependencies: [], // Can be done alongside API development
    blocks: [],
    requirements: 'TEST-002',
    design: 'TEST-002 Section 6.7',
  },
  {
    id: '027',
    title: 'Write E2E Tests (Critical User Flows)',
    phase: 'phase-4-testing',
    priority: 'priority-high',
    effort: '3 days',
    labels: ['TASK-002', 'phase-4-testing', 'priority-high', 'testing', 'e2e-tests', 'playwright'],
    dependencies: [], // Can start once UI components are ready
    blocks: [],
    requirements: 'TEST-002',
    design: 'TEST-002 Section 6.8',
  },
  {
    id: '028',
    title: 'Security Testing (Manual + Automated)',
    phase: 'phase-4-testing',
    priority: 'priority-critical',
    effort: '2 days',
    labels: ['TASK-002', 'phase-4-testing', 'priority-critical', 'testing', 'security', 'owasp'],
    dependencies: [], // Requires Phase 1 and Phase 2 complete
    blocks: [],
    requirements: 'TEST-002',
    design: 'TEST-002 Section 6.9',
  },
  {
    id: '029',
    title: 'Performance Testing (Load Tests)',
    phase: 'phase-4-testing',
    priority: 'priority-medium',
    effort: '2 days',
    labels: ['TASK-002', 'phase-4-testing', 'priority-medium', 'testing', 'performance'],
    dependencies: [], // Requires Phase 1 and Phase 2 complete
    blocks: [],
    requirements: 'TEST-002',
    design: 'TEST-002 Section 6.10',
  },
];

function generateIssueBody(task) {
  const depLinks = task.dependencies.length > 0 
    ? task.dependencies.map(d => `#TASK-002-${d}`).join(', ')
    : 'None';
  
  const blockLinks = task.blocks.length > 0
    ? task.blocks.map(b => `#TASK-002-${b}`).join(', ')
    : 'None';

  return `**Part of**: #69 (Group Management with Role-Based Permissions)

## Task Information

**Task ID**: TASK-002-${task.id}  
**Priority**: ${task.priority.replace('priority-', '')}  
**Effort**: ${task.effort}  
**Phase**: ${task.phase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}  
**Tracking**: [TASKS-002 Document](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md#task-002-${task.id})

## Requirements

- **Requirements**: ${task.requirements}
- **Design**: ${task.design}

## Dependencies

- **Depends on**: ${depLinks}
- **Blocks**: ${blockLinks}

## Labels

\`\`\`
${task.labels.join(', ')}
\`\`\`

## Instructions

1. Review the [TASKS-002 document](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/TASKS-002-group-management.md#task-002-${task.id}) for complete acceptance criteria
2. Check [REQ-002](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/product/requirements/REQ-002-group-management.md) for requirements details
3. Check [HLD-002](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/dev/designs/HLD-002-group-management.md) for design specifications
4. Add acceptance criteria checkboxes from TASKS-002 document
5. Update this issue as you progress
6. Link any PRs to this issue using "Closes #XXX" in PR description`;
}

function printTask(task) {
  console.log('\n' + '='.repeat(80));
  console.log(`TASK-002-${task.id}: ${task.title}`);
  console.log('='.repeat(80));
  console.log('\n📋 ISSUE TITLE:');
  console.log(`[TASK-002-${task.id}] ${task.title}`);
  console.log('\n📝 ISSUE BODY:');
  console.log(generateIssueBody(task));
  console.log('\n🏷️  LABELS:');
  console.log(task.labels.join(', '));
  console.log('\n');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'help' || !command) {
  console.log(`
GitHub Issues Creator for TASK-002

Usage:
  node tools/create-task-issues.js [command]

Commands:
  015              Print TASK-002-015 issue template
  all              Print all task issues
  phase3           Print all Phase 3 (UI) tasks
  help             Show this help message

Examples:
  node tools/create-task-issues.js 015
  node tools/create-task-issues.js phase3
  node tools/create-task-issues.js all
  `);
} else if (command === 'all') {
  tasks.forEach(printTask);
  console.log(`\n✅ Generated ${tasks.length} task issue templates\n`);
} else if (command.startsWith('phase')) {
  const phaseNum = command.replace('phase', '');
  const phaseTasks = tasks.filter(t => t.phase.includes(`phase-${phaseNum}`));
  phaseTasks.forEach(printTask);
  console.log(`\n✅ Generated ${phaseTasks.length} Phase ${phaseNum} task issue templates\n`);
} else {
  // Assume it's a task number
  const taskId = command.padStart(3, '0');
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    printTask(task);
  } else {
    console.error(`❌ Task TASK-002-${taskId} not found`);
    process.exit(1);
  }
}
