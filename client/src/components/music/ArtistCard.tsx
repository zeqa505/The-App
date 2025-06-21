import React from 'react';
import { Artist } from '@/types/music';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, User } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { setQueue } = usePlayerStore();

  const handlePlay = () => {
    if (artist.songs.length > 0) {
      setQueue(artist.songs, 0);
    }
  };

  return (
    <Card className="group hover:bg-accent transition-colors cursor-pointer" onClick={handlePlay}>
      <CardContent className="p-4">
        <div className="aspect-square relative mb-3 rounded-full overflow-hidden bg-muted">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full w-12 h-12 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-medium truncate" title={artist.name}>
            {artist.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Artist
          </p>
        </div>
      </CardContent>
    </Card>
  );
}