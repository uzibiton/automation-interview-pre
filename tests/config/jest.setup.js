/**
 * Jest Setup File
 *
 * This file runs before each test file. Use it for:
 * - Global test configuration
 * - Custom matchers
 * - Mock setup
 * - Test environment configuration
 */

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

console.log('Jest setup complete');
