import React, { useState } from 'react';
import { BookingHold } from '../../types';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Building2, 
  QrCode, 
  Receipt,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SimulatedPaymentModalProps {
  booking: BookingHold;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailed: (reason: string) => void;
  onClose: () => void;
}

export const SimulatedPaymentModal: React.FC<SimulatedPaymentModalProps> = ({
  booking,
  onPaymentSuccess,
  onPaymentFailed,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'CORPORATE_CARD' | 'ESCROW_WIRE' | 'UPI_QR'>('CORPORATE_CARD');
  const [otp, setOtp] = useState('892104');
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'VERIFY' | 'SUCCESS'>('SELECT');

  const handleProcessPayment = (shouldSucceed: boolean) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (shouldSucceed) {
        setPaymentStep('SUCCESS');
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0284c7', '#10b981', '#00adb5']
          });
        } catch (e) {
          // ignore fallback
        }

        setTimeout(() => {
          const settlementId = `SETTLE_${Date.now().toString(36).toUpperCase()}`;
          onPaymentSuccess(settlementId);
        }, 1200);
      } else {
        onPaymentFailed('Payment declined: Insufficient credit limit or authorization failure.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-blue-500/40 shadow-2xl relative overflow-hidden my-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold font-outfit text-white">CargoSpace Settlement Escrow</h3>
              <p className="text-xs text-slate-400">Bank-Grade LCL Freight Settlement Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Invoice Summary Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Booking Lock ID:</span>
            <span className="text-cyan-400 font-bold">{booking.id}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>LSP Consolidator:</span>
            <span className="text-white font-sans font-semibold">{booking.lspName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Container Equipment:</span>
            <span className="text-slate-200">{booking.quote.capacity.containerId} ({booking.quote.capacity.containerType.toUpperCase()})</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Declared Volume & Weight:</span>
            <span className="text-slate-200">{booking.cargo.cbm} CBM / {booking.cargo.weightKg} kg</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2.5 border-t border-slate-800 text-white font-sans">
            <span>Total Payable Amount:</span>
            <span className="font-mono text-emerald-400 text-base font-extrabold">₹{booking.quote.totalQuoteInr.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 font-sans">Select Escrow Settlement Method:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('CORPORATE_CARD')}
              className={`p-3 rounded-xl border text-xs font-semibold transition text-center cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                selectedMethod === 'CORPORATE_CARD'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Corporate Card</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('ESCROW_WIRE')}
              className={`p-3 rounded-xl border text-xs font-semibold transition text-center cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                selectedMethod === 'ESCROW_WIRE'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Wire Escrow</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('UPI_QR')}
              className={`p-3 rounded-xl border text-xs font-semibold transition text-center cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                selectedMethod === 'UPI_QR'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Instant UPI</span>
            </button>
          </div>
        </div>

        {/* Dynamic Payment Verification Step */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold font-sans">
            <span>2FA Authorization Security Code</span>
            <span className="font-mono text-cyan-400 text-[11px]">256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-center tracking-widest text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
              maxLength={6}
            />
            <span className="text-[11px] text-slate-500 font-mono">OTP: 892104</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => handleProcessPayment(true)}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>Confirm Settlement (₹{booking.quote.totalQuoteInr.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={() => handleProcessPayment(false)}
            disabled={isProcessing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 font-semibold py-2 rounded-xl transition text-xs border border-rose-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Test Authorization Failure / Decline Handling</span>
          </button>
        </div>

      </div>
    </div>
  );
};
