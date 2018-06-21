var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var sw = {};
sw.starttime = 0;
sw.oldtime = 0;
sw.updatetime = Date.now();

io.sockets.on('connection', function (socket) {
  socket.on('start', function(data) {
    if(sw.starttime === 0)
      sw.starttime = Date.now();
    sw.updatetime = Date.now();
    socket.broadcast.emit('update', sw);
    socket.emit('update', sw);
  });
  socket.on('stop', function(data) {
    if(sw.starttime > 0)
	sw.oldtime = Date.now()-sw.starttime+sw.oldtime;
    sw.starttime = 0;
    sw.updatetime = Date.now();
    socket.broadcast.emit('update', sw);
    socket.emit('update', sw);
  });
  socket.on('reset', function(data) {
    if(sw.starttime > 0)
      sw.starttime = Date.now();
    sw.oldtime = 0;
    sw.updatetime = Date.now();
    socket.broadcast.emit('update', sw);
    socket.emit('update', sw);
  });
  
  sw.updatetime = Date.now();
  socket.emit('update', sw);
});


