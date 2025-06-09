import React, { ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast'; // Hypothetical toast library for user feedback

// Define the shape of the currentUser object
interface User {
  email: string;
  // Add other properties as needed (e.g., name, id)
}

// Define the shape of the AuthContext
interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  // Memoize handleLogout to prevent unnecessary re-renders
  const handleLogout = useCallback(async () => {
    if (!currentUser) {
      toast.error('No user is logged in');
      return;
    }
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  }, [currentUser, logout, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">IT Inventory Management</h1>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2" aria-label="User information">
                <User size={18} className="text-gray-500" aria-hidden="true" />
                <span className="text-sm text-gray-600">{currentUser.email}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-600">Guest</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
              aria-label="Log out of the application"
              disabled={!currentUser} // Disable button if no user is logged in
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Logout</span>
            </Button>
          </div>
        </header>
        <main className="inventory-main-content p-6 overflow-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}