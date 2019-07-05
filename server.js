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
const uploadController = require('./controllers/uploads.js')

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
mongoose.set('useCreateIndex', true)

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
app.use('/upload', uploadController)
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
    console.log(socket.rooms)
    console.log(Object.keys(socket.rooms)[1])
    // rooms.forEach(function(room){
    //     self.to(room).emit('user left', self.id + 'left');
    io.in(Object.keys(socket.rooms)[1]).emit(`delete`, `deleting Id`, socket.id)
    })

  socket.on('disconnect', function(){
    console.log('user disconnected')
  })

  //Socket Joining Chat Room
  socket.on(`room`, (partyRoom, roomIndex, userName, pic, sockId) => {
    socket.join(partyRoom._id)

    let newClient = {
      sockId: sockId,
      userName: userName,
      pic: pic
    }

    console.log(`party room`)
    partyRoom.clients.push(newClient)

    console.log(partyRoom)

    io.to(partyRoom._id).emit(`chat message`, `has joined this chat`, pic,userName)
    io.to(partyRoom._id).emit(`client`, `setting socket client object`, partyRoom, sockId, userName, pic )
    io.to(partyRoom._id).emit(`addToList`, `just entered the room`, partyRoom, roomIndex)
    console.log(`${userName} joined: ${ partyRoom._id } with pic ${pic}`)
  })

  //Trasmiting message back to socket connections inside unique room
  socket.on(`sendMessage`, (msg,partyRoom,pic,userName) => {
    //Lets Check to see if server is receiving message from client.js
    console.log(`this message was sent: ${ msg }`)
    //Lets Check to see if server is receiving room name from client.js
    console.log(`the room is: ${ partyRoom }`)
    //Send message back to room that message was sent from
    io.to(partyRoom).emit(`recieveMessage`, msg,pic,userName)
  })

  //Send Video Start to other sockets
  socket.on(`play`, (msg,partyRoom,playerId) => {
    //Lets Check to see if server is receiving message from client.js
    console.log(msg)
    console.log(partyRoom)
    //Send message back to room that message was sent from
    io.to(partyRoom).emit(`play`, msg, playerId)
  })

  socket.on(`stop`, (msg,partyRoom,playerId) => {
    //Lets Check to see if server is receiving message from client.js
    console.log(msg)
    console.log(partyRoom)
    //Send message back to room that message was sent from
    io.to(partyRoom).emit(`stop`, msg, playerId)
  })

})

//Manual Server Setup
http.listen(process.env.PORT, () => {
  console.log('Listening on port:', process.env.PORT);
})
