// server.ts
import express, { Request, Response } from 'express'; // Standard import now works!
import cors from 'cors';
import { getDummyTracks } from './db';
import { SearchResponse, SpotifyTrack } from './types';

const app = express(); // No more "express is not a function" error
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory "Database"
const ALL_TRACKS = getDummyTracks();

// --- Helper Functions ---

const filterTracks = (query: string): SpotifyTrack[] => {
  if (!query) return [];
  const lowerQ = query.toLowerCase();
  
  return ALL_TRACKS.filter(track => 
    track.name.toLowerCase().includes(lowerQ) || 
    track.artists.some(a => a.name.toLowerCase().includes(lowerQ)) ||
    track.album.name.toLowerCase().includes(lowerQ)
  );
};

const buildPageUrl = (baseUrl: string, query: string, type: string, limit: number, offset: number): string => {
  return `${baseUrl}?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}`;
};

// --- Routes ---

app.get('/search', async (req: Request, res: Response) => {
  const minDelay = 500;
  const maxDelay = 1000;
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

  console.log(`[Simulation] 🐢 Spinning the vinyl... delaying response by ${delay}ms`);
  await new Promise(resolve => setTimeout(resolve, delay));

  const q = req.query.q as string;
  const type = req.query.type as string || 'track';
  
  let limit = parseInt(req.query.limit as string) || 20;
  if (limit < 0) limit = 20;
  if (limit > 50) limit = 50;

  let offset = parseInt(req.query.offset as string) || 0;
  if (offset < 0) offset = 0;

  if (!q) {
    // Note: We use 'return' here to stop execution, but express doesn't require returning the res object
    res.status(400).json({ error: { status: 400, message: "No search query provided." } });
    return; 
  }

  const filteredMatches = filterTracks(q);
  const total = filteredMatches.length;
  const paginatedItems = filteredMatches.slice(offset, offset + limit);

  const baseUrl = "http://localhost:3000/search";
  
  const next = (offset + limit < total) 
    ? buildPageUrl(baseUrl, q, type, limit, offset + limit) 
    : null;

  const previous = (offset - limit >= 0) 
    ? buildPageUrl(baseUrl, q, type, limit, offset - limit) 
    : (offset > 0 && offset < limit) 
      ? buildPageUrl(baseUrl, q, type, limit, 0)
      : null;

  const response: SearchResponse = {
    tracks: {
      href: buildPageUrl(baseUrl, q, type, limit, offset),
      items: paginatedItems,
      limit: limit,
      next: next,
      offset: offset,
      previous: previous,
      total: total
    }
  };

  res.json(response);
});

// GET /tracks/:id - Fetch a single track by ID
app.get('/tracks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`[Simulation] 🎵 Fetching details for track ID: ${id}`);

  // 1. Simulate Network Delay (Optional, but adds realism)
  const delay = Math.floor(Math.random() * 500) + 200; // Faster than search (200-700ms)
  await new Promise(resolve => setTimeout(resolve, delay));

  // 2. Find the track in our "Database"
  const track = ALL_TRACKS.find(t => t.id === id);

  // 3. Handle Not Found
  if (!track) {
    res.status(404).json({ error: { status: 404, message: "Track not found" } });
    return;
  }

  // 4. Return the track
  res.json(track);
});

app.listen(PORT, () => {
  console.log(`\n--- Spotify Dummy Backend Running ---`);
  console.log(`Listening at http://localhost:${PORT}`);
});