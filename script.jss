
const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const title = document.getElementById("songTitle");
const artist = document.getElementById("artistName");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playlistEl = document.getElementById("playlist");

const albumArt = document.getElementById("albumArt");

// Songs collection
const songs = [
    {
        title: "Dreams",
        artist: "Artist One",
        src: "songs/song1.mp3",
        color: "linear-gradient(135deg,#9333ea,#ec4899)"
    },
    {
        title: "Night Vibes",
        artist: "Artist Two",
        src: "songs/song2.mp3",
        color: "linear-gradient(135deg,#0891b2,#312e81)"
    },
    {
        title: "Summer Love",
        artist: "Artist Three",
        src: "songs/song3.mp3",
        color: "linear-gradient(135deg,#f97316,#db2777)"
    }
];

let currentSong = 0;

// Load selected song
function loadSong(index) {

    currentSong = index;

    const song = songs[currentSong];

    audio.src = song.src;

    title.textContent = song.title;
    artist.textContent = song.artist;

    albumArt.style.background = song.color;

    progress.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    displayPlaylist();
}

// Play music
function playMusic() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
        })
        .catch(error => {
            console.error("Audio playback error:", error);
            playBtn.textContent = "▶";
        });
}

// Pause music
function pauseMusic() {
    audio.pause();
    playBtn.textContent = "▶";
}

// Play/Pause button
playBtn.addEventListener("click", () => {

    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }

});

// Next song
function nextSong() {

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);
    playMusic();
}

// Previous song
function previousSong() {

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playMusic();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Format seconds into minutes
function formatTime(seconds) {

    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Update duration
audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Update progress bar
audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTimeEl.textContent =
        formatTime(audio.currentTime);
});

// Seek music
progress.addEventListener("input", () => {

    if (!Number.isFinite(audio.duration)) return;

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});

// Volume control
volume.addEventListener("input", () => {

    audio.volume = Number(volume.value);

});

// Autoplay next song
audio.addEventListener("ended", () => {
    nextSong();
});

// Display playlist
function displayPlaylist() {

    playlistEl.innerHTML = "";

    songs.forEach((song, index) => {

        const songItem = document.createElement("div");

        songItem.classList.add("song");

        if (index === currentSong) {
            songItem.classList.add("active");
        }

        songItem.innerHTML = `
            <div>
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">♫</span>
        `;

        songItem.addEventListener("click", () => {

            loadSong(index);
            playMusic();

        });

        playlistEl.appendChild(songItem);

    });

}

// Set initial volume
audio.volume = 0.7;

// Load first song
loadSong(0);

