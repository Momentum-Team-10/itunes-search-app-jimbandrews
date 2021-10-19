const form = document.getElementById("music-form");
const url = "https://itunes.apple.com/search?term=";
const resultsLimit = "&entity=song&attribute=artistTerm&limit=10"
const infoKeys = ["trackName", "collectionName", "artistName", "releaseDate"];
const previewKey = "previewUrl"
const results = document.getElementById("search-results");

form.addEventListener("submit", (e) => {
    e.preventDefault()

    let input = document.getElementById("music-query");

    if (input.value === "") {
        noSearch();
    } 
    
    else {
        while (results.hasChildNodes()) {
            results.firstChild.remove()
        }

        let artist = input.value.toLowerCase().replace(' ', '+');

        fetch(url+artist+resultsLimit)
            .then(res => res.json())
            .then(data => {
                for (let item of data.results) {
                    showSongCard(item)
                }
            })
    }
})


function fillSongCard(songObj, songCard) {
    let albumArt = document.createElement("img");
    albumArt.src = songObj.artworkUrl100;
    songCard.appendChild(albumArt);
    for (let key of infoKeys) {
        let infoDiv = document.createElement("div")
        if (key === "releaseDate") {
            infoDiv.innerText = "Released " + songObj.releaseDate.slice(0, 10);
        } else{
            infoDiv.innerText = songObj[key];
        }
        songCard.appendChild(infoDiv);
    }

}

function showSongCard(songObj) {
    let songCard = document.createElement("div");
    fillSongCard(songObj, songCard)
    results.appendChild(songCard)
}

// this works, but I need a better place to put the error message
function noSearch() {
    let message = document.createElement("div")
    message.innerText = "Please enter an artist's name to search."
    results.appendChild(message)
}