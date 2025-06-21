import React from 'react';
import { useSearchStore } from '@/lib/stores/useSearchStore';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { SongCard } from '@/components/music/SongCard';
import { AlbumCard } from '@/components/music/AlbumCard';
import { ArtistCard } from '@/components/music/ArtistCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Album, User, Search } from 'lucide-react';

export function SearchResults() {
  const { results, query, searchType, isLoading, error } = useSearchStore();
  const { setQueue } = usePlayerStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Search Error</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Start Your Search</p>
          <p className="text-muted-foreground">Enter a song, album, or artist name to get started</p>
        </div>
      </div>
    );
  }

  const hasResults = results.songs.length > 0 || results.albums.length > 0 || results.artists.length > 0;

  if (!hasResults) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No Results Found</p>
          <p className="text-muted-foreground">
            No results found for "{query}". Try a different search term.
          </p>
        </div>
      </div>
    );
  }

  const handlePlayAllSongs = () => {
    if (results.songs.length > 0) {
      setQueue(results.songs, 0);
    }
  };

  if (searchType !== 'all') {
    // Show specific type results
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Search Results for "{query}"
          </h2>
          {searchType === 'songs' && results.songs.length > 0 && (
            <Button onClick={handlePlayAllSongs}>
              Play All
            </Button>
          )}
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {searchType === 'songs' && results.songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
            {searchType === 'albums' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
            {searchType === 'artists' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Show all results in tabs
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Search Results for "{query}"
        </h2>
        {results.songs.length > 0 && (
          <Button onClick={handlePlayAllSongs}>
            Play All Songs
          </Button>
        )}
      </div>

      <Tabs defaultValue="songs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="songs" className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            <span>Songs ({results.songs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="albums" className="flex items-center space-x-2">
            <Album className="h-4 w-4" />
            <span>Albums ({results.albums.length})</span>
          </TabsTrigger>
          <TabsTrigger value="artists" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Artists ({results.artists.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {results.songs.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No songs found</p>
                </div>
              ) : (
                results.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="albums">
          <ScrollArea className="h-[600px]">
            {results.albums.length === 0 ? (
              <div className="text-center py-8">
                <Album className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No albums found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="artists">
          <ScrollArea className="h-[600px]">
            {results.artists.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No artists found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}