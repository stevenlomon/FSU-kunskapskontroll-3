// Prompt 23: Write and export a TS interface for SpotifyTokenResponse. It has `access_token` and `token_type` that are both string, as well as `expires_in` which is a number
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Prompt 24: Write and export a TS interface for Track. Look at the two interfaces below. The Track interface includes everythign that is repeated
export interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    release_date: string;
    images: {
      url: string;
    }[];
  };
  artists: {
    name: string;
  }[];
}

// Prompt 21: Write and export a TS interface for TracksList. It's the result of a search and should contain `tracks` which is an object that in turn contains the `items` which is an array of trackObject. From these objects we want the `album` object: `name` as a string, `release_date` as a string, and `images` which is yet another nested object; from this object we need `url`. The next thing we need in the `items` object is `artists` which is an array containing artists objects. Final object from `itmes` is `external_urls` from which we only want the value at the `spotify` key which is a string. From each arist object we only need `name`. The rest of the things we need from `items` are id (string), name (string), duration_ms (int) and explicit (bool).
export interface TracksList {
  tracks: {
    items: Track[];
  };
}

// Prompt 22: Write and export a TS interfact for TrackDetails. It's the fetch result from the track endpoint. It has an `album` object which we need `name` (string), `release_date` (string), `images` which once again is an array of ImageObject, each from which we need the `url` (string). We need `artists` which is an array of SimplifiedArtistObject, each from which we need `name` (string). We need `external_urls` which is an object from which we need the `spotify` key (string). The other things we need are `name` (string), explicit (bool), duration_ms (int). 
export interface TrackDetails extends Track {
  explicit: boolean;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

// Code from https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
// I'm well aware that in real production we would use the Python equivalent of .env and python-dotenv 
// for secrets and credentials
// The function was taken to a working state with the help of Gemini
// Apparently the Spotify documentation is using ancient dinosaur way of writing JS?
async function generateAccessToken() {
  const client_id = 'b207e4b236444a4ba0d58862c28a46a3';
  const client_secret = 'c48e58611d9041d6b613f5fa9727a96e';

  const url = 'https://accounts.spotify.com/api/token';

  // 1. Prepare the credentials for Basic Auth
  // btoa() is the browser-native way to create a Base64 string
  const credentials = btoa(`${client_id}:${client_secret}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // 2. The body must be URL-encoded, not a standard JSON object
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch access token');
    }

    // 3. Return the full JSON object (access_token, token_type, expires_in)
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Authorization Error:', error);
    throw error;
  }
}

// Prompt 20: Write a function that checks if we have a valid access token in localStorage under the `tokenExpiration` key. If we don't, fetch one and store it
async function getValidAccessToken() {
  const token = localStorage.getItem('accessToken');
  const expiration = localStorage.getItem('tokenExpiration');

  if (token && expiration && Date.now() < Number(expiration)) {
    return token;
  }

  const data = await generateAccessToken();
  const expirationTime = Date.now() + (data.expires_in * 1000);

  localStorage.setItem('accessToken', data.access_token);
  localStorage.setItem('tokenExpiration', expirationTime.toString());

  return data.access_token;
}

// Prompt 8: Write two async functions called fetchAll (zero input arguments) and fetchById (takes trackId) that both use try/catch blocks to make an await fetch request to a placeholder URL. The catch block should return an error from the requst if available
async function fetchAll() {
  try {
    const token = await getValidAccessToken();
    console.log("token: ", token);
    const headers = { 'Authorization': 'Bearer ' + token }

    // Pass the headers in the options object
    const response = await fetch('https://api.spotify.com/v1/search?q=b&type=track&market=SE&limit=10', {
      method: 'GET',
      headers: headers
    });
    const data = await response.json();
    console.log("data: ", data);
    const tracksData = data["tracks"]["items"];
    console.log("tracksData: ", tracksData);

    return tracksData
  } catch (error) {
    return error;
  }
}

async function fetchById(trackId) {
  try {
    const token = await getValidAccessToken();
    const headers = { 'Authorization': 'Bearer ' + token }
    
    const response = await fetch(`https://api.example.com/tracks/${trackId}`, {
      headers: headers
    });
    const trackData = await response.json();

    return trackData
  } catch (error) {
    return error;
  }
}

// Prompt 9: Export the two functions
export { generateAccessToken, fetchAll, fetchById };

