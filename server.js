var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use(cookieParser());

app.get('/', function(req, res) {
  var nickname = req.cookies.nickname;
  if (nickname) {
    res.redirect('/chat?room=' + req.query.room);
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get('/chat', function(req, res) {
  var id = req.query.id;
  var nickname = req.cookies.nickname;
  if (nickname) {
    res.sendFile(__dirname + "/chat.html");
  } else {
    res.redirect('/');
  }
});

io.on('connection', function(socket) {
  socket.once('join room', function(room) {
    socket.join(room);
    socket.on('chat message', function(msg) {
      socket.to(room).emit('chat message', msg);
    });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
