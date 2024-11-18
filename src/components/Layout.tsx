import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, LayoutDashboard, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5001'; // Replace with your actual API URL

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [brandName, setBrandName] = useState('Nana');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userm,setUserm] =useState([])
 // const API_BASE_URL = 'http://localhost:5001';
  const API_BASE_URL=process.env.REACT_APP_BASE_API_URL

   const url=API_BASE_URL+'/api/companyRoutes'
  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('company',data[0].company_name,data[0].comp_id)
        const compid=data[0].comp_id
        const comppx=data[0].service_prefix
        localStorage.setItem('companyid', compid);
        localStorage.setItem('compprefix', comppx);
        const compprefix=(localStorage.getItem('compprefix') || '{}');
      //  const compid=JSON.parse(localStorage.getItem('companyid') || '{}');
        console.log('prefix',compprefix)

        setBrandName(data[0].company_name);
      } catch (error) {
        console.error('Error fetching brand name:', error);
        setBrandName('Nana');
      }
    };

    fetchBrandName();
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  }; 
  
 

  console.log('profile', user?.email)
  
  const renderProfileDropdown = () => {
   
    if (!user) return null;

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        {user.type_of_user === 1 && (
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setShowProfileMenu(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        )}
        {(user.type_of_user === 1 || user.type_of_user === 0) && (
          <Link
            to="/change-password"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setShowProfileMenu(false)}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Change Password
          </Link>
        )}
        {(user.type_of_user === 1 || user.type_of_user === 0) && (
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-[#00A3C4]">
              {brandName}
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'text-[#00A3C4]' : 'text-gray-600 hover:text-[#00A3C4]'}
              >
                Home
              </Link>
              <Link 
                to="/submit-ticket" 
                className={location.pathname === '/submit-ticket' ? 'text-[#00A3C4]' : 'text-gray-600 hover:text-[#00A3C4]'}
              >
                Submit Ticket
              </Link>
              <Link 
                to="/my-tickets" 
                className={location.pathname === '/my-tickets' ? 'text-[#00A3C4]' : 'text-gray-600 hover:text-[#00A3C4]'}
              >
                My Tickets
              </Link>
              
              {user && (
                <div className="relative">
                  <button 
                    className="flex items-center text-gray-600 hover:text-[#00A3C4]"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <User className="w-5 h-5 mr-1" />
                    <span className="ml-1">▼</span>
                  </button>
                  
                  {showProfileMenu && renderProfileDropdown()}
                </div>
              )}

              <div className="relative">
                <span>🌐</span>
                <span className="ml-1">▼</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Have a question? Type your search term here..."
            className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;