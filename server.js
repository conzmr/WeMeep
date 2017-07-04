const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const configDB = require("./config/database")
const API = require("./controllers/api.js")
const morgan = require('morgan')

const app = express()
const server = http.createServer(app)

//Socket IO constant
const io = require('socket.io')(server)

// Database Configuration
mongoose.connect(process.env.MONGOLAB_URI || configDB.url) //connect to database

//Parser
app.use(bodyParser.json()) /* JSON support */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev')) // use morgan to log requests to the console

//Static routing
app.use('/static', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/components', express.static(__dirname + '/bower_components')) //Set bower_components to just components
app.use('/api', API)

app.use('/', function(req, res) {
    res.sendFile( __dirname + '/public/views/index.html') // Use res.sendfile, as it streams instead of reading the file into memory.
})

// Keep track of open sockets
var sockets = []

// track userIds for all connected users
GLOBAL.users = {}

//SocketIO integration
// This event will trigger when any user is connected.
io.on('connection', (socket) => {
  console.log("A user connected!")
  sockets.push(socket) //push the open socket to the data structure
  GLOBAL.users.lastConnected = socket.id // sets the user's socketId

  socket.emit('socket', socket.id) // sends a socket event over to the client

  // You can use 'socket' to emit and receive events.
  socket.on('new_notification', (sender) => {
    console.log(sender.username + sender.type)
    // When any connected client emit this event, we will receive it here.
    socket.to(GLOBAL.users[sender.userId]).emit('notify', sender)
    // io.emit('notify', sender)
    /* io.emit('something happend') // for all. */
    /* socket.broadcast.emit('something happend') // for all except me. */

    //Send only to an specific client
    //socket.broadcast.to(socketid).emit('message', 'for your eyes only');
  })
})

//server listening to 8080 port
server.listen(process.env.PORT || 8080)
