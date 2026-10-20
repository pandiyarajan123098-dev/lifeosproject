import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LogOut,
  User,
  LayoutDashboard,
  CheckSquare,
  History,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group focus:outline-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-control bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-mainText tracking-tight">
            Life<span className="text-primary">OS</span>
          </span>
        </Link>

        {/* Public Landing Links */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondaryText">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-secondaryText hover:text-primary hover:bg-page px-3 py-1.5 rounded-control transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className="text-sm font-medium text-secondaryText hover:text-primary hover:bg-page px-3 py-1.5 rounded-control transition-colors"
            >
              My Tasks
            </Link>
            <Link
              to="/history"
              className="text-sm font-medium text-secondaryText hover:text-primary hover:bg-page px-3 py-1.5 rounded-control transition-colors"
            >
              History
            </Link>
          </nav>
        )}

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 py-1.5 px-3 rounded-control border border-cardBorder hover:border-primary-300 text-xs font-semibold text-mainText transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-secondaryText hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 rounded-lg text-secondaryText hover:text-mainText hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cardBorder bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-card">
          {!isAuthenticated ? (
            <>
              <div className="flex flex-col space-y-2 font-medium text-sm text-secondaryText pb-3 border-b border-cardBorder/60">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-primary transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-primary transition-colors"
                >
                  Benefits
                </a>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="py-2 border-b border-cardBorder/60">
                <p className="text-xs text-secondaryText">Signed in as</p>
                <p className="text-sm font-semibold text-mainText">{user?.fullName || user?.email}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-control text-sm font-medium text-secondaryText hover:bg-page hover:text-mainText"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-control text-sm font-medium text-secondaryText hover:bg-page hover:text-mainText"
                >
                  <CheckSquare className="w-4 h-4 text-primary" />
                  My Tasks
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-control text-sm font-medium text-secondaryText hover:bg-page hover:text-mainText"
                >
                  <History className="w-4 h-4 text-primary" />
                  Task History
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-control text-sm font-medium text-secondaryText hover:bg-page hover:text-mainText"
                >
                  <User className="w-4 h-4 text-primary" />
                  Profile & Settings
                </Link>
              </div>
              <div className="pt-2 border-t border-cardBorder/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
