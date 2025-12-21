#!/usr/bin/env node

/**
 * GitHub Labels Setup for TASK-002
 * 
 * This script generates the labels needed for Group Management tasks.
 * You can use GitHub CLI to create them automatically or copy the commands.
 * 
 * Prerequisites:
 *   npm install -g gh   # GitHub CLI
 *   gh auth login       # Authenticate
 * 
 * Usage:
 *   node tools/setup-github-labels.js         # Show manual instructions
 *   node tools/setup-github-labels.js auto    # Auto-create with gh CLI
 */

const labels = [
  // Main label
  { name: 'TASK-002', color: '0052CC', description: 'Group Management Feature Tasks' },
  
  // Phase labels
  { name: 'phase-0-db', color: 'D73A4A', description: 'Phase 0: Database Schema' },
  { name: 'phase-1-auth', color: 'D73A4A', description: 'Phase 1: Auth Service' },
  { name: 'phase-2-api', color: 'D73A4A', description: 'Phase 2: API Service' },
  { name: 'phase-3-ui', color: 'FBCA04', description: 'Phase 3: Frontend UI' },
  { name: 'phase-4-testing', color: 'FBCA04', description: 'Phase 4: Testing & QA' },
  
  // Priority labels
  { name: 'priority-critical', color: 'B60205', description: 'Critical priority - blocking' },
  { name: 'priority-high', color: 'D93F0B', description: 'High priority' },
  { name: 'priority-medium', color: 'FBCA04', description: 'Medium priority' },
  
  // Tech stack labels
  { name: 'backend', color: '0E8A16', description: 'Backend code' },
  { name: 'frontend', color: '1D76DB', description: 'Frontend code' },
  { name: 'database', color: '5319E7', description: 'Database related' },
  
  // Service labels
  { name: 'auth-service', color: '0E8A16', description: 'Auth Service (NestJS)' },
  { name: 'api-service', color: '0E8A16', description: 'API Service (NestJS)' },
  
  // Technology labels
  { name: 'nestjs', color: 'E92063', description: 'NestJS framework' },
  { name: 'jwt', color: '000000', description: 'JWT authentication' },
  { name: 'security', color: 'D73A4A', description: 'Security related' },
  
  // Feature labels
  { name: 'expenses', color: '1D76DB', description: 'Expenses feature' },
  { name: 'categories', color: '1D76DB', description: 'Categories feature' },
  { name: 'state-management', color: '1D76DB', description: 'State management (Zustand)' },
  { name: 'ui', color: '1D76DB', description: 'UI components' },
  { name: 'component', color: '1D76DB', description: 'React component' },
  { name: 'page', color: '1D76DB', description: 'Page/Route' },
  { name: 'mocks', color: 'BFD4F2', description: 'Mock data/services' },
  { name: 'setup', color: 'C5DEF5', description: 'Setup/Configuration' },
  
  // Testing labels
  { name: 'testing', color: 'F9D0C4', description: 'Testing related' },
  { name: 'unit-tests', color: 'F9D0C4', description: 'Unit tests' },
  { name: 'integration-tests', color: 'F9D0C4', description: 'Integration tests' },
  { name: 'e2e-tests', color: 'F9D0C4', description: 'E2E tests (Playwright)' },
  { name: 'playwright', color: 'F9D0C4', description: 'Playwright E2E testing' },
  { name: 'owasp', color: 'D73A4A', description: 'OWASP security testing' },
  { name: 'performance', color: 'F9D0C4', description: 'Performance testing' },
];

function printManualInstructions() {
  console.log('\n📋 MANUAL LABEL CREATION\n');
  console.log('Go to: https://github.com/uzibiton/automation-interview-pre/labels\n');
  console.log('For each label below:\n');
  console.log('1. Click "New label"');
  console.log('2. Copy the Name, Description, and Color');
  console.log('3. Click "Create label"\n');
  console.log('=' .repeat(80));
  
  labels.forEach((label, index) => {
    console.log(`\n${index + 1}. Label: ${label.name}`);
    console.log(`   Description: ${label.description}`);
    console.log(`   Color: #${label.color}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ Total: ${labels.length} labels to create\n`);
}

function generateGhCommands() {
  console.log('\n🤖 AUTOMATIC LABEL CREATION (GitHub CLI)\n');
  console.log('Prerequisites:');
  console.log('  npm install -g gh');
  console.log('  gh auth login\n');
  console.log('Commands:\n');
  console.log('=' .repeat(80) + '\n');
  
  labels.forEach(label => {
    console.log(`gh label create "${label.name}" --description "${label.description}" --color "${label.color}" --repo uzibiton/automation-interview-pre`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ Run these ${labels.length} commands to create all labels\n`);
  console.log('Or copy all commands and run:');
  console.log('  node tools/setup-github-labels.js auto | bash\n');
}

function generateBashScript() {
  console.log('#!/bin/bash');
  console.log('# GitHub Labels Setup Script');
  console.log('# Run with: bash setup-labels.sh\n');
  console.log('REPO="uzibiton/automation-interview-pre"\n');
  
  labels.forEach(label => {
    console.log(`gh label create "${label.name}" \\`);
    console.log(`  --description "${label.description}" \\`);
    console.log(`  --color "${label.color}" \\`);
    console.log(`  --repo "$REPO" || echo "Label '${label.name}' may already exist"\n`);
  });
  
  console.log('echo "✅ Label setup complete!"');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0] || 'manual';

if (command === 'manual') {
  printManualInstructions();
} else if (command === 'gh' || command === 'cli') {
  generateGhCommands();
} else if (command === 'bash' || command === 'script') {
  generateBashScript();
} else {
  console.log(`
GitHub Labels Setup for TASK-002

Usage:
  node tools/setup-github-labels.js [command]

Commands:
  manual     Show manual instructions (default)
  gh         Generate GitHub CLI commands
  bash       Generate bash script

Examples:
  node tools/setup-github-labels.js manual
  node tools/setup-github-labels.js gh
  node tools/setup-github-labels.js bash > setup-labels.sh && bash setup-labels.sh
  `);
}
