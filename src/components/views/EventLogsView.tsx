import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Terminal, Search, Filter, Download, Shield, X } from 'lucide-react';

export const EventLogsView: React.FC = () => {
  const { auditLogs, searchQuery, setSearchQuery, addToast } = useHelios();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Event,Device,Severity,Source,Status\n';
    const rows = filteredLogs.map(l => `${l.id},${l.timestamp},"${l.event}",${l.device},${l.severity},${l.source},${l.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helios_audit_logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Audit Logs Exported', 'CSV file generated.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              IMMUTABLE AUDIT LOG
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">SYSTEM &amp; AUDIT EVENT LOGS</h1>
          <p className="text-xs text-slate-400 font-mono">Cryptographically signed system events, security audit trail &amp; operator commands</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT LOGS CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full bg-slate-900 text-xs font-mono text-slate-200 pl-9 pr-8 py-2 rounded-lg border border-slate-700/60 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">SEVERITY:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                severityFilter === sev ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">LOG ID</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">EVENT</th>
                <th className="p-4">DEVICE</th>
                <th className="p-4">SEVERITY</th>
                <th className="p-4">SOURCE</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-400">{log.id}</td>
                  <td className="p-4 text-slate-100">{log.timestamp}</td>
                  <td className="p-4 text-slate-200 font-semibold">{log.event}</td>
                  <td className="p-4 text-sky-400">{log.device}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400' :
                      log.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{log.source}</td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-bold text-[10px]">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
