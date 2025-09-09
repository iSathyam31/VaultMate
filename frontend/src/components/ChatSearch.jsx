import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSearch = ({ messages, onSearchResults, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);

    useEffect(() => {
        if (searchTerm.trim()) {
            const results = messages
                .map((message, index) => ({ ...message, originalIndex: index }))
                .filter(message =>
                    message.content.toLowerCase().includes(searchTerm.toLowerCase())
                );
            setSearchResults(results);
            setCurrentResultIndex(0);
            onSearchResults(results);
        } else {
            setSearchResults([]);
            onSearchResults([]);
        }
    }, [searchTerm, messages, onSearchResults]);

    const navigateResults = (direction) => {
        if (searchResults.length === 0) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentResultIndex + 1) % searchResults.length;
        } else {
            newIndex = currentResultIndex === 0 ? searchResults.length - 1 : currentResultIndex - 1;
        }
        setCurrentResultIndex(newIndex);

        // Scroll to the result
        const messageElement = document.querySelector(`[data-message-index="${searchResults[newIndex].originalIndex}"]`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                navigateResults('prev');
            } else {
                navigateResults('next');
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="chat-search-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="chat-search-container"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="search-input-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <div className="search-results-info">
                            {searchResults.length > 0 ? (
                                <span>
                                    {currentResultIndex + 1} of {searchResults.length}
                                </span>
                            ) : searchTerm ? (
                                <span>No results</span>
                            ) : (
                                <span>Type to search</span>
                            )}
                        </div>
                    </div>

                    <div className="search-controls">
                        <button
                            className="search-nav-button"
                            onClick={() => navigateResults('prev')}
                            disabled={searchResults.length === 0}
                            title="Previous result (Shift+Enter)"
                        >
                            ↑
                        </button>
                        <button
                            className="search-nav-button"
                            onClick={() => navigateResults('next')}
                            disabled={searchResults.length === 0}
                            title="Next result (Enter)"
                        >
                            ↓
                        </button>
                        <button
                            className="search-close-button"
                            onClick={onClose}
                            title="Close search (Escape)"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatSearch;