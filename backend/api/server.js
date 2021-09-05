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
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
module.exports = http;
