import React, { useState, useEffect } from 'react';
import { ApiClient, Ticket, CreateTicketRequest } from '../api';
import './TicketList.css';

// Initialize API client
const apiClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

interface TicketListProps {
  onTicketSelect?: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ onTicketSelect }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState<CreateTicketRequest>({
    title: '',
    description: '',
    priority: 'medium',
    assigned_technician_id: 1, // Default technician ID
    customer_name: '',
    customer_phone: '',
    location: ''
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const tickets = await apiClient.tickets.getAllTickets({});
      setTickets(tickets);
    } catch (err) {
      setError('Failed to load tickets. Make sure the API is running.');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdTicket = await apiClient.tickets.createTicket(newTicket);
      setTickets([...tickets, createdTicket]);
      setNewTicket({ 
        title: '', 
        description: '', 
        priority: 'medium',
        assigned_technician_id: 1,
        customer_name: '',
        customer_phone: '',
        location: ''
      });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create ticket');
      console.error('Error creating ticket:', err);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    try {
      await apiClient.tickets.deleteTicket(id);
      setTickets(tickets.filter(ticket => ticket.id !== id));
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Error deleting ticket:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#3498db';
      case 'in_progress': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="ticket-list">
      <div className="ticket-list-header">
        <h2>Support Tickets</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadTickets} className="btn btn-small">Retry</button>
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateTicket} className="create-ticket-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={newTicket.description || ''}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={newTicket.location || ''}
              onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="customer_name">Customer Name:</label>
            <input
              type="text"
              id="customer_name"
              value={newTicket.customer_name || ''}
              onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="customer_phone">Customer Phone:</label>
            <input
              type="tel"
              id="customer_phone"
              value={newTicket.customer_phone || ''}
              onChange={(e) => setNewTicket({ ...newTicket, customer_phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="assigned_technician_id">Technician ID:</label>
            <input
              type="number"
              id="assigned_technician_id"
              value={newTicket.assigned_technician_id}
              onChange={(e) => setNewTicket({ ...newTicket, assigned_technician_id: parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Ticket</button>
        </form>
      )}

      <div className="tickets">
        {tickets.length === 0 ? (
          <div className="no-tickets">
            No tickets found. {error ? 'Check if the API is running.' : 'Create your first ticket!'}
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="ticket-card"
              onClick={() => onTicketSelect?.(ticket)}
            >
              <div className="ticket-header">
                <h3>{ticket.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
              <div className="ticket-info">
                <p className="ticket-number"><strong>#{ticket.ticket_number}</strong></p>
                <p className="ticket-description">{ticket.description}</p>
                {ticket.location && <p className="ticket-location">📍 {ticket.location}</p>}
                {ticket.customer_name && <p className="ticket-customer">👤 {ticket.customer_name}</p>}
                {ticket.customer_phone && <p className="ticket-phone">📞 {ticket.customer_phone}</p>}
                <p className="ticket-priority">
                  <span className={`priority-badge priority-${ticket.priority}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="ticket-footer">
                <span className="ticket-date">
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </span>
                <span className="ticket-technician">
                  Tech ID: {ticket.assigned_technician_id}
                </span>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTicket(ticket.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;
