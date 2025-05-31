-- PostgreSQL initialization script
-- This file will be executed when the PostgreSQL container starts for the first time

-- Create the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO posts (title, content, author) VALUES
    ('First Post', 'This is the content of the first post', 'John Doe'),
    ('Second Post', 'This is the content of the second post', 'Jane Smith'),
    ('Third Post', 'This is the content of the third post', 'Bob Johnson')
ON CONFLICT DO NOTHING;
