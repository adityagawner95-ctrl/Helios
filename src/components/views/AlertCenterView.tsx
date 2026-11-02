import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  AlertTriangle, 
  ChevronRight, 
  UserCheck, 
  Zap, 
  Terminal 
} from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const { incidents, acknowledgeIncident, resolveIncident, searchQuery, setSearchQuery } = useHelios();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = severityFilter === 'ALL' || i.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              INCIDENT MANAGEMENT DESK
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">ALERT &amp; INCIDENT CENTER</h1>
          <p className="text-xs text-slate-400 font-mono">Real-time incident dispatching, operator triage, and automated resolution logs</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  severityFilter === sev
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List Desk */}
      <div className="space-y-4">
        {filteredIncidents.map((inc) => (
          <div key={inc.id} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl border ${
                  inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 pulse-red' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">{inc.id}</span>
                    <span className="text-xs font-mono text-slate-400">• {inc.targetDeviceName}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{inc.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {inc.status !== 'RESOLVED' ? (
                  <>
                    <button
                      onClick={() => acknowledgeIncident(inc.id)}
                      className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
                    >
                      ACKNOWLEDGE
                    </button>
                    <button
                      onClick={() => resolveIncident(inc.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-600/20"
                    >
                      RESOLVE
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>

            {/* Event Timeline Audit Sequence */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                INCIDENT AUDIT TIMELINE
              </span>
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                {inc.timelineEvents.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{ev.timestamp}</span>
                    <span className="text-indigo-400 text-[10px] font-bold">[{ev.actor}]</span>
                    <span>{ev.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
