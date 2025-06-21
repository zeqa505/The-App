// Sample music data for the streaming app
import { Song, Album, Artist } from '@/types/music';

export const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    url: '/sounds/background.mp3', // Using existing audio file as placeholder
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png',
    genre: 'Rock',
    releaseYear: 1975,
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 391,
    url: '/sounds/hit.mp3',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg',
    genre: 'Rock',
    releaseYear: 1976,
  },
  {
    id: '3',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 482,
    url: '/sounds/success.mp3',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg',
    genre: 'Rock',
    releaseYear: 1971,
  },
  {
    id: '4',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: 183,
    url: '/sounds/background.mp3',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/1/1d/John_Lennon_-_Imagine_John_Lennon.jpg',
    genre: 'Pop',
    releaseYear: 1971,
  },
  {
    id: '5',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: 356,
    url: '/sounds/hit.mp3',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/5/50/Appetite_for_Destruction.jpg',
    genre: 'Rock',
    releaseYear: 1987,
  },
  {
    id: '6',
    title: 'Yesterday',
    artist: 'The Beatles',
    album: 'Help!',
    duration: 125,
    url: '/sounds/success.mp3',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/1/15/Help%21_%28album%29.jpg',
    genre: 'Pop',
    releaseYear: 1965,
  },
];

export const sampleAlbums: Album[] = [
  {
    id: '1',
    title: 'A Night at the Opera',
    artist: 'Queen',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png',
    releaseYear: 1975,
    genre: 'Rock',
    songs: [sampleSongs[0]],
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg',
    releaseYear: 1976,
    genre: 'Rock',
    songs: [sampleSongs[1]],
  },
  {
    id: '3',
    title: 'Led Zeppelin IV',
    artist: 'Led Zeppelin',
    coverArt: 'https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg',
    releaseYear: 1971,
    genre: 'Rock',
    songs: [sampleSongs[2]],
  },
];

export const sampleArtists: Artist[] = [
  {
    id: '1',
    name: 'Queen',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Queen_-_Rock_in_Rio_2001-edit1.jpg',
    bio: 'British rock band formed in London in 1970.',
    albums: [sampleAlbums[0]],
    songs: [sampleSongs[0]],
  },
  {
    id: '2',
    name: 'Eagles',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Eagles_band.jpg/800px-Eagles_band.jpg',
    bio: 'American rock band formed in Los Angeles in 1971.',
    albums: [sampleAlbums[1]],
    songs: [sampleSongs[1]],
  },
  {
    id: '3',
    name: 'Led Zeppelin',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Led_Zeppelin_-_1975.jpg/800px-Led_Zeppelin_-_1975.jpg',
    bio: 'English rock band formed in London in 1968.',
    albums: [sampleAlbums[2]],
    songs: [sampleSongs[2]],
  },
  {
    id: '4',
    name: 'John Lennon',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/John_Lennon_1969_%28cropped%29.jpg/800px-John_Lennon_1969_%28cropped%29.jpg',
    bio: 'English singer, songwriter, and peace activist who gained worldwide fame as the founder, co-songwriter, co-lead vocalist and rhythm guitarist of the Beatles.',
    albums: [],
    songs: [sampleSongs[3]],
  },
];

export function searchMusic(query: string, type: 'all' | 'songs' | 'albums' | 'artists' = 'all') {
  const normalizedQuery = query.toLowerCase();
  
  const matchingSongs = sampleSongs.filter(song =>
    song.title.toLowerCase().includes(normalizedQuery) ||
    song.artist.toLowerCase().includes(normalizedQuery) ||
    song.album.toLowerCase().includes(normalizedQuery)
  );

  const matchingAlbums = sampleAlbums.filter(album =>
    album.title.toLowerCase().includes(normalizedQuery) ||
    album.artist.toLowerCase().includes(normalizedQuery)
  );

  const matchingArtists = sampleArtists.filter(artist =>
    artist.name.toLowerCase().includes(normalizedQuery)
  );

  switch (type) {
    case 'songs':
      return { songs: matchingSongs, albums: [], artists: [] };
    case 'albums':
      return { songs: [], albums: matchingAlbums, artists: [] };
    case 'artists':
      return { songs: [], albums: [], artists: matchingArtists };
    default:
      return {
        songs: matchingSongs,
        albums: matchingAlbums,
        artists: matchingArtists,
      };
  }
}