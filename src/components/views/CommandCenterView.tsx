import React from 'react';
import { useHelios } from '../../context/HeliosContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export const CommandCenterView: React.FC = () => {
  const { systemSummary, telemetryHistory, incidents } = useHelios();
  const latestPoint = telemetryHistory[telemetryHistory.length - 1];
  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'INVESTIGATING');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-100">Command Center</h1>
          <p className="text-sm text-zinc-500 mt-1">Infrastructure topology and anomaly detection.</p>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></span>
          LIVE DATA STREAM
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-md flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Total Power Output</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light tracking-tighter text-zinc-100 tabular-nums">
              {latestPoint?.totalPowerMW || systemSummary.totalPowerMW}
            </span>
            <span className="text-xs text-zinc-500">MW</span>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-xs">
            <span className="text-zinc-600">Change</span>
            <span className="text-zinc-300 tabular-nums">+{systemSummary.totalPowerChangePercent}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-md flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Active Edge Nodes</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light tracking-tighter text-zinc-100 tabular-nums">
              {systemSummary.activeEdgeNodes.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-xs">
            <span className="text-zinc-600">Total Provisioned</span>
            <span className="text-zinc-300 tabular-nums">{systemSummary.totalEdgeNodes.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-md flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">System Health</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light tracking-tighter text-zinc-100 tabular-nums">
              {systemSummary.infrastructureHealth}
            </span>
            <span className="text-xs text-zinc-500">%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-xs">
            <span className="text-zinc-600">Status</span>
            <span className="text-zinc-300">NOMINAL</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-md flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Active Anomalies</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light tracking-tighter text-zinc-100 tabular-nums">
              {activeIncidents.length}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-xs">
            <span className="text-zinc-600">Model Score</span>
            <span className="text-zinc-300 tabular-nums">{latestPoint?.anomalyScorePercent || 12.4}%</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#09090b] border border-zinc-800 p-5 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-medium text-zinc-200">Power & Generation Telemetry</h2>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded-sm">
            24H Window
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryHistory} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#18181b" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} />
              <Line type="stepAfter" dataKey="totalPowerMW" stroke="#f4f4f5" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="solarGenerationMW" stroke="#52525b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
