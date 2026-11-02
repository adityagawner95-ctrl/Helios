import React from 'react';
import { useHelios } from '../../context/HeliosContext';

export const LiveTelemetryView: React.FC = () => {
  const { telemetryHistory } = useHelios();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-100">Live Telemetry</h1>
          <p className="text-sm text-zinc-500 mt-1">High-frequency sensor data stream.</p>
        </div>
      </div>

      <div className="bg-[#09090b] border border-zinc-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs data-grid">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Total Pwr (MW)</th>
                <th>Solar (MW)</th>
                <th>Voltage (V)</th>
                <th>Current (A)</th>
                <th>CPU Temp</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {telemetryHistory.slice().reverse().map((point, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50">
                  <td className="text-zinc-500">{point.timeLabel}</td>
                  <td>{point.totalPowerMW}</td>
                  <td className="text-zinc-500">{point.solarGenerationMW}</td>
                  <td>{point.voltageV}</td>
                  <td>{point.currentA}</td>
                  <td>{point.avgCpuTempC}°C</td>
                  <td>{point.networkLatencyMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
