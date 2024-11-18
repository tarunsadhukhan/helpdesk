import React from 'react';
import './SubmitTicket.css';  // Ensure to create and link this CSS file

function SubmitTicket() {
  return (
    <div className="submit-ticket-container">
      <header className="ticket-header">
        <h1>SUPPORT CENTER</h1>
        <div className="nav-search-bar">
          <nav className="main-nav">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/submit-ticket">Submit Ticket</a></li>
              <li><a href="/knowledge-base">Knowledge Base</a></li>
              <li><a href="/my-tickets">My Tickets</a></li>
              <li><a href="/my-profile">My Profile</a></li>
            </ul>
          </nav>
          <input type="text" placeholder="Have a question? Type your search term here..." className="search-bar"/>
        </div>
      </header>
      <div className="content">
        <div className="ticket-form">
          <h2>Submit Ticket</h2>
          <form>
            <label>
              Requester:
              <input type="email" value="demo@admin.com" readOnly />
            </label>
            <label>
              Subject:
              <input type="text" placeholder="Short text" required />
            </label>
            <label>
              Priority:
              <select required>
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <button type="submit">Submit Ticket</button>
          </form>
        </div>
        <div className="ticket-summary">
          <h3>Ticket Summary</h3>
          <div className="summary-info">
            <div>Open tickets: 3</div>
            <div>Closed tickets: 0</div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default SubmitTicket;
