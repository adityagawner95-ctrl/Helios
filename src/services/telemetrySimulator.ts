/**
 * HELIOS // Real-Time Telemetry Generator & Simulation Engine
 */

import { 
  TelemetryPoint, 
  EdgeNode, 
  SolarNode, 
  IRSensor, 
  AIIncident, 
  AuditLogEvent, 
  SystemMetricsSummary 
} from '../types/helios';

// Generate 24 hours of historical telemetry points for time-series charts
export function generateInitialTelemetryHistory(count = 24): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hour = time.getHours();

    // Solar generation follows sunlight curve (0 at night, peak around 13:00)
    let solarFactor = 0;
    if (hour >= 6 && hour <= 19) {
      const x = (hour - 6) / 13; // 0 to 1
      solarFactor = Math.sin(x * Math.PI);
    }

    const basePower = 0.4 + solarFactor * 1.1 + (Math.random() - 0.5) * 0.05;
    const irradiance = Math.round(solarFactor * 980 + (Math.random() - 0.5) * 30);
    const ambientTemp = Math.round(18 + solarFactor * 12 + (Math.random() - 0.5) * 2);

    const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    points.push({
      timestamp: time.toISOString(),
      timeLabel,
      totalPowerMW: parseFloat(basePower.toFixed(3)),
      solarGenerationMW: parseFloat((solarFactor * 1.05).toFixed(3)),
      gridFrequencyHz: parseFloat((50.0 + (Math.random() - 0.5) * 0.08).toFixed(2)),
      voltageV: parseFloat((230 + (Math.random() - 0.5) * 2.4).toFixed(1)),
      currentA: parseFloat((6.1 + solarFactor * 4.2).toFixed(2)),
      irradianceWm2: Math.max(0, irradiance),
      ambientTempC: Math.max(12, ambientTemp),
      avgCpuTempC: parseFloat((41 + solarFactor * 6 + (Math.random() - 0.5) * 3).toFixed(1)),
      avgRamUsagePercent: parseFloat((62 + (Math.random() - 0.5) * 8).toFixed(1)),
      networkLatencyMs: parseFloat((11.5 + (Math.random() - 0.5) * 2.5).toFixed(1)),
      anomalyScorePercent: parseFloat((Math.random() < 0.15 ? 65 + Math.random() * 25 : 8 + Math.random() * 12).toFixed(1)),
    });
  }

  return points;
}

// Initial Mock Edge Nodes (Raspberry Pis, Jetson Orin, Edge Gateways)
export const INITIAL_EDGE_NODES: EdgeNode[] = [
  {
    id: 'NODE-E2048',
    name: 'Helios Gateway Alpha',
    region: 'US-WEST-SOLAR-A',
    locationLabel: 'Substation 4 - Rack 2',
    ipAddress: '10.240.12.101',
    type: 'RASPBERRY_PI_4',
    status: 'CRITICAL',
    cpuTempC: 78.4,
    cpuUsagePercent: 92.1,
    ramUsagePercent: 88.5,
    ramUsedGB: 7.08,
    ramTotalGB: 8,
    voltageV: 221.8,
    currentA: 8.9,
    latencyMs: 44.2,
    uptime: '17d 04h',
    firmwareVersion: 'v2.8.4-edge',
    lastHeartbeat: '2s ago',
    activeAnomaliesCount: 2,
    coordinates: { x: 120, y: 180, z: 12 }
  },
  {
    id: 'NODE-E2049',
    name: 'Helios Jetson AI Node-01',
    region: 'US-WEST-SOLAR-A',
    locationLabel: 'Inverter Bay 01',
    ipAddress: '10.240.12.102',
    type: 'JETSON_ORIN',
    status: 'NORMAL',
    cpuTempC: 44.1,
    cpuUsagePercent: 38.6,
    ramUsagePercent: 42.0,
    ramUsedGB: 13.44,
    ramTotalGB: 32,
    voltageV: 230.2,
    currentA: 5.4,
    latencyMs: 8.4,
    uptime: '42d 11h',
    firmwareVersion: 'v2.8.4-edge',
    lastHeartbeat: '1s ago',
    activeAnomaliesCount: 0,
    coordinates: { x: 280, y: 140, z: 20 }
  },
  {
    id: 'NODE-E2050',
    name: 'IR Sensor Gateway South',
    region: 'US-WEST-SOLAR-B',
    locationLabel: 'Field Perimeter South',
    ipAddress: '10.240.13.44',
    type: 'IR_GATEWAY',
    status: 'WARNING',
    cpuTempC: 62.8,
    cpuUsagePercent: 74.2,
    ramUsagePercent: 68.1,
    ramUsedGB: 2.72,
    ramTotalGB: 4,
    voltageV: 226.4,
    currentA: 6.2,
    latencyMs: 24.1,
    uptime: '08d 19h',
    firmwareVersion: 'v2.8.3-edge',
    lastHeartbeat: '3s ago',
    activeAnomaliesCount: 1,
    coordinates: { x: 420, y: 260, z: 5 }
  },
  {
    id: 'NODE-E2051',
    name: 'Solar Array String Master A3',
    region: 'US-WEST-SOLAR-A',
    locationLabel: 'PV Field Sector 3',
    ipAddress: '10.240.12.201',
    type: 'SOLAR_INVERTER',
    status: 'NORMAL',
    cpuTempC: 39.5,
    cpuUsagePercent: 24.0,
    ramUsagePercent: 31.2,
    ramUsedGB: 1.25,
    ramTotalGB: 4,
    voltageV: 231.0,
    currentA: 12.4,
    latencyMs: 11.2,
    uptime: '89d 02h',
    firmwareVersion: 'v2.8.4-edge',
    lastHeartbeat: '1s ago',
    activeAnomaliesCount: 0,
    coordinates: { x: 560, y: 120, z: 15 }
  },
  {
    id: 'NODE-E2052',
    name: 'Helios Edge Server Alpha-02',
    region: 'US-CENTRAL-GRID',
    locationLabel: 'Main Control Hub',
    ipAddress: '10.240.10.12',
    type: 'EDGE_SERVER',
    status: 'NORMAL',
    cpuTempC: 41.2,
    cpuUsagePercent: 31.0,
    ramUsagePercent: 54.0,
    ramUsedGB: 34.56,
    ramTotalGB: 64,
    voltageV: 229.8,
    currentA: 18.2,
    latencyMs: 6.8,
    uptime: '112d 16h',
    firmwareVersion: 'v3.0.1-enterprise',
    lastHeartbeat: '1s ago',
    activeAnomaliesCount: 0,
    coordinates: { x: 700, y: 220, z: 30 }
  },
  {
    id: 'NODE-E2053',
    name: 'Substation B Pi Telemetry Node',
    region: 'US-WEST-SOLAR-B',
    locationLabel: 'Substation B',
    ipAddress: '10.240.13.109',
    type: 'RASPBERRY_PI_4',
    status: 'OFFLINE',
    cpuTempC: 0.0,
    cpuUsagePercent: 0.0,
    ramUsagePercent: 0.0,
    ramUsedGB: 0,
    ramTotalGB: 8,
    voltageV: 0.0,
    currentA: 0.0,
    latencyMs: 999.0,
    uptime: '0d 0h',
    firmwareVersion: 'v2.8.2-edge',
    lastHeartbeat: '14m ago',
    activeAnomaliesCount: 1,
    coordinates: { x: 320, y: 380, z: 2 }
  }
];

// Initial Mock Solar Nodes Matrix
export function generateInitialSolarNodes(): SolarNode[] {
  const nodes: SolarNode[] = [];
  const fieldZones = ['FIELD_A', 'FIELD_B', 'FIELD_C', 'FIELD_D'];

  let count = 0;
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 6; c++) {
      count++;
      const id = `SOLAR-S${2000 + count}`;
      const zone = fieldZones[(r - 1) % fieldZones.length];
      
      let status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' = 'NORMAL';
      let powerKW = 84 + (Math.random() - 0.5) * 12;
      let efficiencyPercent = 98.2 - (Math.random() * 2);
      let inverterStatus: 'OPTIMAL' | 'THROTTLED' | 'FAULT' = 'OPTIMAL';

      if (id === 'SOLAR-S2004') {
        status = 'CRITICAL';
        powerKW = 42.1; // dropped ~50%
        efficiencyPercent = 61.4;
        inverterStatus = 'FAULT';
      } else if (id === 'SOLAR-S2012' || id === 'SOLAR-S2019') {
        status = 'WARNING';
        powerKW = 68.5;
        efficiencyPercent = 82.1;
        inverterStatus = 'THROTTLED';
      }

      nodes.push({
        id,
        arrayName: `Solar Array Sector ${r}`,
        stringId: `STR-${r}0${c}`,
        status,
        powerKW: parseFloat(powerKW.toFixed(1)),
        efficiencyPercent: parseFloat(efficiencyPercent.toFixed(1)),
        irradianceWm2: Math.round(920 + (Math.random() - 0.5) * 40),
        panelTempC: parseFloat((34 + (Math.random() - 0.5) * 4).toFixed(1)),
        voltageDC: parseFloat((780 + (Math.random() - 0.5) * 15).toFixed(1)),
        currentDC: parseFloat((108 + (Math.random() - 0.5) * 8).toFixed(1)),
        todayYieldkWh: Math.round(420 + Math.random() * 80),
        peakOutputKW: 98.5,
        inverterStatus,
        coordinates: { row: r, col: c, fieldZone: zone }
      });
    }
  }

  return nodes;
}

// Initial Mock IR Sensors
export const INITIAL_IR_SENSORS: IRSensor[] = [
  {
    id: 'IR-SENS-101',
    zone: 'ZONE_ALPHA',
    locationName: 'North Perimeter Array 1',
    status: 'NORMAL',
    irradianceBand: '850nm / Far-IR',
    lastTriggered: '42m ago',
    triggerCount24h: 3,
    ambientLux: 4200,
    thermalDeltaC: +0.4,
    batteryPercent: 96
  },
  {
    id: 'IR-SENS-102',
    zone: 'ZONE_ALPHA',
    locationName: 'North Substation Door',
    status: 'TRIGGERED',
    irradianceBand: '940nm / Mid-IR',
    lastTriggered: '12s ago',
    triggerCount24h: 18,
    ambientLux: 3800,
    thermalDeltaC: +4.8,
    batteryPercent: 88
  },
  {
    id: 'IR-SENS-103',
    zone: 'ZONE_BETA',
    locationName: 'Inverter Vault Entrance',
    status: 'NORMAL',
    irradianceBand: '850nm / Far-IR',
    lastTriggered: '2h ago',
    triggerCount24h: 8,
    ambientLux: 1200,
    thermalDeltaC: +0.1,
    batteryPercent: 100
  },
  {
    id: 'IR-SENS-104',
    zone: 'ZONE_GAMMA',
    locationName: 'Transformer Perimeter South',
    status: 'ANOMALY',
    irradianceBand: 'Thermal IR 10.6um',
    lastTriggered: '1m ago',
    triggerCount24h: 44,
    ambientLux: 5100,
    thermalDeltaC: +18.2, // High thermal delta
    batteryPercent: 74
  },
  {
    id: 'IR-SENS-105',
    zone: 'ZONE_DELTA',
    locationName: 'Main Battery Enclosure',
    status: 'NORMAL',
    irradianceBand: '940nm / Mid-IR',
    lastTriggered: '5m ago',
    triggerCount24h: 12,
    ambientLux: 950,
    thermalDeltaC: +0.6,
    batteryPercent: 91
  },
  {
    id: 'IR-SENS-106',
    zone: 'ZONE_DELTA',
    locationName: 'Substation B Fence',
    status: 'OFFLINE',
    irradianceBand: '850nm / Far-IR',
    lastTriggered: '14h ago',
    triggerCount24h: 0,
    ambientLux: 0,
    thermalDeltaC: 0.0,
    batteryPercent: 4
  }
];

// Initial AI Incidents List
export const INITIAL_INCIDENTS: AIIncident[] = [
  {
    id: 'INC-8942',
    title: 'Thermal Instability & High Anomaly Score on Gateway E-2048',
    targetDeviceId: 'NODE-E2048',
    targetDeviceName: 'Helios Gateway Alpha',
    targetDeviceType: 'Raspberry Pi 4 Edge Node',
    severity: 'CRITICAL',
    anomalyScore: 87.4,
    aiConfidence: 94.2,
    detectedAt: '14:32:08',
    likelyCause: 'Thermal throttling combined with anomalous CPU spike and power fluctuation.',
    status: 'INVESTIGATING',
    signals: {
      cpuTempDeviation: +28.4,
      ramDeviation: +22.1,
      voltageDeviation: -3.8,
      latencyDeviation: +32.8
    },
    timelineEvents: [
      { timestamp: '14:31:02', event: 'Voltage deviation (-3.8V) detected on Node E-2048', actor: 'EDGE_AGENT' },
      { timestamp: '14:31:05', event: 'AI isolation forest score exceeded 85% threshold', actor: 'AI_ENGINE' },
      { timestamp: '14:31:07', event: 'Automatic soft-isolation rules applied to network interface', actor: 'SYSTEM' },
      { timestamp: '14:31:08', event: 'Operator notification dispatched to Tier-1 On-Call', actor: 'SYSTEM' }
    ]
  },
  {
    id: 'INC-8941',
    title: 'Solar String S-2004 Sudden Output Drop (-38%)',
    targetDeviceId: 'SOLAR-S2004',
    targetDeviceName: 'Solar Array Sector 1 String 4',
    targetDeviceType: 'Photovoltaic Array',
    severity: 'HIGH',
    anomalyScore: 78.1,
    aiConfidence: 91.5,
    detectedAt: '14:28:15',
    likelyCause: 'Partial array shading or localized DC string inverter bypass diode fault.',
    status: 'ACTIVE',
    signals: {
      cpuTempDeviation: +4.2,
      ramDeviation: +0.0,
      voltageDeviation: -12.4,
      latencyDeviation: +1.2
    },
    timelineEvents: [
      { timestamp: '14:28:10', event: 'Current drop detected across String DC Bus-04', actor: 'EDGE_AGENT' },
      { timestamp: '14:28:15', event: 'Irradiance-to-Power ratio anomaly flagged by Isolation Forest', actor: 'AI_ENGINE' }
    ]
  },
  {
    id: 'INC-8939',
    title: 'Thermal IR Delta Spreading at Zone Gamma',
    targetDeviceId: 'IR-SENS-104',
    targetDeviceName: 'Transformer Perimeter South',
    targetDeviceType: 'Thermal IR Sensor',
    severity: 'MEDIUM',
    anomalyScore: 64.2,
    aiConfidence: 88.0,
    detectedAt: '14:15:22',
    likelyCause: 'Ambient heat leakage near transformer casing or solar reflection artifact.',
    status: 'ACKNOWLEDGED',
    signals: {
      cpuTempDeviation: +18.2,
      ramDeviation: +0.0,
      voltageDeviation: +0.0,
      latencyDeviation: +0.0
    },
    timelineEvents: [
      { timestamp: '14:15:22', event: 'IR Thermal delta exceeded +15C delta threshold', actor: 'EDGE_AGENT' },
      { timestamp: '14:18:00', event: 'Acknowledged by Senior Operator J. Miller', actor: 'OPERATOR' }
    ]
  }
];

// Initial Audit Event Logs
export const INITIAL_AUDIT_LOGS: AuditLogEvent[] = [
  {
    id: 'LOG-10092',
    timestamp: '14:32:08',
    event: 'Anomaly detected on E-2048 (Score: 87.4%)',
    device: 'NODE-E2048',
    severity: 'HIGH',
    source: 'AI Engine',
    status: 'CONFIRMED',
    details: 'Isolation Forest flagged sudden thermal and RAM deviation.'
  },
  {
    id: 'LOG-10091',
    timestamp: '14:31:07',
    event: 'Soft-isolation rule applied to Interface eth0',
    device: 'NODE-E2048',
    severity: 'MEDIUM',
    source: 'Helios Guard Agent',
    status: 'LOGGED',
    details: 'Throttled non-essential outbound telemetry packets.'
  },
  {
    id: 'LOG-10090',
    timestamp: '14:28:15',
    event: 'Power drop warning triggered on SOLAR-S2004',
    device: 'SOLAR-S2004',
    severity: 'HIGH',
    source: 'Inverter Monitor',
    status: 'CONFIRMED',
    details: 'String output dropped from 84kW to 42.1kW.'
  },
  {
    id: 'LOG-10089',
    timestamp: '14:20:00',
    event: 'Routine heartbeat sync completed for 4,208 edge nodes',
    device: 'SYSTEM_ALL',
    severity: 'INFO',
    source: 'Core Sync Daemon',
    status: 'LOGGED',
    details: 'Latency average 11.4ms across all active gateways.'
  },
  {
    id: 'LOG-10088',
    timestamp: '14:15:22',
    event: 'IR Sensor thermal trigger event recorded',
    device: 'IR-SENS-104',
    severity: 'MEDIUM',
    source: 'Perimeter Guard',
    status: 'LOGGED',
    details: 'Zone Gamma IR Delta +18.2C.'
  },
  {
    id: 'LOG-10087',
    timestamp: '14:02:11',
    event: 'Firmware v2.8.4 deploy confirmed on 124 nodes',
    device: 'CLUSTER_WEST',
    severity: 'INFO',
    source: 'OTA Deployment Daemon',
    status: 'RESOLVED',
    details: '0 rollbacks required. SHA256 verified.'
  }
];

// Initial System Metrics Summary
export const INITIAL_SYSTEM_SUMMARY: SystemMetricsSummary = {
  totalPowerMW: 1.42,
  totalPowerChangePercent: 12.4,
  activeEdgeNodes: 4208,
  totalEdgeNodes: 4210,
  infrastructureHealth: 98.7,
  activeIncidentsCount: 3,
  dailyYieldMWh: 18.6,
  co2SavedTons: 14.2,
  avgNetworkLatencyMs: 11.4,
  systemStatus: 'NOMINAL',
  ingestionRateMBs: 12.8,
  lastSyncTime: 'JUST NOW'
};
