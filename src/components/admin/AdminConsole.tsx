import React from 'react';
import { AuditLog, BookingHold, Capacity, Dispute, LSPProfile } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Package, 
  FileText, 
  DollarSign, 
  Activity,
  UserCheck
} from 'lucide-react';

interface AdminConsoleProps {
  lsps: LSPProfile[];
  bookings: BookingHold[];
  capacities: Capacity[];
  auditLogs: AuditLog[];
  disputes: Dispute[];
  onApproveLSP: (lspId: string) => void;
  onRejectLSP: (lspId: string, reason: string) => void;
  onForceCancelBooking: (bookingId: string) => void;
  onResetDemoData: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  lsps,
  bookings,
  capacities,
  auditLogs,
  disputes,
  onApproveLSP,
  onRejectLSP,
  onForceCancelBooking,
  onResetDemoData
}) => {
  const pendingLsps = lsps.filter(l => l.status === 'pending');
  const approvedLsps = lsps.filter(l => l.status === 'approved');

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Demo Reset */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-outfit text-white">Admin Operations &amp; Inspection Console</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit provider inspections, enforce global bookings, monitor disputes, and inspect state logs.
          </p>
        </div>

        <button
          onClick={onResetDemoData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2.5 px-4 rounded-xl transition flex items-center space-x-2 text-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Reset Demo Data (Evaluator Benchmark State)</span>
        </button>
      </div>

      {/* LSP Onboarding Inspection Approval Queue */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">LSP Provider Inspection Queue ({pendingLsps.length} Pending)</h3>
          </div>
        </div>

        {pendingLsps.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            All registered LSPs have completed inspection audits.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingLsps.map(lsp => (
              <div key={lsp.id} className="bg-slate-900/70 p-5 rounded-xl border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{lsp.companyName}</h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                      <span>IEC: <strong className="font-mono text-slate-200">{lsp.iecCode}</strong></span>
                      <span>•</span>
                      <span>GSTIN: <strong className="font-mono text-slate-200">{lsp.gstin}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onApproveLSP(lsp.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Inspection</span>
                    </button>
                    <button
                      onClick={() => onRejectLSP(lsp.id, 'Failed physical warehouse weighbridge audit')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Audit Checklist View */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono">
                  <div className="flex items-center justify-between">
                    <span>KYC Docs:</span>
                    <span className={lsp.inspectionChecklist.kycDocumentVerified ? 'text-emerald-400' : 'text-slate-500'}>
                      {lsp.inspectionChecklist.kycDocumentVerified ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ICEGATE API:</span>
                    <span className={lsp.inspectionChecklist.icegateIntegrationVerified ? 'text-emerald-400' : 'text-slate-500'}>
                      {lsp.inspectionChecklist.icegateIntegrationVerified ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Physical Audit:</span>
                    <span className={lsp.inspectionChecklist.physicalWarehouseAudited ? 'text-emerald-400' : 'text-slate-500'}>
                      {lsp.inspectionChecklist.physicalWarehouseAudited ? 'PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hazmat Permit:</span>
                    <span className={lsp.inspectionChecklist.hazmatHandlingPermit ? 'text-emerald-400' : 'text-slate-500'}>
                      {lsp.inspectionChecklist.hazmatHandlingPermit ? 'PASSED' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Bookings Control & Force-Cancel Simulation */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Global Bookings &amp; Auto-Refund Console</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{bookings.length} Total Platform Bookings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Trader</th>
                <th className="py-3 px-3">LSP Provider</th>
                <th className="py-3 px-3">Space/Mass</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Pay Ref</th>
                <th className="py-3 px-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{b.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{b.traderName}</td>
                  <td className="py-3 px-3 text-slate-300">{b.lspName}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {b.cargo.cbm} CBM / {b.cargo.weightKg} kg
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.holdStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : b.holdStatus === 'CANCELLED'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {b.holdStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[10px]">{b.paymentId || 'N/A'}</td>
                  <td className="py-3 px-3 text-right">
                    {b.holdStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => onForceCancelBooking(b.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-300 text-[11px] font-semibold border border-rose-500/20 transition cursor-pointer"
                      >
                        Force Cancel &amp; Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Immutable Platform Audit Log</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} Audit Events</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {auditLogs.map(log => (
            <div key={log.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 uppercase font-bold">
                    {log.entityType}
                  </span>
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">By {log.performedByName} ({log.performedByRole})</span>
                </div>
                <p className="text-slate-400 text-[11px]">{log.details}</p>
              </div>
              <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-4">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
