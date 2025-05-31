import React, { useState } from 'react';
import TicketList from './components/TicketList';
import TicketOpenPage from './components/TicketOpenPage';
import './App.css';

type AppView = 'tickets' | 'technician';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('technician');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎫 Support Ticket System</h1>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'technician' ? 'active' : ''}`}
            onClick={() => setCurrentView('technician')}
          >
            🔧 Technician Dashboard
          </button>
          <button 
            className={`nav-tab ${currentView === 'tickets' ? 'active' : ''}`}
            onClick={() => setCurrentView('tickets')}
          >
            📋 All Tickets
          </button>
        </nav>
      </header>
      <main>
        {currentView === 'technician' && <TicketOpenPage technicianId={1} />}
        {currentView === 'tickets' && <TicketList />}
      </main>
    </div>
  );
}

export default App;
