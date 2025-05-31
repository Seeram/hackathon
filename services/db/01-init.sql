-- Simplified Technician System Database Schema

-- Sequence for ticket numbering (must be created first)
CREATE SEQUENCE ticket_seq START 1;

-- Main tickets table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'TKT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('ticket_seq')::text, 4, '0'),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(30) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
    assigned_technician_id INTEGER NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    scheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional attachments table
CREATE TABLE ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Indexes
CREATE INDEX idx_tickets_technician ON tickets(assigned_technician_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_scheduled_date ON tickets(scheduled_date);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample query for technician's tickets
/*
SELECT 
    t.id,
    t.ticket_number,
    t.title,
    t.description,
    t.location,
    t.priority,
    t.status,
    t.customer_name,
    t.customer_phone,
    t.scheduled_date,
    -- Get attachments as JSON array (optional)
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', att.id,
                'file_name', att.file_name,
                'file_type', att.file_type
            )
        ) FILTER (WHERE att.id IS NOT NULL), 
        '[]'::json
    ) as attachments
FROM tickets t
LEFT JOIN ticket_attachments att ON t.id = att.ticket_id
WHERE t.assigned_technician_id = $1
  AND t.status IN ('assigned', 'in_progress')
GROUP BY t.id
ORDER BY t.priority DESC, t.scheduled_date ASC;
*/