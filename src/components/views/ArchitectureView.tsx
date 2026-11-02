import React from 'react';
import { Layers, Server, Cpu, Zap, ShieldCheck, Database, Radio, BrainCircuit } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ENTERPRISE BLUEPRINT
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">SYSTEM ARCHITECTURE &amp; DATA PIPELINE</h1>
          <p className="text-xs text-slate-400 font-mono">End-to-end edge-to-cloud telemetry flow, isolation forest ML engine &amp; time-series storage</p>
        </div>
      </div>

      {/* Architecture Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Stage 1 */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-amber-500 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Zap className="w-5 h-5" />
            <span>1. PHYSICAL INFRASTRUCTURE</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Photovoltaic Solar Strings, Inverters, Thermal IR Arrays, Substation Transformers &amp; Smart Meters generating raw electrical and thermal signals.
          </p>
        </div>

        {/* Stage 2 */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-sky-500 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Cpu className="w-5 h-5" />
            <span>2. EDGE COMPUTING AGENTS</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Distributed Raspberry Pi 4 &amp; Jetson Orin nodes running local C++/Rust telemetry daemons,MQTT/gRPC bridges &amp; local signal smoothing.
          </p>
        </div>

        {/* Stage 3 */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-indigo-500 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <BrainCircuit className="w-5 h-5" />
            <span>3. AI ANOMALY ENGINE</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            FastAPI / Python ML service running Isolation Forest multivariate anomaly scoring, signal correlation &amp; automated soft-isolation dispatches.
          </p>
        </div>

        {/* Stage 4 */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-emerald-500 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Server className="w-5 h-5" />
            <span>4. HELIOS COMMAND OS</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            React / TypeScript / Tailwind web command center with real-time WebSockets, time-series TimescaleDB storage &amp; operator triage desks.
          </p>
        </div>
      </div>
    </div>
  );
};
