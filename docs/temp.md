1. Context and Goal
   System/component: Expense Tracker backend (auth-service and api-service).
   Testing objective: Implement a prioritized unit-test suite to raise backend unit coverage (target: overall ≥80%, critical paths ≥90%), starting with AuthService, ExpensesService, and GroupsService.
2. System Overview
   High-level architecture:
   auth-service (port 3001): authentication and UsersService.
   api-service (port 3002): ExpensesService, GroupsService, InvitationsService, other business logic.
   postgres DB (local via docker-compose.yml) and optional Firestore mode.
   Relevant flows for testing:
   Authentication: register, loginWithPassword, validateToken, validateGoogleUser.
   Expense lifecycle: findAll, findOne, create, update, delete (filters, ownership).
   Group management: getCurrentGroupForUser, getGroupMembers, updateMemberRole, removeMember.
   Assumptions:
   Unit tests run from the test project at config.
   DATABASE_TYPE env var toggles Postgres vs Firestore behavior.
   Unit tests should mock external systems (DB, Firestore, JWT, bcrypt).
3. Existing State
   Existing tests:
   math.test.ts
   useInvitationStore.test.ts
   Template: expenses.service.test.ts.template
   Test infrastructure:
   Jest config and runner: jest.config.js, package.json.
   Playwright E2E config: playwright.config.ts.
   Coverage artifacts folder: coverage (current reports show 0%).
   Known constraints:
   Root package.json does not include config as a workspace; running root npm run test:unit may fail unless executed from config.
   Services contain dual-mode logic (Postgres vs Firestore), requiring mode-specific mocks.
   Unit tests must avoid starting containers.
4. Risk Analysis
   Critical paths:
   Authentication: token creation/validation, password hashing.
   Expense CRUD: correct filtering, ownership, totals.
   Authorization: group roles and member management.
   Failure modes:
   Duplicate user creation (missing conflict handling).
   Incorrect password validation → unauthorized access.
   Returning another user's expenses → data leak.
   Firestore-only logic called in Postgres mode → runtime errors.
   High-impact areas: AuthService methods, ExpensesService query/filter logic, authorization checks in GroupsService.
5. Test Plan
   Priority legend: P0 = must-have, P1 = high-value, P2 = optional.

Unit tests (P0)

What to test:
AuthService:
register: password hashing flow, duplicate email → ConflictException, returns token+user.
loginWithPassword: success and unauthorized branches, bcrypt compare behavior.
login: JWT payload structure and returned fields.
validateToken: payload parsing and user attachment.
validateGoogleUser: create-or-return semantics.
ExpensesService:
findAll: date/category/group filters, ordering, empty results.
findOne: NotFound and ownership checks.
create: mapping userId, validation of amount/date.
update/delete: success, NotFound, Forbidden cases.
GroupsService:
Firestore gating (checkFirestoreRequired).
getCurrentGroupForUser: existing vs default creation.
getGroupMembers/updateMemberRole/removeMember: authz and error paths.
What NOT to test:
Third-party library internals (bcrypt internals, JWT library internals).
TypeORM internals or Firestore network calls.
Mocks required:
TypeORM Repository methods, Firestore repository methods, JwtService, bcrypt.
Tests should be placed under tests/unit/services/<service>/....
Integration tests (P1)

What to test:
API endpoints for Expenses and Groups against a real Postgres DB (Docker Compose), happy paths and common error flows.
What NOT to test:
Full OAuth flows using external providers.
Requirements:
Seed DB deterministically using seed-enhanced.js or npm run seed:postgres.
End-to-end tests (P1)

What to test:
Critical UI journeys (login → create expense → list → delete) with Playwright.
What NOT to test:
Exhaustive UI permutations; focus on critical journeys.
Contract / API tests (P1)

What to test:
Interface contracts between frontend and API and between api-service and auth-service (request/response shapes).
What NOT to test:
Implementation details of providers.
Non-functional tests (P2)

Performance: basic k6/Locust scenarios for key flows.
Security: OWASP ZAP scans and dependency vulnerability checks.
What NOT to test in CI unit pipeline: large-scale load tests. 6. Coverage Gaps
Untested modules:
All primary methods in AuthService.
Full CRUD and filter/error branches in ExpensesService.
Authorization and Firestore gating in GroupsService.
Why it matters:
Security vulnerabilities, data integrity issues, and privilege escalation risks live in these untested areas; increasing coverage reduces regression risk and improves release confidence. 7. Test Data & Environments
Required data:
Deterministic user fixtures (e.g., test@expenses.local, admin@expenses.local).
Expense fixtures with fixed amounts, categories, dates.
Group fixtures with ownerId and members arrays.
Environments:
Unit: run via Jest in config with mocks.
Integration: local Docker Compose stack with Postgres; optionally Firestore emulator for Firestore mode.
Mocking vs real dependencies:
Unit: mock DB, Firestore, JWT, bcrypt.
Integration/E2E: use seeded real DB and services; seed scripts: run npm run seed:enhanced or npm run seed:postgres. 8. Automation Guidance
Grouping:
Unit: tests/unit/** (fast, mocked).
Integration: tests/integration/**.
E2E: tests/e2e/\*\* (Playwright).
PR pipeline:
Run unit tests on every PR; require passing tests and coverage gate (global ≥70% minimum).
Nightly pipeline:
Run integration, E2E, contract, and non-functional suites; publish full coverage artifacts.
Release gates:
Block release if unit tests fail or critical-path coverage (Auth/Expenses/Groups) < 90%, or high/critical security findings are present.
Recommended commands:
Run unit tests with coverage from test project: change to config and run the configured test script (example: cd tests/config then run the project's unit test script with --coverage). 9. Implementation Notes for Agent
Ordering / dependencies:
Add handoff file docs/qa/UNIT_TEST_COVERAGE_PLAN.md.
Implement unit tests for AuthService first (security-critical).
Implement ExpensesService unit tests next (business-critical).
Implement GroupsService tests (authorization).
Run coverage and iterate thresholds; then implement Integration/E2E as needed.
Known tricky areas:
Dual-mode logic: set process.env.DATABASE_TYPE in test setup for Firestore-specific behavior.
NestJS optional DI: pass undefined or mocks for constructor optional params where needed.
Mocking createQueryBuilder from TypeORM is complex; prefer abstracting queryable behavior or test service-level logic without complex query builders.
Ensure deterministic JWT and bcrypt mocks (return fixed token and hashed values).
Explicit do / do-not:
DO mock external services for unit tests (DB, Firestore, JWT, bcrypt).
DO keep tests deterministic; avoid Faker/random in unit tests.
DO use Arrange-Act-Assert pattern and clear mocks in beforeEach.
DO place tests under tests/unit/services/<service>/.
DO set DATABASE_TYPE in tests when validating mode-specific branches.
DO NOT start real containers for unit tests.
DO NOT test TypeORM or Firestore internals; test service behavior. 10. Open Questions
Should CI run a matrix for both DATABASE_TYPE=postgres and DATABASE_TYPE=firestore to cover both branches?
Is the team willing to add config into root package.json workspaces, or should tests continue to be run from inside config?
Are there preferred mock libraries (plain Jest mocks vs jest-mock-extended or ts-mockito)?
Is a canonical test JWT payload or token fixture available to reuse across tests?
Is the Firestore emulator available in CI, or should Firestore-path coverage be validated locally only?
End of artifact.
