var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname + '/chat.html');
});

var users = new Array();

io.on('connection', function(socket){
    console.log('a user connected');
    
    io.emit('online users', JSON.stringify(users));
    
    socket.broadcast.emit('chat message', 'A user connected');
    
    socket.on('disconnect', function(){
       socket.broadcast.emit('chat message', 'A user disconnected');
        console.log('a user disconnected');
    });
    
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);
    });
    
    socket.on('typing', function(user){
       socket.broadcast.emit('user typing', user + ' is typing'); 
    });
    
    socket.on('nickname', function(nick){
        users.push(nick);
        io.emit('online users', JSON.stringify(users));
    });
    
    fs.readFile('./images/bpb.png', function(err, buf){
        socket.emit('image', { buffer: buf });
      });
})

http.listen(3000, function(){
   console.log('listening in *:3000'); 
});