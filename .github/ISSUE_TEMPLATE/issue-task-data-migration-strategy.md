---
name: 🔧 Task - Implement Data Migration Strategy for Historical Expenses
about: Handle old/legacy expense data - migration, cleanup, and archival strategy
title: '[TASK] Data Migration Strategy for Historical/Legacy Expenses'
labels: 'task, database, data-migration, backend, devops'
assignees: ''
---

## 📋 Task Description

Develop and implement a strategy to handle historical/legacy expense data that may be causing inconsistencies or performance issues in the application.

## 🎯 Goal

Create a clean, maintainable approach to:
1. Identify old/legacy data
2. Migrate or transform it to current schema
3. Archive historical data appropriately
4. Ensure data consistency going forward

## 🔍 Current Situation Assessment

**Issues:**
- Old expense data appears in tables but not in stats/graphs
- Possible schema mismatches from previous versions
- No clear strategy for handling historical data
- Data inconsistency across pages

**Questions to Answer:**
- How old is the oldest expense record?
- Are there schema version differences?
- Is old data missing required fields?
- Should old data be kept, archived, or removed?

## 📝 Implementation Steps

### Phase 1: Data Audit (Investigation)

1. **Query Database for Data Age Distribution:**
   ```sql
   -- Count expenses by age
   SELECT 
     DATE_TRUNC('month', date) as month,
     COUNT(*) as count,
     SUM(amount) as total_amount
   FROM expenses
   GROUP BY month
   ORDER BY month DESC;
   ```

2. **Check for Schema Inconsistencies:**
   ```sql
   -- Find records missing required fields
   SELECT COUNT(*) FROM expenses WHERE category_id IS NULL;
   SELECT COUNT(*) FROM expenses WHERE user_id IS NULL;
   SELECT COUNT(*) FROM expenses WHERE date IS NULL;
   ```

3. **Identify Orphaned Records:**
   ```sql
   -- Expenses without valid category
   SELECT COUNT(*) 
   FROM expenses e 
   LEFT JOIN categories c ON e.category_id = c.id 
   WHERE c.id IS NULL;
   
   -- Expenses without valid user
   SELECT COUNT(*) 
   FROM expenses e 
   LEFT JOIN users u ON e.user_id = u.id 
   WHERE u.id IS NULL;
   ```

### Phase 2: Define Migration Rules

**Decision Matrix:**

| Data Condition | Action | Rationale |
|----------------|--------|-----------|
| Valid, recent (< 1 year) | Keep as-is | Active data |
| Valid, old (> 1 year) | Archive table | Reduce query load |
| Missing category | Assign "Uncategorized" | Data integrity |
| Missing user | Delete or assign admin | Orphaned data |
| Invalid dates | Fix or delete | Data quality |
| Duplicate records | Deduplicate | Data integrity |

### Phase 3: Create Migration Scripts

1. **Backup Script:**
   ```bash
   #!/bin/bash
   # Backup before migration
   pg_dump -U testuser -d testdb -t expenses > expenses_backup_$(date +%Y%m%d).sql
   ```

2. **Migration Script (SQL):**
   ```sql
   -- Create archive table
   CREATE TABLE IF NOT EXISTS expenses_archive (
     LIKE expenses INCLUDING ALL
   );
   
   -- Move old data to archive (older than 2 years)
   INSERT INTO expenses_archive 
   SELECT * FROM expenses 
   WHERE date < CURRENT_DATE - INTERVAL '2 years';
   
   -- Fix missing categories
   UPDATE expenses 
   SET category_id = (SELECT id FROM categories WHERE name = 'Uncategorized' LIMIT 1)
   WHERE category_id IS NULL;
   
   -- Remove orphaned expenses (no valid user)
   DELETE FROM expenses 
   WHERE user_id NOT IN (SELECT id FROM users);
   ```

3. **Rollback Script:**
   ```sql
   -- Restore from archive if needed
   INSERT INTO expenses 
   SELECT * FROM expenses_archive 
   WHERE id NOT IN (SELECT id FROM expenses);
   ```

### Phase 4: Update Application Code

1. **Add Archive Query Support:**
   ```typescript
   // In api-service
   @Get('expenses/archive')
   async getArchivedExpenses(@Query('year') year: number) {
     return this.expenseService.findArchived(year);
   }
   ```

2. **Implement Consistent Date Filtering:**
   ```typescript
   // Default to current month across all endpoints
   const defaultDateRange = {
     start: startOfMonth(new Date()),
     end: endOfMonth(new Date())
   };
   ```

3. **Add Data Validation:**
   ```typescript
   // Ensure all new expenses have required fields
   @IsNotEmpty()
   @IsNumber()
   categoryId: number;
   
   @IsNotEmpty()
   @IsNumber()
   userId: number;
   ```

### Phase 5: Testing & Validation

1. **Test Migration Locally:**
   ```bash
   # Run migration on local copy of production data
   docker exec -i test-postgres psql -U testuser -d testdb < migration_script.sql
   ```

2. **Verify Data Integrity:**
   ```sql
   -- Check totals match before/after
   SELECT COUNT(*), SUM(amount) FROM expenses;
   SELECT COUNT(*), SUM(amount) FROM expenses_archive;
   ```

3. **Test Application:**
   - Dashboard shows correct stats
   - Analytics graphs match table data
   - No errors in console
   - All pages load quickly

### Phase 6: Production Deployment

1. **Schedule Maintenance Window:**
   - Announce downtime to users
   - Choose low-traffic time

2. **Execute Migration:**
   ```bash
   # 1. Backup production database
   # 2. Run migration script
   # 3. Verify data integrity
   # 4. Deploy updated application code
   ```

3. **Monitor Post-Migration:**
   - Check error logs
   - Monitor query performance
   - Verify user-reported data is correct

## 🔧 Tools & Technologies

- **Database:** PostgreSQL
- **Migration Tool:** Raw SQL scripts or TypeORM migrations
- **Backup:** pg_dump
- **Monitoring:** Application logs, database query logs

## ✅ Acceptance Criteria

- [ ] Data audit completed - know exactly what old data exists
- [ ] Migration strategy documented and approved
- [ ] Backup scripts created and tested
- [ ] Migration scripts created with rollback plan
- [ ] Scripts tested on local/staging environment
- [ ] Data consistency verified post-migration
- [ ] Application code updated to prevent future inconsistencies
- [ ] Documentation updated with migration process
- [ ] Production migration scheduled and executed successfully

## 📚 Documentation to Create

1. **DATA_MIGRATION.md:**
   - Migration history
   - Lessons learned
   - Future migration guidelines

2. **API Changes:**
   - Document any new endpoints
   - Update API_REFERENCE.md

3. **Database Schema:**
   - Document archive table structure
   - Update ER diagrams if applicable

## 🎓 Best Practices

1. **Always backup before migration**
2. **Test on non-production first**
3. **Have rollback plan ready**
4. **Communicate with users about maintenance**
5. **Monitor closely post-migration**
6. **Document everything**

## 🔗 Related Issues

- Bug: Data inconsistency across pages
- Task: Add date range filtering to all pages
- Task: Implement data validation tests

## 🏷️ Labels

`task`, `database`, `data-migration`, `backend`, `devops`, `critical`

---

**Priority:** High (blocks bug fix)
**Effort Estimate:** 4-8 hours (depending on data volume)
**Risk Level:** Medium-High (involves production data)
