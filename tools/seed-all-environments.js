#!/usr/bin/env node

/**
 * Unified Test Data Seeding Script
 *
 * Seeds both local PostgreSQL and deployed Firestore with test data
 * Run: node tools/seed-all-environments.js
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const POSTGRES_SCRIPT = join(__dirname, 'seed-postgres-test-data.js');
const FIRESTORE_SCRIPT = join(__dirname, 'seed-firestore-test-data.js');

function runScript(scriptPath, name) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🚀 Running ${name}...`);
    console.log(`${'='.repeat(70)}\n`);

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${name} exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function seedAllEnvironments() {
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║          Unified Test Data Seeding - All Environments            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝');

  const startTime = Date.now();
  const results = {
    postgres: { success: false, error: null },
    firestore: { success: false, error: null },
  };

  // Seed PostgreSQL (Local)
  try {
    await runScript(POSTGRES_SCRIPT, 'PostgreSQL Local Seeding');
    results.postgres.success = true;
    console.log('\n✅ PostgreSQL seeding completed successfully!');
  } catch (error) {
    results.postgres.error = error.message;
    console.error('\n❌ PostgreSQL seeding failed:', error.message);
  }

  // Seed Firestore (Deployed)
  try {
    await runScript(FIRESTORE_SCRIPT, 'Firestore Deployed Seeding');
    results.firestore.success = true;
    console.log('\n✅ Firestore seeding completed successfully!');
  } catch (error) {
    results.firestore.error = error.message;
    console.error('\n❌ Firestore seeding failed:', error.message);
  }

  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(70));
  console.log('📊 SEEDING SUMMARY');
  console.log('='.repeat(70));
  console.log(`⏱️  Total Duration: ${duration}s\n`);

  console.log('Environment Results:');
  console.log(`  PostgreSQL (Local):  ${results.postgres.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (results.postgres.error) {
    console.log(`    Error: ${results.postgres.error}`);
  }

  console.log(`  Firestore (Deployed): ${results.firestore.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (results.firestore.error) {
    console.log(`    Error: ${results.firestore.error}`);
  }

  console.log('\n' + '='.repeat(70));

  if (results.postgres.success && results.firestore.success) {
    console.log('✅ All environments seeded successfully!');
    console.log('\n🔐 Test User Credentials:');
    console.log('   Email:    test@expenses.local');
    console.log('   Password: Test123!');
    console.log('\n📍 Access Points:');
    console.log('   Local:    http://localhost:3000');
    console.log('   Deployed: https://expenses-frontend-477917.web.app');
    process.exit(0);
  } else {
    console.log('⚠️  Some environments failed to seed. Check errors above.');
    process.exit(1);
  }
}

// Run the unified seeding
seedAllEnvironments().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
