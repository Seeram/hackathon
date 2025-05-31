import React, { useState, useEffect, useRef } from 'react';
import './AIAssistantChat.css';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'llm';
  timestamp: Date;
  isVoiceMessage?: boolean;
}

interface AIAssistantChatProps {
  ticketId?: number;
  className?: string;
  height?: string;
  onMessageSent?: (message: string) => void;
  welcomeMessage?: string;
  placeholder?: string;
}

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  ticketId,
  className = '',
  height = '700px',
  onMessageSent,
  welcomeMessage,
  placeholder = 'Ask the AI assistant about this ticket...'
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [lastMessageWasVoice, setLastMessageWasVoice] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setLastMessageWasVoice(true);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      isVoiceMessage: lastMessageWasVoice,
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLastMessageWasVoice(false);
    setChatLoading(true);

    // Call the optional callback
    if (onMessageSent) {
      onMessageSent(userMessage.text);
    }

    try {
      // TODO: Replace with actual API call to your AI service
      // For now, using a simulated response
      setTimeout(() => {
        const llmResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(userMessage.text, ticketId),
          sender: 'llm',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, llmResponse]);
        setChatLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'llm',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setChatLoading(false);
    }
  };

  const generateAIResponse = (userText: string, ticketId?: number): string => {
    // This is a placeholder function. Replace with actual AI service integration
    const responses = [
      `I understand you're asking about: "${userText}". Let me help you with that.`,
      `Based on your question about "${userText}", here are some recommendations...`,
      `For the issue you've described ("${userText}"), I suggest the following troubleshooting steps...`,
      `Regarding "${userText}" - this is a common issue. Here's what I recommend...`,
    ];
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (ticketId) {
      return `${baseResponse} This is for ticket #${ticketId}. I can provide specific guidance based on the ticket details.`;
    }
    
    return `${baseResponse} I can help you with troubleshooting, repair procedures, and technical guidance.`;
  };

  const startVoiceRecording = async () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    try {
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setLastMessageWasVoice(false); // Reset voice flag when typing
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const defaultWelcomeMessage = (
    <div className="ai-chat-welcome">
      <p>👋 Hello! I'm your AI assistant. I can help you with:</p>
      <ul>
        <li>Troubleshooting steps for this issue</li>
        <li>Repair procedures and manuals</li>
        <li>Technical guidance and documentation</li>
        <li>Parts information and recommendations</li>
      </ul>
      <p>Ask me anything about this ticket!</p>
    </div>
  );

  return (
    <div className={`ai-assistant-chat ${className}`} style={{ height }}>
      <div className="ai-chat-header">
        <h3>AI Assistant Chat</h3>
        {chatMessages.length > 0 && (
          <button onClick={clearChat} className="ai-chat-clear-btn">
            Clear Chat
          </button>
        )}
      </div>
      
      <div className="ai-chat-container">
        <div className="ai-chat-messages">
          {chatMessages.length === 0 && (
            welcomeMessage ? (
              <div dangerouslySetInnerHTML={{ __html: welcomeMessage }} />
            ) : (
              defaultWelcomeMessage
            )
          )}
          
          {chatMessages.map(message => (
            <div key={message.id} className={`ai-chat-message ${message.sender}`}>
              <div className="ai-message-content">
                <p>
                  {message.isVoiceMessage && message.sender === 'user' && (
                    <span className="voice-message-indicator" title="Voice message">
                      🎤 
                    </span>
                  )}
                  {message.text}
                </p>
                <span className="ai-message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          
          {chatLoading && (
            <div className="ai-chat-message llm">
              <div className="ai-message-content">
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="ai-chat-input-form">
          <div className="ai-chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder={isListening ? "Listening..." : placeholder}
              className="ai-chat-input"
              disabled={chatLoading || isListening}
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`ai-chat-voice-button ${isListening ? 'listening' : ''}`}
                disabled={chatLoading}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <div className="voice-recording-indicator">
                    <span className="pulse-dot"></span>
                    🎤
                  </div>
                ) : (
                  '🎤'
                )}
              </button>
            )}
            <button 
              type="submit" 
              className="ai-chat-send-button"
              disabled={chatLoading || (!newMessage.trim() && !isListening)}
            >
              Send
            </button>
          </div>
          {isListening && (
            <div className="voice-status">
              <span className="voice-status-text">🎤 Listening... Speak now</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIAssistantChat;
