import { 
    Controller, 
    Post, 
    Body, 
    Route, 
    Tags, 
    Path, 
    Response,
    UploadedFile,
    FormField
} from 'tsoa';
import { NotFoundError } from '../errors/HttpError';
import { AIChatLogService } from '../services/AIChatLogService';
import { CreateAIChatLogRequest } from '../models/AIChatLog';

// Types for AI Assistant Chat
interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'llm';
    timestamp: Date;
    isVoiceMessage?: boolean;
}

interface ChatRequest {
    message: string;
    ticketId?: number;
    isVoiceMessage?: boolean;
}

interface ChatResponse {
    message: ChatMessage;
    success: boolean;
}

interface VoiceRecordingResponse {
    success: boolean;
    message: string;
    transcription?: string;
    processedText?: string;
}

@Route('tickets')
@Tags('AI Assistant')
export class AIAssistantController extends Controller {
    private chatLogService: AIChatLogService;

    constructor() {
        super();
        this.chatLogService = new AIChatLogService();
    }

    /**
     * Send a chat message to the AI assistant
     */
    @Post('chat')
    public async sendChatMessage(@Body() requestBody: ChatRequest): Promise<ChatResponse> {
        try {
            // Generate AI response based on user message
            const aiResponse = this.generateAIResponse(requestBody.message, requestBody.ticketId);
            
            const responseMessage: ChatMessage = {
                id: Date.now().toString(),
                text: aiResponse,
                sender: 'llm',
                timestamp: new Date(),
                isVoiceMessage: false
            };

            // Log the chat message if ticket ID is provided
            if (requestBody.ticketId) {
                try {
                    await this.chatLogService.connect();
                    await this.chatLogService.createChatLog({
                        ticket_id: requestBody.ticketId,
                        message_type: requestBody.isVoiceMessage ? 'voice' : 'chat',
                        user_message: requestBody.message,
                        ai_response: aiResponse,
                        session_id: `session_${Date.now()}`
                    });
                    await this.chatLogService.disconnect();
                } catch (logError) {
                    console.error('Error logging chat message:', logError);
                    // Continue execution even if logging fails
                }
            }

            return {
                message: responseMessage,
                success: true
            };
        } catch (error) {
            console.error('Error processing chat message:', error);
            
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                text: 'Sorry, I encountered an error while processing your request. Please try again.',
                sender: 'llm',
                timestamp: new Date(),
                isVoiceMessage: false
            };

            return {
                message: errorMessage,
                success: false
            };
        }
    }

    /**
     * Process voice recording and return transcription/response
     */
    @Post('voice-recording')
    @Response(400, 'Invalid audio file')
    public async processVoiceRecording(
        @UploadedFile('audio') audioFile: Express.Multer.File,
        @FormField('ticketId') ticketId?: string
    ): Promise<VoiceRecordingResponse> {
        try {
            if (!audioFile) {
                this.setStatus(400);
                return {
                    success: false,
                    message: 'No audio file provided'
                };
            }

            console.log('🎤 Processing voice recording:', {
                filename: audioFile.originalname,
                mimetype: audioFile.mimetype,
                size: audioFile.size,
                ticketId: ticketId || 'none'
            });

            // TODO: Implement actual speech-to-text processing
            // For now, return a simulated transcription
            const simulatedTranscription = this.simulateTranscription(audioFile);
            
            // Generate AI response based on transcription
            const aiResponse = this.generateAIResponse(
                simulatedTranscription, 
                ticketId ? parseInt(ticketId) : undefined
            );

            // Log the voice interaction if ticket ID is provided
            if (ticketId) {
                try {
                    await this.chatLogService.connect();
                    await this.chatLogService.createChatLog({
                        ticket_id: parseInt(ticketId),
                        message_type: 'voice',
                        user_message: simulatedTranscription,
                        ai_response: aiResponse,
                        voice_transcription: simulatedTranscription,
                        session_id: `voice_session_${Date.now()}`
                    });
                    await this.chatLogService.disconnect();
                } catch (logError) {
                    console.error('Error logging voice interaction:', logError);
                    // Continue execution even if logging fails
                }
            }

            return {
                success: true,
                message: 'Voice recording processed successfully',
                transcription: simulatedTranscription,
                processedText: aiResponse
            };

        } catch (error) {
            console.error('Error processing voice recording:', error);
            this.setStatus(500);
            return {
                success: false,
                message: 'Failed to process voice recording'
            };
        }
    }

    /**
     * Get AI assistant suggestions for a specific ticket
     */
    @Post('{ticketId}/ai-suggestions')
    @Response(404, 'Ticket not found')
    public async getTicketSuggestions(
        @Path() ticketId: number,
        @Body() requestBody: { context?: string; category?: string }
    ): Promise<{ suggestions: string[]; context: string }> {
        try {
            // TODO: Integrate with actual ticket data
            // For now, generate contextual suggestions
            const suggestions = this.generateTicketSuggestions(ticketId, requestBody.context, requestBody.category);
            
            // Log the suggestion request
            try {
                await this.chatLogService.connect();
                await this.chatLogService.createChatLog({
                    ticket_id: ticketId,
                    message_type: 'suggestion',
                    user_message: `Requested suggestions for context: ${requestBody.context || 'general'}, category: ${requestBody.category || 'general'}`,
                    ai_response: `Generated ${suggestions.length} suggestions: ${suggestions.join('; ')}`,
                    session_id: `suggestions_${Date.now()}`
                });
                await this.chatLogService.disconnect();
            } catch (logError) {
                console.error('Error logging suggestion request:', logError);
                // Continue execution even if logging fails
            }
            
            return {
                suggestions,
                context: `Generated suggestions for ticket #${ticketId}`
            };
        } catch (error) {
            console.error('Error generating ticket suggestions:', error);
            throw new NotFoundError('Could not generate suggestions for this ticket');
        }
    }

    /**
     * Generate AI response based on user input
     */
    private generateAIResponse(userText: string, ticketId?: number): string {
        // Enhanced AI response generation with more realistic responses
        const responses = [
            {
                pattern: /troubleshoot|problem|issue|error|fault/i,
                responses: [
                    `For the issue you've described ("${userText}"), I recommend starting with basic diagnostics. First, check power connections and status indicators.`,
                    `Based on "${userText}", this appears to be a common troubleshooting scenario. Let me guide you through the standard diagnostic procedure.`,
                    `I understand you're experiencing "${userText}". Let's begin with systematic troubleshooting to identify the root cause.`
                ]
            },
            {
                pattern: /repair|fix|replace|maintenance/i,
                responses: [
                    `For the repair you mentioned ("${userText}"), I'll provide step-by-step guidance. Please ensure you have proper safety equipment before proceeding.`,
                    `Regarding the repair of "${userText}", here's the recommended procedure from our technical documentation.`,
                    `The repair process for "${userText}" typically involves several steps. Let me walk you through the proper sequence.`
                ]
            },
            {
                pattern: /parts|component|spare|inventory/i,
                responses: [
                    `For the parts inquiry about "${userText}", I can help you identify the correct components and part numbers.`,
                    `Regarding parts for "${userText}", let me check our inventory database for availability and specifications.`,
                    `The components you mentioned in "${userText}" are available. Here are the part details and ordering information.`
                ]
            },
            {
                pattern: /safety|precaution|warning|hazard/i,
                responses: [
                    `Safety is paramount when dealing with "${userText}". Please review all safety protocols before proceeding.`,
                    `For the safety concern about "${userText}", here are the essential precautions and protective measures.`,
                    `Regarding the safety aspects of "${userText}", always follow lockout/tagout procedures and wear appropriate PPE.`
                ]
            },
            {
                pattern: /manual|documentation|guide|instruction/i,
                responses: [
                    `I can provide detailed documentation for "${userText}". Let me reference the latest technical manuals.`,
                    `For the procedure you asked about ("${userText}"), here's the step-by-step guide from our documentation.`,
                    `The manual for "${userText}" contains specific instructions. I'll extract the relevant sections for you.`
                ]
            }
        ];

        // Find matching pattern
        const matchedResponse = responses.find(r => r.pattern.test(userText));
        let baseResponse: string;

        if (matchedResponse) {
            const randomIndex = Math.floor(Math.random() * matchedResponse.responses.length);
            baseResponse = matchedResponse.responses[randomIndex];
        } else {
            // Default responses
            const defaultResponses = [
                `I understand you're asking about: "${userText}". Let me help you with that.`,
                `Based on your question about "${userText}", here are some recommendations...`,
                `Regarding "${userText}" - I can provide technical guidance and assistance.`,
                `Thank you for your question about "${userText}". Here's what I can help you with...`
            ];
            baseResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        if (ticketId) {
            return `${baseResponse}\n\nThis guidance is specifically for ticket #${ticketId}. I can provide more detailed, context-specific assistance based on the ticket information.`;
        }
        
        return `${baseResponse}\n\nI can help you with troubleshooting, repair procedures, technical documentation, and safety guidance.`;
    }

    /**
     * Simulate speech-to-text transcription
     * TODO: Replace with actual speech-to-text service
     */
    private simulateTranscription(audioFile: Express.Multer.File): string {
        // Simulate different types of technical queries based on file characteristics
        const simulatedTranscriptions = [
            "Check the pressure readings on the main valve",
            "The motor is making unusual noise during startup",
            "Replace the filter element and reset the system",
            "What's the proper torque specification for this bolt",
            "System shows error code E-204, need troubleshooting steps",
            "How do I perform the monthly maintenance checklist",
            "The equipment is overheating, need immediate assistance",
            "Where can I find the wiring diagram for this component"
        ];

        // Use file size as a simple way to vary responses
        const index = audioFile.size % simulatedTranscriptions.length;
        return simulatedTranscriptions[index];
    }

    /**
     * Generate contextual suggestions for a ticket
     */
    private generateTicketSuggestions(ticketId: number, context?: string, category?: string): string[] {
        const baseSuggestions = [
            "What are the initial diagnostic steps?",
            "Show me the safety procedures for this equipment",
            "What tools will I need for this repair?",
            "Where can I find the technical manual?",
            "What are common causes of this issue?",
            "How long should this repair typically take?",
            "What replacement parts might be needed?",
            "Are there any known service bulletins for this model?"
        ];

        // Customize suggestions based on category
        if (category) {
            switch (category.toLowerCase()) {
                case 'electrical':
                    return [
                        "What are the lockout/tagout procedures?",
                        "How do I test voltage safely?",
                        "Where's the electrical schematic?",
                        "What's the proper grounding procedure?",
                        ...baseSuggestions.slice(0, 4)
                    ];
                case 'mechanical':
                    return [
                        "What's the proper torque specification?",
                        "Do I need special alignment tools?",
                        "What's the bearing replacement procedure?",
                        "How do I check for proper lubrication?",
                        ...baseSuggestions.slice(0, 4)
                    ];
                case 'hvac':
                    return [
                        "What's the refrigerant pressure specification?",
                        "How do I check airflow measurements?",
                        "What's the proper evacuation procedure?",
                        "Do I need EPA certification for this repair?",
                        ...baseSuggestions.slice(0, 4)
                    ];
                default:
                    return baseSuggestions;
            }
        }

        return baseSuggestions;
    }
}
