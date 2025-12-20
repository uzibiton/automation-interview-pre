import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

function ChatPage() {
  const { t } = useTranslation();
  
  // Create initial welcome message
  const initialMessage: Message = useMemo(() => ({
    id: '0',
    text: t('chat.welcomeMessage'),
    sender: 'ai' as const,
    timestamp: new Date(),
    status: 'sent' as const,
  }), [t]);
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock AI responses
  const mockAIResponses = [
    "Got it! I've recorded your expense of $50 on groceries. Would you like to add any more details?",
    "Thanks for sharing! I've added a $25 lunch expense to your records. Anything else?",
    "Perfect! Your coffee expense of $5 has been logged. Need to add more?",
    "I've recorded your transportation cost of $15. Would you like to categorize it further?",
    "Great! Your entertainment expense of $40 has been added. What else can I help you with?",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      const randomResponse =
        mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);

      // Simulate recording for 3 seconds
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsRecording(false);
            // Add mock recorded message
            const recordedMessage: Message = {
              id: Date.now().toString(),
              text: '🎤 Voice message: "I spent $30 on dinner tonight"',
              sender: 'user',
              timestamp: new Date(),
              status: 'sent',
            };
            setMessages((prev) => [...prev, recordedMessage]);

            // Simulate AI response
            setIsTyping(true);
            setTimeout(() => {
              const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I've recorded your dinner expense of $30. Would you like to specify which restaurant?",
                sender: 'ai',
                timestamp: new Date(),
                status: 'sent',
              };
              setMessages((prev) => [...prev, aiMessage]);
              setIsTyping(false);
            }, 1500);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Stop recording
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleFileAttachment = () => {
    // Simulate file selection
    const fileMessage: Message = {
      id: Date.now().toString(),
      text: `📎 ${t('chat.mockFileSelected')}`,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, fileMessage]);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I can see your receipt! It looks like a $45 expense at a restaurant. Should I add this to your records?",
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      <div className="page-header">
        <h2>{t('chat.title')}</h2>
        <p className="page-description">{t('chat.description')}</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}
            >
              <div className="chat-message-bubble">
                <p className="chat-message-text">{message.text}</p>
                <span className="chat-message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message chat-message-ai">
              <div className="chat-message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="chat-message-time">{t('chat.aiTyping')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <button
            className="chat-input-button"
            onClick={handleFileAttachment}
            aria-label={t('chat.attachFile')}
            title={t('chat.attachFile')}
          >
            📎
          </button>

          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={t('chat.inputPlaceholder')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isRecording}
            aria-label={t('chat.inputPlaceholder')}
          />

          <button
            className={`chat-input-button ${isRecording ? 'chat-recording' : ''}`}
            onClick={handleRecording}
            aria-label={isRecording ? t('chat.stopRecording') : t('chat.recording')}
            title={isRecording ? t('chat.stopRecording') : t('chat.recording')}
          >
            {isRecording ? `🔴 ${recordingTime}s` : '🎤'}
          </button>

          <button
            className="chat-input-button chat-send-button"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isRecording}
            aria-label={t('chat.send')}
            title={t('chat.send')}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
