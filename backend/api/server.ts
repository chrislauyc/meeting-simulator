
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

// io.use((socket:any,next:any)=>{
//   //middleware for every incoming sockets
// })

io.on('connection', (socket:any) => {
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



// const config = {
//   name:"sessionId",
//   secret: "keep it secret, keep it safe",
//   cookie:{
//     maxAge: 1000 * 60 * 60,
//     secure:false,
//     httpOnly: true
//   },
//   resave:false,
//   saveUnitialized:false,
//   store: new KnexSessionStore({
//     knex:require("../database/db-config.js"),
//     tablename:"sessions",
//     sidfieldname:"sid",
//     createTable:true,
//     clearInterval:1000 * 60 * 60
//   })
// }
// server.use(express.json());
// server.use("/api/auth",authRouter);
// server.use("/api/rooms",roomsRouter);
// server.use("/api/users",usersRouter);
// server.use(session(config));


//this should be in the frontend
// const isInProximity=(pos1:Position,pos2:Position,threshold:number):boolean=>{
//   const distance = Math.sqrt(Math.pow(pos1.x-pos2.x,2)+Math.pow(pos1.y-pos2.y,2));
//   return distance <= threshold;
// }

// io.on("connection",(socket:any)=>{
//   socket.on("position change",(position:Position)=>{
//     socket.volatile.emit("position change",position);
//   });
//   socket.on("video call request",(caller_id:number,callee_id:number)=>{
//     socket.to(callee_id).emit("video call",caller_id);
//   });
//   socket.on("peer connection ends",(socket_id1:number,socket_id2:number)=>{

//   })
//   socket.on("disconnect",(position:Position)=>{
//     socket.emit("remove position",position);
//   });
//   socket.on("create-offer",(data:any)=>{
//     const {sdp,receipient, sender} = data;

//   })
// })

export = http;