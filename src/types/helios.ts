/**
 * HELIOS // EDGE COMMAND - Core Domain Types
 */

export type NavigationTab = 
  | 'overview'
  | 'telemetry'
  | 'solar'
  | 'edge-network'
  | 'sensor-array'
  | 'ai-intelligence'
  | 'alerts'
  | 'event-logs'
  | 'reports'
  | 'digital-twin'
  | 'architecture'
  | 'api-monitor'
  | 'settings';

export type SystemStatus = 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'RECOVERING';

export type NodeHealth = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface TelemetryPoint {
  timestamp: string; // ISO or HH:mm:ss
  timeLabel: string;
  totalPowerMW: number;
  solarGenerationMW: number;
  gridFrequencyHz: number;
  voltageV: number;
  currentA: number;
  irradianceWm2: number;
  ambientTempC: number;
  avgCpuTempC: number;
  avgRamUsagePercent: number;
  networkLatencyMs: number;
  anomalyScorePercent: number;
}

export interface EdgeNode {
  id: string; // e.g. "NODE-E2048"
  name: string;
  region: string;
  locationLabel: string;
  ipAddress: string;
  type: 'RASPBERRY_PI_4' | 'JETSON_ORIN' | 'EDGE_SERVER' | 'SOLAR_INVERTER' | 'IR_GATEWAY';
  status: NodeHealth;
  cpuTempC: number;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  ramUsedGB: number;
  ramTotalGB: number;
  voltageV: number;
  currentA: number;
  latencyMs: number;
  uptime: string;
  firmwareVersion: string;
  lastHeartbeat: string;
  activeAnomaliesCount: number;
  coordinates: { x: number; y: number; z?: number };
}

export interface SolarNode {
  id: string; // e.g. "SOLAR-S2048"
  arrayName: string;
  stringId: string;
  status: NodeHealth;
  powerKW: number;
  efficiencyPercent: number;
  irradianceWm2: number;
  panelTempC: number;
  voltageDC: number;
  currentDC: number;
  todayYieldkWh: number;
  peakOutputKW: number;
  inverterStatus: 'OPTIMAL' | 'THROTTLED' | 'FAULT';
  coordinates: { row: number; col: number; fieldZone: string };
}

export interface IRSensor {
  id: string; // e.g. "IR-SENS-104"
  zone: 'ZONE_ALPHA' | 'ZONE_BETA' | 'ZONE_GAMMA' | 'ZONE_DELTA';
  locationName: string;
  status: 'NORMAL' | 'TRIGGERED' | 'OFFLINE' | 'ANOMALY';
  irradianceBand: string;
  lastTriggered: string;
  triggerCount24h: number;
  ambientLux: number;
  thermalDeltaC: number;
  batteryPercent: number;
}

export interface AIIncident {
  id: string; // e.g. "INC-8942"
  title: string;
  targetDeviceId: string;
  targetDeviceName: string;
  targetDeviceType: string;
  severity: AlertSeverity;
  anomalyScore: number; // 0 - 100
  aiConfidence: number; // 0 - 100
  detectedAt: string;
  likelyCause: string;
  status: AlertStatus;
  signals: {
    cpuTempDeviation: number; // e.g. +18%
    ramDeviation: number;
    voltageDeviation: number;
    latencyDeviation: number;
  };
  timelineEvents: {
    timestamp: string;
    event: string;
    actor: 'AI_ENGINE' | 'EDGE_AGENT' | 'OPERATOR' | 'SYSTEM';
  }[];
  recommendedAction?: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  event: string;
  device: string;
  severity: AlertSeverity | 'INFO';
  source: string;
  status: 'CONFIRMED' | 'LOGGED' | 'RESOLVED' | 'SKIPPED';
  details?: string;
}

export interface SystemMetricsSummary {
  totalPowerMW: number;
  totalPowerChangePercent: number;
  activeEdgeNodes: number;
  totalEdgeNodes: number;
  infrastructureHealth: number;
  activeIncidentsCount: number;
  dailyYieldMWh: number;
  co2SavedTons: number;
  avgNetworkLatencyMs: number;
  systemStatus: SystemStatus;
  ingestionRateMBs: number;
  lastSyncTime: string;
}
