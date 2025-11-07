import React, { useState, useRef, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import './styles/App.css';

const App = () => {
  // Keep top-level app state and pass to ChatWindow
  const [messages, setMessages] = useState([
    {
      id: 1,
      original: 'எப்படி இருக்கே?',
      translation: null,
      isUserA: true,
      isVoice: false
    },
    {
      id: 2,
      original: 'कैसे हो?',
      translation: null,
      isUserA: false,
      isVoice: false
    },
    {
      id: 3,
      original: 'मैं बहुत बढ़िया हूं, तुम कैसी हो?',
      translation: null,
      isUserA: true,
      isVoice: false
    },
    {
      id: 4,
      original: 'நான் ரொம்ப நலா ஒருக்கேன்!\nநீ எப்படி இருக்க?',
      translation: null,
      isUserA: false,
      isVoice: false
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [emojiMode, setEmojiMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [currentUser, setCurrentUser] = useState('A');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`app-root ${emojiMode ? 'emoji-bg' : ''}`}>
      <header className="app-header container">
        <div>
          <h1 className="app-title">LinguaVibe 🎵</h1>
          <p className="app-subtitle">Real-time Translation Chat</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">Emoji Mode</span>
          <div className="toggle-wrapper">
            <input
              id="emojiToggle"
              type="checkbox"
              checked={emojiMode}
              onChange={() => setEmojiMode(!emojiMode)}
            />
            <label htmlFor="emojiToggle" />
          </div>
        </div>
      </header>

      <div className="user-indicators d-flex justify-content-center gap-4">
        {['A', 'B'].map(user => (
          <div key={user} className={`indicator ${currentUser === user ? 'active' : ''}`}>
            <div className="avatar">{user}</div>
            <div className="dot" />
          </div>
        ))}
      </div>

      <main className="container chat-container">
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          inputText={inputText}
          setInputText={setInputText}
          emojiMode={emojiMode}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          isTranslating={isTranslating}
          setIsTranslating={setIsTranslating}
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          chatEndRef={chatEndRef}
        />
      </main>
    </div>
  );
};

export default App;
