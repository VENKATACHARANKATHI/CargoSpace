import React, { useState } from 'react';
import { BookingHold, Capacity, LSPProfile } from '../../types';
import { 
  PlusCircle, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ship, 
  Box, 
  Boxes, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface LSPInboxProps {
  lspProfile: LSPProfile;
  capacities: Capacity[];
  bookings: BookingHold[];
  onOpenPublishModal: () => void;
  onRefreshFreshness: (capacityId: string) => void;
  onToggleStale: (capacityId: string) => void;
  onConfirmBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string, reason: string) => void;
}

export const LSPInbox: React.FC<LSPInboxProps> = ({
  lspProfile,
  capacities,
  bookings,
  onOpenPublishModal,
  onRefreshFreshness,
  onToggleStale,
  onConfirmBooking,
  onRejectBooking
}) => {
  const [rejectModalBookingId, setRejectModalBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('CFS physical dimension mismatch upon gate entry');

  const lspCapacities = capacities.filter(c => c.lspId === lspProfile.id || c.lspName.includes(lspProfile.companyName.slice(0, 8)));
  const lspBookings = bookings.filter(b => b.lspId === lspProfile.id || b.lspName.includes(lspProfile.companyName.slice(0, 8)));

  return (
    <div className="space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold font-outfit text-white">{lspProfile.companyName}</h2>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase flex items-center space-x-1 ${
              lspProfile.status === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspection {lspProfile.status}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage container capacity freshness, warehouse acceptance, and incoming slot bookings.
          </p>
        </div>

        <button
          onClick={onOpenPublishModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-2 text-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Container Space</span>
        </button>
      </div>

      {/* Published Capacities Inventory Table & Freshness Control */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Active Published Capacities</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{lspCapacities.length} Active Containers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-3">Container Unit</th>
                <th className="py-3 px-3">Corridor Lane</th>
                <th className="py-3 px-3">Free CBM</th>
                <th className="py-3 px-3">Free Mass (kg)</th>
                <th className="py-3 px-3">ETD</th>
                <th className="py-3 px-3">Freshness Status</th>
                <th className="py-3 px-3 text-right">Inventory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {lspCapacities.map(c => {
                const updatedHrsAgo = Math.round(
                  (Date.now() - new Date(c.freshnessTimestamp).getTime()) / (3600 * 1000)
                );

                return (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-cyan-400">{c.containerId}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{c.containerType.replace('_', ' ')}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {c.originPort} → {c.destinationPort}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-400">
                      {c.freeCbm} m³ <span className="text-slate-500 text-[10px]">/ {c.totalCbm}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200">
                      {c.freeWeightKg} kg
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                      {c.etd}
                    </td>
                    <td className="py-3 px-3">
                      {c.isStale ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          <span>STALE (&gt;24 hrs)</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span>Fresh ({updatedHrsAgo}h ago)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onRefreshFreshness(c.id)}
                          title="Touch timestamp to prove freshness to search engine"
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center space-x-1 transition cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-blue-400" />
                          <span>Touch Timestamp</span>
                        </button>

                        <button
                          onClick={() => onToggleStale(c.id)}
                          title="Simulate staleness for viva matching demo"
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/50 text-rose-300 text-[11px] font-semibold border border-rose-500/20 transition cursor-pointer"
                        >
                          <span>{c.isStale ? 'Un-stale' : 'Force Stale'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Inbox */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ship className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Incoming Slot Holds & Consignment Inbox</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{lspBookings.length} Total Bookings</span>
        </div>

        {lspBookings.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No active cargo holds received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {lspBookings.map(b => (
              <div key={b.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-sm">{b.id}</span>
                      <span className="text-xs text-slate-400">• Trader: <strong className="text-slate-200">{b.traderName}</strong></span>
                    </div>
                    <div className="text-xs text-cyan-400 font-mono mt-0.5">
                      Container {b.quote.capacity.containerId} | {b.cargo.cbm} CBM | {b.cargo.weightKg} kg
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      ₹{b.quote.totalQuoteInr.toLocaleString()}
                    </span>

                    {b.holdStatus === 'HOLD' && (
                      <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
                        <button
                          onClick={() => onConfirmBooking(b.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept &amp; Confirm</span>
                        </button>
                        <button
                          onClick={() => setRejectModalBookingId(b.id)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-rose-500/40 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Reject Consignment Slot Hold</h4>
            <p className="text-xs text-slate-400 mb-4">Provide rejection reason for the trader audit log.</p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              rows={3}
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setRejectModalBookingId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRejectBooking(rejectModalBookingId, rejectReason);
                  setRejectModalBookingId(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
