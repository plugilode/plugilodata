import React from 'react';
import { Terminal, Mail, Globe, Shield } from 'lucide-react';
import PlugiloLogo from '../plugilo-logo.svg';

export const Footer = () => {
  return (
    <div className="bg-black/30 border-t border-green-500/30 mt-8">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src={PlugiloLogo} 
              alt="Plugilo" 
              className="h-8 w-auto"
            />
            <p className="text-green-500/70 text-sm">
              Advanced business intelligence and company data solutions.
            </p>
            <div className="flex items-center gap-2 text-green-500/50 text-xs">
              <Terminal className="w-4 h-4" />
              <span>TERMINAL v2.0</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-green-500 font-mono text-sm mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              {['Documentation', 'API Access', 'Pricing', 'Support'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-green-500/70 hover:text-green-500 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-green-500 font-mono text-sm mb-4">CONTACT</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contact@plugilo.com" 
                className="flex items-center gap-2 text-green-500/70 hover:text-green-500 text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>contact@plugilo.com</span>
              </a>
              <a 
                href="https://plugilo.com" 
                className="flex items-center gap-2 text-green-500/70 hover:text-green-500 text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>www.plugilo.com</span>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-green-500 font-mono text-sm mb-4">LEGAL</h3>
            <ul className="space-y-2">
              {[
                'Terms of Service',
                'Privacy Policy',
                'Data Protection',
                'Compliance'
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-green-500/70 hover:text-green-500 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-green-500/30">
          <div className="text-green-500/50 text-xs">
            © {new Date().getFullYear()} Plugilo Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-green-500/50 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secure Business Intelligence Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
