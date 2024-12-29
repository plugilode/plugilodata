import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Shield } from 'lucide-react';

export const SearchDisclaimer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-black/30 border border-green-500/30 rounded-lg mb-6 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-green-500/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-green-500/70 text-xs font-mono">
            PROPRIETARY DATABASE – CONFIDENTIAL AND RESTRICTED ACCESS
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-green-500/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-green-500/50" />
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-4 pt-2 border-t border-green-500/30">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-green-500/70 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="text-green-500/70 text-xs leading-relaxed">
                  This database and its contents are the exclusive property of Plugilo Inc. All information contained herein is protected by intellectual property laws and confidentiality agreements. By accessing this database, you acknowledge and agree to the following terms:
                </p>
                <ul className="text-green-500/70 text-xs space-y-1 list-disc list-inside ml-2">
                  <li>Information is provided for authorized business purposes only</li>
                  <li>Unauthorized access or distribution is strictly prohibited</li>
                  <li>All data usage must comply with our terms of service</li>
                  <li>Violations may result in legal action and account termination</li>
                </ul>
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-green-500/20">
                  <span className="text-green-500/50 text-xs">
                    © {new Date().getFullYear()} Plugilo Inc.
                  </span>
                  <a 
                    href="/terms"
                    className="text-green-500/70 hover:text-green-500 text-xs transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Full Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 