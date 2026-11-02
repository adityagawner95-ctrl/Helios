import React, { useState } from 'react';
import { useHelios } from '../../context/HeliosContext';
import { NavigationTab } from '../../types/helios';
import { 
  Activity, Sun, Cpu, Radio, BrainCircuit, ShieldAlert, 
  FileText, Settings, Network, Terminal, LayoutDashboard,
  Box, Layers, ChevronLeft, ChevronRight, Zap, Server
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, incidents } = useHelios();
  const [collapsed, setCollapsed] = useState(false);

  const activeIncidentsCount = incidents.filter(i => i.status === 'ACTIVE' || i.status === 'INVESTIGATING').length;

  const navGroups = [
    {
      groupName: 'COMMAND',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'telemetry', label: 'Telemetry', icon: Activity },
        { id: 'solar', label: 'Solar Field', icon: Sun },
        { id: 'edge-network', label: 'Edge Topology', icon: Network },
        { id: 'sensor-array', label: 'Sensors', icon: Radio },
      ]
    },
    {
      groupName: 'INTELLIGENCE',
      items: [
        { id: 'ai-intelligence', label: 'AI Anomaly', icon: BrainCircuit },
        { id: 'digital-twin', label: 'Digital Twin', icon: Box },
      ]
    },
    {
      groupName: 'OPERATIONS',
      items: [
        { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined },
        { id: 'event-logs', label: 'Logs', icon: Terminal },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`flex flex-col h-screen bg-[#09090b] border-r border-zinc-900 transition-all duration-300 z-30 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="flex items-center justify-between h-12 px-4 border-b border-zinc-900">
        {!collapsed && (
          <span className="font-semibold tracking-tight text-zinc-100 text-sm">HELIOS_</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!collapsed && (
              <div className="px-4 pb-1 text-[10px] font-medium tracking-widest text-zinc-600 uppercase font-mono">
                {group.groupName}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavigationTab)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center px-4 py-1.5 text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-zinc-900 text-zinc-100' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                  {!collapsed && (
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono border border-zinc-700 text-zinc-400 rounded-sm leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};
