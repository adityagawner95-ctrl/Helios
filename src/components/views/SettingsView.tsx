import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Settings, Sliders, Shield, Bell, Save, Key, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addToast, tickerSpeedMs, setTickerSpeedMs } = useHelios();

  const handleSave = () => {
    addToast('Configuration Saved', 'System operational thresholds updated.', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold font-mono-tech text-white">SYSTEM &amp; PLATFORM SETTINGS</h1>
        <p className="text-xs text-slate-400 font-mono">Telemetry sampling thresholds, AI engine parameters &amp; notification routes</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl max-w-3xl space-y-6 font-mono text-xs">
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>TELEMETRY TICK FREQUENCY</span>
          </h2>
          <div className="flex items-center gap-2">
            {[1000, 2500, 5000].map((speed) => (
              <button
                key={speed}
                onClick={() => setTickerSpeedMs(speed)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  tickerSpeedMs === speed
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {speed / 1000} SECOND TICK
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>AI ISOLATION FOREST THRESHOLDS</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block text-[10px] mb-1">CRITICAL ANOMALY SCORE THRESHOLD (%)</label>
              <input type="number" defaultValue={85} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block text-[10px] mb-1">CPU THERMAL THRESHOLD (°C)</label>
              <input type="number" defaultValue={75} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
