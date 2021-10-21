// initialize global variables
const submit = document.getElementById("button");
const url = "https://itunes.apple.com/search?term=";
const limit = "&entity=song&attribute=artistTerm&limit=25";
const results = document.getElementById("search-results");
const previewDiv = document.getElementById("music-preview");
const hero = document.getElementById("hero");
const herotitle = document.getElementById("title")
const subtitle = document.getElementById("subtitle")

// event listener for when bulma form is submitted --> checks for errors, then fetch request to iTunes API
// checks for no results, then loads results
button.addEventListener("click", (e) => {
    e.preventDefault();
    clearErrors();
    let input = document.getElementById("music-query");
    if (input.value === "") {
        subtitle.innerText = "Please enter an artist's name to search.";
    } else if (input.value.includes('#')) {
        subtitle.innerText = "Please do not use the # character in your search.";
    }else {
        let artist = input.value.toLowerCase().replace(' ', '+');
        fetch(url+artist+limit)
            .then(res => res.json())
            .then(data => {
                if (data.results.length === 0) {
                    subtitle.innerText = "Your search did not return any results.";
                } else {
                    heroEdit(input)
                    clearAudio()
                    while (results.hasChildNodes()) {
                        results.firstChild.remove();
                    }
                    for (let item of data.results) {
                        showSongCard(item);
                    }
                }
                
            })
    }
    input.value = "";
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// FUNCTIONS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// clears audio element after every successful submit
function clearAudio() {
    if (previewDiv.childElementCount !== 0) {
        previewDiv.firstChild.remove();
    }
}

// clears error message after every submit
function clearErrors() {
    if (document.getElementById("error-message")) {
        document.getElementById("error-message").remove()
    }
}

// changes bulma hero, making it smaller and only at the top
function heroEdit(input) {
    button.classList.remove("is-large");
    input.classList.remove("is-large");
    hero.classList.remove("is-fullheight");
    subtitle.innerText = "Click a song to play its preview";
}

// creates, fills, and renders a songCard containing a song's artwork and info
function showSongCard(songObj) {
    let songCard = document.createElement("div");
    songCard.id = songObj.previewUrl;
    songCard.classList.add("song-card", "is-flex", "is-flex-direction-column", "is-align-items-center", "box");
    let songContent = document.createElement("div");
    songContent.classList.add("card-content");
    linkSongPreview(songCard);
    addAlbumArt(songObj, songCard);
    addSongTitle(songObj, songContent);
    addAlbumTitle(songObj, songContent);
    addArtist(songObj, songContent);
    addReleaseDate(songObj, songContent);
    songCard.appendChild(songContent);
    results.appendChild(songCard);
}

// adds audio element with src = songCard.id; checks if audio element is present or not
function linkSongPreview(songCard) {
    songCard.addEventListener("click", () => {
        previewStopped();
        if (previewDiv.childElementCount !== 0) {
            let preview = document.getElementById("preview");
            preview.src = songCard.id;
        } else {
            previewDiv.innerHTML = `<audio controls autoplay src=${songCard.id} id="preview">
                Your browser does not support the <code>audio</code> element.
                </audio>`;
        }
        previewPlaying(songCard);
    })
}
// the following 5 functions are used to extract key values from data within a JSON and add them to a songCard div
function addAlbumArt(songObj, songCard) {
    let cardImage = document.createElement("div");
    cardImage.classList.add("card-image");
    let albumArt = document.createElement("img");
    albumArt.src = songObj.artworkUrl100;
    cardImage.appendChild(albumArt);
    songCard.appendChild(cardImage);
}

function addSongTitle(songObj, songCard) {
    let songTitleDiv = document.createElement("div");
    songTitleDiv.innerText = songObj.trackName;
    songCard.appendChild(songTitleDiv);
}

function addAlbumTitle(songObj, songCard) {
    let albumTitleDiv = document.createElement("div");
    albumTitleDiv.innerHTML = "<span class='is-size-7'>from </span>" + songObj.collectionName;
    songCard.appendChild(albumTitleDiv);
}

function addArtist(songObj, songCard) {
    let artistDiv = document.createElement("div");
    artistDiv.innerHTML = "<span class='is-size-7'>by </span>" + songObj.artistName;
    songCard.appendChild(artistDiv);
}

function addReleaseDate(songObj, songCard) {
    let dateDiv = document.createElement("div");
    dateDiv.innerHTML = "<span class='is-size-7'>released </span>" + songObj.releaseDate.slice(0, 10);
    songCard.appendChild(dateDiv);
}

// changes the background and font colors of the song whose preview audio is playing to green and white, respectively
function previewPlaying(songCard) {
    songCard.classList.add("has-background-success");
    
    let content = songCard.getElementsByClassName("card-content");
    let infoDivs = content[0].children;
    for (let child of infoDivs) {
        child.classList.add("has-text-white")
    }
}

// changes the background and font colors of the song whose preview audio was playing back to normal
function previewStopped() {
    playing = results.getElementsByClassName("has-background-success");
    for (let element of playing) {
        element.classList.remove("has-background-success");
        let content = element.getElementsByClassName("card-content");
        let infoDivs = content[0].children;
        for (let child of infoDivs) {
            child.classList.remove("has-text-white")
        }
    }
}