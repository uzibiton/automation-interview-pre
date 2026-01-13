#!/usr/bin/env node

/**
 * Retrofit GitHub Issues #84-#108 with TASK-003-XXX Naming Convention
 *
 * This script generates a mapping between existing GitHub issues and new
 * TASK-003-XXX task IDs based on the comprehensive TASKS-003 document.
 *
 * Usage:
 *   node tools/retrofit-task-003-issues.js
 *
 * Output:
 *   - Mapping table of Old Issue # → New TASK-003-XXX → Labels
 *   - GitHub CLI commands to update issues
 *   - Or: GitHub API curl commands (if gh CLI not available)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Task mapping from TASKS-003 document
const TASK_MAPPING = {
  // Phase 0: Database Schema (4 tasks)
  '001': {
    title: 'Create Chat Messages and Conversations Tables',
    phase: 'phase-0-db',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-0-db', 'priority-critical', 'backend', 'database'],
    effort: '1 day',
  },
  '002': {
    title: 'Add User Financial Context Fields',
    phase: 'phase-0-db',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-0-db', 'priority-critical', 'backend', 'database'],
    effort: '0.5 days',
  },
  '003': {
    title: 'Create AI Usage Tracking Table',
    phase: 'phase-0-db',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-0-db', 'priority-high', 'backend', 'database', 'monitoring'],
    effort: '0.5 days',
  },
  '004': {
    title: 'Create AI Insights Cache Table',
    phase: 'phase-0-db',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-0-db', 'priority-medium', 'backend', 'database', 'performance'],
    effort: '0.5 days',
  },

  // Phase 1: NLP Backend (9 tasks)
  '005': {
    title: 'Create AI Provider Adapter Interface and Configuration',
    phase: 'phase-1-nlp',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-critical', 'backend', 'architecture'],
    effort: '1.5 days',
  },
  '006': {
    title: 'Implement OpenAI Provider Adapter',
    phase: 'phase-1-nlp',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-critical', 'backend', 'integration'],
    effort: '1.5 days',
  },
  '007': {
    title: 'Implement Claude and Gemini Adapters (Optional Fallback)',
    phase: 'phase-1-nlp',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-medium', 'backend', 'reliability'],
    effort: '2 days',
  },
  '008': {
    title: 'Create NLP Parser Service with Prompt Engineering',
    phase: 'phase-1-nlp',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-critical', 'backend', 'ai-ml'],
    effort: '2.5 days',
  },
  '009': {
    title: 'Create Conversation Manager Service',
    phase: 'phase-1-nlp',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-critical', 'backend', 'security'],
    effort: '2 days',
  },
  '010': {
    title: 'Create Financial Consultation Engine',
    phase: 'phase-1-nlp',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-high', 'backend', 'ai-ml'],
    effort: '2.5 days',
  },
  '011': {
    title: 'Create User Context Service',
    phase: 'phase-1-nlp',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-high', 'backend', 'data-aggregation'],
    effort: '1.5 days',
  },
  '012': {
    title: 'Create AI Controller with REST Endpoints',
    phase: 'phase-1-nlp',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-1-nlp', 'priority-critical', 'backend', 'api'],
    effort: '2 days',
  },
  '013': {
    title: 'Implement AI Usage Tracking and Cost Monitoring',
    phase: 'phase-1-nlp',
    priority: 'priority-high',
    labels: [
      'TASK-003',
      'phase-1-nlp',
      'priority-high',
      'backend',
      'monitoring',
      'cost-optimization',
    ],
    effort: '1.5 days',
  },

  // Phase 2: Frontend UI (11 tasks)
  '014': {
    title: 'Create AI Chat Interface Component',
    phase: 'phase-2-ui',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-2-ui', 'priority-critical', 'frontend', 'component'],
    effort: '2 days',
  },
  '015': {
    title: 'Expense Preview Card Component',
    phase: 'phase-2-ui',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-2-ui', 'priority-high', 'frontend', 'component'],
    effort: '1.5 days',
  },
  '016': {
    title: 'Financial Consultation Widget',
    phase: 'phase-2-ui',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-2-ui', 'priority-high', 'frontend', 'component'],
    effort: '1.5 days',
  },
  '017': {
    title: 'AI Store (Zustand) for State Management',
    phase: 'phase-2-ui',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-2-ui', 'priority-critical', 'frontend', 'architecture'],
    effort: '1 day',
  },
  '018': {
    title: 'Chat Message Streaming Support',
    phase: 'phase-2-ui',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-2-ui', 'priority-medium', 'frontend', 'performance'],
    effort: '1.5 days',
  },
  '019': {
    title: 'AI Insights Dashboard Widget',
    phase: 'phase-2-ui',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-2-ui', 'priority-medium', 'frontend', 'component'],
    effort: '2 days',
  },
  '020': {
    title: 'Chat History Sidebar',
    phase: 'phase-2-ui',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-2-ui', 'priority-medium', 'frontend', 'component'],
    effort: '1.5 days',
  },
  '021': {
    title: 'AI Error Handling and Fallback UI',
    phase: 'phase-2-ui',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-2-ui', 'priority-high', 'frontend', 'reliability'],
    effort: '1 day',
  },
  '022': {
    title: 'Integration with Expense List Page',
    phase: 'phase-2-ui',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-2-ui', 'priority-high', 'frontend', 'integration'],
    effort: '1.5 days',
  },
  '023': {
    title: 'Loading States and Animations',
    phase: 'phase-2-ui',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-2-ui', 'priority-medium', 'frontend', 'ui'],
    effort: '1 day',
  },
  '024': {
    title: 'Mobile-Responsive AI Chat',
    phase: 'phase-2-ui',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-2-ui', 'priority-high', 'frontend', 'responsive'],
    effort: '1.5 days',
  },

  // Phase 3: Analytics Engine (7 tasks)
  '025': {
    title: 'Spending Pattern Detection Service',
    phase: 'phase-3-analytics',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-medium', 'backend', 'ai-ml'],
    effort: '2 days',
  },
  '026': {
    title: 'Anomaly Detection Service',
    phase: 'phase-3-analytics',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-medium', 'backend', 'ai-ml'],
    effort: '2 days',
  },
  '027': {
    title: 'Predictive Analytics Service',
    phase: 'phase-3-analytics',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-medium', 'backend', 'ai-ml'],
    effort: '2 days',
  },
  '028': {
    title: 'Insights Generation Service',
    phase: 'phase-3-analytics',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-high', 'backend', 'ai-ml'],
    effort: '2 days',
  },
  '029': {
    title: 'Analytics API Endpoints',
    phase: 'phase-3-analytics',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-high', 'backend', 'api'],
    effort: '1.5 days',
  },
  '030': {
    title: 'Analytics Caching and Optimization',
    phase: 'phase-3-analytics',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-medium', 'backend', 'performance'],
    effort: '1.5 days',
  },
  '031': {
    title: 'Comparative Analytics Service (Optional)',
    phase: 'phase-3-analytics',
    priority: 'priority-low',
    labels: ['TASK-003', 'phase-3-analytics', 'priority-low', 'backend', 'analytics'],
    effort: '2 days',
  },

  // Phase 4: Testing & QA (9 tasks)
  '032': {
    title: 'Unit Testing for AI Services',
    phase: 'phase-4-test',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-4-test', 'priority-critical', 'testing', 'backend'],
    effort: '2 days',
  },
  '033': {
    title: 'Integration Testing for AI API Endpoints',
    phase: 'phase-4-test',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-4-test', 'priority-critical', 'testing', 'backend'],
    effort: '1.5 days',
  },
  '034': {
    title: 'E2E Testing for AI Chat Flow',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-4-test', 'priority-high', 'testing', 'e2e'],
    effort: '2 days',
  },
  '035': {
    title: 'AI Accuracy Validation with Test Dataset',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-4-test', 'priority-high', 'testing', 'ai-ml'],
    effort: '2 days',
  },
  '036': {
    title: 'Security Audit for AI Features',
    phase: 'phase-4-test',
    priority: 'priority-critical',
    labels: ['TASK-003', 'phase-4-test', 'priority-critical', 'security', 'audit'],
    effort: '2 days',
  },
  '037': {
    title: 'Performance Testing for AI Features',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-4-test', 'priority-high', 'testing', 'performance'],
    effort: '1.5 days',
  },
  '038': {
    title: 'Cost Monitoring Validation',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-4-test', 'priority-high', 'testing', 'monitoring'],
    effort: '1 day',
  },
  '039': {
    title: 'Accessibility (A11y) Testing for AI UI',
    phase: 'phase-4-test',
    priority: 'priority-medium',
    labels: ['TASK-003', 'phase-4-test', 'priority-medium', 'testing', 'accessibility'],
    effort: '1.5 days',
  },
  '040': {
    title: 'User Acceptance Testing (UAT) Preparation',
    phase: 'phase-4-test',
    priority: 'priority-high',
    labels: ['TASK-003', 'phase-4-test', 'priority-high', 'uat', 'stakeholder'],
    effort: '1.5 days',
  },
};

// Existing GitHub issues #84-#108 (25 issues)
const EXISTING_ISSUES = {
  84: 'Natural Language Expense Input - Core Parser',
  85: 'Chat Interface Component',
  86: 'Conversation Context Management',
  87: 'AI Provider Integration (OpenAI)',
  88: 'Database Schema for Chat History',
  89: 'Expense Preview Component',
  90: 'User Financial Context Service',
  91: 'Financial Consultation Feature',
  92: 'Spending Pattern Analysis',
  93: 'Anomaly Detection Service',
  94: 'Predictive Analytics',
  95: 'Comparative Analytics Dashboard',
  96: 'AI Usage Cost Tracking',
  97: 'Chat History Persistence',
  98: 'Multi-turn Conversation Flow',
  99: 'Expense Clarification Logic',
  100: 'AI Response Streaming',
  101: 'Error Handling for AI Failures',
  102: 'Unit Tests for AI Services',
  103: 'Integration Tests for NLP Parser',
  104: 'E2E Tests for Chat Flow',
  105: 'AI Accuracy Validation',
  106: 'Security Audit - PII Handling',
  107: 'Performance Testing',
  108: 'UAT Preparation',
};

// Smart mapping based on title similarity
const ISSUE_TO_TASK_MAPPING = {
  84: '008', // Natural Language Expense Input - Core Parser → NLP Parser Service
  85: '014', // Chat Interface Component → AI Chat Interface Component
  86: '009', // Conversation Context Management → Conversation Manager Service
  87: '006', // AI Provider Integration (OpenAI) → OpenAI Provider Adapter
  88: '001', // Database Schema for Chat History → Chat Messages/Conversations Tables
  89: '015', // Expense Preview Component → Expense Preview Card Component
  90: '011', // User Financial Context Service → User Context Service
  91: '010', // Financial Consultation Feature → Financial Consultation Engine
  92: '025', // Spending Pattern Analysis → Spending Pattern Detection Service
  93: '026', // Anomaly Detection Service → Anomaly Detection Service
  94: '027', // Predictive Analytics → Predictive Analytics Service
  95: '019', // Comparative Analytics Dashboard → AI Insights Dashboard Widget
  96: '013', // AI Usage Cost Tracking → AI Usage Tracking and Cost Monitoring
  97: '020', // Chat History Persistence → Chat History Sidebar
  98: '009', // Multi-turn Conversation Flow → Conversation Manager Service (duplicate)
  99: '008', // Expense Clarification Logic → NLP Parser Service (duplicate)
  100: '018', // AI Response Streaming → Chat Message Streaming Support
  101: '021', // Error Handling for AI Failures → AI Error Handling and Fallback UI
  102: '032', // Unit Tests for AI Services → Unit Testing for AI Services
  103: '033', // Integration Tests for NLP Parser → Integration Testing for AI API
  104: '034', // E2E Tests for Chat Flow → E2E Testing for AI Chat Flow
  105: '035', // AI Accuracy Validation → AI Accuracy Validation with Test Dataset
  106: '036', // Security Audit - PII Handling → Security Audit for AI Features
  107: '037', // Performance Testing → Performance Testing for AI Features
  108: '040', // UAT Preparation → User Acceptance Testing (UAT) Preparation
};

// Generate mapping table
console.log('\n=== GitHub Issue Retrofit Mapping ===\n');
console.log(
  '| Old Issue | New Task ID     | Title                                           | Phase          | Priority | Labels |',
);
console.log(
  '|-----------|-----------------|------------------------------------------------|----------------|----------|--------|',
);

const updateCommands = [];
const curlCommands = [];

Object.entries(ISSUE_TO_TASK_MAPPING).forEach(([issueNum, taskNum]) => {
  const task = TASK_MAPPING[taskNum];
  const _oldTitle = EXISTING_ISSUES[issueNum];
  const newTitle = `[TASK-003-${taskNum}] ${task.title}`;
  const _labelsStr = task.labels.join(', ');

  console.log(
    `| #${issueNum.padEnd(8)} | TASK-003-${taskNum.padEnd(3)} | ${task.title.substring(0, 45).padEnd(45)} | ${task.phase.padEnd(14)} | ${task.priority.split('-')[1].padEnd(8)} | ${task.labels.slice(0, 3).join(', ')} |`,
  );

  // GitHub CLI command
  const ghCommand = `gh issue edit ${issueNum} --title "${newTitle}" --add-label "${task.labels.join(',')}"`;
  updateCommands.push(ghCommand);

  // GitHub API curl command (alternative)
  const curlCommand = `curl -X PATCH \\
  -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer \${GITHUB_TOKEN}" \\
  https://api.github.com/repos/uzibiton/automation-interview-pre/issues/${issueNum} \\
  -d '{"title":"${newTitle}","labels":${JSON.stringify(task.labels)}}'`;
  curlCommands.push(curlCommand);
});

console.log('\n=== GitHub CLI Update Commands ===\n');
console.log('# Run these commands to update all issues:\n');
updateCommands.forEach((cmd) => console.log(cmd));

console.log('\n=== Alternative: GitHub API cURL Commands ===\n');
console.log('# If gh CLI not available, use these (requires GITHUB_TOKEN):\n');
curlCommands.forEach((cmd) => console.log(cmd + '\n'));

console.log('\n=== Summary ===');
console.log(`Total issues to update: ${Object.keys(ISSUE_TO_TASK_MAPPING).length}`);
console.log(`Total tasks in TASKS-003: ${Object.keys(TASK_MAPPING).length}`);
console.log(
  `Unmapped tasks: ${Object.keys(TASK_MAPPING).length - new Set(Object.values(ISSUE_TO_TASK_MAPPING)).size}`,
);
console.log("\nNote: Some tasks are new and don't have existing issues. Consider creating them.");
console.log('\nUnmapped tasks (need new issues):');
const mappedTasks = new Set(Object.values(ISSUE_TO_TASK_MAPPING));
Object.entries(TASK_MAPPING).forEach(([taskNum, task]) => {
  if (!mappedTasks.has(taskNum)) {
    console.log(`  - TASK-003-${taskNum}: ${task.title}`);
  }
});

// Save mapping to file
const mappingData = {
  generated: new Date().toISOString(),
  total_existing_issues: Object.keys(EXISTING_ISSUES).length,
  total_tasks: Object.keys(TASK_MAPPING).length,
  mapping: Object.entries(ISSUE_TO_TASK_MAPPING).map(([issueNum, taskNum]) => ({
    issue_number: parseInt(issueNum),
    old_title: EXISTING_ISSUES[issueNum],
    task_id: `TASK-003-${taskNum}`,
    new_title: `[TASK-003-${taskNum}] ${TASK_MAPPING[taskNum].title}`,
    phase: TASK_MAPPING[taskNum].phase,
    priority: TASK_MAPPING[taskNum].priority,
    labels: TASK_MAPPING[taskNum].labels,
    effort: TASK_MAPPING[taskNum].effort,
  })),
  unmapped_tasks: Object.entries(TASK_MAPPING)
    .filter(([taskNum]) => !mappedTasks.has(taskNum))
    .map(([taskNum, task]) => ({
      task_id: `TASK-003-${taskNum}`,
      title: task.title,
      phase: task.phase,
      priority: task.priority,
      labels: task.labels,
      effort: task.effort,
    })),
};

const outputPath = path.join(__dirname, '..', 'temp', 'task-003-retrofit-mapping.json');
fs.writeFileSync(outputPath, JSON.stringify(mappingData, null, 2));
console.log(`\n✅ Mapping saved to: ${outputPath}`);
