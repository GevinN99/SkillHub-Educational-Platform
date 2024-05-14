import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function LearnerTickets() {
  const [tickets, setTickets] = useState([]); // Changed to an array to handle multiple tickets
  const navigate = useNavigate();
  const learnerId = localStorage.getItem("learnerId");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:8074/api/tickets/${learnerId}`);
        setTickets(response.data); // Assuming the API returns an array of tickets
      } catch (error) {
        console.error('Error fetching data: ', error);
        setTickets([]);
      }
    };
    fetchTickets();
  }, [learnerId]);

  const handleDelete = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8074/api/tickets/${ticketId}`);
      // Refresh the list of tickets after deletion
      const updatedTickets = tickets.filter(ticket => ticket._id !== ticketId);
      setTickets(updatedTickets);
      alert('Ticket deleted successfully');
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const createTicket = () => {
    navigate('/submit');
  };

  return (
    <div className="container mt-5">
      <h2>User Submitted Tickets</h2>
      <Button className="mb-3" variant="primary" onClick={createTicket}>Create Ticket</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>State</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? tickets.map((ticket) => (
            <tr key={ticket._id} className={ticket.state === 'resolved' ? 'table-success' : ''}>
              <td>{ticket.name}</td>
              <td>{ticket.email}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.message}</td>
              <td>{ticket.state}</td>
              <td>{ticket.replies && ticket.replies.length > 0 ? ticket.replies[0].message : 'No replies'}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(ticket._id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="7" className="text-center">No tickets found.</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default LearnerTickets;
