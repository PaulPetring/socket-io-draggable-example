var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var positions = {};



app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  io.emit('chat message', socket.id + ' user connected');

  for (var synced_draggable in positions) {
    console.log(positions[synced_draggable]);
    io.emit('update_position', positions[synced_draggable]);
  }

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('receive_position', function(data) {
    console.log('receive_position', data)
    positions[data.id] = data;
    socket.broadcast.emit('update_position', positions[data.id]); // send `data` to all other clients
  });
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});