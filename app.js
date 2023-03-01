const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const path = require('path');
const cors = require("cors");


// app.use(express.static(path.join(__dirname, 'public')));

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use(cors())
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res) => {
    res.send(req.params.room);
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(`user ${userId} joined ${roomId}`);
        socket.join(roomId);
        console.log("room joined");
        // socket.on('ready', () => {
        socket.broadcast.to(roomId).emit('user-connected', userId);
        // });
        // socket.on('disconnect', () => {
        //     socket.to(roomId).emit('user-disconnected', userId);
        // }); 
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
