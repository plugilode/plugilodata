import React from 'react';
import { Terminal, LogOut } from 'lucide-react';
import PlugiloLogo from '../plugilo-logo.svg';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 border-b border-green-500/30">
      <div className="w-full max-w-[320px] text-center mx-auto mb-4">
        <img 
          src={PlugiloLogo} 
          alt="Plugilo" 
          className="h-10 w-auto mx-auto"
        />
      </div>

      <div className="flex items-center justify-between w-full border-t border-green-500/30 pt-4">
        <div className="flex items-center gap-3 text-green-500/80">
          <Terminal className="w-5 h-5" />
          <span className="tracking-wider text-sm">TERMINAL v2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-green-500/70 tracking-wide">
            USER: {user.name} | ROLE: {user.role}
          </div>
          <button
            onClick={onLogout}
            className="text-red-500/70 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
