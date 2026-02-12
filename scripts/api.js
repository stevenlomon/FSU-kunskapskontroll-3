// Code from https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
// I'm well aware that in real production we would use the Python equivalent of .env and python-dotenv 
// for secrets and credentials
// The function was taken to a working state with the help of Gemini
// Apparently the Spotify documentation is using ancient dinosaur way of writing JS?
async function fetchAccessToken() {
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

// Prompt 8: Write two async functions called fetchAll (zero input arguments) and fetchById (takes trackId) that both use try/catch blocks to make an await fetch request to a placeholder URL. The catch block should return an error from the requst if available
async function fetchAll() {
  try {
    const response = await fetch('http://localhost:3000/search?q=b&type=track&limit=15');
    const data = await response.json();
    const tracksData = data["tracks"]["items"];
    console.log("tracksData: ", tracksData);

    return tracksData
  } catch (error) {
    return error;
  }
}

async function fetchById(trackId) {
  try {
    const response = await fetch(`https://api.example.com/tracks/${trackId}`);
    const trackData = await response.json();
    
    return trackData
  } catch (error) {
    return error;
  }
}

// Prompt 9: Export the two functions
export { fetchAccessToken, fetchAll, fetchById };

