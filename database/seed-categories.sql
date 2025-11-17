-- ============================================================================
-- Category Seeding Script
-- ============================================================================
-- This file ensures default categories exist in the database.
-- Run this if categories are missing in production.
-- ============================================================================

-- Insert default categories (use ON CONFLICT to avoid duplicates)
INSERT INTO categories (name_en, name_he, icon, color, is_default) VALUES
    ('Entertainment', 'פנאי', '🎭', '#FF6B6B', TRUE),
    ('Food', 'מזון', '🍔', '#4ECDC4', TRUE),
    ('Health', 'בריאות', '⚕️', '#45B7D1', TRUE),
    ('Insurance', 'ביטוח', '🛡️', '#FFA07A', TRUE),
    ('Education', 'חינוך', '📚', '#98D8C8', TRUE),
    ('Transportation', 'תחבורה', '🚗', '#F7B731', TRUE),
    ('Bills', 'חשבונות', '💡', '#5F27CD', TRUE),
    ('Savings', 'חסכונות', '💰', '#26A69A', TRUE),
    ('Household', 'משק בית', '🏠', '#95A5A6', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Entertainment (פנאי)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Restaurant', 'מסעדה' FROM categories WHERE name_en = 'Entertainment'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Shows', 'הופעות' FROM categories WHERE name_en = 'Entertainment'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Clothing', 'ביגוד' FROM categories WHERE name_en = 'Entertainment'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Trips', 'טיולים' FROM categories WHERE name_en = 'Entertainment'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Food (מזון)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Supermarket', 'סופר' FROM categories WHERE name_en = 'Food'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Grocery', 'מכולת' FROM categories WHERE name_en = 'Food'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Kiosk', 'קיוסק' FROM categories WHERE name_en = 'Food'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Greens', 'ירקן' FROM categories WHERE name_en = 'Food'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Health (בריאות)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Medications', 'תרופות' FROM categories WHERE name_en = 'Health'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Health Tax', 'היטל' FROM categories WHERE name_en = 'Health'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Doctor', 'רופא' FROM categories WHERE name_en = 'Health'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Health Fund', 'קופ״ח' FROM categories WHERE name_en = 'Health'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Dentist', 'שיניים' FROM categories WHERE name_en = 'Health'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Insurance (ביטוח)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Health Insurance', 'בריאות' FROM categories WHERE name_en = 'Insurance'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Building Insurance', 'מבנה' FROM categories WHERE name_en = 'Insurance'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Car Insurance', 'רכב' FROM categories WHERE name_en = 'Insurance'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Life Insurance', 'חיים' FROM categories WHERE name_en = 'Insurance'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Education (חינוך)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Books', 'ספרים' FROM categories WHERE name_en = 'Education'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Supplies', 'ציוד' FROM categories WHERE name_en = 'Education'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Private Lessons', 'שיעורים פרטיים' FROM categories WHERE name_en = 'Education'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Classes', 'חוגים' FROM categories WHERE name_en = 'Education'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Transportation (תחבורה)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Fuel', 'דלק' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Maintenance', 'טיפולים' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Toll Road', 'כביש אגרה' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Fines', 'דוחות' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Parking', 'חניה' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Insurance', 'ביטוח' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'License Fee', 'אגרת רישוי' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Public Transport', 'תחב״צ' FROM categories WHERE name_en = 'Transportation'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Bills (חשבונות)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Mortgage', 'משכנתא' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Mortgage Insurance', 'ביטוחי משכנתא' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Water & Sewage', 'מים וביוב' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Electricity', 'חשמל' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Property Tax', 'ארנונה' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Gas', 'גז' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Mobile Phone', 'סלולר' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Internet', 'אינטרנט' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Television', 'טלביזיה' FROM categories WHERE name_en = 'Bills'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Savings (חסכונות)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Bar Mitzvah', 'בר מצווה' FROM categories WHERE name_en = 'Savings'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Summer Vacation', 'חופשת קיץ' FROM categories WHERE name_en = 'Savings'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Children', 'ילדים' FROM categories WHERE name_en = 'Savings'
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Household (משק בית)
INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Repairs & Maintenance', 'תקונים ותחזוקה' FROM categories WHERE name_en = 'Household'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Pets', 'חיות מחמד' FROM categories WHERE name_en = 'Household'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Clothing & Shoes', 'ביגוד והנעלה' FROM categories WHERE name_en = 'Household'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Home Products', 'מוצרים לבית' FROM categories WHERE name_en = 'Household'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (category_id, name_en, name_he) 
SELECT id, 'Personal Care', 'טיפוח' FROM categories WHERE name_en = 'Household'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- To run this script on your database:
-- ============================================================================
-- psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f seed-categories.sql
-- 
-- Or from Cloud SQL proxy:
-- psql "host=127.0.0.1 port=5432 dbname=expenses user=postgres" -f seed-categories.sql
-- ============================================================================
