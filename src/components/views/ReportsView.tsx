import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { FileText, Download, Printer, CheckCircle2, Calendar, ShieldCheck, Zap } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { addToast } = useHelios();
  const [reportType, setReportType] = useState<'WEEKLY_PERFORMANCE' | 'SOLAR_YIELD' | 'AI_INCIDENT_SUMMARY'>('WEEKLY_PERFORMANCE');

  const handleGeneratePDF = () => {
    window.print();
    addToast('PDF Report Generated', `Printed ${reportType}_REPORT.pdf`, 'success');
  };

  const handleExportCSV = (type: 'telemetry' | 'incidents') => {
    window.open(`/api/export/csv?type=${type}`, '_blank');
    addToast('CSV Export Started', `Downloading ${type} data as CSV`, 'info');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              EXECUTIVE COMPLIANCE REPORTS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">SYSTEM &amp; PERFORMANCE REPORTS</h1>
          <p className="text-xs text-slate-400 font-mono">Automated operational summaries, energy generation compliance &amp; hardware SLA verification</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportCSV('telemetry')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT TELEMETRY CSV</span>
          </button>
          <button
            onClick={() => handleExportCSV('incidents')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT INCIDENTS CSV</span>
          </button>
          <button
            onClick={handleGeneratePDF}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>GENERATE PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono max-w-xl">
        {[
          { id: 'WEEKLY_PERFORMANCE', label: 'WEEKLY SLA & UPTIME' },
          { id: 'SOLAR_YIELD', label: 'SOLAR YIELD & CO2' },
          { id: 'AI_INCIDENT_SUMMARY', label: 'AI INCIDENT AUDIT' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all ${
              reportType === tab.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Preview Document Card */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-700/80 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-white">HELIOS // ENTERPRISE OPERATIONAL REPORT</h2>
            <p className="text-xs text-slate-400 font-mono">GENERATED: {new Date().toLocaleDateString()} • CONFIDENTIAL</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
            H
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">INFRASTRUCTURE UPTIME</span>
            <span className="text-lg font-bold text-emerald-400">99.98% SLA</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">ENERGY YIELD (7D)</span>
            <span className="text-lg font-bold text-amber-400">128.4 MWh</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">AI INCIDENTS RESOLVED</span>
            <span className="text-lg font-bold text-sky-400">14 / 14</span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono text-slate-300">
          <h3 className="font-bold text-slate-100 uppercase tracking-wider">EXECUTIVE SUMMARY</h3>
          <p className="leading-relaxed text-slate-400">
            Over the preceding operational period, the HELIOS Edge Command platform continuously monitored 4,208 distributed Raspberry Pi 4 edge nodes and 24 photovoltaic solar string arrays. Isolation Forest anomaly detection maintained zero false-positive downtime incidents while proactively isolating Node E-2048 prior to thermal cutoff.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>SIGNATURE: HELIOS AI COMPLIANCE ENGINE</span>
          <span>SHA256: 8f9a2b4c1d6e3f...</span>
        </div>
      </div>
    </div>
  );
};
