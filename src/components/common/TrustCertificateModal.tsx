import React from 'react';
import { Capacity } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  Building2, 
  ExternalLink,
  QrCode,
  Lock,
  Sparkles,
  Layers,
  Calendar,
  Anchor,
  Truck,
  Plane
} from 'lucide-react';

interface TrustCertificateModalProps {
  capacity: Capacity;
  onClose: () => void;
}

export const TrustCertificateModal: React.FC<TrustCertificateModalProps> = ({ capacity, onClose }) => {
  const proofHash = capacity.proofOfCapacityHash || `POC_0X${capacity.id.toUpperCase()}_TRUST_VERIFIED`;
  const trustScore = capacity.trustScore || 99.8;
  const isAir = capacity.containerType === 'air_pallet';
  const isRoad = capacity.containerType === 'box_truck' || capacity.containerType === 'semi_trailer' || capacity.containerType === 'sprinter_van';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 border border-emerald-500/50 shadow-2xl relative my-8 space-y-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Decorative Top Trust Seal Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/30 flex items-center space-x-2 font-mono">
          <Award className="w-4 h-4 text-slate-950" />
          <span>CargoSpace Verified Trust Certificate</span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 pt-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-outfit text-white">Trust & Compliance Audit Report</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  APPROVED WITH TRUST
                </span>
              </div>
              <p className="text-xs text-slate-400">Cryptographic audit proof for equipment &amp; carrier compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Audit Score & Carrier Summary Header Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">{capacity.lspName}</span>
            </div>
            <p className="text-xs text-slate-300">
              Corridor: <strong className="text-cyan-400">{capacity.originPort} → {capacity.destinationPort}</strong>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Equipment: <span className="text-slate-200 font-semibold">{capacity.containerId}</span> ({capacity.containerType.replace('_', ' ').toUpperCase()})
            </p>
          </div>

          <div className="flex flex-col justify-center items-center p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Verified Trust Score</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-center">
              <span>{trustScore}%</span>
              <Sparkles className="w-4 h-4 ml-1 text-emerald-300" />
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold font-mono">TIER-1 AUDITED</div>
          </div>
        </div>

        {/* 4 Multi-Regulatory Compliance Audit Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1.5">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>4-Stage Regulatory Approval Verification</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Audit 1: ICEGATE / Customs Clearance */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1. ICEGATE Customs Integration</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  PASSED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                IEC &amp; Shipping Bill clearance synced with Customs National Gateway.
              </p>
              <div className="pl-5 text-[10px] font-mono text-cyan-400">
                Gate Pass Hash: ICEGATE-GATE-99210
              </div>
            </div>

            {/* Audit 2: ISO 6346 CSC Safety Inspection */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2. ISO 6346 CSC Structural Audit</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                Physical container frame structural integrity &amp; tare weight certified.
              </p>
              <div className="pl-5 text-[10px] font-mono text-cyan-400">
                CSC Safety Plate: CSC-INSP-2026-OK
              </div>
            </div>

            {/* Audit 3: Calibrated Weighbridge Scale */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3. Calibrated Weighbridge Slip</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                CFS Hub zero-tare scale certified within ±0.1% tolerance.
              </p>
              <div className="pl-5 text-[10px] font-mono text-cyan-400">
                Weighbridge ID: WB-NHAVA-8821
              </div>
            </div>

            {/* Audit 4: Cargo Liability Insurance */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>4. Comprehensive Cargo Insurance</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  INSURED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                Active $500,000 USD marine/inland freight transit policy active.
              </p>
              <div className="pl-5 text-[10px] font-mono text-cyan-400">
                Policy #: POL-99201-CARGOSPACE
              </div>
            </div>

          </div>
        </div>

        {/* Cryptographic Proof Hash Footer */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Immutable Proof of Capacity Hash</div>
              <div className="font-mono text-emerald-400 text-[11px] break-all font-bold">
                {proofHash}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            Close Trust Certificate
          </button>
        </div>

      </div>
    </div>
  );
};
