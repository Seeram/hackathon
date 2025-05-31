// AI Chat Log models

export interface AIChatLog {
    id: number;
    ticket_id: number;
    message_type: 'chat' | 'voice' | 'suggestion';
    user_message: string;
    ai_response: string;
    voice_transcription?: string;
    session_id?: string;
    created_at: Date;
}

export interface CreateAIChatLogRequest {
    ticket_id: number;
    message_type: 'chat' | 'voice' | 'suggestion';
    user_message: string;
    ai_response: string;
    voice_transcription?: string;
    session_id?: string;
}

export interface CreateChatLogRequestBody {
    message_type: 'chat' | 'voice' | 'suggestion';
    user_message: string;
    ai_response: string;
    voice_transcription?: string;
    session_id?: string;
}

export interface AIChatLogQueryParams {
    ticket_id?: number;
    message_type?: 'chat' | 'voice' | 'suggestion';
    session_id?: string;
    limit?: number;
    offset?: number;
}
