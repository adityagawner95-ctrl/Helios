import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { IRSensor } from '../../types/helios';
import { 
  Radio, 
  Battery, 
  Flame, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

export const SensorArrayView: React.FC = () => {
  const { irSensors, triggerIRSensorPing } = useHelios();
  const [activeZone, setActiveZone] = useState<string>('ALL');

  const filteredSensors = irSensors.filter(s => activeZone === 'ALL' || s.zone === activeZone);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              PERIMETER THERMAL IR ARRAYS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">IR SENSOR ARRAY MATRIX</h1>
          <p className="text-xs text-slate-400 font-mono">Far-Infrared &amp; Thermal IR beam arrays for physical security and substation thermal monitoring</p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          {['ALL', 'ZONE_ALPHA', 'ZONE_BETA', 'ZONE_GAMMA', 'ZONE_DELTA'].map((z) => (
            <button
              key={z}
              onClick={() => setActiveZone(z)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                activeZone === z ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {z.replace('ZONE_', 'ZONE ')}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Grid Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSensors.map((sensor) => {
          let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          if (sensor.status === 'TRIGGERED') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
          if (sensor.status === 'ANOMALY') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30 pulse-red';
          if (sensor.status === 'OFFLINE') badgeColor = 'bg-slate-800 text-slate-500';

          return (
            <div key={sensor.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold font-mono text-white">{sensor.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeColor}`}>
                    {sensor.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-bold text-slate-100 font-mono">{sensor.locationName}</h3>
                  <p className="text-[10px] font-mono text-slate-400">{sensor.zone} • Band: {sensor.irradianceBand}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">THERMAL DELTA</span>
                    <span className={`text-sm font-bold ${sensor.thermalDeltaC > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {sensor.thermalDeltaC > 0 ? `+${sensor.thermalDeltaC}` : sensor.thermalDeltaC} °C
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">24H TRIGGERS</span>
                    <span className="text-sm font-bold text-sky-300">{sensor.triggerCount24h}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">BATTERY</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">{sensor.batteryPercent}%</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">LAST EVENT</span>
                    <span className="text-xs font-bold text-slate-300">{sensor.lastTriggered}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => triggerIRSensorPing(sensor.id)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                <span>PING DIAGNOSTIC PULSE</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
