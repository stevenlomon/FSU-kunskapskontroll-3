// Prompt 6: Write an object called DataStore that should have an empty array called allTracks, a method getTracks that returns a JSON parsed object from localStorage under the key 'trackData' or an empty array; a method called setTracks that simply takes a tracks object and sets allTracks using `this`; and finally a getTracks method that returns allTracks using `this`.
const DataStore = {
    // We store and "cache" the list here so that we don't have to fetch
    // it every single time we go back from the detailed track page view
    allTracks: [],

    getTracksFromStorage() {
        return JSON.parse(localStorage.getItem('trackData')) || [];
    },

    // Prompt 7: Write a method like the one above called saveTracksToStorage that takes a list and saves it to localStorage under 'trackData' using JSON stringify

    setTracks(tracks) {
        this.allTracks = tracks;
    },
    
    getTracks() {
        return this.allTracks;
    }
};