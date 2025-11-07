import React from 'react';
import '../styles/MessageBubble.css';

const MessageBubble = ({ message, emojiMode }) => {
  const { original, translation, isUserA, isVoice } = message;

  const getRandomEmoji = () => {
    const emojis = ['😊', '✨', '🌟', '💬', '🎵', '💫', '🌈', '⭐'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div
      className={`message-row ${isUserA ? 'user-a' : 'user-b'}`}
      style={{ animation: 'slideIn 0.4s ease' }}
    >
      <div className={`avatar-circle ${isUserA ? 'a' : 'b'}`}>
        {isUserA ? 'A' : 'B'}
      </div>

      <div className={`bubble ${isUserA ? 'a' : 'b'}`}>
        {isVoice && (
          <div className="voice-tag">
            <span>🎤</span>
            <span>Voice message</span>
          </div>
        )}

        <div className="original-text">
          {original}
          {emojiMode && <span className="emoji-inline"> {getRandomEmoji()}</span>}
        </div>

        {translation && (
          <div className="translation-text">
            {translation}
            {emojiMode && <span className="emoji-inline"> {getRandomEmoji()}</span>}
          </div>
        )}

        {isVoice && (
          <button className="play-btn">▶ Play</button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
