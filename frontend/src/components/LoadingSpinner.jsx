import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
    const sizeClasses = {
        small: 'loading-spinner-small',
        medium: 'loading-spinner-medium',
        large: 'loading-spinner-large'
    };

    return (
        <div className={`loading-spinner-container ${className}`}>
            <motion.div
                className={`loading-spinner ${sizeClasses[size]}`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </motion.div>
            {text && <span className="loading-text">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;