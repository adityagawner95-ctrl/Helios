/**
 * HELIOS // Global Application Context & Real-Time Telemetry Engine
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  NavigationTab, 
  TelemetryPoint, 
  EdgeNode, 
  SolarNode, 
  IRSensor, 
  AIIncident, 
  AuditLogEvent, 
  SystemMetricsSummary 
} from '../types/helios';

import { 
  generateInitialTelemetryHistory, 
  INITIAL_EDGE_NODES, 
  generateInitialSolarNodes, 
  INITIAL_IR_SENSORS, 
  INITIAL_INCIDENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SYSTEM_SUMMARY 
} from '../services/telemetrySimulator';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  time: string;
}

interface HeliosContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  
  telemetryHistory: TelemetryPoint[];
  edgeNodes: EdgeNode[];
  solarNodes: SolarNode[];
  irSensors: IRSensor[];
  incidents: AIIncident[];
  auditLogs: AuditLogEvent[];
  systemSummary: SystemMetricsSummary;

  isLivePaused: boolean;
  toggleLivePause: () => void;
  tickerSpeedMs: number;
  setTickerSpeedMs: (speed: number) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Actions
  acknowledgeIncident: (incidentId: string) => void;
  resolveIncident: (incidentId: string) => void;
  triggerNodeAction: (nodeId: string, actionName: 'REBOOT' | 'ISOLATE' | 'FIRMWARE_UPDATE') => void;
  triggerIRSensorPing: (sensorId: string) => void;
  addSystemLog: (event: string, device: string, severity: AuditLogEvent['severity'], details?: string) => void;
}

const HeliosContext = createContext<HeliosContextType | undefined>(undefined);

export const HeliosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => generateInitialTelemetryHistory(24));
  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>(INITIAL_EDGE_NODES);
  const [solarNodes, setSolarNodes] = useState<SolarNode[]>(generateInitialSolarNodes);
  const [irSensors, setIrSensors] = useState<IRSensor[]>(INITIAL_IR_SENSORS);
  const [incidents, setIncidents] = useState<AIIncident[]>(INITIAL_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(INITIAL_AUDIT_LOGS);
  const [systemSummary, setSystemSummary] = useState<SystemMetricsSummary>(INITIAL_SYSTEM_SUMMARY);

  const [isLivePaused, setIsLivePaused] = useState(false);
  const [tickerSpeedMs, setTickerSpeedMs] = useState(2500); 
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const socketRef = useRef<Socket | null>(null);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleLivePause = useCallback(() => {
    setIsLivePaused((prev) => !prev);
  }, []);

  const addSystemLog = useCallback((event: string, device: string, severity: AuditLogEvent['severity'], details?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AuditLogEvent = {
      id: `LOG-${Math.floor(10100 + Math.random() * 9000)}`,
      timestamp: timeStr,
      event,
      device,
      severity,
      source: 'Operator Console',
      status: 'CONFIRMED',
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const acknowledgeIncident = useCallback((incidentId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIncidents((prev) => prev.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'ACKNOWLEDGED',
          timelineEvents: [
            ...inc.timelineEvents,
            { timestamp: timeStr, event: 'Incident acknowledged by operator', actor: 'OPERATOR' }
          ]
        };
      }
      return inc;
    }));

    addToast('Incident Acknowledged', `Incident ${incidentId} state set to ACKNOWLEDGED.`, 'info');
    addSystemLog(`Incident ${incidentId} acknowledged`, incidentId, 'INFO');
  }, [addToast, addSystemLog]);

  const resolveIncident = useCallback((incidentId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setIncidents((prev) => prev.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'RESOLVED',
          timelineEvents: [
            ...inc.timelineEvents,
            { timestamp: timeStr, event: 'Incident marked as RESOLVED by operator', actor: 'OPERATOR' }
          ]
        };
      }
      return inc;
    }));

    setSystemSummary((prev) => ({
      ...prev,
      activeIncidentsCount: Math.max(0, prev.activeIncidentsCount - 1)
    }));

    addToast('Incident Resolved', `Incident ${incidentId} resolved successfully.`, 'success');
    addSystemLog(`Incident ${incidentId} marked resolved`, incidentId, 'INFO');
  }, [addToast, addSystemLog]);

  const triggerNodeAction = useCallback((nodeId: string, actionName: 'REBOOT' | 'ISOLATE' | 'FIRMWARE_UPDATE') => {
    setEdgeNodes((prev) => prev.map((node) => {
      if (node.id === nodeId) {
        if (actionName === 'REBOOT') {
          return { ...node, status: 'NORMAL', cpuTempC: 42.0, cpuUsagePercent: 22.1, activeAnomaliesCount: 0 };
        } else if (actionName === 'ISOLATE') {
          return { ...node, status: 'WARNING', activeAnomaliesCount: 1 };
        } else if (actionName === 'FIRMWARE_UPDATE') {
          return { ...node, firmwareVersion: 'v3.1.0-latest' };
        }
      }
      return node;
    }));

    addToast(`Node Action Executed`, `${actionName} command sent to ${nodeId}.`, 'success');
    addSystemLog(`Executed ${actionName} on ${nodeId}`, nodeId, 'INFO');
  }, [addToast, addSystemLog]);

  const triggerIRSensorPing = useCallback((sensorId: string) => {
    setIrSensors((prev) => prev.map((sens) => {
      if (sens.id === sensorId) {
        return {
          ...sens,
          lastTriggered: 'JUST NOW',
          triggerCount24h: sens.triggerCount24h + 1
        };
      }
      return sens;
    }));

    addToast('IR Sensor Ping', `Diagnostic pulse sent to ${sensorId}. Response: OK`, 'info');
  }, [addToast]);

  // Real-time backend connection
  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('telemetry_update', (data) => {
      if (isLivePaused) return;
      
      const now = new Date(data.timestamp || Date.now());
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setTelemetryHistory((prev) => {
        const nextPoint: TelemetryPoint = {
          timestamp: data.timestamp || now.toISOString(),
          timeLabel,
          totalPowerMW: data.totalPowerMw,
          solarGenerationMW: data.solarGenerationMw,
          gridFrequencyHz: 50.0 + (Math.random() - 0.5) * 0.04, // Simulated if missing
          voltageV: data.voltageV,
          currentA: data.currentA,
          irradianceWm2: 1000 + Math.random() * 50,
          ambientTempC: 22.0,
          avgCpuTempC: data.avgCpuTempC,
          avgRamUsagePercent: 64.0 + (Math.random() - 0.5) * 2.0,
          networkLatencyMs: data.networkLatencyMs,
          anomalyScorePercent: data.anomalyScorePercent
        };
        return [...prev.slice(-29), nextPoint];
      });

      setSystemSummary((prev) => ({
        ...prev,
        lastSyncTime: timeLabel,
        ingestionRateMBs: parseFloat((12.2 + (Math.random() - 0.5) * 1.4).toFixed(1)),
        avgNetworkLatencyMs: parseFloat((data.networkLatencyMs || 11.2).toFixed(1))
      }));
    });
    
    socketRef.current.on('incident_alert', (incidentData) => {
      if (isLivePaused) return;
      
      const newIncident: AIIncident = {
        id: incidentData.id,
        title: incidentData.title,
        status: incidentData.status,
        severity: incidentData.severity,
        targetDeviceId: incidentData.targetDeviceId || incidentData.targetDeviceName || 'HELIOS-NODE-01',
        targetDeviceName: incidentData.targetDeviceName,
        targetDeviceType: incidentData.targetDeviceType || 'EDGE_SERVER',
        anomalyScore: incidentData.anomalyScore,
        aiConfidence: incidentData.aiConfidence,
        detectedAt: incidentData.detectedAt ? new Date(incidentData.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        likelyCause: incidentData.likelyCause || 'Model estimates anomalous thermal state leading to throttling',
        signals: {
          cpuTempDeviation: incidentData.cpuTempDeviation ?? incidentData.signals?.cpuTempDeviation ?? 0,
          ramDeviation: incidentData.ramDeviation ?? incidentData.signals?.ramDeviation ?? 0,
          voltageDeviation: incidentData.voltageDeviation ?? incidentData.signals?.voltageDeviation ?? 0,
          latencyDeviation: incidentData.latencyDeviation ?? incidentData.signals?.latencyDeviation ?? 0,
        },
        recommendedAction: incidentData.recommendedAction || 'Isolate Device and Run Diagnostics',
        timelineEvents: [
          {
            timestamp: incidentData.detectedAt ? new Date(incidentData.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            event: 'Anomaly detected by Edge AI model',
            actor: 'AI_ENGINE'
          }
        ]
      };
      
      setIncidents(prev => [newIncident, ...prev]);
      
      setSystemSummary(prev => ({
        ...prev,
        activeIncidentsCount: prev.activeIncidentsCount + 1
      }));
      
      addToast('New Alert', incidentData.title, incidentData.severity === 'CRITICAL' ? 'alert' : 'warning');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isLivePaused, addToast]);

  return (
    <HeliosContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedDeviceId,
      setSelectedDeviceId,
      telemetryHistory,
      edgeNodes,
      solarNodes,
      irSensors,
      incidents,
      auditLogs,
      systemSummary,
      isLivePaused,
      toggleLivePause,
      tickerSpeedMs,
      setTickerSpeedMs,
      searchQuery,
      setSearchQuery,
      toasts,
      addToast,
      dismissToast,
      acknowledgeIncident,
      resolveIncident,
      triggerNodeAction,
      triggerIRSensorPing,
      addSystemLog
    }}>
      {children}
    </HeliosContext.Provider>
  );
};

export function useHelios(): HeliosContextType {
  const context = useContext(HeliosContext);
  if (!context) {
    throw new Error('useHelios must be used within a HeliosProvider');
  }
  return context;
}
