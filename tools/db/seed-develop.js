#!/usr/bin/env node

/**
 * Develop Environment Seeding Tool
 *
 * Clears and populates Firestore with test data for develop environment.
 * Creates two users with two groups each, members, and expenses.
 *
 * Run: node tools/db/seed-develop.js
 */

import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore({
  projectId: process.env.FIREBASE_PROJECT_ID || 'skillful-eon-477917-b7',
});

// Test users configuration
const USERS = [
  {
    id: 'test-user-001',
    email: 'test@expenses.local',
    name: 'Test User',
    // Password hash for "Test123!" - bcrypt 10 rounds
    passwordHash: '$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu',
    authProvider: 'local',
  },
  {
    id: 'WggNvAMznTWvTk27o2Aj', // Real Google OAuth user ID
    email: 'uzibdocs@gmail.com',
    name: 'uzi biton',
    authProvider: 'google',
    googleId: '100605233431935371506',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocK6eW0NcGoUq5IIrsR4jmBS9_GmOmiRCOKXhH9FSmRHWVjcwg=s96-c',
    // No password - Google OAuth user
  },
];

// Generate groups for a user
const generateGroupsForUser = (user, _startIndex) => [
  {
    id: `group-${user.id}-001`,
    name: `${user.name}'s Family Budget`,
    description: 'Shared household expenses and bills',
    ownerId: user.id,
    members: [user.id],
    memberDetails: [
      {
        id: user.id,
        role: 'owner',
        joinedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      },
    ],
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  },
  {
    id: `group-${user.id}-002`,
    name: `${user.name}'s Vacation Fund`,
    description: 'Saving for vacation',
    ownerId: user.id,
    members: [user.id],
    memberDetails: [
      {
        id: user.id,
        role: 'owner',
        joinedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
      },
    ],
    createdAt: new Date('2024-02-01T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
  },
];

// Sample additional members to add to groups
const ADDITIONAL_MEMBERS = [
  { id: 'member-jane', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 'member-bob', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
  { id: 'member-alice', name: 'Alice Williams', email: 'alice.williams@example.com' },
  { id: 'member-charlie', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
];

// Generate expenses for a user
const generateExpensesForUser = (userId, groupId) => {
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

  // Generate 15 random expenses per user over the last 60 days
  for (let i = 0; i < 15; i++) {
    const categoryId = Math.floor(Math.random() * 9) + 1;
    const categoryDescriptions = descriptions[categoryId] || ['Generic expense'];
    const description =
      categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

    // Random date within last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    expenses.push({
      userId,
      groupId,
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

async function clearCollection(collectionName) {
  console.log(`   Clearing ${collectionName}...`);
  const collectionRef = firestore.collection(collectionName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`   ✅ ${collectionName} is already empty`);
    return 0;
  }

  const batch = firestore.batch();
  let count = 0;

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
    count++;
  });

  await batch.commit();
  console.log(`   ✅ Deleted ${count} documents from ${collectionName}`);
  return count;
}

async function clearAllData() {
  console.log('\n🗑️  Clearing existing data...');

  await clearCollection('expenses');
  await clearCollection('groups');
  await clearCollection('group_members');
  await clearCollection('invitations');
  await clearCollection('users');

  console.log('   ✅ All collections cleared');
}

async function seedUsers() {
  console.log('\n👤 Seeding users...');
  const usersRef = firestore.collection('users');

  for (const user of USERS) {
    const userData = {
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Only add passwordHash for local auth users
    if (user.passwordHash) {
      userData.passwordHash = user.passwordHash;
    }

    // Add Google OAuth fields if present
    if (user.googleId) {
      userData.googleId = user.googleId;
    }
    if (user.avatarUrl) {
      userData.avatarUrl = user.avatarUrl;
    }

    await usersRef.doc(user.id).set(userData);
    console.log(`   ✅ Created user: ${user.email} (${user.authProvider})`);
  }

  return USERS.length;
}

async function seedGroups() {
  console.log('\n👥 Seeding groups...');
  const groupsRef = firestore.collection('groups');
  let groupCount = 0;

  for (const user of USERS) {
    const groups = generateGroupsForUser(user, groupCount);

    for (const group of groups) {
      // Add additional members to the first group
      if (group.id.endsWith('-001')) {
        const additionalMember = ADDITIONAL_MEMBERS[groupCount % ADDITIONAL_MEMBERS.length];
        group.members.push(additionalMember.id);
        group.memberDetails.push({
          id: additionalMember.id,
          role: 'member',
          joinedAt: new Date().toISOString(),
        });
      }

      await groupsRef.doc(group.id).set(group);
      console.log(`   ✅ Created group: ${group.name} for ${user.name}`);
      groupCount++;
    }
  }

  return groupCount;
}

async function seedExpenses() {
  console.log('\n💰 Seeding expenses...');
  const expensesRef = firestore.collection('expenses');
  let expenseCount = 0;

  for (const user of USERS) {
    const groupId = `group-${user.id}-001`; // Primary group for expenses
    const expenses = generateExpensesForUser(user.id, groupId);

    for (const expense of expenses) {
      await expensesRef.add(expense);
      expenseCount++;
    }

    console.log(`   ✅ Created ${expenses.length} expenses for ${user.name}`);
  }

  return expenseCount;
}

async function generateStatistics() {
  console.log('\n📊 Statistics Summary:');

  const usersRef = firestore.collection('users');
  const groupsRef = firestore.collection('groups');
  const expensesRef = firestore.collection('expenses');

  const usersSnapshot = await usersRef.get();
  const groupsSnapshot = await groupsRef.get();
  const expensesSnapshot = await expensesRef.get();

  console.log(`   Total Users: ${usersSnapshot.size}`);
  console.log(`   Total Groups: ${groupsSnapshot.size}`);
  console.log(`   Total Expenses: ${expensesSnapshot.size}`);

  // Calculate total amount
  let totalAmount = 0;
  expensesSnapshot.forEach((doc) => {
    totalAmount += parseFloat(doc.data().amount);
  });
  console.log(`   Total Amount: $${totalAmount.toFixed(2)}`);
}

async function seedDevelopEnvironment() {
  console.log('🚀 Starting Develop Environment Seeding...');
  console.log(`   Project: ${process.env.FIREBASE_PROJECT_ID || 'skillful-eon-477917-b7'}`);
  console.log(`   Users to create: ${USERS.map((u) => u.email).join(', ')}\n`);

  try {
    // Clear existing data
    await clearAllData();

    // Seed users
    const userCount = await seedUsers();

    // Seed groups
    const groupCount = await seedGroups();

    // Seed expenses
    const expenseCount = await seedExpenses();

    // Generate statistics
    await generateStatistics();

    console.log('\n✅ Seeding completed successfully!');
    console.log(`   Users created: ${userCount}`);
    console.log(`   Groups created: ${groupCount}`);
    console.log(`   Expenses created: ${expenseCount}`);

    console.log('\n🔐 Login credentials:');
    for (const user of USERS) {
      console.log(`   ${user.email} / Test123!`);
    }
  } catch (error) {
    console.error('❌ Error seeding develop environment:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDevelopEnvironment();
