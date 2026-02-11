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

