document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const songList = document.getElementById('song-list');
    const audioPlayer = document.getElementById('audio-player');

    songList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const songUrl = event.target.getAttribute('data-url');
            socket.emit('play song', songUrl);
        }
    });

    socket.on('play song', (song) => {
        audioPlayer.src = song;
        audioPlayer.play();
    });
});
