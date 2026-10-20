import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  History,
  User,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Daily Tasks', icon: CheckSquare },
    { to: '/history', label: 'Task History', icon: History },
    { to: '/profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-cardBorder shrink-0 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-page border border-cardBorder/70 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-soft shrink-0">
            {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-mainText truncate">
              {user?.fullName || 'LifeOS User'}
            </p>
            <p className="text-xs text-secondaryText truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              {user?.skillLevel || 'Active'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-secondaryText mb-2">
            Main Menu
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-soft font-semibold'
                      : 'text-secondaryText hover:text-mainText hover:bg-page'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Motivation Footer Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-light/50 border border-cardBorder/80">
        <div className="flex items-center gap-2 text-primary-dark font-semibold text-xs mb-1">
          <Flame className="w-4 h-4 text-primary fill-primary/20" />
          <span>Daily Consistency</span>
        </div>
        <p className="text-xs text-secondaryText leading-relaxed">
          Small daily actions create compound results over time. Keep going!
        </p>
      </div>
    </aside>
  );
}
