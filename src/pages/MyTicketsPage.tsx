import React, { useState, useEffect } from 'react';
import { Ticket, Filter, Loader } from 'lucide-react';
import { fetchTickets } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface TicketData {
  ticketId: string;
  subject: string;
  requester: string;
  lastReplier: string;
  status: string;
  lastActivity: string;
}

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ open: 0, closed: 0 });

  const loadTickets = async (status?: string) => {
    try {
      setLoading(true);
      const response = await fetchTickets(status);
      if (response?.tickets) {
        setTickets(response.tickets);
        setStats(response.stats || { open: 0, closed: 0 });
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tickets. Please try again.',
        confirmButtonColor: '#00A3C4'
      });
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(activeTab);
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTickets(activeTab);
  };

  /*
  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };
*/
  const handleTicketClick = (ticketId: string) => {
    console.log('Navigating to ticket:', ticketId); // Debug log
    const [prefix, number] = ticketId.split('/');
    const url=`/ticket/${prefix}/${number}`
    console.log(url)
    navigate(url);
    
  };


  const filteredTickets = tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Ticket className="mr-2" /> My Tickets
          </h1>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('open')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'open' ? 'bg-blue-50 text-[#00A3C4]' : 'hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">Open</span>
                <span className={`${
                  activeTab === 'open' ? 'bg-[#00A3C4]' : 'bg-gray-500'
                } text-white px-2 py-0.5 rounded-full text-xs`}>
                  {stats.open}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('closed')}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'closed' ? 'bg-blue-50 text-[#00A3C4]' : 'hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">Closed</span>
                <span className={`${
                  activeTab === 'closed' ? 'bg-[#00A3C4]' : 'bg-gray-500'
                } text-white px-2 py-0.5 rounded-full text-xs`}>
                  {stats.closed}
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                />
              </form>
              <button 
                className="p-2 hover:bg-gray-50 rounded-md" 
                title="Filter tickets"
              >
                <Filter className="text-gray-500" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#00A3C4]" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tickets found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ticket ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Requester</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Replier</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr 
                        key={ticket.ticketId} 
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTicketClick(ticket.ticketId)}
                      >
                        <td className="px-4 py-3 text-sm text-[#00A3C4]">{ticket.ticketId}</td>
                        <td className="px-4 py-3 text-sm text-[#00A3C4]">{ticket.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ticket.requester}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ticket.lastReplier}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === 'open' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(ticket.lastActivity).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;