import React, { useState } from 'react';
import { Users, Mail, Bot, ArrowRight, Bell, Loader2 } from 'lucide-react';
import { useManagementData } from '../hooks/useManagementData';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="w-full max-w-lg bg-black/90 border border-green-500/30 rounded-lg shadow-xl animate-slideDown">
      <div className="flex items-center justify-between p-4 border-b border-green-500/30">
        <h2 className="text-lg text-green-500 font-mono">{title}</h2>
        <button onClick={onClose} className="text-green-500/70 hover:text-green-500">×</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export const ManagementWidgets = () => {
  const data = useManagementData();
  const [activeModal, setActiveModal] = useState<'users' | 'email' | 'ai' | null>(null);

  return (
    <div className="grid grid-cols-3 gap-6 h-[500px]">
      {/* User Management Widget */}
      <div className="bg-black/30 border border-green-500/30 rounded-lg p-4 h-[280px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <h2 className="text-green-500 font-mono text-sm">USER MANAGEMENT</h2>
          </div>
          <Bell className="w-4 h-4 text-green-500/50" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Active Sessions</span>
              <span className="text-green-500">{data.users.activeSessions}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Pending Approvals</span>
              <span className="text-green-500">{data.users.pendingApprovals}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Last Active</span>
              <span className="text-green-500">{data.users.lastActive.length}</span>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg transition-colors text-sm">
            <span>Manage Users</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Management Widget */}
      <div className="bg-black/30 border border-green-500/30 rounded-lg p-4 h-[280px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-500" />
            <h2 className="text-green-500 font-mono text-sm">EMAIL CENTER</h2>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-500/50 text-xs">Live</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Unread</span>
              <span className="text-green-500">{data.email.unread}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Scheduled</span>
              <span className="text-green-500">{data.email.scheduled}</span>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg transition-colors text-sm">
            <span>Open Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Research Bot Widget */}
      <div className="bg-black/30 border border-green-500/30 rounded-lg p-4 h-[280px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-green-500" />
            <h2 className="text-green-500 font-mono text-sm">AI RESEARCHER</h2>
          </div>
          <div className="text-xs text-green-500/50">v2.0</div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Active Tasks</span>
              <span className="text-green-500">{data.aiResearch.activeTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500/70">Completed Today</span>
              <span className="text-green-500">{data.aiResearch.completedToday}</span>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-3 py-1.5 rounded-lg transition-colors text-sm">
            <span>New Research</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 