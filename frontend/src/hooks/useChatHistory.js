import { useState, useEffect } from 'react';

export const useChatHistory = (sessionId) => {
    const [messages, setMessages] = useState([]);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat-history-${sessionId}`);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setMessages(parsed);
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }, [sessionId]);

    // Save messages to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat-history-${sessionId}`, JSON.stringify(messages));
        }
    }, [messages, sessionId]);

    const addMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([]);
        localStorage.removeItem(`chat-history-${sessionId}`);
    };

    const exportChat = () => {
        const chatData = {
            sessionId,
            exportDate: new Date().toISOString(),
            messages: messages.map(msg => ({
                type: msg.type,
                content: msg.content,
                timestamp: msg.timestamp,
                agentName: msg.agentName,
                routedTo: msg.routedTo
            }))
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `banking-chat-${sessionId}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return {
        messages,
        setMessages,
        addMessage,
        clearMessages,
        exportChat
    };
};