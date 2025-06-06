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
    confidence?: number;
    sources?: string[];
    processingTime?: number;
    fileInfo?: any;
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

            // Mock response from agents service
            const agentsServiceResponse = this.getMockedAgentsServiceResponse(audioFile, ticketId);
            const simulatedTranscription = agentsServiceResponse.transcription;
            const aiResponse = agentsServiceResponse.response;

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
                message: agentsServiceResponse.response,
                transcription: simulatedTranscription,
                processedText: agentsServiceResponse.response,
                confidence: agentsServiceResponse.confidence,
                sources: agentsServiceResponse.sources,
                processingTime: agentsServiceResponse.processingTime,
                fileInfo: agentsServiceResponse.fileInfo
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
     * Generate random page number for PDF references
     */
    private getRandomPage(): number {
        // Assuming the PDF has approximately 300 pages
        return Math.floor(Math.random() * 300) + 1;
    }

    /**
     * Add additional random PDF references to a response
     */
    private addAdditionalPDFReferences(): string {
        const additionalRefs = [
            `\n📄 **Additional References:**\n[Quick Reference Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Essential Information`,
            `\n📖 **See Also:**\n[Technical Appendix](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Detailed Specifications`,
            `\n🔧 **Related Information:**\n[Best Practices Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Professional Tips`,
            `\n⚡ **Quick Access:**\n[Emergency Procedures](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Critical Information`,
            `\n📋 **Cross-Reference:**\n[Index and Glossary](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Terms and Definitions`,
            `` // Sometimes no additional reference
        ];
        
        return additionalRefs[Math.floor(Math.random() * additionalRefs.length)];
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
                    `For the issue you've described ("${userText}"), I recommend starting with basic diagnostics. First, check power connections and status indicators.\n\n📋 **Reference Documentation:**\n[Equipment Diagnostics Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 3.1: Initial Diagnostic Procedures`,
                    `Based on "${userText}", this appears to be a common troubleshooting scenario. Let me guide you through the standard diagnostic procedure.\n\n📋 **Reference Documentation:**\n[Troubleshooting Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 4: Common Issues Resolution`,
                    `I understand you're experiencing "${userText}". Let's begin with systematic troubleshooting to identify the root cause.\n\n📋 **Reference Documentation:**\n[System Diagnostic Procedures](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 7.2: Root Cause Analysis`
                ]
            },
            {
                pattern: /repair|fix|replace|maintenance/i,
                responses: [
                    `For the repair you mentioned ("${userText}"), I'll provide step-by-step guidance. Please ensure you have proper safety equipment before proceeding.\n\n📋 **Reference Documentation:**\n[Repair Procedures Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 8.3: Component Replacement Guidelines`,
                    `Regarding the repair of "${userText}", here's the recommended procedure from our technical documentation.\n\n📋 **Reference Documentation:**\n[Technical Service Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 12: Maintenance Procedures`,
                    `The repair process for "${userText}" typically involves several steps. Let me walk you through the proper sequence.\n\n📋 **Reference Documentation:**\n[Step-by-Step Repair Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 10.1: Sequential Repair Process`
                ]
            },
            {
                pattern: /parts|component|spare|inventory/i,
                responses: [
                    `For the parts inquiry about "${userText}", I can help you identify the correct components and part numbers.\n\n📋 **Reference Documentation:**\n[Parts Catalog](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 15.2: Component Specifications and Part Numbers`,
                    `Regarding parts for "${userText}", let me check our inventory database for availability and specifications.\n\n📋 **Reference Documentation:**\n[Inventory Management Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 6: Parts Availability and Ordering`,
                    `The components you mentioned in "${userText}" are available. Here are the part details and ordering information.\n\n📋 **Reference Documentation:**\n[Component Specifications](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 11.4: Detailed Part Information`
                ]
            },
            {
                pattern: /safety|precaution|warning|hazard/i,
                responses: [
                    `Safety is paramount when dealing with "${userText}". Please review all safety protocols before proceeding.\n\n📋 **Reference Documentation:**\n[Safety Procedures Handbook](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 2: Equipment Safety Protocols`,
                    `For the safety concern about "${userText}", here are the essential precautions and protective measures.\n\n📋 **Reference Documentation:**\n[Workplace Safety Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 4.1: Hazard Prevention and PPE Requirements`,
                    `Regarding the safety aspects of "${userText}", always follow lockout/tagout procedures and wear appropriate PPE.\n\n📋 **Reference Documentation:**\n[LOTO Procedures Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 1.3: Lockout/Tagout Implementation`
                ]
            },
            {
                pattern: /manual|documentation|guide|instruction/i,
                responses: [
                    `I can provide detailed documentation for "${userText}". Let me reference the latest technical manuals.\n\n📋 **Reference Documentation:**\n[Technical Documentation Index](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 1.1: Manual Reference Guide`,
                    `For the procedure you asked about ("${userText}"), here's the step-by-step guide from our documentation.\n\n📋 **Reference Documentation:**\n[Operating Procedures Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 8: Standard Operating Procedures`,
                    `The manual for "${userText}" contains specific instructions. I'll extract the relevant sections for you.\n\n📋 **Reference Documentation:**\n[Equipment Manual Library](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 13.2: Equipment-Specific Instructions`
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
            // Default responses with PDF references
            const defaultResponses = [
                `I understand you're asking about: "${userText}". Let me help you with that.\n\n📋 **Reference Documentation:**\n[General Maintenance Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Introduction to Equipment Maintenance`,
                `Based on your question about "${userText}", here are some recommendations...\n\n📋 **Reference Documentation:**\n[Technical Reference Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 2.5: General Technical Guidelines`,
                `Regarding "${userText}" - I can provide technical guidance and assistance.\n\n📋 **Reference Documentation:**\n[Technical Support Handbook](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 1: Getting Started with Technical Support`,
                `Thank you for your question about "${userText}". Here's what I can help you with...\n\n📋 **Reference Documentation:**\n[User Support Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 1.4: Common Questions and Answers`
            ];
            baseResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        // Add additional random PDF references sometimes
        const additionalRefs = this.addAdditionalPDFReferences();
        
        if (ticketId) {
            return `${baseResponse}${additionalRefs}\n\nThis guidance is specifically for ticket #${ticketId}. I can provide more detailed, context-specific assistance based on the ticket information.`;
        }
        
        return `${baseResponse}${additionalRefs}`;
    }

    /**
     * Mock agents service response
     * Simulates the response from the agents service with realistic data
     */
    private getMockedAgentsServiceResponse(audioFile: Express.Multer.File, ticketId?: string): {
        transcription: string;
        response: string;
        confidence: number;
        sources: string[];
        processingTime: number;
        fileInfo: any;
    } {
        // Mock transcription based on file characteristics
        const mockTranscriptions = [
            "Check the pressure readings on the main valve",
            "The motor is making unusual noise during startup", 
            "Replace the filter element and reset the system",
            "What's the proper torque specification for this bolt",
            "System shows error code E-204, need troubleshooting steps",
            "How do I perform the monthly maintenance checklist",
            "The equipment is overheating, need immediate assistance",
            "Where can I find the wiring diagram for this component",
            "I need help with the hydraulic pump troubleshooting",
            "The conveyor belt is slipping and needs adjustment"
        ];

        // Mock AI responses based on transcription patterns
        const mockResponses = {
            "pressure": `Based on your pressure-related inquiry, here's a comprehensive diagnostic approach:

**1. Initial Assessment**
- Document current pressure readings and compare to specifications
- Check system status indicators and pressure gauges
- Verify operational parameters are within normal ranges

**2. Systematic Diagnosis**
- Inspect pressure relief valves and check valve settings
- Test pressure sensors and instrumentation accuracy
- Examine pump performance and flow characteristics

**3. Safety Considerations**
- Follow lockout/tagout procedures before any pressure system work
- Use proper PPE including safety glasses and protective clothing
- Ensure system is properly depressurized before maintenance

**4. Resolution Strategy**
- Calibrate pressure instruments if readings are inconsistent
- Replace faulty pressure relief valves or regulators as needed
- Document all findings and corrective actions taken

📋 **Reference Documentation:**
[Pressure Systems Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 5: Pressure Diagnostics and Safety`,

            "motor": `For motor-related noise and startup issues, follow this diagnostic protocol:

**1. Immediate Safety Check**
- Ensure motor is properly grounded and electrical connections are secure
- Verify lockout/tagout procedures are followed
- Check for any obvious signs of overheating or damage

**2. Acoustic Analysis**
- Document the type of noise (grinding, squealing, knocking, etc.)
- Note when noise occurs (startup, steady state, shutdown)
- Use vibration analysis tools if available

**3. Electrical Diagnostics**
- Check motor current draw and compare to nameplate values
- Verify voltage balance across all phases
- Test insulation resistance and winding continuity

**4. Mechanical Inspection**
- Examine bearing condition and lubrication
- Check coupling alignment and belt tension
- Inspect motor mount and foundation integrity

📋 **Reference Documentation:**
[Motor Diagnostics Guide](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Section 6.3: Motor Troubleshooting Procedures`,

            "filter": `Filter replacement and system reset procedure:

**1. Pre-Replacement Steps**
- Identify correct filter type and part number
- Gather required tools and safety equipment
- Review system operating parameters before shutdown

**2. Safe Shutdown Procedure**
- Follow proper equipment shutdown sequence
- Allow system to reach safe operating conditions
- Implement lockout/tagout procedures

**3. Filter Replacement**
- Document old filter condition with photos
- Install new filter with proper orientation
- Ensure all seals and gaskets are properly seated

**4. System Reset and Startup**
- Remove all lockout/tagout devices
- Follow proper startup sequence
- Monitor system parameters during initial operation
- Document completion and any observations

📋 **Reference Documentation:**
[Filter Maintenance Manual](/pdfs/manual.pdf#page=${this.getRandomPage()}) - Chapter 9: Filter Replacement Procedures`
        };

        const transcriptionIndex = audioFile.size % mockTranscriptions.length;
        const transcription = mockTranscriptions[transcriptionIndex];
        
        // Determine response based on transcription content
        let response = "I understand your maintenance request. Here's a comprehensive technical guidance:";
        
        if (transcription.toLowerCase().includes('pressure')) {
            response = mockResponses.pressure;
        } else if (transcription.toLowerCase().includes('motor') || transcription.toLowerCase().includes('noise')) {
            response = mockResponses.motor;
        } else if (transcription.toLowerCase().includes('filter') || transcription.toLowerCase().includes('replace')) {
            response = mockResponses.filter;
        } else {
            // Default technical response
            response = `Technical Analysis for: "${transcription}"

**1. Safety First**
- Follow all applicable safety procedures and standards
- Use proper personal protective equipment (PPE)
- Ensure proper lockout/tagout procedures are implemented

**2. Diagnostic Approach**
- Document current system conditions and symptoms
- Review equipment documentation and service history
- Follow systematic troubleshooting procedures

**3. Technical Considerations**
- Check all safety interlocks and protective devices
- Verify proper operation of monitoring systems
- Test system performance against specifications

**4. Implementation**
- Follow manufacturer's recommended procedures
- Use proper tools and calibrated instruments
- Document all work performed and findings

**5. Verification**
- Conduct proper testing after completion
- Verify system operates within normal parameters
- Update maintenance records and documentation`;
        }

        // Mock file processing info
        const fileInfo = {
            filename: audioFile.originalname,
            size_bytes: audioFile.size,
            mimetype: audioFile.mimetype,
            processed_at: new Date().toISOString(),
            duration_estimate: Math.floor(audioFile.size / 16000) // Rough estimate for audio duration
        };

        // Mock sources and confidence
        const mockSources = [
            "Equipment Technical Manual - Section 4.2",
            "Safety Procedures Handbook - Chapter 7",
            "Maintenance Best Practices Guide",
            "Manufacturer Service Bulletin #2024-15"
        ];

        const confidence = 0.89 + (audioFile.size % 10) / 100; // Mock confidence between 0.89-0.98

        console.log('🤖 Mocked Agents Service Response:', {
            transcription: transcription.substring(0, 50) + '...',
            confidence,
            ticketId: ticketId || 'none',
            processingTime: '~2.3s',
            sources: mockSources.length
        });

        // Add random PDF references to voice responses
        const additionalRefs = this.addAdditionalPDFReferences();
        const enhancedResponse = `${response}${additionalRefs}\n\n${ticketId ? `**For Ticket #${ticketId}**: ` : ''}This guidance is based on industry best practices and equipment manufacturer recommendations.`;

        return {
            transcription,
            response: enhancedResponse,
            confidence,
            sources: mockSources,
            processingTime: 2.3,
            fileInfo
        };
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
