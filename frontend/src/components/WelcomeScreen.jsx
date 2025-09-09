import React from 'react';
import { motion } from 'framer-motion';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onSuggestedQuestion }) => {
    const suggestedQuestions = [
        "What's my account balance?",
        "Show me my credit card details",
        "Recent transactions",
        "When is my next EMI due?"
    ];

    return (
        <div className="welcome-screen-claude">
            <div className="welcome-container">
                {/* Main Logo and Title */}
                <motion.div
                    className="welcome-main"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="welcome-logo-large">
                        <span className="logo-icon-large">🏦</span>
                    </div>
                    <h1 className="welcome-title-main">VaultMate</h1>
                    <p className="welcome-description">
                        Ask me anything about your accounts, cards, transactions, loans, and more.
                    </p>
                </motion.div>

                {/* Suggested Questions */}
                <motion.div
                    className="suggestions-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <div className="suggestions-grid-claude">
                        {suggestedQuestions.map((question, index) => (
                            <motion.button
                                key={index}
                                className="suggestion-card-claude"
                                onClick={() => onSuggestedQuestion(question)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                            >
                                {question}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeScreen;