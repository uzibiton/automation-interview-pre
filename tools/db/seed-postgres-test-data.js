#!/usr/bin/env node

/**
 * PostgreSQL Test Data Seeding Tool
 *
 * Populates PostgreSQL with sample groups, members, and expenses for test user
 * Run: node tools/seed-postgres-test-data.js
 */

import { Client } from 'pg';

const TEST_USER_EMAIL = 'test@expenses.local';
const TEST_USER_PASSWORD = 'Test123!';
const TEST_USER_NAME = 'Test User';
// Password hash for "Test123!" - bcrypt 10 rounds
const TEST_USER_PASSWORD_HASH = '$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu';

// Database connection from environment or defaults
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'testdb',
  user: process.env.DB_USER || 'testuser',
  password: process.env.DB_PASSWORD || 'testpass',
};

// Sample groups data
const generateGroups = (userId) => [
  {
    name: 'Family Budget',
    description: 'Shared household expenses and bills',
    createdBy: userId,
  },
  {
    name: 'Vacation Fund',
    description: 'Saving for our summer vacation',
    createdBy: userId,
  },
];

// Sample members data (will be populated after groups are created)
const generateMembers = (groupIds, testUserId) => [
  // Family Budget group members
  {
    groupId: groupIds[0],
    userId: testUserId,
    name: TEST_USER_NAME,
    email: TEST_USER_EMAIL,
    role: 'owner',
  },
  {
    groupId: groupIds[0],
    userId: null, // External member not in users table
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'admin',
  },
  {
    groupId: groupIds[0],
    userId: null,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'member',
  },
  {
    groupId: groupIds[0],
    userId: null,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'viewer',
  },
  // Vacation Fund group members
  {
    groupId: groupIds[1],
    userId: testUserId,
    name: TEST_USER_NAME,
    email: TEST_USER_EMAIL,
    role: 'owner',
  },
  {
    groupId: groupIds[1],
    userId: null,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'admin',
  },
];

// Sample expenses data
const generateExpenses = (userId, categoryCount) => {
  const expenses = [];
  const descriptions = {
    1: ['Dinner at restaurant', 'Movie tickets', 'Concert tickets', 'Shopping', 'Weekend trip'],
    2: ['Grocery shopping', 'Fresh vegetables', 'Corner store', 'Supermarket weekly'],
    3: ['Pharmacy', 'Doctor visit', 'Dental checkup', 'Medications'],
    4: ['Car insurance', 'Home insurance', 'Life insurance'],
    5: ['Books', 'School supplies', 'Online course', 'Private lessons'],
    6: ['Gas station', 'Car maintenance', 'Parking', 'Highway toll'],
    7: ['Electricity bill', 'Water bill', 'Internet', 'Phone bill'],
    8: ['Savings deposit', 'Investment', 'Emergency fund'],
    9: ['Cleaning supplies', 'Home repair', 'Furniture', 'Kitchen items'],
  };

  const paymentMethods = ['credit_card', 'debit_card', 'cash', 'bank_transfer'];
  const currencies = ['USD', 'EUR', 'ILS'];

  // Generate 30 random expenses over the last 60 days
  for (let i = 0; i < 30; i++) {
    const categoryId = Math.floor(Math.random() * categoryCount) + 1;
    const categoryDescriptions = descriptions[categoryId] || ['Generic expense'];
    const description =
      categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

    // Random date within last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    expenses.push({
      userId,
      categoryId,
      amount: (Math.random() * 200 + 10).toFixed(2), // $10-$210
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      description,
      date: date.toISOString().split('T')[0],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    });
  }

  return expenses;
};

async function ensureTestUser(client) {
  console.log('👤 Ensuring test user exists...');

  // Check if user exists
  const userResult = await client.query('SELECT id FROM users WHERE email = $1', [TEST_USER_EMAIL]);

  let userId;
  if (userResult.rows.length === 0) {
    // Create test user
    const insertResult = await client.query(
      'INSERT INTO users (email, name, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
      [TEST_USER_EMAIL, TEST_USER_NAME, TEST_USER_PASSWORD_HASH],
    );
    userId = insertResult.rows[0].id;
    console.log(`   ✅ Created user: ${TEST_USER_EMAIL} (ID: ${userId})`);
  } else {
    userId = userResult.rows[0].id;
    console.log(`   ✅ User already exists: ${TEST_USER_EMAIL} (ID: ${userId})`);
  }

  return userId;
}

async function ensureTablesExist(client) {
  console.log('\n🔍 Checking for required tables...');

  // Check if groups table exists
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'groups'
    );
  `);

  if (!tableCheck.rows[0].exists) {
    console.log('⚠️  Warning: groups table does not exist. Creating basic structure...');

    // Create groups table
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

    // Create group_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
        joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
      );
    `);

    console.log('   ✅ Created groups and group_members tables');
  } else {
    console.log('   ✅ Required tables exist');
  }
}

async function seedGroups(client, userId) {
  console.log('\n👥 Seeding groups...');
  const groups = generateGroups(userId);
  const groupIds = [];

  for (const group of groups) {
    try {
      const result = await client.query(
        'INSERT INTO groups (name, description, created_by, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
        [group.name, group.description, group.createdBy],
      );
      groupIds.push(result.rows[0].id);
      console.log(`   ✅ Created group: ${group.name} (ID: ${result.rows[0].id})`);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        console.log(`   ⚠️  Group already exists: ${group.name}`);
        // Get existing group ID
        const existingResult = await client.query('SELECT id FROM groups WHERE name = $1', [
          group.name,
        ]);
        groupIds.push(existingResult.rows[0].id);
      } else {
        throw error;
      }
    }
  }

  return groupIds;
}

async function seedMembers(client, groupIds, testUserId) {
  console.log('\n👤 Seeding group members...');
  const members = generateMembers(groupIds, testUserId);
  let created = 0;

  for (const member of members) {
    try {
      await client.query(
        `INSERT INTO group_members (group_id, user_id, name, email, role, joined_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [member.groupId, member.userId, member.name, member.email, member.role],
      );
      created++;
      console.log(`   ✅ Added member: ${member.name} (${member.role}) to group ${member.groupId}`);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        console.log(`   ⚠️  Member already exists: ${member.name} in group ${member.groupId}`);
      } else {
        throw error;
      }
    }
  }

  return created;
}

async function seedExpenses(client, userId, categoryCount) {
  console.log('\n💰 Seeding expenses...');

  // Check existing expenses
  const existingCheck = await client.query(
    'SELECT COUNT(*) as count FROM expenses WHERE user_id = $1',
    [userId],
  );
  const existingCount = parseInt(existingCheck.rows[0].count);
  console.log(`   Found ${existingCount} existing expenses for test user`);

  const expenses = generateExpenses(userId, categoryCount);
  let created = 0;

  for (const expense of expenses) {
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
    if (created <= 5) {
      console.log(`   ✅ Created expense: ${expense.description} - $${expense.amount}`);
    }
  }

  if (created > 5) {
    console.log(`   ... and ${created - 5} more expenses`);
  }

  return created;
}

async function generateStatistics(client, userId) {
  console.log('\n📊 Statistics Summary:');

  const stats = await client.query(
    `
    SELECT c.name_en, COUNT(*) as count, SUM(e.amount) as total
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = $1
    GROUP BY c.name_en
    ORDER BY total DESC
  `,
    [userId],
  );

  let totalAmount = 0;
  let totalCount = 0;

  stats.rows.forEach((row) => {
    const amount = parseFloat(row.total);
    totalAmount += amount;
    totalCount += parseInt(row.count);
    console.log(`   ${row.name_en}: ${row.count} expenses, $${amount.toFixed(2)}`);
  });

  console.log(`\n   Total: ${totalCount} expenses, $${totalAmount.toFixed(2)}`);
}

async function seedPostgresTestData() {
  console.log('🚀 Starting PostgreSQL test data seeding...');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${TEST_USER_EMAIL}\n`);

  const client = new Client(config);

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Check if categories exist
    const categoryResult = await client.query('SELECT COUNT(*) as count FROM categories');
    const categoryCount = parseInt(categoryResult.rows[0].count);

    if (categoryCount === 0) {
      console.log('❌ No categories found. Please seed categories first.');
      console.log(
        '   Run: psql "host=localhost dbname=expenses user=postgres" -f app/database/seed-categories.sql',
      );
      return;
    }

    console.log(`📊 Found ${categoryCount} categories`);

    // Ensure test user exists
    const userId = await ensureTestUser(client);

    // Ensure tables exist (for group management)
    await ensureTablesExist(client);

    // Seed groups
    const groupIds = await seedGroups(client, userId);

    // Seed members
    const memberCount = await seedMembers(client, groupIds, userId);

    // Seed expenses
    const expenseCount = await seedExpenses(client, userId, categoryCount);

    // Generate statistics
    await generateStatistics(client, userId);

    console.log('\n✅ Seeding completed successfully!');
    console.log(`   Groups created: ${groupIds.length}`);
    console.log(`   Members created: ${memberCount}`);
    console.log(`   Expenses created: ${expenseCount}`);
    console.log(`\n🔐 Login credentials:`);
    console.log(`   Email: ${TEST_USER_EMAIL}`);
    console.log(`   Password: ${TEST_USER_PASSWORD}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

// Run the seeding
seedPostgresTestData();
