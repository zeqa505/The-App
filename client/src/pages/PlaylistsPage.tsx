import React, { useState, useEffect } from 'react';
import { usePlaylistStore } from '@/lib/stores/usePlaylistStore';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { CreatePlaylistDialog } from '@/components/playlist/CreatePlaylistDialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Music } from 'lucide-react';
import { Playlist } from '@/types/music';

export function PlaylistsPage() {
  const { playlists, fetchPlaylists, isLoading } = usePlaylistStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreatePlaylist = () => {
    setShowCreateDialog(true);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    // TODO: Implement edit functionality
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading playlists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Playlists</h1>
          <p className="text-muted-foreground">
            Create and manage your music collections
          </p>
        </div>
        <Button onClick={handleCreatePlaylist}>
          <Plus className="mr-2 h-4 w-4" />
          New Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No Playlists Yet</p>
            <p className="text-muted-foreground mb-4">
              Create your first playlist to start organizing your music
            </p>
            <Button onClick={handleCreatePlaylist}>
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onEdit={handleEditPlaylist}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <CreatePlaylistDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}