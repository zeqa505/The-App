export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  url: string;
  coverArt?: string;
  genre?: string;
  releaseYear?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  releaseYear?: number;
  genre?: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  albums: Album[];
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  coverArt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  playlists: Playlist[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}

export type SearchType = 'all' | 'songs' | 'albums' | 'artists';