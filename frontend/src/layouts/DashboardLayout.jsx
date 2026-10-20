import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible desktop sidebar state (default: expanded)
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('lifeos_sidebar_collapsed') === 'true';
  });

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync collapsed state to localStorage
  const handleToggleCollapse = (val) => {
    setCollapsed(val);
    localStorage.setItem('lifeos_sidebar_collapsed', String(val));
  };

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  // Derive page title for breadcrumb
  const pageTitles = {
    '/dashboard': 'Dashboard Overview',
    '/tasks': 'Daily Action Plan',
    '/history': 'Task History',
    '/profile': 'Profile & Preferences',
  };
  const currentTitle = pageTitles[location.pathname] || 'LifeOS';

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans text-mainText selection:bg-primary-light selection:text-primary-dark">
      {/* 1. Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 transition-all duration-200 ${
          collapsed ? 'w-[80px]' : 'w-[260px]'
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={handleToggleCollapse}
        />
      </aside>

      {/* 2. Mobile Slide-out Drawer & Backdrop */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
            {/* Mobile Drawer Header with Close Button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-cardBorder">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-primary flex items-center justify-center text-white shadow-soft">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-mainText">LifeOS</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-lg text-secondaryText hover:text-mainText hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content in drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                collapsed={false}
                onNavigate={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Main View Area (Adjusts left margin for desktop sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          collapsed ? 'lg:pl-[80px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-cardBorder px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger or Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-secondaryText hover:text-mainText hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Brand Title */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="font-bold text-base text-mainText">
                Life<span className="text-primary">OS</span>
              </span>
            </div>

            {/* Desktop Page Title */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                Workspace
              </span>
              <span className="text-xs text-cardBorder font-bold">/</span>
              <h2 className="text-sm font-semibold text-mainText">{currentTitle}</h2>
            </div>
          </div>

          {/* Right: User Quick Info */}
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-control hover:bg-page border border-transparent hover:border-cardBorder transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary-200">
                {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-mainText leading-tight">
                  {user?.firstName || user?.fullName?.split(' ')[0] || 'Profile'}
                </p>
                <p className="text-[10px] text-secondaryText leading-tight">
                  {user?.skillLevel || 'Active'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Container with responsive padding */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
