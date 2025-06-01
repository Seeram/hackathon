import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ApiClient, ChatRequest, ChatResponse, VoiceRecordingResponse, ProcessVoiceRecordingPayload } from '../api';
import './AIAssistantChat.css';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

interface AIAssistantChatProps {
  ticketId?: number;
  onMessageSent?: (message: string) => void;
  onSuggestTicket?: (suggestion: any) => void;
  placeholder?: string;
  height?: string;
  className?: string;
  welcomeMessage?: string;
}

// Configure API client
const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
};

const apiClient = new ApiClient({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
});

// Utility function to parse and render PDF references
const renderMessageWithPDFLinks = (content: string) => {
  // Regular expression to match markdown-style links with PDF anchors
  const pdfLinkRegex = /\[([^\]]+)\]\(([^)]+\.pdf(?:#page=\d+)?)\)/g;
  
  // Split content by lines first to preserve line breaks
  const lines = content.split('\n');
  
  return lines.map((line, lineIndex) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    
    // Reset regex for each line
    pdfLinkRegex.lastIndex = 0;

    while ((match = pdfLinkRegex.exec(line)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      
      // Add the clickable PDF link
      const linkText = match[1];
      const pdfPath = match[2];
      const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Open PDF in new tab with page anchor
        window.open(pdfPath, '_blank');
      };
      
      parts.push(
        <a
          key={`${lineIndex}-${match.index}`}
          href={pdfPath}
          onClick={onClick}
          className="pdf-reference-link"
          title={`Open ${linkText} in new tab`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📄 {linkText}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }
    
    return (
      <div key={lineIndex}>
        {parts.length > 1 ? parts : line}
        {lineIndex < lines.length - 1 && <br />}
      </div>
    );
  });
};

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  ticketId,
  onMessageSent,
  onSuggestTicket,
  placeholder = "Type your message or use voice recording...",
  height = "700px",
  className = "",
  welcomeMessage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((type: 'user' | 'assistant', content: string, isVoice: boolean = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toISOString(),
      isVoice
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendTextMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage('user', userMessage);
    setIsLoading(true);

    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent(userMessage);
    }

    try {
      const chatRequest: ChatRequest = {
        message: userMessage,
        ticketId: ticketId,
        isVoiceMessage: false,
      };

      const response: ChatResponse = await apiClient.tickets.sendChatMessage(chatRequest);
      addMessage('assistant', response.message?.text || 'Message received successfully.');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processVoiceRecording = useCallback(async () => {
    if (audioChunks.length === 0) return;

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioFile = new File([audioBlob], 'voice-recording.wav', {
      type: 'audio/wav',
      lastModified: Date.now(),
    });
    
    addMessage('user', '[Voice message]', true);
    setIsLoading(true);

    try {
      const payload: ProcessVoiceRecordingPayload = {
        audio: audioFile,
        ticketId: ticketId?.toString(),
      };

      const response: VoiceRecordingResponse = await apiClient.tickets.processVoiceRecording(payload);
      
      // Log additional data from mocked agents service
      console.log('🤖 Agents Service Response Data:', {
        transcription: response.transcription,
        confidence: response.confidence,
        sources: response.sources,
        processingTime: response.processingTime,
        fileInfo: response.fileInfo,
        success: response.success
      });
      
      // Add transcription as user message if available
      if (response.transcription) {
        // Replace the placeholder voice message with the actual transcription
        setMessages(prev => 
          prev.map(msg => 
            msg.content === '[Voice message]' && msg.type === 'user' 
              ? { ...msg, content: response.transcription! }
              : msg
          )
        );
      }

      // Create enhanced assistant response with agents service data
      let assistantMessage = response.message || 'Voice message processed successfully.';
      
      // Add confidence and processing info if available
      if (response.confidence && response.processingTime) {
        assistantMessage += `\n\n📊 **Processing Details:**
- Confidence: ${Math.round(response.confidence * 100)}%
- Processing Time: ${response.processingTime}s`;
      }
      
      // Add sources if available
      if (response.sources && response.sources.length > 0) {
        assistantMessage += `\n\n📚 **Referenced Sources:**`;
        response.sources.forEach((source: string, index: number) => {
          assistantMessage += `\n${index + 1}. ${source}`;
        });
      }

      // Add assistant response with enhanced data
      addMessage('assistant', assistantMessage);
    } catch (error) {
      console.error('Error processing voice message:', error);
      addMessage('assistant', 'Sorry, I had trouble processing your voice message. Please try again.');
    } finally {
      setIsLoading(false);
      setAudioChunks([]);
    }
  }, [audioChunks, addMessage, setIsLoading, ticketId, setMessages, setAudioChunks]);

  useEffect(() => {
    if (!isRecording && audioChunks.length > 0) {
      processVoiceRecording();
    }
  }, [isRecording, audioChunks, processVoiceRecording]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div className={`ai-assistant-chat ${className}`} style={{ height }}>
      <div className="ai-chat-header">
        <h3>AI Assistant</h3>
        <button 
          className="ai-chat-clear-btn"
          onClick={() => setMessages([])}
          title="Clear chat history"
        >
          Clear
        </button>
      </div>
      
      <div className="ai-chat-messages" ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className="ai-chat-welcome">
            {welcomeMessage ? (
              <div dangerouslySetInnerHTML={{ __html: welcomeMessage }} />
            ) : (
              <>
                <p>👋 Hi! I'm your AI maintenance assistant. I can help you with:</p>
                <ul>
                  <li>Diagnosing equipment problems</li>
                  <li>Suggesting repair procedures</li>
                  <li>Creating maintenance tickets</li>
                  <li>Safety guidelines and protocols</li>
                </ul>
                <p>You can type your question or use voice recording!</p>
              </>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`ai-chat-message ${message.type}`}>
            <div className="ai-message-content">
              <div className="message-text">
                {renderMessageWithPDFLinks(message.content)}
              </div>
              {message.isVoice && <span className="voice-message-indicator">🎤</span>}
            </div>
            <div className="ai-message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="ai-chat-message assistant">
            <div className="ai-message-content">
              <div className="ai-typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="ai-chat-input-form">
        <div className="ai-chat-input-container">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`ai-chat-voice-button ${isRecording ? 'listening' : ''}`}
            disabled={isLoading}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            {isRecording ? '🛑' : '🎤'}
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="ai-chat-input"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            onClick={sendTextMessage}
            disabled={!inputText.trim() || isLoading}
            className="ai-chat-send-button"
          >
            Send
          </button>
        </div>
        
        {isRecording && (
          <div className="voice-status">
            <div className="voice-status-text">
              🎤 Recording in progress...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantChat;
