# Detailed Design Document (DDD) Template

> **Instructions**: Use this template to document low-level implementation details for a specific component or feature. Replace all placeholders with actual content.

## Document Information

| Field                      | Value                                                                  |
| -------------------------- | ---------------------------------------------------------------------- |
| **Component/Feature Name** | [Component/Feature Name]                                               |
| **Document Type**          | Detailed Design                                                        |
| **Author**                 | [Your Name]                                                            |
| **Date Created**           | [YYYY-MM-DD]                                                           |
| **Last Updated**           | [YYYY-MM-DD]                                                           |
| **Status**                 | [Draft/In Review/Approved/Implemented]                                 |
| **Version**                | [1.0]                                                                  |
| **Related Docs**           | [Requirements](../qa/REQUIREMENTS_TEMPLATE.md), [HLD](HLD_TEMPLATE.md) |

## 1. Component Overview

### Purpose

Detailed explanation of what this component does and its role in the overall system.

### Scope

What specific functionality is covered in this design document.

### Context

Where this component fits in the system architecture (reference HLD diagrams).

## 2. Requirements Summary

Brief summary of relevant functional and non-functional requirements from the requirements document.

**Key Requirements:**

- REQ-001: [Requirement summary]
- REQ-002: [Requirement summary]
- REQ-003: [Requirement summary]

**Reference:** [Full Requirements Document](../qa/REQUIREMENTS_TEMPLATE.md)

## 3. Technical Architecture

### Component Diagram

```
┌─────────────────────────────────────────────┐
│           Component Interface               │
└───────────────┬─────────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Module  │ │ Module  │ │ Module  │
│    A    │ │    B    │ │    C    │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┴───────────┘
                 │
          ┌──────┴──────┐
          │  Data Layer │
          └─────────────┘
```

### Technology Stack

- **Language:** TypeScript/JavaScript/Python
- **Framework:** NestJS/React/Express
- **Libraries:**
  - Library 1: [Purpose]
  - Library 2: [Purpose]
- **Database:** PostgreSQL/Firestore/Redis
- **Testing:** Jest/Playwright/Pytest

## 4. Data Model

### 4.1 Database Schema

#### Table: [table_name]

```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field1 VARCHAR(255) NOT NULL,
  field2 INTEGER,
  field3 JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_table_field1 ON table_name(field1);
CREATE INDEX idx_table_created_at ON table_name(created_at);

-- Constraints
ALTER TABLE table_name ADD CONSTRAINT chk_field2_positive CHECK (field2 > 0);
```

### 4.2 Data Transfer Objects (DTOs)

#### CreateDTO

```typescript
export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MaxLength(100)
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsDateString()
  date: string;
}
```

#### ResponseDTO

```typescript
export interface ExpenseResponseDto {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.3 Domain Models

```typescript
export class Expense {
  private id: string;
  private userId: string;
  private amount: number;
  private category: string;
  private description?: string;
  private date: Date;

  constructor(data: ExpenseData) {
    this.validate(data);
    // ... initialization
  }

  private validate(data: ExpenseData): void {
    if (data.amount <= 0) {
      throw new ValidationError('Amount must be positive');
    }
    // ... other validations
  }

  // Business methods
  public updateAmount(newAmount: number): void {
    this.validate({ ...this, amount: newAmount });
    this.amount = newAmount;
  }
}
```

## 5. API Design

### 5.1 Endpoint Specifications

#### Endpoint: Create Resource

```
POST /api/v1/expenses
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "amount": 50.99,
  "category": "food",
  "description": "Lunch at restaurant",
  "date": "2025-12-08"
}
```

**Success Response (201 Created):**

```json
{
  "id": "uuid-here",
  "userId": "user-uuid",
  "amount": 50.99,
  "category": "food",
  "description": "Lunch at restaurant",
  "date": "2025-12-08",
  "createdAt": "2025-12-08T10:30:00Z",
  "updatedAt": "2025-12-08T10:30:00Z"
}
```

**Error Responses:**

400 Bad Request:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be a positive number"
      }
    ]
  }
}
```

401 Unauthorized:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

### 5.2 Request Validation

```typescript
// Validation pipe configuration
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## 6. Business Logic

### 6.1 Service Layer

```typescript
@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    // 1. Validate user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Create domain model
    const expense = new Expense({
      userId,
      ...dto,
    });

    // 3. Save to database
    const saved = await this.expenseRepository.save(expense);

    // 4. Transform to DTO
    return this.toResponseDto(saved);
  }

  async findByUser(userId: string, filters: ExpenseFilters): Promise<ExpenseResponseDto[]> {
    // Implementation
  }

  private toResponseDto(expense: Expense): ExpenseResponseDto {
    // Transformation logic
  }
}
```

### 6.2 Repository Layer

```typescript
@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly repository: Repository<ExpenseEntity>,
  ) {}

  async save(expense: Expense): Promise<Expense> {
    const entity = this.toEntity(expense);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByUserId(userId: string, options?: FindOptions): Promise<Expense[]> {
    const entities = await this.repository.find({
      where: { userId },
      ...options,
    });
    return entities.map((e) => this.toDomain(e));
  }

  private toEntity(expense: Expense): ExpenseEntity {
    // Domain to entity conversion
  }

  private toDomain(entity: ExpenseEntity): Expense {
    // Entity to domain conversion
  }
}
```

## 7. Algorithm Design

### 7.1 Complex Logic

For any complex algorithms or calculations:

**Algorithm: [Name]**

**Purpose:** [What this algorithm does]

**Input:** [What it receives]

**Output:** [What it returns]

**Pseudocode:**

```
FUNCTION algorithmName(input1, input2):
  1. Initialize variables
  2. Process step 1
  3. IF condition THEN
       Process step 2a
     ELSE
       Process step 2b
  4. RETURN result
END FUNCTION
```

**Complexity:**

- Time Complexity: O(n)
- Space Complexity: O(1)

**Implementation:**

```typescript
function algorithmName(input1: Type1, input2: Type2): ReturnType {
  // Implementation
}
```

## 8. State Management

### 8.1 Component State (Frontend)

```typescript
interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
}

const useExpenses = () => {
  const [state, setState] = useState<ExpenseState>({
    expenses: [],
    loading: false,
    error: null,
    filters: {},
  });

  const fetchExpenses = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await expenseApi.getAll();
      setState((prev) => ({ ...prev, expenses: data, loading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  return { ...state, fetchExpenses };
};
```

## 9. Error Handling

### 9.1 Exception Hierarchy

```typescript
export class AppException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
  }
}

export class ValidationException extends AppException {
  constructor(
    message: string,
    public readonly errors: ValidationError[],
  ) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class NotFoundException extends AppException {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}
```

### 9.2 Global Exception Filter

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof AppException) {
      return response.status(exception.statusCode).json({
        error: {
          code: exception.code,
          message: exception.message,
        },
      });
    }

    // Log unexpected errors
    logger.error('Unexpected error:', exception);

    return response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
}
```

## 10. Security Implementation

### 10.1 Authentication Guard

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
```

### 10.2 Input Sanitization

```typescript
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeDto(dto: any): any {
  if (typeof dto === 'string') {
    return sanitizeHtml(dto);
  }
  if (typeof dto === 'object') {
    return Object.keys(dto).reduce((acc, key) => {
      acc[key] = sanitizeDto(dto[key]);
      return acc;
    }, {} as any);
  }
  return dto;
}
```

## 11. Performance Optimization

### 11.1 Caching Strategy

```typescript
@Injectable()
export class CacheService {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### 11.2 Query Optimization

```typescript
// Bad: N+1 query problem
async getBadExpensesWithUsers(userId: string) {
  const expenses = await this.expenseRepo.find({ userId });
  for (const expense of expenses) {
    expense.user = await this.userRepo.findOne(expense.userId);
  }
  return expenses;
}

// Good: Join with eager loading
async getGoodExpensesWithUsers(userId: string) {
  return this.expenseRepo.find({
    where: { userId },
    relations: ['user'],
  });
}
```

## 12. Testing

### 12.1 Unit Tests

```typescript
describe('ExpenseService', () => {
  let service: ExpenseService;
  let repository: MockType<ExpenseRepository>;

  beforeEach(() => {
    repository = createMock<ExpenseRepository>();
    service = new ExpenseService(repository as any);
  });

  describe('create', () => {
    it('should create expense successfully', async () => {
      // Arrange
      const dto = { amount: 50, category: 'food', date: '2025-12-08' };
      const expected = { id: '123', ...dto };
      repository.save.mockResolvedValue(expected);

      // Act
      const result = await service.create('user-id', dto);

      // Assert
      expect(result).toEqual(expected);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(dto));
    });

    it('should throw error for invalid amount', async () => {
      // Arrange
      const dto = { amount: -50, category: 'food', date: '2025-12-08' };

      // Act & Assert
      await expect(service.create('user-id', dto)).rejects.toThrow(ValidationException);
    });
  });
});
```

### 12.2 Integration Tests

```typescript
describe('Expense API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    authToken = await getTestAuthToken();
  });

  it('/POST expenses', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 50,
        category: 'food',
        date: '2025-12-08',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.amount).toBe(50);
      });
  });
});
```

### 12.3 Test Coverage Requirements

- Unit test coverage: ≥ 80%
- Integration test coverage: Critical paths
- E2E test coverage: User flows

## 13. Logging & Monitoring

### 13.1 Logging Implementation

```typescript
import { Logger } from '@nestjs/common';

export class ExpenseService {
  private readonly logger = new Logger(ExpenseService.name);

  async create(userId: string, dto: CreateExpenseDto) {
    this.logger.log(`Creating expense for user: ${userId}`);

    try {
      const result = await this.repository.save(dto);
      this.logger.log(`Expense created: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create expense for user ${userId}`, error.stack);
      throw error;
    }
  }
}
```

### 13.2 Metrics & Observability

```typescript
// Track execution time
export function TrackDuration() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        metrics.recordDuration(propertyKey, duration);
        return result;
      } catch (error) {
        metrics.recordError(propertyKey);
        throw error;
      }
    };

    return descriptor;
  };
}
```

## 14. Configuration

### 14.1 Environment Variables

```typescript
export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'expenses',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};
```

## 15. Deployment Considerations

### 15.1 Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build
npm run build

# Create Docker image
docker build -t expense-api:latest .
```

### 15.2 Health Checks

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async check(): Promise<HealthStatus> {
    const dbHealth = await this.db.ping();
    const redisHealth = await this.redis.ping();

    return {
      status: dbHealth && redisHealth ? 'healthy' : 'unhealthy',
      checks: {
        database: dbHealth ? 'up' : 'down',
        redis: redisHealth ? 'up' : 'down',
      },
    };
  }
}
```

## 16. Known Issues & Limitations

- Issue 1: [Description and workaround]
- Issue 2: [Description and workaround]
- Limitation 1: [Description]

## 17. Future Improvements

- Improvement 1: [Description]
- Improvement 2: [Description]
- Technical debt item: [Description]

## 18. Approval

| Role        | Name   | Signature | Date |
| ----------- | ------ | --------- | ---- |
| Developer   | [Name] |           |      |
| Tech Lead   | [Name] |           |      |
| QA Engineer | [Name] |           |      |

## 19. Change Log

| Version | Date   | Author | Changes         |
| ------- | ------ | ------ | --------------- |
| 1.0     | [Date] | [Name] | Initial version |

## 20. References

- [Requirements Document](../qa/REQUIREMENTS_TEMPLATE.md)
- [High-Level Design](HLD_TEMPLATE.md)
- [API Reference](API_REFERENCE.md)
- [Test Plan](../qa/TEST_PLAN_TEMPLATE.md)
- [Testing Strategy](../qa/TESTING_STRATEGY.md)

---

**Template Version**: 1.0  
**Last Updated**: December 8, 2025
