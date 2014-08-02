var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function Packet() {
    this.body ="<h2>WOO PACKET</h2>";
}

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('chat message', 'A new user has joined');
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);

    });

    socket.on('next question', function(){
        var pt = new Packet();
        console.log(pt.body);
        var js = JSON.stringify(pt);
        console.log(js);
        socket.emit('chat message', js);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
