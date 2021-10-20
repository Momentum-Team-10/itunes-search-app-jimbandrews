// initialize global variables
const form = document.getElementById("music-form");
const url = "https://itunes.apple.com/search?term=";
const limit = "&entity=song&attribute=artistTerm&limit=10";
const results = document.getElementById("search-results");
const previewDiv = document.getElementById("music-preview");
const error = document.getElementById("error-message");

// event listener for when for is submitted --> fetch request to iTunes API
form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearDivs();
    if (document.getElementById("error-message")) {
        document.getElementById("error-message").remove()
    }
    let input = document.getElementById("music-query");
    if (input.value === "") {
        noSearch();
    } else if (input.value.includes('#')) {
        usedHash();
    }
    else {
        while (results.hasChildNodes()) {
            results.firstChild.remove();
        }
        let artist = input.value.toLowerCase().replace(' ', '+');
        fetch(url+artist+limit)
            .then(res => res.json())
            .then(data => {
                if (data.results.length === 0) {
                    emptyGET()
                } else {
                    for (let item of data.results) {
                        showSongCard(item);
                    }
                }
                
            })
    }
    form.reset();
})

function linkSongPreview(songCard) {
    songCard.addEventListener("click", () => {
        if (previewDiv.childElementCount !== 0) {
            let preview = document.getElementById("preview");
            preview.src = songCard.id;
        } else {
            previewDiv.innerHTML = `<audio controls autoplay src=${songCard.id} id="preview">
                Your browser does not support the <code>audio</code> element.
                </audio>`;
        }
    })
}


// this works, but I need a better place to put the error message
function noSearch() {
    let message = document.createElement("p");
    message.classList.add("help");
    message.id = "error-message";
    message.innerText = "Please enter an artist's name to search.";
    form.appendChild(message);
}

function emptyGET() {
    let message = document.createElement("p");
    message.classList.add("help");
    message.id = "error-message";
    message.innerText = "Your search did not return any results."
    form.appendChild(message);
}

function usedHash() {
    let message = document.createElement("p");
    message.classList.add("help");
    message.id = "error-message";
    message.innerText = "Please do not use the # character in your search."
    form.appendChild(message);
}

function clearDivs() {
    // if (error.childElementCount !== 0) {
    //     error.firstChild.remove();
    // }
    if (previewDiv.childElementCount !== 0) {
        previewDiv.firstChild.remove();
    }
}


function showSongCard(songObj) {
    let songCard = document.createElement("div");
    songCard.id = songObj.previewUrl;
    songCard.classList.add("song-card");
    linkSongPreview(songCard);
    addAlbumArt(songObj, songCard);
    addSongTitle(songObj, songCard);
    addAlbumTitle(songObj, songCard);
    addArtist(songObj, songCard);
    addReleaseDate(songObj, songCard);
    results.appendChild(songCard);
}

// the following functions are used to extract key values from data within a JSON and add them to a songCard div
function addAlbumArt(songObj, songCard) {
    let albumArt = document.createElement("img");
    albumArt.src = songObj.artworkUrl100;
    songCard.appendChild(albumArt);
}

function addSongTitle(songObj, songCard) {
    let songTitleDiv = document.createElement("div");
    songTitleDiv.innerText = songObj.trackName;
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