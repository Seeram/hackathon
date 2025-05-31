import { Client } from 'pg';
import { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../models/Ticket';

export class TicketDatabaseService {
    private client: Client;

    constructor() {
        this.client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'postgres',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Connected to PostgreSQL database');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.end();
            console.log('Disconnected from PostgreSQL database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }

    // Get all tickets for a technician
    async getTechnicianTickets(technicianId: number, status?: string): Promise<Ticket[]> {
        try {
            let query = `
                SELECT 
                    t.*,
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
            `;
            
            const params: any[] = [technicianId];
            
            if (status) {
                query += ' AND t.status = $2';
                params.push(status);
            }
            
            query += ' GROUP BY t.id ORDER BY t.priority DESC, t.scheduled_date ASC';

            const result = await this.client.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error fetching technician tickets:', error);
            throw error;
        }
    }

    // Get a specific ticket by ID
    async getTicketById(id: number): Promise<Ticket | null> {
        try {
            const query = `
                SELECT 
                    t.*,
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
                WHERE t.id = $1
                GROUP BY t.id
            `;

            const result = await this.client.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error fetching ticket by id:', error);
            throw error;
        }
    }

    // Create a new ticket
    async createTicket(ticketData: CreateTicketRequest): Promise<Ticket> {
        try {
            const result = await this.client.query(
                `INSERT INTO tickets (
                    title, description, location, priority, assigned_technician_id, 
                    customer_name, customer_phone, scheduled_date
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *`,
                [
                    ticketData.title,
                    ticketData.description,
                    ticketData.location,
                    ticketData.priority || 'medium',
                    ticketData.assigned_technician_id,
                    ticketData.customer_name,
                    ticketData.customer_phone,
                    ticketData.scheduled_date
                ]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    }

    // Update a ticket
    async updateTicket(id: number, ticketData: UpdateTicketRequest): Promise<Ticket | null> {
        try {
            const setParts: string[] = [];
            const values: any[] = [];
            let paramCount = 1;

            if (ticketData.title !== undefined) {
                setParts.push(`title = $${paramCount++}`);
                values.push(ticketData.title);
            }
            if (ticketData.description !== undefined) {
                setParts.push(`description = $${paramCount++}`);
                values.push(ticketData.description);
            }
            if (ticketData.location !== undefined) {
                setParts.push(`location = $${paramCount++}`);
                values.push(ticketData.location);
            }
            if (ticketData.priority !== undefined) {
                setParts.push(`priority = $${paramCount++}`);
                values.push(ticketData.priority);
            }
            if (ticketData.status !== undefined) {
                setParts.push(`status = $${paramCount++}`);
                values.push(ticketData.status);
            }
            if (ticketData.customer_name !== undefined) {
                setParts.push(`customer_name = $${paramCount++}`);
                values.push(ticketData.customer_name);
            }
            if (ticketData.customer_phone !== undefined) {
                setParts.push(`customer_phone = $${paramCount++}`);
                values.push(ticketData.customer_phone);
            }
            if (ticketData.scheduled_date !== undefined) {
                setParts.push(`scheduled_date = $${paramCount++}`);
                values.push(ticketData.scheduled_date);
            }

            if (setParts.length === 0) {
                throw new Error('No fields to update');
            }

            setParts.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            const result = await this.client.query(
                `UPDATE tickets SET ${setParts.join(', ')} WHERE id = $${paramCount} RETURNING *`,
                values
            );

            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    }

    // Update ticket status only
    async updateTicketStatus(id: number, status: string, technicianId?: number): Promise<Ticket | null> {
        try {
            let query = 'UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
            const params: any[] = [status, id];

            // If technicianId provided, ensure ticket belongs to them
            if (technicianId) {
                query += ' AND assigned_technician_id = $3';
                params.push(technicianId);
            }

            query += ' RETURNING *';

            const result = await this.client.query(query, params);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error updating ticket status:', error);
            throw error;
        }
    }

    // Delete a ticket
    async deleteTicket(id: number): Promise<boolean> {
        try {
            const result = await this.client.query('DELETE FROM tickets WHERE id = $1', [id]);
            return (result.rowCount || 0) > 0;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }

    // Add attachment to ticket
    async addTicketAttachment(ticketId: number, fileName: string, filePath: string, fileType?: string): Promise<any> {
        try {
            const result = await this.client.query(
                `INSERT INTO ticket_attachments (ticket_id, file_name, file_path, file_type)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [ticketId, fileName, filePath, fileType]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error adding ticket attachment:', error);
            throw error;
        }
    }
}

// Singleton instance
export const ticketDatabaseService = new TicketDatabaseService();