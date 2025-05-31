-- AI Assistant Chat Logs Table
-- This table stores all AI assistant interactions with foreign key to tickets

CREATE TABLE ai_chat_logs (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('chat', 'voice', 'suggestion')),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    voice_transcription TEXT, -- For voice messages
    session_id VARCHAR(100), -- To group related messages
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_ai_chat_logs_ticket_id ON ai_chat_logs(ticket_id);
CREATE INDEX idx_ai_chat_logs_created_at ON ai_chat_logs(created_at);
CREATE INDEX idx_ai_chat_logs_session_id ON ai_chat_logs(session_id);
CREATE INDEX idx_ai_chat_logs_message_type ON ai_chat_logs(message_type);
