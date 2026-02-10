// db.ts
import { SpotifyTrack } from "./types";

const ADJECTIVES = ["Dark", "Bright", "Midnight", "Summer", "Neon", "Broken", "Happy", "Silent", "Loud", "Electric"];
const NOUNS = ["Memories", "Dreams", "Love", "Echoes", "Vibes", "Thoughts", "Winds", "Waves", "Sky", "Road"];
const ARTISTS = ["The Weeknd", "Taylor Swift", "Drake", "Daft Punk", "Adele", "Kendrick Lamar", "Tame Impala", "Arctic Monkeys", "Post Malone", "Billie Eilish"];

// Helper to generate a random string ID (mimics Spotify IDs)
const generateId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generator function to create 100 deterministic dummy tracks
export const getDummyTracks = (): SpotifyTrack[] => {
  const tracks: SpotifyTrack[] = [];

  for (let i = 0; i < 100; i++) {
    const artistName = ARTISTS[i % ARTISTS.length];
    const trackName = `${ADJECTIVES[i % ADJECTIVES.length]} ${NOUNS[i % NOUNS.length]}`;
    const trackId = generateId(22);

    tracks.push({
      album: {
        album_type: "album",
        artists: [{
          external_urls: { spotify: `https://open.spotify.com/artist/dummy` },
          href: `https://api.spotify.com/v1/artists/dummy`,
          id: `artist_${i}`,
          name: artistName,
          type: "artist",
          uri: `spotify:artist:dummy`
        }],
        external_urls: { spotify: `https://open.spotify.com/album/dummy` },
        href: `https://api.spotify.com/v1/albums/dummy`,
        id: `album_${i}`,
        images: [{ height: 640, url: "https://placehold.co/640x640", width: 640 }],
        name: `${trackName} The Album`,
        release_date: "2024-01-01",
        total_tracks: 10,
        type: "album",
        uri: `spotify:album:dummy`
      },
      artists: [{
        external_urls: { spotify: `https://open.spotify.com/artist/dummy` },
        href: `https://api.spotify.com/v1/artists/dummy`,
        id: `artist_${i}`,
        name: artistName,
        type: "artist",
        uri: `spotify:artist:dummy`
      }],
      available_markets: ["US", "SE", "GB"],
      disc_number: 1,
      duration_ms: 180000 + (i * 1000), // Varying duration
      explicit: i % 3 === 0, // Every 3rd song is explicit
      external_ids: { isrc: `USXYZ${i.toString().padStart(7, '0')}` },
      external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
      href: `https://api.spotify.com/v1/tracks/${trackId}`,
      id: trackId,
      name: trackName,
      popularity: Math.floor(Math.random() * 100),
      preview_url: null,
      track_number: i + 1,
      type: "track",
      uri: `spotify:track:${trackId}`,
      is_local: false
    });
  }
  return tracks;
};