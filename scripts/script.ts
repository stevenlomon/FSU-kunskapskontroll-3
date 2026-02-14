import { type Track, type TrackDetails, generateAccessToken, fetchAll, fetchById } from "./api.js";

const mainContainer = document.getElementById('container');

// Prompt 6: Write an object called DataStore that should have an empty array called allTracks, a method getTracks that returns a JSON parsed object from localStorage under the key 'trackData' or an empty array; a method called setTracks that simply takes a tracks object and sets allTracks using `this`; and finally a getTracks method that returns allTracks using `this`.
const DataStore = {
    // We store and "cache" the list here so that we don't have to fetch
    // it every single time we go back from the detailed track page view
    allTracks: [] as Track[], // Tell TS this starts empty but will hold Tracks

    getTracksFromStorage(): Track[] {
        const data = localStorage.getItem('trackData'); // Attempt to retrieve data
        return data ? JSON.parse(data) : []; // If data was retrieved, parse it, else return an empty list
    },

    // Prompt 7: Write a method like the one above called saveTracksToStorage that takes a list and saves it to localStorage under 'trackData' using JSON stringify
    saveTracksToStorage(tracks: Track[]): void {
        localStorage.setItem('trackData', JSON.stringify(tracks));
    },

    setTracks(tracks: Track[]): void {
        this.allTracks = tracks;
    },

    getTracks(): Track[] {
        return this.allTracks;
    },

    // Prompt 16: Add access token here itilialized as an empty string. Write a method getAccessTokenFromStorage and a method saveAccessTokenFromStorage
    getAccessTokenFromStorage(): string {
        return localStorage.getItem('accessToken') || '';
    },

    saveAccessTokenToStorage(token: string): void {
        localStorage.setItem('accessToken', token);
    },

    // Prompt 17: Write a setAccessToken and getAccessToken. 
    // Ended up not getting used.
};

const ViewRenderer = {
    // Prompt 9: Create a renderList function that takes `tracks` as its input argument. It should first clear mainContainer using innerHTML. Then it creates a const html variable using tracks and the map method to create an HTML string that contains a div with class `track-item` and data-id being track.id wrappaing three <p> tags: artist name, album title, and year. Append it to mainContainer using insertAdjacentHTML and 'beforeend'.
    renderList(tracks: Track[]) {
        if (!mainContainer) {
            console.error("Main element not found");
            return
        }
        mainContainer.innerHTML = '';

        const tracksHTML = tracks.map(track => `
            <div class="track-item" data-id="${track.id}">
                <img src="${track.album.images?.[0]?.url} || ./img/404-not-found" alt="Album Cover">
                <p><strong>${track.name}</strong></p>
                <p>${track.artists?.[0]?.name}</p>
                <p>${track.album.name}</p>
                <p>${track.album.release_date.substring(0, 4)}</p>
            </div>
        `).join('');

        const html = `
        <div class="track-container">
            ${tracksHTML}
        </div>
        `;

        mainContainer.insertAdjacentHTML('beforeend', html);
    },

    renderDetailed(track: TrackDetails) {
        // Prompt 13: Write the renderDetailed method. Just like renderList, it also starts by first clearing the mainContainer. Here we can create html directly; a div with class track-detailed-view, inside there are two divs; track-detailed-view-media-wrapper wraps the image, track-detailed-view-info-wrapper takes the title as an h1, artist name and album title as h3, year, duration and explicit as p tags and finally a "Listen on Spotify" button that has the href from the track data. Append to mainContainer using insertAdjacentHTML.
        if (!mainContainer) {
            console.error("Main element not found");
            return
        }
        mainContainer.innerHTML = '';

        const html = `
            <div class="track-detailed-view">
                <div class="track-detailed-view-media-wrapper">
                    <img src="${track.album.images?.[0]?.url} || ./img/404-not-found" alt="${track.name}">
                </div>
                <div class="track-detailed-view-info-wrapper">
                    <h1>${track.name}</h1>
                    <h3>${track.artists?.[0]?.name}</h3>
                    <h3>${track.album.name}</h3>
                    <p>${track.album.release_date.substring(0, 4)}</p>
                    <p>${track.duration_ms}</p>
                    <p>${track.explicit}</p>
                    <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
                </div>
            </div>
        `;

        mainContainer.insertAdjacentHTML('beforeend', html);
    }
}

// Prompt 12: Write an async function called init that uses a try/catch block to initialize initList using fetchAll and then sets this using setTracks from DataStore and renders the list using renderList. Fill the innerHTML of mainContainer with an appropriate error message in the catch block.
async function init() {
    try {
        // Prompt 18: Use getAccessTokenFromStorage to check to see if we have an Access Token in localStorage. If we don't, call generateAccessToken to generate one and save it to localStorage with saveAccessTokenToStorage
        if (!DataStore.getAccessTokenFromStorage()) {
            const token = await generateAccessToken();
            DataStore.saveAccessTokenToStorage(token);

            // Prompt 19: Also store an expiration timestamp (current time + 3600ms) in localStorage
            localStorage.setItem('tokenExpiration', Date.now() + 3600);
        }

        // Fetch initial list and store it as cache in our DataStore
        const initList = await fetchAll();
        DataStore.setTracks(initList);

        // Render our initial list
        ViewRenderer.renderList(initList);
    } catch (error) {
        mainContainer.innerHTML = `Error when rendering site: ${error}. Please try again.`;
    }
}

mainContainer.addEventListener('click', async (e) => {
    // What did we click?
    // TRACE: Did we click a track card?
    // Prompt 14: First, create a const variable trackCard using e.target, closest and the track-item class. Then, write the first click case: if we have a trackCard, create a pointer using dataset.id followed by a try/catch that fetches the track by id and renders it usign renderDetailed. Fall back to List view on error and handle the error gracefully.
    const trackCard = e.target.closest('.track-item');

    if (trackCard) {
        const trackId = trackCard.dataset.id;
        try {
            const track = await fetchById(trackId);
            ViewRenderer.renderDetailed(track);
        } catch (error) {
            console.error('Error fetching track details:', error); // We'll return to how we render errors
            ViewRenderer.renderList(DataStore.getTracks());
        }
    }

    // TRACE: Did we click 'Go Back'?
    // Prompt 15: If the id of e.target is 'back-btn', retrieve the initial list we cached with init and re-render it.
    if (e.target.id === 'back-btn') {
        // We retrieve the initial list we cached during init()
        const tracks = DataStore.getTracks();

        // Re-render the list. State Change: Detailed View -> List View
        ViewRenderer.renderList(tracks);
    }
});

// "Power on" our Full Stack app
window.addEventListener("DOMContentLoaded", init);
