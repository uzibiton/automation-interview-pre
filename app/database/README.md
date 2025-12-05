# Database Seeding & Category Management

This folder contains database initialization scripts and category seeding tools.

## 📁 Files Overview

### `init.sql`

- Full database schema with initial data
- Run this when creating a new database from scratch
- Contains CREATE TABLE statements and initial category/expense data

### `seed-categories.sql`

- **Standalone category seeding script**
- Run this to add missing categories to an existing database
- Safe to run multiple times (uses `ON CONFLICT DO NOTHING`)
- Useful for fixing deployed environments with missing categories

## 🚀 How to Fix Missing Categories in Production

### Option 1: Run SQL Seed Script (Quick Fix)

```bash
# Connect to your Cloud SQL database via proxy
cloud-sql-proxy YOUR_INSTANCE_CONNECTION_NAME

# In another terminal, run the seed script
psql "host=127.0.0.1 port=5432 dbname=expenses user=postgres" -f database/seed-categories.sql
```

### Option 2: Application Auto-Seed (Recommended)

The API service now includes **automatic category seeding** on startup via `SeedService`:

1. Categories are defined in `services/api-service/src/expenses/constants/categories.constant.ts`
2. On application startup, `SeedService` checks if categories exist
3. If no categories found, it automatically seeds them
4. **No manual intervention needed** - just redeploy!

The seed service runs automatically, so simply restarting your Cloud Run service will populate categories.

## 🛠️ Maintaining Categories

### Adding a New Category

Edit `services/api-service/src/expenses/constants/categories.constant.ts`:

```typescript
export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  // ... existing categories
  {
    nameEn: 'My New Category',
    nameHe: 'קטגוריה חדשה',
    icon: '🎨',
    color: '#ABCDEF',
    isDefault: true,
    subCategories: [
      { nameEn: 'Sub 1', nameHe: 'תת 1' },
      { nameEn: 'Sub 2', nameHe: 'תת 2' },
    ],
  },
];
```

### Updating the SQL Seed Script

After modifying `categories.constant.ts`, update `seed-categories.sql` to match:

```sql
INSERT INTO categories (name_en, name_he, icon, color, is_default) VALUES
    ('My New Category', 'קטגוריה חדשה', '🎨', '#ABCDEF', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he)
SELECT id, 'Sub 1', 'תת 1' FROM categories WHERE name_en = 'My New Category'
ON CONFLICT DO NOTHING;
```

### Applying Changes to Production

**Recommended Method** (Force Seed):

```bash
# Add an endpoint to your API (or use a temporary script)
curl -X POST https://your-api/admin/seed-categories
```

**Alternative** (Run SQL directly):

```bash
psql "your-connection-string" -f database/seed-categories.sql
```

## 📊 Current Categories

The system includes these default categories:

| Category       | Icon | Color   | Subcategories                                                         |
| -------------- | ---- | ------- | --------------------------------------------------------------------- |
| Entertainment  | 🎭   | #FF6B6B | Restaurant, Shows, Clothing, Trips                                    |
| Food           | 🍔   | #4ECDC4 | Supermarket, Grocery, Kiosk, Greens                                   |
| Health         | ⚕️   | #45B7D1 | Medications, Health Tax, Doctor, Health Fund, Dentist                 |
| Insurance      | 🛡️   | #FFA07A | Health, Building, Car, Life                                           |
| Education      | 📚   | #98D8C8 | Books, Supplies, Private Lessons, Classes                             |
| Transportation | 🚗   | #F7B731 | Fuel, Maintenance, Toll Road, Fines, Parking, etc.                    |
| Bills          | 💡   | #5F27CD | Mortgage, Water, Electricity, Property Tax, Gas, Mobile, Internet, TV |
| Savings        | 💰   | #26A69A | Bar Mitzvah, Summer Vacation, Children                                |
| Household      | 🏠   | #95A5A6 | Repairs, Pets, Clothing, Home Products, Personal Care                 |

## 🔍 Troubleshooting

### Categories not appearing in UI

1. Check database connection: `psql "your-connection-string" -c "SELECT COUNT(*) FROM categories;"`
2. Verify API endpoint: `curl https://your-api/expenses/categories`
3. Restart Cloud Run service to trigger auto-seed
4. Run SQL seed script manually if needed

### Duplicate categories after seeding

- The seed script uses `ON CONFLICT DO NOTHING` to prevent duplicates
- Safe to run multiple times

### Need to reset categories

```sql
-- ⚠️ WARNING: This deletes all categories (including custom ones)
DELETE FROM sub_categories;
DELETE FROM categories;

-- Then re-run seed script
\i database/seed-categories.sql
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  categories.constant.ts                 │  ← Single source of truth
│  (TypeScript definitions)               │     Edit here to change categories
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ seed.service │   │ seed-        │
│ (auto-seed)  │   │ categories   │
│              │   │ .sql         │
└──────────────┘   └──────────────┘
        │                 │
        └────────┬────────┘
                 ▼
         ┌──────────────┐
         │  PostgreSQL  │
         │  Database    │
         └──────────────┘
```

## 📝 Best Practices

1. **Always update `categories.constant.ts` first** - this is the source of truth
2. **Keep SQL script in sync** - update `seed-categories.sql` after changing TypeScript
3. **Test locally before deploying** - run the seed script on local database
4. **Use descriptive names** - both English and Hebrew translations
5. **Pick unique colors** - helps with visual distinction in charts
6. **Choose appropriate icons** - makes UI more intuitive

## 🔗 Related Files

- `services/api-service/src/expenses/constants/categories.constant.ts` - TypeScript definitions
- `services/api-service/src/expenses/services/seed.service.ts` - Auto-seed service
- `services/api-service/src/expenses/expenses.module.ts` - Module configuration
- `services/api-service/src/expenses/category.entity.ts` - Category entity
- `services/api-service/src/expenses/sub-category.entity.ts` - SubCategory entity
