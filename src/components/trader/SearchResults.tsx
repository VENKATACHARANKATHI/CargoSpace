import React, { useState } from 'react';
import { CargoDeclaration, MatchingResult, Capacity } from '../../types';
import { 
  Ship, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Info, 
  Lock, 
  ArrowRight,
  Sliders,
  Box,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Zap,
  Tag,
  Award
} from 'lucide-react';
import { Container3DVisualizer } from '../visualizer/Container3DVisualizer';
import { TrustCertificateModal } from '../common/TrustCertificateModal';

interface SearchResultsProps {
  results: MatchingResult[];
  cargo: CargoDeclaration;
  onSelectHold: (result: MatchingResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, cargo, onSelectHold }) => {
  const [matchingMode, setMatchingMode] = useState<'constraint' | 'volume_only'>('constraint');
  const [sortBy, setSortBy] = useState<'price' | 'transit' | 'fit'>('price');
  const [active3DPreviewId, setActive3DPreviewId] = useState<string | null>(null);
  const [selectedTrustCap, setSelectedTrustCap] = useState<Capacity | null>(null);

  // Dynamic sorting logic
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price') return a.totalQuoteInr - b.totalQuoteInr;
    if (sortBy === 'transit') return a.lane.transitDays - b.lane.transitDays;
    return b.volumeFitPercentage - a.volumeFitPercentage;
  });

  const displayedResults = sortedResults.filter(r => true);

  const volumeOnlyMatchesCount = results.filter(r => r.passesVolumeOnlyMode).length;
  const constraintMatchesCount = results.filter(r => r.passesConstraintMode).length;
  const invalidVolumeOnlyCount = results.filter(r => r.passesVolumeOnlyMode && !r.passesConstraintMode).length;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Freight Engine Control Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-outfit text-white">
                Consolidation Optimization & Matching Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live capacity evaluation across physical mass payload, volume fit, hazmat compliance, and LSP inspection status.
            </p>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setMatchingMode('volume_only')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                matchingMode === 'volume_only'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Volume-Only Mode</span>
              {invalidVolumeOnlyCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px]">
                  {invalidVolumeOnlyCount} Infeasible
                </span>
              )}
            </button>

            <button
              onClick={() => setMatchingMode('constraint')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                matchingMode === 'constraint'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Constraint Mode (Flexport Engine)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Insight Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-3 text-xs">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-slate-200 flex items-center space-x-2">
              <span>Matching Engine Summary for {cargo.originPort} → {cargo.destinationPort}</span>
            </div>
            <p className="text-slate-300">
              <strong className="text-emerald-400">{constraintMatchesCount} verified capacity option(s)</strong> passed all operational checks.{' '}
              {invalidVolumeOnlyCount > 0 && (
                <span>
                  <strong className="text-rose-400">{invalidVolumeOnlyCount} option(s)</strong> failed payload mass limits or hazmat compliance and will be rejected at warehouse acceptance.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Results Filter & Dynamic Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold gap-3 px-1">
        <div className="flex items-center space-x-2 text-slate-400">
          <span>Showing <strong className="text-white">{displayedResults.length} Verified Capacities</strong></span>
          <span>•</span>
          <span className="font-mono text-cyan-400 font-bold">
            Cargo: {cargo.cbm} m³ / {cargo.weightKg} kg ({cargo.cargoType.toUpperCase()})
          </span>
        </div>

        {/* Dynamic Sort By Buttons */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <span className="text-slate-400 px-2 font-mono text-[11px] flex items-center space-x-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Sort By:</span>
          </span>
          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-1 rounded-lg transition font-bold cursor-pointer ${
              sortBy === 'price' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lowest Rate
          </button>
          <button
            onClick={() => setSortBy('transit')}
            className={`px-3 py-1 rounded-lg transition font-bold cursor-pointer ${
              sortBy === 'transit' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fastest Transit
          </button>
          <button
            onClick={() => setSortBy('fit')}
            className={`px-3 py-1 rounded-lg transition font-bold cursor-pointer ${
              sortBy === 'fit' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Optimal Fit %
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {displayedResults.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
            <Ship className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-300">No Suitable Consolidation Options Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No published capacities match your origin, destination, and ready date constraints. Try adjusting dates or volume requirements.
            </p>
          </div>
        ) : (
          displayedResults.map((r, idx) => {
            const isFeasible = matchingMode === 'constraint' ? r.passesConstraintMode : r.passesVolumeOnlyMode;
            const hasConstraintFailures = r.constraintViolations.length > 0;
            const is3DOpen = active3DPreviewId === r.capacity.id;

            return (
              <div
                key={r.capacity.id || idx}
                className={`glass-card rounded-2xl p-6 transition duration-200 relative overflow-hidden ${
                  !isFeasible ? 'opacity-80 border-rose-500/20 bg-rose-950/10' : 'border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {/* Feasibility Ribbon */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  
                  {/* LSP Info & Badge */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                      <Ship className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-bold text-white">{r.capacity.lspName}</h4>
                        <button
                          onClick={() => setSelectedTrustCap(r.capacity)}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 font-mono hover:bg-emerald-500/30 hover:border-emerald-400 transition cursor-pointer shadow-sm"
                          title="Click to inspect verified Trust & Compliance Certificate"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>APPROVED WITH TRUST (ICEGATE + CSC AUDITED)</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span>Unit: <strong className="font-mono text-cyan-400">{r.capacity.containerId}</strong></span>
                        <span>•</span>
                        <span>Equipment: <strong className="uppercase text-slate-200">{r.capacity.containerType.replace('_', ' ')}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Transit Details */}
                  <div className="flex items-center space-x-6 text-xs text-slate-300 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">ETD Departure</div>
                      <div className="font-semibold text-slate-100 font-mono">{r.capacity.etd}</div>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Transit Duration</div>
                      <div className="font-semibold text-blue-400">{r.lane.transitDays} Days Direct</div>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-mono">CFS Cutoff</div>
                      <div className="font-semibold text-amber-400 font-mono">
                        {r.capacity.cutoffTime.slice(0, 10)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics, Quote & Fit Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                  
                  {/* Space & Weight Capacity Usage */}
                  <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Volume Space Fit</span>
                        <span className="font-mono font-semibold text-blue-400">
                          {cargo.cbm}m³ / {r.capacity.freeCbm}m³ free ({r.volumeFitPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            r.volumeFitPercentage > 90 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(r.volumeFitPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Payload Mass Fit</span>
                        <span className="font-mono font-semibold text-cyan-400">
                          {cargo.weightKg}kg / {r.capacity.freeWeightKg}kg free ({r.weightFitPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            r.weightFitPercentage > 100 ? 'bg-rose-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${Math.min(r.weightFitPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tariff Quotation Breakdown */}
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="text-slate-400 font-mono text-[10px] uppercase flex justify-between">
                      <span>Tariff Quotation</span>
                      <span>Q_billable: {r.billableWeightCbm.toFixed(2)} CBM</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ocean Freight ({r.lane.baseRatePerCbm}/CBM)</span>
                      <span className="font-mono">₹{r.oceanFreight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CFS Handling & Terminal Fee</span>
                      <span className="font-mono">₹{r.cfsHandling.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gate Origin/Dest Fees</span>
                      <span className="font-mono">₹{(r.originCharges + r.destinationCharges).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Total Quote & Hold Action */}
                  <div className="flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-4 rounded-xl border border-blue-500/20 shadow-lg">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Total Freight Quotation</div>
                      <div className="text-2xl font-bold font-mono text-white text-blue-400">
                        ₹{r.totalQuoteInr.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">All inclusive origin-to-CFS rate</div>
                    </div>

                    {/* Booking Action */}
                    <div className="mt-3">
                      {r.passesConstraintMode ? (
                        <button
                          onClick={() => onSelectHold(r)}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Hold Slot (15-Min Lock)</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-slate-800 text-slate-500 font-semibold py-2.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2 text-xs border border-slate-700/50"
                        >
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Infeasible Cargo Option</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* 3D Vehicle Placement Inspection Bar Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActive3DPreviewId(is3DOpen ? null : r.capacity.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer ${
                      is3DOpen
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 glow-cyan'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Box className="w-4 h-4 text-cyan-400" />
                    <span>
                      {is3DOpen 
                        ? 'Close 3D Stowage Visualizer' 
                        : r.capacity.containerType === 'air_pallet'
                        ? '✈️ Inspect 3D Aircraft ULD Stowage & Select Slot'
                        : r.capacity.containerType === 'box_truck' || r.capacity.containerType === 'semi_trailer' || r.capacity.containerType === 'sprinter_van'
                        ? '🚛 Inspect 3D Truck Stowage & Select Slot'
                        : '🚢 Inspect 3D Cargo Ship Stowage & Select Container Slot'}
                    </span>
                    {is3DOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                    Unit: <strong className="text-cyan-400">{r.capacity.containerId}</strong> • Select slot visually on 3D transport
                  </span>
                </div>

                {/* Embedded Live 3D Vehicle Visualizer */}
                {is3DOpen && (
                  <div className="mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
                    <Container3DVisualizer
                      containerId={r.capacity.containerId}
                      capacity={r.capacity}
                      targetCargo={cargo}
                      isBookingPreview={true}
                    />
                  </div>
                )}

                {/* Constraint Violations Box if any */}
                {hasConstraintFailures && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                    <div className="font-semibold flex items-center space-x-1 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Constraint Engine Rejection Reasons ({r.constraintViolations.length}):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      {r.constraintViolations.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Trust Certificate Modal */}
      {selectedTrustCap && (
        <TrustCertificateModal
          capacity={selectedTrustCap}
          onClose={() => setSelectedTrustCap(null)}
        />
      )}

    </div>
  );
};
