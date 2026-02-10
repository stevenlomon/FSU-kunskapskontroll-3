// server.ts
import express, { Request, Response } from 'express';
import cors from 'cors'; // npm install cors
import { getDummyTracks } from './db';
import { SearchResponse, SpotifyTrack } from './types';

// Setup similar to FastAPI app = FastAPI()
const app = express();
const PORT = 3000; // Localhost port

// Middleware (Like CORSMiddleware in Python)
app.use(cors());
app.use(express.json());

// In-memory "Database"
const ALL_TRACKS = getDummyTracks();

// --- Helper Functions ---

/**
 * Replicates Spotify's search filtering logic (fuzzy match)
 */
const filterTracks = (query: string): SpotifyTrack[] => {
  if (!query) return [];
  const lowerQ = query.toLowerCase();
  
  return ALL_TRACKS.filter(track => 
    track.name.toLowerCase().includes(lowerQ) || 
    track.artists.some(a => a.name.toLowerCase().includes(lowerQ)) ||
    track.album.name.toLowerCase().includes(lowerQ)
  );
};

/**
 * Helper to build the next/previous URLs exactly like Spotify
 */
const buildPageUrl = (baseUrl: string, query: string, type: string, limit: number, offset: number): string => {
  return `${baseUrl}?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}`;
};

// --- Routes ---

// NOTE: Added 'async' here to allow for the await/delay
app.get('/search', async (req: Request, res: Response) => {
  
  // ---------------------------------------------------------
  // REALITY TWISTER: Network Lag Simulation
  // "Prototype to Learn" - Simulating slow 3G/Vinyl Loading
  // ---------------------------------------------------------
  const minDelay = 3000; // 3 seconds
  const maxDelay = 6000; // 6 seconds
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

  console.log(`[Simulation] 🐢 Spinning the vinyl... delaying response by ${delay}ms`);
  
  // The Non-Blocking Sleep (pauses this request, but keeps server alive for others)
  await new Promise(resolve => setTimeout(resolve, delay));
  // ---------------------------------------------------------


  // 1. Parse Query Parameters
  // "Design by Contract": We expect specific types, fallback to defaults if missing
  const q = req.query.q as string;
  const type = req.query.type as string || 'track';
  const market = req.query.market as string; // Ignored for dummy, but acknowledged
  
  // Parse limit/offset with Spotify's constraints
  let limit = parseInt(req.query.limit as string) || 20;
  if (limit < 0) limit = 20;
  if (limit > 50) limit = 50;

  let offset = parseInt(req.query.offset as string) || 0;
  if (offset < 0) offset = 0;

  // 2. Validation (Fail Fast)
  if (!q) {
    return res.status(400).json({ error: { status: 400, message: "No search query provided." } });
  }

  // 3. Execution (The Search)
  // In a real app, this would be a DB query `SELECT * FROM tracks WHERE...`
  const filteredMatches = filterTracks(q);
  const total = filteredMatches.length;

  // 4. Pagination Logic (Slicing the array)
  const paginatedItems = filteredMatches.slice(offset, offset + limit);

  // 5. Construct Next/Previous Links
  const baseUrl = "http://localhost:3000/search";
  
  const next = (offset + limit < total) 
    ? buildPageUrl(baseUrl, q, type, limit, offset + limit) 
    : null;

  const previous = (offset - limit >= 0) 
    ? buildPageUrl(baseUrl, q, type, limit, offset - limit) 
    : (offset > 0 && offset < limit) // Handle case where we are on page 2 but offset is small
      ? buildPageUrl(baseUrl, q, type, limit, 0)
      : null;

  // 6. Build Final Response
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

  // 7. Output
  return res.json(response);
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n--- Spotify Dummy Backend Running ---`);
  console.log(`Based on the principles of 'The Pragmatic Programmer'`);
  console.log(`Listening at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/search?q=Dark&type=track&limit=5\n`);
});