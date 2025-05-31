import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    Route, 
    Tags, 
    Path, 
    Put, 
    Patch,
    Delete, 
    Response, 
    Query 
} from 'tsoa';
import { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../models/Ticket';
import { AIChatLog } from '../models/AIChatLog';
import { ticketDatabaseService } from '../services/TicketDatabaseService';
import { AIChatLogService } from '../services/AIChatLogService';
import { NotFoundError } from '../errors/HttpError';

// Extended ticket interface to include AI chat logs
export interface TicketWithChatLogs extends Ticket {
    ai_chat_logs?: AIChatLog[];
}

@Route('technicians')
@Tags('Technicians')
export class TechnicianController extends Controller {
    private aiChatLogService: AIChatLogService;

    constructor() {
        super();
        this.aiChatLogService = new AIChatLogService();
    }

    /**
     * Get all tickets assigned to a technician
     */
    @Get('{technicianId}/tickets')
    public async getTechnicianTickets(
        @Path() technicianId: number,
        @Query() status?: 'assigned' | 'in_progress' | 'completed' | 'cancelled'
    ): Promise<Ticket[]> {
        return await ticketDatabaseService.getTechnicianTickets(technicianId, status);
    }

    /**
     * Get a specific ticket by ID (must belong to technician) with AI chat logs
     */
    @Get('{technicianId}/tickets/{ticketId}')
    @Response(404, 'Ticket not found')
    public async getTicket(
        @Path() technicianId: number,
        @Path() ticketId: number
    ): Promise<TicketWithChatLogs> {
        const ticket = await ticketDatabaseService.getTicketById(ticketId);
        if (!ticket) {
            throw new NotFoundError('Ticket not found');
        }

        // Verify the ticket is assigned to this technician
        if (ticket.assigned_technician_id !== technicianId) {
            throw new NotFoundError('Ticket not found');
        }

        // Fetch AI chat logs for this ticket
        try {
            await this.aiChatLogService.connect();
            const chatLogs = await this.aiChatLogService.getChatLogsByTicketId(ticketId);
            await this.aiChatLogService.disconnect();
            
            return {
                ...ticket,
                ai_chat_logs: chatLogs
            };
        } catch (error) {
            console.error('Error fetching AI chat logs:', error);
            // Return ticket without chat logs if there's an error
            return ticket;
        }
    }

    /**
     * Update ticket status
     */
    @Patch('{technicianId}/tickets/{ticketId}/status')
    @Response(404, 'Ticket not found')
    public async updateTicketStatus(
        @Path() technicianId: number,
        @Path() ticketId: number,
        @Body() requestBody: { status: 'assigned' | 'in_progress' | 'completed' | 'cancelled' }
    ): Promise<{ message: string }> {
        const updatedTicket = await ticketDatabaseService.updateTicketStatus(
            ticketId, 
            requestBody.status, 
            technicianId
        );
        
        if (!updatedTicket) {
            throw new NotFoundError('Ticket not found or not assigned to this technician');
        }

        return { message: `Ticket status updated to ${requestBody.status}` };
    }
}

@Route('tickets')
@Tags('Tickets')
export class TicketController extends Controller {
    private aiChatLogService: AIChatLogService;

    constructor() {
        super();
        this.aiChatLogService = new AIChatLogService();
    }

    /**
     * Get all tickets
     */
    @Get()
    public async getAllTickets(
        @Query() status?: string,
        @Query() technicianId?: number,
        @Query() priority?: string
    ): Promise<Ticket[]> {
        return await ticketDatabaseService.getAllTickets(status, technicianId, priority);
    }

    /**
     * Get a specific ticket by ID with AI chat logs
     */
    @Get('{id}')
    @Response(404, 'Ticket not found')
    public async getTicket(@Path() id: number): Promise<TicketWithChatLogs> {
        const ticket = await ticketDatabaseService.getTicketById(id);
        if (!ticket) {
            throw new NotFoundError('Ticket not found');
        }

        // Fetch AI chat logs for this ticket
        try {
            await this.aiChatLogService.connect();
            const chatLogs = await this.aiChatLogService.getChatLogsByTicketId(id);
            await this.aiChatLogService.disconnect();
            
            return {
                ...ticket,
                ai_chat_logs: chatLogs
            };
        } catch (error) {
            console.error('Error fetching AI chat logs:', error);
            // Return ticket without chat logs if there's an error
            return ticket;
        }
    }

    /**
     * Create a new ticket
     */
    @Post()
    public async createTicket(@Body() requestBody: CreateTicketRequest): Promise<Ticket> {
        const ticket = await ticketDatabaseService.createTicket(requestBody);
        this.setStatus(201);
        return ticket;
    }

    /**
     * Update a ticket
     */
    @Put('{id}')
    @Response(404, 'Ticket not found')
    public async updateTicket(
        @Path() id: number, 
        @Body() requestBody: UpdateTicketRequest
    ): Promise<Ticket> {
        const ticket = await ticketDatabaseService.updateTicket(id, requestBody);
        if (!ticket) {
            throw new NotFoundError('Ticket not found');
        }
        return ticket;
    }

    /**
     * Delete a ticket
     */
    @Delete('{id}')
    @Response(404, 'Ticket not found')
    public async deleteTicket(@Path() id: number): Promise<{ message: string }> {
        const deleted = await ticketDatabaseService.deleteTicket(id);
        if (!deleted) {
            throw new NotFoundError('Ticket not found');
        }
        return { message: 'Ticket deleted successfully' };
    }
}