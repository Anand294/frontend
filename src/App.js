import React, { useState } from 'react';
import './App.css'; // For custom styling

// Import functions from separate files
import { showContactContent } from './contactFunctions';
import { MyWeekly } from './myweekly';
import{ExeDashPage} from './exedash/exepage';
import{WeeklyReport} from './report';
import MainForm from './requesttracker/mainform';

const App = () => {
  const [content, setContent] = useState(<MyWeekly />);
  const [menuVisible, setMenuVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState('home'); // Track the active menu item

  const handleMenuClick = (menu) => {
    setActiveMenu(menu); // Set active menu

    switch (menu) {
      case 'home':
        setContent(<MyWeekly />);
        break;
      case 'ExecutiveDash':
        setContent(<ExeDashPage/>);
        break;
      case 'WeeklyReport':
        setContent(<WeeklyReport/>);
        break;
      case 'contact':
        setContent(showContactContent());
        break;
      case 'RequestTracker':
          setContent(<MainForm/>);
          break;
      default:
        setContent(MyWeekly());
    }
  };

  return (
    <div className="app">
      <header className="header">
        <button className="logout-button">Logout</button>
        <button className="menu-toggle" onClick={() => setMenuVisible(!menuVisible)}>
          ☰
        </button>
      </header>
      <div className={`sidebar ${menuVisible ? 'visible' : 'hidden'}`}>
        <button 
          className={`menu-button ${activeMenu === 'home' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('home')}
        >
          My Weekly
        </button>
        <button 
          className={`menu-button ${activeMenu === 'ExecutiveDash' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('ExecutiveDash')}
        >
          Executive Dashboard
        </button>
        <button 
          className={`menu-button ${activeMenu === 'WeeklyReport' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('WeeklyReport')}
        >
          Report
        </button>
        <button 
          className={`menu-button ${activeMenu === 'contact' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('contact')}
        >
          Contact
        </button>
        <button 
          className={`menu-button ${activeMenu === 'RequestTracker' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('RequestTracker')}
        >
          Request Tracker
        </button>
        
      </div>
      <div className="content">
        {content}
      </div>
    </div>
  );
};

export default App;
