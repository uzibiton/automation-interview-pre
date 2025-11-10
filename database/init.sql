-- Initialize database schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table (example business entity)
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Insert test data
INSERT INTO users (email, name, google_id, avatar_url) VALUES
    ('testuser@example.com', 'Test User', 'google123', 'https://via.placeholder.com/150'),
    ('admin@example.com', 'Admin User', 'google456', 'https://via.placeholder.com/150')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
    (1, 'Complete automation tests', 'Write comprehensive test suite', 'in_progress', 'high', CURRENT_TIMESTAMP + INTERVAL '7 days'),
    (1, 'Review code', 'Review pull requests', 'pending', 'medium', CURRENT_TIMESTAMP + INTERVAL '3 days'),
    (2, 'Setup CI/CD', 'Configure GitHub Actions', 'completed', 'high', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT DO NOTHING;
