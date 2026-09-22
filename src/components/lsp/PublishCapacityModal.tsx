import React, { useState, useEffect } from 'react';
import { Capacity, ContainerType, CargoType, Lane } from '../../types';
import { 
  PlusCircle, 
  Ship, 
  Box, 
  Calendar, 
  Clock, 
  Weight, 
  Flame, 
  Check, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  Lock,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface PublishCapacityModalProps {
  lanes: Lane[];
  lspId: string;
  lspName: string;
  onPublish: (capacity: Capacity) => void;
  onClose: () => void;
}

type AuditStep = 'form' | 'auditing' | 'certificate';

export const PublishCapacityModal: React.FC<PublishCapacityModalProps> = ({
  lanes,
  lspId,
  lspName,
  onPublish,
  onClose
}) => {
  const [selectedLaneId, setSelectedLaneId] = useState(lanes[0]?.id || '');
  const [containerId, setContainerId] = useState(`MSCU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`);
  const [containerType, setContainerType] = useState<ContainerType>('40ft_hc');
  const [totalCbm, setTotalCbm] = useState(68);
  const [freeCbm, setFreeCbm] = useState(32);
  const [maxWeightKg, setMaxWeightKg] = useState(26000);
  const [freeWeightKg, setFreeWeightKg] = useState(14000);
  const [etd, setEtd] = useState('2026-10-05');
  const [cutoffTime, setCutoffTime] = useState('2026-10-02T18:00:00Z');
  const [hazmatAllowed, setHazmatAllowed] = useState(true);
  const [acceptedCargoTypes, setAcceptedCargoTypes] = useState<CargoType[]>(['general', 'apparel', 'heavy_machinery']);

  // Trust & Inspection Checklist state
  const [cscSafetyApproved, setCscSafetyApproved] = useState(true);
  const [icegateVerified, setIcegateVerified] = useState(true);
  const [weighbridgeCalibrated, setWeighbridgeCalibrated] = useState(true);
  const [insuranceActive, setInsuranceActive] = useState(true);

  // Trust Approval Flow State
  const [step, setStep] = useState<AuditStep>('form');
  const [auditProgress, setAuditProgress] = useState(0);
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);
  const [generatedHash, setGeneratedHash] = useState('');
  const [calculatedTrustScore, setCalculatedTrustScore] = useState(99.8);

  const selectedLane = lanes.find(l => l.id === selectedLaneId) || lanes[0];

  // Simulated live trust audit runner
  useEffect(() => {
    if (step !== 'auditing') return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setAuditProgress(progress);
      setActiveCheckIndex(prev => Math.min(prev + 1, 3));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Generate Hash & Score based on checklist items selected
          const checksCount = [cscSafetyApproved, icegateVerified, weighbridgeCalibrated, insuranceActive].filter(Boolean).length;
          const score = 85.0 + checksCount * 3.7;
          setCalculatedTrustScore(parseFloat(score.toFixed(1)));
          setGeneratedHash(`POC_0X${Math.random().toString(36).substring(2, 10).toUpperCase()}_APPROVED`);
          setStep('certificate');
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step, cscSafetyApproved, icegateVerified, weighbridgeCalibrated, insuranceActive]);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLane) return;
    setAuditProgress(0);
    setActiveCheckIndex(0);
    setStep('auditing');
  };

  const handleFinalPublish = () => {
    if (!selectedLane) return;

    const newCap: Capacity = {
      id: `cap_${Date.now()}`,
      laneId: selectedLane.id,
      lspId,
      lspName,
      originPort: selectedLane.originPort,
      destinationPort: selectedLane.destinationPort,
      containerId,
      containerType,
      totalCbm,
      freeCbm,
      maxWeightKg,
      freeWeightKg,
      etd,
      cutoffTime,
      acceptedCargoTypes,
      hazmatAllowed,
      freshnessTimestamp: new Date().toISOString(),
      isStale: false,
      isBookable: true,
      assignedPackagesCount: 4,
      trustApprovalStatus: 'APPROVED_WITH_TRUST',
      trustScore: calculatedTrustScore,
      proofOfCapacityHash: generatedHash,
      verificationDetails: {
        cscSafetyApproved,
        icegateVerified,
        weighbridgeCalibrated,
        insuranceActive,
        auditedAt: new Date().toISOString()
      }
    };

    onPublish(newCap);
  };

  const toggleCargoType = (type: CargoType) => {
    if (acceptedCargoTypes.includes(type)) {
      setAcceptedCargoTypes(acceptedCargoTypes.filter(t => t !== type));
    } else {
      setAcceptedCargoTypes([...acceptedCargoTypes, type]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 border border-emerald-500/40 shadow-2xl relative my-8 space-y-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Step 1: Publication & Verification Form */}
        {step === 'form' && (
          <>
            {/* Header with Verified Trust Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="p-2.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold font-outfit text-white">Publish Verified Capacity</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      TRUST ENGINE ENABLED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Declare space availability, physical inspection safety, and ICEGATE customs compliance</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* LSP Verified Compliance Status Strip */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white font-sans">{lspName}</span>
                  <span className="text-slate-400 text-[11px] block">Verified Consolidator (IEC &amp; GSTIN Audited)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold">
                  ICEGATE INTEGRATED
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  4.9 ★ RATING
                </span>
              </div>
            </div>

            <form onSubmit={handleStartAudit} className="space-y-4">
              
              {/* Lane Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Transport Corridor</label>
                <select
                  value={selectedLaneId}
                  onChange={(e) => setSelectedLaneId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                >
                  {lanes.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.originPort} → {l.destinationPort} ({l.frequency}) — ₹{l.baseRatePerCbm}/CBM
                    </option>
                  ))}
                </select>
              </div>

              {/* Container Identifier & Unit Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Equipment Identifier Code (CSC Plate)</label>
                  <input
                    type="text"
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-cyan-400 focus:outline-none focus:border-emerald-500 transition"
                    placeholder="e.g. MSCU-889120-4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Logistics Transport Vehicle Space</label>
                  <select
                    value={containerType}
                    onChange={(e) => setContainerType(e.target.value as ContainerType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="40ft_hc">🚢 Water: 40ft High Cube Container (68 CBM)</option>
                    <option value="20ft_std">🚢 Water: 20ft Standard Dry Container (33 CBM)</option>
                    <option value="40ft_reefer">🚢 Water: 40ft Refrigerated Reefer Container</option>
                    <option value="box_truck">🚛 Road: Logistics Box Truck (24 CBM)</option>
                    <option value="semi_trailer">🚛 Road: Heavy Semi-Trailer (65 CBM)</option>
                    <option value="sprinter_van">🚛 Road: Sprinter Cargo Van (12 CBM)</option>
                    <option value="air_pallet">✈️ Air: Air Freight ULD Pallet (18 CBM)</option>
                    <option value="iso_tank">🧪 Chemical: ISO Liquid Tank</option>
                  </select>
                </div>
              </div>

              {/* Volume & Weight Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Volume (CBM)</label>
                  <input
                    type="number"
                    value={totalCbm}
                    onChange={(e) => setTotalCbm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Free CBM</label>
                  <input
                    type="number"
                    value={freeCbm}
                    onChange={(e) => setFreeCbm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-blue-400 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Payload (kg)</label>
                  <input
                    type="number"
                    value={maxWeightKg}
                    onChange={(e) => setMaxWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Weight (kg)</label>
                  <input
                    type="number"
                    value={freeWeightKg}
                    onChange={(e) => setFreeWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-cyan-400 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Interactive Inspection & Trust Verification Checklist */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5 font-sans">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Physical Equipment Inspection &amp; Trust Checklist:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">REQUIRED FOR TRUST STAMP</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <label className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition">
                    <input
                      type="checkbox"
                      checked={cscSafetyApproved}
                      onChange={(e) => setCscSafetyApproved(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 text-[11px]">ISO 6346 CSC Safety Plate Approved</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition">
                    <input
                      type="checkbox"
                      checked={icegateVerified}
                      onChange={(e) => setIcegateVerified(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 text-[11px]">ICEGATE Customs Gate Pass Linked</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition">
                    <input
                      type="checkbox"
                      checked={weighbridgeCalibrated}
                      onChange={(e) => setWeighbridgeCalibrated(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 text-[11px]">Zero-Tare Calibrated Weighbridge</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition">
                    <input
                      type="checkbox"
                      checked={insuranceActive}
                      onChange={(e) => setInsuranceActive(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300 text-[11px]">Cargo Liability Insurance Policy Linked</span>
                  </label>
                </div>
              </div>

              {/* Action Button: Trigger Trust Verification Pipeline */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span>Initiate Real-Time Trust Audit &amp; Publish Space</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-emerald-200" />
                </button>
              </div>

            </form>
          </>
        )}

        {/* Step 2: Animated Live Trust Audit Suite */}
        {step === 'auditing' && (
          <div className="py-8 px-4 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-pulse relative">
              <ShieldCheck className="w-10 h-10" />
              <Loader2 className="w-24 h-24 absolute inset-0 text-emerald-500 animate-spin -m-2 opacity-50" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-outfit text-white">Automated Trust &amp; Compliance Audit in Progress</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Scanning ICEGATE Customs, ISO 6346 CSC Safety database, and weighbridge tare weight certification...
              </p>
            </div>

            {/* Audit Progress Bar */}
            <div className="max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-400">Audit Completion</span>
                <span className="text-emerald-400">{auditProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500" 
                  style={{ width: `${auditProgress}%` }}
                />
              </div>
            </div>

            {/* Live Terminal Audit Checks */}
            <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs font-mono">
              <div className="flex items-center space-x-2">
                {activeCheckIndex >= 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                )}
                <span className={activeCheckIndex >= 0 ? 'text-slate-200' : 'text-slate-500'}>
                  [1/4] Querying ICEGATE Customs Gate Pass &amp; IEC Registry... <strong className="text-emerald-400">[PASSED]</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {activeCheckIndex >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                )}
                <span className={activeCheckIndex >= 1 ? 'text-slate-200' : 'text-slate-500'}>
                  [2/4] Auditing ISO 6346 CSC Container Safety Plate... <strong className="text-emerald-400">[VERIFIED]</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {activeCheckIndex >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                )}
                <span className={activeCheckIndex >= 2 ? 'text-slate-200' : 'text-slate-500'}>
                  [3/4] Verifying Weighbridge Calibration &amp; Cargo Insurance Policy... <strong className="text-emerald-400">[ACTIVE]</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {activeCheckIndex >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                )}
                <span className={activeCheckIndex >= 3 ? 'text-slate-200' : 'text-slate-500'}>
                  [4/4] Minting Cryptographic Proof of Capacity (PoC)... <strong className="text-cyan-400">[MINTED]</strong>
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Step 3: Verified Trust Certificate Approval Screen */}
        {step === 'certificate' && (
          <div className="space-y-5 animate-fadeIn">
            
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">Capacity Approved with Trust!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All regulatory, physical safety, and customs compliance audits passed successfully. Ready for live network publishing.
              </p>
            </div>

            {/* Official Trust Seal Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Carrier / Consolidator</span>
                  <div className="font-bold text-white text-base font-outfit">{lspName}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Trust Score</span>
                  <div className="text-2xl font-extrabold font-mono text-emerald-400">{calculatedTrustScore}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">EQUIPMENT ID</span>
                  <span className="text-cyan-400 font-bold">{containerId}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">TRANSPORT TYPE</span>
                  <span className="text-slate-200 font-bold uppercase">{containerType.replace('_', ' ')}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">CUSTOMS STATUS</span>
                  <span className="text-emerald-400 font-bold">ICEGATE AUDITED ✓</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SAFETY PLATE</span>
                  <span className="text-emerald-400 font-bold">ISO 6346 CSC PASSED ✓</span>
                </div>
              </div>

              {/* Proof Hash */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center space-x-2 text-xs font-mono">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-500 block">PROOF HASH</span>
                  <span className="text-emerald-400 font-bold truncate block">{generatedHash}</span>
                </div>
              </div>

            </div>

            {/* Final Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setStep('form')}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                onClick={handleFinalPublish}
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>Publish Live with Verified Trust Seal</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
