import { create } from 'zustand';
import { Playlist, Song } from '@/types/music';

interface PlaylistState {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
}

interface PlaylistActions {
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string, description?: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  updatePlaylist: (playlistId: string, updates: Partial<Pick<Playlist, 'name' | 'description' | 'isPublic'>>) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  reorderPlaylistSongs: (playlistId: string, fromIndex: number, toIndex: number) => Promise<void>;
  clearError: () => void;
}

interface PlaylistStore extends PlaylistState, PlaylistActions {}

const initialState: PlaylistState = {
  playlists: [],
  isLoading: false,
  error: null,
};

export const usePlaylistStore = create<PlaylistStore>()((set, get) => ({
  ...initialState,

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/playlists', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const playlists = await response.json();
      set({ playlists, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch playlists',
        isLoading: false,
      });
    }
  },

  createPlaylist: async (name: string, description?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create playlist');
      }

      const newPlaylist = await response.json();
      set(state => ({
        playlists: [...state.playlists, newPlaylist],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create playlist',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePlaylist: async (playlistId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      set(state => ({
        playlists: state.playlists.filter(p => p.id !== playlistId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete playlist',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePlaylist: async (playlistId: string, updates: Partial<Pick<Playlist, 'name' | 'description' | 'isPublic'>>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update playlist');
      }

      const updatedPlaylist = await response.json();
      set(state => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId ? updatedPlaylist : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update playlist',
        isLoading: false,
      });
      throw error;
    }
  },

  addSongToPlaylist: async (playlistId: string, song: Song) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ songId: song.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add song to playlist');
      }

      set(state => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId 
            ? { ...p, songs: [...p.songs, song], updatedAt: new Date() }
            : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add song to playlist',
        isLoading: false,
      });
      throw error;
    }
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove song from playlist');
      }

      set(state => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId 
            ? { ...p, songs: p.songs.filter(s => s.id !== songId), updatedAt: new Date() }
            : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove song from playlist',
        isLoading: false,
      });
      throw error;
    }
  },

  reorderPlaylistSongs: async (playlistId: string, fromIndex: number, toIndex: number) => {
    const state = get();
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Optimistically update the UI
    const newSongs = [...playlist.songs];
    const [movedSong] = newSongs.splice(fromIndex, 1);
    newSongs.splice(toIndex, 0, movedSong);

    set(state => ({
      playlists: state.playlists.map(p => 
        p.id === playlistId 
          ? { ...p, songs: newSongs, updatedAt: new Date() }
          : p
      ),
    }));

    try {
      const response = await fetch(`/api/playlists/${playlistId}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fromIndex, toIndex }),
      });

      if (!response.ok) {
        // Revert on error
        set(state => ({
          playlists: state.playlists.map(p => 
            p.id === playlistId ? playlist : p
          ),
        }));
        throw new Error('Failed to reorder songs');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder songs',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));