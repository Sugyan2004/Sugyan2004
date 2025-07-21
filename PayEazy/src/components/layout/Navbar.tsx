import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || location.pathname === '/login') return null;

  const getDashboardLink = () => {
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'agent':
        return '/agent';
      default:
        return '/deposit';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PayEazy</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to={getDashboardLink()}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              {user.role === 'customer' && (
                <Link
                  to="/deposit"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Make Deposit
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}