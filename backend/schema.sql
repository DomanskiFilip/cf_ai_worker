-- Database Schema for AI Backend
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexing userId speeds up memory retrieval
CREATE INDEX idx_messages_userId ON messages(userId);