var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logErrors);
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/scripts', express.static('scripts'));
app.use('/style', express.static('style'));

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.hi = false;

    // On startup announce self to server:
    socket.on('hi', function(data) {
      console.log('hi from socket: ' + socket.id + ' user: ' + JSON.stringify(data));
      // Assign user an id
      // Assign user to a room
      // Send user a response with id and room
      socket.emit('sup', { you: socket.id, room: 0 });
      socket.hi = true;
      // Tell everyone in the same room about this user
      io.emit('hi', { user: socket.id, room: 0 });
    });

    socket.on('change', function(data) {
      if(socket.hi == false) return;
      console.log('change: ' + JSON.stringify(data));
      // tell everyone about this user's change
      io.emit('change', data);
    });
    
    socket.on('change-instrument', function(data) {
      // if(socket.hi == false) return;
      console.log('change-instrument: ' + JSON.stringify(data));
      // tell everyone about this user's change
      io.emit('change-instrument', data);
    });

    // Handle disconnect & broadcast to all users
    socket.on('bye', function(data) {
      socket.hi = false;
      console.log('bye: ' + JSON.stringify(data));
      // find user 
      // destroy user
      // tell everyone user is gone
      io.emit('bye', { user: socket.id});
    });    
});

io.on('disconnect', function(socket) {
  console.log('disconnect: ' + JSON.stringify(socket.id));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

    