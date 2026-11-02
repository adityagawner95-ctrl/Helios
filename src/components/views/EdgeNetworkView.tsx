import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { EdgeNode } from '../../types/helios';
import { 
  Network, 
  Cpu, 
  Server, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Zap, 
  Terminal,
  X,
  Play
} from 'lucide-react';

export const EdgeNetworkView: React.FC = () => {
  const { edgeNodes, selectedDeviceId, setSelectedDeviceId, triggerNodeAction, addToast } = useHelios();
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'CRITICAL' | 'RASPBERRY_PI'>('ALL');

  const activeNode = edgeNodes.find(n => n.id === selectedDeviceId) || edgeNodes[0];

  const filteredNodes = edgeNodes.filter(n => {
    if (activeTabFilter === 'CRITICAL') return n.status === 'CRITICAL' || n.status === 'WARNING' || n.status === 'OFFLINE';
    if (activeTabFilter === 'RASPBERRY_PI') return n.type === 'RASPBERRY_PI_4';
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              TOPOLOGY &amp; HARDWARE OBSERABILITY
            </span>
            <span className="tech-badge px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              4,208 ACTIVE PI / JETSON EDGES
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">EDGE COMPUTING TOPOLOGY</h1>
          <p className="text-xs text-slate-400 font-mono">Distributed Raspberry Pi 4 arrays, Jetson Orin AI clusters &amp; Substation telemetry gateways</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast('Topology Scan Complete', '4,208 edge nodes responding via MQTT/gRPC', 'success')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />
            <span>PING NETWORK MESH</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Banner */}
      <div className="p-4 rounded-xl glass-panel flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-300 border border-indigo-500/20">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold">PHYSICAL SENSORS / IR / PV</span>
        </div>
        <span className="text-indigo-400 font-bold">&rarr;</span>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="font-bold">EDGE NODES (Raspberry Pi / Jetson)</span>
        </div>
        <span className="text-indigo-400 font-bold">&rarr;</span>
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" />
          <span className="font-bold">HELIOS CORE ENGINE</span>
        </div>
      </div>

      {/* Topology Canvas + Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Topology Map Canvas (2/3) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold font-mono text-white">INTERACTIVE MESH TOPOLOGY MAP</h2>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                {['ALL', 'CRITICAL', 'RASPBERRY_PI'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveTabFilter(f as any)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeTabFilter === f 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visual Network Topology Diagram */}
            <div className="relative w-full h-[380px] bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Network Topology Connections to HELIOS Core */}
                {filteredNodes.map((node, i) => {
                  const coreX = 400;
                  const coreY = 80;
                  const nodeX = 100 + (i % 3) * 260;
                  const nodeY = 220 + Math.floor(i / 3) * 120;

                  return (
                    <g key={node.id}>
                      <line
                        x1={coreX}
                        y1={coreY}
                        x2={nodeX}
                        y2={nodeY}
                        stroke={node.status === 'CRITICAL' ? '#EF4444' : '#4F46E5'}
                        strokeWidth={node.status === 'CRITICAL' ? 2 : 1.5}
                        strokeDasharray={node.status === 'OFFLINE' ? '4 4' : 'none'}
                        opacity={0.6}
                      />
                      {node.status !== 'OFFLINE' && (
                        <circle cx={(coreX + nodeX) / 2} cy={(coreY + nodeY) / 2} r="3" fill="#38BDF8" className="pulse-sky" />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* HELIOS CORE NODE (Top Center) */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 p-3 rounded-2xl bg-indigo-900/80 border border-indigo-400 shadow-2xl flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Server className="w-6 h-6" />
                </div>
                <div className="font-mono">
                  <span className="text-xs font-bold text-white block">HELIOS CORE MESH</span>
                  <span className="text-[10px] text-sky-300">CENTRAL INGESTION HUB</span>
                </div>
              </div>

              {/* Distributed Edge Nodes */}
              <div className="absolute bottom-6 left-0 right-0 px-8 grid grid-cols-3 gap-6 z-10">
                {filteredNodes.map((node) => {
                  const isSelected = activeNode?.id === node.id;
                  let borderClass = 'border-slate-800 bg-slate-900/90 hover:border-indigo-500';
                  if (node.status === 'CRITICAL') borderClass = 'border-rose-500/80 bg-rose-950/80 pulse-red';
                  if (node.status === 'WARNING') borderClass = 'border-amber-500/80 bg-amber-950/80';
                  if (isSelected) borderClass += ' ring-2 ring-indigo-400 shadow-2xl';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedDeviceId(node.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${borderClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white font-mono truncate">{node.name}</span>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          node.status === 'NORMAL' ? 'bg-emerald-400 pulse-green' :
                          node.status === 'WARNING' ? 'bg-amber-400' :
                          node.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-slate-600'
                        }`} />
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300">
                        <div>CPU: <span className="font-bold">{node.cpuTempC}°C</span></div>
                        <div>RAM: <span className="font-bold">{node.ramUsagePercent}%</span></div>
                        <div>LATENCY: <span className="text-emerald-400 font-bold">{node.latencyMs}ms</span></div>
                        <div>VOLT: <span className="font-bold">{node.voltageV}V</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>NETWORK PROTOCOL: gRPC / MQTT / TLS 1.3</span>
            <span className="text-indigo-400">LATENCY AVG: {activeNode ? activeNode.latencyMs : 11.2}ms</span>
          </div>
        </div>

        {/* Selected Node Detailed Inspector Sidebar (1/3) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold font-mono text-white">NODE INSPECTOR</h2>
              </div>
              {activeNode && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeNode.status === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-400' :
                  activeNode.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {activeNode.status}
                </span>
              )}
            </div>

            {activeNode ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-white font-mono block">{activeNode.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 block">ID: {activeNode.id} • {activeNode.type}</span>
                  <span className="text-[10px] font-mono text-sky-400 block">IP: {activeNode.ipAddress}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CPU TEMP</span>
                    <span className={`text-base font-bold ${activeNode.cpuTempC > 70 ? 'text-rose-400' : 'text-slate-100'}`}>
                      {activeNode.cpuTempC} °C
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RAM UTILIZATION</span>
                    <span className="text-base font-bold text-sky-400">{activeNode.ramUsagePercent}%</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">VOLTAGE</span>
                    <span className="text-base font-bold text-slate-100">{activeNode.voltageV} V</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">UPTIME</span>
                    <span className="text-base font-bold text-emerald-400">{activeNode.uptime}</span>
                  </div>
                </div>

                {/* Remote Hardware Controls */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-200 block">REMOTE HARDWARE COMMANDS</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      onClick={() => triggerNodeAction(activeNode.id, 'REBOOT')}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
                    >
                      REBOOT NODE
                    </button>
                    <button
                      onClick={() => triggerNodeAction(activeNode.id, 'ISOLATE')}
                      className="py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold border border-amber-500/30 transition-colors"
                    >
                      ISOLATE ETH0
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono">Select an edge node to view hardware status.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => triggerNodeAction(activeNode.id, 'FIRMWARE_UPDATE')}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              DEPLOY OTA FIRMWARE (v3.1.0)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
