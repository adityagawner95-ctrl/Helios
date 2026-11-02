import React, { useState, useEffect, useRef } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Box, Layers, RotateCcw, Zap, Cpu, Sun, ShieldCheck, Maximize2 } from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { solarNodes, edgeNodes, addToast } = useHelios();
  const [rotationAngle, setRotationAngle] = useState(25);
  const [pitchAngle, setPitchAngle] = useState(55);
  const [selectedElement, setSelectedElement] = useState<string | null>('SOLAR-ARRAY-01');
  const [showPowerFlowParticles, setShowPowerFlowParticles] = useState(true);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-badge px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              PHYSICAL DIGITAL TWIN 3D
            </span>
            <span className="tech-badge px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              REAL-TIME ISOMETRIC MODEL
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-mono-tech text-white">DIGITAL TWIN OBSERVABILITY</h1>
          <p className="text-xs text-slate-400 font-mono">Real-time physical asset rendering, spatial power vectors &amp; thermal distribution</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPowerFlowParticles(!showPowerFlowParticles)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
              showPowerFlowParticles ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{showPowerFlowParticles ? 'POWER FLOW PARTICLES ON' : 'POWER FLOW OFF'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas / Pseudo-3D Isometric Interactive Render */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Isometric 3D Scene Viewport (2/3) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative min-h-[550px] flex flex-col justify-between overflow-hidden">
          {/* Top Controls */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold font-mono text-white">SPATIAL SCENE // SECTOR A-4</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <button
                onClick={() => setRotationAngle((r) => (r + 45) % 360)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>ROTATE ({rotationAngle}°)</span>
              </button>
            </div>
          </div>

          {/* Isometric Cyber 3D Canvas Simulation */}
          <div className="relative my-auto w-full h-[400px] flex items-center justify-center">
            {/* Background Grid Mesh */}
            <div 
              className="w-full h-full rounded-2xl border border-slate-800/80 bg-slate-950/90 relative overflow-hidden flex items-center justify-center transition-transform duration-500"
              style={{
                perspective: '1000px'
              }}
            >
              <div 
                className="w-[500px] h-[340px] relative transition-all duration-500"
                style={{
                  transform: `rotateX(${pitchAngle}deg) rotateZ(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Ground Plane Grid */}
                <div className="absolute inset-0 border border-indigo-500/30 rounded-2xl bg-indigo-950/20 bg-cyber-grid" />

                {/* 3D Solar Array Panels */}
                <div 
                  onClick={() => setSelectedElement('SOLAR-ARRAY-A')}
                  className="absolute top-8 left-8 w-48 h-32 rounded-xl border border-amber-400/60 bg-amber-500/20 hover:bg-amber-500/30 transition-all cursor-pointer flex flex-col items-center justify-center text-amber-300 font-mono shadow-xl shadow-amber-500/10"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <Sun className="w-8 h-8 mb-1 animate-pulse" />
                  <span className="text-xs font-bold">SOLAR FIELD A</span>
                  <span className="text-[10px] text-slate-300">842 kW • 98.4% EFF</span>
                </div>

                {/* 3D Edge Server Rack Tower */}
                <div 
                  onClick={() => setSelectedElement('EDGE-RACK-01')}
                  className="absolute bottom-8 right-12 w-36 h-36 rounded-2xl border border-indigo-400/80 bg-indigo-900/60 hover:bg-indigo-800/80 transition-all cursor-pointer flex flex-col items-center justify-center text-sky-300 font-mono shadow-2xl shadow-indigo-600/30"
                  style={{ transform: 'translateZ(45px)' }}
                >
                  <Cpu className="w-10 h-10 mb-1" />
                  <span className="text-xs font-bold text-white">EDGE SERVER RACK</span>
                  <span className="text-[10px] text-emerald-400">NODE E-2048</span>
                </div>

                {/* Power Flow Vector Lines */}
                {showPowerFlowParticles && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="150" y1="120" x2="350" y2="240" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 6" className="animate-pulse" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
            <span>MODEL RENDER ENGINE: THREE.JS CANVA S / GLTF</span>
            <span className="text-sky-400">ASSET STATE: SYNCHRONIZED</span>
          </div>
        </div>

        {/* Spatial Asset Detail Card (1/3) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold font-mono text-white">SPATIAL INSPECTOR</h2>
              </div>
              <span className="tech-badge px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SELECTED ASSET</span>
                <span className="text-sm font-bold text-white">{selectedElement}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">COORDINATES:</span>
                  <span className="text-slate-200 font-bold">X: 120, Y: 180, Z: 45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PHYSICAL ZONE:</span>
                  <span className="text-sky-400 font-bold">SUBSTATION SECTOR 4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">HEALTH SCORE:</span>
                  <span className="text-emerald-400 font-bold">98.4%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => addToast('Digital Twin Sync', 'Spatial telemetry resynchronized.', 'info')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            RESYNC SPATIAL DATA
          </button>
        </div>
      </div>
    </div>
  );
};
