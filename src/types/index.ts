export type UserRole = 'trader' | 'lsp' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  companyName: string;
  phone?: string;
  avatar?: string;
}

export interface InspectionChecklist {
  kycDocumentVerified: boolean;
  icegateIntegrationVerified: boolean;
  physicalWarehouseAudited: boolean;
  insuranceCoverageVerified: boolean;
  hazmatHandlingPermit: boolean;
}

export type LSPStatus = 'pending' | 'approved' | 'rejected';

export interface LSPProfile {
  id: string;
  userId: string;
  companyName: string;
  iecCode: string;
  gstin: string;
  status: LSPStatus;
  servedPorts: string[];
  inspectionChecklist: InspectionChecklist;
  verificationDate?: string;
  rejectionReason?: string;
  rating: number;
  completedShipments: number;
}

export interface Lane {
  id: string;
  lspId: string;
  lspName: string;
  originPort: string;
  destinationPort: string;
  transitDays: number;
  baseRatePerCbm: number; // in INR
  weightSurchargePerKg: number; // in INR
  frequency: string; // e.g. "Weekly - Wed/Sat"
}

export type ContainerType = '20ft_std' | '40ft_hc' | '40ft_reefer' | 'air_pallet' | 'iso_tank' | 'box_truck' | 'semi_trailer' | 'sprinter_van';

export type CargoType = 'general' | 'fragile' | 'heavy_machinery' | 'perishable' | 'apparel' | 'chemical';

export interface Capacity {
  id: string;
  laneId: string;
  lspId: string;
  lspName: string;
  originPort: string;
  destinationPort: string;
  containerId: string;
  containerType: ContainerType;
  totalCbm: number;
  freeCbm: number;
  maxWeightKg: number;
  freeWeightKg: number;
  etd: string; // YYYY-MM-DD
  cutoffTime: string; // YYYY-MM-DDTHH:mm:ssZ
  acceptedCargoTypes: CargoType[];
  hazmatAllowed: boolean;
  freshnessTimestamp: string; // ISO String
  isStale: boolean;
  isBookable: boolean;
  assignedPackagesCount?: number;
  trustApprovalStatus?: 'APPROVED_WITH_TRUST' | 'PENDING_TRUST_AUDIT' | 'NEEDS_VERIFICATION';
  trustScore?: number;
  proofOfCapacityHash?: string;
  verificationDetails?: {
    cscSafetyApproved: boolean;
    icegateVerified: boolean;
    weighbridgeCalibrated: boolean;
    insuranceActive: boolean;
    auditedAt: string;
  };
}

export interface CargoDeclaration {
  originPort: string;
  destinationPort: string;
  readyDate: string;
  cutoffDate: string;
  cbm: number;
  weightKg: number;
  cargoType: CargoType;
  isHazmat: boolean;
  hazmatClass?: string;
  stackabilityLimit: number; // 1 to 5 layers
  reqTempControl?: boolean;
}

export interface MatchingResult {
  capacity: Capacity;
  lane: Lane;
  billableWeightCbm: number; // max(volume, weight / 1000)
  totalQuoteInr: number;
  oceanFreight: number;
  cfsHandling: number;
  originCharges: number;
  destinationCharges: number;
  volumeFitPercentage: number;
  weightFitPercentage: number;
  passesConstraintMode: boolean;
  passesVolumeOnlyMode: boolean;
  constraintViolations: string[];
  failureCategory?: 'WEIGHT_OVERCAPACITY' | 'HAZMAT_DISALLOWED' | 'CARGO_TYPE_INCOMPATIBLE' | 'STALE_FRESHNESS' | 'CUTOFF_EXPIRED' | 'UNAPPROVED_LSP' | 'STACKING_EXCEEDED';
}

export type HoldStatus = 'HOLD' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'DISPUTED';

export type MilestoneStage = 
  | 'HOLD_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'WAREHOUSE_RECEIVED'
  | 'INSPECTION_PASSED'
  | 'CONTAINER_STUFFED'
  | 'IN_TRANSIT'
  | 'DELIVERED';

export interface MilestoneStep {
  stage: MilestoneStage;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface BookingHold {
  id: string;
  idempotencyKey: string;
  lspId: string;
  lspName: string;
  capacityId: string;
  traderId: string;
  traderName: string;
  cargo: CargoDeclaration;
  quote: MatchingResult;
  holdStatus: HoldStatus;
  expiresAt: string; // ISO string 15 mins after creation
  createdAt: string;
  paymentId?: string;
  milestoneStage: MilestoneStage;
  milestoneHistory: MilestoneStep[];
  cancellationReason?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amountInr: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  method: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'SIMULATED_GATEWAY';
  transactionRef: string;
  timestamp: string;
  refundRef?: string;
}

export interface AuditLog {
  id: string;
  entityType: 'LSP' | 'CAPACITY' | 'BOOKING' | 'PAYMENT' | 'MATCHING_ENGINE';
  entityId: string;
  action: string;
  performedByRole: UserRole;
  performedByName: string;
  timestamp: string;
  details: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  traderName: string;
  lspName: string;
  issueType: 'WEIGHT_MISMATCH' | 'CBM_DISCREPANCY' | 'DAMAGED_PACKAGING' | 'DELAYED_STUFFING';
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'REJECTED';
  resolutionNotes?: string;
  createdAt: string;
}

export type ViewTab = 
  | 'SEARCH_BOOK' 
  | 'MY_BOOKINGS' 
  | 'LSP_CAPACITY' 
  | 'LSP_INBOX' 
  | 'LSP_ONBOARDING' 
  | 'ADMIN_APPROVALS' 
  | 'ADMIN_BOOKINGS' 
  | 'ADMIN_DISPUTES' 
  | 'RESEARCH_BENCHMARK'
  | '3D_CONTAINER_VISUALIZER';
