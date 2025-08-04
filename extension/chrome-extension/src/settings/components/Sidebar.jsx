import React from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'styles',
      label: 'Style Library',
      icon: '📝'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '⚙️'
    },
    {
      id: 'about',
      label: 'About',
      icon: 'ℹ️'
    }
  ];

  return (
    <aside className="settings-sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
