import React, { useState } from 'react';
import { BookingHold, MilestoneStage } from '../../types';
import { 
  BookmarkCheck, 
  Clock, 
  CheckCircle2, 
  Package, 
  Ship, 
  Boxes, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  RotateCcw,
  Box,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Container3DVisualizer } from '../visualizer/Container3DVisualizer';

interface MyBookingsTimelineProps {
  bookings: BookingHold[];
  onAdvanceMilestone: (bookingId: string) => void;
  onPayNow: (booking: BookingHold) => void;
  onOpen3DVisualizer?: (booking: BookingHold) => void;
}

export const MyBookingsTimeline: React.FC<MyBookingsTimelineProps> = ({
  bookings,
  onAdvanceMilestone,
  onPayNow
}) => {
  const [active3DBookingId, setActive3DBookingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookmarkCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-outfit text-white">My Consignment Bookings & Live Timeline</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status updates, warehouse checkpoints, and container loading milestones.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-lg font-bold text-slate-300">No Active Bookings Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Search published lanes to request a transactional capacity hold and track your shipment.
          </p>
        </div>
      ) : (
        bookings.map((booking) => {
          const is3DOpen = active3DBookingId === booking.id;

          return (
            <div
              key={booking.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 transition hover:border-slate-700"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
                      ID: {booking.id}
                    </span>
                    <h3 className="text-base font-bold text-white">{booking.lspName}</h3>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        booking.holdStatus === 'HOLD'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : booking.holdStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {booking.holdStatus}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span>Trader: <strong className="text-slate-200">{booking.traderName}</strong></span>
                    <span>•</span>
                    <span>Route: <strong className="text-cyan-400">{booking.cargo.originPort} → {booking.cargo.destinationPort}</strong></span>
                    <span>•</span>
                    <span>Container: <strong className="font-mono text-slate-300">{booking.quote.capacity.containerId}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Inline 3D Visualizer shortcut for this shipment */}
                  <button
                    onClick={() => setActive3DBookingId(is3DOpen ? null : booking.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                      is3DOpen
                        ? 'bg-cyan-500/30 text-cyan-200 border-cyan-500'
                        : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    <Box className="w-4 h-4 text-cyan-400" />
                    <span>{is3DOpen ? 'Close 3D View' : 'Inspect 3D Vehicle Placement'}</span>
                    {is3DOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* If HOLD, show Pay Now button */}
                  {booking.holdStatus === 'HOLD' && (
                    <button
                      onClick={() => onPayNow(booking)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{booking.quote.totalQuoteInr.toLocaleString()}</span>
                    </button>
                  )}

                  {/* Evaluator Milestone Advancement Button */}
                  {booking.holdStatus === 'CONFIRMED' && booking.milestoneStage !== 'DELIVERED' && (
                    <button
                      onClick={() => onAdvanceMilestone(booking.id)}
                      title="Simulate next warehouse/shipping event"
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Simulate Next Stage</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Embedded 3D Vehicle X-Ray Inspection */}
              {is3DOpen && (
                <div className="pt-2 border-t border-slate-800 animate-fadeIn">
                  <Container3DVisualizer
                    containerId={booking.quote.capacity.containerId}
                    capacity={booking.quote.capacity}
                    targetCargo={booking.cargo}
                    isBookingPreview={true}
                  />
                </div>
              )}

              {/* Consignment Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Volume Declared</span>
                  <span className="text-slate-200 font-bold">{booking.cargo.cbm} CBM</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Gross Weight</span>
                  <span className="text-slate-200 font-bold">{booking.cargo.weightKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Amount</span>
                  <span className="text-blue-400 font-bold">₹{booking.quote.totalQuoteInr.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Vessel ETD</span>
                  <span className="text-emerald-400 font-bold">{booking.quote.capacity.etd}</span>
                </div>
              </div>

              {/* Timeline Milestones Progression */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tracking Milestones
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {booking.milestoneHistory.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-[11px] space-y-1 transition ${
                        step.isCurrent
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20'
                          : step.isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase font-bold text-slate-400">Step {idx + 1}</span>
                        {step.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="font-bold truncate">{step.title}</div>
                      {step.timestamp && (
                        <div className="text-[9px] font-mono text-slate-400">{step.timestamp}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })
      )}

    </div>
  );
};
