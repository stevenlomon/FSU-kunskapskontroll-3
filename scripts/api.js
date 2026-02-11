// Prompt 8 to be added here
// Prompt 8: Write two async functions called fetchAll (zero input arguments) and fetchById (takes trackId) that both use try/catch blocks to make an await fetch request to a placeholder URL. The catch block should return an error from the requst if available
async function fetchAll() {
  try {
    const response = await fetch('https://api.example.com/tracks');
    const data = await response.json();

    return  data
  } catch (error) {
    return error;
  }
}

async function fetchById(trackId) {
  try {
    const response = await fetch(`https://api.example.com/tracks/${trackId}`);
    const data = await response.json();
    
    return  data
  } catch (error) {
    return error;
  }
}
