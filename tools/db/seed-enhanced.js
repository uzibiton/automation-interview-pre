#!/usr/bin/env node

/**
 * Enhanced Database Seeding Tool
 *
 * Seeds PostgreSQL and/or Firestore with realistic test data using Faker.js
 *
 * Usage:
 *   node tools/db/seed-enhanced.js --target firestore --expenses 50
 *   node tools/db/seed-enhanced.js --env staging --reset --target firestore
 *   node tools/db/seed-enhanced.js --env develop --reset --expenses 0 --groups 0  # Clear only
 */

import { program } from 'commander';
import { Client } from 'pg';
import { Firestore } from '@google-cloud/firestore';
import {
  generateExpense,
  generateGroup,
  generateMember,
  generateUser as _generateUser,
  DEFAULT_CATEGORIES,
} from './lib/faker-generators.js';
import {
  INIT_USERS,
  INIT_GROUPS,
  INIT_MEMBERS as _INIT_MEMBERS,
  getUsersForExpenses,
  TEST_PASSWORD as _TEST_PASSWORD,
} from './lib/init-data.js';

// Test user constants (matching existing scripts)
const TEST_USER_EMAIL = 'test@expenses.local';
const TEST_USER_PASSWORD = 'Test123!';
const TEST_USER_NAME = 'Test User';
const TEST_USER_PASSWORD_HASH = '$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu';
const TEST_USER_ID_FIRESTORE = 'test-user-001';

// Environment to Firestore project mapping
const ENV_PROJECT_MAP = {
  develop: 'skillful-eon-477917-b7',
  staging: 'skillful-eon-477917-b7', // Same project, different data
  production: 'skillful-eon-477917-b7', // Same project, different data
};

// Collections to clear
const FIRESTORE_COLLECTIONS = ['expenses', 'groups', 'group_members', 'invitations', 'users'];

// Parse CLI arguments
program
  .name('seed-enhanced')
  .description('Seed databases with realistic test data using Faker.js')
  .option('-t, --target <type>', 'Database target: postgres, firestore, or all', 'firestore')
  .option('-e, --expenses <number>', 'Number of expenses to generate', parseInt, 30)
  .option('-g, --groups <number>', 'Number of groups to generate', parseInt, 2)
  .option('-m, --members <number>', 'Members per group', parseInt, 3)
  .option('--days <number>', 'Days back for expense dates', parseInt, 60)
  .option('--env <environment>', 'Firestore environment: develop, staging, production', 'develop')
  .option('--reset', 'Clear all data before seeding')
  .option('--force', 'Skip confirmation for production reset')
  .option('--init', 'Initialize with predefined users/groups/expenses for develop')
  .parse(process.argv);

const options = program.opts();

// Validate target
if (!['postgres', 'firestore', 'all'].includes(options.target)) {
  console.error(`❌ Invalid target: ${options.target}. Use: postgres, firestore, or all`);
  process.exit(1);
}

// Validate environment
if (!['develop', 'staging', 'production'].includes(options.env)) {
  console.error(`❌ Invalid environment: ${options.env}. Use: develop, staging, or production`);
  process.exit(1);
}

// Production safety check
if (options.env === 'production' && options.reset && !options.force) {
  console.error('❌ Refusing to reset production without --force flag');
  console.error('   Use: --env production --reset --force');
  process.exit(1);
}

console.log('🚀 Enhanced Database Seeding Tool');
console.log('==================================');
console.log(`Environment:   ${options.env}`);
console.log(`Target:        ${options.target}`);
console.log(`Reset:         ${options.reset ? 'YES' : 'no'}`);
console.log(`Init Mode:     ${options.init ? 'YES' : 'no'}`);
if (!options.init) {
  console.log(`Expenses:      ${options.expenses}`);
  console.log(`Groups:        ${options.groups}`);
  console.log(`Members/group: ${options.members}`);
  console.log(`Days back:     ${options.days}`);
}
console.log('');

// ============================================================================
// Firestore Clear Functions
// ============================================================================

async function clearFirestoreCollection(firestore, collectionName) {
  console.log(`   Clearing ${collectionName}...`);
  const collectionRef = firestore.collection(collectionName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`   ✅ ${collectionName} is already empty`);
    return 0;
  }

  // Firestore batch delete limit is 500
  const batchSize = 500;
  let deleted = 0;

  while (true) {
    const batch = firestore.batch();
    const docs = await collectionRef.limit(batchSize).get();

    if (docs.empty) break;

    docs.forEach((doc) => {
      batch.delete(doc.ref);
      deleted++;
    });

    await batch.commit();
  }

  console.log(`   ✅ Deleted ${deleted} documents from ${collectionName}`);
  return deleted;
}

async function clearAllFirestoreData(firestore) {
  console.log('\n🗑️  Clearing all Firestore data...');

  let totalDeleted = 0;
  for (const collection of FIRESTORE_COLLECTIONS) {
    totalDeleted += await clearFirestoreCollection(firestore, collection);
  }

  console.log(`   ✅ Total: ${totalDeleted} documents deleted`);
  return totalDeleted;
}

// ============================================================================
// Firestore Initialization (--init flag)
// ============================================================================

async function initializeFirestore(firestore) {
  console.log('\n🏗️  Initializing Firestore with predefined data...');
  console.log('   Using app Firestore schema (auto-generated IDs)');

  // Create users with auto-generated IDs (like the app does)
  // Store mapping of logical ID -> Firestore doc ID
  const userIdMap = new Map();

  console.log('\n👤 Creating users...');
  for (const user of INIT_USERS) {
    // Use auto-generated ID like the app does
    const userRef = firestore.collection('users').doc();
    const firestoreId = userRef.id;

    // Generate a numeric hash ID like auth service does
    const userIdHash = Date.now() + Math.floor(Math.random() * 1000);

    await userRef.set({
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      googleId: user.googleId,
      avatarUrl: user.avatarUrl,
      userIdHash: userIdHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Map logical ID to actual Firestore ID
    userIdMap.set(user.id, firestoreId);

    const authType = user.googleId ? 'google' : 'local';
    console.log(`   ✅ Created user: ${user.email} (${authType}) -> ${firestoreId}`);
  }

  // Create groups with embedded members/memberDetails using actual Firestore IDs
  console.log('\n👥 Creating groups with embedded members...');
  for (const group of INIT_GROUPS) {
    // Map logical user IDs to actual Firestore IDs
    const actualMembers = group.members.map((id) => userIdMap.get(id));
    const actualOwnerId = userIdMap.get(group.ownerId);

    // Add joinedAt and map IDs in memberDetails
    const memberDetailsWithDates = group.memberDetails.map((m) => ({
      id: userIdMap.get(m.id),
      name: m.name,
      role: m.role,
      joinedAt: new Date().toISOString(),
    }));

    // Use auto-generated ID (like the app does)
    const groupRef = firestore.collection('groups').doc();
    await groupRef.set({
      name: group.name,
      ownerId: actualOwnerId,
      members: actualMembers,
      memberDetails: memberDetailsWithDates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`   ✅ Created group: ${group.name} (${groupRef.id})`);
    console.log(`      Owner: ${actualOwnerId}`);
    console.log(
      `      Members: ${actualMembers.length} (${group.memberDetails.map((m) => m.role).join(', ')})`,
    );
  }

  // Create expenses for each user (3-5 per user) using actual Firestore IDs
  console.log('\n💰 Creating expenses...');
  const usersWithExpenses = getUsersForExpenses();

  for (const user of usersWithExpenses) {
    const actualUserId = userIdMap.get(user.id);
    const expenseCount = Math.floor(Math.random() * 3) + 3; // 3-5 expenses
    console.log(`   Creating ${expenseCount} expenses for ${user.email}...`);

    for (let i = 0; i < expenseCount; i++) {
      const expense = generateExpense({
        categories: DEFAULT_CATEGORIES,
        userId: actualUserId,
        daysBack: options.days,
      });

      const expenseRef = firestore.collection('expenses').doc();
      await expenseRef.set({
        ...expense,
        createdBy: user.name,
        date: expense.date.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`   ✅ Created ${expenseCount} expenses for ${user.email}`);
  }

  console.log('\n✅ Firestore initialization complete!');
}

// ============================================================================
// PostgreSQL Clear Functions
// ============================================================================

async function clearPostgresData(client) {
  console.log('\n🗑️  Clearing PostgreSQL data...');

  // Order matters due to foreign keys
  const tables = ['expenses', 'group_members', 'groups'];

  for (const table of tables) {
    try {
      const result = await client.query(`DELETE FROM ${table}`);
      console.log(`   ✅ Deleted ${result.rowCount} rows from ${table}`);
    } catch (error) {
      if (error.code === '42P01') {
        console.log(`   ⚠️  Table ${table} does not exist`);
      } else {
        throw error;
      }
    }
  }

  console.log('   ✅ PostgreSQL data cleared');
}

// ============================================================================
// PostgreSQL Seeding
// ============================================================================

async function seedPostgres() {
  console.log('📦 PostgreSQL Seeding');
  console.log('---------------------');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'testdb',
    user: process.env.DB_USER || 'testuser',
    password: process.env.DB_PASSWORD || 'testpass',
  };

  const client = new Client(config);

  try {
    await client.connect();
    console.log(`✅ Connected to PostgreSQL at ${config.host}:${config.port}`);

    // Clear data if reset flag is set
    if (options.reset) {
      await clearPostgresData(client);
    }

    // Skip seeding if counts are 0
    if (options.expenses === 0 && options.groups === 0) {
      console.log('\n✅ PostgreSQL clear complete (no seeding requested)');
      return;
    }

    // Ensure test user exists
    const userId = await ensurePostgresUser(client);

    // Verify categories exist
    const categoryResult = await client.query('SELECT COUNT(*) FROM categories');
    const categoryCount = parseInt(categoryResult.rows[0].count);
    if (categoryCount === 0) {
      console.log('⚠️  No categories found. Please seed categories first.');
      return;
    }
    console.log(`✅ Found ${categoryCount} categories`);

    // Ensure tables exist
    await ensurePostgresTables(client);

    // Seed groups
    if (options.groups > 0) {
      const groupIds = await seedPostgresGroups(client, userId);
      await seedPostgresMembers(client, groupIds, userId);
    }

    // Seed expenses
    if (options.expenses > 0) {
      await seedPostgresExpenses(client, userId, categoryCount);
    }

    // Show statistics
    await showPostgresStats(client, userId);

    console.log('\n✅ PostgreSQL seeding complete!');
  } catch (error) {
    console.error('❌ PostgreSQL error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function ensurePostgresUser(client) {
  console.log('\n👤 Ensuring test user exists...');

  const result = await client.query('SELECT id FROM users WHERE email = $1', [TEST_USER_EMAIL]);

  if (result.rows.length === 0) {
    const insertResult = await client.query(
      'INSERT INTO users (email, name, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
      [TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD_HASH],
    );
    console.log(`   ✅ Created user: ${TEST_USER_EMAIL} (ID: ${insertResult.rows[0].id})`);
    return insertResult.rows[0].id;
  }

  console.log(`   ✅ User exists: ${TEST_USER_EMAIL} (ID: ${result.rows[0].id})`);
  return result.rows[0].id;
}

async function ensurePostgresTables(client) {
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'groups'
    );
  `);

  if (!tableCheck.rows[0].exists) {
    console.log('⚠️  Creating groups and group_members tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        is_active BOOLEAN NOT NULL DEFAULT true
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
        joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('   ✅ Tables created');
  }
}

async function seedPostgresGroups(client, userId) {
  console.log(`\n👥 Creating ${options.groups} groups...`);
  const groupIds = [];

  for (let i = 0; i < options.groups; i++) {
    const group = generateGroup({ createdBy: userId });

    try {
      const result = await client.query(
        'INSERT INTO groups (name, description, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
        [group.name, group.description, group.createdBy, group.createdAt],
      );
      groupIds.push(result.rows[0].id);
      console.log(`   ✅ Created: ${group.name} (ID: ${result.rows[0].id})`);
    } catch (error) {
      if (error.code === '23505') {
        console.log(`   ⚠️  Already exists: ${group.name}`);
        const existing = await client.query('SELECT id FROM groups WHERE name = $1', [group.name]);
        if (existing.rows.length > 0) {
          groupIds.push(existing.rows[0].id);
        }
      } else {
        throw error;
      }
    }
  }

  return groupIds;
}

async function seedPostgresMembers(client, groupIds, testUserId) {
  console.log(`\n👤 Adding ${options.members} members per group...`);

  for (const groupId of groupIds) {
    // Add test user as owner
    try {
      await client.query(
        `INSERT INTO group_members (group_id, user_id, name, email, role, joined_at, updated_at)
         VALUES ($1, $2, $3, $4, 'owner', NOW(), NOW())`,
        [groupId, testUserId, TEST_USER_NAME, TEST_USER_EMAIL],
      );
      console.log(`   ✅ Added owner: ${TEST_USER_NAME} to group ${groupId}`);
    } catch (error) {
      if (error.code !== '23505') throw error;
    }

    // Add generated members
    for (let i = 0; i < options.members; i++) {
      const member = generateMember({ groupId });
      try {
        await client.query(
          `INSERT INTO group_members (group_id, user_id, name, email, role, joined_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [groupId, null, member.name, member.email, member.role, member.joinedAt],
        );
        console.log(`   ✅ Added ${member.role}: ${member.name}`);
      } catch (error) {
        if (error.code !== '23505') throw error;
      }
    }
  }
}

async function seedPostgresExpenses(client, userId, categoryCount) {
  console.log(`\n💰 Creating ${options.expenses} expenses...`);

  const categories = Array.from({ length: categoryCount }, (_, i) => ({
    id: i + 1,
    name: DEFAULT_CATEGORIES[i]?.name || `Category ${i + 1}`,
  }));

  let created = 0;
  for (let i = 0; i < options.expenses; i++) {
    const expense = generateExpense({
      categories,
      userId,
      daysBack: options.days,
    });

    await client.query(
      `INSERT INTO expenses (user_id, category_id, amount, currency, description, date, payment_method, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        expense.userId,
        expense.categoryId,
        expense.amount,
        expense.currency,
        expense.description,
        expense.date,
        expense.paymentMethod,
      ],
    );
    created++;
  }

  console.log(`   ✅ Created ${created} expenses`);
}

async function showPostgresStats(client, userId) {
  console.log('\n📊 Statistics:');

  const stats = await client.query(
    `SELECT c.name as category, COUNT(*) as count, SUM(e.amount) as total
     FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = $1
     GROUP BY c.name
     ORDER BY total DESC`,
    [userId],
  );

  for (const row of stats.rows) {
    console.log(`   ${row.category}: ${row.count} expenses, $${parseFloat(row.total).toFixed(2)}`);
  }
}

// ============================================================================
// Firestore Seeding
// ============================================================================

async function seedFirestore() {
  console.log('\n🔥 Firestore Seeding');
  console.log('--------------------');
  console.log(`   Environment: ${options.env}`);

  const projectId = process.env.FIREBASE_PROJECT_ID || ENV_PROJECT_MAP[options.env];
  console.log(`   Project ID:  ${projectId}`);

  const firestore = new Firestore({ projectId });

  try {
    // Clear data if reset flag is set
    if (options.reset) {
      await clearAllFirestoreData(firestore);
    }

    // Use initialization mode if --init flag is set
    if (options.init) {
      await initializeFirestore(firestore);
      return;
    }

    // Skip seeding if counts are 0
    if (options.expenses === 0 && options.groups === 0) {
      console.log('\n✅ Firestore clear complete (no seeding requested)');
      return;
    }

    // Ensure test user exists
    await ensureFirestoreUser(firestore);

    // Seed groups
    if (options.groups > 0) {
      const groupIds = await seedFirestoreGroups(firestore);
      await seedFirestoreMembers(firestore, groupIds);
    }

    // Seed expenses
    if (options.expenses > 0) {
      await seedFirestoreExpenses(firestore);
    }

    // Show statistics
    await showFirestoreStats(firestore);

    console.log('\n✅ Firestore seeding complete!');
  } catch (error) {
    console.error('❌ Firestore error:', error.message);
    throw error;
  }
}

async function ensureFirestoreUser(firestore) {
  console.log('\n👤 Ensuring test user exists...');

  const userRef = firestore.collection('users').doc(TEST_USER_ID_FIRESTORE);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({
      email: TEST_USER_EMAIL,
      name: TEST_USER_NAME,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`   ✅ Created user: ${TEST_USER_EMAIL}`);
  } else {
    console.log(`   ✅ User exists: ${TEST_USER_EMAIL}`);
  }
}

async function seedFirestoreGroups(firestore) {
  console.log(`\n👥 Creating ${options.groups} groups...`);
  const groupIds = [];

  for (let i = 0; i < options.groups; i++) {
    const group = generateGroup({ createdBy: TEST_USER_ID_FIRESTORE });
    const groupId = `group-${Date.now()}-${i}`;

    const groupRef = firestore.collection('groups').doc(groupId);
    await groupRef.set({
      ...group,
      createdAt: group.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    groupIds.push(groupId);
    console.log(`   ✅ Created: ${group.name} (ID: ${groupId})`);
  }

  return groupIds;
}

async function seedFirestoreMembers(firestore, groupIds) {
  console.log(`\n👤 Adding ${options.members} members per group...`);

  for (const groupId of groupIds) {
    // Add test user as owner
    const ownerRef = firestore.collection('group_members').doc(`${groupId}-owner`);
    await ownerRef.set({
      groupId,
      userId: TEST_USER_ID_FIRESTORE,
      name: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
      role: 'owner',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`   ✅ Added owner: ${TEST_USER_NAME}`);

    // Add generated members
    for (let i = 0; i < options.members; i++) {
      const member = generateMember({ groupId });
      const memberRef = firestore.collection('group_members').doc();

      await memberRef.set({
        ...member,
        joinedAt: member.joinedAt.toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`   ✅ Added ${member.role}: ${member.name}`);
    }
  }
}

async function seedFirestoreExpenses(firestore) {
  console.log(`\n💰 Creating ${options.expenses} expenses...`);

  let created = 0;
  for (let i = 0; i < options.expenses; i++) {
    const expense = generateExpense({
      categories: DEFAULT_CATEGORIES,
      userId: TEST_USER_ID_FIRESTORE,
      daysBack: options.days,
    });

    const expenseRef = firestore.collection('expenses').doc();
    await expenseRef.set({
      ...expense,
      date: expense.date.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    created++;
  }

  console.log(`   ✅ Created ${created} expenses`);
}

async function showFirestoreStats(firestore) {
  console.log('\n📊 Statistics:');

  const expensesSnapshot = await firestore
    .collection('expenses')
    .where('userId', '==', TEST_USER_ID_FIRESTORE)
    .get();

  const stats = {};
  expensesSnapshot.forEach((doc) => {
    const expense = doc.data();
    const categoryId = expense.categoryId;
    const categoryName = DEFAULT_CATEGORIES.find((c) => c.id === categoryId)?.name || 'Unknown';

    if (!stats[categoryName]) {
      stats[categoryName] = { count: 0, total: 0 };
    }
    stats[categoryName].count++;
    stats[categoryName].total += expense.amount;
  });

  const sortedStats = Object.entries(stats).sort((a, b) => b[1].total - a[1].total);
  for (const [category, data] of sortedStats) {
    console.log(`   ${category}: ${data.count} expenses, $${data.total.toFixed(2)}`);
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();

  try {
    if (options.target === 'postgres' || options.target === 'all') {
      await seedPostgres();
    }

    if (options.target === 'firestore' || options.target === 'all') {
      await seedFirestore();
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n==================================');
    console.log(`✅ Complete in ${duration}s`);

    if (options.init) {
      console.log('');
      console.log('Test Credentials (all local users use password: Test123!):');
      console.log('');
      console.log('  Owners:');
      console.log('    test@expenses.local (Local Auth)');
      console.log('    uzibdocs@gmail.com (Google OAuth)');
      console.log('');
      console.log('  Role Users:');
      console.log('    admin@expenses.local  - Admin role');
      console.log('    member@expenses.local - Member role');
      console.log('    viewer@expenses.local - Viewer role');
      console.log('    solo@expenses.local   - Owner (no groups)');
    } else if (options.expenses > 0 || options.groups > 0) {
      console.log('');
      console.log('Test Credentials:');
      console.log(`  Email:    ${TEST_USER_EMAIL}`);
      console.log(`  Password: ${TEST_USER_PASSWORD}`);
    }
  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

main();
