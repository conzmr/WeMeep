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
mongoose.connect(configDB.url); //connect to database

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

//SocketIO integration
// This event will trigger when any user is connected.
io.on('connection', (socket) => {
  console.log("A user connected!")
  // You can use 'socket' to emit and receive events.
  socket.on('comment', (data) => {
    // When any connected client emit this event, we will receive it here.
    console.log("Someone commented")
    io.emit("Someone commented")
    /* io.emit('something happend') // for all. */
    /* socket.broadcast.emit('something happend') // for all except me. */
  })
})

//server listening to 8080 port
server.listen(8080)
