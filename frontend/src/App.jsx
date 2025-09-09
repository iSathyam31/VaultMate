import React, { useState, useEffect } from 'react';
import MainChatInterface from './components/MainChatInterface';
import AgentInfo from './components/AgentInfo';
import NotificationSystem from './components/NotificationSystem';
import HelpTutorial from './components/HelpTutorial';
import { checkHealth } from './services/api';

function App() {
    const [apiStatus, setApiStatus] = useState('checking');
    const [showAgentInfo, setShowAgentInfo] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        const checkApiHealth = async () => {
            try {
                await checkHealth();
                setApiStatus('connected');

                // Check if tutorial should be shown
                const tutorialCompleted = localStorage.getItem('banking-app-tutorial-completed');
                if (!tutorialCompleted) {
                    setTimeout(() => setShowTutorial(true), 1000);
                }
            } catch (err) {
                console.error('API health check failed:', err);
                setApiStatus('disconnected');
            }
        };

        checkApiHealth();
    }, []);

    if (apiStatus === 'checking') {
        return (
            <div className="app-container">
                <div className="loading-screen">
                    <div className="loading-content">
                        <h1>🏦 VaultMate</h1>
                        <div className="loading">
                            <span>Connecting to banking services...</span>
                            <div className="loading-dots">
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (apiStatus === 'disconnected') {
        return (
            <div className="app-container">
                <div className="error-screen">
                    <div className="error-content">
                        <h1>🏦 VaultMate</h1>
                        <div className="error-message">
                            <h3>⚠️ Connection Error</h3>
                            <p>Unable to connect to banking services. Please ensure the API server is running.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="retry-button"
                            >
                                🔄 Retry Connection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>🏦 VaultMate</h1>
                        <p>Intelligent AI assistant for all your banking needs</p>
                    </div>
                    <div className="header-right">
                        <button
                            className={`info-button ${showAgentInfo ? 'active' : ''}`}
                            onClick={() => setShowAgentInfo(!showAgentInfo)}
                        >
                            ℹ️ Agent Info
                        </button>
                        <button
                            className="help-button"
                            onClick={() => setShowTutorial(true)}
                            title="Help & Tutorial"
                        >
                            ❓
                        </button>
                        <div className="status-indicator connected">
                            <span className="status-dot"></span>
                            Connected
                        </div>
                    </div>
                </div>
            </div>

            <div className="app-body">
                {showAgentInfo && (
                    <div className="agent-info-sidebar">
                        <AgentInfo onClose={() => setShowAgentInfo(false)} />
                    </div>
                )}

                <div className={`main-content ${showAgentInfo ? 'with-sidebar' : ''}`}>
                    <MainChatInterface />
                </div>
            </div>
            <NotificationSystem />
            <HelpTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />
        </div>
    );
}

export default App;