const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('set username', (username) => {
        if (!username || username.trim() === '') {
            socket.emit('error message', 'Username cannot be empty!');
            return;
        }
        socket.username = username;
        console.log(`${username} joined the chat`);
    });

    socket.on('chat message', (data) => {
        if (!socket.username) {
            socket.emit('error message', 'You must set a username before sending messages!');
            return;
        }

        io.emit('chat message', { user: socket.username, text: data.text, time: data.time });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username || 'A user'} disconnected`);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
