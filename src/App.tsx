import React, { useState, useEffect } from 'react';
import {
  User,
  LSPProfile,
  Lane,
  Capacity,
  BookingHold,
  Payment,
  AuditLog,
  Dispute,
  CargoDeclaration,
  MatchingResult,
  ViewTab,
  MilestoneStage
} from './types';
import {
  INITIAL_USERS,
  INITIAL_LSPS,
  INITIAL_LANES,
  INITIAL_CAPACITIES,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DISPUTES
} from './data/initialData';
import { evaluateCapacities } from './services/matchingEngine';

// Auth
import { LoginPage } from './components/auth/LoginPage';
import { AuthModal } from './components/auth/AuthModal';

// Layout
import { SidebarNav, ExtendedNavTab } from './components/layout/SidebarNav';

// Trader
import { TraderDashboard } from './components/trader/TraderDashboard';
import { CargoSearchWizard } from './components/trader/CargoSearchWizard';
import { SearchResults } from './components/trader/SearchResults';
import { BookingModal } from './components/trader/BookingModal';
import { SimulatedPaymentModal } from './components/trader/SimulatedPaymentModal';
import { MyBookingsTimeline } from './components/trader/MyBookingsTimeline';

// LSP
import { LSPDashboard } from './components/lsp/LSPDashboard';
import { LSPInbox } from './components/lsp/LSPInbox';
import { PublishCapacityModal } from './components/lsp/PublishCapacityModal';
import { LSPOnboarding } from './components/lsp/LSPOnboarding';

// Admin
import { AdminConsole } from './components/admin/AdminConsole';

// Research + Visualizer
import { MatchingComparisonPanel } from './components/research/MatchingComparisonPanel';
import { Container3DVisualizer } from './components/visualizer/Container3DVisualizer';
import { Search, Ship, Lock, Clock, RotateCcw, ShieldCheck, Box } from 'lucide-react';

export function App() {
  // ===== AUTH STATE =====
  const [currentUser, setCurrentUser] = useState<User | null>(null); // null = unauthenticated
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ===== DATA STATE =====
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [lsps, setLsps] = useState<LSPProfile[]>(INITIAL_LSPS);
  const [lanes, setLanes] = useState<Lane[]>(INITIAL_LANES);
  const [capacities, setCapacities] = useState<Capacity[]>(INITIAL_CAPACITIES);
  const [bookings, setBookings] = useState<BookingHold[]>(INITIAL_BOOKINGS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  // ===== NAVIGATION =====
  const [activeTab, setActiveTab] = useState<ExtendedNavTab>('TRADER_DASHBOARD');

  // ===== SEARCH STATE =====
  const [currentCargo, setCurrentCargo] = useState<CargoDeclaration>({
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    readyDate: '2026-09-22',
    cutoffDate: '2026-09-26',
    cbm: 12.0,
    weightKg: 8200,
    cargoType: 'general',
    isHazmat: false,
    stackabilityLimit: 3
  });
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // ===== MODALS =====
  const [selectedHoldQuote, setSelectedHoldQuote] = useState<MatchingResult | null>(null);
  const [activePaymentBooking, setActivePaymentBooking] = useState<BookingHold | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [holdCountdownSeconds, setHoldCountdownSeconds] = useState<number | undefined>(undefined);

  // ===== NAVIGATE HELPER =====
  const handleNavigate = (tab: ExtendedNavTab) => {
    if (tab === 'PUBLISH_CAPACITY') {
      setIsPublishModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // ===== SEARCH =====
  const handleExecuteSearch = (cargo: CargoDeclaration) => {
    setCurrentCargo(cargo);
    const results = evaluateCapacities(capacities, lanes, lsps, cargo, 'compare');
    setMatchingResults(results);
    setHasSearched(true);
    setActiveTab('CARGO_SEARCH');
  };

  // ===== ROLE SWITCH =====
  const handleSwitchUserRole = (role: User['role']) => {
    const target = users.find(u => u.role === role) || users[0];
    setCurrentUser(target);
    if (role === 'trader') setActiveTab('TRADER_DASHBOARD');
    else if (role === 'lsp') setActiveTab('LSP_DASHBOARD');
    else if (role === 'admin') setActiveTab('ADMIN_APPROVALS');
  };

  // ===== BOOKING: CREATE HOLD =====
  const handleConfirmCreateHold = () => {
    if (!selectedHoldQuote || !currentUser) return;

    const idempKey = `idemp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const bookingId = `bkg_${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingHold = {
      id: bookingId,
      idempotencyKey: idempKey,
      lspId: selectedHoldQuote.capacity.lspId,
      lspName: selectedHoldQuote.capacity.lspName,
      capacityId: selectedHoldQuote.capacity.id,
      traderId: currentUser.id,
      traderName: currentUser.companyName,
      cargo: currentCargo,
      quote: selectedHoldQuote,
      holdStatus: 'HOLD',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      milestoneStage: 'HOLD_CREATED',
      milestoneHistory: [
        {
          stage: 'HOLD_CREATED',
          title: 'Atomic Slot Hold Reserved',
          description: `Locked ${currentCargo.cbm} CBM in ${selectedHoldQuote.capacity.containerId} for 15 mins`,
          timestamp: new Date().toLocaleTimeString(),
          isCompleted: true,
          isCurrent: true
        },
        { stage: 'PAYMENT_CONFIRMED', title: 'Payment Reconciled', description: 'Awaiting simulated payment', isCompleted: false, isCurrent: false },
        { stage: 'WAREHOUSE_RECEIVED', title: 'Warehouse Acceptance', description: 'CFS weighbridge arrival', isCompleted: false, isCurrent: false },
        { stage: 'INSPECTION_PASSED', title: 'Customs Clearance', description: 'ICEGATE verification', isCompleted: false, isCurrent: false },
        { stage: 'CONTAINER_STUFFED', title: 'Container Loading', description: 'Stowed into container', isCompleted: false, isCurrent: false },
        { stage: 'IN_TRANSIT', title: 'Vessel On-Board', description: 'Ocean transit', isCompleted: false, isCurrent: false },
        { stage: 'DELIVERED', title: 'Destination CFS Release', description: 'Final release', isCompleted: false, isCurrent: false }
      ]
    };

    setCapacities(capacities.map(c => {
      if (c.id === selectedHoldQuote.capacity.id) {
        return {
          ...c,
          freeCbm: Math.max(0, c.freeCbm - currentCargo.cbm),
          freeWeightKg: Math.max(0, c.freeWeightKg - currentCargo.weightKg)
        };
      }
      return c;
    }));

    setBookings([newBooking, ...bookings]);

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      entityType: 'BOOKING',
      entityId: bookingId,
      action: 'ATOMIC_HOLD_CREATED',
      performedByRole: currentUser.role,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Atomic hold created (TTL 15 mins, Idempotency: ${idempKey}) for ${currentCargo.cbm} CBM.`
    };
    setAuditLogs([newLog, ...auditLogs]);

    setSelectedHoldQuote(null);
    setHoldCountdownSeconds(900);
    setActivePaymentBooking(newBooking);
  };

  // ===== PAYMENT SUCCESS =====
  const handlePaymentSuccess = (paymentId: string) => {
    if (!activePaymentBooking || !currentUser) return;

    setBookings(bookings.map(b => {
      if (b.id === activePaymentBooking.id) {
        const updatedHistory = b.milestoneHistory.map(m => {
          if (m.stage === 'HOLD_CREATED') return { ...m, isCurrent: false, isCompleted: true };
          if (m.stage === 'PAYMENT_CONFIRMED') return { ...m, isCurrent: true, isCompleted: true, timestamp: new Date().toLocaleTimeString() };
          return m;
        });
        return { ...b, holdStatus: 'CONFIRMED', paymentId, milestoneStage: 'PAYMENT_CONFIRMED' as MilestoneStage, milestoneHistory: updatedHistory };
      }
      return b;
    }));

    const newPay: Payment = {
      id: paymentId,
      bookingId: activePaymentBooking.id,
      amountInr: activePaymentBooking.quote.totalQuoteInr,
      status: 'SUCCESS',
      method: 'SIMULATED_GATEWAY',
      transactionRef: `TXN_${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString()
    };
    setPayments([newPay, ...payments]);

    setAuditLogs([{
      id: `log_${Date.now()}`,
      entityType: 'PAYMENT',
      entityId: paymentId,
      action: 'PAYMENT_RECONCILED',
      performedByRole: currentUser.role,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Payment of ₹${activePaymentBooking.quote.totalQuoteInr.toLocaleString()} reconciled.`
    }, ...auditLogs]);

    setActivePaymentBooking(null);
    setActiveTab('MY_BOOKINGS');
  };

  // ===== PAYMENT FAILED =====
  const handlePaymentFailed = (reason: string) => {
    if (!activePaymentBooking) return;
    setCapacities(capacities.map(c => {
      if (c.id === activePaymentBooking.capacityId) {
        return { ...c, freeCbm: c.freeCbm + activePaymentBooking.cargo.cbm, freeWeightKg: c.freeWeightKg + activePaymentBooking.cargo.weightKg };
      }
      return c;
    }));
    setBookings(bookings.map(b => {
      if (b.id === activePaymentBooking.id) return { ...b, holdStatus: 'EXPIRED', cancellationReason: reason };
      return b;
    }));
    setActivePaymentBooking(null);
  };

  // ===== ADVANCE MILESTONE =====
  const handleAdvanceMilestone = (bookingId: string) => {
    const stageOrder: MilestoneStage[] = [
      'HOLD_CREATED', 'PAYMENT_CONFIRMED', 'WAREHOUSE_RECEIVED',
      'INSPECTION_PASSED', 'CONTAINER_STUFFED', 'IN_TRANSIT', 'DELIVERED'
    ];
    setBookings(bookings.map(b => {
      if (b.id === bookingId) {
        const currIndex = stageOrder.indexOf(b.milestoneStage);
        if (currIndex < stageOrder.length - 1) {
          const nextStage = stageOrder[currIndex + 1];
          const updatedHistory = b.milestoneHistory.map(m => {
            if (m.stage === nextStage) return { ...m, isCurrent: true, isCompleted: true, timestamp: new Date().toLocaleTimeString() };
            if (stageOrder.indexOf(m.stage) <= currIndex) return { ...m, isCurrent: false, isCompleted: true };
            return m;
          });
          return { ...b, milestoneStage: nextStage, milestoneHistory: updatedHistory };
        }
      }
      return b;
    }));
  };

  // ===== LSP ACTIONS =====
  const handleRefreshFreshness = (capacityId: string) => {
    setCapacities(capacities.map(c => {
      if (c.id === capacityId) return { ...c, freshnessTimestamp: new Date().toISOString(), isStale: false };
      return c;
    }));
  };

  const handleToggleStale = (capacityId: string) => {
    setCapacities(capacities.map(c => {
      if (c.id === capacityId) return { ...c, isStale: !c.isStale };
      return c;
    }));
  };

  // ===== ADMIN ACTIONS =====
  const handleApproveLSP = (lspId: string) => {
    setLsps(lsps.map(l => l.id === lspId ? { ...l, status: 'approved', verificationDate: new Date().toISOString().slice(0, 10) } : l));
  };
  const handleRejectLSP = (lspId: string, reason: string) => {
    setLsps(lsps.map(l => l.id === lspId ? { ...l, status: 'rejected', rejectionReason: reason } : l));
  };
  const handleForceCancelBooking = (bookingId: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, holdStatus: 'CANCELLED', cancellationReason: 'Admin forced cancellation with refund' } : b));
  };

  // ===== RESET DEMO DATA =====
  const handleResetDemoData = () => {
    setUsers(INITIAL_USERS);
    setLsps(INITIAL_LSPS);
    setLanes(INITIAL_LANES);
    setCapacities(INITIAL_CAPACITIES);
    setBookings(INITIAL_BOOKINGS);
    setPayments(INITIAL_PAYMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDisputes(INITIAL_DISPUTES);
    setHasSearched(false);
    if (currentUser) {
      if (currentUser.role === 'trader') setActiveTab('TRADER_DASHBOARD');
      else if (currentUser.role === 'lsp') setActiveTab('LSP_DASHBOARD');
      else setActiveTab('ADMIN_APPROVALS');
    }
  };

  // ===== AUTH =====
  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    if (user.role === 'trader') setActiveTab('TRADER_DASHBOARD');
    else if (user.role === 'lsp') setActiveTab('LSP_DASHBOARD');
    else if (user.role === 'admin') setActiveTab('ADMIN_APPROVALS');
  };

  const handleRegisterSuccess = (newUser: User, newLspProfile?: LSPProfile) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    if (newLspProfile) setLsps(prev => [newLspProfile, ...prev]);
    if (newUser.role === 'trader') setActiveTab('TRADER_DASHBOARD');
    else if (newUser.role === 'lsp') setActiveTab('LSP_DASHBOARD');
    else setActiveTab('ADMIN_APPROVALS');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHasSearched(false);
    setMatchingResults([]);
    setSelectedHoldQuote(null);
    setActivePaymentBooking(null);
  };

  // ===== COUNTDOWN TIMER =====
  useEffect(() => {
    if (holdCountdownSeconds === undefined || holdCountdownSeconds <= 0) return;
    const timer = setInterval(() => {
      setHoldCountdownSeconds(prev => {
        if (prev === undefined || prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdCountdownSeconds]);

  // ===== COMPUTED COUNTS =====
  const currentLsp = currentUser
    ? lsps.find(l => l.userId === currentUser.id) || lsps[0]
    : lsps[0];

  const userBookingsCount = currentUser
    ? bookings.filter(b => b.traderId === currentUser.id).length
    : 0;

  const lspInboxCount = currentLsp
    ? bookings.filter(b => b.lspId === currentLsp.id).length
    : 0;

  const activeHoldBooking = bookings.find(b => b.holdStatus === 'HOLD');

  // ===== RENDER: UNAUTHENTICATED =====
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // Helper for title mapping
  const getPageTitle = () => {
    switch (activeTab) {
      case 'TRADER_DASHBOARD': return 'Export Trader Dashboard';
      case 'CARGO_SEARCH': return 'Capacity Search & Booking Engine';
      case 'MY_BOOKINGS': return 'My Hold Reservations & Tracking';
      case 'LSP_DASHBOARD': return 'Consolidator Operations Hub';
      case 'LSP_INBOX': return 'Container Booking Request Inbox';
      case 'ADMIN_APPROVALS': return 'Platform Admin Control Console';
      case 'VEHICLE_XRAY': return 'Vehicle 3D Stowage & X-Ray Inspector';
      case 'RESEARCH_COMPARE': return 'Matching Engine Algorithm Benchmark';
      default: return 'CargoSpace Platform';
    }
  };

  // ===== RENDER: AUTHENTICATED SIDEBAR LAYOUT =====
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      
      {/* 1. Left Sidebar Navigation */}
      <SidebarNav
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchUserRole}
        activeHold={activeHoldBooking}
        holdSecondsLeft={holdCountdownSeconds}
        myBookingsCount={userBookingsCount}
        inboxCount={lspInboxCount}
      />

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        
        {/* Top Navigation Workspace Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold font-outfit text-white flex items-center space-x-2">
              <span>{getPageTitle()}</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Role: <span className="text-cyan-400 font-semibold uppercase">{currentUser.role}</span> • Company: <span className="text-slate-200">{currentUser.companyName}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Demo Reset Data */}
            <button
              onClick={handleResetDemoData}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition flex items-center space-x-1.5 cursor-pointer"
              title="Reset initial state data for evaluation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Reset Demo State</span>
            </button>

            {/* Hold Timer Quick Badge */}
            {holdCountdownSeconds !== undefined && holdCountdownSeconds > 0 && (
              <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>TTL: {Math.floor(holdCountdownSeconds / 60)}:{(holdCountdownSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">

          {/* TRADER DASHBOARD */}
          {activeTab === 'TRADER_DASHBOARD' && (
            <TraderDashboard
              currentUser={currentUser}
              bookings={bookings}
              capacities={capacities}
              onNavigate={(tab) => handleNavigate(tab === 'SEARCH_BOOK' ? 'CARGO_SEARCH' : (tab as ExtendedNavTab))}
            />
          )}

          {/* CARGO SEARCH & BOOKING */}
          {activeTab === 'CARGO_SEARCH' && (
            <div className="space-y-6">
              <CargoSearchWizard onSearch={handleExecuteSearch} initialCargo={currentCargo} />
              {hasSearched && (
                <SearchResults
                  results={matchingResults}
                  cargo={currentCargo}
                  onSelectHold={(result) => setSelectedHoldQuote(result)}
                />
              )}
            </div>
          )}

          {/* MY BOOKINGS */}
          {activeTab === 'MY_BOOKINGS' && (
            <MyBookingsTimeline
              bookings={bookings}
              onAdvanceMilestone={handleAdvanceMilestone}
              onPayNow={(b) => setActivePaymentBooking(b)}
              onOpen3DVisualizer={() => setActiveTab('VEHICLE_XRAY')}
            />
          )}

          {/* LSP DASHBOARD */}
          {activeTab === 'LSP_DASHBOARD' && (
            <LSPDashboard
              currentUser={currentUser}
              lspProfile={currentLsp}
              capacities={capacities}
              bookings={bookings}
              onNavigate={(tab) => handleNavigate(tab === 'LSP_CAPACITY' ? 'PUBLISH_CAPACITY' : (tab as ExtendedNavTab))}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              onRefreshFreshness={handleRefreshFreshness}
            />
          )}

          {/* LSP INBOX */}
          {activeTab === 'LSP_INBOX' && (
            <LSPInbox
              lspProfile={currentLsp}
              capacities={capacities}
              bookings={bookings}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              onRefreshFreshness={handleRefreshFreshness}
              onToggleStale={handleToggleStale}
              onConfirmBooking={(bId) => handleAdvanceMilestone(bId)}
              onRejectBooking={(bId) => handleForceCancelBooking(bId)}
            />
          )}

          {/* ADMIN CONSOLE */}
          {activeTab === 'ADMIN_APPROVALS' && (
            <AdminConsole
              lsps={lsps}
              bookings={bookings}
              capacities={capacities}
              auditLogs={auditLogs}
              disputes={disputes}
              onApproveLSP={handleApproveLSP}
              onRejectLSP={handleRejectLSP}
              onForceCancelBooking={handleForceCancelBooking}
              onResetDemoData={handleResetDemoData}
            />
          )}

          {/* RESEARCH COMPARISON PANEL */}
          {activeTab === 'RESEARCH_COMPARE' && (
            <MatchingComparisonPanel
              capacities={capacities}
              lanes={lanes}
              lsps={lsps}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CargoSpace — Verified LCL Freight Consolidation &amp; Constraint-Aware Engine</span>
          <span className="font-mono text-[10px]">MongoDB Idempotency &amp; Atomic Slot Locking Enabled</span>
        </footer>

      </div>

      {/* MODALS */}
      {selectedHoldQuote && (
        <BookingModal
          quote={selectedHoldQuote}
          cargo={currentCargo}
          onConfirmHold={handleConfirmCreateHold}
          onClose={() => setSelectedHoldQuote(null)}
          idempotencyKey={`idemp_${Date.now().toString(36)}`}
        />
      )}

      {activePaymentBooking && (
        <SimulatedPaymentModal
          booking={activePaymentBooking}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
          onClose={() => setActivePaymentBooking(null)}
        />
      )}

      {isPublishModalOpen && (
        <PublishCapacityModal
          lanes={lanes}
          lspId={currentLsp.id}
          lspName={currentLsp.companyName}
          onPublish={(newCap) => {
            setCapacities([newCap, ...capacities]);
            setIsPublishModalOpen(false);
          }}
          onClose={() => setIsPublishModalOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

    </div>
  );
}
