// types.ts

// The simplified Artist object as requested
export interface SpotifyArtist {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

// The simplified Album object
export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: { height: number; url: string; width: number }[];
  name: string;
  release_date: string;
  total_tracks: number;
  type: "album";
  uri: string;
}

// The Main Track Object (The core of your request)
export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

// The Pagination Wrapper (Standard Spotify Pattern)
export interface PagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

// The Final Search Response Structure
export interface SearchResponse {
  tracks: PagingObject<SpotifyTrack>;
}