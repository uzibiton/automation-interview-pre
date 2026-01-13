import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getApiServiceUrl } from '../utils/config';
import ExpensePreview from './ExpensePreview';
import ExpenseDialog from './ExpenseDialog';
import { Category } from '../types/expense.types';

const API_SERVICE_URL = getApiServiceUrl();

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ParsedExpense {
  amount: number | null;
  currency: string;
  categoryId: number | null;
  description: string;
  date: string;
  paymentMethod: string;
  confidence: number;
}

interface ChatPageProps {
  token: string;
}

function ChatPage({ token }: ChatPageProps) {
  const { t, i18n } = useTranslation();

  // Create initial welcome message
  const initialMessage: Message = useMemo(
    () => ({
      id: '0',
      text: t('chat.welcomeMessage'),
      sender: 'ai' as const,
      timestamp: new Date(),
      status: 'sent' as const,
    }),
    [t],
  );

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [parsedExpense, setParsedExpense] = useState<ParsedExpense | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastLanguageRef = useRef(i18n.language);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/expenses/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setCategories([]);
    }
  };

  // Mock AI responses (kept for backward compatibility but not used when parse API is available)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockAIResponses = [
    t('chat.mockResponses.response1'),
    t('chat.mockResponses.response2'),
    t('chat.mockResponses.response3'),
    t('chat.mockResponses.response4'),
    t('chat.mockResponses.response5'),
  ];

  // Update welcome message when language changes
  useEffect(() => {
    if (lastLanguageRef.current !== i18n.language) {
      lastLanguageRef.current = i18n.language;
      setMessages((prev) => {
        // Only update if we have just the initial welcome message
        if (prev.length === 1 && prev[0].id === '0') {
          return [initialMessage];
        }
        return prev;
      });
    }
  }, [i18n.language, initialMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');

    // Call parse API
    setIsTyping(true);
    try {
      const response = await axios.post(
        `${API_SERVICE_URL}/expenses/parse`,
        { text: messageText },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setParsedExpense(response.data);
      setShowPreview(true);
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to parse expense', error);
      setIsTyping(false);

      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.errorMessage'),
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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
                text: t('chat.voiceResponse'),
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
        text: t('chat.fileResponse'),
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

  const handleApproveExpense = async () => {
    if (!parsedExpense) return;

    setIsCreatingExpense(true);
    try {
      const payload = {
        categoryId: parsedExpense.categoryId,
        subCategoryId: null,
        amount: parsedExpense.amount,
        currency: parsedExpense.currency,
        description: parsedExpense.description,
        date: parsedExpense.date,
        paymentMethod: parsedExpense.paymentMethod,
      };

      await axios.post(`${API_SERVICE_URL}/expenses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Success - close preview and show success message
      setShowPreview(false);
      setParsedExpense(null);

      const successMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.expenseCreatedSuccess', {
          currency: parsedExpense.currency,
          amount: parsedExpense.amount,
        }),
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error('Failed to create expense', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.errorMessage'),
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsCreatingExpense(false);
    }
  };

  const handleEditExpense = () => {
    setShowPreview(false);
    setShowEditDialog(true);
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setParsedExpense(null);

    const cancelMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: t('chat.cancelMessage'),
      sender: 'ai',
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  const handleExpenseDialogClose = () => {
    setShowEditDialog(false);
    setParsedExpense(null);
  };

  const handleExpenseDialogSuccess = () => {
    setShowEditDialog(false);
    setParsedExpense(null);

    const successMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: t('chat.expenseCreatedSuccess', {
        currency: 'N/A',
        amount: 'N/A',
      }),
      sender: 'ai',
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, successMessage]);
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

          {showPreview && parsedExpense && (
            <div className="chat-message chat-message-ai">
              <ExpensePreview
                parsedExpense={parsedExpense}
                categories={categories}
                onApprove={handleApproveExpense}
                onEdit={handleEditExpense}
                onCancel={handleCancelPreview}
                loading={isCreatingExpense}
              />
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
            data-testid="chat-attach-button"
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
            data-testid="chat-message-input"
          />

          <button
            className={`chat-input-button ${isRecording ? 'chat-recording' : ''}`}
            onClick={handleRecording}
            aria-label={isRecording ? t('chat.stopRecording') : t('chat.recording')}
            title={isRecording ? t('chat.stopRecording') : t('chat.recording')}
            data-testid="chat-record-button"
          >
            {isRecording ? `🔴 ${recordingTime}s` : '🎤'}
          </button>

          <button
            className="chat-input-button chat-send-button"
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isRecording}
            aria-label={t('chat.send')}
            title={t('chat.send')}
            data-testid="chat-send-button"
          >
            ➤
          </button>
        </div>
      </div>

      {showEditDialog && parsedExpense && (
        <ExpenseDialog
          token={token}
          isOpen={showEditDialog}
          onClose={handleExpenseDialogClose}
          onSuccess={handleExpenseDialogSuccess}
          expense={{
            id: 0,
            categoryId: parsedExpense.categoryId || 1,
            subCategoryId: undefined,
            amount: parsedExpense.amount || 0,
            currency: parsedExpense.currency,
            description: parsedExpense.description,
            date: parsedExpense.date,
            paymentMethod: parsedExpense.paymentMethod,
          }}
        />
      )}
    </div>
  );
}

export default ChatPage;
