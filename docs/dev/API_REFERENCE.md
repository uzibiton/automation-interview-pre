# API Reference - Expense Tracker

## Base URLs

- **Auth Service:** `http://localhost:3001`
- **API Service:** `http://localhost:3002`
- **Frontend:** `http://localhost`

## Authentication

All expense endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Google OAuth

```http
GET /auth/google
```

Redirects to Google OAuth consent screen.

### Get Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "provider": "google",
  "avatarUrl": "https://lh3.googleusercontent.com/..."
}
```

---

## Expenses

### Get All Expenses

```http
GET /expenses
Authorization: Bearer <token>
```

**Query Parameters:**

- `categoryId` (optional) - Filter by category ID
- `startDate` (optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (optional) - Filter by end date (YYYY-MM-DD)

**Example:**

```http
GET /expenses?categoryId=2&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "categoryId": 2,
    "subCategoryId": 7,
    "amount": "45.50",
    "currency": "USD",
    "description": "Lunch at restaurant",
    "date": "2025-11-10",
    "paymentMethod": "credit_card",
    "labels": ["business", "meal"],
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z"
  },
  {
    "id": 2,
    "userId": 1,
    "categoryId": 6,
    "subCategoryId": null,
    "amount": "30.00",
    "currency": "USD",
    "description": "Gas",
    "date": "2025-11-09",
    "paymentMethod": "debit_card",
    "labels": [],
    "createdAt": "2025-11-09T08:00:00.000Z",
    "updatedAt": "2025-11-09T08:00:00.000Z"
  }
]
```

### Get Single Expense

```http
GET /expenses/:id
Authorization: Bearer <token>
```

**Example:**

```http
GET /expenses/1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 2,
  "subCategoryId": 7,
  "amount": "45.50",
  "currency": "USD",
  "description": "Lunch at restaurant",
  "date": "2025-11-10",
  "paymentMethod": "credit_card",
  "labels": ["business", "meal"],
  "createdAt": "2025-11-10T12:00:00.000Z",
  "updatedAt": "2025-11-10T12:00:00.000Z"
}
```

### Create Expense

```http
POST /expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryId": 2,
  "subCategoryId": 7,
  "amount": 45.50,
  "currency": "USD",
  "description": "Lunch at restaurant",
  "date": "2025-11-10",
  "paymentMethod": "credit_card",
  "labels": ["business", "meal"]
}
```

**Required Fields:**

- `categoryId` (number)
- `amount` (number, must be > 0)
- `date` (string, format: YYYY-MM-DD)

**Optional Fields:**

- `subCategoryId` (number or null)
- `currency` (string, default: "USD")
- `description` (string)
- `paymentMethod` (string, default: "credit_card")
- `labels` (array of strings)

**Response:**

```json
{
  "id": 3,
  "userId": 1,
  "categoryId": 2,
  "subCategoryId": 7,
  "amount": "45.50",
  "currency": "USD",
  "description": "Lunch at restaurant",
  "date": "2025-11-10",
  "paymentMethod": "credit_card",
  "labels": ["business", "meal"],
  "createdAt": "2025-11-10T14:30:00.000Z",
  "updatedAt": "2025-11-10T14:30:00.000Z"
}
```

### Update Expense

```http
PUT /expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Updated description"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 2,
  "subCategoryId": 7,
  "amount": "50.00",
  "currency": "USD",
  "description": "Updated description",
  "date": "2025-11-10",
  "paymentMethod": "credit_card",
  "labels": ["business", "meal"],
  "createdAt": "2025-11-10T12:00:00.000Z",
  "updatedAt": "2025-11-10T14:35:00.000Z"
}
```

### Delete Expense

```http
DELETE /expenses/:id
Authorization: Bearer <token>
```

**Example:**

```http
DELETE /expenses/1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Expense deleted successfully"
}
```

---

## Statistics

### Get Expense Statistics

```http
GET /expenses/stats?period=month
Authorization: Bearer <token>
```

**Query Parameters:**

- `period` (required) - Options: "week", "month", "year"

**Example:**

```http
GET /expenses/stats?period=month
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 250.75,
  "totalAmount": 250.75,
  "count": 8,
  "byCategory": [
    {
      "categoryId": 2,
      "categoryName": "Food",
      "total": "125.50",
      "count": "5"
    },
    {
      "categoryId": 6,
      "categoryName": "Transportation",
      "total": "75.25",
      "count": "2"
    },
    {
      "categoryId": 1,
      "categoryName": "Entertainment",
      "total": "50.00",
      "count": "1"
    }
  ]
}
```

---

## Categories

### Get All Categories

```http
GET /expenses/categories
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "nameEn": "Entertainment",
    "nameHe": "פנאי",
    "icon": "🎭",
    "color": "#FF6B6B",
    "isDefault": true,
    "createdAt": "2025-11-10T00:00:00.000Z"
  },
  {
    "id": 2,
    "nameEn": "Food",
    "nameHe": "מזון",
    "icon": "🍔",
    "color": "#4ECDC4",
    "isDefault": true,
    "createdAt": "2025-11-10T00:00:00.000Z"
  }
]
```

### Get Sub-Categories

```http
GET /expenses/categories/:categoryId/subcategories
Authorization: Bearer <token>
```

**Example:**

```http
GET /expenses/categories/2/subcategories
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 7,
    "categoryId": 2,
    "nameEn": "Restaurant",
    "nameHe": "מסעדה",
    "createdAt": "2025-11-10T00:00:00.000Z"
  },
  {
    "id": 8,
    "categoryId": 2,
    "nameEn": "Groceries",
    "nameHe": "מכולת",
    "createdAt": "2025-11-10T00:00:00.000Z"
  }
]
```

---

## Categories Reference

| ID  | English        | Hebrew  | Icon | Color   |
| --- | -------------- | ------- | ---- | ------- |
| 1   | Entertainment  | פנאי    | 🎭   | #FF6B6B |
| 2   | Food           | מזון    | 🍔   | #4ECDC4 |
| 3   | Health         | בריאות  | ⚕️   | #45B7D1 |
| 4   | Insurance      | ביטוח   | 🛡️   | #FFA07A |
| 5   | Education      | חינוך   | 📚   | #98D8C8 |
| 6   | Transportation | תחבורה  | 🚗   | #F7DC6F |
| 7   | Bills          | חשבונות | 📄   | #BB8FCE |
| 8   | Savings        | חסכונות | 💰   | #85C1E2 |
| 9   | Household      | משק בית | 🏠   | #F8B739 |

---

## Payment Methods

Valid payment method values:

- `credit_card` - Credit Card (כרטיס אשראי)
- `debit_card` - Debit Card (כרטיס חיוב)
- `cash` - Cash (מזומן)
- `bank_transfer` - Bank Transfer (העברה בנקאית)

---

## Currency Codes

Supported currency codes (ISO 4217):

- `USD` - US Dollar ($)
- `ILS` - Israeli New Shekel (₪)
- `EUR` - Euro (€)

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number", "categoryId must be a number"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Expense not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Example: Complete Workflow

### 1. Register a new user

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Login and get token

```bash
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }' | jq -r '.access_token')
```

### 3. Get categories

```bash
curl -X GET http://localhost:3002/expenses/categories \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get subcategories for Food (categoryId=2)

```bash
curl -X GET http://localhost:3002/expenses/categories/2/subcategories \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Create an expense

```bash
curl -X POST http://localhost:3002/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 2,
    "subCategoryId": 7,
    "amount": 45.50,
    "currency": "USD",
    "description": "Lunch at Italian restaurant",
    "date": "2025-11-10",
    "paymentMethod": "credit_card",
    "labels": ["business", "lunch"]
  }'
```

### 6. Get all expenses

```bash
curl -X GET http://localhost:3002/expenses \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get monthly statistics

```bash
curl -X GET "http://localhost:3002/expenses/stats?period=month" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Update an expense (assuming ID is 1)

```bash
curl -X PUT http://localhost:3002/expenses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "description": "Lunch at Italian restaurant (with tip)"
  }'
```

### 9. Delete an expense

```bash
curl -X DELETE http://localhost:3002/expenses/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider adding:

- Rate limiting per IP address
- Rate limiting per user
- Maximum request size limits

---

## CORS Configuration

CORS is configured to allow requests from:

- `http://localhost`
- `http://localhost:3000`
- `http://localhost:5173`

For production, update CORS settings to match your domain.

---

## Debugging Tips

### View API Logs

```bash
# API Service logs
docker logs api-service --tail 50 -f

# Auth Service logs
docker logs auth-service --tail 50 -f
```

### Database Queries

```bash
# Connect to database
docker exec -it test-postgres psql -U postgres -d taskdb

# View all expenses
SELECT * FROM expenses;

# View expenses with category names
SELECT
  e.id,
  e.amount,
  e.date,
  c.name_en,
  sc.name_en as subcategory
FROM expenses e
JOIN categories c ON e.category_id = c.id
LEFT JOIN sub_categories sc ON e.sub_category_id = sc.id;
```

### Test JWT Token

```bash
# Decode JWT token (install jq and base64)
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq
```

---

## Support

For issues or questions:

1. Check Docker container logs
2. Verify database connection: `docker exec -it test-postgres psql -U postgres -d taskdb`
3. Review TESTING.md for comprehensive testing scenarios
4. Check CONVERSION_SUMMARY.md for architecture overview
