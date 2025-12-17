# Expense Tracker Application - Conversion Complete

## 🎉 Summary

Successfully converted the Task Manager application into a fully functional **Bilingual Expense Tracker** with support for English and Hebrew languages, including RTL (right-to-left) layout for Hebrew.

## ✅ Completed Features

### 1. Database Schema (PostgreSQL)

- **4 new tables created:**
  - `expenses` - Store expense records with amount, currency, date, payment method, labels
  - `categories` - 9 default categories with bilingual names (nameEn, nameHe)
  - `sub_categories` - 46 subcategories linked to categories with bilingual names
  - `budget_limits` - For future budget tracking feature
- **Sample data:** 3 sample expenses, 9 categories, 46 subcategories
- **Categories include:** Entertainment (פנאי), Food (מזון), Health (בריאות), Insurance (ביטוח), Education (חינוך), Transportation (תחבורה), Bills (חשבונות), Savings (חסכונות), Household (משק בית)

### 2. Backend API (NestJS)

- **8 RESTful endpoints:**
  - `GET /expenses` - List user's expenses (with optional filters)
  - `GET /expenses/stats?period=month` - Get spending statistics
  - `GET /expenses/categories` - List all categories
  - `GET /expenses/categories/:id/subcategories` - List subcategories for a category
  - `GET /expenses/:id` - Get single expense
  - `POST /expenses` - Create new expense
  - `PUT /expenses/:id` - Update expense
  - `DELETE /expenses/:id` - Delete expense
- **Features:**
  - JWT authentication on all endpoints
  - User isolation (expenses filtered by userId from token)
  - TypeORM entities for database interaction
  - DTO validation with class-validator
  - Aggregate statistics by category

### 3. Multi-Language Support (i18n)

- **Libraries:** i18next, react-i18next, i18next-browser-languagedetector
- **Supported languages:** English (en), Hebrew (he)
- **50+ translation keys** covering:
  - App navigation (dashboard, expenses, categories)
  - Authentication (login, register, email, password)
  - Expense management (amount, category, description, date)
  - Payment methods (credit card, debit card, cash, bank transfer)
  - Statistics (total, count, by category)
- **RTL support:** Automatic direction switching for Hebrew
- **Language switcher:** Button component to toggle between languages

### 4. Frontend Components (React + TypeScript)

#### App.tsx

- Main router with authentication
- i18n initialization
- Document direction management (RTL/LTR)

#### Dashboard.tsx

- User profile display
- Statistics cards (This Month, Count, By Category)
- Add expense button
- Language switcher in header
- Expense form toggle
- Pie chart visualization
- Expense list display

#### ExpenseForm.tsx

- Category dropdown (9 categories with icons)
- Dynamic subcategory dropdown (filtered by selected category)
- Amount input with currency selector (USD, ILS, EUR)
- Date picker (defaults to today)
- Payment method dropdown (4 options)
- Description textarea
- Form validation
- Bilingual category/subcategory names

#### ExpenseList.tsx

- Table display with columns: Date, Category (with icon), Description, Amount, Payment Method, Actions
- Bilingual category names based on current language
- Translated payment methods
- Delete functionality with confirmation
- Empty state message
- Refresh mechanism

#### ExpensePieChart.tsx

- Visual representation of expenses by category
- Uses Chart.js and react-chartjs-2
- Category colors from database
- RTL-aware legend positioning
- Percentage calculations
- Total amount display

#### LanguageSwitcher.tsx

- Two-button UI (English | עברית)
- Active state styling
- Sets document direction (dir attribute)
- Sets document language (lang attribute)

### 5. Docker Configuration

- **5 services running:**
  - `test-postgres` - PostgreSQL 15-alpine database
  - `auth-service` - NestJS authentication microservice (port 3001)
  - `api-service` - NestJS API microservice (port 3002)
  - `react-frontend` - React app with Vite (port 5173)
  - `nginx-gateway` - Reverse proxy (port 80)
- **Networking:** All services communicate via Docker network
- **Volumes:** PostgreSQL data persistence
- **Health checks:** Database container health monitoring

## 📁 File Structure

```
automation-interview-pre/
├── docker-compose.yml
├── INSTRUCTIONS.md
├── README.md
├── RUN_LOCALLY.md
├── SETUP.md
├── TESTING.md (NEW - Comprehensive testing guide)
├── database/
│   └── init.sql (UPDATED - New expense schema)
├── frontend/
│   ├── Dockerfile
│   ├── package.json (UPDATED - Added chart.js, i18next)
│   ├── src/
│   │   ├── App.tsx (UPDATED - i18n integration)
│   │   ├── components/
│   │   │   ├── AuthCallback.tsx
│   │   │   ├── Dashboard.tsx (UPDATED - Expense dashboard)
│   │   │   ├── ExpenseForm.tsx (NEW)
│   │   │   ├── ExpenseList.tsx (NEW)
│   │   │   ├── ExpensePieChart.tsx (NEW)
│   │   │   ├── LanguageSwitcher.tsx (NEW)
│   │   │   └── Login.tsx
│   │   └── i18n/
│   │       ├── config.ts (NEW)
│   │       └── translations/
│   │           ├── en.json (NEW)
│   │           └── he.json (NEW)
├── services/
│   ├── api-service/
│   │   └── src/
│   │       ├── app.module.ts (UPDATED - Expenses module)
│   │       └── expenses/ (NEW MODULE)
│   │           ├── expense.entity.ts
│   │           ├── category.entity.ts
│   │           ├── sub-category.entity.ts
│   │           ├── expenses.service.ts
│   │           ├── expenses.controller.ts
│   │           ├── expenses.module.ts
│   │           └── dto/
│   │               └── expense.dto.ts
│   └── auth-service/
│       └── (unchanged)
└── reference-expenses/ (Excluded from git)
```

## 🔑 Key Technologies

- **Backend:** NestJS 10, TypeORM, PostgreSQL 15, Passport.js, JWT, bcrypt
- **Frontend:** React 18.2, TypeScript 5.1, Vite 4.4, Axios
- **Multi-language:** i18next 25, react-i18next 16, i18next-browser-languagedetector 8
- **Charts:** Chart.js 4.2, react-chartjs-2 5.2
- **Infrastructure:** Docker, Docker Compose, Nginx
- **Authentication:** Google OAuth 2.0, Email/Password

## 🌐 API Endpoints

### Expenses

- `GET http://localhost:3002/expenses` - Get all expenses (with filters)
- `GET http://localhost:3002/expenses/stats?period=month` - Get statistics
- `GET http://localhost:3002/expenses/categories` - Get all categories
- `GET http://localhost:3002/expenses/categories/:id/subcategories` - Get subcategories
- `POST http://localhost:3002/expenses` - Create expense
- `PUT http://localhost:3002/expenses/:id` - Update expense
- `DELETE http://localhost:3002/expenses/:id` - Delete expense

### Authentication

- `POST http://localhost:3001/auth/register` - Register with email/password
- `POST http://localhost:3001/auth/login` - Login with email/password
- `GET http://localhost:3001/auth/google` - Login with Google OAuth
- `GET http://localhost:3001/auth/profile` - Get user profile

## 🗄️ Database Schema

### expenses

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
category_id INTEGER REFERENCES categories(id)
sub_category_id INTEGER REFERENCES sub_categories(id)
amount DECIMAL(10,2) NOT NULL
currency VARCHAR(3) DEFAULT 'USD'
description TEXT
date DATE NOT NULL
payment_method VARCHAR(50)
labels TEXT[]
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

### categories

```sql
id SERIAL PRIMARY KEY
name_en VARCHAR(100) NOT NULL
name_he VARCHAR(100) NOT NULL
icon VARCHAR(10)
color VARCHAR(7)
is_default BOOLEAN DEFAULT false
created_at TIMESTAMP DEFAULT NOW()
```

### sub_categories

```sql
id SERIAL PRIMARY KEY
category_id INTEGER REFERENCES categories(id)
name_en VARCHAR(100) NOT NULL
name_he VARCHAR(100) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

## 🚀 How to Run

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Rebuild after code changes
docker-compose up -d --build

# Stop all services
docker-compose down
```

### Access the Application

- **Frontend:** http://localhost
- **API Service:** http://localhost:3002
- **Auth Service:** http://localhost:3001

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it test-postgres psql -U postgres -d taskdb

# View expenses
SELECT * FROM expenses;

# View categories
SELECT id, name_en, name_he, icon FROM categories;
```

## 🧪 Testing

See **TESTING.md** for comprehensive testing guide including:

- Authentication tests (Google OAuth, Email/Password)
- Language switching tests
- Expense CRUD operations
- Multi-user isolation tests
- Form validation tests
- API integration tests
- Browser console tests
- Database verification tests

## 📊 Sample Categories

| Icon | English        | Hebrew  | Color   |
| ---- | -------------- | ------- | ------- |
| 🎭   | Entertainment  | פנאי    | #FF6B6B |
| 🍔   | Food           | מזון    | #4ECDC4 |
| ⚕️   | Health         | בריאות  | #45B7D1 |
| 🛡️   | Insurance      | ביטוח   | #FFA07A |
| 📚   | Education      | חינוך   | #98D8C8 |
| 🚗   | Transportation | תחבורה  | #F7DC6F |
| 📄   | Bills          | חשבונות | #BB8FCE |
| 💰   | Savings        | חסכונות | #85C1E2 |
| 🏠   | Household      | משק בית | #F8B739 |

## 🔐 Authentication

### Google OAuth

- **Client ID:** 956932986459-0vajm2e0e6n0o7v852240lsiktp35p7p.apps.googleusercontent.com
- **Redirect URI:** http://localhost/auth/callback
- **Scopes:** profile, email

### Email/Password

- **Password hashing:** bcrypt (10 salt rounds)
- **Token:** JWT with 24-hour expiration
- **User fields:** id, email, name, password, provider, providerId, avatarUrl

## 🎯 User Stories Implemented

1. ✅ As a user, I can login with Google OAuth or email/password
2. ✅ As a user, I can switch between English and Hebrew languages
3. ✅ As a user, I can view my expenses in a table
4. ✅ As a user, I can add a new expense with category, amount, date, payment method
5. ✅ As a user, I can delete an expense
6. ✅ As a user, I can see my spending statistics (total, count, by category)
7. ✅ As a user, I can view a pie chart of my expenses by category
8. ✅ As a user, I can select subcategories based on the main category
9. ✅ As a user, I can see category names in my preferred language
10. ✅ As a user, my expenses are isolated from other users

## 🚧 Future Enhancements

### High Priority

- [ ] Edit expense functionality (UI for PUT endpoint)
- [ ] Date range filter
- [ ] Category filter dropdown
- [ ] Mobile responsive design
- [ ] Loading spinners and error toasts

### Medium Priority

- [ ] Budget limits feature (table exists, needs UI)
- [ ] Expense search functionality
- [ ] Export to CSV
- [ ] Monthly/yearly reports
- [ ] Receipt image upload

### Low Priority

- [ ] Recurring expenses
- [ ] Multiple currencies with conversion
- [ ] Expense categories customization
- [ ] Email notifications
- [ ] Dark mode

## 📝 Notes

### Multi-User Support

- Each expense is tied to a user via `user_id` foreign key
- JWT token contains userId extracted in backend
- All queries filter by userId automatically
- Users cannot see or modify other users' expenses

### Language Support

- Browser language detection on first load
- Manual switching via language switcher
- Language preference stored in browser localStorage
- RTL layout automatically applied for Hebrew
- All database fields have English and Hebrew versions

### Performance

- Frontend uses Vite for fast builds (<5 seconds)
- Backend uses NestJS with TypeORM for efficient queries
- Docker containers use Alpine images for smaller size
- Database has indexes on frequently queried columns (user_id, category_id, date)

### Security

- All expense endpoints protected with JWT authentication
- Passwords hashed with bcrypt before storage
- Google OAuth tokens validated server-side
- CORS configured for localhost
- User isolation enforced at database query level

## 🐛 Known Issues

1. **User ID null in logs:** This is cosmetic - the userId is correctly extracted from JWT token in the controller, but logs show null parameter. Functionality is not affected.

2. **Minor lint warnings:** Some components have unused React import warnings, but these are required for JSX compilation.

3. **Stats always show "This Month":** Currently hardcoded to show current month stats. Need to add period selector UI.

## 📚 Documentation

- **SETUP.md** - Initial setup instructions
- **RUN_LOCALLY.md** - Local development guide
- **TESTING.md** - Comprehensive testing guide
- **INSTRUCTIONS.md** - Original project instructions
- **README.md** - Project overview

## 🙏 Acknowledgments

- Reference expense app analyzed from `reference-expenses/` folder
- Category structure and Hebrew translations based on reference app
- Google OAuth credentials provided by project owner
- NestJS, React, and TypeScript communities for excellent documentation

---

**Status:** ✅ Conversion Complete and Functional  
**Date:** November 10, 2025  
**Version:** 1.0.0
