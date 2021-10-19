const form = document.getElementById("music-form");
const url = "https://itunes.apple.com/search?term=";
const limit = "&entity=song&attribute=artistTerm&limit=10"
const results = document.getElementById("search-results");
const previewDiv = document.getElementById("music-preview");

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let input = document.getElementById("music-query");
    if (input.value === "") {
        noSearch();
    } else {
        while (results.hasChildNodes()) {
            results.firstChild.remove()
        }
        let artist = input.value.toLowerCase().replace(' ', '+');
        fetch(url+artist+limit)
            .then(res => res.json())
            .then(data => {
                for (let item of data.results) {
                    showSongCard(item);
                }
            })
    }
    form.reset()
})

function linkSongPreview(songCard) {
    songCard.addEventListener("click", () => {
        if (previewDiv.hasChildNodes()) {
            let preview = document.getElementById("preview");
            preview.src = songCard.id;
        } else {
            previewDiv.innerHTML = `<audio control autoplay src=${songCard.id} id="preview">
                Your browser does not support the <code>audio</code> element.
                </audio>`;
        }
        
        
        
        // audioPreview.src = songCard.id;
        // 


        // while (previewDiv.hasChildNodes()) {
        //     previewDiv.firstChild.remove();
        // }
        // previewDiv.appendChild(preview);
    })
}


// this works, but I need a better place to put the error message
function noSearch() {
    let message = document.createElement("div")
    message.innerText = "Please enter an artist's name to search."
    results.appendChild(message)
}

function showSongCard(songObj) {
    let songCard = document.createElement("div");
    songCard.id = songObj.previewUrl
    songCard.classList.add("song-card")
    linkSongPreview(songCard);
    fillSongCard(songObj, songCard)
    results.appendChild(songCard)
}

function fillSongCard(songObj, songCard) {
    addAlbumArt(songObj, songCard);
    addSongTitle(songObj, songCard);
    addAlbumTitle(songObj, songCard);
    addArtist(songObj, songCard);
    addReleaseDate(songObj, songCard);
}

// the following functions are used to extract key values from data within a JSON and add them to a songCard div
function addAlbumArt(songObj, songCard) {
    let albumArt = document.createElement("img");
    albumArt.src = songObj.artworkUrl100;
    songCard.appendChild(albumArt);
}

function addSongTitle(songObj, songCard) {
    let songTitleDiv = document.createElement("div");
    songTitleDiv.innerText = songObj.trackName
    songCard.appendChild(songTitleDiv);
}

function addAlbumTitle(songObj, songCard) {
    let albumTitleDiv = document.createElement("div");
    albumTitleDiv.innerHTML = "<span>from </span>" + songObj.collectionName;
    songCard.appendChild(albumTitleDiv);
}

function addArtist(songObj, songCard) {
    let artistDiv = document.createElement("div");
    artistDiv.innerHTML = "<span>by </span>" + songObj.artistName;
    songCard.appendChild(artistDiv);
}

function addReleaseDate(songObj, songCard) {
    let dateDiv = document.createElement("div");
    dateDiv.innerHTML = "<span>released on </span>" + songObj.releaseDate.slice(0, 10);
    songCard.appendChild(dateDiv);
}