"use strict";
var express = require("express");
var server = express();
// const authRouter = require("./auth/authRouter");
// const roomsRouter = require("./rooms/roomsRouter");
// const usersRouter = require("./users/usersRouter");
// const session = require("express-session");
// const KnexSessionStore = require("connect-session-knex")(session);
var http = require('http').Server(server);
var io = require('socket.io')(http);
require("../interfaces");
server.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
var users = {
// key : user_id
// value :{
//    user_id
//    username
//}
};
io.on('connection', function (socket) {
    if (!socket.handshake.query || !socket.handshake.query.username) {
        return;
    }
    var username = socket.handshake.query.username;
    io.to(socket.id).emit("initial self position", {
        user_id: socket.id,
        username: username,
        room_id: "",
        x: 50,
        y: 50
    });
    socket.on("position", function (position) {
        // will implement different rooms later. for now, just emit the position to every socket
        io.volatile.emit("position", position);
    });
    socket.on("join user", function (socket_id) {
        // join the channels of other users
        socket.join(socket_id);
    });
    socket.on("leave user", function (socket_id) {
        // leave the channels of ther users
        socket.leave(socket_id);
    });
    socket.on('chat message', function (msg) {
        // emit to the channel belong to the socket. Identifiable through id
        io.to(socket.id).emit(msg);
    });
});
module.exports = http;
