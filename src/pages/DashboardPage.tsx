import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Clock, 
  Users, 
  AlertCircle, 
  MessageSquare,
  CheckSquare,
  Archive,
  AlertTriangle,
  Trash2,
  Filter,
  Contact,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const stats = [
    { title: 'Open Tickets', count: 28, icon: Ticket },
    { title: 'My Tickets', count: 10, icon: MessageSquare },
    { title: 'Overdue Tickets', count: 28, icon: Clock },
    { title: 'Unassigned Tickets', count: 9, icon: Users },
    { title: 'Unanswered Tickets', count: 14, icon: AlertCircle },
    { title: 'My Pending Approvals', count: 0, icon: CheckSquare },
    { title: 'My Due Today', count: 0, icon: Clock },
    { title: 'Open Problems', count: 0, icon: AlertTriangle },
    { title: 'Active Contracts', count: 0, icon: Archive }
  ];

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Tickets', icon: Ticket, path: '/tickets' },
    { title: 'Create Ticket', icon: MessageSquare, path: '/submit-ticket' },
    { title: 'Open Tickets', icon: AlertCircle, path: '/open-tickets' },
    { title: 'My Tickets', icon: CheckSquare, path: '/my-tickets' },
    { title: 'Unassigned Tickets', icon: Users, path: '/unassigned-tickets' },
    { title: 'Overdue Tickets', icon: Clock, path: '/overdue-tickets' },
    { title: 'Unanswered Tickets', icon: MessageSquare, path: '/unanswered-tickets' },
    { title: 'Unapproved Tickets', icon: AlertTriangle, path: '/unapproved-tickets' },
    { title: 'My Pending Approvals', icon: Clock, path: '/pending-approvals' },
    { title: 'Closed Tickets', icon: Archive, path: '/closed-tickets' },
    { title: 'Spam', icon: AlertTriangle, path: '/spam' },
    { title: 'Trash', icon: Trash2, path: '/trash' },
    { title: 'My Filters', icon: Filter, path: '/filters' },
    { title: 'Contacts', icon: Contact, path: '/contacts' },
    { title: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-[#2C3E50] text-white transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        } min-h-screen`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {isExpanded && <span className="text-xl font-bold">HELPDESK</span>}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#34495E] rounded-full"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 hover:bg-[#34495E] transition-colors ${
                isExpanded ? 'space-x-4' : 'justify-center'
              }`}
            >
              <item.icon size={20} />
              {isExpanded && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
                    <p className="mt-1 text-3xl font-semibold text-[#00A3C4]">
                      {stat.count}
                    </p>
                  </div>
                  <div className="bg-[#00A3C4] bg-opacity-10 p-3 rounded-full">
                    <stat.icon className="w-6 h-6 text-[#00A3C4]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-4">
                      <div className="bg-[#00A3C4] bg-opacity-10 p-2 rounded-full">
                        <Ticket className="w-5 h-5 text-[#00A3C4]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Ticket #{item} was updated
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;