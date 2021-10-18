const form = document.getElementById("music-form");
const url = "https://itunes.apple.com/search?term=";
const infoKeys = ["artworkUrl100", "trackName", "collectionName", "artistName", "releaseDate", "previewUrl"];
const results = document.getElementById("search-results");

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let input = document.getElementById("music-query");
    let artist = input.value.toLowerCase().replace(' ', '+');
    console.log(artist);
    fetch(url+artist)
        .then(res => res.json)
        .then(data => {
            for (let item of data) {
                let songCard = document.createElement("ul");
                fillSongCard(item, songCard)
                results.appendChild(songCard)
            }
        })
})


function fillSongCard(songObj, songCard) {
    
}