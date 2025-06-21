import { create } from 'zustand';
import { Song, Album, Artist, SearchResults, SearchType } from '@/types/music';

interface SearchState {
  query: string;
  searchType: SearchType;
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
}

interface SearchActions {
  setQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  search: (query?: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
  addToRecentSearches: (query: string) => void;
  removeFromRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

interface SearchStore extends SearchState, SearchActions {}

const initialState: SearchState = {
  query: '',
  searchType: 'all',
  results: {
    songs: [],
    albums: [],
    artists: [],
  },
  isLoading: false,
  error: null,
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
};

export const useSearchStore = create<SearchStore>()((set, get) => ({
  ...initialState,

  setQuery: (query: string) => {
    set({ query });
  },

  setSearchType: (searchType: SearchType) => {
    set({ searchType });
  },

  search: async (queryOverride?: string) => {
    const state = get();
    const searchQuery = queryOverride || state.query;
    
    if (!searchQuery.trim()) {
      set({ 
        results: { songs: [], albums: [], artists: [] },
        error: null 
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: state.searchType,
      });

      const response = await fetch(`/api/search?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      
      set({ 
        results,
        isLoading: false,
        query: searchQuery 
      });

      // Add to recent searches
      get().addToRecentSearches(searchQuery);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
        results: { songs: [], albums: [], artists: [] },
      });
    }
  },

  clearResults: () => {
    set({ 
      results: { songs: [], albums: [], artists: [] },
      query: '',
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },

  addToRecentSearches: (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    set(state => {
      const filtered = state.recentSearches.filter(s => s !== trimmedQuery);
      const newRecentSearches = [trimmedQuery, ...filtered].slice(0, 10);
      
      // Persist to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      return { recentSearches: newRecentSearches };
    });
  },

  removeFromRecentSearches: (query: string) => {
    set(state => {
      const newRecentSearches = state.recentSearches.filter(s => s !== query);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      return { recentSearches: newRecentSearches };
    });
  },

  clearRecentSearches: () => {
    localStorage.removeItem('recentSearches');
    set({ recentSearches: [] });
  },
}));