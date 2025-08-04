import React from 'react';

const SettingsLayout = ({ children }) => {
  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Write Assist Settings</h1>
      </header>
      <div className="settings-body">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
