const path = require('path');

// Adjusted for tests/ location (moved up from tests/config)
const appServicesDir = path.resolve(__dirname, '../app/services');
const appFrontendDir = path.resolve(__dirname, '../app/frontend/src');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  roots: ['<rootDir>/tests', '<rootDir>/app'],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/tests/node_modules',
    '<rootDir>/app/frontend/node_modules',
  ],
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      rootDir: path.resolve(__dirname, '..'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/tests/unit/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
      modulePaths: ['<rootDir>/tests/node_modules'],
      collectCoverageFrom: [
        '<rootDir>/app/services/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/*.module.ts',
        '!**/main.ts',
        '!**/dist/**',
      ],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              module: 'esnext',
              moduleResolution: 'node',
              resolveJsonModule: true,
              skipLibCheck: true,
              baseUrl: path.resolve(__dirname, '..'),
              paths: {
                bcrypt: [path.resolve(__dirname, 'node_modules/bcrypt')],
                '*': [path.resolve(__dirname, 'node_modules/*')],
              },
            },
          },
        ],
      },
      moduleNameMapper: {
        '^zustand$': '<rootDir>/tests/node_modules/zustand',
        '^bcrypt$': '<rootDir>/tests/__mocks__/bcrypt.js',
      },
      globals: {
        'import.meta': {
          env: {
            VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3002',
            VITE_USE_MOCK_API: process.env.VITE_USE_MOCK_API || 'true',
          },
        },
      },
    },
    {
      displayName: 'component',
      rootDir: path.resolve(__dirname, '..'),
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/tests/component/**/*.test.tsx',
        '<rootDir>/tests/component/**/*.spec.tsx',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
      collectCoverageFrom: [
        '<rootDir>/app/frontend/src/**/*.ts',
        '<rootDir>/app/frontend/src/**/*.tsx',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/main.tsx',
        '!**/vite-env.d.ts',
      ],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              jsx: 'react-jsx',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              module: 'esnext',
              moduleResolution: 'node',
              skipLibCheck: true,
              baseUrl: path.resolve(__dirname, '..'),
              typeRoots: [path.resolve(__dirname, 'node_modules/@types')],
              paths: {
                react: [path.resolve(__dirname, 'node_modules/react')],
                'react/*': [path.resolve(__dirname, 'node_modules/react/*')],
                'react-dom': [path.resolve(__dirname, 'node_modules/react-dom')],
                'react-dom/*': [path.resolve(__dirname, 'node_modules/react-dom/*')],
                'react-i18next': [path.resolve(__dirname, 'node_modules/react-i18next')],
              },
            },
          },
        ],
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
        '^react$': '<rootDir>/tests/node_modules/react',
        '^react/jsx-runtime$': '<rootDir>/tests/node_modules/react/jsx-runtime',
        '^react/jsx-dev-runtime$': '<rootDir>/tests/node_modules/react/jsx-dev-runtime',
        '^react-dom$': '<rootDir>/tests/node_modules/react-dom',
        '^react-dom/client$': '<rootDir>/tests/node_modules/react-dom/client',
        '^react-i18next$': '<rootDir>/tests/node_modules/react-i18next',
      },
    },
    {
      displayName: 'integration',
      rootDir: path.resolve(__dirname, '..'),
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/tests/integration/**/*.test.ts',
        '<rootDir>/tests/integration/**/*.spec.ts',
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
    {
      displayName: 'contract',
      rootDir: path.resolve(__dirname, '..'),
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/contract/**/*.pact.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
      transform: {
        '^.+\\.tsx?$': [
          require.resolve('ts-jest'),
          {
            tsconfig: {
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        ],
      },
    },
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>/tests/node_modules', '<rootDir>/app/frontend/node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/src/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@frontend/(.*)$': '<rootDir>/app/frontend/src/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
  },
  collectCoverage: false,
  coverageDirectory: '<rootDir>/tests/reports/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [],
  coverageThreshold: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } },
  maxWorkers: '50%',
  testTimeout: 30000,
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/e2e/', '/bdd/'],
  reporters: ['default'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
