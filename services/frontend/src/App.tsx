import React, { useState } from 'react';
import TicketList from './components/TicketList';
import TicketOpenPage from './components/TicketOpenPage';
import TicketDetail from './components/TicketDetail';
import { Ticket } from './api';
import './App.css';

type AppView = 'tickets' | 'technician' | 'ticketDetail';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('technician');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('ticketDetail');
  };

  const handleBackToTickets = () => {
    setSelectedTicket(null);
    setCurrentView('tickets');
  };

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
        {currentView === 'technician' && <TicketOpenPage technicianId={1} onTicketSelect={handleTicketSelect} />}
        {currentView === 'tickets' && <TicketList onTicketSelect={handleTicketSelect} />}
        {currentView === 'ticketDetail' && selectedTicket && (
          <TicketDetail ticketId={selectedTicket.id} onBack={handleBackToTickets} />
        )}
      </main>
    </div>
  );
}

export default App;
