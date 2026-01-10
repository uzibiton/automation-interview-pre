/**
 * Manual mock for bcrypt module
 * Used by Jest when jest.mock('bcrypt') is called
 */

export const hash = jest.fn().mockResolvedValue('hashed_password_123');
export const compare = jest.fn().mockResolvedValue(true);

// Reset helpers for tests
export const __resetMocks = () => {
  hash.mockReset().mockResolvedValue('hashed_password_123');
  compare.mockReset().mockResolvedValue(true);
};
