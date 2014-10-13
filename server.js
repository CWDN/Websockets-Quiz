var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname + '/chat.html');
});

app.get('/test', function(req, res){
   res.sendFile(__dirname + '/client/test.html');
});

app.get('/client/client.js', function(req, res){
    res.sendFile(__dirname + '/client/client.js');
});
app.get('/images/*', function(req, res){
    res.sendFile(__dirname + req.url);
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
    
    fs.readFile('./images/lil-llama.jpg', function(err, buf){
        socket.emit('image', { buffer: buf });
      });
})

 var server = app.listen(8000, function()
{
     var host = server.address().address;
     var port = server.address().port;

     console.log('Listening at http://%s:%s', host, port);

 });
