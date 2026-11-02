import React from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Cpu, X, Zap, RefreshCw, Activity, Terminal, ShieldAlert } from 'lucide-react';

export const DeviceDetailModal: React.FC = () => {
  const { selectedDeviceId, setSelectedDeviceId, edgeNodes, solarNodes, triggerNodeAction, addToast } = useHelios();

  if (!selectedDeviceId) return null;

  const edgeNode = edgeNodes.find(n => n.id === selectedDeviceId);
  const solarNode = solarNodes.find(s => s.id === selectedDeviceId);

  const title = edgeNode ? edgeNode.name : (solarNode ? solarNode.arrayName : selectedDeviceId);
  const idLabel = selectedDeviceId;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 font-mono text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{idLabel}</span>
              <h2 className="text-base font-bold text-white">{title}</h2>
            </div>
          </div>
          <button
            onClick={() => setSelectedDeviceId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {edgeNode && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">CPU TEMP</span>
                <span className="text-sm font-bold text-rose-400">{edgeNode.cpuTempC} °C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">RAM UTIL</span>
                <span className="text-sm font-bold text-sky-400">{edgeNode.ramUsagePercent} %</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">LATENCY</span>
                <span className="text-sm font-bold text-emerald-400">{edgeNode.latencyMs} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">UPTIME</span>
                <span className="text-sm font-bold text-slate-200">{edgeNode.uptime}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">DEVICE METADATA</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>IP: <span className="text-sky-400">{edgeNode.ipAddress}</span></div>
                <div>TYPE: <span className="text-slate-100">{edgeNode.type}</span></div>
                <div>FIRMWARE: <span className="text-slate-100">{edgeNode.firmwareVersion}</span></div>
                <div>LOCATION: <span className="text-slate-100">{edgeNode.locationLabel}</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  triggerNodeAction(edgeNode.id, 'REBOOT');
                  setSelectedDeviceId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
              >
                REBOOT NODE
              </button>
              <button
                onClick={() => {
                  triggerNodeAction(edgeNode.id, 'FIRMWARE_UPDATE');
                  setSelectedDeviceId(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                UPDATE FIRMWARE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
