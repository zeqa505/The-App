import React from 'react';
import { Album } from '@/types/music';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Music } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const { setQueue } = usePlayerStore();

  const handlePlay = () => {
    if (album.songs.length > 0) {
      setQueue(album.songs, 0);
    }
  };

  return (
    <Card className="group hover:bg-accent transition-colors cursor-pointer" onClick={handlePlay}>
      <CardContent className="p-4">
        <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
          {album.coverArt ? (
            <img
              src={album.coverArt}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-12 w-12 text-muted-foreground" />
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

        <div className="space-y-1">
          <h3 className="font-medium truncate" title={album.title}>
            {album.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate" title={album.artist}>
            {album.artist}
          </p>
          {album.releaseYear && (
            <p className="text-xs text-muted-foreground">
              {album.releaseYear}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}