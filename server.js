/////////////////
//Dependencies
///////////////////

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const http = require('http').createServer(app)
const cors = require('cors')
const session = require('express-session')
require('dotenv').config()

//Socket Setup
const io = require('socket.io')(http)

//Configuration
const PORT = process.env.PORT ||3003
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vparty'
const sessionSecret = process.env.SECRET

//Controllers
const partyRoomController = require('./controllers/partyRooms.js')
const newUserController = require('./controllers/newUsers.js')
const sessionsController = require('./controllers/session.js')
const membersController = require('./controllers/members.js')

//Cors Policy
/////////////
const whiteList = ['http://localhost:3000']
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("BLOCKED BY CORS POLICY"))
    }
  }
}

/////////////
//Database
//////////////

//Configuration
mongoose.connect(mongoURI, { useNewUrlParser: true })
mongoose.connection.on('error', (error) => {
  console.log(error.mesage + 'check mongodb');
})
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
})
mongoose.connection.once('open', () => {
  console.log('You are connected to MongoDB!');
})

////////////
//Middleware
/////////////

app.use(cors(corsOptions))
app.use(express.json())
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}))

//Controller routes
app.use('/partyroom', partyRoomController)
app.use('/new', newUserController)
app.use('/login', sessionsController)
app.use('/member', membersController)

///////////
//ROUTES
///////////
app.get('/', (req, res) => {
  res.send('Hello World')
})

////////////////////////////////
//// Socket Listening  //////
//////////////////////////////

//Enabling socket io connection listener
io.on(`connection`, (socket) => {
  console.log(`A user connected`)

  socket.on('disconnecting', function(){
    console.log(`Subscribed Rooms ${socket.rooms}`)
    // var self = this;
    // var rooms = Object.keys(self.rooms);
    console.log(socket.rooms)
    console.log(Object.keys(socket.rooms)[1])
    // rooms.forEach(function(room){
    //     self.to(room).emit('user left', self.id + 'left');
    io.in(Object.keys(socket.rooms)[1]).emit(`delete`, `deleting Id`, socket.id)
    })
  socket.on('disconnect', () => {
    console.log(`A user disconnected ` + socket.id)
    // console.log(socket)
    // io.in(`Room Name Test`).emit(`delete`, `deleting Id`, socket.id)
  })

//Socket Joining Chat Room
  socket.on(`room`, (chatRoom, userName, pic, id) => {
    socket.join(chatRoom)
    io.to(chatRoom).emit(`chat message`, `has joined this chat`, pic,userName)
    io.to(chatRoom).emit(`setId`, `setting Id`, id)
    console.log(`${userName} joined: ${ chatRoom } with pic ${pic}`)
  })

  //Trasmiting message back to socket connections inside unique room
  socket.on(`sendMessage`, (msg,chatRoom,pic,userName) => {
    //Lets Check to see if server is receiving message from client.js
    console.log(`this message was sent: ${ msg }`)
    //Lets Check to see if server is receiving room name from client.js
    console.log(`the room is: ${ chatRoom }`)
    //Send message back to room that message was sent from
    io.to(chatRoom).emit(`recieveMessage`, msg,pic,userName)
  })

  //Send Video Start to other sockets
  socket.on(`play`, (msg,chatRoom,playerId) => {
    //Lets Check to see if server is receiving message from client.js
    console.log(msg)
    console.log(chatRoom)
    console.log(playerId)
    //Send message back to room that message was sent from
    io.to(chatRoom).emit(`play`, msg, playerId)
  })

})

//Manual Server Setup
http.listen(process.env.PORT, () => {
  console.log('Listening on port:', process.env.PORT);
})
