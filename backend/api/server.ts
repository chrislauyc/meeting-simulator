
const express = require("express");
const server = express();
// const authRouter = require("./auth/authRouter");
// const roomsRouter = require("./rooms/roomsRouter");
// const usersRouter = require("./users/usersRouter");
// const session = require("express-session");
// const KnexSessionStore = require("connect-session-knex")(session);
const http = require('http').Server(server);
const io = require('socket.io')(http);
require("../interfaces");

server.get('/', (req:any, res:any) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {
  // key : user_id
  // value :{
  //    user_id
  //    username
  //}
}

io.on('connection', (socket:any) => {
  if(!socket.handshake.query || !socket.handshake.query.username){
    return;
  }
  const {username} = socket.handshake.query;
  io.to(socket.id).emit("initial self position",{
    user_id:socket.id,
    username,
    room_id:"",
    x:50,
    y:50
  } as Position);
  socket.on("position",(position:Position)=>{
    // will implement different rooms later. for now, just emit the position to every socket
    io.volatile.emit("position",position);
  });
  socket.on("join user",(socket_id:string)=>{
    // join the channels of other users
    socket.join(socket_id);
  });
  socket.on("leave user",(socket_id:string)=>{
    // leave the channels of ther users
    socket.leave(socket_id);
  })
  socket.on('chat message', (msg:string) => {
    // emit to the channel belong to the socket. Identifiable through id
    io.to(socket.id).emit(msg);
  });
});

export = http;