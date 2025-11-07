import React from 'react';
import '../styles/VoiceInput.css';

const VoiceInput = ({ isRecording, onVoiceInput }) => {
  return (
    <button
      className={`voice-btn ${isRecording ? 'recording' : ''}`}
      onClick={onVoiceInput}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      <span className="mic-icon">🎤</span>
      {isRecording && (
        <div className="wave-container">
          <span className="wave" />
          <span className="wave" />
          <span className="wave" />
        </div>
      )}
    </button>
  );
};

export default VoiceInput;
