import React, { useState, useEffect } from 'react';
import { ApiClient, Ticket, CreateTicketRequest } from '../api';
import './TicketOpenPage.css';

// Initialize API client
const apiClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

interface TicketOpenPageProps {
  technicianId?: number;
}

const TicketOpenPage: React.FC<TicketOpenPageProps> = ({ technicianId = 1 }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState<CreateTicketRequest>({
    title: '',
    description: '',
    priority: 'medium',
    assigned_technician_id: technicianId,
    customer_name: '',
    customer_phone: '',
    location: '',
    scheduled_date: undefined
  });

  useEffect(() => {
    loadTechnicianTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technicianId]);

  const loadTechnicianTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load tickets for this technician
      const allTickets = await apiClient.tickets.getAllTickets({ technicianId });
      setTickets(allTickets);
    } catch (err) {
      setError('Failed to load tickets. Make sure the API is running.');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ticketToCreate = {
        ...newTicket,
        assigned_technician_id: technicianId,
        // Convert scheduled_date to proper ISO string format if provided
        scheduled_date: newTicket.scheduled_date ? newTicket.scheduled_date : undefined
      };
      
      const createdTicket = await apiClient.tickets.createTicket(ticketToCreate);
      setTickets([createdTicket, ...tickets]);
      
      // Reset form
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        assigned_technician_id: technicianId,
        customer_name: '',
        customer_phone: '',
        location: '',
        scheduled_date: undefined
      });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
      console.error('Error creating ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, newStatus: 'assigned' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await apiClient.technicians.updateTicketStatus(technicianId, ticketId, { status: newStatus });
      // Reload tickets to get updated status
      await loadTechnicianTickets();
    } catch (err) {
      setError('Failed to update ticket status');
      console.error('Error updating ticket status:', err);
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="ticket-open-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-open-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🔧 Technician Dashboard</h1>
          <p className="technician-info">Welcome, Technician #{technicianId}</p>
          <div className="ticket-stats">
            <span className="stat-item">
              📊 {tickets.length} Total Tickets
            </span>
            <span className="stat-item">
              🚀 {tickets.filter(t => t.status === 'in_progress').length} In Progress
            </span>
            <span className="stat-item">
              ⏳ {tickets.filter(t => t.status === 'assigned').length} Pending
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={loadTechnicianTickets}
            disabled={loading}
            title="Refresh tickets"
          >
            {loading ? '⏳' : '🔄'} Refresh
          </button>
          <button 
            className={`btn btn-primary ${showCreateForm ? 'btn-secondary' : ''}`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '❌ Cancel' : '📝 Open New Ticket'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={loadTechnicianTickets} className="btn btn-small btn-retry">
            🔄 Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-ticket-section">
          <h2>📋 Open New Service Ticket</h2>
          <form onSubmit={handleCreateTicket} className="ticket-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">
                  <span className="label-icon">📌</span>
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="e.g., Elevator stuck on 3rd floor"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="priority">
                  <span className="label-icon">⭐</span>
                  Priority
                </label>
                <select
                  id="priority"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                  <option value="urgent">🚨 Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <span className="label-icon">📝</span>
                Problem Description
              </label>
              <textarea
                id="description"
                value={newTicket.description || ''}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">
                  <span className="label-icon">📍</span>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newTicket.location || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                  placeholder="Building, floor, room number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="scheduled_date">
                  <span className="label-icon">📅</span>
                  Scheduled Date
                </label>
                <input
                  type="datetime-local"
                  id="scheduled_date"
                  value={newTicket.scheduled_date || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, scheduled_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer_name">
                  <span className="label-icon">👤</span>
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={newTicket.customer_name || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
                  placeholder="Customer or contact person"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customer_phone">
                  <span className="label-icon">📞</span>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  value={newTicket.customer_phone || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, customer_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-submit"
                disabled={submitting}
              >
                {submitting ? '⏳ Creating...' : '✅ Open Ticket'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tickets-section">
        <div className="section-header">
          <h2>🎫 Your Active Tickets ({tickets.length})</h2>
          <button onClick={loadTechnicianTickets} className="btn btn-small btn-refresh">
            🔄 Refresh
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="no-tickets">
            <div className="no-tickets-icon">🎫</div>
            <h3>No tickets assigned</h3>
            <p>You don't have any tickets assigned to you yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              📝 Open Your First Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-title-row">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <span className="priority-indicator">
                      {getPriorityIcon(ticket.priority)}
                    </span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="ticket-details">
                  <p className="ticket-number">
                    <strong>#{ticket.ticket_number}</strong>
                  </p>
                  
                  {ticket.description && (
                    <p className="ticket-description">{ticket.description}</p>
                  )}
                  
                  <div className="ticket-meta">
                    {ticket.location && (
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{ticket.location}</span>
                      </div>
                    )}
                    {ticket.customer_name && (
                      <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span>{ticket.customer_name}</span>
                      </div>
                    )}
                    {ticket.customer_phone && (
                      <div className="meta-item">
                        <span className="meta-icon">📞</span>
                        <span>{ticket.customer_phone}</span>
                      </div>
                    )}
                    {ticket.scheduled_date && (
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(ticket.scheduled_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ticket-actions">
                  <div className="status-actions">
                    {ticket.status === 'assigned' && (
                      <button 
                        className="btn btn-small btn-start"
                        onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                      >
                        🚀 Start Work
                      </button>
                    )}
                    {ticket.status === 'in_progress' && (
                      <button 
                        className="btn btn-small btn-complete"
                        onClick={() => updateTicketStatus(ticket.id, 'completed')}
                      >
                        ✅ Complete
                      </button>
                    )}
                    {(ticket.status === 'assigned' || ticket.status === 'in_progress') && (
                      <button 
                        className="btn btn-small btn-cancel"
                        onClick={() => updateTicketStatus(ticket.id, 'cancelled')}
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                  <div className="ticket-timestamp">
                    Created: {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketOpenPage;
