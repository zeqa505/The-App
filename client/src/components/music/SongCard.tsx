import React, { useState } from 'react';
import { Song } from '@/types/music';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { usePlaylistStore } from '@/lib/stores/usePlaylistStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, MoreHorizontal, Plus, Music } from 'lucide-react';

interface SongCardProps {
  song: Song;
  showArtist?: boolean;
  showAlbum?: boolean;
  index?: number;
}

export function SongCard({ song, showArtist = true, showAlbum = true, index }: SongCardProps) {
  const { currentSong, isPlaying, play, pause, addToQueue } = usePlayerStore();
  const { playlists, addSongToPlaylist } = usePlaylistStore();
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handlePlayPause = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      play(song);
    }
  };

  const handleAddToQueue = () => {
    addToQueue(song);
  };

  const handleAddToPlaylist = async () => {
    if (selectedPlaylistId) {
      try {
        await addSongToPlaylist(selectedPlaylistId, song);
        setShowPlaylistDialog(false);
        setSelectedPlaylistId('');
      } catch (error) {
        console.error('Failed to add song to playlist:', error);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-3 hover:bg-accent transition-colors ${isCurrentSong ? 'bg-accent' : ''}`}>
      <div className="flex items-center space-x-3">
        {/* Track Number or Play Button */}
        <div className="w-8 flex items-center justify-center">
          {index !== undefined && !isCurrentSong ? (
            <span className="text-sm text-muted-foreground">{index + 1}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="h-8 w-8 p-0"
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Cover Art */}
        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
          {song.coverArt ? (
            <img
              src={song.coverArt}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${isCurrentSong ? 'text-primary' : ''}`}>
            {song.title}
          </h4>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {showArtist && <span className="truncate">{song.artist}</span>}
            {showArtist && showAlbum && <span>•</span>}
            {showAlbum && <span className="truncate">{song.album}</span>}
          </div>
        </div>

        {/* Duration */}
        <div className="text-sm text-muted-foreground">
          {formatDuration(song.duration)}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handlePlayPause}>
              {isCurrentlyPlaying ? 'Pause' : 'Play'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddToQueue}>
              Add to Queue
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Dialog open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Playlist
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add "{song.title}" to a playlist
                  </p>
                  <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a playlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {playlists.map((playlist) => (
                        <SelectItem key={playlist.id} value={playlist.id}>
                          {playlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPlaylistDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddToPlaylist}
                      disabled={!selectedPlaylistId}
                    >
                      Add to Playlist
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}