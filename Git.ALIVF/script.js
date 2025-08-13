window.addEventListener("scroll", function() {
    const body = document.body;
    if (window.scrollY > 50) { // Aktifkan efek 50px
        body.classList.add("zoom-out");
    } else {
    }
    document.body.style.zoom = "55%"; // Mengatur zoom ke 50%
});
const musicButton = document.getElementById('musicPlayButton');
const musicAudio = document.getElementById('musicAudio');
const musicIcon = document.getElementById('musicIcon');

let isPlaying = false;

musicButton.addEventListener('click', () => {
    if (isPlaying) {
        musicAudio.pause();
        musicIcon.src = 'music2.png';
    } else {
        musicAudio.play();
        musicIcon.src = 'music.png';
    }
    isPlaying = !isPlaying;
});
