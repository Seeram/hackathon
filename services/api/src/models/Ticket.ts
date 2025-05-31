// models/Ticket.ts

import { AIChatLog } from './AIChatLog';

export interface TicketAttachment {
    id: number;
    file_name: string;
    file_type: string;
}

export interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    description?: string;
    location?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    assigned_technician_id: number;
    customer_name?: string;
    customer_phone?: string;
    scheduled_date?: Date;
    created_at: Date;
    updated_at: Date;
    attachments?: TicketAttachment[];
    ai_chat_logs?: AIChatLog[];
}

export interface CreateTicketRequest {
    title: string;
    description?: string;
    location?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assigned_technician_id: number;
    customer_name?: string;
    customer_phone?: string;
    scheduled_date?: Date;
}

export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    location?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    customer_name?: string;
    customer_phone?: string;
    scheduled_date?: Date;
}