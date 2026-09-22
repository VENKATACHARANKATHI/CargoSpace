import React, { useState } from 'react';
import { User, ViewTab } from '../../types';
import {
  Package, Ship, ShieldCheck, Search, BookmarkCheck,
  Box, BarChart3, Boxes, Inbox, PlusCircle, Clock,
  LogOut, Menu, X, Home, ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (userRole: User['role']) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onResetDemoData: () => void;
  users: User[];
  holdCountdown?: number;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

const TRADER_TABS = [
  { id: 'TRADER_DASHBOARD' as any, label: 'Dashboard',      icon: Home },
  { id: 'SEARCH_BOOK'       as ViewTab, label: 'Search & Book', icon: Search },
  { id: 'MY_BOOKINGS'       as ViewTab, label: 'My Bookings',   icon: BookmarkCheck },
];

const LSP_TABS = [
  { id: 'LSP_DASHBOARD' as any, label: 'Dashboard',       icon: Home },
  { id: 'LSP_CAPACITY'   as ViewTab, label: 'Publish Capacity', icon: PlusCircle },
  { id: 'LSP_INBOX'      as ViewTab, label: 'Bookings Inbox',   icon: Inbox },
  { id: 'LSP_ONBOARDING' as ViewTab, label: 'Inspection',       icon: ShieldCheck },
];

const ADMIN_TABS = [
  { id: 'ADMIN_APPROVALS' as ViewTab, label: 'LSP Approvals', icon: ShieldCheck },
  { id: 'ADMIN_BOOKINGS'  as ViewTab, label: 'All Bookings',  icon: Package },
];

const ROLE_COLOR = {
  trader: { bg: 'rgba(8,126,139,0.2)', text: '#5ecad4', border: 'rgba(8,126,139,0.4)' },
  lsp:    { bg: 'rgba(59,130,246,0.2)',  text: '#93c5fd', border: 'rgba(59,130,246,0.4)' },
  admin:  { bg: 'rgba(139,92,246,0.2)', text: '#c4b5fd', border: 'rgba(139,92,246,0.4)' },
};

export const Header: React.FC<HeaderProps> = ({
  currentUser, onSwitchUser, activeTab, setActiveTab,
  onResetDemoData, users, holdCountdown, onOpenAuthModal, onLogout
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const tabs = currentUser.role === 'trader' ? TRADER_TABS
             : currentUser.role === 'lsp'    ? LSP_TABS
             : ADMIN_TABS;

  const roleBadge = ROLE_COLOR[currentUser.role];
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-50"
            style={{ background: 'rgba(10, 25, 41, 0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(8,126,139,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ===== BRAND ===== */}
          <div className="flex items-center gap-3 cursor-pointer flex-shrink-0"
               onClick={() => setActiveTab(currentUser.role === 'trader' ? 'SEARCH_BOOK' : currentUser.role === 'lsp' ? 'LSP_CAPACITY' : 'ADMIN_APPROVALS')}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #087E8B, #065d67)', boxShadow: '0 0 16px rgba(8,126,139,0.35)' }}>
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-black leading-none text-white" style={{ fontFamily: 'Outfit' }}>
                Cargo<span style={{ color: '#5ecad4' }}>Space</span>
              </div>
              <div className="text-[10px] leading-none mt-0.5" style={{ color: '#7a9ab5' }}>LCL Freight Platform</div>
            </div>
          </div>

          {/* ===== NAV TABS (desktop) ===== */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ViewTab)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  style={isActive ? {
                    background: 'rgba(8,126,139,0.18)',
                    color: '#5ecad4',
                    border: '1px solid rgba(8,126,139,0.3)'
                  } : {
                    color: '#7a9ab5',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#e2eaf4'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#7a9ab5'; }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}

            {/* Separator */}
            <div className="w-px h-5 mx-1" style={{ background: 'rgba(8,126,139,0.2)' }} />

            {/* Research + 3D (always visible) */}
            <button onClick={() => setActiveTab('RESEARCH_BENCHMARK')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={activeTab === 'RESEARCH_BENCHMARK' ? {
                background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)'
              } : { color: '#7a9ab5', border: '1px solid transparent' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2eaf4'}
              onMouseLeave={e => { if (activeTab !== 'RESEARCH_BENCHMARK') e.currentTarget.style.color = '#7a9ab5'; }}
            >
              <BarChart3 className="w-4 h-4" /> Research
            </button>

            <button onClick={() => setActiveTab('3D_CONTAINER_VISUALIZER')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={activeTab === '3D_CONTAINER_VISUALIZER' ? {
                background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)'
              } : { color: '#7a9ab5', border: '1px solid transparent' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2eaf4'}
              onMouseLeave={e => { if (activeTab !== '3D_CONTAINER_VISUALIZER') e.currentTarget.style.color = '#7a9ab5'; }}
            >
              <Box className="w-4 h-4" /> 3D X-Ray
            </button>
          </nav>

          {/* ===== RIGHT SECTION ===== */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Hold countdown */}
            {holdCountdown !== undefined && holdCountdown > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl animate-pulse text-xs font-mono font-bold"
                   style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }}>
                <Clock className="w-3.5 h-3.5" />
                Hold: {fmt(holdCountdown)}
              </div>
            )}

            {/* Role switcher (evaluator tool) */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                style={{ background: roleBadge.bg, color: roleBadge.text, border: `1px solid ${roleBadge.border}` }}
              >
                {currentUser.role.toUpperCase()}
                <ChevronDown className={`w-3 h-3 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
              </button>
              {roleOpen && (
                <div className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-50"
                     style={{ background: '#0f2337', border: '1px solid rgba(8,126,139,0.2)', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7a9ab5' }}>
                    Switch Demo Role
                  </div>
                  {(['trader', 'lsp', 'admin'] as const).map(r => (
                    <button key={r} onClick={() => { onSwitchUser(r); setRoleOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-left transition-all cursor-pointer"
                      style={{ color: currentUser.role === r ? '#5ecad4' : '#e2eaf4', background: currentUser.role === r ? 'rgba(8,126,139,0.12)' : 'transparent' }}
                      onMouseEnter={e => { if (currentUser.role !== r) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (currentUser.role !== r) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {r === 'trader' ? <Package className="w-4 h-4" /> : r === 'lsp' ? <Ship className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                      {currentUser.role === r && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  ))}
                  <div className="px-3 py-1.5 border-t" style={{ borderColor: 'rgba(8,126,139,0.15)' }}>
                    <button onClick={() => { onResetDemoData(); setRoleOpen(false); }}
                      className="w-full text-left text-xs font-medium py-1 cursor-pointer"
                      style={{ color: '#7a9ab5' }}>
                      ↺ Reset Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar + Logout */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                title={`${currentUser.name} — click to sign in/up`}
                className="flex items-center gap-2 p-1.5 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(8,126,139,0.1)', border: '1px solid rgba(8,126,139,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(8,126,139,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(8,126,139,0.2)')}
              >
                <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`}
                     alt={currentUser.name}
                     className="w-7 h-7 rounded-lg object-cover"
                     style={{ border: '1px solid rgba(8,126,139,0.3)' }} />
                <div className="hidden sm:block pr-1">
                  <div className="text-xs font-bold text-white leading-none">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[10px] leading-none mt-0.5" style={{ color: '#7a9ab5' }}>{currentUser.email.split('@')[0]}</div>
                </div>
              </button>

              {onLogout && (
                <button onClick={onLogout} title="Sign out"
                  className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                  style={{ background: 'rgba(180,35,24,0.1)', border: '1px solid rgba(180,35,24,0.2)', color: '#f87171' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,35,24,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(180,35,24,0.1)')}>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all"
              style={{ background: 'rgba(8,126,139,0.1)', border: '1px solid rgba(8,126,139,0.2)', color: '#5ecad4' }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE NAV ===== */}
      {mobileOpen && (
        <div className="lg:hidden animate-fade-in"
             style={{ borderTop: '1px solid rgba(8,126,139,0.15)', background: 'rgba(10,25,41,0.98)' }}>
          <div className="px-4 py-3 space-y-1">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id as ViewTab); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left cursor-pointer"
                  style={isActive ? {
                    background: 'rgba(8,126,139,0.15)', color: '#5ecad4', border: '1px solid rgba(8,126,139,0.25)'
                  } : { color: '#7a9ab5' }}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <button onClick={() => { setActiveTab('RESEARCH_BENCHMARK'); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left cursor-pointer"
              style={activeTab === 'RESEARCH_BENCHMARK' ? { background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' } : { color: '#7a9ab5' }}>
              <BarChart3 className="w-4 h-4" /> Research Benchmark
            </button>
            <button onClick={() => { setActiveTab('3D_CONTAINER_VISUALIZER'); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left cursor-pointer"
              style={activeTab === '3D_CONTAINER_VISUALIZER' ? { background: 'rgba(16,185,129,0.12)', color: '#6ee7b7' } : { color: '#7a9ab5' }}>
              <Box className="w-4 h-4" /> 3D X-Ray Cargo
            </button>
            {holdCountdown !== undefined && holdCountdown > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold"
                   style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                <Clock className="w-3.5 h-3.5" /> Active Hold TTL: {fmt(holdCountdown)}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
