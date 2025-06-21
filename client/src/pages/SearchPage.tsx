import React from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';

export function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Search Music</h1>
        <p className="text-muted-foreground">
          Find your favorite songs, albums, and artists
        </p>
      </div>
      
      <SearchBar />
      <SearchResults />
    </div>
  );
}