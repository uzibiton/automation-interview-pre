/**
 * Manual mock for bcrypt module
 * Used by Jest when jest.mock('bcrypt') is called
 */

const hash = jest.fn().mockResolvedValue('hashed_password_123');
const compare = jest.fn().mockResolvedValue(true);

// Reset helpers for tests
const __resetMocks = () => {
  hash.mockReset().mockResolvedValue('hashed_password_123');
  compare.mockReset().mockResolvedValue(true);
};

module.exports = { hash, compare, __resetMocks };
