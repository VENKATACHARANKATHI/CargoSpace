import { Capacity, CargoDeclaration, Lane, LSPProfile, MatchingResult } from '../types';

/**
 * Calculates billable weight-or-measure quotient Q_billable
 * Q_billable = max( Volume_m3 , Weight_kg / 1000 )
 */
export function calculateBillableVolume(volumeCbm: number, weightKg: number): number {
  return Math.max(volumeCbm, weightKg / 1000);
}

/**
 * Calculates exact side-by-side quote for a given capacity and cargo declaration
 */
export function calculateQuote(
  lane: Lane,
  capacity: Capacity,
  cargo: CargoDeclaration
): MatchingResult {
  const billableCbm = calculateBillableVolume(cargo.cbm, cargo.weightKg);

  // Ocean Freight base
  const oceanFreight = Math.round(billableCbm * lane.baseRatePerCbm);
  
  // CFS (Container Freight Station) Terminal handling fee
  const cfsHandling = Math.round(billableCbm * 1450); // ₹1450 per billable CBM

  // Weight surcharge if density > 400 kg/CBM
  const density = cargo.weightKg / (cargo.cbm || 1);
  const weightSurcharge = density > 400 ? Math.round((cargo.weightKg * lane.weightSurchargePerKg)) : 0;

  // Fixed origin & destination charges
  const originCharges = 3500;
  const destinationCharges = 4200;

  const totalQuoteInr = oceanFreight + cfsHandling + originCharges + destinationCharges + weightSurcharge;

  const volumeFitPercentage = Math.round((cargo.cbm / (capacity.freeCbm || 1)) * 100);
  const weightFitPercentage = Math.round((cargo.weightKg / (capacity.freeWeightKg || 1)) * 100);

  return {
    capacity,
    lane,
    billableWeightCbm: billableCbm,
    oceanFreight,
    cfsHandling,
    originCharges,
    destinationCharges,
    totalQuoteInr,
    volumeFitPercentage,
    weightFitPercentage,
    passesConstraintMode: false, // set below
    passesVolumeOnlyMode: false,  // set below
    constraintViolations: []
  };
}

/**
 * Main matching engine algorithm
 * Evaluates candidate capacities under both Volume-Only and Constraint-Aware rules.
 */
export function evaluateCapacities(
  capacities: Capacity[],
  lanes: Lane[],
  lsps: LSPProfile[],
  cargo: CargoDeclaration,
  matchingMode: 'constraint' | 'volume_only' | 'compare'
): MatchingResult[] {
  const results: MatchingResult[] = [];

  for (const cap of capacities) {
    const lane = lanes.find(l => l.id === cap.laneId);
    const lsp = lsps.find(p => p.id === cap.lspId);

    if (!lane || !lsp) continue;

    // Check basic lane route match
    const portMatch = 
      cap.originPort.toLowerCase().trim() === cargo.originPort.toLowerCase().trim() &&
      cap.destinationPort.toLowerCase().trim() === cargo.destinationPort.toLowerCase().trim();

    if (!portMatch) continue;

    const result = calculateQuote(lane, cap, cargo);
    const violations: string[] = [];
    let failureCategory: MatchingResult['failureCategory'];

    // --- Volume Only Rule ---
    // Volume only looks purely at origin/destination and whether volume fits!
    const passesVolumeOnly = cap.freeCbm >= cargo.cbm;
    result.passesVolumeOnlyMode = passesVolumeOnly;

    // --- Constraint-Aware Rules ---
    // 1. Volume Capacity Fit
    if (cap.freeCbm < cargo.cbm) {
      violations.push(`Insufficient CBM space (Required: ${cargo.cbm}m³, Available: ${cap.freeCbm}m³)`);
    }

    // 2. Weight Capacity Fit (Payload Mass limit)
    if (cap.freeWeightKg < cargo.weightKg) {
      violations.push(`Payload mass limit exceeded (Required: ${cargo.weightKg}kg, Max free: ${cap.freeWeightKg}kg)`);
      if (!failureCategory) failureCategory = 'WEIGHT_OVERCAPACITY';
    }

    // 3. Hazmat Compatibility Rule
    if (cargo.isHazmat && !cap.hazmatAllowed) {
      violations.push(`Dangerous Goods (Hazmat Class ${cargo.hazmatClass || 'UN'}) NOT permitted in container ${cap.containerId}`);
      if (!failureCategory) failureCategory = 'HAZMAT_DISALLOWED';
    }

    // 4. Cargo Type Compatibility Matrix
    if (cap.acceptedCargoTypes && cap.acceptedCargoTypes.length > 0) {
      if (!cap.acceptedCargoTypes.includes(cargo.cargoType)) {
        violations.push(`Cargo type '${cargo.cargoType.toUpperCase()}' not compatible with container stowage rules`);
        if (!failureCategory) failureCategory = 'CARGO_TYPE_INCOMPATIBLE';
      }
    }

    // 5. LSP Inspection & Approval Gate
    if (lsp.status !== 'approved') {
      violations.push(`LSP '${lsp.companyName}' has unverified/pending inspection status`);
      if (!failureCategory) failureCategory = 'UNAPPROVED_LSP';
    }

    // 6. Capacity Freshness & Inventory Staleness Check
    if (cap.isStale) {
      violations.push(`Capacity inventory is STALE (Last updated > 24 hrs ago)`);
      if (!failureCategory) failureCategory = 'STALE_FRESHNESS';
    }

    // 7. Cutoff Time Window Enforcement
    const cargoReady = new Date(cargo.readyDate).getTime();
    const cutoff = new Date(cap.cutoffTime).getTime();
    const etd = new Date(cap.etd).getTime();

    if (cutoff < cargoReady) {
      violations.push(`Cargo ready date (${cargo.readyDate}) is AFTER warehouse cutoff deadline (${cap.cutoffTime.slice(0, 10)})`);
      if (!failureCategory) failureCategory = 'CUTOFF_EXPIRED';
    }

    if (etd < cargoReady) {
      violations.push(`Vessel ETD (${cap.etd}) is BEFORE cargo ready date`);
      if (!failureCategory) failureCategory = 'CUTOFF_EXPIRED';
    }

    // 8. Stackability Constraints
    if (cargo.stackabilityLimit < 2 && cargo.cbm > 15) {
      violations.push(`Non-stackable fragile cargo exceeds single-tier container floor footprint`);
      if (!failureCategory) failureCategory = 'STACKING_EXCEEDED';
    }

    result.constraintViolations = violations;
    result.failureCategory = failureCategory;
    result.passesConstraintMode = violations.length === 0;

    results.push(result);
  }

  // Filter based on selected mode if desired
  if (matchingMode === 'constraint') {
    return results.filter(r => r.passesConstraintMode);
  } else if (matchingMode === 'volume_only') {
    return results.filter(r => r.passesVolumeOnlyMode);
  }

  // Default 'compare': Return all matching route options so evaluator can see passes/fails side by side
  return results;
}

/**
 * Computes benchmark analytics for research comparison page
 */
export function calculateBenchmarkMetrics(results: MatchingResult[]) {
  const totalVolumeMatches = results.filter(r => r.passesVolumeOnlyMode).length;
  const constraintPasses = results.filter(r => r.passesConstraintMode).length;
  
  // Volume-only false positives: Options that pass Volume-Only but FAIL Constraint-Aware!
  const falsePositives = results.filter(r => r.passesVolumeOnlyMode && !r.passesConstraintMode);

  const failureReasonsBreakdown: Record<string, number> = {
    'Weight Overcapacity': 0,
    'Hazmat Incompatible': 0,
    'Cargo Type Mismatch': 0,
    'Stale Inventory': 0,
    'Cutoff Window Expired': 0,
    'Unverified LSP': 0,
  };

  falsePositives.forEach(fp => {
    fp.constraintViolations.forEach(v => {
      if (v.includes('Payload mass limit')) failureReasonsBreakdown['Weight Overcapacity']++;
      if (v.includes('Hazmat')) failureReasonsBreakdown['Hazmat Incompatible']++;
      if (v.includes('not compatible')) failureReasonsBreakdown['Cargo Type Mismatch']++;
      if (v.includes('STALE')) failureReasonsBreakdown['Stale Inventory']++;
      if (v.includes('cutoff deadline')) failureReasonsBreakdown['Cutoff Window Expired']++;
      if (v.includes('unverified')) failureReasonsBreakdown['Unverified LSP']++;
    });
  });

  const failureRatePercentage = totalVolumeMatches > 0 
    ? Math.round((falsePositives.length / totalVolumeMatches) * 100)
    : 0;

  return {
    totalEvaluated: results.length,
    volumeOnlyMatches: totalVolumeMatches,
    constraintMatches: constraintPasses,
    falsePositivesCount: falsePositives.length,
    failureRatePercentage,
    failureReasonsBreakdown
  };
}
