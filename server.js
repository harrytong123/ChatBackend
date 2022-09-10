const express = require('express');
const http = require('http');
const path = require('path')
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser , userLeaves, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const bot = 'System'

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //Welcome current User
        socket.emit('message', formatMessage(bot, 'Welcome to Tech Chat'));

        //User Connection
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room
        })
    })


    //User Dsconnect
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left the chat`));
        }
    })

    //Listen to chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })


})

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => console.log(`server running on ${PORT}`));