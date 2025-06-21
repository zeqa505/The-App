import { create } from 'zustand';
import { Song, PlayerState } from '@/types/music';

interface PlayerActions {
  play: (song?: Song) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
}

interface PlayerStore extends PlayerState, PlayerActions {}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  queue: [],
  currentIndex: -1,
  shuffle: false,
  repeat: 'none',
};

export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  ...initialState,

  play: (song?: Song) => {
    const state = get();
    
    if (song) {
      // Play specific song
      const songIndex = state.queue.findIndex(s => s.id === song.id);
      set({
        currentSong: song,
        isPlaying: true,
        currentIndex: songIndex >= 0 ? songIndex : 0,
        queue: songIndex >= 0 ? state.queue : [song, ...state.queue],
      });
    } else if (state.currentSong) {
      // Resume current song
      set({ isPlaying: true });
    } else if (state.queue.length > 0) {
      // Play first song in queue
      set({
        currentSong: state.queue[0],
        isPlaying: true,
        currentIndex: 0,
      });
    }
  },

  pause: () => {
    set({ isPlaying: false });
  },

  stop: () => {
    set({
      isPlaying: false,
      currentTime: 0,
    });
  },

  next: () => {
    const state = get();
    if (state.queue.length === 0) return;

    let nextIndex: number;

    if (state.shuffle) {
      // Random next song (excluding current)
      const availableIndices = state.queue
        .map((_, index) => index)
        .filter(index => index !== state.currentIndex);
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          return; // End of queue
        }
      }
    }

    set({
      currentSong: state.queue[nextIndex],
      currentIndex: nextIndex,
      currentTime: 0,
    });
  },

  previous: () => {
    const state = get();
    if (state.queue.length === 0) return;

    // If more than 3 seconds into song, restart current song
    if (state.currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      if (state.repeat === 'all') {
        prevIndex = state.queue.length - 1;
      } else {
        return; // Beginning of queue
      }
    }

    set({
      currentSong: state.queue[prevIndex],
      currentIndex: prevIndex,
      currentTime: 0,
    });
  },

  seek: (time: number) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) });
  },

  setVolume: (volume: number) => {
    set({ 
      volume: Math.max(0, Math.min(1, volume)),
      isMuted: false 
    });
  },

  toggleMute: () => {
    set(state => ({ isMuted: !state.isMuted }));
  },

  toggleShuffle: () => {
    set(state => ({ shuffle: !state.shuffle }));
  },

  setRepeat: (mode: 'none' | 'one' | 'all') => {
    set({ repeat: mode });
  },

  setQueue: (songs: Song[], startIndex = 0) => {
    const validIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: songs,
      currentSong: songs[validIndex] || null,
      currentIndex: songs.length > 0 ? validIndex : -1,
      currentTime: 0,
    });
  },

  addToQueue: (song: Song) => {
    set(state => ({
      queue: [...state.queue, song],
    }));
  },

  removeFromQueue: (index: number) => {
    const state = get();
    const newQueue = state.queue.filter((_, i) => i !== index);
    
    let newCurrentIndex = state.currentIndex;
    let newCurrentSong = state.currentSong;

    if (index === state.currentIndex) {
      // Removing current song
      if (newQueue.length === 0) {
        newCurrentSong = null;
        newCurrentIndex = -1;
      } else if (index >= newQueue.length) {
        newCurrentIndex = 0;
        newCurrentSong = newQueue[0];
      } else {
        newCurrentSong = newQueue[index];
      }
    } else if (index < state.currentIndex) {
      newCurrentIndex = state.currentIndex - 1;
    }

    set({
      queue: newQueue,
      currentSong: newCurrentSong,
      currentIndex: newCurrentIndex,
    });
  },

  updateCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  updateDuration: (duration: number) => {
    set({ duration });
  },
}));