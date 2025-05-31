-- Enhanced Technician System Database Schema

-- Sequence for ticket numbering (must be created first)
CREATE SEQUENCE ticket_seq START 1;

-- Technicians table
CREATE TABLE technicians (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    hire_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main tickets table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'TKT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('ticket_seq')::text, 4, '0'),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(30) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
    assigned_technician_id INTEGER NOT NULL REFERENCES technicians(id),
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

-- MOCK DATA FOR TESTING

-- Insert sample technicians
INSERT INTO technicians (employee_id, first_name, last_name, email, phone, specialization, status, hire_date) VALUES
('TECH001', 'John', 'Martinez', 'john.martinez@company.com', '555-0101', 'HVAC Systems', 'active', '2023-01-15'),
('TECH002', 'Sarah', 'Chen', 'sarah.chen@company.com', '555-0102', 'Electrical', 'active', '2023-03-20'),
('TECH003', 'Mike', 'Johnson', 'mike.johnson@company.com', '555-0103', 'Plumbing', 'active', '2023-02-10'),
('TECH004', 'Lisa', 'Rodriguez', 'lisa.rodriguez@company.com', '555-0104', 'General Maintenance', 'active', '2023-04-05'),
('TECH005', 'David', 'Kim', 'david.kim@company.com', '555-0105', 'IT Support', 'active', '2023-05-12'),
('TECH006', 'Emma', 'Thompson', 'emma.thompson@company.com', '555-0106', 'Security Systems', 'on_leave', '2023-01-30');

-- Reset ticket sequence to start fresh
SELECT setval('ticket_seq', 1, false);

-- Insert diverse sample tickets with realistic scenarios
INSERT INTO tickets (title, description, location, priority, status, assigned_technician_id, customer_name, customer_phone, scheduled_date) VALUES

-- Urgent/High Priority Tickets
('Elevator Stuck Between Floors', 'Main elevator stuck between 3rd and 4th floor with 2 people inside. Emergency response needed immediately.', 'Tower A - Main Elevator Bank', 'urgent', 'in_progress', 1, 'Building Security', '555-2001', '2025-05-31'),
('No Heat in Server Room', 'Server room temperature rising rapidly. HVAC system completely down. Critical infrastructure at risk.', 'Building B - Server Room 201', 'urgent', 'assigned', 1, 'IT Manager Sarah Kim', '555-2002', '2025-05-31'),
('Water Leak in Executive Office', 'Major water leak in ceiling of CEO office. Water dripping onto equipment and furniture.', 'Executive Floor - Corner Office', 'high', 'assigned', 3, 'Executive Assistant', '555-2003', '2025-06-01'),
('Power Outage in Medical Wing', 'Partial power outage affecting medical equipment in patient rooms 301-305.', 'Medical Wing - 3rd Floor', 'high', 'assigned', 2, 'Nurse Station', '555-2004', '2025-05-31'),

-- Medium Priority Tickets
('Conference Room Projector Not Working', 'Projector in main conference room won''t turn on. Important client meeting scheduled tomorrow.', 'Conference Room A - 2nd Floor', 'medium', 'assigned', 5, 'Marketing Director', '555-2005', '2025-06-02'),
('Bathroom Faucet Leaking', 'Women''s restroom on 4th floor has a constantly dripping faucet. Wasting water and annoying sound.', 'Building A - 4th Floor Restroom', 'medium', 'assigned', 3, 'Facilities Coordinator', '555-2006', '2025-06-03'),
('Office Door Lock Malfunction', 'Electronic lock on office 415 not responding to key cards. Employee locked out.', 'Building A - Office 415', 'medium', 'completed', 6, 'John Smith', '555-2007', '2025-05-30'),
('Flickering Lights in Hallway', 'Fluorescent lights in main hallway flickering intermittently. Several bulbs need replacement.', 'Building C - Main Hallway', 'medium', 'in_progress', 2, 'Maintenance Supervisor', '555-2008', '2025-06-01'),
('Printer Paper Jam Issues', 'Main office printer constantly jamming. Multiple employees affected daily.', 'Open Office Area - Printer Station', 'medium', 'assigned', 5, 'Office Manager', '555-2009', '2025-06-04'),

-- Low Priority Tickets
('Replace Air Freshener', 'Automatic air freshener in lobby needs new cartridge. Pleasant environment for visitors.', 'Main Lobby - Reception Area', 'low', 'assigned', 4, 'Reception Desk', '555-2010', '2025-06-05'),
('Squeaky Door Hinges', 'Meeting room door hinges making loud squeaking noise when opened.', 'Meeting Room B - 1st Floor', 'low', 'assigned', 4, 'Administrative Assistant', '555-2011', '2025-06-07'),
('Window Blind Cord Replacement', 'Cord on window blinds in break room snapped. Blinds stuck in closed position.', 'Employee Break Room', 'low', 'assigned', 4, 'HR Representative', '555-2012', '2025-06-10'),
('Paint Touch-up Needed', 'Scuff marks on wall near main entrance need paint touch-up for professional appearance.', 'Main Entrance - Lobby Wall', 'low', 'assigned', 4, 'Building Manager', '555-2013', '2025-06-15'),

-- Completed/Cancelled Examples
('Install New Network Cable', 'Run new ethernet cable from IT closet to new employee workstation.', 'Building A - Workstation 12', 'medium', 'completed', 5, 'IT Support', '555-2014', '2025-05-28'),
('Replace Broken Window', 'Window in conference room cracked from recent storm. Safety hazard.', 'Conference Room C - 3rd Floor', 'high', 'completed', 4, 'Facilities Manager', '555-2015', '2025-05-25'),
('Investigate Strange Noise', 'Intermittent mechanical noise in ceiling. Possibly HVAC related.', 'Building B - 2nd Floor', 'medium', 'cancelled', 1, 'Employee Report', '555-2016', '2025-05-20'),

-- Scheduled Future Work
('Monthly HVAC Filter Change', 'Routine replacement of HVAC filters throughout building. Quarterly maintenance.', 'All HVAC Units - Building Wide', 'medium', 'assigned', 1, 'Preventive Maintenance', '555-2017', '2025-06-15'),
('Security Camera Calibration', 'Annual calibration and cleaning of all security cameras in parking garage.', 'Parking Garage - All Levels', 'low', 'assigned', 6, 'Security Chief', '555-2018', '2025-06-20'),
('Fire Extinguisher Inspection', 'Monthly inspection of all fire extinguishers as required by safety regulations.', 'Building Wide - All Floors', 'medium', 'assigned', 4, 'Safety Officer', '555-2019', '2025-06-30'),

-- Recent Activity Examples
('Replace Burned Out Light Bulbs', 'Multiple LED bulbs burned out in accounting department. Poor lighting affecting work.', 'Accounting Department - 5th Floor', 'medium', 'in_progress', 2, 'Accounting Manager', '555-2020', '2025-05-31'),
('Unclog Kitchen Sink', 'Break room kitchen sink draining very slowly. Food particles blocking drain.', 'Employee Kitchen - 6th Floor', 'medium', 'assigned', 3, 'Kitchen Coordinator', '555-2021', '2025-06-01');

-- Add some tickets with different technicians to test filtering
INSERT INTO tickets (title, description, location, priority, status, assigned_technician_id, customer_name, customer_phone, scheduled_date) VALUES
('Temperature Control Issues', 'Office too hot in afternoon, too cold in morning. Thermostat needs adjustment.', 'Building A - Offices 201-210', 'medium', 'assigned', 1, 'Office Supervisor', '555-3001', '2025-06-03'),
('Parking Lot Light Out', 'Security light in parking lot section C not working. Safety concern for evening staff.', 'Parking Lot - Section C', 'high', 'assigned', 2, 'Security Guard', '555-3002', '2025-06-01'),
('Clean Carpet Stain', 'Large coffee stain on carpet in main reception area. Unprofessional appearance.', 'Main Reception Area', 'low', 'assigned', 4, 'Receptionist', '555-3003', '2025-06-05');

-- Update some timestamps to show realistic scheduling
UPDATE tickets SET 
    created_at = CURRENT_TIMESTAMP - INTERVAL '2 days',
    updated_at = CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE id IN (1, 2, 3);

UPDATE tickets SET 
    created_at = CURRENT_TIMESTAMP - INTERVAL '1 day',
    updated_at = CURRENT_TIMESTAMP - INTERVAL '4 hours'
WHERE id IN (4, 5, 6, 7);

UPDATE tickets SET 
    created_at = CURRENT_TIMESTAMP - INTERVAL '3 hours'
WHERE id > 15;

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