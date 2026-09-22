import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Truck, 
  Ship, 
  Plane, 
  Eye, 
  RotateCcw, 
  RotateCw, 
  Layers, 
  Maximize2, 
  Box, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Sliders,
  Lock
} from 'lucide-react';
import { CargoDeclaration, Capacity } from '../../types';

export type MultimodalVehicleType = 
  | 'sprinter' 
  | 'box_truck' 
  | 'semi_trailer' 
  | 'ocean_20ft' 
  | 'ocean_40ft' 
  | 'aircraft_uld';

export type TransportCategory = 'road' | 'water' | 'air';

export interface PalletItem3D {
  id: string;
  slotNumber: number;
  label: string;
  cbm: number;
  weightKg: number;
  status: 'LOADED' | 'RESERVED' | 'READY';
  size: [number, number, number]; // width, height, length
  position: [number, number, number]; // x, y, z
  color: string;
  isUserTarget?: boolean;
}

interface Container3DVisualizerProps {
  vehicleType?: MultimodalVehicleType;
  containerId?: string;
  targetCargo?: CargoDeclaration;
  capacity?: Capacity;
  isBookingPreview?: boolean;
}

export const Container3DVisualizer: React.FC<Container3DVisualizerProps> = ({
  vehicleType: initialVehicle = 'box_truck',
  containerId: propContainerId = 'BXT-9042-MH',
  targetCargo,
  capacity,
  isBookingPreview = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Map published capacity containerType directly to published vehicle model
  const getPublishedVehicle = (): MultimodalVehicleType => {
    if (!capacity) return initialVehicle;
    const cType = capacity.containerType;
    if (cType === 'air_pallet') return 'aircraft_uld';
    if (cType === '20ft_std') return 'ocean_20ft';
    if (cType === '40ft_hc' || cType === '40ft_reefer' || cType === 'iso_tank') return 'ocean_40ft';
    if (cType === 'semi_trailer') return 'semi_trailer';
    if (cType === 'sprinter_van') return 'sprinter';
    if (cType === 'box_truck') return 'box_truck';
    return initialVehicle;
  };

  const isLockedToPublishedCapacity = Boolean(capacity || isBookingPreview);
  const currentContainerId = capacity ? capacity.containerId : propContainerId;

  const [vehicle, setVehicle] = useState<MultimodalVehicleType>(getPublishedVehicle());
  const [isXRayMode, setIsXRayMode] = useState(true);
  const [showCoG, setShowCoG] = useState(true);
  const [cameraViewAngle, setCameraViewAngle] = useState<'360' | 'front' | 'side' | 'top'>('side'); // Default side view like reference image!
  const [selectedSlot, setSelectedSlot] = useState<PalletItem3D | null>(null);

  // Update vehicle when capacity changes
  useEffect(() => {
    setVehicle(getPublishedVehicle());
  }, [capacity]);

  // Vehicle display labels
  const getVehicleDisplayLabel = (v: MultimodalVehicleType): { name: string; cat: string; icon: string } => {
    switch (v) {
      case 'sprinter': return { name: 'Sprinter Cargo Van', cat: 'ROAD LOGISTICS', icon: '🚛' };
      case 'box_truck': return { name: 'Logistics Box Truck', cat: 'ROAD LOGISTICS', icon: '🚛' };
      case 'semi_trailer': return { name: 'Heavy Semi-Trailer', cat: 'ROAD LOGISTICS', icon: '🚛' };
      case 'ocean_20ft': return { name: '20ft Feeder Vessel Container', cat: 'WATER OCEAN FREIGHT', icon: '🚢' };
      case 'ocean_40ft': return { name: '40ft High Cube Ocean Vessel', cat: 'WATER OCEAN FREIGHT', icon: '🚢' };
      case 'aircraft_uld': return { name: 'Cargo Aircraft ULD Hold', cat: 'AIR FREIGHT LOGISTICS', icon: '✈️' };
    }
  };

  // Generate Pallets for Cargo Bay
  const getPalletsForVehicle = (veh: MultimodalVehicleType): PalletItem3D[] => {
    const userCbm = targetCargo ? targetCargo.cbm : 8.5;
    const userWeight = targetCargo ? targetCargo.weightKg : 2400;

    if (veh === 'sprinter') {
      return [
        { id: 'p1', slotNumber: 1, label: 'Export Textiles Cartons', cbm: 2.2, weightKg: 450, status: 'LOADED', size: [1.1, 1.2, 1.2], position: [0, 0.6, -1.2], color: '#06b6d4' },
        { id: 'p2', slotNumber: 2, label: `★ YOUR RESERVED CARGO (${userCbm}m³)`, cbm: userCbm, weightKg: userWeight, status: 'RESERVED', size: [1.1, 1.3, 1.3], position: [0, 0.65, 0.2], color: '#eab308', isUserTarget: true },
        { id: 'p3', slotNumber: 3, label: 'Available Pallet Slot 3', cbm: 2.5, weightKg: 600, status: 'READY', size: [1.1, 1.2, 1.2], position: [0, 0.6, 1.5], color: '#22c55e' }
      ];
    } else if (veh === 'box_truck') {
      return [
        { id: 'p1', slotNumber: 1, label: 'Loaded General Consignment A', cbm: 3.5, weightKg: 950, status: 'LOADED', size: [1.3, 1.4, 1.5], position: [-0.8, 0.7, -1.8], color: '#06b6d4' },
        { id: 'p2', slotNumber: 2, label: 'Loaded Industrial Valves B', cbm: 3.2, weightKg: 1200, status: 'LOADED', size: [1.3, 1.4, 1.5], position: [0.8, 0.7, -1.8], color: '#06b6d4' },
        { id: 'p3', slotNumber: 3, label: `★ YOUR RESERVED SLOT (${userCbm}m³ / ${userWeight}kg)`, cbm: userCbm, weightKg: userWeight, status: 'RESERVED', size: [1.4, 1.5, 1.7], position: [-0.8, 0.75, 0.5], color: '#eab308', isUserTarget: true },
        { id: 'p4', slotNumber: 4, label: 'Ready Available Pallet Slot 4', cbm: 3.1, weightKg: 850, status: 'READY', size: [1.3, 1.4, 1.5], position: [0.8, 0.7, 0.5], color: '#22c55e' }
      ];
    } else if (veh === 'semi_trailer' || veh === 'ocean_40ft') {
      return [
        { id: 'p1', slotNumber: 1, label: 'Loaded Agro Products Consignment', cbm: 12.0, weightKg: 3500, status: 'LOADED', size: [1.8, 1.5, 3.0], position: [-1.0, 0.75, -3.2], color: '#06b6d4' },
        { id: 'p2', slotNumber: 2, label: 'Loaded Heavy Machinery Parts', cbm: 10.5, weightKg: 6200, status: 'LOADED', size: [1.8, 1.4, 2.8], position: [1.0, 0.7, -3.2], color: '#06b6d4' },
        { id: 'p3', slotNumber: 3, label: `★ YOUR RESERVED SLOT (${userCbm}m³ / ${userWeight}kg)`, cbm: userCbm, weightKg: userWeight, status: 'RESERVED', size: [1.9, 1.6, 3.2], position: [-1.0, 0.8, 0.8], color: '#eab308', isUserTarget: true },
        { id: 'p4', slotNumber: 4, label: 'Open Free Slot 4 (Ready for Booking)', cbm: 9.8, weightKg: 2800, status: 'READY', size: [1.8, 1.5, 3.0], position: [1.0, 0.75, 0.8], color: '#22c55e' }
      ];
    } else { // aircraft_uld or ocean_20ft
      return [
        { id: 'p1', slotNumber: 1, label: 'Air Freight Pharma Cool-Chain', cbm: 3.5, weightKg: 850, status: 'LOADED', size: [1.4, 1.3, 1.6], position: [-0.8, 0.65, -1.2], color: '#06b6d4' },
        { id: 'p2', slotNumber: 2, label: `★ YOUR RESERVED AIR SLOT (${userCbm}m³)`, cbm: userCbm, weightKg: userWeight, status: 'RESERVED', size: [1.5, 1.4, 1.8], position: [0.8, 0.7, 0.2], color: '#eab308', isUserTarget: true },
        { id: 'p3', slotNumber: 3, label: 'Available ULD Slot 3', cbm: 3.2, weightKg: 750, status: 'READY', size: [1.4, 1.3, 1.6], position: [-0.8, 0.65, 1.5], color: '#22c55e' }
      ];
    }
  };

  const pallets = getPalletsForVehicle(vehicle);
  const totalCbmAllocated = pallets.reduce((sum, p) => sum + p.cbm, 0);
  const maxVehicleCbm = vehicle === 'sprinter' ? 12 : vehicle === 'box_truck' ? 24 : vehicle === 'aircraft_uld' ? 18 : 68;
  const loadPercentage = Math.min(100, Math.round((totalCbmAllocated / maxVehicleCbm) * 100));

  // Three.js Render Scene
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050e09); // Dark green tactical canvas
    scene.fog = new THREE.FogExp2(0x050e09, 0.015);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);

    if (cameraViewAngle === 'side') { // Exact side view like reference picture!
      camera.position.set(16, 2.5, 0);
      camera.lookAt(0, 1.2, 0);
    } else if (cameraViewAngle === 'front') {
      camera.position.set(0, 3, 16);
      camera.lookAt(0, 1.2, 0);
    } else if (cameraViewAngle === 'top') {
      camera.position.set(0, 18, 0.01);
      camera.lookAt(0, 0, 0);
    } else { // 360 isometric
      camera.position.set(11, 8, 14);
      camera.lookAt(0, 1.2, 0);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x4ade80, 2.0);
    dirLight.position.set(15, 25, 15);
    scene.add(dirLight);

    const greenPoint = new THREE.PointLight(0xa3e635, 1.5, 40);
    greenPoint.position.set(-10, 10, -10);
    scene.add(greenPoint);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x15803d, 0x052e16);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Main Vehicle Assembly Group
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    // Dynamic Vehicle Bay Dimensions
    let bayWidth = 3.4;
    let bayHeight = 2.6;
    let bayLength = 6.5;

    if (vehicle === 'sprinter') {
      bayWidth = 2.2; bayHeight = 2.0; bayLength = 4.2;
    } else if (vehicle === 'box_truck') {
      bayWidth = 3.4; bayHeight = 2.6; bayLength = 6.5;
    } else if (vehicle === 'semi_trailer' || vehicle === 'ocean_40ft') {
      bayWidth = 4.2; bayHeight = 3.0; bayLength = 10.5;
    } else if (vehicle === 'ocean_20ft') {
      bayWidth = 4.2; bayHeight = 2.8; bayLength = 6.0;
    } else if (vehicle === 'aircraft_uld') {
      bayWidth = 3.2; bayHeight = 2.4; bayLength = 5.5;
    }

    // =========================================================================
    // ACCURATE BLUEPRINT VEHICLE WIREFRAME SILHOUETTE (MATCHING USER'S IMAGE!)
    // =========================================================================

    // A. Cargo Box Transparent X-Ray Cage
    const bayGeo = new THREE.BoxGeometry(bayWidth, bayHeight, bayLength);
    const bayMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: isXRayMode ? 0.08 : 0.35,
      depthWrite: false
    });
    const bayMesh = new THREE.Mesh(bayGeo, bayMat);
    bayMesh.position.y = bayHeight / 2;
    vehicleGroup.add(bayMesh);

    // Neon Green Wireframe Box Edges
    const bayWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(bayGeo),
      new THREE.LineBasicMaterial({
        color: 0x4ade80,
        linewidth: 2.0,
        transparent: true,
        opacity: 0.8
      })
    );
    bayWire.position.y = bayHeight / 2;
    vehicleGroup.add(bayWire);

    // B. ACCURATE VEHICLE CHASSIS, CABIN, WINDOWS & WHEEL BLUEPRINT LINES
    if (vehicle === 'box_truck' || vehicle === 'sprinter' || vehicle === 'semi_trailer') {
      
      // 1. Cab Front Blueprint Shape
      const cabFrontLength = 2.4;
      const cabZOffset = -(bayLength / 2 + cabFrontLength / 2 + 0.05);

      // Cabin Shell Outer Box with slope
      const cabGeo = new THREE.BoxGeometry(bayWidth * 0.95, bayHeight * 0.92, cabFrontLength);
      const cabMat = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.06
      });
      const cabMesh = new THREE.Mesh(cabGeo, cabMat);
      cabMesh.position.set(0, bayHeight * 0.46, cabZOffset);
      vehicleGroup.add(cabMesh);

      // Cabin Wireframe Contour (White/Neon Green Lines matching image!)
      const cabWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(cabGeo),
        new THREE.LineBasicMaterial({ color: 0x86efac, linewidth: 2.0, transparent: true, opacity: 0.9 })
      );
      cabWire.position.set(0, bayHeight * 0.46, cabZOffset);
      vehicleGroup.add(cabWire);

      // 2. Windshield Sloped Glass Outline
      const glassGeo = new THREE.PlaneGeometry(bayWidth * 0.85, bayHeight * 0.45);
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.rotation.x = -Math.PI / 5;
      glassMesh.position.set(0, bayHeight * 0.65, cabZOffset - cabFrontLength / 2 + 0.1);
      vehicleGroup.add(glassMesh);

      // 3. Side Windows & Door Outlines
      const windowFrameGeo = new THREE.BoxGeometry(bayWidth * 0.98, bayHeight * 0.35, cabFrontLength * 0.5);
      const windowFrameWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(windowFrameGeo),
        new THREE.LineBasicMaterial({ color: 0xa7f3d0, transparent: true, opacity: 0.7 })
      );
      windowFrameWire.position.set(0, bayHeight * 0.65, cabZOffset - 0.2);
      vehicleGroup.add(windowFrameWire);

      // 4. Steering Wheel Circle inside Cabin
      const steeringGeo = new THREE.RingGeometry(0.18, 0.22, 16);
      const steeringMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, side: THREE.DoubleSide });
      const steeringMesh = new THREE.Mesh(steeringGeo, steeringMat);
      steeringMesh.position.set(-bayWidth * 0.25, bayHeight * 0.55, cabZOffset - 0.3);
      vehicleGroup.add(steeringMesh);

      // 5. Front Bumper & Headlights
      const bumperGeo = new THREE.BoxGeometry(bayWidth, 0.3, 0.3);
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
      const bumperMesh = new THREE.Mesh(bumperGeo, bumperMat);
      bumperMesh.position.set(0, 0.2, cabZOffset - cabFrontLength / 2 - 0.15);
      vehicleGroup.add(bumperMesh);

      // Headlight glow circles
      [-bayWidth * 0.38, bayWidth * 0.38].forEach(hx => {
        const hlGeo = new THREE.CircleGeometry(0.15, 12);
        const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
        const hlMesh = new THREE.Mesh(hlGeo, hlMat);
        hlMesh.position.set(hx, 0.35, cabZOffset - cabFrontLength / 2 - 0.31);
        vehicleGroup.add(hlMesh);
      });

      // 6. Dual Chassis Steel Rail Frame under Cargo Floor
      [-bayWidth * 0.35, bayWidth * 0.35].forEach(rx => {
        const railGeo = new THREE.BoxGeometry(0.12, 0.25, bayLength + cabFrontLength);
        const railMat = new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.8 });
        const railMesh = new THREE.Mesh(railGeo, railMat);
        railMesh.position.set(rx, -0.12, -cabFrontLength / 4);
        vehicleGroup.add(railMesh);
      });

      // 7. Wheels with Hub Caps & Wheel Arches (Exact Wheel placement as screenshot!)
      const wheelRadius = 0.5;
      const wheelThickness = 0.35;
      const wheelPositions = [
        [-bayWidth / 2 - 0.05, 0, cabZOffset], // Front Left
        [bayWidth / 2 + 0.05, 0, cabZOffset],  // Front Right
        [-bayWidth / 2 - 0.05, 0, bayLength / 4], // Rear Left 1
        [bayWidth / 2 + 0.05, 0, bayLength / 4],  // Rear Right 1
        [-bayWidth / 2 - 0.05, 0, bayLength / 4 + 1.1], // Rear Left 2
        [bayWidth / 2 + 0.05, 0, bayLength / 4 + 1.1]   // Rear Right 2
      ];

      wheelPositions.forEach(([wx, wy, wz]) => {
        // Wheel Tire
        const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 24);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.4 });
        const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelMesh.position.set(wx, wy, wz);
        vehicleGroup.add(wheelMesh);

        // Tire Rim White Outline Circle (Blueprint style!)
        const rimGeo = new THREE.RingGeometry(0.15, wheelRadius * 0.7, 16);
        const rimMat = new THREE.MeshBasicMaterial({ color: 0x86efac, side: THREE.DoubleSide });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.rotation.y = Math.PI / 2;
        rimMesh.position.set(wx + (wx > 0 ? 0.18 : -0.18), wy, wz);
        vehicleGroup.add(rimMesh);

        // Wheel Arch Fender Contour Line
        const archGeo = new THREE.RingGeometry(wheelRadius + 0.05, wheelRadius + 0.12, 16, 1, 0, Math.PI);
        const archMat = new THREE.MeshBasicMaterial({ color: 0x4ade80, side: THREE.DoubleSide });
        const archMesh = new THREE.Mesh(archGeo, archMat);
        archMesh.rotation.y = Math.PI / 2;
        archMesh.position.set(wx + (wx > 0 ? 0.02 : -0.02), wy + 0.1, wz);
        vehicleGroup.add(archMesh);
      });

    } else if (vehicle === 'ocean_20ft' || vehicle === 'ocean_40ft') {
      // ==========================================
      // ACCURATE CARGO SHIP BLUEPRINT SILHOUETTE
      // ==========================================
      const hullLength = bayLength * 1.5;
      const hullWidth = bayWidth * 1.35;
      const hullHeight = 1.8;

      // 1. Ship Hull Main Shell
      const hullGeo = new THREE.BoxGeometry(hullWidth, hullHeight, hullLength);
      const hullMat = new THREE.MeshStandardMaterial({
        color: 0x047857,
        transparent: true,
        opacity: 0.08
      });
      const hullMesh = new THREE.Mesh(hullGeo, hullMat);
      hullMesh.position.set(0, -hullHeight / 2 + 0.2, 0);
      vehicleGroup.add(hullMesh);

      // Hull Wireframe Outline
      const hullWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(hullGeo),
        new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2.0, transparent: true, opacity: 0.85 })
      );
      hullWire.position.set(0, -hullHeight / 2 + 0.2, 0);
      vehicleGroup.add(hullWire);

      // 2. Raked Bow Profile Stem (Front of Ship)
      const bowZ = -(hullLength / 2);
      const bowGeo = new THREE.ConeGeometry(hullWidth * 0.65, 2.5, 4);
      const bowWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(bowGeo),
        new THREE.LineBasicMaterial({ color: 0x6ee7b7, linewidth: 2.0, transparent: true, opacity: 0.9 })
      );
      bowWire.rotation.x = Math.PI / 2;
      bowWire.position.set(0, 0.2, bowZ - 1.0);
      vehicleGroup.add(bowWire);

      // Bulbous Bow Sphere under waterline
      const bulbGeo = new THREE.SphereGeometry(0.6, 16, 12);
      const bulbWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(bulbGeo),
        new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.7 })
      );
      bulbWire.position.set(0, -0.9, bowZ - 1.8);
      vehicleGroup.add(bulbWire);

      // 3. Waterline Stripe Line along Side Hull
      [-hullWidth / 2 - 0.02, hullWidth / 2 + 0.02].forEach(hx => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(hx, -0.4, -hullLength / 2 - 1.5),
          new THREE.Vector3(hx, -0.4, hullLength / 2)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
        const lineMesh = new THREE.Line(lineGeo, lineMat);
        vehicleGroup.add(lineMesh);
      });

      // 4. Aft Superstructure Bridge House & Tower
      const bridgeZ = hullLength / 2 - 1.2;
      const bridgeWidth = hullWidth * 0.9;
      const bridgeHeight = 3.6;
      const bridgeLength = 2.2;

      const bridgeGeo = new THREE.BoxGeometry(bridgeWidth, bridgeHeight, bridgeLength);
      const bridgeWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(bridgeGeo),
        new THREE.LineBasicMaterial({ color: 0xa7f3d0, linewidth: 2.0, transparent: true, opacity: 0.9 })
      );
      bridgeWire.position.set(0, bridgeHeight / 2, bridgeZ);
      vehicleGroup.add(bridgeWire);

      // Navigation Bridge Windows Row
      const windowRowGeo = new THREE.BoxGeometry(bridgeWidth * 0.9, 0.35, bridgeLength * 0.98);
      const windowRowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
      const windowRowMesh = new THREE.Mesh(windowRowGeo, windowRowMat);
      windowRowMesh.position.set(0, bridgeHeight * 0.8, bridgeZ);
      vehicleGroup.add(windowRowMesh);

      // Exhaust Funnel Stack on Bridge Top
      const funnelGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.4, 12);
      const funnelWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(funnelGeo),
        new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 1.5 })
      );
      funnelWire.position.set(0, bridgeHeight + 0.7, bridgeZ + 0.4);
      vehicleGroup.add(funnelWire);

      // Radar Mast Antenna T-Bar
      const mastGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, bridgeHeight + 1.4, bridgeZ - 0.5),
        new THREE.Vector3(0, bridgeHeight + 2.5, bridgeZ - 0.5),
        new THREE.Vector3(-1.0, bridgeHeight + 2.3, bridgeZ - 0.5),
        new THREE.Vector3(1.0, bridgeHeight + 2.3, bridgeZ - 0.5)
      ]);
      const mastLine = new THREE.LineSegments(mastGeo, new THREE.LineBasicMaterial({ color: 0x4ade80, linewidth: 2 }));
      vehicleGroup.add(mastLine);

      // 5. Rudder & Propeller at Aft Keel
      const propGeo = new THREE.CircleGeometry(0.5, 8);
      const propMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
      const propMesh = new THREE.Mesh(propGeo, propMat);
      propMesh.position.set(0, -0.9, hullLength / 2 + 0.1);
      vehicleGroup.add(propMesh);

    } else if (vehicle === 'aircraft_uld') {
      // ==========================================
      // ACCURATE CARGO AIRCRAFT BLUEPRINT SILHOUETTE
      // ==========================================
      const fuseLength = bayLength * 1.6;
      const fuseRadius = bayWidth * 0.75;
      const noseZ = -(fuseLength / 2);

      // 1. Main Fuselage Cylinder Blueprint Body
      const fuseGeo = new THREE.CylinderGeometry(fuseRadius, fuseRadius, fuseLength, 20);
      const fuseMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.08
      });
      const fuseMesh = new THREE.Mesh(fuseGeo, fuseMat);
      fuseMesh.rotation.x = Math.PI / 2;
      fuseMesh.position.set(0, bayHeight / 2, 0);
      vehicleGroup.add(fuseMesh);

      // Fuselage Wireframe Contour Lines
      const fuseWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(fuseGeo),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2.0, transparent: true, opacity: 0.85 })
      );
      fuseWire.rotation.x = Math.PI / 2;
      fuseWire.position.set(0, bayHeight / 2, 0);
      vehicleGroup.add(fuseWire);

      // 2. Tapered Cockpit Nose Cone & Windshield Glass
      const noseGeo = new THREE.ConeGeometry(fuseRadius, 2.8, 16);
      const noseWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(noseGeo),
        new THREE.LineBasicMaterial({ color: 0x7dd3fc, linewidth: 2.0, transparent: true, opacity: 0.9 })
      );
      noseWire.rotation.x = -Math.PI / 2;
      noseWire.position.set(0, bayHeight / 2, noseZ - 1.4);
      vehicleGroup.add(noseWire);

      // Cockpit Window Ring
      const cockpitGeo = new THREE.RingGeometry(0.3, 0.7, 12, 1, 0, Math.PI);
      const cockpitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const cockpitMesh = new THREE.Mesh(cockpitGeo, cockpitMat);
      cockpitMesh.position.set(0, bayHeight / 2 + 0.4, noseZ - 1.2);
      vehicleGroup.add(cockpitMesh);

      // 3. Swept Wings & Turbofan Jet Engines (Port & Starboard)
      const wingSpan = bayWidth * 4.2;
      const wingChord = 2.4;

      // Left & Right Wings (Triangular Swept Wing Lines)
      [-1, 1].forEach(side => {
        const wingPts = [
          new THREE.Vector3(side * (fuseRadius * 0.8), bayHeight * 0.3, -1.0),
          new THREE.Vector3(side * (wingSpan / 2), bayHeight * 0.3, 1.5),
          new THREE.Vector3(side * (wingSpan / 2), bayHeight * 0.3, 2.5),
          new THREE.Vector3(side * (fuseRadius * 0.8), bayHeight * 0.3, 1.8),
          new THREE.Vector3(side * (fuseRadius * 0.8), bayHeight * 0.3, -1.0)
        ];
        const wingGeo = new THREE.BufferGeometry().setFromPoints(wingPts);
        const wingLine = new THREE.Line(wingGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2.0 }));
        vehicleGroup.add(wingLine);

        // Wingtip Winglet Vertical Fin
        const wingletGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(side * (wingSpan / 2), bayHeight * 0.3, 1.5),
          new THREE.Vector3(side * (wingSpan / 2), bayHeight * 0.3 + 1.2, 1.8),
          new THREE.Vector3(side * (wingSpan / 2), bayHeight * 0.3, 2.5)
        ]);
        const wingletLine = new THREE.Line(wingletGeo, new THREE.LineBasicMaterial({ color: 0x7dd3fc, linewidth: 2.0 }));
        vehicleGroup.add(wingletLine);

        // Under-Wing Turbofan Jet Engine Nacelle (Cylinder & Fan Intake Ring!)
        const engineRadius = 0.55;
        const engineLength = 1.8;
        const engineZ = 0.2;
        const engineX = side * (fuseRadius + 1.2);

        const engineGeo = new THREE.CylinderGeometry(engineRadius, engineRadius, engineLength, 16);
        const engineWire = new THREE.LineSegments(
          new THREE.WireframeGeometry(engineGeo),
          new THREE.LineBasicMaterial({ color: 0x0284c7, linewidth: 1.5 })
        );
        engineWire.rotation.x = Math.PI / 2;
        engineWire.position.set(engineX, bayHeight * 0.1, engineZ);
        vehicleGroup.add(engineWire);

        // Front Intake Ring Circle
        const intakeGeo = new THREE.RingGeometry(0.2, engineRadius, 16);
        const intakeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const intakeMesh = new THREE.Mesh(intakeGeo, intakeMat);
        intakeMesh.position.set(engineX, bayHeight * 0.1, engineZ - engineLength / 2);
        vehicleGroup.add(intakeMesh);
      });

      // 4. Empennage (Vertical Tail Fin & Horizontal Stabilizer Elevators)
      const tailZ = fuseLength / 2 + 0.5;

      // Vertical Tail Fin
      const tailFinPts = [
        new THREE.Vector3(0, bayHeight / 2 + fuseRadius, tailZ - 2.5),
        new THREE.Vector3(0, bayHeight / 2 + fuseRadius + 2.8, tailZ),
        new THREE.Vector3(0, bayHeight / 2 + fuseRadius + 2.8, tailZ + 1.0),
        new THREE.Vector3(0, bayHeight / 2 + fuseRadius, tailZ + 0.5),
        new THREE.Vector3(0, bayHeight / 2 + fuseRadius, tailZ - 2.5)
      ];
      const tailFinGeo = new THREE.BufferGeometry().setFromPoints(tailFinPts);
      const tailFinLine = new THREE.Line(tailFinGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2.5 }));
      vehicleGroup.add(tailFinLine);

      // Horizontal Tail Elevators
      [-1, 1].forEach(side => {
        const tailStabPts = [
          new THREE.Vector3(0, bayHeight / 2 + fuseRadius * 0.5, tailZ - 1.0),
          new THREE.Vector3(side * 2.2, bayHeight / 2 + fuseRadius * 0.5, tailZ + 0.2),
          new THREE.Vector3(side * 2.2, bayHeight / 2 + fuseRadius * 0.5, tailZ + 0.8),
          new THREE.Vector3(0, bayHeight / 2 + fuseRadius * 0.5, tailZ + 0.4)
        ];
        const tailStabGeo = new THREE.BufferGeometry().setFromPoints(tailStabPts);
        const tailStabLine = new THREE.Line(tailStabGeo, new THREE.LineBasicMaterial({ color: 0x7dd3fc, linewidth: 2.0 }));
        vehicleGroup.add(tailStabLine);
      });

      // 5. Main Cargo Door Outline on Side Fuselage
      const doorGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-fuseRadius - 0.02, bayHeight * 0.2, -1.8),
        new THREE.Vector3(-fuseRadius - 0.02, bayHeight * 0.8, -1.8),
        new THREE.Vector3(-fuseRadius - 0.02, bayHeight * 0.8, 0.8),
        new THREE.Vector3(-fuseRadius - 0.02, bayHeight * 0.2, 0.8),
        new THREE.Vector3(-fuseRadius - 0.02, bayHeight * 0.2, -1.8)
      ]);
      const doorLine = new THREE.Line(doorGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2.0 }));
      vehicleGroup.add(doorLine);
    }

    // Container Floor Plate
    const floorGeo = new THREE.PlaneGeometry(bayWidth, bayLength);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.9 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0.02;
    vehicleGroup.add(floorMesh);

    // =========================================================================
    // 3. PALLETS, SLOTS & NUMBER TAGS (1, 2, 3, 4 with Hazard Stripes)
    // =========================================================================
    const palletsGroup = new THREE.Group();
    vehicleGroup.add(palletsGroup);

    let userTargetMesh: THREE.Mesh | null = null;

    pallets.forEach((pallet) => {
      // Wooden Pallet Platform Base
      const palletBaseGeo = new THREE.BoxGeometry(pallet.size[0], 0.15, pallet.size[2]);
      const palletBaseMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.8 });
      const palletBaseMesh = new THREE.Mesh(palletBaseGeo, palletBaseMat);
      palletBaseMesh.position.set(pallet.position[0], 0.08, pallet.position[2]);
      palletsGroup.add(palletBaseMesh);

      // Main Cargo Box Mesh
      const boxGeo = new THREE.BoxGeometry(pallet.size[0] * 0.95, pallet.size[1], pallet.size[2] * 0.95);
      
      let boxMat: THREE.MeshStandardMaterial;

      if (pallet.isUserTarget) {
        // High visibility Glowing Yellow for user's reserved hold slot!
        boxMat = new THREE.MeshStandardMaterial({
          color: 0xeab308,
          emissive: 0xca8a04,
          emissiveIntensity: 0.9,
          transparent: true,
          opacity: 0.85,
          roughness: 0.1
        });
      } else if (pallet.status === 'LOADED') {
        boxMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.3,
          transparent: isXRayMode,
          opacity: isXRayMode ? 0.8 : 1.0
        });
      } else { // READY / AVAILABLE
        boxMat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          transparent: true,
          opacity: 0.45
        });
      }

      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.set(...pallet.position);
      boxMesh.castShadow = true;
      palletsGroup.add(boxMesh);

      if (pallet.isUserTarget) {
        userTargetMesh = boxMesh;
      }

      // Edges for Cargo Box
      const boxEdges = new THREE.LineSegments(
        new THREE.WireframeGeometry(boxGeo),
        new THREE.LineBasicMaterial({
          color: pallet.isUserTarget ? 0xffffff : pallet.status === 'READY' ? 0x4ade80 : 0x67e8f9,
          linewidth: pallet.isUserTarget ? 2.5 : 1,
          transparent: true,
          opacity: 0.9
        })
      );
      boxEdges.position.set(...pallet.position);
      palletsGroup.add(boxEdges);

      // Slot Tag Floating Marker Sphere & Number Pill above Pallet (Matching [1], [2], [3], [4])
      const tagGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const tagMat = new THREE.MeshBasicMaterial({
        color: pallet.isUserTarget ? 0xeab308 : pallet.status === 'READY' ? 0x22c55e : 0x06b6d4
      });
      const tagMesh = new THREE.Mesh(tagGeo, tagMat);
      tagMesh.position.set(pallet.position[0], pallet.position[1] + pallet.size[1] / 2 + 0.35, pallet.position[2]);
      palletsGroup.add(tagMesh);
    });

    // CoG Marker
    if (showCoG) {
      const cogGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const cogMat = new THREE.MeshStandardMaterial({
        color: 0x84cc16,
        emissive: 0x65a30d,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.9
      });
      const cogMesh = new THREE.Mesh(cogGeo, cogMat);
      cogMesh.position.set(0.0, 1.2, -0.2);
      vehicleGroup.add(cogMesh);
    }

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.03;

      if (cameraViewAngle === '360') {
        vehicleGroup.rotation.y += 0.003;
      } else {
        vehicleGroup.rotation.y = 0;
      }

      if (userTargetMesh) {
        const pulse = 0.7 + Math.sin(time * 4) * 0.3;
        (userTargetMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) currentMount.innerHTML = '';
    };
  }, [vehicle, isXRayMode, showCoG, cameraViewAngle, targetCargo]);

  const vehicleDisplay = getVehicleDisplayLabel(vehicle);

  return (
    <div className="space-y-4 w-full max-w-6xl mx-auto select-none font-mono">
      
      {/* Tactical Top Bar (Matching Screenshot HUD) */}
      <div className="bg-slate-950/90 border border-green-500/40 p-4 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Live Fit Status */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                ● LIVE CARGO FIT PREVIEW
              </span>
              <span className="px-2 py-0.5 rounded bg-green-950 text-green-300 border border-green-500/40 text-[10px] font-bold">
                TACTICAL X-RAY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Unit Registration: <span className="text-white font-bold">{currentContainerId}</span> • {vehicleDisplay.cat}
            </p>
          </div>
        </div>

        {/* Load Percentage Indicator */}
        <div className="flex items-center space-x-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-green-900 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px]">Utilized Space</span>
            <div className="text-green-400 font-extrabold text-sm">{loadPercentage}% LOADED</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-400 uppercase text-[10px]">Free Space</span>
            <div className="text-yellow-400 font-extrabold text-sm">{100 - loadPercentage}% AVAILABLE</div>
          </div>
        </div>
      </div>

      {/* Published Vehicle Badge */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-green-500/40 shadow-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="p-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/40 text-base">
            {vehicleDisplay.icon}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                PUBLISHED TRANSPORT VEHICLE:
              </span>
              <span className="text-white font-extrabold font-outfit text-sm">
                {vehicleDisplay.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Equipment Unit: <span className="text-cyan-400 font-bold">{currentContainerId}</span>
              {capacity && <span> • Published by <strong className="text-white">{capacity.lspName}</strong></span>}
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-green-950/80 text-green-300 border border-green-500/40 text-[10px] font-bold flex items-center space-x-1">
          <Lock className="w-3 h-3 text-green-400" />
          <span>LSP Published Vehicle Specs</span>
        </div>
      </div>

      {/* Main 3D Stage & Floating Stat Cards Overlay (Matching Reference Image) */}
      <div className="relative rounded-2xl border border-green-500/30 bg-slate-950 overflow-hidden min-h-[460px] flex items-center justify-center shadow-2xl">
        
        {/* Floating Capacity Overlay Box (Top Right, matching reference image) */}
        <div className="absolute top-4 right-4 z-20 w-64 bg-slate-950/90 border border-green-500/50 p-4 rounded-xl backdrop-blur-md shadow-2xl space-y-2">
          <div className="text-[10px] uppercase font-bold text-green-400 tracking-wider">
            {vehicle.replace('_', ' ').toUpperCase()} CAPACITY
          </div>
          
          <div className="text-3xl font-extrabold text-white font-outfit">
            {pallets.length}{' '}
            <span className="text-xs font-mono font-normal text-slate-400">
              PALLETS • {totalCbmAllocated.toFixed(1)} M³
            </span>
          </div>

          <div className="text-xs text-slate-300 font-bold">
            Total Mass: {pallets.reduce((s, p) => s + p.weightKg, 0).toLocaleString()} KG
          </div>

          {/* Space Usage Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-yellow-500 to-green-500 transition-all duration-300"
              style={{ width: `${loadPercentage}%` }}
            />
          </div>

          {/* Color Dot Legend */}
          <div className="grid grid-cols-3 gap-1 text-[10px] font-bold pt-2 border-t border-slate-800/80">
            <span className="text-cyan-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>LOADED</span>
            </span>
            <span className="text-yellow-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>RESERVED</span>
            </span>
            <span className="text-green-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>READY</span>
            </span>
          </div>
        </div>

        {/* Floating Pallet / Slot Detail Cards (Top Left) */}
        <div className="absolute top-4 left-4 z-20 space-y-1.5 max-w-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
            Stowed Slot Manifest ({pallets.length} Units)
          </div>

          {pallets.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedSlot(p)}
              className={`p-2 rounded-lg border text-[11px] transition cursor-pointer flex items-center justify-between backdrop-blur-md ${
                p.isUserTarget
                  ? 'bg-yellow-950/80 border-yellow-500 text-yellow-200 shadow-lg shadow-yellow-500/20'
                  : selectedSlot?.id === p.id
                  ? 'bg-green-950/80 border-green-500 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                  {p.slotNumber}
                </span>
                <span className="truncate font-semibold max-w-[130px]">{p.label}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 shrink-0">{p.cbm}m³</span>
            </div>
          ))}
        </div>

        {/* Three.js Canvas Container Mount */}
        <div ref={mountRef} className="w-full h-[460px] rounded-xl overflow-hidden" />

        {/* Bottom Tactical Controls Toolbar (Matching Reference Image) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 border border-green-500/40 p-2.5 rounded-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* X-Ray Mode & CoG Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsXRayMode(!isXRayMode)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer border ${
                isXRayMode
                  ? 'bg-green-500/20 text-green-300 border-green-500/50 glow-cyan'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Eye className="w-4 h-4 text-green-400" />
              <span>X-Ray Vision: {isXRayMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setShowCoG(!showCoG)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer border ${
                showCoG
                  ? 'bg-lime-500/20 text-lime-300 border-lime-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>CoG Balance Marker</span>
            </button>
          </div>

          {/* Camera View Angle Buttons */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 px-2 font-bold uppercase">Angle:</span>
            <button
              onClick={() => setCameraViewAngle('side')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                cameraViewAngle === 'side' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side View
            </button>
            <button
              onClick={() => setCameraViewAngle('front')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                cameraViewAngle === 'front' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setCameraViewAngle('360')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                cameraViewAngle === '360' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              360° Rotate
            </button>
            <button
              onClick={() => setCameraViewAngle('top')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                cameraViewAngle === 'top' ? 'bg-green-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top View
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
