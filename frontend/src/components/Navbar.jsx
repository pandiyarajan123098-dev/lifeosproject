import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  LogOut,
  User,
  LayoutDashboard,
  CheckSquare,
  History,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Daily Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'History', path: '/history', icon: History },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cardBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-mainText tracking-tight">
            Life<span className="text-primary">OS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary-dark font-semibold'
                      : 'text-secondaryText hover:text-mainText hover:bg-page'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondaryText">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
          </nav>
        )}

        {/* Right CTA / User Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-cardBorder hover:border-primary-300 text-xs font-medium text-mainText transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
                  {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
                </div>
                <span>{user?.firstName || user?.fullName?.split(' ')[0] || 'Account'}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-secondaryText hover:text-red-600 hover:bg-red-50"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
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
                  Get Started
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
            className="p-2 rounded-lg text-secondaryText hover:text-mainText hover:bg-page focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cardBorder bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-cardBorder/60 mb-2">
                <p className="text-xs text-secondaryText">Signed in as</p>
                <p className="text-sm font-semibold text-mainText">{user?.fullName || user?.email}</p>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary-light text-primary-dark font-semibold'
                        : 'text-secondaryText hover:bg-page'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-cardBorder/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="primary" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
