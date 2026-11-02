import React from 'react';
import { HeliosProvider, useHelios } from './context/HeliosContext';
import { Sidebar } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { FooterBar } from './components/shell/FooterBar';
import { ToastContainer } from './components/shell/ToastContainer';
import { CommandCenterView } from './components/views/CommandCenterView';
import { LiveTelemetryView } from './components/views/LiveTelemetryView';
import { SolarIntelligenceView } from './components/views/SolarIntelligenceView';
import { EdgeNetworkView } from './components/views/EdgeNetworkView';
import { SensorArrayView } from './components/views/SensorArrayView';
import { AIIntelligenceView } from './components/views/AIIntelligenceView';
import { AlertCenterView } from './components/views/AlertCenterView';
import { EventLogsView } from './components/views/EventLogsView';
import { ReportsView } from './components/views/ReportsView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { ApiMonitorView } from './components/views/ApiMonitorView';
import { SettingsView } from './components/views/SettingsView';
import { DeviceDetailModal } from './components/views/DeviceDetailModal';

const AppContent: React.FC = () => {
  const { activeTab } = useHelios();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <CommandCenterView />;
      case 'telemetry': return <LiveTelemetryView />;
      case 'solar': return <SolarIntelligenceView />;
      case 'edge-network': return <EdgeNetworkView />;
      case 'sensor-array': return <SensorArrayView />;
      case 'ai-intelligence': return <AIIntelligenceView />;
      case 'digital-twin': return <DigitalTwinView />;
      case 'alerts': return <AlertCenterView />;
      case 'event-logs': return <EventLogsView />;
      case 'reports': return <ReportsView />;
      case 'architecture': return <ArchitectureView />;
      case 'api-monitor': return <ApiMonitorView />;
      case 'settings': return <SettingsView />;
      default: return <CommandCenterView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-200 select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-black pb-12">
          {renderActiveView()}
        </main>
        <FooterBar />
      </div>
      <ToastContainer />
      <DeviceDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <HeliosProvider>
      <AppContent />
    </HeliosProvider>
  );
}
