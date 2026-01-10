/**
 * Jest Setup File
 *
 * This file runs before each test file. Use it for:
 * - Global test configuration
 * - Custom matchers
 * - Mock setup
 * - Test environment configuration
 */

// Mock bcrypt globally - this runs before any test imports
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn().mockResolvedValue(true),
  hashSync: jest.fn().mockReturnValue('hashed_password_123'),
  compareSync: jest.fn().mockReturnValue(true),
  genSaltSync: jest.fn().mockReturnValue('$2b$10$salt'),
  genSalt: jest.fn().mockResolvedValue('$2b$10$salt'),
}));

// Extend Jest matchers (optional)
// import '@testing-library/jest-dom';

// Set longer timeout for all tests if needed
// jest.setTimeout(10000);

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};

// Mock console methods to reduce noise (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

// Setup for specific test frameworks
// For React Testing Library
if (typeof window !== 'undefined') {
  // Browser environment setup
}

// For Node.js tests
if (typeof process !== 'undefined') {
  // Node environment setup
}

// Mock import.meta for Vite compatibility
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3002',
        VITE_USE_MOCK_API: process.env.VITE_USE_MOCK_API || 'true',
      },
    },
  },
  writable: true,
  configurable: true,
});

console.log('Jest setup complete');
