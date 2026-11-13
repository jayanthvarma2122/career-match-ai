import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  Bot,
  History,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/analyzer', icon: FileSearch },
    { name: 'Job Matcher', path: '/job-matcher', icon: Briefcase },
    { name: 'AI Career Assistant', path: '/career-assistant', icon: Bot },
    { name: 'Analysis History', path: '/history', icon: History },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  const getPageTitle = () => {
    const item = navItems.find((n) => n.path === location.pathname);
    return item ? item.name : 'CareerMatch AI';
  };

  return (
    <div className="min-h-screen flex bg-[#F1F1F1] text-[#111111]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Monochrome Sleek Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E5E5E5] flex flex-col justify-between transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-14 px-5 flex items-center justify-between border-b border-[#E5E5E5]">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-bold text-xs shadow-2xs">
                <span>C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[#111111]">
                  CareerMatch
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F3F3F3] text-[#777777] border border-[#E5E5E5]">
                  AI
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3] transition"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            <div className="px-2.5 pt-2 pb-1.5 text-[10px] font-medium text-[#777777] uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#111111] text-[#FFFFFF]'
                      : 'text-[#777777] hover:text-[#111111] hover:bg-[#F3F3F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#777777]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="p-3 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F3F3F3] transition-colors border border-transparent hover:border-[#E5E5E5]">
            <div
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFFFFF] flex items-center justify-center font-semibold text-xs shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-[#111111] truncate leading-tight">
                  {user?.name || 'Student Candidate'}
                </p>
                <p className="text-[10px] text-[#777777] truncate leading-tight">
                  {user?.college || 'B.Tech CSE'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#E5E5E5] rounded-md transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5] bg-[#FFFFFF] sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-[#777777] hover:bg-[#F3F3F3]"
              title="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#777777]">
              <span className="hidden sm:inline">Platform</span>
              <span className="hidden sm:inline text-[#E5E5E5]">/</span>
              <h1 className="text-xs sm:text-sm font-semibold text-[#111111]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Header Action: Monochrome Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/analyzer')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#FFFFFF] text-xs font-medium shadow-2xs transition"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Analyze Resume</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
