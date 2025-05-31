import React from 'react';
import AIAssistantChat from './AIAssistantChat';

/**
 * Example component showing different ways to use the AIAssistantChat component
 */
const AIAssistantChatExample: React.FC = () => {
  const handleMessageSent = (message: string) => {
    console.log('Message sent to AI:', message);
    // You can integrate with your AI service here
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>AI Assistant Chat Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Example 1: Basic usage with ticket context */}
        <div>
          <h2>Example 1: With Ticket Context</h2>
          <AIAssistantChat 
            ticketId={12345}
            onMessageSent={handleMessageSent}
            placeholder="Ask about this specific ticket..."
          />
        </div>

        {/* Example 2: Compact version */}
        <div>
          <h2>Example 2: Compact Version</h2>
          <AIAssistantChat 
            className="compact"
            height="400px"
            onMessageSent={handleMessageSent}
            placeholder="Quick help..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>🔧 Quick Help Assistant</p>
                <p>Ask me about:</p>
                <ul>
                  <li>Common troubleshooting steps</li>
                  <li>Equipment manuals</li>
                  <li>Safety procedures</li>
                </ul>
              </div>
            `}
          />
        </div>

        {/* Example 3: General support chat */}
        <div>
          <h2>Example 3: General Support</h2>
          <AIAssistantChat 
            height="500px"
            onMessageSent={handleMessageSent}
            placeholder="How can I help you today?"
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>👨‍🔧 Technical Support Assistant</p>
                <p>I'm here to help with general technical questions and support.</p>
                <p>What would you like to know?</p>
              </div>
            `}
          />
        </div>

        {/* Example 4: Equipment-specific chat */}
        <div>
          <h2>Example 4: Equipment Specific</h2>
          <AIAssistantChat 
            height="500px"
            onMessageSent={handleMessageSent}
            placeholder="Ask about HVAC systems..."
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
              </div>
            `}
          />
        </div>
      </div>

      {/* Full-width example */}
      <div style={{ marginTop: '40px' }}>
        <h2>Example 5: Full-Width Chat Interface</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AIAssistantChat 
            height="600px"
            onMessageSent={handleMessageSent}
            placeholder="Ask me anything about repair procedures, troubleshooting, or technical guidance..."
            welcomeMessage={`
              <div class="ai-chat-welcome">
                <p>🚀 Advanced Technical Assistant</p>
                <p>I'm your comprehensive technical support assistant with access to:</p>
                <ul>
                  <li>📚 Complete repair manuals and documentation</li>
                  <li>🔍 Diagnostic procedures and flowcharts</li>
                  <li>🛠️ Parts catalogs and specifications</li>
                  <li>⚡ Real-time troubleshooting guidance</li>
                  <li>📋 Maintenance schedules and procedures</li>
                  <li>⚠️ Safety protocols and guidelines</li>
                </ul>
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
