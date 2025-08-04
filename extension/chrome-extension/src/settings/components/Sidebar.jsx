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
      <nav>
        <ul className="settings-nav">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={activeSection === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange(item.id);
                }}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
