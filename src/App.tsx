import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TicketPage from './pages/TicketPage';
import Layout from './components/Layout';
import MyTicketsPage from './pages/MyTicketsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="submit-ticket" element={<TicketPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="change-password"  element={<ChangePasswordPage />  } />
          <Route path="my-tickets"
            element={
            
                <MyTicketsPage />
            
            }
          />
           <Route
               path="ticket/:ticketPrefix/:ticketNumber"
            element={
                <TicketDetailPage />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;