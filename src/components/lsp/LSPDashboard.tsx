import React, { useState } from 'react';
import { User, LSPProfile, Capacity, BookingHold, ViewTab } from '../../types';
import {
  Ship, PlusCircle, Package, CheckCircle2, Clock,
  BarChart3, TrendingUp, AlertTriangle, RefreshCw,
  ArrowRight, ExternalLink, Anchor, Activity,
  Boxes, FileText, ShieldCheck, XCircle, DollarSign, Award
} from 'lucide-react';
import { TrustCertificateModal } from '../common/TrustCertificateModal';

interface LSPDashboardProps {
  currentUser: User;
  lspProfile: LSPProfile;
  capacities: Capacity[];
  bookings: BookingHold[];
  onNavigate: (tab: ViewTab) => void;
  onOpenPublishModal: () => void;
  onRefreshFreshness: (id: string) => void;
}

const BOOKING_STATUS_CONFIG = {
  HOLD:      { label: 'On Hold',   cls: 'badge-amber' },
  CONFIRMED: { label: 'Confirmed', cls: 'badge-green' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red' },
  EXPIRED:   { label: 'Expired',   cls: 'badge-slate' },
  DISPUTED:  { label: 'Disputed',  cls: 'badge-red' },
};

const LSP_STATUS_CONFIG = {
  approved: { label: 'Approved',  cls: 'badge-green', icon: ShieldCheck },
  pending:  { label: 'Pending Review', cls: 'badge-amber', icon: Clock },
  rejected: { label: 'Rejected',  cls: 'badge-red',   icon: XCircle },
};

export const LSPDashboard: React.FC<LSPDashboardProps> = ({
  currentUser, lspProfile, capacities, bookings, onNavigate,
  onOpenPublishModal, onRefreshFreshness
}) => {
  const [selectedCapForTrustModal, setSelectedCapForTrustModal] = useState<Capacity | null>(null);
  const myCapacities = capacities.filter(c => c.lspId === lspProfile.id);
  const myBookings   = bookings.filter(b => b.lspId === lspProfile.id);

  const pendingBookings = myBookings.filter(b => b.holdStatus === 'HOLD');
  const confirmedBookings = myBookings.filter(b => b.holdStatus === 'CONFIRMED');
  const totalRevenue    = myBookings
    .filter(b => b.holdStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + b.quote.totalQuoteInr, 0);
  const staleCount      = myCapacities.filter(c => c.isStale).length;

  const statusCfg = LSP_STATUS_CONFIG[lspProfile.status];
  const StatusIcon = statusCfg.icon;

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
           style={{ background: 'linear-gradient(135deg, #0a2a1a 0%, #12324A 50%, #087E8B 100%)', border: '1px solid rgba(8,126,139,0.4)' }}>
        <div className="absolute inset-0 hero-dots opacity-30 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgba(226,234,244,0.75)' }}>{greeting()},</p>
            <h1 className="text-2xl font-black text-white mt-0.5" style={{ fontFamily: 'Outfit' }}>
              {currentUser.name.split(' ')[0]} 🚢
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(226,234,244,0.7)' }}>
              {currentUser.companyName} · Logistics Service Provider
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`badge ${statusCfg.cls} flex items-center gap-1.5`}>
                <StatusIcon className="w-3 h-3" />
                {statusCfg.label}
              </span>
              {lspProfile.status === 'approved' && (
                <span className="badge badge-teal">
                  <CheckCircle2 className="w-3 h-3" />
                  {lspProfile.completedShipments} Shipments
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {lspProfile.status === 'approved' ? (
              <button
                onClick={onOpenPublishModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                style={{ background: 'white', color: '#12324A', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <PlusCircle className="w-4 h-4" />
                Publish Capacity
              </button>
            ) : (
              <button
                onClick={() => onNavigate('LSP_ONBOARDING')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer btn-secondary"
              >
                <FileText className="w-4 h-4" />
                View Application
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== PENDING APPROVAL NOTICE ===== */}
      {lspProfile.status === 'pending' && (
        <div className="rounded-2xl p-4 flex items-center gap-4"
             style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(245,158,11,0.15)' }}>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-300">Awaiting Inspection Approval</div>
            <p className="text-xs mt-0.5 text-amber-200/70">
              Your LSP application is under review. Once approved by an inspector and admin, you'll be able to publish bookable capacity.
            </p>
          </div>
          <button onClick={() => onNavigate('LSP_ONBOARDING')} className="ml-auto btn-ghost text-xs py-1.5 px-3 whitespace-nowrap">
            View Status <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Published Slots',  value: myCapacities.length,   icon: Boxes,     cls: 'teal',  sub: 'Total capacity listings' },
          { label: 'Pending Bookings', value: pendingBookings.length, icon: Clock,     cls: 'amber', sub: 'Awaiting confirmation' },
          { label: 'Confirmed Shipments', value: confirmedBookings.length, icon: CheckCircle2, cls: 'green', sub: 'Locked & paid' },
          { label: 'Est. Revenue',     value: `₹${(totalRevenue/1000).toFixed(0)}K`, icon: DollarSign, cls: 'navy', sub: 'From confirmed bookings' },
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

      {/* ===== CAPACITY + PENDING BOOKINGS ===== */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* My Capacity Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit' }}>My Capacity Listings</h2>
            <button onClick={() => onNavigate('LSP_CAPACITY')} className="text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline" style={{ color: '#5ecad4' }}>
              Manage all <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {myCapacities.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Ship className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#5ecad4' }} />
              <p className="text-sm font-semibold text-white mb-1">No capacity published</p>
              {lspProfile.status === 'approved' ? (
                <>
                  <p className="text-xs mb-4" style={{ color: '#7a9ab5' }}>Publish your first consolidation slot to start receiving bookings.</p>
                  <button onClick={onOpenPublishModal} className="btn-primary text-sm py-2">
                    <PlusCircle className="w-4 h-4" /> Publish Capacity
                  </button>
                </>
              ) : (
                <p className="text-xs" style={{ color: '#7a9ab5' }}>Complete your inspection approval to start publishing.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {myCapacities.slice(0, 4).map((cap, i) => {
                const fillPct = Math.round((1 - cap.freeCbm / cap.totalCbm) * 100);
                return (
                  <div key={cap.id} className="glass-card rounded-2xl p-4 animate-fade-in-up"
                       style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{cap.originPort.split(' ')[0]}</span>
                          <ArrowRight className="w-3 h-3" style={{ color: '#7a9ab5' }} />
                          <span className="text-sm font-bold text-white">{cap.destinationPort.split(' ')[0]}</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>ETD: {cap.etd} · {cap.containerType.replace('_', ' ')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cap.isStale && <span className="badge badge-red">Stale</span>}
                        {!cap.isStale && cap.isBookable && <span className="badge badge-green">Live</span>}
                        <button
                          onClick={() => setSelectedCapForTrustModal(cap)}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 hover:bg-emerald-500/30 transition cursor-pointer"
                          title="View Trust & Compliance Certificate"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>APPROVED TRUST</span>
                        </button>
                        <button onClick={() => onRefreshFreshness(cap.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                          style={{ background: 'rgba(8,126,139,0.15)' }} title="Refresh freshness">
                          <RefreshCw className="w-3.5 h-3.5" style={{ color: '#5ecad4' }} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-1.5">
                      <span className="text-xs" style={{ color: '#7a9ab5' }}>
                        {cap.freeCbm.toFixed(1)} / {cap.totalCbm} CBM free
                      </span>
                      <span className="text-xs font-semibold" style={{ color: fillPct > 80 ? '#f87171' : '#5ecad4' }}>
                        {fillPct}% filled
                      </span>
                    </div>
                    <div className="capacity-bar-track">
                      <div className={`capacity-bar-fill ${fillPct > 80 ? 'danger' : fillPct > 60 ? 'warning' : ''}`}
                           style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Bookings Inbox */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit' }}>
              Booking Requests
              {pendingBookings.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                  {pendingBookings.length} new
                </span>
              )}
            </h2>
            <button onClick={() => onNavigate('LSP_INBOX')} className="text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline" style={{ color: '#5ecad4' }}>
              Full inbox <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: '#5ecad4' }} />
              <p className="text-sm font-semibold text-white mb-1">No booking requests yet</p>
              <p className="text-xs" style={{ color: '#7a9ab5' }}>Bookings from traders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.slice(0, 4).map((b, i) => {
                const st = BOOKING_STATUS_CONFIG[b.holdStatus];
                return (
                  <div key={b.id} className="glass-card rounded-2xl p-4 cursor-pointer animate-fade-in-up"
                       style={{ animationDelay: `${i * 0.06}s` }}
                       onClick={() => onNavigate('LSP_INBOX')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ background: 'rgba(8,126,139,0.15)' }}>
                          <Package className="w-4 h-4" style={{ color: '#5ecad4' }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{b.traderName}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>
                            {b.cargo.cbm} CBM · {b.cargo.cargoType}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`badge ${st.cls}`}>{st.label}</span>
                        <span className="text-xs font-bold" style={{ color: '#5ecad4' }}>
                          ₹{b.quote.totalQuoteInr.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== STALE WARNING ===== */}
      {staleCount > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-4"
             style={{ background: 'rgba(180,35,24,0.07)', border: '1px solid rgba(180,35,24,0.3)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div>
            <div className="text-sm font-bold text-red-300">{staleCount} stale listing{staleCount > 1 ? 's' : ''} detected</div>
            <p className="text-xs text-red-200/60 mt-0.5">
              Stale inventory is hidden from trader search results. Refresh freshness to re-activate.
            </p>
          </div>
          <button onClick={() => onNavigate('LSP_CAPACITY')} className="ml-auto btn-ghost text-xs py-1.5 px-3 whitespace-nowrap">
            Fix Now <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ===== QUICK NAV ===== */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: PlusCircle, label: 'Publish Capacity', sub: 'Add new consolidation slot', tab: null, action: onOpenPublishModal },
          { icon: Ship, label: 'Inspection Profile', sub: 'View approval status & checklist', tab: 'LSP_ONBOARDING' as ViewTab },
          { icon: BarChart3, label: 'Matching Research', sub: 'Compare constraint vs volume-only', tab: 'RESEARCH_BENCHMARK' as ViewTab },
        ].map((item, i) => (
          <button key={i} onClick={() => item.action ? item.action() : item.tab && onNavigate(item.tab)}
            className="glass-card rounded-2xl p-4 text-left group cursor-pointer hover:border-teal-500/30 transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                 style={{ background: 'rgba(8,126,139,0.15)' }}>
              <item.icon className="w-4 h-4" style={{ color: '#5ecad4' }} />
            </div>
            <div className="text-sm font-bold text-white">{item.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#7a9ab5' }}>{item.sub}</div>
          </button>
        ))}
      </div>

      {/* Trust Certificate Modal */}
      {selectedCapForTrustModal && (
        <TrustCertificateModal
          capacity={selectedCapForTrustModal}
          onClose={() => setSelectedCapForTrustModal(null)}
        />
      )}

    </div>
  );
};
