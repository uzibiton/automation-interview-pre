# Application Architecture

## Overview

This is a full-stack expense tracking application built with a microservices architecture, containerized with Docker, and designed for cloud deployment.

## Architecture Diagram

### Infrastructure Layout
```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx Gateway                        │
│                      (Port 80 - Entry Point)                 │
└───────────────┬─────────────────────────────────────────────┘
                │
    ┌───────────┼───────────┬─────────────────┐
    │           │           │                 │
    ▼           ▼           ▼                 ▼
┌────────┐ ┌─────────┐ ┌──────────┐    ┌──────────┐
│Frontend│ │  Auth   │ │   API    │    │PostgreSQL│
│ React  │ │ Service │ │ Service  │    │ Database │
│ :3000  │ │ :3001   │ │ :3002    │    │ :5432    │
└────────┘ └─────────┘ └──────────┘    └──────────┘
    │           │           │                 │
    └───────────┴───────────┴─────────────────┘
                     │
              ┌──────┴──────┐
              │  Firestore  │
              │  (Optional) │
              └─────────────┘
```

### Request Flow

#### 1. Login Flow
```
┌─────────┐                                        ┌────────────┐
│ User    │                                        │Google OAuth│
└────┬────┘                                        └─────┬──────┘
     │ 1. Click "Login"                                  │
     ▼                                                   │
┌─────────┐                                              │
│Frontend │                                              │
└────┬────┘                                              │
     │ 2. POST /auth/google {oauth_token}               │
     ▼                                                   │
┌──────────┐                                             │
│Auth      │ 3. Validate with Google ──────────────────►│
│Service   │◄─────────────────────── 4. User profile    │
└────┬─────┘                                             │
     │ 5. Generate JWT token                             │
     │ 6. Create/update user in DB                       │
     ▼                                                   │
┌──────────┐                                             │
│Database  │                                             │
└────┬─────┘                                             │
     │ 7. Return JWT token                               │
     ▼                                                   │
┌─────────┐                                              │
│Frontend │ 8. Store JWT, redirect to dashboard         │
└─────────┘                                              │
```

#### 2. Create Expense Flow
```
┌─────────┐
│ User    │
└────┬────┘
     │ 1. Fill form, click "Save"
     ▼
┌─────────┐
│Frontend │
└────┬────┘
     │ 2. POST /expenses {expense_data}
     │    Authorization: Bearer <JWT>
     ▼
┌──────────┐
│API       │ 3. Validate JWT token
│Service   │ 4. Verify user owns this data
└────┬─────┘
     │ 5. INSERT INTO expenses...
     ▼
┌──────────┐
│Database  │ (PostgreSQL or Firestore)
└────┬─────┘
     │ 6. Return created expense
     ▼
┌──────────┐
│API       │ 7. Format response
│Service   │
└────┬─────┘
     │ 8. { id: "123", amount: 50, ... }
     ▼
┌─────────┐
│Frontend │ 9. Close modal, refresh list
└─────────┘
```

#### 3. View Expenses Flow
```
┌─────────┐
│ User    │
└────┬────┘
     │ 1. Navigate to Expenses page
     ▼
┌─────────┐
│Frontend │
└────┬────┘
     │ 2. GET /expenses?startDate=...&endDate=...
     │    Authorization: Bearer <JWT>
     ▼
┌──────────┐
│API       │ 3. Validate JWT token
│Service   │ 4. Parse filters
└────┬─────┘
     │ 5. SELECT * FROM expenses WHERE...
     ▼
┌──────────┐
│Database  │
└────┬─────┘
     │ 6. Return expense records
     ▼
┌──────────┐
│API       │ 7. Format response
│Service   │
└────┬─────┘
     │ 8. [{id: "1", amount: 50}, {id: "2", amount: 30}, ...]
     ▼
┌─────────┐
│Frontend │ 9. Render table and charts
└─────────┘
```

#### 4. Edit/Delete Flow
```
┌─────────┐
│ User    │
└────┬────┘
     │ 1. Click Edit/Delete button
     ▼
┌─────────┐
│Frontend │ 2. Show confirmation dialog
└────┬────┘
     │ 3. PUT /expenses/:id {updated_data}
     │    or DELETE /expenses/:id
     │    Authorization: Bearer <JWT>
     ▼
┌──────────┐
│API       │ 4. Validate JWT token
│Service   │ 5. Verify user owns this expense
└────┬─────┘
     │ 6. UPDATE/DELETE FROM expenses WHERE id=...
     ▼
┌──────────┐
│Database  │
└────┬─────┘
     │ 7. Confirm operation
     ▼
┌──────────┐
│API       │ 8. Return success
│Service   │
└────┬─────┘
     │ 9. { message: "Success" }
     ▼
┌─────────┐
│Frontend │ 10. Close modal, refresh list
└─────────┘
```

## Project Structure

```
app/
├── frontend/               # React SPA with TypeScript
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── i18n/          # Internationalization (en/he)
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Helper utilities
│   ├── Dockerfile         # Production build
│   ├── Dockerfile.dev     # Development build
│   └── package.json
│
├── services/
│   ├── auth-service/      # Authentication & OAuth
│   │   ├── src/
│   │   │   ├── auth/      # Auth logic (Google OAuth)
│   │   │   ├── users/     # User management
│   │   │   └── guards/    # Auth guards
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api-service/       # Core business logic
│       ├── src/
│       │   ├── expenses/  # Expense CRUD operations
│       │   ├── database/  # DB abstraction (Postgres/Firestore)
│       │   └── guards/    # JWT validation
│       ├── Dockerfile
│       └── package.json
│
├── database/              # Database initialization
│   ├── init.sql          # Postgres schema
│   └── seed-categories.sql
│
└── nginx/                 # Reverse proxy configuration
    └── nginx.conf
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **i18next** - Internationalization (English/Hebrew)
- **Chart.js** - Data visualization

### Backend Services
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - ORM for PostgreSQL
- **Passport** - Authentication middleware
- **JWT** - Token-based auth

### Databases
- **PostgreSQL** - Primary relational database
- **Firestore** - Alternative NoSQL database (optional)

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local orchestration
- **Nginx** - Reverse proxy & API gateway
- **Google Cloud Run** - Production deployment

## Service Details

### 1. Frontend (Port 3000)

**Purpose:** User interface for expense tracking

**Key Features:**
- Multi-language support (English/Hebrew with RTL)
- Responsive design
- Real-time expense visualization
- Modal dialogs for CRUD operations
- OAuth login integration

**Key Components:**
- `Dashboard` - Main overview with stats
- `ExpensesPage` - Expense list and management
- `AnalyticsPage` - Charts and graphs
- `ExpenseDialog` - Add/Edit expense modal
- `ConfirmationDialog` - Delete confirmation

**Environment Variables:**
- `VITE_API_SERVICE_URL` - API service endpoint
- `VITE_AUTH_SERVICE_URL` - Auth service endpoint

### 2. Auth Service (Port 3001)

**Purpose:** Handle authentication and user management

**Endpoints:**
- `POST /auth/google` - Google OAuth login
- `POST /auth/refresh` - Refresh JWT tokens
- `GET /users/me` - Get current user info

**Features:**
- Google OAuth 2.0 integration
- JWT token generation and validation
- User profile management
- Token refresh mechanism

**Environment Variables:**
- `GOOGLE_CLIENT_ID` - OAuth client ID
- `GOOGLE_CLIENT_SECRET` - OAuth secret
- `JWT_SECRET` - Token signing key
- `DATABASE_TYPE` - postgres or firestore

### 3. API Service (Port 3002)

**Purpose:** Core business logic and data operations

**Endpoints:**
- `GET /expenses` - List expenses (with filters)
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/stats` - Expense statistics
- `GET /expenses/categories` - List categories

**Features:**
- Multi-database support (Postgres/Firestore)
- Date range filtering
- Category/subcategory management
- Expense statistics and aggregations
- JWT authentication guard

**Environment Variables:**
- `DATABASE_TYPE` - postgres or firestore
- `DATABASE_HOST` - Postgres host
- `GOOGLE_APPLICATION_CREDENTIALS` - Firestore credentials
- `JWT_SECRET` - Token validation key

### 4. Nginx Gateway (Port 80)

**Purpose:** Reverse proxy and request routing

**Routing:**
- `/` → Frontend (React SPA)
- `/api/*` → API Service
- `/auth/*` → Auth Service

**Features:**
- Request routing
- CORS handling
- Static file serving
- Load balancing (production)

### 5. PostgreSQL Database (Port 5432)

**Purpose:** Primary data storage

**Schema:**
- `users` - User accounts
- `expenses` - Expense records
- `categories` - Expense categories
- `sub_categories` - Subcategories

**Initialization:**
- `init.sql` - Schema creation
- `seed-categories.sql` - Default categories

## Data Flow

### 1. User Login Flow
```
User → Frontend → Auth Service → Google OAuth → JWT Token → Frontend
```

### 2. Create Expense Flow
```
User → Frontend (ExpenseDialog)
    → API Service (/expenses POST)
    → Database (PostgreSQL/Firestore)
    → Response → Frontend (refresh list)
```

### 3. View Expenses Flow
```
User → Frontend (ExpensesPage)
    → API Service (/expenses GET + filters)
    → Database (query with filters)
    → Response → Frontend (display table/charts)
```

### 4. Edit/Delete Flow
```
User → Frontend (ExpenseDialog/ConfirmationDialog)
    → API Service (PUT/DELETE /expenses/:id)
    → Database (update/delete record)
    → Response → Frontend (refresh list)
```

## Database Abstraction

The application supports two database backends through an abstraction layer:

### PostgreSQL (Default)
- Relational database
- Strong consistency
- ACID transactions
- TypeORM for data access

### Firestore (Optional)
- NoSQL document database
- Horizontal scaling
- Real-time updates
- Custom repository implementation

**Switching Databases:**
Set `DATABASE_TYPE=firestore` or `DATABASE_TYPE=postgres` in environment variables.

## Authentication & Authorization

### JWT Flow
1. User logs in with Google OAuth
2. Auth service validates OAuth token
3. Auth service generates JWT token (expires in 1h)
4. Frontend stores JWT in memory/localStorage
5. Frontend includes JWT in `Authorization: Bearer <token>` header
6. API service validates JWT on each request
7. Refresh token used to get new JWT when expired

### Security Features
- JWT token expiration (1 hour)
- Refresh token rotation
- CORS protection
- AuthGuard on all protected endpoints
- User ID validation (can only access own data)

## Internationalization (i18n)

Supports English and Hebrew with RTL layout:

**Translation Files:**
- `app/frontend/src/i18n/translations/en.json`
- `app/frontend/src/i18n/translations/he.json`

**Features:**
- Dynamic language switching
- RTL layout for Hebrew
- Localized date/number formats
- Translation keys organized by feature

## Development vs Production

### Development (Docker Compose)
- Hot reload enabled
- Source code mounted as volumes
- Debug logging
- Local PostgreSQL database
- Direct port access to all services

### Production (Cloud Run)
- Optimized builds
- Health checks
- Auto-scaling
- Cloud SQL (managed PostgreSQL)
- SSL/TLS termination
- CDN for static assets

## API Design Patterns

### RESTful Endpoints
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- Status codes (200, 201, 400, 401, 404, 500)

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Error messages in user's language

### Request/Response
- JSON format
- DTOs for validation
- Type-safe interfaces

## Performance Considerations

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Backend
- Database connection pooling
- Query optimization
- Caching strategies
- Efficient data pagination

### Infrastructure
- Nginx caching
- CDN for static assets
- Database indexes
- Container resource limits

## Related Documentation

- [Run Locally Guide](../RUN-LOCALLY.md)
- [Deployment Guide](../doc/DEPLOYMENT.md)
- [Cloud Run Setup](../doc/CLOUD_RUN_README.md)
- [Testing Strategy](../doc/TESTING_STRATEGY.md)
- [API Reference](../doc/API_REFERENCE.md)
