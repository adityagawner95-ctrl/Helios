import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { SolarNode } from '../../types/helios';
import { 
  Sun, 
  Zap, 
  Activity, 
  Flame, 
  Gauge, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

export const SolarIntelligenceView: React.FC = () => {
  const { solarNodes, telemetryHistory, setSelectedDeviceId, setActiveTab, addToast } = useHelios();
  const [selectedNode, setSelectedNode] = useState<SolarNode | null>(solarNodes[3] || solarNodes[0]); // Default to S-2004 or first
  const [fieldFilter, setFieldFilter] = useState<string>('ALL');

  const normalNodesCount = solarNodes.filter(s => s.status === 'NORMAL').length;
  const warningNodesCount = solarNodes.filter(s => s.status === 'WARNING').length;
  const criticalNodesCount = solarNodes.filter(s => s.status === 'CRITICAL').length;

  const totalSolarKW = solarNodes.reduce((acc, s) => acc + s.powerKW, 0);
  const avgEfficiency = (solarNodes.reduce((acc, s) => acc + s.efficiencyPercent, 0) / solarNodes.length).toFixed(1);

  const filteredNodes = solarNodes.filter(s => {
    if (fieldFilter === 'ALL') return true;
    if (fieldFilter === 'FAULT') return s.status === 'CRITICAL' || s.status === 'WARNING';
    return s.coordinates.fieldZone === fieldFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SOLAR FIELD INTELLIGENCE
            </span>
            <span className="tech-badge px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              24 STRINGS ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">SOLAR GRID INTELLIGENCE</h1>
          <p className="text-xs text-slate-400 font-mono">Photovoltaic array telemetry, inverter efficiency, irradiance tracking &amp; string anomaly diagnostics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass-panel text-xs font-mono flex items-center gap-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">GLOBAL FIELD OUTPUT</span>
              <span className="text-sm font-bold text-amber-300">{(totalSolarKW / 1000).toFixed(2)} MW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">CURRENT OUTPUT</span>
          <span className="text-lg font-bold font-mono text-amber-300">{(totalSolarKW / 1000).toFixed(2)} MW</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">DAILY YIELD</span>
          <span className="text-lg font-bold font-mono text-emerald-400">18.6 MWh</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">GRID EFFICIENCY</span>
          <span className="text-lg font-bold font-mono text-sky-400">{avgEfficiency}%</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">AVG VOLTAGE DC</span>
          <span className="text-lg font-bold font-mono text-slate-200">782.4 V</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">DC CURRENT</span>
          <span className="text-lg font-bold font-mono text-slate-200">108.2 A</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">IRRADIANCE</span>
          <span className="text-lg font-bold font-mono text-amber-400">924 W/m²</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">PANEL TEMP</span>
          <span className="text-lg font-bold font-mono text-rose-400">34.2 °C</span>
        </div>
      </div>

      {/* Digital Solar Field Matrix + Panel Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Field Layout Matrix (2/3 width) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold font-mono text-white">DIGITAL PHOTOVOLTAIC FIELD MATRIX</h2>
              </div>

              {/* Zone Filter */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                {['ALL', 'FIELD_A', 'FIELD_B', 'FAULT'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFieldFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      fieldFilter === f 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Status Legend */}
            <div className="flex items-center gap-6 mb-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-400" />
                <span>NORMAL ({normalNodesCount})</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500/80 border border-amber-400" />
                <span>WARNING ({warningNodesCount})</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-500/80 border border-rose-400 pulse-red" />
                <span>CRITICAL / ANOMALY ({criticalNodesCount})</span>
              </span>
            </div>

            {/* Interactive Grid Map */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                let colorClass = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40';
                if (node.status === 'WARNING') {
                  colorClass = 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/40';
                } else if (node.status === 'CRITICAL') {
                  colorClass = 'bg-rose-950/80 border-rose-500/60 text-rose-300 hover:bg-rose-900/60 pulse-red';
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${colorClass} ${
                      isSelected ? 'ring-2 ring-amber-400 scale-105 shadow-xl shadow-amber-500/10' : ''
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold tracking-tight">{node.id}</span>
                    <Zap className="w-4 h-4 my-1.5 opacity-80" />
                    <span className="text-[11px] font-mono font-bold">{node.powerKW} <span className="text-[9px] font-normal">kW</span></span>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">{node.efficiencyPercent}% EFF</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SHOWING {filteredNodes.length} SOLAR STRINGS</span>
            <span className="text-amber-400">REAL-TIME INVERTER TELEMETRY</span>
          </div>
        </div>

        {/* Selected Solar String Detail Drawer (1/3 width) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold font-mono text-white">STRING INSPECTOR</h2>
              </div>
              {selectedNode && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedNode.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedNode.status}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-white block">{selectedNode.arrayName}</span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedNode.id} • String {selectedNode.stringId}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">POWER OUTPUT</span>
                    <span className="text-base font-bold text-amber-300">{selectedNode.powerKW} kW</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">EFFICIENCY</span>
                    <span className="text-base font-bold text-sky-400">{selectedNode.efficiencyPercent}%</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">VOLTAGE DC</span>
                    <span className="text-base font-bold text-slate-200">{selectedNode.voltageDC} V</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">PANEL TEMP</span>
                    <span className="text-base font-bold text-rose-400">{selectedNode.panelTempC} °C</span>
                  </div>
                </div>

                {selectedNode.status === 'CRITICAL' && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>ANOMALY DETECTED ON INVERTER</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Power dropped 38% below model prediction. Suspected DC bypass diode fault or localized dirt fouling.
                    </p>
                    <button
                      onClick={() => {
                        addToast('Diagnostic Signal Sent', `Calibrating inverter string ${selectedNode.id}`, 'info');
                      }}
                      className="w-full mt-2 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-all"
                    >
                      CALIBRATE INVERTER
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono">Select a solar panel tile to inspect telemetry.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('ai-intelligence')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>RUN AI IRRADIANCE MODEL</span> &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Grid Performance Charts Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-sm font-bold font-mono text-white mb-4">GRID PERFORMANCE &amp; IRRADIANCE CURVE</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} />
              <XAxis dataKey="timeLabel" stroke="#64748B" fontSize={10} />
              <YAxis stroke="#64748B" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF' }} />
              <Area type="monotone" dataKey="irradianceWm2" name="Irradiance (W/m²)" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
              <Area type="monotone" dataKey="solarGenerationMW" name="Solar Power (MW)" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
