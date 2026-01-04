/**
 * Faker.js Data Generators
 *
 * Generates realistic test data for database seeding
 */

import { faker } from '@faker-js/faker';

// Default expense categories (matching existing seed scripts)
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Entertainment' },
  { id: 2, name: 'Groceries' },
  { id: 3, name: 'Healthcare' },
  { id: 4, name: 'Insurance' },
  { id: 5, name: 'Education' },
  { id: 6, name: 'Transportation' },
  { id: 7, name: 'Utilities' },
  { id: 8, name: 'Savings' },
  { id: 9, name: 'Home' },
];

const PAYMENT_METHODS = ['credit_card', 'debit_card', 'cash', 'bank_transfer'];
const CURRENCIES = ['USD', 'EUR', 'ILS'];
const MEMBER_ROLES = ['admin', 'member', 'viewer'];

/**
 * Generate a realistic user
 */
export function generateUser(overrides = {}) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    ...overrides,
  };
}

/**
 * Generate a realistic expense
 */
export function generateExpense(options = {}) {
  const { categories = DEFAULT_CATEGORIES, userId, daysBack = 60 } = options;

  const category = faker.helpers.arrayElement(categories);

  return {
    userId,
    categoryId: category.id,
    amount: parseFloat(faker.number.float({ min: 10, max: 500, fractionDigits: 2 }).toFixed(2)),
    currency: faker.helpers.arrayElement(CURRENCIES),
    description: generateExpenseDescription(category.name),
    date: faker.date.recent({ days: daysBack }),
    paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
    merchant: faker.company.name(),
  };
}

/**
 * Generate category-appropriate expense descriptions
 */
function generateExpenseDescription(categoryName) {
  const descriptions = {
    Entertainment: () =>
      faker.helpers.arrayElement([
        `${faker.company.name()} - ${faker.helpers.arrayElement(['Movie', 'Concert', 'Show', 'Event'])}`,
        `Dinner at ${faker.company.name()}`,
        faker.commerce.productName(),
      ]),
    Groceries: () =>
      faker.helpers.arrayElement([
        `${faker.company.name()} Supermarket`,
        'Weekly groceries',
        `Fresh ${faker.commerce.productAdjective().toLowerCase()} produce`,
      ]),
    Healthcare: () =>
      faker.helpers.arrayElement([
        'Pharmacy purchase',
        'Doctor visit',
        'Dental checkup',
        `${faker.company.name()} Clinic`,
      ]),
    Insurance: () =>
      faker.helpers.arrayElement([
        `${faker.helpers.arrayElement(['Car', 'Home', 'Life', 'Health'])} insurance`,
        `${faker.company.name()} Insurance`,
      ]),
    Education: () =>
      faker.helpers.arrayElement([
        `${faker.company.name()} Course`,
        'Online learning subscription',
        'Books and supplies',
        faker.lorem.words(2) + ' workshop',
      ]),
    Transportation: () =>
      faker.helpers.arrayElement([
        `${faker.company.name()} Gas Station`,
        'Parking fee',
        'Car maintenance',
        faker.helpers.arrayElement(['Uber', 'Lyft', 'Taxi']) + ' ride',
      ]),
    Utilities: () =>
      faker.helpers.arrayElement([
        `${faker.helpers.arrayElement(['Electricity', 'Water', 'Gas', 'Internet', 'Phone'])} bill`,
        `${faker.company.name()} Services`,
      ]),
    Savings: () =>
      faker.helpers.arrayElement([
        'Monthly savings deposit',
        'Investment contribution',
        'Emergency fund transfer',
      ]),
    Home: () =>
      faker.helpers.arrayElement([
        `${faker.company.name()} Home Improvement`,
        faker.commerce.productName(),
        'Cleaning supplies',
        'Home repair',
      ]),
  };

  const generator = descriptions[categoryName];
  return generator ? generator() : faker.commerce.productName();
}

/**
 * Generate a realistic group
 */
export function generateGroup(options = {}) {
  const { createdBy } = options;

  const groupTypes = [
    () => `${faker.word.adjective()} ${faker.word.noun()} Budget`,
    () => `${faker.location.city()} Trip Fund`,
    () => `${faker.company.buzzNoun()} Expenses`,
    () => `${faker.person.lastName()} Family`,
  ];

  return {
    name: faker.helpers.arrayElement(groupTypes)(),
    description: faker.lorem.sentence(),
    createdBy,
    memberCount: 0, // Will be updated when members are added
    createdAt: faker.date.recent({ days: 90 }),
    updatedAt: new Date(),
    isActive: true,
  };
}

/**
 * Generate a realistic group member
 */
export function generateMember(options = {}) {
  const { groupId, role } = options;
  const user = generateUser();

  return {
    groupId,
    userId: null, // External member
    name: user.name,
    email: user.email,
    role: role || faker.helpers.arrayElement(MEMBER_ROLES),
    avatar: faker.image.avatar(),
    joinedAt: faker.date.recent({ days: 60 }),
    updatedAt: new Date(),
  };
}

/**
 * Generate multiple expenses
 */
export function generateExpenses(count, options = {}) {
  return Array.from({ length: count }, () => generateExpense(options));
}

/**
 * Generate multiple groups
 */
export function generateGroups(count, options = {}) {
  return Array.from({ length: count }, () => generateGroup(options));
}

/**
 * Generate multiple members for a group
 */
export function generateMembers(count, options = {}) {
  return Array.from({ length: count }, () => generateMember(options));
}

export { DEFAULT_CATEGORIES, PAYMENT_METHODS, CURRENCIES, MEMBER_ROLES };
