import React from 'react';
import { LSPProfile } from '../../types';
import { ShieldCheck, CheckCircle2, XCircle, FileText, Building, MapPin, Award } from 'lucide-react';

interface LSPOnboardingProps {
  lspProfile: LSPProfile;
}

export const LSPOnboarding: React.FC<LSPOnboardingProps> = ({ lspProfile }) => {
  const { inspectionChecklist } = lspProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-outfit">{lspProfile.companyName}</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span>IEC: <strong className="font-mono text-slate-200">{lspProfile.iecCode}</strong></span>
              <span>•</span>
              <span>GSTIN: <strong className="font-mono text-slate-200">{lspProfile.gstin}</strong></span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase flex items-center space-x-1.5 ${
            lspProfile.status === 'approved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Inspection {lspProfile.status}</span>
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Rating: ⭐ {lspProfile.rating} / 5.0 ({lspProfile.completedShipments} shipments)</p>
        </div>
      </div>

      {/* Inspection Checklist Verification Audit */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Platform Verification &amp; Inspection Audit</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Admin Approved Gate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">KYC &amp; Registration Documents</div>
              <p className="text-slate-400 text-[11px]">Certificate of incorporation &amp; PAN card</p>
            </div>
            {inspectionChecklist.kycDocumentVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">ICEGATE &amp; ULIP Integration</div>
              <p className="text-slate-400 text-[11px]">Customs EDI API credentials check</p>
            </div>
            {inspectionChecklist.icegateIntegrationVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Physical Warehouse Audit</div>
              <p className="text-slate-400 text-[11px]">CFS weighbridge &amp; CCTV compliance</p>
            </div>
            {inspectionChecklist.physicalWarehouseAudited ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">Hazmat Handling License</div>
              <p className="text-slate-400 text-[11px]">Dangerous goods certified facility</p>
            </div>
            {inspectionChecklist.hazmatHandlingPermit ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
