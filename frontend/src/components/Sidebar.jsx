import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  History,
  User,
  Settings,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onNavigate) onNavigate();
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { to: '/history', label: 'Task History', icon: History },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/profile', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-cardBorder select-none">
      {/* Top Branding & Collapse Button */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-cardBorder shrink-0">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-control bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white shadow-soft shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="text-lg font-bold text-mainText tracking-tight block leading-tight">
                Life<span className="text-primary">OS</span>
              </span>
              <span className="text-[10px] font-medium text-secondaryText uppercase tracking-wider block">
                Productivity Hub
              </span>
            </div>
          )}
        </NavLink>

        {/* Collapsible toggle - only shown on desktop */}
        {setCollapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-secondaryText hover:text-mainText hover:bg-page transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-secondaryText mb-2">
            Workspace
          </p>
        )}

        {navItems.map((item, idx) => {
          const Icon = item.icon;
          // Distinguish Profile and Settings
          const isSettings = item.label === 'Settings';
          return (
            <NavLink
              key={`${item.to}-${idx}`}
              to={item.to}
              onClick={onNavigate}
              end={item.to === '/dashboard'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => {
                // If it's settings, make active only if matching hash or profile
                const active = isActive && (!isSettings || window.location.hash === '#settings');
                return `flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-all group ${
                  active
                    ? 'bg-primary-light text-primary-dark font-semibold shadow-soft'
                    : 'text-secondaryText hover:text-mainText hover:bg-page'
                } ${collapsed ? 'justify-center px-0' : ''}`;
              }}
            >
              <Icon className="w-5 h-5 shrink-0 text-primary transition-transform group-hover:scale-110" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Motivation Card when expanded */}
        {!collapsed && (
          <div className="pt-4">
            <div className="p-3.5 rounded-card bg-gradient-to-br from-page to-primary-50/60 border border-cardBorder text-xs">
              <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                <Flame className="w-4 h-4 fill-primary/20" />
                <span>Daily Consistency</span>
              </div>
              <p className="text-[11px] text-secondaryText leading-relaxed">
                Complete daily micro-tasks to maintain your growth momentum.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-cardBorder shrink-0 bg-white">
        {!collapsed ? (
          <div className="space-y-2">
            <NavLink
              to="/profile"
              onClick={onNavigate}
              className="p-2 rounded-control bg-page hover:bg-primary-50 border border-cardBorder flex items-center gap-2.5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary-200">
                {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-mainText truncate group-hover:text-primary">
                  {user?.fullName || 'LifeOS User'}
                </p>
                <p className="text-[10px] text-secondaryText truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  {user?.skillLevel || 'Member'}
                </p>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-control text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/profile"
              onClick={onNavigate}
              title={user?.fullName || 'User Profile'}
              className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center hover:scale-105 transition-transform border border-primary-200"
            >
              {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              aria-label="Log Out"
              className="p-2 rounded-control text-secondaryText hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
