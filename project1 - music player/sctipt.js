// select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector("#playOrpause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar");

let musicIndex = 1; 

window.addEventListener("load", ()=> {
    loadMusic(musicIndex); // calling load music function once window is loaded
    playingNow();
});

// load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `covers/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/NIRVANA NEVERMIND/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
// had to get creative here, if play the image of the icon is replaced
function playMusic() {
    wrapper.classList.add("paused"); 
    playPauseBtn.src= `icons/pause_FILL0_wght400_GRAD0_opsz48.svg`;
    mainAudio.play();
}

// pause music function
// same here
function pauseMusic() {
    wrapper.classList.remove("paused"); 
    playPauseBtn.src = `icons/play_arrow_FILL0_wght400_GRAD0_opsz48.svg`;
    mainAudio.pause();
}

// next music function
function nextMusic() {
    // here we'll increment the index by 1
    musicIndex++;
    // if musicIndex is greater than the length of the list
    // it'll go back to one (the first song)
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    // and then the music will be played
    playMusic();
    playingNow();

}

function prevMusic() {
    // here we'll decrease by one
    musicIndex--; 
    // if less than 1 the number will switch to array length (last song)
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex); 
    playMusic();
    playingNow();
}

// play or music button event

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true, then call pauseMusic, else call playMusic
    isMusicPaused ? pauseMusic() : playMusic(); 
    playingNow();
});

// next button
nextBtn.addEventListener("click", () => {
    nextMusic(); //calling next music function
});

prevBtn.addEventListener("click", () => {
    prevMusic(); 
}); 

// update progress bar width according to music current time

mainAudio.addEventListener("timeupdate", (e) => {
    //console.log(e); // get currentTime and duration from here!
    const currentTime = e.target.currentTime; 
    //console.log(currentTime); // absolutely works!!!
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100; 
    //console.log(progressWidth);
    progressBar.style.width = `${progressWidth}%`; // width of .progress-bar changes

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        

        // update song total duration
        let audioDuration = mainAudio.duration; 
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if(totalSec < 10) { // concatenate a 0 if seconds are less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    // update current time of song

    let currentMin = Math.floor(currentTime / 60); 
    let currentSec = Math.floor(currentTime % 60); 
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e)=> {    
    let progressWidthVal = progressArea.clientWidth; // get width of progress bar
    let clickedOffSetX = e.offsetX; // getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    //playMusic(); // if music is paused, it'll play when the progress bar is clicked
});

// repeat shuffle song
// change icon accordingly
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getAlt = repeatBtn.alt; 
    switch(getAlt) {
        case "repeat": 
            repeatBtn.alt = "repeat-1";
            repeatBtn.title = "Song looped";
            repeatBtn.src = `icons/repeat_one_FILL0_wght400_GRAD0_opsz48.svg`;
            break; 
        case "repeat-1":
            repeatBtn.alt = "shuffle"; 
            repeatBtn.title = "Playback shuffle";
            repeatBtn.src = `icons/shuffle_FILL0_wght400_GRAD0_opsz48.svg`;
            break; 
        case "shuffle":
            repeatBtn.alt = "repeat";
            repeatBtn.title = "Playlist looped";
            repeatBtn.src = `icons/repeat_FILL0_wght400_GRAD0_opsz48.svg`;
            break;
    }
});

// let's make this work!

// after song ends

mainAudio.addEventListener("ended", () => {
    // current song will do accordingly to icon selected

    let getAlt = repeatBtn.alt;
    switch(getAlt) {
        case "repeat": // if unset we simply play next song;
            nextMusic();
            break; 
        case "repeat-1": // if set to repeat-1, when song ends, set time back to 0
            mainAudio.currentTime = 0; 
            loadMusic(musicIndex);
            playMusic();
            break; 
        case "shuffle":
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            }while(musicIndex == randomIndex); 
            
            // above will loop until next random number isn't the same as current music index
            musicIndex = randomIndex; // pass the randomIndex so the random song plays!!
            loadMusic(musicIndex); // load music
            playMusic(); // then play!
            playingNow();
            break;
    }
});

// show and hide list of songs
const musicList = wrapper.querySelector(".music-list"), 
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close"); 

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

// dinamically create the list

const ulTag = wrapper.querySelector("ul"); 

for(let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].id}" src="music/NIRVANA NEVERMIND/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].id}" class="audio-duration">5:00</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    
    // we use the id tags to dinamically get song duration and display it in the list
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].id}`); // selects span tag which has duration
    
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].id}`); // selects audio source

    // loadeddata event used to get audio total duration

    liAudioTag.addEventListener("loadeddata", ()=> {
        let audioDuration = liAudioTag.duration; 
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if(totalSec < 10) { // concatenate a 0 if seconds are less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // set time diration as attribute to use later
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
    
}

// play song on click from list

const allLiTags = ulTag.querySelectorAll("li");
//console.log(allLiTags);

function playingNow() {
    for(let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        // let's remove li class from all other li except from the once playing
        if(allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        // if there's a li tag which li-index is equal to musicIndex
        //then this music is plaing now and we'll style it
    
        if(allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerHTML = "Playing";
        }
        // adding onckick attribute to all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// let's play song on li click!!


function clicked(element) {
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // pass that liIndex to musicIndex
    loadMusic(musicIndex); // load music
    playMusic(); // and play!
    playingNow();
}
