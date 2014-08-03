var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dl = require('delivery');

function Packet() {
    this.body = '<img src="./images/lil-llama.jpg"/>';
}

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    var delivery = dl.listen(socket);

    delivery.on('delivery.connect', function(delivery){
        delivery.send({
           name: 'lil-llama.jpg',
            path: './images/lil-llama.jpg'
        });

        delivery.on('send.success', function(file){
           console.log('File successfully sent to client!');
        });
    });

    socket.broadcast.emit('chat message', 'A new user has joined');
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);

    });

    socket.on('next question', function(){
        console.log(socket.nickname);
        var pt = new Packet();
        console.log(pt.body);
        var js = JSON.stringify(pt);
        console.log(js);
        socket.emit('chat message', js);
    });
});


http.listen(8000, function(){
    console.log('listening on *:8000');
});
