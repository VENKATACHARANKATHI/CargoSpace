import { AuditLog, BookingHold, Capacity, Dispute, Lane, LSPProfile, Payment, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_1',
    email: 'admin@cargospace.com',
    name: 'Vikramaditya Sharma',
    role: 'admin',
    companyName: 'CargoSpace Operations & Compliance',
    phone: '+91 98765 00001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr_lsp_1',
    email: 'lsp@apexlogistics.com',
    name: 'Rajesh Nair',
    role: 'lsp',
    companyName: 'Apex Ocean Freight & Forwarding Pvt Ltd',
    phone: '+91 98765 11111',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr_lsp_2',
    email: 'ops@bluedart ocean.com',
    name: 'Ananya Deshmukh',
    role: 'lsp',
    companyName: 'Blue Harbor Logistics Ltd',
    phone: '+91 98765 22222',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr_lsp_3',
    email: 'contact@transworld.in',
    name: 'Karthik Raja',
    role: 'lsp',
    companyName: 'TransWorld Global Cargo Services (Pending Inspection)',
    phone: '+91 98765 33333',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr_trader_1',
    email: 'trader@craftsexports.in',
    name: 'Priya Sundaram',
    role: 'trader',
    companyName: 'Surya Handicrafts & Textiles Exporters',
    phone: '+91 98765 44444',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr_trader_2',
    email: 'exports@spiceworld.com',
    name: 'Amitabh Sen',
    role: 'trader',
    companyName: 'Deccan Spice & Agro Products Exporters',
    phone: '+91 98765 55555',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_LSPS: LSPProfile[] = [
  {
    id: 'lsp_1',
    userId: 'usr_lsp_1',
    companyName: 'Apex Ocean Freight & Forwarding Pvt Ltd',
    iecCode: '0519842109',
    gstin: '27AAAAA0000A1Z5',
    status: 'approved',
    servedPorts: ['JNPT Nhava Sheva', 'Mundra Port', 'Hamburg Port', 'Dubai Jebel Ali', 'Singapore Port'],
    inspectionChecklist: {
      kycDocumentVerified: true,
      icegateIntegrationVerified: true,
      physicalWarehouseAudited: true,
      insuranceCoverageVerified: true,
      hazmatHandlingPermit: true
    },
    verificationDate: '2026-08-15',
    rating: 4.9,
    completedShipments: 142
  },
  {
    id: 'lsp_2',
    userId: 'usr_lsp_2',
    companyName: 'Blue Harbor Logistics Ltd',
    iecCode: '0314887201',
    gstin: '33BBBBB1111B2Z4',
    status: 'approved',
    servedPorts: ['JNPT Nhava Sheva', 'Chennai Port', 'Rotterdam Port', 'Singapore Port', 'New York Harbor'],
    inspectionChecklist: {
      kycDocumentVerified: true,
      icegateIntegrationVerified: true,
      physicalWarehouseAudited: true,
      insuranceCoverageVerified: true,
      hazmatHandlingPermit: false
    },
    verificationDate: '2026-08-20',
    rating: 4.7,
    completedShipments: 98
  },
  {
    id: 'lsp_3',
    userId: 'usr_lsp_3',
    companyName: 'TransWorld Global Cargo Services',
    iecCode: '0711928374',
    gstin: '07CCCCC2222C3Z3',
    status: 'pending',
    servedPorts: ['Kolkata Port', 'Mundra Port', 'Dubai Jebel Ali', 'Colombo Port'],
    inspectionChecklist: {
      kycDocumentVerified: true,
      icegateIntegrationVerified: false,
      physicalWarehouseAudited: false,
      insuranceCoverageVerified: true,
      hazmatHandlingPermit: false
    },
    rating: 4.1,
    completedShipments: 12
  }
];

export const INITIAL_LANES: Lane[] = [
  {
    id: 'lane_1',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    transitDays: 21,
    baseRatePerCbm: 4200,
    weightSurchargePerKg: 4.5,
    frequency: 'Weekly - Every Wednesday'
  },
  {
    id: 'lane_2',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Dubai Jebel Ali',
    transitDays: 6,
    baseRatePerCbm: 2400,
    weightSurchargePerKg: 3.0,
    frequency: 'Bi-Weekly - Tue/Fri'
  },
  {
    id: 'lane_3',
    lspId: 'lsp_2',
    lspName: 'Blue Harbor Logistics',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    transitDays: 23,
    baseRatePerCbm: 3900,
    weightSurchargePerKg: 5.0,
    frequency: 'Weekly - Every Saturday'
  },
  {
    id: 'lane_4',
    lspId: 'lsp_2',
    lspName: 'Blue Harbor Logistics',
    originPort: 'Chennai Port',
    destinationPort: 'Singapore Port',
    transitDays: 7,
    baseRatePerCbm: 1800,
    weightSurchargePerKg: 2.5,
    frequency: 'Daily Direct'
  },
  {
    id: 'lane_5',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'Mundra Port',
    destinationPort: 'Rotterdam Port',
    transitDays: 24,
    baseRatePerCbm: 4500,
    weightSurchargePerKg: 4.0,
    frequency: 'Weekly - Every Monday'
  },
  {
    id: 'lane_6',
    lspId: 'lsp_3',
    lspName: 'TransWorld Global Cargo (Unapproved)',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    transitDays: 20,
    baseRatePerCbm: 3200,
    weightSurchargePerKg: 3.5,
    frequency: 'Weekly - Every Thursday'
  }
];

export const INITIAL_CAPACITIES: Capacity[] = [
  {
    id: 'cap_101',
    laneId: 'lane_1',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    containerId: 'MSCU-892104-5',
    containerType: '40ft_hc',
    totalCbm: 68,
    freeCbm: 28.5,
    maxWeightKg: 26000,
    freeWeightKg: 4200, // Dense cargo in other slots! Weight is tight!
    etd: '2026-09-28',
    cutoffTime: '2026-09-25T18:00:00Z',
    acceptedCargoTypes: ['general', 'apparel', 'heavy_machinery'],
    hazmatAllowed: true,
    freshnessTimestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 14
  },
  {
    id: 'cap_102',
    laneId: 'lane_1',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    containerId: 'HLCU-441209-8',
    containerType: '20ft_std',
    totalCbm: 33,
    freeCbm: 14.0,
    maxWeightKg: 21600,
    freeWeightKg: 11200,
    etd: '2026-10-02',
    cutoffTime: '2026-09-29T12:00:00Z',
    acceptedCargoTypes: ['general', 'apparel', 'fragile'],
    hazmatAllowed: false,
    freshnessTimestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago (STALE!)
    isStale: true,
    isBookable: false,
    assignedPackagesCount: 8
  },
  {
    id: 'cap_103',
    laneId: 'lane_3',
    lspId: 'lsp_2',
    lspName: 'Blue Harbor Logistics',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    containerId: 'CMAU-910283-1',
    containerType: '40ft_hc',
    totalCbm: 68,
    freeCbm: 34.0,
    maxWeightKg: 26000,
    freeWeightKg: 15400,
    etd: '2026-09-30',
    cutoffTime: '2026-09-27T16:00:00Z',
    acceptedCargoTypes: ['general', 'apparel', 'fragile', 'heavy_machinery'],
    hazmatAllowed: false, // Hazmat disallowed
    freshnessTimestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 18
  },
  {
    id: 'cap_104',
    laneId: 'lane_2',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Dubai Jebel Ali',
    containerId: 'EGLU-332901-0',
    containerType: '20ft_std',
    totalCbm: 33,
    freeCbm: 18.0,
    maxWeightKg: 21600,
    freeWeightKg: 9500,
    etd: '2026-09-24',
    cutoffTime: '2026-09-22T20:00:00Z',
    acceptedCargoTypes: ['general', 'perishable', 'chemical'],
    hazmatAllowed: true,
    freshnessTimestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 6
  },
  {
    id: 'cap_105',
    laneId: 'lane_6',
    lspId: 'lsp_3',
    lspName: 'TransWorld Global Cargo (Unapproved)',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    containerId: 'TWU-772109-3',
    containerType: '40ft_hc',
    totalCbm: 68,
    freeCbm: 40.0,
    maxWeightKg: 26000,
    freeWeightKg: 18000,
    etd: '2026-09-29',
    cutoffTime: '2026-09-26T18:00:00Z',
    acceptedCargoTypes: ['general', 'apparel'],
    hazmatAllowed: false,
    freshnessTimestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 10
  },
  {
    id: 'cap_106',
    laneId: 'lane_2',
    lspId: 'lsp_1',
    lspName: 'Apex Express Road Logistics',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Mundra Port',
    containerId: 'TRK-BOX-8891',
    containerType: 'box_truck',
    totalCbm: 24,
    freeCbm: 16.0,
    maxWeightKg: 9500,
    freeWeightKg: 6200,
    etd: '2026-09-25',
    cutoffTime: '2026-09-24T18:00:00Z',
    acceptedCargoTypes: ['general', 'apparel', 'fragile', 'heavy_machinery'],
    hazmatAllowed: true,
    freshnessTimestamp: new Date().toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 4
  },
  {
    id: 'cap_107',
    laneId: 'lane_2',
    lspId: 'lsp_2',
    lspName: 'Blue Harbor Air Freight',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Dubai Jebel Ali',
    containerId: 'ULD-AIR-9921',
    containerType: 'air_pallet',
    totalCbm: 18,
    freeCbm: 12.0,
    maxWeightKg: 4500,
    freeWeightKg: 3100,
    etd: '2026-09-24',
    cutoffTime: '2026-09-23T22:00:00Z',
    acceptedCargoTypes: ['general', 'apparel', 'perishable', 'chemical'],
    hazmatAllowed: false,
    freshnessTimestamp: new Date().toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 3
  },
  {
    id: 'cap_108',
    laneId: 'lane_6',
    lspId: 'lsp_3',
    lspName: 'TransWorld Global (Unapproved)',
    originPort: 'JNPT Nhava Sheva',
    destinationPort: 'Hamburg Port',
    containerId: 'TGCU-772183-4',
    containerType: '40ft_hc',
    totalCbm: 68,
    freeCbm: 40.0,
    maxWeightKg: 26000,
    freeWeightKg: 18000,
    etd: '2026-09-29',
    cutoffTime: '2026-09-26T14:00:00Z',
    acceptedCargoTypes: ['general', 'apparel'],
    hazmatAllowed: false,
    freshnessTimestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isStale: false,
    isBookable: true,
    assignedPackagesCount: 5
  }
];

export const INITIAL_BOOKINGS: BookingHold[] = [
  {
    id: 'bkg_9001',
    idempotencyKey: 'idemp_9001_8a72b',
    lspId: 'lsp_1',
    lspName: 'Apex Ocean Freight',
    capacityId: 'cap_101',
    traderId: 'usr_trader_1',
    traderName: 'Surya Handicrafts & Textiles Exporters',
    cargo: {
      originPort: 'JNPT Nhava Sheva',
      destinationPort: 'Hamburg Port',
      readyDate: '2026-09-22',
      cutoffDate: '2026-09-25',
      cbm: 12.5,
      weightKg: 2800,
      cargoType: 'apparel',
      isHazmat: false,
      stackabilityLimit: 4
    },
    quote: {
      capacity: INITIAL_CAPACITIES[0],
      lane: INITIAL_LANES[0],
      billableWeightCbm: 12.5,
      totalQuoteInr: 74625,
      oceanFreight: 52500,
      cfsHandling: 18125,
      originCharges: 3500,
      destinationCharges: 4200,
      volumeFitPercentage: 43,
      weightFitPercentage: 66,
      passesConstraintMode: true,
      passesVolumeOnlyMode: true,
      constraintViolations: []
    },
    holdStatus: 'CONFIRMED',
    createdAt: '2026-09-18T10:15:00Z',
    expiresAt: '2026-09-18T10:30:00Z',
    paymentId: 'pay_1001',
    milestoneStage: 'IN_TRANSIT',
    milestoneHistory: [
      { stage: 'HOLD_CREATED', title: 'Slot Hold Secured', description: '15-min atomic TTL lock established', timestamp: '2026-09-18 10:15', isCompleted: true, isCurrent: false },
      { stage: 'PAYMENT_CONFIRMED', title: 'Payment Reconciled', description: 'Simulated payment of ₹74,625 processed', timestamp: '2026-09-18 10:22', isCompleted: true, isCurrent: false },
      { stage: 'WAREHOUSE_RECEIVED', title: 'Gate In at CFS Hub', description: 'Verified weight & dimensions at Nhava Sheva CFS', timestamp: '2026-09-19 14:30', isCompleted: true, isCurrent: false },
      { stage: 'INSPECTION_PASSED', title: 'Customs & Physical Check', description: 'ICEGATE shipping bill cleared, zero discrepancy', timestamp: '2026-09-19 17:00', isCompleted: true, isCurrent: false },
      { stage: 'CONTAINER_STUFFED', title: 'Container Loading Complete', description: 'Loaded into 40ft HC MSCU-892104-5', timestamp: '2026-09-20 09:00', isCompleted: true, isCurrent: false },
      { stage: 'IN_TRANSIT', title: 'Vessel On-Board', description: 'Vessel MSC Alexandra departed JNPT', timestamp: '2026-09-20 12:30', isCompleted: true, isCurrent: true },
      { stage: 'DELIVERED', title: 'Destination Unstuffed', description: 'Hamburg CFS release pending', isCompleted: false, isCurrent: false }
    ]
  },
  {
    id: 'bkg_9002',
    idempotencyKey: 'idemp_9002_4c19d',
    lspId: 'lsp_2',
    lspName: 'Blue Harbor Logistics',
    capacityId: 'cap_103',
    traderId: 'usr_trader_2',
    traderName: 'Deccan Spice & Agro Products Exporters',
    cargo: {
      originPort: 'JNPT Nhava Sheva',
      destinationPort: 'Hamburg Port',
      readyDate: '2026-09-23',
      cutoffDate: '2026-09-27',
      cbm: 18.0,
      weightKg: 8500,
      cargoType: 'general',
      isHazmat: false,
      stackabilityLimit: 3
    },
    quote: {
      capacity: INITIAL_CAPACITIES[2],
      lane: INITIAL_LANES[2],
      billableWeightCbm: 18.0,
      totalQuoteInr: 107800,
      oceanFreight: 70200,
      cfsHandling: 26100,
      originCharges: 3500,
      destinationCharges: 4200,
      volumeFitPercentage: 52,
      weightFitPercentage: 55,
      passesConstraintMode: true,
      passesVolumeOnlyMode: true,
      constraintViolations: []
    },
    holdStatus: 'HOLD',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 mins remaining
    milestoneStage: 'HOLD_CREATED',
    milestoneHistory: [
      { stage: 'HOLD_CREATED', title: 'Slot Hold Active', description: 'Awaiting trader payment before TTL expiry', timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString(), isCompleted: true, isCurrent: true },
      { stage: 'PAYMENT_CONFIRMED', title: 'Payment Pending', description: 'Complete mock payment to finalize', isCompleted: false, isCurrent: false },
      { stage: 'WAREHOUSE_RECEIVED', title: 'CFS Delivery', description: 'Pending warehouse arrival', isCompleted: false, isCurrent: false }
    ]
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1001',
    bookingId: 'bkg_9001',
    amountInr: 74625,
    status: 'SUCCESS',
    method: 'SIMULATED_GATEWAY',
    transactionRef: 'TXN_SIM_889210491',
    timestamp: '2026-09-18T10:22:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    entityType: 'LSP',
    entityId: 'lsp_1',
    action: 'INSPECTION_APPROVED',
    performedByRole: 'admin',
    performedByName: 'Vikramaditya Sharma',
    timestamp: '2026-08-15T11:00:00Z',
    details: 'Verified IEC, GSTIN, warehouse physical audit, and ICEGATE integration.'
  },
  {
    id: 'log_002',
    entityType: 'CAPACITY',
    entityId: 'cap_101',
    action: 'CAPACITY_PUBLISHED',
    performedByRole: 'lsp',
    performedByName: 'Apex Ocean Freight',
    timestamp: '2026-09-15T09:30:00Z',
    details: 'Published 40ft HC container MSCU-892104-5 on JNPT -> Hamburg with 28.5 CBM free.'
  },
  {
    id: 'log_003',
    entityType: 'BOOKING',
    entityId: 'bkg_9001',
    action: 'HOLD_CREATED',
    performedByRole: 'trader',
    performedByName: 'Surya Handicrafts',
    timestamp: '2026-09-18T10:15:00Z',
    details: 'Atomic hold reserved 12.5 CBM / 2800 kg for 15 mins (Idempotency key idemp_9001_8a72b).'
  },
  {
    id: 'log_004',
    entityType: 'PAYMENT',
    entityId: 'pay_1001',
    action: 'PAYMENT_SUCCESS',
    performedByRole: 'trader',
    performedByName: 'Surya Handicrafts',
    timestamp: '2026-09-18T10:22:00Z',
    details: 'Payment of ₹74,625 confirmed. Booking transition to CONFIRMED state.'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_301',
    bookingId: 'bkg_9001',
    traderName: 'Surya Handicrafts',
    lspName: 'Apex Ocean Freight',
    issueType: 'WEIGHT_MISMATCH',
    description: 'CFS weighbridge registered 2,840 kg vs trader declared 2,800 kg. Minor 40kg variance accepted within tolerance.',
    status: 'RESOLVED',
    resolutionNotes: 'Tolerance under 2% threshold. No extra penalty applied.',
    createdAt: '2026-09-19T15:00:00Z'
  }
];
