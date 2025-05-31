import React from 'react';

/**
 * Component that demonstrates the voice recording data structure
 * This shows what gets logged to the console when using voice recording
 */
const VoiceRecordingDataDemo: React.FC = () => {
  const exampleVoiceData = {
    startEvent: {
      timestamp: "2025-05-31T12:34:56.789Z",
      language: "en-US",
      continuous: false,
      interimResults: false,
      maxAlternatives: 1,
      serviceURI: "default",
      grammars: 0
    },
    resultEvent: {
      transcript: "Check the HVAC system pressure",
      confidence: 0.9234567,
      isFinal: true,
      resultIndex: 0,
      timestamp: "2025-05-31T12:34:58.123Z",
      event: {
        results: [
          {
            index: 0,
            isFinal: true,
            alternatives: [
              {
                index: 0,
                transcript: "Check the HVAC system pressure",
                confidence: 0.9234567
              }
            ]
          }
        ]
      }
    },
    messageData: {
      messageId: "1717156498123",
      text: "Check the HVAC system pressure",
      isVoiceMessage: true,
      timestamp: "2025-05-31T12:34:58.123Z",
      textLength: 30,
      wordCount: 5,
      messageData: {
        id: "1717156498123",
        text: "Check the HVAC system pressure",
        sender: "user",
        timestamp: "2025-05-31T12:34:58.123Z",
        isVoiceMessage: true
      }
    },
    endEvent: {
      timestamp: "2025-05-31T12:34:58.456Z",
      wasListening: true,
      finalTranscript: "Check the HVAC system pressure"
    },
    errorExample: {
      error: "no-speech",
      message: "No speech was detected",
      timestamp: "2025-05-31T12:35:05.789Z",
      errorDetails: {
        type: "string",
        errorCode: "no-speech",
        possibleCause: "No speech was detected"
      }
    }
  };

  const printVoiceData = () => {
    console.log('🎤 Voice Recording Data Example:');
    console.log('='.repeat(50));
    console.log('1. START EVENT - When voice recording begins:');
    console.log(exampleVoiceData.startEvent);
    console.log('\n2. RESULT EVENT - When speech is transcribed:');
    console.log(exampleVoiceData.resultEvent);
    console.log('\n3. MESSAGE DATA - When voice message is sent:');
    console.log(exampleVoiceData.messageData);
    console.log('\n4. END EVENT - When voice recording ends:');
    console.log(exampleVoiceData.endEvent);
    console.log('\n5. ERROR EVENT - When an error occurs:');
    console.log(exampleVoiceData.errorExample);
    console.log('='.repeat(50));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px' }}>
      <h2>🎤 Voice Recording Data Structure</h2>
      <p>This component demonstrates the data structure that gets logged when using voice recording:</p>
      
      <button 
        onClick={printVoiceData}
        style={{
          backgroundColor: '#007ACC',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Print Voice Data to Console
      </button>

      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' }}>
        <h3>Data Structure Overview:</h3>
        <ul>
          <li><strong>Start Event:</strong> Logged when voice recording begins</li>
          <li><strong>Result Event:</strong> Logged when speech is successfully transcribed</li>
          <li><strong>Message Data:</strong> Logged when a voice message is sent to the chat</li>
          <li><strong>End Event:</strong> Logged when voice recording ends</li>
          <li><strong>Error Event:</strong> Logged when voice recording encounters an error</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '5px', border: '1px solid #007ACC', marginTop: '20px' }}>
        <h3>Example Voice Data:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '3px' }}>
          {JSON.stringify(exampleVoiceData, null, 2)}
        </pre>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', border: '1px solid #ffc107', marginTop: '20px' }}>
        <h4>🔍 How to View Voice Data:</h4>
        <ol>
          <li>Open your browser's Developer Tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Use the voice recording feature in the AI Assistant Chat</li>
          <li>Watch the console for voice recording data logs</li>
          <li>Or click the button above to see example data</li>
        </ol>
      </div>
    </div>
  );
};

export default VoiceRecordingDataDemo;
