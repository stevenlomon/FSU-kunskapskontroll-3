// Prompt 6 to be added here
// Prompt 6: Write an object called DataStore that should have an empty array called allTracks, a method getTracks that returns a JSON parsed object from localStorage under the key 'trackData' or an empty array; a method called setTracks that simply takes a tracks object and sets allTracks using `this`; and finally a getTracks method that returns allTracks using `this`.
```javascript
const DataStore = {
    allTracks: [],
    getTracksFromStorage: function() {
        return JSON.parse(localStorage.getItem('trackData')) || [];
    },
    setTracks: function(tracks) {
        this.allTracks = tracks;
    },
    getTracks: function() {
        return this.allTracks;
    }
};
```
