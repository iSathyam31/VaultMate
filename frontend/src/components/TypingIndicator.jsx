import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ agentName = 'VaultMate', agentIcon = '🏦' }) => {
    const dotVariants = {
        initial: { scale: 0.8, opacity: 0.5 },
        animate: {
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
        }
    };

    const containerVariants = {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    const stepVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="modern-message agent typing-indicator-modern"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="message-container">
                <motion.div
                    className="message-avatar-modern"
                    animate={{
                        boxShadow: [
                            "0 4px 15px rgba(16, 185, 129, 0.4)",
                            "0 4px 20px rgba(16, 185, 129, 0.6)",
                            "0 4px 15px rgba(16, 185, 129, 0.4)"
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="agent-avatar-modern">
                        <span>{agentIcon}</span>
                        <div className="avatar-glow"></div>
                    </div>
                </motion.div>

                <div className="message-body">
                    <div className="message-header-modern">
                        <div className="sender-info">
                            <span className="sender-name">{agentName}</span>
                            <span className="message-timestamp">Thinking...</span>
                        </div>
                    </div>

                    <div className="message-content-modern typing-content-modern">
                        <div className="typing-animation-modern">
                            <div className="typing-main">
                                <span className="typing-text-modern">Analyzing your request</span>
                                <div className="typing-dots-modern">
                                    {[0, 1, 2].map((index) => (
                                        <motion.div
                                            key={index}
                                            className="typing-dot-modern"
                                            variants={dotVariants}
                                            animate="animate"
                                            transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                delay: index * 0.2,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="processing-steps-modern">
                                <motion.div
                                    className="processing-step-modern"
                                    variants={stepVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="step-icon">🔍</span>
                                    <span className="step-text">Understanding your query...</span>
                                </motion.div>
                                <motion.div
                                    className="processing-step-modern"
                                    variants={stepVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 1.2 }}
                                >
                                    <span className="step-icon">🎯</span>
                                    <span className="step-text">Routing to specialist...</span>
                                </motion.div>
                                <motion.div
                                    className="processing-step-modern"
                                    variants={stepVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 2.0 }}
                                >
                                    <span className="step-icon">💭</span>
                                    <span className="step-text">Generating response...</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TypingIndicator;