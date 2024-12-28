import { CompanyRecord } from '../types';

interface SearchFilters {
  industry?: string;
  country?: string;
  revenueMin?: number;
  revenueMax?: number;
  employeeCount?: number;
  foundedAfter?: string;
  foundedBefore?: string;
  tags?: string[];
  booleanOperator?: 'AND' | 'OR';
}

interface AdvancedSearchParams extends SearchFilters {
  query?: string;
  sortBy?: 'relevance' | 'name' | 'revenue' | 'employees' | 'founded';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const searchFunctions = {
  // Basic search with query string
  basicSearch: async (query: string): Promise<CompanyRecord[]> => {
    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    } catch (error) {
      console.error('Basic search error:', error);
      return [];
    }
  },

  // Advanced search with filters
  advancedSearch: async (params: AdvancedSearchParams): Promise<CompanyRecord[]> => {
    try {
      const searchParams = new URLSearchParams();
      
      // Add all parameters to search query
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/companies/advanced-search?${searchParams}`);
      if (!response.ok) throw new Error('Advanced search failed');
      return response.json();
    } catch (error) {
      console.error('Advanced search error:', error);
      return [];
    }
  },

  // Fuzzy search for partial matches
  fuzzySearch: async (query: string): Promise<CompanyRecord[]> => {
    try {
      const response = await fetch(`/api/companies/fuzzy-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Fuzzy search failed');
      return response.json();
    } catch (error) {
      console.error('Fuzzy search error:', error);
      return [];
    }
  },

  // Search by multiple criteria
  multiCriteriaSearch: async (filters: SearchFilters): Promise<CompanyRecord[]> => {
    try {
      const response = await fetch('/api/companies/multi-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      if (!response.ok) throw new Error('Multi-criteria search failed');
      return response.json();
    } catch (error) {
      console.error('Multi-criteria search error:', error);
      return [];
    }
  },

  // Semantic search using embeddings
  semanticSearch: async (query: string): Promise<CompanyRecord[]> => {
    try {
      const response = await fetch(`/api/companies/semantic-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Semantic search failed');
      return response.json();
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  },

  // Faceted search with aggregations
  facetedSearch: async (query: string, facets: string[]): Promise<{
    results: CompanyRecord[];
    aggregations: { [key: string]: { [value: string]: number } };
  }> => {
    try {
      const facetParams = facets.map(f => `facet=${encodeURIComponent(f)}`).join('&');
      const response = await fetch(
        `/api/companies/faceted-search?q=${encodeURIComponent(query)}&${facetParams}`
      );
      if (!response.ok) throw new Error('Faceted search failed');
      return response.json();
    } catch (error) {
      console.error('Faceted search error:', error);
      return { results: [], aggregations: {} };
    }
  },

  // Autocomplete suggestions
  getAutocompleteSuggestions: async (query: string): Promise<string[]> => {
    try {
      const response = await fetch(`/api/companies/autocomplete?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Autocomplete failed');
      return response.json();
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  },

  // Recent searches history
  getRecentSearches: (): string[] => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  },

  // Save recent search
  saveRecentSearch: (query: string) => {
    try {
      const recent = searchFunctions.getRecentSearches();
      const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }
}; 