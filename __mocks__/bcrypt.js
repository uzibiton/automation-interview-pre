/**
 * Mock for bcrypt module
 * Uses jest.fn() mocks that can be controlled in tests
 */

const hash = jest.fn((password, saltRounds) => {
  return Promise.resolve('hashed_password_123');
});

const compare = jest.fn((password, hash) => {
  return Promise.resolve(true);
});

const hashSync = jest.fn((password, saltRounds) => 'hashed_password_123');
const compareSync = jest.fn((password, hash) => true);
const genSaltSync = jest.fn((rounds) => '$2b$10$salt');
const genSalt = jest.fn((rounds) => Promise.resolve('$2b$10$salt'));

module.exports = {
  hash,
  compare,
  hashSync,
  compareSync,
  genSaltSync,
  genSalt,
};
