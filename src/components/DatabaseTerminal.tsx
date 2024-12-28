import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { useAuth } from '../hooks/useAuth';
import { RefreshCw, Users, Mail, Brain, Newspaper, ExternalLink } from 'lucide-react';
import { fetchLatestNews, NewsItem } from '../services/newsService';
import { CompanyFileViewer } from './CompanyFileViewer';

interface Company {
  _id?: string;
  name: string;
  domain: string;
  description?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  source?: string;
  tags?: string[];
  company_size?: string;
  revenue_range?: string;
  industry?: string;
  sub_industry?: string;
  services?: string[];
  products?: string[];
  oem?: {
    categories: string[];
    production_capacity?: string;
    quality_standards?: string[];
    certifications?: string[];
  };
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  key_people?: Array<{
    name: string;
    position: string;
    email?: string;
    phone?: string;
  }>;
  financial_info?: {
    annual_revenue?: string;
    funding_status?: string;
    stock_symbol?: string;
    fiscal_year?: string;
  };
  compliance?: {
    certifications?: string[];
    standards?: string[];
    licenses?: string[];
  };
  market_presence?: {
    regions?: string[];
    countries?: string[];
    languages?: string[];
  };
  business_metrics?: {
    employee_count?: string;
    locations_count?: number;
    years_in_business?: number;
    customer_count?: string;
  };
  status?: string;
  data_quality?: {
    score?: number;
    last_verified?: Date;
    confidence_level?: string;
  };
  audit_trail?: Array<{
    timestamp: Date;
    action: string;
    user: string;
    changes?: any;
  }>;
  created_at?: Date;
  updated_at?: Date;
}

interface Stats {
  activeSessions: number;
  pendingApprovals: number;
  lastActive: number;
  unreadEmails: number;
  scheduledEmails: number;
  activeTasks: number;
  completedToday: number;
  latestNews: NewsItem[];
}

export const DatabaseTerminal: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    activeSessions: 24,
    pendingApprovals: 3,
    lastActive: 3,
    unreadEmails: 7,
    scheduledEmails: 12,
    activeTasks: 4,
    completedToday: 18,
    latestNews: []
  });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      const news = await fetchLatestNews();
      setStats(prev => ({ ...prev, latestNews: news }));
    };
    loadNews();
  }, []);

    return (
      <div className="p-4 text-green-500">
      {/* Top Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          Add Company
        </button>
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          Edit Company
        </button>
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          AI Agent
        </button>
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          Contact Plugilo
        </button>
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          CSV Upload
        </button>
        <button className="px-4 py-2 font-['Orbitron'] text-sm tracking-wider bg-green-500/10 
                        hover:bg-green-500/20 border border-green-500/30 rounded 
                        transition-all duration-200 hover:scale-105
                        hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                        active:scale-95">
          Database Management
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* User Management */}
        <div className="border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-['Orbitron'] tracking-wider">
              <Users className="w-4 h-4" />
              USER MANAGEMENT
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Active Sessions</span>
              <span>{stats.activeSessions}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Approvals</span>
              <span>{stats.pendingApprovals}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Active</span>
              <span>{stats.lastActive}</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 font-['Orbitron'] text-sm tracking-wider 
                          bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded 
                          transition-all duration-200 hover:scale-105
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                          active:scale-95">
            Manage Users
          </button>
        </div>

        {/* Email Center */}
        <div className="border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-['Orbitron'] tracking-wider">
              <Mail className="w-4 h-4" />
              EMAIL CENTER
            </h3>
            <span className="text-xs font-['Orbitron']">Live</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Unread</span>
              <span>{stats.unreadEmails}</span>
            </div>
            <div className="flex justify-between">
              <span>Scheduled</span>
              <span>{stats.scheduledEmails}</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 font-['Orbitron'] text-sm tracking-wider 
                          bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded 
                          transition-all duration-200 hover:scale-105
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                          active:scale-95">
            Open Inbox
          </button>
        </div>

        {/* AI Researcher */}
        <div className="border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-['Orbitron'] tracking-wider">
              <Brain className="w-4 h-4" />
              AI RESEARCHER
            </h3>
            <span className="text-xs font-['Orbitron']">v2.0</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Active Tasks</span>
              <span>{stats.activeTasks}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Today</span>
              <span>{stats.completedToday}</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 font-['Orbitron'] text-sm tracking-wider 
                          bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded 
                          transition-all duration-200 hover:scale-105
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                          active:scale-95">
            New Research
          </button>
        </div>

        {/* News Box */}
        <div className="border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-['Orbitron'] tracking-wider">
              <Newspaper className="w-4 h-4" />
              WORLD NEWS
            </h3>
            <span className="text-xs font-['Orbitron'] animate-pulse">Live Feed</span>
          </div>
          <div className="space-y-3 text-sm max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-green-500/20">
            {stats.latestNews.map((news, index) => (
              <a
                key={index}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:bg-green-500/10 p-2 rounded transition-colors group"
              >
                <ExternalLink className="w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <p className="font-['Orbitron'] text-green-400 mb-1">{news.title}</p>
                  <p className="text-green-500/70 text-xs mb-1 line-clamp-2">{news.description}</p>
                  <div className="flex justify-between text-green-500/70 text-xs">
                    <span>{news.source.name}</span>
                    <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 font-['Orbitron'] text-sm tracking-wider 
                          bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded 
                          transition-all duration-200 hover:scale-105
                          hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                          active:scale-95">
            View All News
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
      <SearchBar 
        onSearch={setSearchResults}
        setIsSearching={setIsSearching}
      />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500/70 hover:text-green-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Results */}
      <div className="mt-4">
        {isSearching ? (
          <div className="text-center text-green-500">
            <p>Searching database...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((company, index) => (
              <div key={index} className="border border-green-500/30 rounded-lg p-4 hover:bg-green-500/5 transition-colors">
                {company.logo_url && (
                  <img 
                    src={company.logo_url} 
                    alt={`${company.name} logo`}
                    className="h-12 mb-2 object-contain"
                  />
                )}
                <h3 
                  onClick={() => setSelectedCompany(company)}
                  className="font-semibold cursor-pointer hover:text-green-400 transition-colors
                           flex items-center gap-2 group"
                >
                  {company.name}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </h3>
                <p className="text-sm text-green-500/70">{company.domain}</p>
                {company.description && (
                  <p className="text-sm mt-2 text-green-500/90 line-clamp-2">{company.description}</p>
                )}
                <div className="mt-2 text-sm">
                  {company.industry && (
                    <span className="inline-block bg-green-500/10 border border-green-500/30 rounded px-2 py-1 mr-2 mb-1">
                      {company.industry}
                    </span>
                  )}
                  {company.country && (
                    <span className="inline-block bg-green-500/10 border border-green-500/30 rounded px-2 py-1 mr-2 mb-1">
                      {company.country}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-green-500/70 mt-8">
            <p>Enter a search query to find companies in the database.</p>
            <p className="text-xs mt-2">PROPRIETARY DATABASE - CONFIDENTIAL AND RESTRICTED ACCESS</p>
          </div>
        )}
      </div>

      {/* Company File Viewer */}
      {selectedCompany && (
        <CompanyFileViewer 
          company={selectedCompany}
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};
