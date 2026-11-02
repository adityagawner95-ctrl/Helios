import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { 
  BrainCircuit, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Zap,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export const AIIntelligenceView: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident, addToast } = useHelios();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || 'INC-8942');

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const radarData = activeIncident ? [
    { subject: 'CPU Temp Dev', val: Math.min(100, Math.abs(activeIncident.signals.cpuTempDeviation * 2.5)) },
    { subject: 'RAM Dev', val: Math.min(100, Math.abs(activeIncident.signals.ramDeviation * 2.5)) },
    { subject: 'Voltage Dev', val: Math.min(100, Math.abs(activeIncident.signals.voltageDeviation * 12)) },
    { subject: 'Latency Dev', val: Math.min(100, Math.abs(activeIncident.signals.latencyDeviation * 2)) },
    { subject: 'Isolation Score', val: activeIncident.anomalyScore }
  ] : [];

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              ISOLATION FOREST ENGINE v4.2
            </span>
            <span className="tech-badge px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MULTIVARIATE CORRELATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">AI INTELLIGENCE &amp; ANOMALY CENTER</h1>
          <p className="text-xs text-slate-400 font-mono">Unsupervised anomaly scoring, signal deviation maps &amp; root-cause attribution</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast('Model Retrained', 'Isolation forest retrained on 10,000 recent telemetry vectors.', 'success')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span>RETRAIN MODEL</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Incident Selector + Deep Anomaly Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Queue Selector (1/3) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold font-mono text-white">DETECTED ANOMALIES</h2>
              </div>
              <span className="tech-badge px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                {incidents.filter(i => i.status !== 'RESOLVED').length} ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedIncidentId === inc.id
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white font-mono">{inc.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <span className="text-xs text-slate-200 font-semibold line-clamp-1 block">{inc.title}</span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                    <span>ANOMALY: <strong className="text-rose-400">{inc.anomalyScore}%</strong></span>
                    <span>CONF: <strong className="text-sky-400">{inc.aiConfidence}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <span>MODEL SAMPLING FREQUENCY: 1.0 HZ</span>
          </div>
        </div>

        {/* Detailed Anomaly Breakdown (2/3) */}
        {activeIncident && (
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono text-indigo-400">{activeIncident.id}</span>
                  <span className="text-xs font-mono text-slate-400">• DETECTED AT {activeIncident.detectedAt}</span>
                </div>
                <h2 className="text-lg font-bold font-mono text-white">{activeIncident.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                {activeIncident.status !== 'RESOLVED' ? (
                  <>
                    <button
                      onClick={() => acknowledgeIncident(activeIncident.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
                    >
                      ACKNOWLEDGE
                    </button>
                    <button
                      onClick={() => resolveIncident(activeIncident.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-600/20"
                    >
                      MARK RESOLVED
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>

            {/* AI Reasoning Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block">ANOMALY SCORE</span>
                <span className="text-2xl font-bold text-rose-400">{activeIncident.anomalyScore}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block">AI CONFIDENCE</span>
                <span className="text-2xl font-bold text-sky-400">{activeIncident.aiConfidence}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block">TARGET NODE</span>
                <span className="text-sm font-bold text-slate-200 truncate block mt-1">{activeIncident.targetDeviceName}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 block">STATUS</span>
                <span className="text-sm font-bold text-amber-300 block mt-1">{activeIncident.status}</span>
              </div>
            </div>

            {/* Statistical Signal Deviations Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                STATISTICAL SIGNAL DEVIATIONS (NORMAL vs ANOMALY)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CPU TEMPERATURE</span>
                    <span className="text-slate-200 font-bold">Baseline: 42°C &rarr; Actual: 78.4°C</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                    +{activeIncident.signals.cpuTempDeviation}°C
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">RAM UTILIZATION</span>
                    <span className="text-slate-200 font-bold">Baseline: 62% &rarr; Actual: 88.5%</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                    +{activeIncident.signals.ramDeviation}%
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">VOLTAGE DELTA</span>
                    <span className="text-slate-200 font-bold">Baseline: 230V &rarr; Actual: 221.8V</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                    {activeIncident.signals.voltageDeviation}V
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">NETWORK LATENCY</span>
                    <span className="text-slate-200 font-bold">Baseline: 11.4ms &rarr; Actual: 44.2ms</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                    +{activeIncident.signals.latencyDeviation}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Radar Feature Contribution Diagram */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-bold font-mono text-slate-300 block mb-2">FEATURE IMPORTANCE RADAR</span>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                    <PolarRadiusAxis stroke="#334155" fontSize={10} />
                    <Radar name="Anomaly Weight" dataKey="val" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
