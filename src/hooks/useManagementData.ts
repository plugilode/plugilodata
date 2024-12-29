import { useState, useEffect } from 'react';

interface ManagementData {
  users: {
    activeSessions: number;
    pendingApprovals: number;
    lastActive: string[];
  };
  email: {
    unread: number;
    scheduled: number;
    recentEmails: Array<{
      subject: string;
      from: string;
      time: string;
    }>;
  };
  aiResearch: {
    activeTasks: number;
    completedToday: number;
    currentTasks: Array<{
      name: string;
      progress: number;
      startTime: string;
    }>;
  };
}

export const useManagementData = () => {
  const [data, setData] = useState<ManagementData>({
    users: {
      activeSessions: 24,
      pendingApprovals: 3,
      lastActive: ['john.doe', 'jane.smith', 'bob.wilson']
    },
    email: {
      unread: 7,
      scheduled: 12,
      recentEmails: [
        { subject: 'Database Update', from: 'system@plugilo.com', time: '5m ago' },
        { subject: 'New User Request', from: 'admin@company.com', time: '15m ago' },
        { subject: 'AI Task Complete', from: 'ai@plugilo.com', time: '1h ago' }
      ]
    },
    aiResearch: {
      activeTasks: 4,
      completedToday: 18,
      currentTasks: [
        { name: 'Market Analysis', progress: 75, startTime: '2h ago' },
        { name: 'Competitor Research', progress: 45, startTime: '1h ago' },
        { name: 'Data Enrichment', progress: 90, startTime: '30m ago' }
      ]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/management/stats');
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        }
      } catch (error) {
        console.error('Failed to fetch management data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return data;
}; 