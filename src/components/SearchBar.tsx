import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Filter, X, Globe, Briefcase, MapPin } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { AdvancedSearchModal } from './AdvancedSearchModal';

interface SearchBarProps {
  onSearch: (results: any[]) => void;
  setIsSearching: (isSearching: boolean) => void;
}

interface SearchFilters {
  industry?: string;
  country?: string;
  employeeCount?: string;
  revenue?: string;
}

interface Suggestion {
  name: string;
  domain: string;
  industry?: string;
  location?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setIsSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  // Industry options
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Manufacturing',
    'Retail', 'Energy', 'Education', 'Entertainment'
  ];

  // Employee count ranges
  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500',
    '501-1000', '1001-5000', '5000+'
  ];

  // Revenue ranges
  const revenueRanges = [
    '<1M', '1M-10M', '10M-50M', '50M-100M',
    '100M-500M', '500M-1B', '>1B'
  ];

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/companies/suggestions`, {
        params: { query }
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() && Object.keys(filters).length === 0) {
      onSearch([]);
      return;
    }

    try {
      setIsSearching(true);
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${API_BASE_URL}/companies/search`, {
        params: {
          query: searchTerm,
          ...filters
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        onSearch(response.data.data);
      } else {
        console.error('Search failed:', response.data.error);
        onSearch([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      onSearch([]);
    } finally {
      setIsSearching(false);
      setShowSuggestions(false);
    }
  }, [searchTerm, filters, onSearch, setIsSearching]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm, handleSearch]);

  const handleSearchClick = () => {
    handleSearch();
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="flex gap-4">
        {/* Main Search Input with Search Button */}
        <div className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search database..."
              className="w-full bg-black/30 border border-green-500/30 rounded px-4 py-3 pl-10
                       text-green-500 placeholder-green-500/30
                       focus:outline-none focus:border-green-500
                       transition-colors duration-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500/50" />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="px-6 py-2 bg-green-500/10 hover:bg-green-500/20
                     border border-green-500/30 rounded
                     text-green-400 font-['Orbitron'] text-sm tracking-wider
                     transition-all duration-200 hover:scale-105
                     hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                     active:scale-95 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Advanced Search Button */}
        <button
          onClick={() => setShowAdvancedModal(true)}
          className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20
                   border border-green-500/30 rounded
                   text-green-400 font-['Orbitron'] text-sm tracking-wider
                   transition-all duration-200 hover:scale-105
                   hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]
                   active:scale-95"
        >
          Advanced Search
        </button>
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-black/90 border border-green-500/30 rounded-lg
                      backdrop-blur-sm shadow-lg max-h-60 overflow-auto
                      scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-green-500/20">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchTerm(suggestion.name);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-green-500/10
                       transition-colors duration-200"
            >
              <div className="font-['Orbitron'] text-green-400 text-sm">
                {suggestion.name}
              </div>
              <div className="text-green-500/70 text-xs flex items-center gap-4">
                {suggestion.domain && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {suggestion.domain}
                  </span>
                )}
                {suggestion.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {suggestion.industry}
                  </span>
                )}
                {suggestion.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {suggestion.location}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        onSearch={(filters) => {
          console.log('Advanced search filters:', filters);
        }}
      />
    </div>
  );
};
