import React, { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '@/lib/stores/useSearchStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { SearchType } from '@/types/music';

const searchTypeLabels: Record<SearchType, string> = {
  all: 'All',
  songs: 'Songs',
  albums: 'Albums',
  artists: 'Artists',
};

export function SearchBar() {
  const {
    query,
    searchType,
    isLoading,
    recentSearches,
    setQuery,
    setSearchType,
    search,
    clearResults,
    addToRecentSearches,
    removeFromRecentSearches,
  } = useSearchStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (localQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        setQuery(localQuery);
        search(localQuery);
      }, 300);
    } else {
      setQuery('');
      clearResults();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localQuery, setQuery, search, clearResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setQuery(localQuery);
      search(localQuery);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setLocalQuery(searchQuery);
    setQuery(searchQuery);
    search(searchQuery);
    setShowSuggestions(false);
  };

  const handleRemoveRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromRecentSearches(searchQuery);
  };

  const handleClearInput = () => {
    setLocalQuery('');
    setQuery('');
    clearResults();
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (recentSearches.length > 0 && !localQuery.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Type Filters */}
      <div className="flex space-x-2 mb-4 justify-center">
        {(Object.keys(searchTypeLabels) as SearchType[]).map((type) => (
          <Badge
            key={type}
            variant={searchType === type ? 'default' : 'secondary'}
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => setSearchType(type)}
          >
            {searchTypeLabels[type]}
          </Badge>
        ))}
      </div>

      {/* Search Input */}
      <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
        <PopoverTrigger asChild>
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={`Search ${searchTypeLabels[searchType].toLowerCase()}...`}
                value={localQuery}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="pl-10 pr-20 h-12 text-base"
                disabled={isLoading}
              />
              {localQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearInput}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                disabled={isLoading || !localQuery.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </PopoverTrigger>

        {/* Recent Searches Suggestions */}
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {recentSearches.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm">
                  No recent searches
                </CommandEmpty>
              ) : (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((searchQuery) => (
                    <CommandItem
                      key={searchQuery}
                      value={searchQuery}
                      onSelect={() => handleRecentSearchClick(searchQuery)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{searchQuery}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleRemoveRecentSearch(searchQuery, e)}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}