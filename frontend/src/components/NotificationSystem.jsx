import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type, duration };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Expose the addNotification function globally
    useEffect(() => {
        window.showNotification = addNotification;
        return () => {
            delete window.showNotification;
        };
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    };

    const getNotificationClass = (type) => {
        switch (type) {
            case 'success': return 'notification-success';
            case 'error': return 'notification-error';
            case 'warning': return 'notification-warning';
            case 'info': return 'notification-info';
            default: return 'notification-info';
        }
    };

    return (
        <div className="notification-container">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        className={`notification ${getNotificationClass(notification.type)}`}
                        initial={{ opacity: 0, x: 300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="notification-content">
                            <span className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </span>
                            <span className="notification-message">
                                {notification.message}
                            </span>
                        </div>
                        <button
                            className="notification-close"
                            onClick={() => removeNotification(notification.id)}
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;