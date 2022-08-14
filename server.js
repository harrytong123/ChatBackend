const express = require('express');
const http = require('http');
const path = require('path')
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const bot = 'System'

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        //Welcome current User
        socket.emit('message', formatMessage(bot, 'Welcome to Tech Chat'));

        //User Connection
        socket.broadcast.emit('message', formatMessage(bot, 'A user has joined the chat'));
    })


    //User Disconnect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(bot, 'A user has left the chat'));
    })

    //Listen to chat
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    })


})

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => console.log(`server running on ${PORT}`));