import { useState, useEffect } from 'react';

interface DatabaseStats {
  companies: {
    total: number;
    lastUpdated: Date;
  };
  users: {
    active: number;
    peakToday: number;
  };
  performance: {
    avgResponse: number;
    uptime: number;
  };
  aiAgents: {
    active: number;
    queued: number;
    processing: number;
  };
}

export const useStats = () => {
  const [stats, setStats] = useState<DatabaseStats>({
    companies: { total: 0, lastUpdated: new Date() },
    users: { active: 0, peakToday: 0 },
    performance: { avgResponse: 0, uptime: 99.99 },
    aiAgents: { active: 0, queued: 0, processing: 0 }
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return stats;
}; 