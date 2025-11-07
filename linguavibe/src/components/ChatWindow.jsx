import React from 'react';
import MessageBubble from './MessageBubble';
import LanguageSelector from './LanguageSelector';
import VoiceInput from './VoiceInput';
import { translateText } from '../utils/translationUtils';
import '../styles/ChatWindow.css';

const ChatWindow = ({
  messages,
  setMessages,
  inputText,
  setInputText,
  emojiMode,
  isRecording,
  setIsRecording,
  isTranslating,
  setIsTranslating,
  selectedLang,
  setSelectedLang,
  currentUser,
  setCurrentUser,
  chatEndRef
}) => {

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const isUserAMessage = currentUser === 'A';
    const userMessage = {
      id: Date.now(),
      original: inputText,
      translation: null,
      isUserA: isUserAMessage,
      isVoice: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTranslating(true);

    // simulate small delay and call translate utility
    setTimeout(async () => {
      // In this placeholder we assume input is in English and we translate to selectedLang
      const translation = await translateText(inputText, 'en', selectedLang);

      setMessages(prev =>
        prev.map(msg => (msg.id === userMessage.id ? { ...msg, translation } : msg))
      );

      setIsTranslating(false);
      setCurrentUser(currentUser === 'A' ? 'B' : 'A');
    }, 600);
  };

  const handleVoiceInput = () => {
    setIsRecording(prev => !prev);

    if (!isRecording) {
      // Simulate voice capture
      setTimeout(() => {
        const voiceMessage = {
          id: Date.now(),
          original: currentUser === 'A' ? 'नमस्ते. आप कैसे हैं?' : 'Hello. How are you?',
          translation: currentUser === 'A' ? 'Hello. How are you?' : 'नमस्ते. आप कैसे हैं?',
          isUserA: currentUser === 'A',
          isVoice: true
        };

        setMessages(prev => [...prev, voiceMessage]);
        setIsRecording(false);
        setCurrentUser(prev => (prev === 'A' ? 'B' : 'A'));
      }, 1800);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window card">
      <div className="chat-messages">
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} emojiMode={emojiMode} />
        ))}

        {isTranslating && (
          <div className="translating-indicator">
            <div className="spinner" />
            <span>Translating...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <div className="d-flex gap-2 align-items-center w-100">
          <input
            className="form-control chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <LanguageSelector selectedLang={selectedLang} onLangChange={setSelectedLang} />

          <button
            className="send-btn btn"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            title="Send"
          >
            ➤
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <VoiceInput isRecording={isRecording} onVoiceInput={handleVoiceInput} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
