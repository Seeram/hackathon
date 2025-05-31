import { Client } from 'pg';
import { AIChatLog, CreateAIChatLogRequest, AIChatLogQueryParams } from '../models/AIChatLog';

export class AIChatLogService {
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
            console.log('AI Chat Log Service connected to PostgreSQL database');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.end();
            console.log('AI Chat Log Service disconnected from PostgreSQL database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }

    /**
     * Create a new AI chat log entry
     */
    async createChatLog(logData: CreateAIChatLogRequest): Promise<AIChatLog> {
        try {
            const result = await this.client.query(
                `INSERT INTO ai_chat_logs (
                    ticket_id, message_type, user_message, ai_response, 
                    voice_transcription, session_id
                ) VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *`,
                [
                    logData.ticket_id,
                    logData.message_type,
                    logData.user_message,
                    logData.ai_response,
                    logData.voice_transcription || null,
                    logData.session_id || null
                ]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating AI chat log:', error);
            throw error;
        }
    }

    /**
     * Get chat logs by ticket ID
     */
    async getChatLogsByTicketId(ticketId: number, limit: number = 50, offset: number = 0): Promise<AIChatLog[]> {
        try {
            const result = await this.client.query(
                `SELECT * FROM ai_chat_logs 
                 WHERE ticket_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT $2 OFFSET $3`,
                [ticketId, limit, offset]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching chat logs by ticket ID:', error);
            throw error;
        }
    }

    /**
     * Get chat logs by session ID
     */
    async getChatLogsBySessionId(sessionId: string, limit: number = 50, offset: number = 0): Promise<AIChatLog[]> {
        try {
            const result = await this.client.query(
                `SELECT * FROM ai_chat_logs 
                 WHERE session_id = $1 
                 ORDER BY created_at ASC 
                 LIMIT $2 OFFSET $3`,
                [sessionId, limit, offset]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching chat logs by session ID:', error);
            throw error;
        }
    }

    /**
     * Get chat logs with flexible query parameters
     */
    async getChatLogs(params: AIChatLogQueryParams): Promise<AIChatLog[]> {
        try {
            let query = 'SELECT * FROM ai_chat_logs WHERE 1=1';
            const queryParams: any[] = [];
            let paramCount = 1;

            if (params.ticket_id) {
                query += ` AND ticket_id = $${paramCount}`;
                queryParams.push(params.ticket_id);
                paramCount++;
            }

            if (params.message_type) {
                query += ` AND message_type = $${paramCount}`;
                queryParams.push(params.message_type);
                paramCount++;
            }

            if (params.session_id) {
                query += ` AND session_id = $${paramCount}`;
                queryParams.push(params.session_id);
                paramCount++;
            }

            query += ' ORDER BY created_at DESC';

            if (params.limit) {
                query += ` LIMIT $${paramCount}`;
                queryParams.push(params.limit);
                paramCount++;
            }

            if (params.offset) {
                query += ` OFFSET $${paramCount}`;
                queryParams.push(params.offset);
                paramCount++;
            }

            const result = await this.client.query(query, queryParams);
            return result.rows;
        } catch (error) {
            console.error('Error fetching chat logs:', error);
            throw error;
        }
    }

    /**
     * Get chat log statistics for a ticket
     */
    async getChatLogStats(ticketId: number): Promise<{
        total_messages: number;
        chat_messages: number;
        voice_messages: number;
        suggestion_requests: number;
        first_interaction: Date | null;
        last_interaction: Date | null;
    }> {
        try {
            const result = await this.client.query(
                `SELECT 
                    COUNT(*) as total_messages,
                    COUNT(CASE WHEN message_type = 'chat' THEN 1 END) as chat_messages,
                    COUNT(CASE WHEN message_type = 'voice' THEN 1 END) as voice_messages,
                    COUNT(CASE WHEN message_type = 'suggestion' THEN 1 END) as suggestion_requests,
                    MIN(created_at) as first_interaction,
                    MAX(created_at) as last_interaction
                 FROM ai_chat_logs 
                 WHERE ticket_id = $1`,
                [ticketId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching chat log stats:', error);
            throw error;
        }
    }

    /**
     * Delete chat logs for a ticket (when ticket is deleted)
     */
    async deleteChatLogsByTicketId(ticketId: number): Promise<number> {
        try {
            const result = await this.client.query(
                'DELETE FROM ai_chat_logs WHERE ticket_id = $1',
                [ticketId]
            );
            return result.rowCount || 0;
        } catch (error) {
            console.error('Error deleting chat logs:', error);
            throw error;
        }
    }
}
