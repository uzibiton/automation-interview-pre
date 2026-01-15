#!/usr/bin/env node

/**
 * Firestore Test Data Seeding Tool
 *
 * Populates Firestore with sample groups, members, and expenses for test user
 * Run: node tools/seed-firestore-test-data.js
 */

import { Firestore } from '@google-cloud/firestore';

const TEST_USER_EMAIL = 'test@expenses.local';
const TEST_USER_ID = 'test-user-001'; // Firestore uses string IDs

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID || 'skillful-eon-477917-b7',
});

// Sample groups data
const generateGroups = () => [
  {
    id: 'group-001',
    name: 'Family Budget',
    description: 'Shared household expenses and bills',
    createdBy: TEST_USER_ID,
    memberCount: 4,
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    isActive: true,
  },
  {
    id: 'group-002',
    name: 'Vacation Fund',
    description: 'Saving for our summer vacation',
    createdBy: TEST_USER_ID,
    memberCount: 2,
    createdAt: new Date('2024-02-01T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
    isActive: true,
  },
];

// Sample members data
const generateMembers = () => [
  {
    id: 'member-001',
    groupId: 'group-001',
    userId: TEST_USER_ID,
    name: 'Test User',
    email: TEST_USER_EMAIL,
    role: 'owner',
    avatar: null,
    joinedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  },
  {
    id: 'member-002',
    groupId: 'group-001',
    userId: 'user-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'admin',
    avatar: null,
    joinedAt: new Date('2024-01-16T09:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-16T09:30:00Z').toISOString(),
  },
  {
    id: 'member-003',
    groupId: 'group-001',
    userId: 'user-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'member',
    avatar: null,
    joinedAt: new Date('2024-01-17T11:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-17T11:15:00Z').toISOString(),
  },
  {
    id: 'member-004',
    groupId: 'group-001',
    userId: 'user-004',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'viewer',
    avatar: null,
    joinedAt: new Date('2024-01-18T13:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-18T13:45:00Z').toISOString(),
  },
  {
    id: 'member-005',
    groupId: 'group-002',
    userId: TEST_USER_ID,
    name: 'Test User',
    email: TEST_USER_EMAIL,
    role: 'owner',
    avatar: null,
    joinedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
  },
  {
    id: 'member-006',
    groupId: 'group-002',
    userId: 'user-005',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'admin',
    avatar: null,
    joinedAt: new Date('2024-02-02T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-02-02T10:00:00Z').toISOString(),
  },
];

// Sample expenses data
const generateExpenses = () => {
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
    const categoryId = Math.floor(Math.random() * 9) + 1;
    const categoryDescriptions = descriptions[categoryId] || ['Generic expense'];
    const description =
      categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

    // Random date within last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    expenses.push({
      userId: TEST_USER_ID,
      categoryId,
      subCategoryId: null,
      amount: parseFloat((Math.random() * 200 + 10).toFixed(2)), // $10-$210
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      description,
      date: date.toISOString().split('T')[0],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return expenses;
};

async function ensureTestUser() {
  console.log('👤 Ensuring test user exists in Firestore...');

  const usersRef = firestore.collection('users');
  const userQuery = await usersRef.where('email', '==', TEST_USER_EMAIL).get();

  if (userQuery.empty) {
    console.log('   Creating test user...');
    await usersRef.doc(TEST_USER_ID).set({
      email: TEST_USER_EMAIL,
      name: 'Test User',
      // Password hash for "Test123!" - bcrypt 10 rounds
      passwordHash: '$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`   ✅ Created user: ${TEST_USER_EMAIL}`);
  } else {
    console.log(`   ✅ User already exists: ${TEST_USER_EMAIL}`);
  }

  return TEST_USER_ID;
}

async function seedGroups() {
  console.log('\n👥 Seeding groups...');
  const groups = generateGroups();
  const groupsRef = firestore.collection('groups');

  for (const group of groups) {
    const docRef = groupsRef.doc(group.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(group);
      console.log(`   ✅ Created group: ${group.name}`);
    } else {
      console.log(`   ⚠️  Group already exists: ${group.name}`);
    }
  }

  return groups.length;
}

async function seedMembers() {
  console.log('\n👤 Seeding group members...');
  const members = generateMembers();
  const membersRef = firestore.collection('group_members');

  for (const member of members) {
    const docRef = membersRef.doc(member.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set(member);
      console.log(`   ✅ Added member: ${member.name} to group ${member.groupId}`);
    } else {
      console.log(`   ⚠️  Member already exists: ${member.name}`);
    }
  }

  return members.length;
}

async function seedExpenses() {
  console.log('\n💰 Seeding expenses...');
  const expenses = generateExpenses();
  const expensesRef = firestore.collection('expenses');

  // Check existing expenses
  const existingQuery = await expensesRef.where('userId', '==', TEST_USER_ID).get();
  console.log(`   Found ${existingQuery.size} existing expenses for test user`);

  let created = 0;
  for (const expense of expenses) {
    const _docRef = await expensesRef.add(expense);
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

async function generateStatistics() {
  console.log('\n📊 Statistics Summary:');

  // Count expenses by category
  const expensesRef = firestore.collection('expenses');
  const expensesQuery = await expensesRef.where('userId', '==', TEST_USER_ID).get();

  const categoryTotals = {};
  let totalAmount = 0;

  expensesQuery.forEach((doc) => {
    const data = doc.data();
    const categoryId = data.categoryId;
    const amount = parseFloat(data.amount);

    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = { count: 0, total: 0 };
    }

    categoryTotals[categoryId].count++;
    categoryTotals[categoryId].total += amount;
    totalAmount += amount;
  });

  console.log(`   Total Expenses: ${expensesQuery.size}`);
  console.log(`   Total Amount: $${totalAmount.toFixed(2)}`);
  console.log(`   Categories:`);

  Object.entries(categoryTotals).forEach(([categoryId, stats]) => {
    console.log(
      `      Category ${categoryId}: ${stats.count} expenses, $${stats.total.toFixed(2)}`,
    );
  });
}

async function seedFirestoreTestData() {
  console.log('🚀 Starting Firestore test data seeding...');
  console.log(`   Project: ${process.env.FIREBASE_PROJECT_ID || 'skillful-eon-477917-b7'}`);
  console.log(`   User: ${TEST_USER_EMAIL}\n`);

  try {
    // Ensure test user exists
    await ensureTestUser();

    // Seed groups
    const groupCount = await seedGroups();

    // Seed members
    const memberCount = await seedMembers();

    // Seed expenses
    const expenseCount = await seedExpenses();

    // Generate statistics
    await generateStatistics();

    console.log('\n✅ Seeding completed successfully!');
    console.log(`   Groups created: ${groupCount}`);
    console.log(`   Members created: ${memberCount}`);
    console.log(`   Expenses created: ${expenseCount}`);
    console.log(`\n🔐 Login credentials:`);
    console.log(`   Email: ${TEST_USER_EMAIL}`);
    console.log(`   Password: Test123!`);
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run the seeding
seedFirestoreTestData();
