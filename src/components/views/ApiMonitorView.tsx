import React, { useState, useEffect } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Server, Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const ApiMonitorView: React.FC = () => {
  const { systemSummary } = useHelios();
  const [apiStatus, setApiStatus] = useState<string>('UNKNOWN');
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setApiStatus('200 OK');
          setLastCheck(data.timestamp);
        } else {
          setApiStatus('ERROR');
        }
      } catch (e) {
        setApiStatus('OFFLINE');
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold font-mono-tech text-white">API &amp; INGESTION MONITOR</h1>
        <p className="text-xs text-slate-400 font-mono">gRPC, REST &amp; WebSocket endpoint throughput metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">WEBSOCKET INGESTION</span>
          <span className="text-xl font-bold text-emerald-400 block mt-1">{systemSummary.ingestionRateMBs} MB/s</span>
          <p className="text-slate-500 text-[10px] mt-2">Latency: {systemSummary.avgNetworkLatencyMs}ms</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">gRPC EDGE BRIDGE</span>
          <span className="text-xl font-bold text-sky-400 block mt-1">4,208 NODES SYNCED</span>
          <p className="text-slate-500 text-[10px] mt-2">SSL/TLS 1.3 Encrypted</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-slate-400 block text-[10px]">REST API ENDPOINTS</span>
          <span className={`text-xl font-bold block mt-1 ${apiStatus === '200 OK' ? 'text-indigo-400' : 'text-red-400'}`}>
            {apiStatus}
          </span>
          <p className="text-slate-500 text-[10px] mt-2">Last check: {lastCheck || 'Pending...'}</p>
        </div>
      </div>
    </div>
  );
};
