import { 
    Controller, 
    Get, 
    Delete, 
    Route, 
    Tags, 
    Path, 
    Response 
} from 'tsoa';
import { AIChatLog } from '../models/AIChatLog';
import { AIChatLogService } from '../services/AIChatLogService';
import { NotFoundError } from '../errors/HttpError';

@Route('chat-logs')
@Tags('Chat Logs')
export class ChatLogController extends Controller {
    private aiChatLogService: AIChatLogService;

    constructor() {
        super();
        this.aiChatLogService = new AIChatLogService();
    }

    /**
     * Get a specific chat log by ID
     */
    @Get('{chatLogId}')
    @Response(404, 'Chat log not found')
    public async getChatLog(@Path() chatLogId: number): Promise<AIChatLog> {
        try {
            await this.aiChatLogService.connect();
            const chatLog = await this.aiChatLogService.getChatLogById(chatLogId);
            await this.aiChatLogService.disconnect();
            
            if (!chatLog) {
                throw new NotFoundError('Chat log not found');
            }
            
            return chatLog;
        } catch (error) {
            console.error('Error fetching chat log:', error);
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error('Failed to fetch chat log');
        }
    }

    /**
     * Delete a specific chat log by ID
     */
    @Delete('{chatLogId}')
    @Response(404, 'Chat log not found')
    public async deleteChatLog(@Path() chatLogId: number): Promise<{ message: string }> {
        try {
            await this.aiChatLogService.connect();
            const deleted = await this.aiChatLogService.deleteChatLogById(chatLogId);
            await this.aiChatLogService.disconnect();
            
            if (!deleted) {
                throw new NotFoundError('Chat log not found');
            }
            
            return { message: 'Chat log deleted successfully' };
        } catch (error) {
            console.error('Error deleting chat log:', error);
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error('Failed to delete chat log');
        }
    }
}
