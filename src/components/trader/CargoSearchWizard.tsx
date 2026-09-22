import React, { useState } from 'react';
import { CargoDeclaration, CargoType } from '../../types';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Layers, 
  Weight, 
  Calendar, 
  Flame, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface CargoSearchWizardProps {
  onSearch: (cargo: CargoDeclaration) => void;
  initialCargo?: CargoDeclaration;
}

export const CargoSearchWizard: React.FC<CargoSearchWizardProps> = ({ onSearch, initialCargo }) => {
  const [cargo, setCargo] = useState<CargoDeclaration>(
    initialCargo || {
      originPort: 'JNPT Nhava Sheva',
      destinationPort: 'Hamburg Port',
      readyDate: new Date().toISOString().slice(0, 10),
      cutoffDate: new Date(Date.now() + 7 * 86400 * 1000).toISOString().slice(0, 10),
      cbm: 12.0,
      weightKg: 8200, // Default density = 683 kg/m3 (Dense!)
      cargoType: 'general',
      isHazmat: false,
      hazmatClass: '3 (Flammable Liquid)',
      stackabilityLimit: 3
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(cargo);
  };

  // Quick Preset Scenarios for Viva Evaluators
  const loadPreset = (type: 'dense' | 'hazmat' | 'light' | 'unapproved') => {
    if (type === 'dense') {
      setCargo({
        originPort: 'JNPT Nhava Sheva',
        destinationPort: 'Hamburg Port',
        readyDate: '2026-09-22',
        cutoffDate: '2026-09-26',
        cbm: 10.0,
        weightKg: 9500, // Extremely dense! Fails weight check on cap_101
        cargoType: 'heavy_machinery',
        isHazmat: false,
        stackabilityLimit: 2
      });
    } else if (type === 'hazmat') {
      setCargo({
        originPort: 'JNPT Nhava Sheva',
        destinationPort: 'Hamburg Port',
        readyDate: '2026-09-23',
        cutoffDate: '2026-09-27',
        cbm: 14.0,
        weightKg: 3200,
        cargoType: 'chemical',
        isHazmat: true,
        hazmatClass: 'Class 3 (Flammable Liquid)',
        stackabilityLimit: 3
      });
    } else if (type === 'light') {
      setCargo({
        originPort: 'JNPT Nhava Sheva',
        destinationPort: 'Hamburg Port',
        readyDate: '2026-09-22',
        cutoffDate: '2026-09-27',
        cbm: 15.0,
        weightKg: 2800,
        cargoType: 'apparel',
        isHazmat: false,
        stackabilityLimit: 4
      });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-outfit text-white">Cargo Declaration & Lane Search</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Specify consignment physical parameters, cargo-ready dates, and hazardous classification.
          </p>
        </div>

        {/* Quick Consignment Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide px-1.5 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consignment Presets:</span>
          </span>
          <button
            type="button"
            onClick={() => loadPreset('dense')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Heavy Steel Machinery (Dense)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('hazmat')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-rose-300 cursor-pointer"
          >
            Class 3 Hazmat Drums
          </button>
          <button
            type="button"
            onClick={() => loadPreset('light')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-emerald-300 cursor-pointer"
          >
            Garments & Textiles (Optimal Fit)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multimodal Transport Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono uppercase tracking-wider">
            Select Logistics Mode of Transport:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCargo({ ...cargo, originPort: 'JNPT Nhava Sheva', destinationPort: 'Hamburg Port' })}
              className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 hover:border-blue-500 text-left transition cursor-pointer flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                🚢
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition">Water (Ocean)</div>
                <div className="text-[10px] text-slate-400">20ft/40ft Vessel Container</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCargo({ ...cargo, originPort: 'JNPT Nhava Sheva', destinationPort: 'Mundra Port' })}
              className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-500 text-left transition cursor-pointer flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                🚛
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Road (Trucking)</div>
                <div className="text-[10px] text-slate-400">Sprinter / Box Truck / Semi</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCargo({ ...cargo, originPort: 'JNPT Nhava Sheva', destinationPort: 'Dubai Jebel Ali' })}
              className="p-3 rounded-xl bg-slate-900 border border-sky-500/40 hover:border-sky-500 text-left transition cursor-pointer flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0">
                ✈️
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-400 transition">Air (Freight)</div>
                <div className="text-[10px] text-slate-400">Aircraft Cargo ULD Hold</div>
              </div>
            </button>
          </div>
        </div>

        {/* Route Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Origin Port</label>
            <select
              value={cargo.originPort}
              onChange={(e) => setCargo({ ...cargo, originPort: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="JNPT Nhava Sheva">JNPT Nhava Sheva (Mumbai, IN)</option>
              <option value="Mundra Port">Mundra Port (Gujarat, IN)</option>
              <option value="Chennai Port">Chennai Port (Tamil Nadu, IN)</option>
              <option value="Kolkata Port">Kolkata Port (West Bengal, IN)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Port</label>
            <select
              value={cargo.destinationPort}
              onChange={(e) => setCargo({ ...cargo, destinationPort: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="Hamburg Port">Hamburg Port (Germany)</option>
              <option value="Dubai Jebel Ali">Dubai Jebel Ali (UAE)</option>
              <option value="Singapore Port">Singapore Port (Singapore)</option>
              <option value="Rotterdam Port">Rotterdam Port (Netherlands)</option>
            </select>
          </div>
        </div>

        {/* Cargo Dimensions & Physical Characteristics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Volume (CBM m³)</span>
              <span className="text-[10px] text-blue-400 font-mono">1 to 50 CBM</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="60"
                value={cargo.cbm}
                onChange={(e) => setCargo({ ...cargo, cbm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition font-mono pr-8"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">m³</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Gross Mass (kg)</span>
              <span className="text-[10px] text-cyan-400 font-mono">Payload Mass</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="50"
                min="50"
                max="25000"
                value={cargo.weightKg}
                onChange={(e) => setCargo({ ...cargo, weightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition font-mono pr-8"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo Commodity Type</label>
            <select
              value={cargo.cargoType}
              onChange={(e) => setCargo({ ...cargo, cargoType: e.target.value as CargoType })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition capitalize"
            >
              <option value="general">General Cargo</option>
              <option value="apparel">Garments & Textiles</option>
              <option value="fragile">Fragile Glassware</option>
              <option value="heavy_machinery">Heavy Industrial Machinery</option>
              <option value="perishable">Perishable Agro Goods</option>
              <option value="chemical">Industrial Chemicals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Stacking Tier Limit</label>
            <select
              value={cargo.stackabilityLimit}
              onChange={(e) => setCargo({ ...cargo, stackabilityLimit: parseInt(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
            >
              <option value={1}>1 Tier (Do Not Top-Load)</option>
              <option value={2}>2 Tiers Max</option>
              <option value={3}>3 Tiers Standard</option>
              <option value={4}>4 Tiers Fully Stackable</option>
            </select>
          </div>
        </div>

        {/* Cargo Ready & Cutoff Dates + Hazmat Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Cargo Ready Date</span>
            </label>
            <input
              type="date"
              value={cargo.readyDate}
              onChange={(e) => setCargo({ ...cargo, readyDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trader Preferred Cutoff</span>
            </label>
            <input
              type="date"
              value={cargo.cutoffDate}
              onChange={(e) => setCargo({ ...cargo, cutoffDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          {/* Dangerous Goods (Hazmat) Switch */}
          <div className="flex flex-col justify-between">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hazmat Classification</label>
            <div className="flex items-center space-x-3 pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cargo.isHazmat}
                  onChange={(e) => setCargo({ ...cargo, isHazmat: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
              <span className={`text-xs font-semibold ${cargo.isHazmat ? 'text-rose-400' : 'text-slate-400'}`}>
                {cargo.isHazmat ? 'Hazmat / Dangerous Cargo' : 'Non-Hazardous'}
              </span>
            </div>
          </div>
        </div>

        {/* Calculated Cargo Density Badge */}
        <div className="flex flex-wrap items-center justify-between text-xs bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Calculated Density:</span>
            <span className="font-mono font-bold text-slate-200">
              {Math.round(cargo.weightKg / (cargo.cbm || 1))} kg/m³
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Billable Q_measure:</span>
            <span className="font-mono font-bold text-blue-400">
              {Math.max(cargo.cbm, cargo.weightKg / 1000).toFixed(2)} CBM
            </span>
          </div>

          {Math.round(cargo.weightKg / (cargo.cbm || 1)) > 500 && (
            <span className="text-amber-400 flex items-center space-x-1 text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High Density Cargo (&gt;500 kg/m³) - Mass Cap Critical</span>
            </span>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-base cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>Execute Constraint-Aware Matching Engine</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </form>
    </div>
  );
};
