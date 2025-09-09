import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ message, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const messageVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.05
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.9,
            transition: {
                duration: 0.2
            }
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
            'MainBankingMasterAgent': { icon: '🏦', name: 'VaultMate', color: '#4a90e2' }
        };
        return agentInfo[agentName] || { icon: '🤖', name: 'VaultMate Assistant', color: '#6c757d' };
    };

    const routedInfo = message.agentName ? getRoutedAgentInfo(message.agentName) : null;

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            if (window.showNotification) {
                window.showNotification('Message copied to clipboard', 'success');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            if (window.showNotification) {
                window.showNotification('Failed to copy message', 'error');
            }
        }
    };

    return (
        <motion.div
            className={`modern-message ${message.type}`}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="message-container">
                {/* Avatar */}
                <motion.div
                    className="message-avatar-modern"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {message.type === 'user' ? (
                        <div className="user-avatar-modern">
                            <span>👤</span>
                        </div>
                    ) : message.type === 'error' ? (
                        <div className="error-avatar-modern">
                            <span>⚠️</span>
                        </div>
                    ) : (
                        <div className="agent-avatar-modern">
                            <span>{routedInfo?.icon || '🏦'}</span>
                            <div className="avatar-glow"></div>
                        </div>
                    )}
                </motion.div>

                {/* Message Content */}
                <div className="message-body">
                    {/* Header */}
                    <div className="message-header-modern">
                        <div className="sender-info">
                            <span className="sender-name">
                                {message.type === 'user' ? 'You' :
                                    message.type === 'error' ? 'System' :
                                        routedInfo?.name || 'VaultMate'}
                            </span>
                            <span className="message-timestamp">
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {/* Actions */}
                        <motion.div
                            className="message-actions-modern"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.button
                                className="action-btn copy-btn"
                                onClick={() => copyToClipboard(message.content)}
                                title="Copy message"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                📋
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="message-content-modern">
                        <div className="content-wrapper">
                            {message.type === 'agent' ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        table: ({ node, ...props }) => (
                                            <table className="modern-table" {...props} />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th className="modern-th" {...props} />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td className="modern-td" {...props} />
                                        ),
                                        code: ({ node, inline, ...props }) => (
                                            inline ?
                                                <code className="modern-code-inline" {...props} /> :
                                                <code className="modern-code-block" {...props} />
                                        ),
                                        h1: ({ node, ...props }) => <h1 className="modern-h1" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="modern-h2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="modern-h3" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="modern-ul" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="modern-ol" {...props} />,
                                        li: ({ node, ...props }) => <li className="modern-li" {...props} />,
                                        p: ({ node, ...props }) => <p className="modern-p" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="modern-strong" {...props} />,
                                        em: ({ node, ...props }) => <em className="modern-em" {...props} />
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            ) : (
                                <p className="user-message-text">{message.content}</p>
                            )}
                        </div>
                    </div>

                    {/* Routing Info */}
                    {routedInfo && message.agentName !== 'MainBankingMasterAgent' && (
                        <motion.div
                            className="routing-info-modern"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div
                                className="routing-badge-modern"
                                style={{
                                    backgroundColor: `${routedInfo.color}20`,
                                    borderColor: routedInfo.color,
                                    color: routedInfo.color
                                }}
                            >
                                <span className="routing-icon">{routedInfo.icon}</span>
                                <span className="routing-text">Routed to {routedInfo.name}</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;