import React, { useState } from 'react';
import FeedbackWidget from '../../components/FeedbackWidget';

const SettingsLayout = ({ children }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSlackClick = () => {
    // Open Slack community in new tab
    window.open('https://join.slack.com/t/writersblock-community/shared_invite/your-invite-link', '_blank');
  };

  const handleFeedbackClick = () => {
    setShowFeedback(true);
  };

  return (
    <div className="settings-app">
      <header className="settings-header">
        <div className="settings-brand">
          <div className="brand-logo">✨</div>
          <div className="brand-info">
            <h1 className="brand-title">Writers Block</h1>
            <p className="brand-subtitle">AI-Powered Writing Assistant</p>
          </div>
        </div>
        <div className="settings-actions">
          <div className="action-icons">
            <button 
              className="action-icon slack-icon" 
              onClick={handleSlackClick}
              title="Join our community"
              aria-label="Join our Slack community"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
              </svg>
            </button>
            <button 
              className="action-icon feedback-icon" 
              onClick={handleFeedbackClick}
              title="Send feedback"
              aria-label="Send feedback"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 13h-2v-2h2v2zm0-4h-2V7h2v4z"/>
              </svg>
            </button>
          </div>
          <div className="settings-version">
            <span className="version-badge">v1.0</span>
          </div>
        </div>
      </header>
      <div className="settings-container">
        {children}
      </div>
      <footer className="settings-footer">
        <div className="footer-content">
          <p className="footer-text">
            Made with ❤️ for better writing • 
            <a href="#" className="footer-link">Documentation</a> • 
            <a href="#" className="footer-link">Support</a>
          </p>
        </div>
      </footer>
      
      {showFeedback && (
        <FeedbackWidget onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
};

export default SettingsLayout;
