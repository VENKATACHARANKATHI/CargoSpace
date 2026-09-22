import React from 'react';
import { BookingHold, User, Capacity, MatchingResult, CargoDeclaration, ViewTab } from '../../types';
import {
  Package, TrendingUp, Clock, CheckCircle2, Search,
  PlusCircle, ArrowRight, MapPin, Ship, AlertCircle,
  Truck, Anchor, BarChart3, Activity, ExternalLink,
  CalendarClock, Weight, Boxes
} from 'lucide-react';

interface TraderDashboardProps {
  currentUser: User;
  bookings: BookingHold[];
  capacities: Capacity[];
  onNavigate: (tab: ViewTab) => void;
}

const STATUS_CONFIG: Record<BookingHold['holdStatus'], { label: string; cls: string; dot: string }> = {
  HOLD:      { label: 'On Hold',   cls: 'badge-amber',  dot: 'bg-amber-400' },
  CONFIRMED: { label: 'Confirmed', cls: 'badge-green',  dot: 'bg-green-400' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red',    dot: 'bg-red-400' },
  EXPIRED:   { label: 'Expired',   cls: 'badge-slate',  dot: 'bg-slate-400' },
  DISPUTED:  { label: 'Disputed',  cls: 'badge-red',    dot: 'bg-red-400' },
};

const MILESTONE_ICONS: Record<string, React.FC<{className?: string}>> = {
  HOLD_CREATED:      Anchor,
  PAYMENT_CONFIRMED: CheckCircle2,
  WAREHOUSE_RECEIVED: Truck,
  INSPECTION_PASSED: AlertCircle,
  CONTAINER_STUFFED: Boxes,
  IN_TRANSIT:        Ship,
  DELIVERED:         CheckCircle2,
};

export const TraderDashboard: React.FC<TraderDashboardProps> = ({
  currentUser, bookings, capacities, onNavigate
}) => {
  const myBookings = bookings.filter(b => b.traderId === currentUser.id);
  const activeHolds = myBookings.filter(b => b.holdStatus === 'HOLD');
  const confirmed   = myBookings.filter(b => b.holdStatus === 'CONFIRMED');
  const inTransit   = myBookings.filter(b =>
    ['WAREHOUSE_RECEIVED','INSPECTION_PASSED','CONTAINER_STUFFED','IN_TRANSIT'].includes(b.milestoneStage)
  );
  const delivered   = myBookings.filter(b => b.milestoneStage === 'DELIVERED');
  const recent      = myBookings.slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ===== WELCOME BANNER ===== */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #12324A 0%, #087E8B 100%)', border: '1px solid rgba(8,126,139,0.4)' }}>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 20px)' }} />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgba(226,234,244,0.75)' }}>
              {greeting()},
            </p>
            <h1 className="text-2xl font-black text-white mt-0.5" style={{ fontFamily: 'Outfit' }}>
              {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(226,234,244,0.7)' }}>
              {currentUser.companyName} · Trader Account
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('SEARCH_BOOK')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{ background: 'white', color: '#12324A', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              <Search className="w-4 h-4" />
              New Booking
            </button>
          </div>
        </div>
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Holds',  value: activeHolds.length, icon: Clock,       cls: 'amber',  sub: 'Awaiting payment' },
          { label: 'Confirmed',     value: confirmed.length,   icon: CheckCircle2, cls: 'green',  sub: 'Bookings locked' },
          { label: 'In Transit',    value: inTransit.length,   icon: Ship,         cls: 'teal',   sub: 'Shipments moving' },
          { label: 'Delivered',     value: delivered.length,   icon: Package,      cls: 'navy',   sub: 'All-time deliveries' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls} animate-fade-in-up`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.07)' }}>
                <s.icon className="w-5 h-5" style={{ color: '#5ecad4' }} />
              </div>
              <span className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{s.value}</span>
            </div>
            <div className="text-sm font-semibold text-white">{s.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ===== QUICK ACTIONS + RECENT BOOKINGS ===== */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Quick Actions (2 col) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit' }}>Quick Actions</h2>

          <button
            onClick={() => onNavigate('SEARCH_BOOK')}
            className="w-full glass-card rounded-2xl p-4 text-left group transition-all cursor-pointer hover:border-teal-500/40"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, rgba(8,126,139,0.3), rgba(8,126,139,0.1))' }}>
                <Search className="w-5 h-5" style={{ color: '#5ecad4' }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Search Capacity</div>
                <div className="text-xs" style={{ color: '#7a9ab5' }}>Find available freight slots</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" style={{ color: '#5ecad4' }} />
            </div>
            <p className="text-xs" style={{ color: '#7a9ab5', lineHeight: '1.6' }}>
              Declare your cargo — dimensions, weight, readiness date — and compare constraint-aware quotes from verified LSPs.
            </p>
          </button>

          <button
            onClick={() => onNavigate('MY_BOOKINGS')}
            className="w-full glass-card rounded-2xl p-4 text-left group transition-all cursor-pointer hover:border-teal-500/40"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))' }}>
                <CalendarClock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Track Bookings</div>
                <div className="text-xs" style={{ color: '#7a9ab5' }}>Live shipment milestones</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" style={{ color: '#5ecad4' }} />
            </div>
            <p className="text-xs" style={{ color: '#7a9ab5', lineHeight: '1.6' }}>
              Monitor each booking from hold creation → payment → warehouse → vessel → delivery.
            </p>
          </button>

          <button
            onClick={() => onNavigate('RESEARCH_BENCHMARK')}
            className="w-full glass-card rounded-2xl p-4 text-left group transition-all cursor-pointer hover:border-teal-500/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))' }}>
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Matching Benchmark</div>
                <div className="text-xs" style={{ color: '#7a9ab5' }}>Research: constraint vs volume-only</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" style={{ color: '#5ecad4' }} />
            </div>
          </button>
        </div>

        {/* Recent Bookings (3 col) */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit' }}>My Recent Bookings</h2>
            <button onClick={() => onNavigate('MY_BOOKINGS')} className="text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline" style={{ color: '#5ecad4' }}>
              View all <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#5ecad4' }} />
              <p className="text-sm font-semibold text-white mb-1">No bookings yet</p>
              <p className="text-xs mb-4" style={{ color: '#7a9ab5' }}>Search for available capacity to get started.</p>
              <button onClick={() => onNavigate('SEARCH_BOOK')} className="btn-primary text-sm py-2">
                <Search className="w-4 h-4" /> Search Capacity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((b, i) => {
                const st = STATUS_CONFIG[b.holdStatus];
                const MIcon = MILESTONE_ICONS[b.milestoneStage] || Package;
                return (
                  <div key={b.id} className="glass-card rounded-2xl p-4 animate-fade-in-up cursor-pointer hover:border-teal-500/30 transition-all"
                       style={{ animationDelay: `${i * 0.06}s` }}
                       onClick={() => onNavigate('MY_BOOKINGS')}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{ background: 'rgba(8,126,139,0.15)' }}>
                        <span style={{ color: '#5ecad4', display: 'flex' }}><MIcon className="w-4 h-4" /></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white truncate">{b.lspName}</span>
                          <span className={`badge ${st.cls}`}>{st.label}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs flex-wrap" style={{ color: '#7a9ab5' }}>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {b.cargo.originPort.split(' ')[0]}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{b.cargo.destinationPort.split(' ')[0]}</span>
                          <span className="mx-1">·</span>
                          <span className="flex items-center gap-1">
                            <Weight className="w-3 h-3" />
                            {b.cargo.cbm} CBM
                          </span>
                          <span className="mx-1">·</span>
                          <span className="font-semibold" style={{ color: '#5ecad4' }}>
                            ₹{b.quote.totalQuoteInr.toLocaleString()}
                          </span>
                        </div>
                        {/* Mini progress */}
                        <div className="flex items-center gap-1 mt-2">
                          {b.milestoneHistory.map((m, mi) => (
                            <div key={mi} className="flex-1 h-1 rounded-full"
                                 style={{
                                   background: m.isCompleted
                                     ? '#087E8B'
                                     : m.isCurrent
                                     ? '#f59e0b'
                                     : 'rgba(255,255,255,0.06)'
                                 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== AVAILABLE CAPACITY SNAPSHOT ===== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit' }}>Available Capacity</h2>
          <button onClick={() => onNavigate('SEARCH_BOOK')} className="text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline" style={{ color: '#5ecad4' }}>
            Search all <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {capacities.filter(c => !c.isStale && c.isBookable).slice(0, 3).map((cap, i) => {
            const fillPct = Math.round((1 - cap.freeCbm / cap.totalCbm) * 100);
            return (
              <div key={cap.id} className="glass-card rounded-2xl p-4 cursor-pointer animate-fade-in-up transition-all"
                   style={{ animationDelay: `${i * 0.07}s` }}
                   onClick={() => onNavigate('SEARCH_BOOK')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-white">{cap.lspName}</div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: '#7a9ab5' }}>
                      <span>{cap.originPort.split(' ')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{cap.destinationPort.split(' ')[0]}</span>
                    </div>
                  </div>
                  <span className="badge badge-teal">{cap.containerType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-xs" style={{ color: '#7a9ab5' }}>
                    {cap.freeCbm.toFixed(1)} CBM free of {cap.totalCbm} CBM
                  </span>
                  <span className="text-xs font-semibold" style={{ color: fillPct > 80 ? '#f87171' : '#5ecad4' }}>
                    {100 - fillPct}% free
                  </span>
                </div>
                <div className="capacity-bar-track">
                  <div className={`capacity-bar-fill ${fillPct > 80 ? 'danger' : fillPct > 60 ? 'warning' : ''}`}
                       style={{ width: `${fillPct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2.5 text-xs" style={{ color: '#7a9ab5' }}>
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> ETD: {cap.etd}</span>
                  <button onClick={() => onNavigate('SEARCH_BOOK')} className="font-semibold" style={{ color: '#5ecad4' }}>
                    Book →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
