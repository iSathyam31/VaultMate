import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPanel = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        autoScroll: true,
        soundEnabled: false,
        compactMode: false,
        showTimestamps: true,
        animationsEnabled: true,
        fontSize: 'medium'
    });

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('banking-app-settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('banking-app-settings', JSON.stringify(settings));

        // Apply settings to document
        document.documentElement.setAttribute('data-compact-mode', settings.compactMode);
        document.documentElement.setAttribute('data-font-size', settings.fontSize);
        document.documentElement.setAttribute('data-animations', settings.animationsEnabled);
    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));

        if (window.showNotification) {
            window.showNotification(`${key} updated`, 'success', 2000);
        }
    };

    const resetSettings = () => {
        const defaultSettings = {
            autoScroll: true,
            soundEnabled: false,
            compactMode: false,
            showTimestamps: true,
            animationsEnabled: true,
            fontSize: 'medium'
        };
        setSettings(defaultSettings);

        if (window.showNotification) {
            window.showNotification('Settings reset to defaults', 'success');
        }
    };

    const exportSettings = () => {
        const settingsData = {
            theme,
            ...settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `banking-app-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.showNotification) {
            window.showNotification('Settings exported successfully', 'success');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="settings-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="settings-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="settings-header">
                        <h3>⚙️ Settings</h3>
                        <button className="settings-close-button" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="settings-content">
                        <div className="settings-section">
                            <h4>🎨 Appearance</h4>

                            <div className="setting-item">
                                <label>Theme</label>
                                <button
                                    className={`theme-switch ${theme}`}
                                    onClick={toggleTheme}
                                >
                                    <span className="theme-switch-slider">
                                        {theme === 'dark' ? '🌙' : '☀️'}
                                    </span>
                                    <span className="theme-label">
                                        {theme === 'dark' ? 'Dark' : 'Light'}
                                    </span>
                                </button>
                            </div>

                            <div className="setting-item">
                                <label>Font Size</label>
                                <select
                                    value={settings.fontSize}
                                    onChange={(e) => updateSetting('fontSize', e.target.value)}
                                    className="setting-select"
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>

                            <div className="setting-item">
                                <label>Compact Mode</label>
                                <input
                                    type="checkbox"
                                    checked={settings.compactMode}
                                    onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                    className="setting-checkbox"
                                />
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>💬 Chat</h4>

                            <div className="setting-item">
                                <label>Auto Scroll</label>
                                <input
                                    type="checkbox"
                                    checked={settings.autoScroll}
                                    onChange={(e) => updateSetting('autoScroll', e.target.checked)}
                                    className="setting-checkbox"
                                />
                            </div>

                            <div className="setting-item">
                                <label>Show Timestamps</label>
                                <input
                                    type="checkbox"
                                    checked={settings.showTimestamps}
                                    onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
                                    className="setting-checkbox"
                                />
                            </div>

                            <div className="setting-item">
                                <label>Animations</label>
                                <input
                                    type="checkbox"
                                    checked={settings.animationsEnabled}
                                    onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                                    className="setting-checkbox"
                                />
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4>🔊 Audio</h4>

                            <div className="setting-item">
                                <label>Sound Effects</label>
                                <input
                                    type="checkbox"
                                    checked={settings.soundEnabled}
                                    onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                                    className="setting-checkbox"
                                />
                            </div>
                        </div>

                        <div className="settings-actions">
                            <button className="settings-action-button export" onClick={exportSettings}>
                                📥 Export Settings
                            </button>
                            <button className="settings-action-button reset" onClick={resetSettings}>
                                🔄 Reset to Defaults
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsPanel;