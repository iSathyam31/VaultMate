import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpTutorial = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const tutorialSteps = [
        {
            title: "Welcome to Banking Master Agent! 🏦",
            content: "Your intelligent AI assistant for all banking needs. Let me show you around!",
            icon: "👋",
            highlight: null
        },
        {
            title: "Smart Routing System 🎯",
            content: "Just ask your question naturally! Our AI automatically routes your query to the right specialist - no need to choose which agent to talk to.",
            icon: "🤖",
            highlight: ".chat-input"
        },
        {
            title: "Specialized Agents 🎯",
            content: "We have 6 specialized agents: Account Management, Card Services, Transactions, Loans & Investments, Payments, and General Banking Services.",
            icon: "👥",
            highlight: ".info-button"
        },
        {
            title: "Chat Features 💬",
            content: "Use the toolbar to clear chat, search messages, or export your conversation. All your chats are automatically saved!",
            icon: "🛠️",
            highlight: ".chat-toolbar"
        },
        {
            title: "Search & Navigation 🔍",
            content: "Press Ctrl+F to search through your messages. Use the search button in the toolbar or keyboard shortcuts for quick access.",
            icon: "🔍",
            highlight: ".search-chat-button"
        },

        {
            title: "Quick Actions ⚡",
            content: "When you start a new chat, you'll see quick action buttons for common banking queries to get you started quickly.",
            icon: "⚡",
            highlight: ".quick-actions"
        },
        {
            title: "You're All Set! 🎉",
            content: "That's it! You're ready to start banking with AI. Ask me anything about your accounts, cards, transactions, or any banking service.",
            icon: "🎉",
            highlight: null
        }
    ];

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const skipTutorial = () => {
        localStorage.setItem('banking-app-tutorial-completed', 'true');
        onClose();
    };

    if (!isOpen) return null;

    const currentStepData = tutorialSteps[currentStep];

    return (
        <AnimatePresence>
            <motion.div
                className="tutorial-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="tutorial-spotlight"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: 0.2 }}
                />

                <motion.div
                    className="tutorial-card"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="tutorial-header">
                        <div className="tutorial-icon">
                            {currentStepData.icon}
                        </div>
                        <div className="tutorial-progress">
                            <span>{currentStep + 1} of {tutorialSteps.length}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="tutorial-content">
                        <h3>{currentStepData.title}</h3>
                        <p>{currentStepData.content}</p>
                    </div>

                    <div className="tutorial-actions">
                        <button
                            className="tutorial-button secondary"
                            onClick={skipTutorial}
                        >
                            Skip Tutorial
                        </button>

                        <div className="tutorial-navigation">
                            {currentStep > 0 && (
                                <button
                                    className="tutorial-button secondary"
                                    onClick={prevStep}
                                >
                                    ← Previous
                                </button>
                            )}

                            <button
                                className="tutorial-button primary"
                                onClick={nextStep}
                            >
                                {currentStep === tutorialSteps.length - 1 ? 'Get Started!' : 'Next →'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default HelpTutorial;