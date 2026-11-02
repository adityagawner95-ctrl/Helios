import React from 'react';
import { useHelios } from '../../context/HeliosContext';

export const FooterBar: React.FC = () => {
  const { systemSummary, telemetryHistory } = useHelios();
  const latestTelemetry = telemetryHistory[telemetryHistory.length - 1];

  return (
    <footer className="h-6 bg-[#09090b] border-t border-zinc-900 px-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 z-20 select-none">
      <div className="flex items-center gap-4">
        <span>SYS.HEALTH: <span className="text-zinc-300">{systemSummary.infrastructureHealth}%</span></span>
        <span>EDGE.NET: <span className="text-zinc-300">{systemSummary.activeEdgeNodes}/{systemSummary.totalEdgeNodes}</span></span>
        <span>INGESTION: <span className="text-zinc-300">{systemSummary.ingestionRateMBs} MB/S</span></span>
        <span>PWR.GRID: <span className="text-zinc-300">{latestTelemetry?.totalPowerMW || systemSummary.totalPowerMW} MW</span></span>
      </div>
      <div className="flex items-center gap-4">
        <span>AI.ENGINE: <span className="text-zinc-300">NOMINAL</span></span>
        <span>LAST SYNC: <span className="text-zinc-300">{systemSummary.lastSyncTime}</span></span>
      </div>
    </footer>
  );
};
