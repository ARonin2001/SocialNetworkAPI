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

// socket
io.on('connection', socket => {
    console.log('user connected', socket.id);

    socket.on("MSG:JOIN", async (roomId) => {
        console.log(`joined to the room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on("MSG:ADD", async(msg) => {
        const {roomId, companionId, message, dateAt } = msg;
        console.log(msg);

        const newMessage = {
            roomId,
            companionId,
            sender: "companion",
            message,
            dateAt,
        };
        socket.to(roomId).broadcast.emit('MSG:ADD', newMessage);
    })

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