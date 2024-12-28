import React from 'react';
import { X, ChevronUp, ChevronDown, Clock, Activity } from 'lucide-react';
import { DatabaseStats } from '../hooks/useStats';

interface StatsDetailModalProps {
  type: keyof DatabaseStats;
  stats: DatabaseStats;
  onClose: () => void;
}

export const StatsDetailModal: React.FC<StatsDetailModalProps> = ({ type, stats, onClose }) => {
  const renderContent = () => {
    switch (type) {
      case 'companies':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label="Total Companies"
                value={stats.companies.total.toLocaleString()}
                trend={+2.5}
              />
              <StatBox
                label="Added Today"
                value="47"
                trend={+12.3}
              />
              <StatBox
                label="Updated This Week"
                value="1,284"
                trend={-4.2}
              />
              <StatBox
                label="Data Completion"
                value="94.2%"
                trend={+0.8}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-green-500/70 text-xs font-mono mb-2">RECENT UPDATES</h3>
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-green-500/70">Company data updated</span>
                    <span className="text-green-500/50">{i}m ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label="Active Users"
                value={stats.users.active.toString()}
                trend={+5.2}
              />
              <StatBox
                label="Peak Today"
                value={stats.users.peakToday.toString()}
                trend={+15.7}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-green-500/70 text-xs font-mono mb-2">ACTIVE SESSIONS</h3>
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-green-500/70">User session active</span>
                    <span className="text-green-500/50">{i * 15}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label="Response Time"
                value={`${stats.performance.avgResponse}ms`}
                trend={-12.5}
              />
              <StatBox
                label="Uptime"
                value={`${stats.performance.uptime}%`}
                trend={+0.2}
              />
              <StatBox
                label="Queries/sec"
                value="847"
                trend={+24.8}
              />
              <StatBox
                label="Cache Hit Rate"
                value="92.4%"
                trend={+1.5}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-green-500/70 text-xs font-mono mb-2">SYSTEM STATUS</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-500/70">Main Database</span>
                  </div>
                  <span className="text-green-500/50">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-500/70">Search Index</span>
                  </div>
                  <span className="text-green-500/50">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-500/70">API Gateway</span>
                  </div>
                  <span className="text-green-500/50">Operational</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'aiAgents':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatBox
                label="Active Tasks"
                value={stats.aiAgents.active.toString()}
                trend={+15.0}
              />
              <StatBox
                label="Queue Length"
                value={stats.aiAgents.queued.toString()}
                trend={-8.3}
              />
              <StatBox
                label="Processing"
                value={stats.aiAgents.processing.toString()}
                trend={+4.2}
              />
              <StatBox
                label="Success Rate"
                value="98.7%"
                trend={+0.5}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-green-500/70 text-xs font-mono mb-2">ACTIVE AGENTS</h3>
              <div className="space-y-2">
                {[
                  { name: 'Data Enrichment', status: 'Processing', time: '2m' },
                  { name: 'Market Analysis', status: 'Learning', time: '5m' },
                  { name: 'Competitor Research', status: 'Queued', time: '1m' }
                ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-green-500/50" />
                      <span className="text-green-500/70">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500/50">{agent.status}</span>
                      <Clock className="w-3 h-3 text-green-500/30" />
                      <span className="text-green-500/30">{agent.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-black/90 border border-green-500/30 rounded-lg shadow-xl animate-slideDown">
        <div className="flex items-center justify-between p-4 border-b border-green-500/30">
          <h2 className="text-lg text-green-500 font-mono">
            {type.toUpperCase()} STATISTICS
          </h2>
          <button
            onClick={onClose}
            className="text-green-500/70 hover:text-green-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, trend }: { label: string; value: string; trend: number }) => (
  <div className="bg-black/30 border border-green-500/30 rounded-lg p-3">
    <div className="text-green-500/70 text-xs font-mono mb-1">{label}</div>
    <div className="flex items-baseline justify-between">
      <span className="text-xl font-mono text-green-500">{value}</span>
      <div className={`flex items-center text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
  </div>
); 