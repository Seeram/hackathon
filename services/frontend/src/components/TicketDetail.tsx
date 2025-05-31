import React, { useState, useEffect } from 'react';
import { ApiClient, Ticket } from '../api';
import AIAssistantChat from './AIAssistantChat';
import './TicketDetail.css';

interface TicketDetailProps {
  ticketId: number;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new ApiClient({
    baseURL: process.env.REACT_APP_API_URL || '/api',
  });

  useEffect(() => {
    loadTicketDetails();
  }, [ticketId]);

  const loadTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const ticketData = await apiClient.tickets.getTicket(ticketId);
      setTicket(ticketData);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error('Error loading ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAIMessageSent = (message: string) => {
    console.log('AI message sent:', message);
    // You can add any additional logic here when a message is sent to the AI
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#007bff';
      case 'in_progress': return '#ffc107';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'urgent': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-container">
        <div className="loading-spinner">Loading ticket details...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="ticket-detail-container">
        <div className="error-message">
          {error || 'Ticket not found'}
          <button onClick={onBack} className="btn btn-secondary">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-header">
        <button onClick={onBack} className="btn btn-secondary back-button">
          ← Back to Tickets
        </button>
        <h1>Ticket Details</h1>
      </div>

      <div className="ticket-detail-content">
        <div className="ticket-info-section">
          <div className="ticket-header-info">
            <h2>{ticket.title}</h2>
            <div className="ticket-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(ticket.status) }}
              >
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(ticket.priority) }}
              >
                {ticket.priority.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="ticket-details-grid">
            <div className="detail-item">
              <label>Ticket Number:</label>
              <span>#{ticket.ticket_number}</span>
            </div>
            <div className="detail-item">
              <label>Created:</label>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>Last Updated:</label>
              <span>{new Date(ticket.updated_at).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>Assigned Technician:</label>
              <span>Technician #{ticket.assigned_technician_id}</span>
            </div>
            <div className="detail-item">
              <label>Customer:</label>
              <span>{ticket.customer_name || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <span>{ticket.customer_phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Location:</label>
              <span>{ticket.location || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Scheduled Date:</label>
              <span>{ticket.scheduled_date ? new Date(ticket.scheduled_date).toLocaleString() : 'Not scheduled'}</span>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <div className="description-content">
              {ticket.description}
            </div>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="attachments-section">
              <h3>Attachments</h3>
              <div className="attachments-list">
                {ticket.attachments.map(attachment => (
                  <div key={attachment.id} className="attachment-item">
                    📎 {attachment.file_name} ({attachment.file_type})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AIAssistantChat 
          ticketId={ticket.id}
          onMessageSent={handleAIMessageSent}
          placeholder={`Ask about ticket #${ticket.ticket_number}...`}
        />
      </div>
    </div>
  );
};

export default TicketDetail;
