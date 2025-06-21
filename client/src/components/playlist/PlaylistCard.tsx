import React, { useState } from 'react';
import { Playlist } from '@/types/music';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { usePlaylistStore } from '@/lib/stores/usePlaylistStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Play, Music, MoreHorizontal, Edit, Trash2, Users, Lock } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
}

export function PlaylistCard({ playlist, onEdit }: PlaylistCardProps) {
  const { setQueue } = usePlayerStore();
  const { deletePlaylist } = usePlaylistStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePlay = () => {
    if (playlist.songs.length > 0) {
      setQueue(playlist.songs, 0);
    }
  };

  const handleEdit = () => {
    onEdit?.(playlist);
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(playlist.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const formatDuration = () => {
    const totalSeconds = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      <Card className="group hover:bg-accent transition-colors cursor-pointer" onClick={handlePlay}>
        <CardContent className="p-4">
          <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
            {playlist.coverArt ? (
              <img
                src={playlist.coverArt}
                alt={playlist.name}
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
                disabled={playlist.songs.length === 0}
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>

            {/* Privacy Indicator */}
            <div className="absolute top-2 right-2">
              {playlist.isPublic ? (
                <Users className="h-4 w-4 text-white drop-shadow-md" />
              ) : (
                <Lock className="h-4 w-4 text-white drop-shadow-md" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium truncate flex-1 mr-2" title={playlist.name}>
                {playlist.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePlay} disabled={playlist.songs.length === 0}>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {playlist.description && (
              <p className="text-xs text-muted-foreground truncate" title={playlist.description}>
                {playlist.description}
              </p>
            )}
            
            <div className="text-xs text-muted-foreground">
              {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
              {playlist.songs.length > 0 && ` • ${formatDuration()}`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}