import React, { useState } from 'react';
import { CargoDeclaration, MatchingResult } from '../../types';
import { Lock, Clock, ShieldCheck, ArrowRight, X, AlertCircle, Box, FileText, Award } from 'lucide-react';
import { Container3DVisualizer } from '../visualizer/Container3DVisualizer';
import { TrustCertificateModal } from '../common/TrustCertificateModal';

interface BookingModalProps {
  quote: MatchingResult;
  cargo: CargoDeclaration;
  onConfirmHold: () => void;
  onClose: () => void;
  idempotencyKey: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  quote,
  cargo,
  onConfirmHold,
  onClose,
  idempotencyKey
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'xray'>('details');
  const [showTrustModal, setShowTrustModal] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel rounded-2xl max-w-2xl w-full p-6 border border-blue-500/40 shadow-2xl relative overflow-hidden my-auto space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-outfit text-white">Hold Capacity Slot (Atomic TTL Lock)</h3>
              <p className="text-xs text-slate-400">15-minute transactional hold prevents double-booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (Details vs 3D Vehicle X-Ray) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Order Tariff & TTL Details</span>
          </button>

          <button
            onClick={() => setActiveTab('xray')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
              activeTab === 'xray'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-cyan-300" />
            <span>3D Vehicle Placement Preview</span>
          </button>
        </div>

        {/* Tab 1: Order Details */}
        {activeTab === 'details' ? (
          <div className="space-y-4">
            {/* Idempotency & TTL Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-slate-200">Atomic Reservation Duration:</span>
                </span>
                <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  15:00 Minutes TTL
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Idempotency Key:</span>
                <span className="text-cyan-400 font-semibold">{idempotencyKey}</span>
              </div>
            </div>

            {/* Consignment & Quote Summary */}
            <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Consolidator (LSP):</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{quote.capacity.lspName}</span>
                  <button
                    onClick={() => setShowTrustModal(true)}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 font-mono hover:bg-emerald-500/30 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>APPROVED TRUST</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Target Container Unit:</span>
                <span className="font-mono text-cyan-400">{quote.capacity.containerId} ({quote.capacity.containerType.toUpperCase()})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Declared Cargo Space:</span>
                <span className="font-mono text-slate-200">{cargo.cbm} CBM / {cargo.weightKg} kg</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-300 font-semibold">Total Payable Amount:</span>
                <span className="font-mono text-lg font-bold text-blue-400">₹{quote.totalQuoteInr.toLocaleString()}</span>
              </div>
            </div>

            {/* Safety Disclaimer */}
            <div className="text-[11px] text-slate-400 flex items-start space-x-2 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                Upon clicking &quot;Confirm Atomic Hold & Pay&quot;, MongoDB conditional update atomically locks {cargo.cbm} CBM in container {quote.capacity.containerId}. If payment is not completed within 15 minutes, capacity auto-releases.
              </p>
            </div>
          </div>
        ) : (
          /* Tab 2: 3D Vehicle X-Ray Preview */
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            <Container3DVisualizer
              containerId={quote.capacity.containerId}
              capacity={quote.capacity}
              targetCargo={cargo}
              isBookingPreview={true}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmHold}
            className="w-2/3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Confirm Atomic Hold & Pay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Certificate Modal */}
        {showTrustModal && (
          <TrustCertificateModal
            capacity={quote.capacity}
            onClose={() => setShowTrustModal(false)}
          />
        )}

      </div>
    </div>
  );
};
