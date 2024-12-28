import React, { useEffect, useState } from 'react';
import { DatabaseTerminal } from './DatabaseTerminal';
import { 
  LogOut, 
  Users, 
  Building2, 
  Bot,
  Bookmark, 
  UserCog, 
  Database, 
  Briefcase
} from 'lucide-react';
import PlugiloLogo from '../plugilo-logo.svg';
import { MatrixBackground } from './MatrixBackground';

interface TerminalProps {
  username: string;
}

export const Terminal: React.FC<TerminalProps> = ({ username }) => {
  const [mounted, setMounted] = useState(false);

  const menuItems = [
    { icon: Briefcase, label: 'CRM', color: 'rgb(34, 197, 94)' },
    { icon: Building2, label: 'OFFICE', color: 'rgb(34, 197, 94)' },
    { icon: Bot, label: 'AI TOOLS', color: 'rgb(34, 197, 94)' },
    { icon: Bookmark, label: 'BOOKMARK SYSTEM', color: 'rgb(34, 197, 94)' },
    { icon: Users, label: 'HR', color: 'rgb(34, 197, 94)' },
    { icon: UserCog, label: 'USER ADMIN', color: 'rgb(34, 197, 94)' },
    { icon: Database, label: 'ADMIN DATABASE', color: 'rgb(34, 197, 94)' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-[95vw] h-[95vh] font-mono perspective-1000">
      <MatrixBackground />
      
      {/* 3D Container with startup animation */}
      <div className={`
        relative w-full h-full 
        transform-gpu transition-all duration-1000
        ${mounted ? 'scale-100 rotate-x-0 translate-z-0 opacity-100' : 'scale-95 rotate-x-12 -translate-z-96 opacity-0'}
      `}>
        {/* Glass Container with hover effect */}
        <div className="relative w-full h-full group
                      backdrop-blur-sm bg-black/25 rounded-lg 
                      border border-green-500/20 shadow-2xl overflow-hidden
                      transition-transform duration-300 ease-out
                      hover:scale-[1.002] hover:shadow-green-500/10
                      before:absolute before:inset-0 
                      before:bg-gradient-to-b before:from-green-500/5 before:to-transparent 
                      before:pointer-events-none">
          
          {/* Terminal Header with floating effect */}
          <div className="relative flex items-center justify-between p-4 
                        border-b border-green-500/30 bg-black/15
                        animate-float">
            <div className="flex items-center gap-4">
              <img 
                src={PlugiloLogo} 
                alt="Plugilo Logo" 
                className="h-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]
                         animate-pulse-slow" 
              />
              <span className="font-['Orbitron'] text-sm font-bold text-green-400 tracking-[0.2em] 
                           text-glow animate-pulse-slow transform-gpu
                           hover:scale-105 transition-transform duration-300">
                MASTER DATABASE v2.1
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-['Orbitron'] text-sm text-green-400/90 tracking-wider">
                USER: {username} | ROLE: USER
              </span>
              <button className="text-green-400/70 hover:text-green-400 
                             transition-all duration-300
                             hover:scale-110 hover:rotate-12
                             hover:shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Terminal Content with scroll effect */}
          <div className="h-[calc(95vh-4rem-3rem)] overflow-auto
                       scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-green-500/20
                       hover:scrollbar-thumb-green-500/30
                       [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <DatabaseTerminal />
          </div>

          {/* Footer Menu */}
          <div className="absolute bottom-0 left-0 right-0 h-12 
                       bg-black/30 border-t border-green-500/30
                       backdrop-blur-md">
            <div className="flex items-center justify-between px-4 h-full">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="group flex items-center gap-2 px-3 py-1 
                           text-green-400/70 hover:text-green-400
                           transition-all duration-300 relative"
                >
                  <item.icon className="w-4 h-4 transition-transform duration-300
                                    group-hover:scale-110" />
                  <span className="text-xs font-['Orbitron'] tracking-wider
                               transition-all duration-300
                               group-hover:text-glow">
                    {item.label}
                  </span>
                  {/* Hover effect */}
                  <div className="absolute -bottom-[1px] left-0 w-full h-[2px]
                               bg-gradient-to-r from-transparent via-green-500/50 to-transparent
                               scale-x-0 group-hover:scale-x-100
                               transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Glowing edges */}
          <div className="absolute inset-0 pointer-events-none
                       bg-gradient-to-b from-green-500/5 via-transparent to-green-500/5
                       animate-pulse-slow opacity-50"></div>
          <div className="absolute inset-0 pointer-events-none
                       bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5
                       animate-pulse-slow opacity-50"></div>
        </div>
      </div>
    </div>
  );
}; 