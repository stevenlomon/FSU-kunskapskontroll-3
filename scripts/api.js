// Code from https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
// I'm well aware that in real production we would use the Python equivalent of .env and python-dotenv 
// for secrets and credentials
// Prompt 17: Make the following a working function that returns a fresh acess token using the credentials
async function fetchAccessToken() {
    const client_id = 'b207e4b236444a4ba0d58862c28a46a3';
    const client_secret = 'c48e58611d9041d6b613f5fa9727a96e';

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function generateAccessToken(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = body.access_token;

            return token
        }
    });

    return generateAccessToken()
}

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
export { fetchAll, fetchById };

