#!/usr/bin/env node

/**
 * Test Data Seeding Tool
 *
 * Populates the database with sample expenses for testing
 * Run: node tools/seed-test-data.js
 */

import { Client } from 'pg';
import { TEST_USER, ensureTestUser } from './test-user.js';

// Database connection from environment or defaults
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'expenses',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
};

// Sample expenses data
const generateExpenses = (userId, categoryCount) => {
  const expenses = [];
  const descriptions = {
    1: ['Dinner at restaurant', 'Movie tickets', 'Concert tickets', 'New shoes', 'Weekend trip'],
    2: ['Grocery shopping', 'Fresh vegetables', 'Corner store', 'Supermarket'],
    3: ['Pharmacy', 'Doctor visit', 'Dental checkup', 'Health insurance'],
    4: ['Car insurance', 'Home insurance', 'Life insurance'],
    5: ['Books', 'School supplies', 'Online course', 'Private lessons'],
    6: ['Gas station', 'Car maintenance', 'Parking', 'Highway toll'],
    7: ['Electricity bill', 'Water bill', 'Internet', 'Phone bill'],
    8: ['Savings deposit', 'Investment', 'Emergency fund'],
    9: ['Cleaning supplies', 'Home repair', 'Furniture', 'Kitchen items'],
  };

  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'];
  const currencies = ['USD', 'EUR', 'ILS'];

  // Generate 50 random expenses over the last 3 months
  for (let i = 0; i < 50; i++) {
    const categoryId = Math.floor(Math.random() * categoryCount) + 1;
    const categoryDescriptions = descriptions[categoryId] || ['Generic expense'];
    const description =
      categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

    // Random date within last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
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

async function seedTestData() {
  const client = new Client(config);

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

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
    console.log('👤 Ensuring test user exists...');
    const userId = await ensureTestUser(client);
    console.log(`✅ Using test user: ${TEST_USER.email} (ID: ${userId})`);
    console.log(`   Login with: ${TEST_USER.email} / ${TEST_USER.password}`);

    // Check if expenses already exist for this user
    const expenseCheck = await client.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = $1',
      [userId],
    );
    const existingExpenses = parseInt(expenseCheck.rows[0].count);

    if (existingExpenses > 0) {
      console.log(`⚠️  User already has ${existingExpenses} expenses`);
      const { createInterface } = await import('readline');
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        readline.question('Add more test data anyway? (y/n): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('❌ Cancelled');
        return;
      }
    }

    // Generate and insert expenses
    console.log('💰 Generating test expenses...');
    const expenses = generateExpenses(userId, categoryCount);

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
    }

    console.log(`✅ Successfully seeded ${expenses.length} test expenses!`);
    console.log('\n📈 Summary:');

    const stats = await client.query(
      `
      SELECT c.name_en, COUNT(*) as count, SUM(e.amount) as total
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = $1
      GROUP BY c.name_en
      ORDER BY count DESC
    `,
      [userId],
    );

    stats.rows.forEach((row) => {
      console.log(`   ${row.name_en}: ${row.count} expenses, $${parseFloat(row.total).toFixed(2)}`);
    });
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

// Run the seeding
seedTestData();
