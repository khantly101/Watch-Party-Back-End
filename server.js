/////////////////
//Dependencies
///////////////////

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const http = require('http').createServer(app)

//Socket Setup
const io = require('socket.io')(http)

//Configuration
const PORT = process.env.PORT ||3003
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vparty'
const sessionSecret = process.env.SECRET

//Controllers
const partyRoomController = require('./controllers/partyRooms.js')
const newUserContoller = require('./controllers/newUsers.js')
const sessionsContoller = require('./controllers/session.js')

//Cors Policy
/////////////
const whiteList = ['http://localhost:3000']
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("BLOCKED BY CORS POLICY"));
    };
  }
};

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

app.use(cors(corsOptions))

////////////
//Middleware
/////////////

// app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// app.use(session({
//   secret: sessionSecret,
//   resave: false,
//   saveUnintialized: false
// }))

//Controller routes
app.use('/partyroom', partyRoomController)
app.use('/new', newUserContoller)

///////////
//ROUTES
///////////
app.get('/', (req, res) => {
  res.send('Hello World')
})


app.listen(PORT, () => {
  console.log('Listening on port:', PORT);
})
