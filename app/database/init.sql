-- Initialize database schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (main expense categories)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_he VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sub-categories table
CREATE TABLE IF NOT EXISTS sub_categories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name_en VARCHAR(100) NOT NULL,
    name_he VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    sub_category_id INTEGER REFERENCES sub_categories(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50),
    labels TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User budget limits per category
CREATE TABLE IF NOT EXISTS budget_limits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    limit_amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20) DEFAULT 'monthly',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, period)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_sub_categories_category_id ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_budget_limits_user_id ON budget_limits(user_id);

-- Insert default categories with English and Hebrew names
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
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (1, 'Restaurant', 'מסעדה'),
    (1, 'Shows', 'הופעות'),
    (1, 'Clothing', 'ביגוד'),
    (1, 'Trips', 'טיולים')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Food (מזון)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (2, 'Supermarket', 'סופר'),
    (2, 'Grocery', 'מכולת'),
    (2, 'Kiosk', 'קיוסק'),
    (2, 'Greens', 'ירקן')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Health (בריאות)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (3, 'Medications', 'תרופות'),
    (3, 'Health Tax', 'היטל'),
    (3, 'Doctor', 'רופא'),
    (3, 'Health Fund', 'קופ״ח'),
    (3, 'Dentist', 'שיניים')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Insurance (ביטוח)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (4, 'Health Insurance', 'בריאות'),
    (4, 'Building Insurance', 'מבנה'),
    (4, 'Car Insurance', 'רכב'),
    (4, 'Life Insurance', 'חיים')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Education (חינוך)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (5, 'Books', 'ספרים'),
    (5, 'Supplies', 'ציוד'),
    (5, 'Private Lessons', 'שיעורים פרטיים'),
    (5, 'Classes', 'חוגים')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Transportation (תחבורה)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (6, 'Fuel', 'דלק'),
    (6, 'Maintenance', 'טיפולים'),
    (6, 'Toll Road', 'כביש אגרה'),
    (6, 'Fines', 'דוחות'),
    (6, 'Parking', 'חניה'),
    (6, 'Insurance', 'ביטוח'),
    (6, 'License Fee', 'אגרת רישוי'),
    (6, 'Public Transport', 'תחב״צ')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Bills (חשבונות)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (7, 'Mortgage', 'משכנתא'),
    (7, 'Mortgage Insurance', 'ביטוחי משכנתא'),
    (7, 'Water & Sewage', 'מים וביוב'),
    (7, 'Electricity', 'חשמל'),
    (7, 'Property Tax', 'ארנונה'),
    (7, 'Gas', 'גז'),
    (7, 'Mobile Phone', 'סלולר'),
    (7, 'Internet', 'אינטרנט'),
    (7, 'Television', 'טלביזיה')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Savings (חסכונות)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (8, 'Bar Mitzvah', 'בר מצווה'),
    (8, 'Summer Vacation', 'חופשת קיץ'),
    (8, 'Children', 'ילדים')
ON CONFLICT DO NOTHING;

-- Insert sub-categories for Household (משק בית)
INSERT INTO sub_categories (category_id, name_en, name_he) VALUES
    (9, 'Repairs & Maintenance', 'תקונים ותחזוקה'),
    (9, 'Pets', 'חיות מחמד'),
    (9, 'Clothing & Shoes', 'ביגוד והנעלה'),
    (9, 'Home Products', 'מוצרים לבית'),
    (9, 'Personal Care', 'טיפוח')
ON CONFLICT DO NOTHING;

-- Insert test data
INSERT INTO users (email, name, google_id, avatar_url) VALUES
    ('testuser@example.com', 'Test User', 'google123', 'https://via.placeholder.com/150'),
    ('admin@example.com', 'Admin User', 'google456', 'https://via.placeholder.com/150')
ON CONFLICT (email) DO NOTHING;

-- Insert sample expenses
INSERT INTO expenses (user_id, category_id, sub_category_id, amount, currency, description, date, payment_method) VALUES
    (1, 2, 5, 250.50, 'USD', 'Weekly groceries', CURRENT_DATE - INTERVAL '2 days', 'credit_card'),
    (1, 1, 1, 120.00, 'USD', 'Dinner at Italian restaurant', CURRENT_DATE - INTERVAL '5 days', 'credit_card'),
    (1, 6, 1, 80.00, 'USD', 'Gas station fill-up', CURRENT_DATE - INTERVAL '1 day', 'debit_card'),
    (2, 7, 4, 150.00, 'USD', 'Monthly electricity bill', CURRENT_DATE, 'bank_transfer')
ON CONFLICT DO NOTHING;
