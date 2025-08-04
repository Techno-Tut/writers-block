import React from 'react';

const SettingsLayout = ({ children }) => {
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
        <div className="settings-version">
          <span className="version-badge">v1.0</span>
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
    </div>
  );
};

export default SettingsLayout;
