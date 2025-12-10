/**
 * Test User Constants
 *
 * Standard test user used across all tests and seeding scripts
 */

const bcrypt = require('bcrypt');

const TEST_USER = {
  email: 'test@expenses.local',
  password: 'Test123!',
  name: 'Test User',
};

// Pre-hashed password for Test123!
// Generated with: bcrypt.hashSync('Test123!', 10)
const TEST_USER_PASSWORD_HASH = '$2b$10$rQZ7yJ8qN5J5n5Y5Y5Y5YuK7qJ8qN5J5n5Y5Y5Y5YuK7qJ8qN5J5m';

/**
 * Ensure test user exists in database
 * @param {Client} client - PostgreSQL client
 * @returns {Promise<number>} User ID
 */
async function ensureTestUser(client) {
  // Check if test user exists
  const userResult = await client.query('SELECT id FROM users WHERE email = $1', [TEST_USER.email]);

  if (userResult.rows.length > 0) {
    return userResult.rows[0].id;
  }

  // Create test user
  const insertResult = await client.query(
    `INSERT INTO users (email, name, password_hash, created_at, updated_at) 
     VALUES ($1, $2, $3, NOW(), NOW()) 
     RETURNING id`,
    [TEST_USER.email, TEST_USER.name, TEST_USER_PASSWORD_HASH],
  );

  return insertResult.rows[0].id;
}

module.exports = {
  TEST_USER,
  TEST_USER_PASSWORD_HASH,
  ensureTestUser,
};
