const serverless = require('serverless-http');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve music files from the songs directory
app.get('/songs/:songId', (req, res) => {
    const songId = req.params.songId;
    const filePath = path.join(__dirname, '..', 'songs', `${songId}.mp3`);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Stream the file as a response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        res.status(404).send('Song not found');
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('play song', (song) => {
        io.emit('play song', song);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports.handler = serverless(app);
