import { fetchAll, fetchById } from "./api.js";

const mainContainer = document.getElementById('container');

// Prompt 6: Write an object called DataStore that should have an empty array called allTracks, a method getTracks that returns a JSON parsed object from localStorage under the key 'trackData' or an empty array; a method called setTracks that simply takes a tracks object and sets allTracks using `this`; and finally a getTracks method that returns allTracks using `this`.
const DataStore = {
    // We store and "cache" the list here so that we don't have to fetch
    // it every single time we go back from the detailed track page view
    allTracks: [],

    getTracksFromStorage() {
        return JSON.parse(localStorage.getItem('trackData')) || [];
    },

    // Prompt 7: Write a method like the one above called saveTracksToStorage that takes a list and saves it to localStorage under 'trackData' using JSON stringify
    saveTracksToStorage(tracks) {
        localStorage.setItem('trackData', JSON.stringify(tracks));
    },

    setTracks(tracks) {
        this.allTracks = tracks;
    },
    
    getTracks() {
        return this.allTracks;
    }
};

const ViewRenderer = {
    // Prompt 9: Create a renderList function that takes `tracks` as its input argument. It should first clear mainContainer using innerHTML. Then it creates a const html variable using tracks and the map method to create an HTML string that contains a div with class `track-item` and data-id being track.id wrappaing three <p> tags: artist name, album title, and year. Append it to mainContainer using insertAdjacentHTML and 'beforeend'.
    renderList(tracks) {
        mainContainer.innerHTML = '';

        const tracksHTML = tracks.map(track => `
            <div class="track-item" data-id="${track.id}">
                <img src="${track.album.images[0].url}" alt="Album Cover">
                <p><strong>${track.name}</strong></p>
                <p>${track.artists[0].name}</p>
                <p>${track.album.name}</p>
                <p>${track.album.release_date.substring(0,4)}</p>
            </div>
        `).join('');

        const html = `
        <div class="track-container">
            ${tracksHTML}
        </div>
        `;

        mainContainer.insertAdjacentHTML('beforeend', html);
    },

    renderDetailed(track) {
        // Prompt 13: Write the renderDetailed method. Just like renderList, it also starts by first clearing the mainContainer. Here we can create html directly; a div with class track-detailed-view, inside there are two divs; track-detailed-view-media-wrapper wraps the image, track-detailed-view-info-wrapper takes the title as an h1, artist name and album title as h3, year, duration and explicit as p tags and finally a "Listen on Spotify" button that has the href from the track data. Append to mainContainer using insertAdjacentHTML.
        mainContainer.innerHTML = '';

        const html = `
            <div class="track-detailed-view">
                <div class="track-detailed-view-media-wrapper">
                    <img src="${track.album.images[0].url}" alt="${track.name}">
                </div>
                <div class="track-detailed-view-info-wrapper">
                    <h1>${track.name}</h1>
                    <h3>${track.artists[0].name}</h3>
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
            const track = await fetchTrackById(trackId);
            ViewRenderer.renderDetailed(track);
        } catch (error) {
            console.error('Error fetching track details:', error); // We'll return to how we render errors
            ViewRenderer.renderList(DataStore.getTracks());
        }
    }

    // TRACE: Did we click 'Go Back'?
    // Prompt 15: If the id of e.target is 'back-btn', retrieve the initial list we cached with init and re-render it.

});

// "Power on" our Full Stack app
window.addEventListener("DOMContentLoaded", init);
