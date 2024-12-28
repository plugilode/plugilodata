import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import PlugiloLogo from '../plugilo-logo.svg';
import { Terminal } from './Terminal';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with username:', username);
      const success = await onLogin(username, password);
      console.log('Login success:', success);
      if (success) {
        console.log('Setting showTerminal to true');
        setShowTerminal(true);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pulseAnimation = `
    @keyframes heartbeat {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;

  if (showTerminal && username) {
    console.log('Rendering Terminal component with username:', username);
    return <Terminal username={username} />;
  }

  return (
    <div className="w-[95vw] h-[95vh] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[400px] mb-12 text-center mx-auto">
        <img 
          src={PlugiloLogo}
          alt="Plugilo Logo"
          className="h-16 w-auto mb-3 mx-auto"
          style={{
            filter: `
              drop-shadow(0 0 10px rgba(34, 197, 94, 0.7))
              drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))
            `,
            animation: 'heartbeat 2s ease-in-out infinite'
          }}
        />
        <style>
          {pulseAnimation}
        </style>
        <div 
          className="text-green-400 text-3xl tracking-[0.15em] font-bold"
          style={{
            textShadow: `
              0 0 7px rgba(34, 197, 94, 0.6),
              0 0 10px rgba(34, 197, 94, 0.4),
              0 0 21px rgba(34, 197, 94, 0.3),
              0 0 42px rgba(34, 197, 94, 0.2)
            `
          }}
        >
          MASTER DATABASE
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-[50vw] bg-black/90 border border-green-500/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl text-green-500 mb-2">DATABASE ACCESS</h2>
          <p className="text-green-500/70 text-sm">Enter credentials to proceed</p>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-3 text-green-500 placeholder-green-500/30 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-3 text-green-500 placeholder-green-500/30 focus:outline-none focus:border-green-500"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded py-3 transition-colors text-green-500"
          >
            <Lock className="w-4 h-4" />
            {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </div>
      </form>
    </div>
  );
};
