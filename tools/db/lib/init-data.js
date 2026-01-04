/**
 * Initialization Data for Develop Environment
 *
 * This file defines the predefined users, groups, and expenses
 * for the --init flag. The structure matches the app's Firestore schema:
 *
 * - User: { email, name, passwordHash?, googleId?, avatarUrl?, createdAt, updatedAt }
 * - Group: {
 *     name, ownerId, members: [userId, ...], memberDetails: [{id, role, joinedAt}],
 *     createdAt, updatedAt
 *   }
 * - Expense: { userId, categoryId, amount, currency, description, date, paymentMethod, ... }
 *
 * IMPORTANT: Groups use embedded members/memberDetails arrays, NOT a separate collection!
 * Roles: owner, admin, member, viewer
 */

// Password hash for "Test123!" - bcrypt 10 rounds
const TEST_USER_PASSWORD_HASH = '$2b$10$deWzoV5fs/.zOkxXdeETueCRNaSVF.xuR/4K0TSgMes5xB.cmNhFu';

/**
 * Users to create
 * - test-user-001: Primary test user (local auth)
 * - user-google-001: Google OAuth user (uzibdocs@gmail.com)
 * - user-002 to user-005: Role-based test users
 */
export const INIT_USERS = [
  {
    id: 'test-user-001',
    email: 'test@expenses.local',
    name: 'Test User',
    passwordHash: TEST_USER_PASSWORD_HASH,
    googleId: null,
    avatarUrl: null,
  },
  {
    id: 'user-google-001',
    email: 'uzibdocs@gmail.com',
    name: 'Uzi Bdocs',
    passwordHash: null,
    googleId: 'google-uzibdocs',
    avatarUrl: null,
  },
  {
    id: 'user-002',
    email: 'admin@expenses.local',
    name: 'Admin User',
    passwordHash: TEST_USER_PASSWORD_HASH,
    googleId: null,
    avatarUrl: null,
  },
  {
    id: 'user-003',
    email: 'member@expenses.local',
    name: 'Member User',
    passwordHash: TEST_USER_PASSWORD_HASH,
    googleId: null,
    avatarUrl: null,
  },
  {
    id: 'user-004',
    email: 'viewer@expenses.local',
    name: 'Viewer User',
    passwordHash: TEST_USER_PASSWORD_HASH,
    googleId: null,
    avatarUrl: null,
  },
  {
    id: 'user-005',
    email: 'solo@expenses.local',
    name: 'Solo User',
    passwordHash: TEST_USER_PASSWORD_HASH,
    googleId: null,
    avatarUrl: null,
  },
];

// Helper to get current ISO timestamp
const now = () => new Date().toISOString();

/**
 * Groups to create
 * Format matches app's Firestore schema with embedded members/memberDetails
 */
export const INIT_GROUPS = [
  {
    // Group owned by test-user-001
    name: 'Family Budget',
    ownerId: 'test-user-001',
    members: ['test-user-001', 'user-002', 'user-003', 'user-004'],
    memberDetails: [
      { id: 'test-user-001', name: 'Test User', role: 'owner' },
      { id: 'user-002', name: 'Admin User', role: 'admin' },
      { id: 'user-003', name: 'Member User', role: 'member' },
      { id: 'user-004', name: 'Viewer User', role: 'viewer' },
    ],
  },
  {
    // Second group owned by test-user-001
    name: 'Vacation Fund',
    ownerId: 'test-user-001',
    members: ['test-user-001', 'user-002', 'user-003', 'user-004'],
    memberDetails: [
      { id: 'test-user-001', name: 'Test User', role: 'owner' },
      { id: 'user-002', name: 'Admin User', role: 'admin' },
      { id: 'user-003', name: 'Member User', role: 'member' },
      { id: 'user-004', name: 'Viewer User', role: 'viewer' },
    ],
  },
  {
    // Group owned by Google user
    name: 'Work Budget',
    ownerId: 'user-google-001',
    members: ['user-google-001', 'user-002', 'user-003', 'user-004'],
    memberDetails: [
      { id: 'user-google-001', name: 'Uzi Bdocs', role: 'owner' },
      { id: 'user-002', name: 'Admin User', role: 'admin' },
      { id: 'user-003', name: 'Member User', role: 'member' },
      { id: 'user-004', name: 'Viewer User', role: 'viewer' },
    ],
  },
  {
    // Second group owned by Google user
    name: 'Project Fund',
    ownerId: 'user-google-001',
    members: ['user-google-001', 'user-002', 'user-003', 'user-004'],
    memberDetails: [
      { id: 'user-google-001', name: 'Uzi Bdocs', role: 'owner' },
      { id: 'user-002', name: 'Admin User', role: 'admin' },
      { id: 'user-003', name: 'Member User', role: 'member' },
      { id: 'user-004', name: 'Viewer User', role: 'viewer' },
    ],
  },
];

/**
 * Get users who should have expenses generated
 * Excludes solo user (user-005) from group-related expenses
 */
export const getUsersForExpenses = () => {
  return INIT_USERS.filter((u) => u.id !== 'user-005');
};

/**
 * Password for all local auth users
 */
export const TEST_PASSWORD = 'Test123!';

// Legacy exports for backwards compatibility (not used with new structure)
export const INIT_MEMBERS = [];
