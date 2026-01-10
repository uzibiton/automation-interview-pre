/**
 * Mock bcrypt module for unit tests
 *
 * This mock replaces the real bcrypt to:
 * 1. Speed up tests (real bcrypt hashing is intentionally slow)
 * 2. Provide predictable, controllable outputs
 * 3. Allow verification of hash/compare calls
 */
module.exports = {
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('mock_salt'),
  hashSync: jest.fn().mockReturnValue('hashed_password_123'),
  compareSync: jest.fn().mockReturnValue(true),
  genSaltSync: jest.fn().mockReturnValue('mock_salt'),
};
