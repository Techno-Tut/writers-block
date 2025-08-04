import React from 'react';
import { createRoot } from 'react-dom/client';
import SettingsApp from './SettingsApp';
import { StorageProvider } from '../storage/StorageProvider';
import '../styles/settings.css';

const container = document.getElementById('settings-root');
const root = createRoot(container);

root.render(
  <StorageProvider>
    <SettingsApp />
  </StorageProvider>
);
