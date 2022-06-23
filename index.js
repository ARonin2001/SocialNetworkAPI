const express = require('express');

const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

config.express(app, express);
config.routes(app, io);

const {appPort, mongoUri} = config.app;

// socket for chat
io.on('connection', socket => {
    console.log('user connected', socket.id);

    socket.on("MSG:JOIN", (roomId) => {
        console.log(`joined to the room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on("MSG:ADD", (msg) => {
        console.log(msg);
        let newMsg = {...msg};        
        newMsg.sender = "companion";

        const roomId = msg.roomId;

        socket.broadcast.to(roomId).emit('MSG:ADD', newMsg);

    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

mongoose.connect(mongoUri)
    .then(() => server.listen(
        appPort, 
        () => console.log(`Listening on port: ${appPort}...`))   
    )
    .catch(err => console.error(`Error connection to mongo: ${mongoUri}`, err));