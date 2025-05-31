import React from 'react';
import AIAssistantChat from './AIAssistantChat';

/**
 * Example component showing different ways to use the AIAssistantChat component
 * Updated to showcase voice recording functionality
 */
const AIAssistantChatExample: React.FC = () => {
  const handleMessageSent = (message: string) => {
    console.log('Message sent to AI:', message);
    // You can integrate with your AI service here
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>AI Assistant Chat Examples</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        🎤 <strong>Voice Recording:</strong> Click the microphone button to use voice input (supported browsers only)
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Example 1: Basic usage with ticket context and voice support */}
        <div>
          <h2>Example 1: With Ticket Context & Voice</h2>
          <AIAssistantChat 
            ticketId={12345}
            onMessageSent={handleMessageSent}
            placeholder="Type or speak about this ticket..."
          />
        </div>

        {/* Example 2: Compact version with voice support */}
        <div>
          <h2>Example 2: Compact Version with Voice</h2>
          <AIAssistantChat 
            className="compact"
            height="400px"
            onMessageSent={handleMessageSent}
            placeholder="Quick help (voice enabled)..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>🔧 Quick Help Assistant</p>
                <p>Ask me about:</p>
                <ul>
                  <li>Common troubleshooting steps</li>
                  <li>Equipment manuals</li>
                  <li>Safety procedures</li>
                </ul>
                <p><small>💡 Tip: Use the microphone for voice input!</small></p>
              </div>
            `}
          />
        </div>

        {/* Example 3: General support chat with voice */}
        <div>
          <h2>Example 3: General Support with Voice</h2>
          <AIAssistantChat 
            height="500px"
            onMessageSent={handleMessageSent}
            placeholder="Type or speak your question..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>👨‍🔧 Technical Support Assistant</p>
                <p>I'm here to help with general technical questions and support.</p>
                <p>🎤 You can type or use voice input for faster communication!</p>
              </div>
            `}
          />
        </div>

        {/* Example 4: Equipment-specific chat with voice */}
        <div>
          <h2>Example 4: Equipment Specific + Voice</h2>
          <AIAssistantChat 
            height="500px"
            onMessageSent={handleMessageSent}
            placeholder="Ask about HVAC systems (voice enabled)..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>❄️ HVAC Specialist Assistant</p>
                <p>Specialized help for:</p>
                <ul>
                  <li>HVAC system diagnostics</li>
                  <li>Refrigerant handling</li>
                  <li>Energy efficiency tips</li>
                  <li>Maintenance schedules</li>
                </ul>
                <p><small>🎤 Voice input available for hands-free operation!</small></p>
              </div>
            `}
          />
        </div>
      </div>

      {/* Full-width example with voice recording showcase */}
      <div style={{ marginTop: '40px' }}>
        <h2>Example 5: Full-Width Chat Interface with Voice Recording</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AIAssistantChat 
            height="600px"
            onMessageSent={handleMessageSent}
            placeholder="Type or speak about repair procedures, troubleshooting, or technical guidance..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>🚀 Advanced Technical Assistant with Voice Support</p>
                <p>I'm your comprehensive technical support assistant with access to:</p>
                <ul>
                  <li>📚 Complete repair manuals and documentation</li>
                  <li>🔍 Diagnostic procedures and flowcharts</li>
                  <li>🛠️ Parts catalogs and specifications</li>
                  <li>⚡ Real-time troubleshooting guidance</li>
                  <li>📋 Maintenance schedules and procedures</li>
                  <li>⚠️ Safety protocols and guidelines</li>
                </ul>
                <p><strong>💡 Pro tip:</strong> Use the microphone button for hands-free communication while working!</p>
                <p><strong>Ask me anything to get started!</strong></p>
              </div>
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantChatExample;
