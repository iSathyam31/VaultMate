import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';
import { useChatHistory } from '../hooks/useChatHistory';
import TypingIndicator from './TypingIndicator';
import MessageBubble from './MessageBubble';
import ChatSearch from './ChatSearch';
import WelcomeScreen from './WelcomeScreen';
import { AnimatePresence, motion } from 'framer-motion';
import './ModernChat.css';

const MainChatInterface = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId] = useState(`main_session_${Date.now()}`);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Use the chat history hook
    const { messages, setMessages, addMessage, clearMessages, exportChat } = useChatHistory(sessionId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + F to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            // Escape to close search
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Handle suggested question from welcome screen
    const handleSuggestedQuestion = (question) => {
        setInputMessage(question);
        // Auto-focus the input after setting the message
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            // Send to main agent endpoint which handles routing
            const response = await sendMessage(
                '/chat', // Main agent endpoint
                userMessage.content,
                'web_user',
                sessionId
            );

            const agentMessage = {
                type: 'agent',
                content: response.response,
                timestamp: new Date(),
                agentName: response.agent_name,
                routedTo: getRoutedAgentInfo(response.agent_name)
            };

            addMessage(agentMessage);
        } catch (err) {
            setError('Failed to send message. Please try again.');
            console.error('Error sending message:', err);

            // Show notification
            if (window.showNotification) {
                window.showNotification('Failed to send message. Please try again.', 'error');
            }

            // Add error message to chat
            const errorMessage = {
                type: 'error',
                content: 'Sorry, I encountered an error processing your request. Please try again.',
                timestamp: new Date(),
            };
            addMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoutedAgentInfo = (agentName) => {
        const agentInfo = {
            'AccountMasterAgent': { icon: '🏦', name: 'Account Specialist', color: '#4a90e2' },
            'CardMasterAgent': { icon: '💳', name: 'Card Specialist', color: '#28a745' },
            'TransactionMasterAgent': { icon: '💸', name: 'Transaction Specialist', color: '#ffc107' },
            'LoansAndInvestmentMasterAgent': { icon: '📈', name: 'Loans & Investment Specialist', color: '#17a2b8' },
            'PayeeRecurringPaymentMasterAgent': { icon: '🔄', name: 'Payments Specialist', color: '#6f42c1' },
            'BankingServicesMasterAgent': { icon: '🛠️', name: 'Banking Services Specialist', color: '#fd7e14' },
            'MainBankingMasterAgent': { icon: '🏦', name: 'Main Banking Agent', color: '#4a90e2' }
        };
        return agentInfo[agentName] || { icon: '🤖', name: 'Banking Assistant', color: '#6c757d' };
    };



    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto';
        const maxHeight = 120; // Max 5 lines approximately
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    };

    return (
        <div className="modern-chat-container">


            {/* Messages Area or Welcome Screen */}
            <div className="chat-messages-area">
                {messages.length === 0 ? (
                    <WelcomeScreen onSuggestedQuestion={handleSuggestedQuestion} />
                ) : (
                    <div className="messages-container">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <MessageBubble
                                    key={`${message.timestamp}-${index}`}
                                    message={message}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isLoading && (
                                <TypingIndicator
                                    agentName="VaultMate"
                                    agentIcon="🏦"
                                />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="error-message-modern"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <div className="error-content">
                                        <span className="error-icon">⚠️</span>
                                        <span className="error-text">{error}</span>
                                        <button
                                            onClick={() => setError(null)}
                                            className="error-close"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Enhanced Input Area */}
            <motion.div
                className="chat-input-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <form onSubmit={handleSendMessage} className="modern-input-form">
                    <div className="input-container">
                        <div className="input-wrapper-modern">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={inputMessage}
                                onChange={(e) => {
                                    setInputMessage(e.target.value);
                                    adjustTextareaHeight(e.target);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Type your message here..."
                                className="modern-chat-input"
                                disabled={isLoading}
                                maxLength={2000}
                            />
                            <div className="input-actions">
                                <div className="char-counter">
                                    {inputMessage.length}/2000
                                </div>
                                <motion.button
                                    type="submit"
                                    className="modern-send-button"
                                    disabled={isLoading || !inputMessage.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoading ? (
                                        <div className="loading-spinner-modern">
                                            <div className="spinner"></div>
                                        </div>
                                    ) : (
                                        <span className="send-icon">📤</span>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                        {inputMessage.length > 0 && (
                            <motion.div
                                className="input-suggestions"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="suggestion-tip">
                                    💡 Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
                                </div>
                            </motion.div>
                        )}
                    </div>
                </form>
            </motion.div>

            <ChatSearch
                messages={messages}
                onSearchResults={setSearchResults}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
};

export default MainChatInterface;
