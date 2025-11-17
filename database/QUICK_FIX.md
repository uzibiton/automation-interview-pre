# 🚀 Quick Fix Guide - Missing Categories

## Problem

Categories not showing in deployed environment

## Solution

Choose ONE of these methods:

---

## ⚡ Method 1: Redeploy (Automatic) - RECOMMENDED

```bash
# Categories will auto-populate on startup
gcloud run services update YOUR_SERVICE_NAME --region YOUR_REGION
```

**Why**: The new `SeedService` runs automatically and creates categories if missing.

---

## 🔧 Method 2: SQL Script (Immediate)

```bash
# 1. Connect to Cloud SQL
cloud-sql-proxy YOUR_INSTANCE_CONNECTION_NAME

# 2. Run seed script (in another terminal)
psql "host=127.0.0.1 port=5432 dbname=expenses user=postgres" \
  -f database/seed-categories.sql
```

**Why**: Instantly fixes the database without redeploying.

---

## ✅ Verify It Worked

```bash
# Check via API
curl https://YOUR_API_URL/expenses/categories | jq

# Should return 9 categories with subcategories
```

---

## 🛠️ How to Add New Categories (Future)

1. Edit: `services/api-service/src/expenses/constants/categories.constant.ts`
2. Add your category to the array
3. Redeploy

**That's it!** The seed service will handle everything.

---

## 📁 Key Files

- `categories.constant.ts` - **Edit here** to change categories
- `seed.service.ts` - Auto-runs on startup
- `seed-categories.sql` - Manual fix option
- `database/README.md` - Full documentation
- `database/CATEGORY_IMPLEMENTATION.md` - Technical details

---

## 🆘 Troubleshooting

**Categories still missing after redeploy?**

1. Check Cloud Run logs: `gcloud run services logs read YOUR_SERVICE --tail=50`
2. Look for "Checking for default categories..."
3. If you see errors, run the SQL script manually

**Need to reset categories?**

```sql
-- ⚠️ WARNING: Deletes all categories!
DELETE FROM sub_categories;
DELETE FROM categories;
-- Then run seed-categories.sql
```

---

## 📝 Summary

✅ **Auto-seed added** - runs on every deployment
✅ **Manual script available** - for emergency fixes  
✅ **Easy to maintain** - one TypeScript file to edit
✅ **Safe** - won't create duplicates, won't break existing data

**Default Setup**: 9 categories, 50+ subcategories, bilingual (EN/HE)
