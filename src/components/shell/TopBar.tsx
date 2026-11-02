import React from 'react';
import { useHelios } from '../../context/HeliosContext';
import { Search, Bell, Pause, Play, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { systemSummary, isLivePaused, toggleLivePause, searchQuery, setSearchQuery, incidents } = useHelios();
  const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE' || i.status === 'INVESTIGATING');

  return (
    <header className="h-12 bg-[#000000] border-b border-zinc-900 px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1">
        <Search className="w-4 h-4 text-zinc-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search telemetry, nodes, or incidents..."
          className="bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none w-64"
        />
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
        <button onClick={toggleLivePause} className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          {isLivePaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isLivePaused ? 'PAUSED' : 'LIVE'}</span>
        </button>

        <span className="text-zinc-800">|</span>

        <span>{systemSummary.avgNetworkLatencyMs}MS</span>

        <span className="text-zinc-800">|</span>

        <button className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          <Bell className="w-3.5 h-3.5" />
          {activeIncidents.length > 0 && <span className="text-white bg-zinc-800 px-1 rounded-sm">{activeIncidents.length}</span>}
        </button>

        <span className="text-zinc-800">|</span>

        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>OP-01</span>
        </div>
      </div>
    </header>
  );
};
