import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SettingsLayout from './components/SettingsLayout';
import StyleLibrary from './components/StyleLibrary';

const SettingsApp = () => {
  const [activeSection, setActiveSection] = useState('styles');

  const renderContent = () => {
    switch (activeSection) {
      case 'styles':
        return <StyleLibrary />;
      case 'preferences':
        return (
          <div className="settings-content">
            <h2>Preferences</h2>
            <p>Preferences settings coming soon...</p>
          </div>
        );
      case 'about':
        return (
          <div className="settings-content">
            <h2>About</h2>
            <p>Write Assist - AI-powered writing assistant for Salesforce Quip</p>
            <p>Version 1.0</p>
          </div>
        );
      default:
        return <StyleLibrary />;
    }
  };

  return (
    <SettingsLayout>
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="settings-main">
        {renderContent()}
      </main>
    </SettingsLayout>
  );
};

export default SettingsApp;
