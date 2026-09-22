import React, { useState } from 'react';
import { User, BookingHold } from '../../types';
import {
  LayoutDashboard,
  Search,
  PackageCheck,
  Boxes,
  SlidersHorizontal,
  Inbox,
  PlusCircle,
  ShieldAlert,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Ship,
  Clock,
  UserCheck,
  Zap,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export type ExtendedNavTab =
  | 'TRADER_DASHBOARD'
  | 'CARGO_SEARCH'
  | 'MY_BOOKINGS'
  | 'LSP_DASHBOARD'
  | 'LSP_INBOX'
  | 'PUBLISH_CAPACITY'
  | 'ADMIN_APPROVALS'
  | 'VEHICLE_XRAY'
  | 'RESEARCH_COMPARE';

interface SidebarNavProps {
  currentUser: User;
  activeTab: ExtendedNavTab;
  onNavigate: (tab: ExtendedNavTab) => void;
  onLogout: () => void;
  onSwitchRole: (role: User['role']) => void;
  activeHold?: BookingHold | null;
  holdSecondsLeft?: number;
  myBookingsCount?: number;
  inboxCount?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  onLogout,
  onSwitchRole,
  activeHold,
  holdSecondsLeft,
  myBookingsCount = 0,
  inboxCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Format active hold timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Nav item builder
  const renderNavItem = (
    tab: ExtendedNavTab,
    label: string,
    IconComponent: React.ComponentType<{ className?: string }>,
    badge?: number | string,
    badgeColor?: string
  ) => {
    const isActive = activeTab === tab;
    return (
      <button
        key={tab}
        onClick={() => onNavigate(tab)}
        title={isCollapsed ? label : undefined}
        className={`w-full flex items-center ${
          isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-2.5 space-x-3'
        } rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative group ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 font-bold'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />

        {!isCollapsed && (
          <span className="truncate flex-1 text-left">{label}</span>
        )}

        {!isCollapsed && badge !== undefined && badge !== 0 && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
              badgeColor || 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            {badge}
          </span>
        )}

        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-950/95 border-r border-slate-800 backdrop-blur-xl transition-all duration-300 z-40 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 1. Header & Brand Logo */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Ship className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold font-outfit text-white tracking-wide">CargoSpace</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[130px]">
                LCL Consolidation Engine
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Ship className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer ${
            isCollapsed ? 'mx-auto mt-2' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Role Selector Strip */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/60 relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>ACTIVE ROLE:</span>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600/30 transition cursor-pointer flex items-center space-x-1"
            >
              <span>{currentUser.role}</span>
              <UserCheck className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Role Switch Dropdown */}
          {showRoleDropdown && (
            <div className="absolute left-4 right-4 top-12 z-50 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl space-y-1 animate-fadeIn">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Switch Role Context
              </div>
              <button
                onClick={() => {
                  onSwitchRole('trader');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  currentUser.role === 'trader' ? 'bg-blue-600/20 text-blue-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📦 Export Trader</span>
                {currentUser.role === 'trader' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  onSwitchRole('lsp');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  currentUser.role === 'lsp' ? 'bg-blue-600/20 text-blue-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🚛 Consolidator (LSP)</span>
                {currentUser.role === 'lsp' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  onSwitchRole('admin');
                  setShowRoleDropdown(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  currentUser.role === 'admin' ? 'bg-blue-600/20 text-blue-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🛡️ Platform Admin</span>
                {currentUser.role === 'admin' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Navigation Links List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* TRADER SECTION */}
        {(currentUser.role === 'trader' || currentUser.role === 'admin') && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Trader Console
              </div>
            )}

            {renderNavItem('TRADER_DASHBOARD', 'Dashboard Overview', LayoutDashboard)}
            {renderNavItem('CARGO_SEARCH', 'Search & Book Space', Search)}
            {renderNavItem('MY_BOOKINGS', 'My Holds & Bookings', PackageCheck, myBookingsCount, 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30')}
          </div>
        )}

        {/* LSP SECTION */}
        {(currentUser.role === 'lsp' || currentUser.role === 'admin') && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                LSP Operations
              </div>
            )}

            {renderNavItem('LSP_DASHBOARD', 'LSP Operations Hub', LayoutDashboard)}
            {renderNavItem('LSP_INBOX', 'Booking Request Inbox', Inbox, inboxCount, 'bg-amber-500/20 text-amber-300 border-amber-500/30')}
            {renderNavItem('PUBLISH_CAPACITY', 'Publish Container Space', PlusCircle)}
          </div>
        )}

        {/* ADMIN SECTION */}
        {currentUser.role === 'admin' && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                System Admin
              </div>
            )}
            {renderNavItem('ADMIN_APPROVALS', 'Admin Control & Approvals', ShieldAlert)}
          </div>
        )}

        {/* RESEARCH & ALGORITHM ENGINE */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Research & Benchmark
            </div>
          )}

          {renderNavItem('RESEARCH_COMPARE', 'Matching Engine Specs', SlidersHorizontal, 'SPEC', 'bg-purple-500/20 text-purple-300 border-purple-500/30')}
        </div>

      </div>

      {/* 4. Active Hold Timer Widget in Sidebar */}
      {activeHold && (
        <div className="p-3 border-t border-amber-500/30 bg-amber-950/20">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Active Slot Hold</span>
                </span>
                <span className="font-mono text-amber-400 font-extrabold text-sm">
                  {holdSecondsLeft !== undefined ? formatTime(holdSecondsLeft) : '15:00'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {activeHold.quote.capacity.lspName} • {activeHold.cargo.cbm} CBM
              </p>
              <button
                onClick={() => onNavigate('MY_BOOKINGS')}
                className="w-full py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 rounded text-[10px] font-bold transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Complete Payment</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
              <Clock className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* 5. User Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold flex items-center justify-center shrink-0 shadow">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.companyName}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-10 h-10 mx-auto rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition flex items-center justify-center cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

    </aside>
  );
};
