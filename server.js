/* region Globals*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
/* CSS Preprocessor*/
var stylus = require('stylus');
/* Stylus helper */
var nib = require('nib');
/* File system library */
var fs = require('fs');
/* Logger */
var morgan = require('morgan');
var io = require('socket.io')(http);

/* endregion */

function compile(str, path){
	return stylus(str)
		.set('filename', path)
		.use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));


app.use(stylus.middleware({
	src: __dirname + '/public',
	compile: compile
}));
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
   res.render('index',
			  {
	   title : 'Home',
	   team: 'The Oldies',
	   currentQuestion: '19',
	   totalQuestions: '60',
	   category: 'Music',
	   question: 'What is the name of the offical national anthem of the USA?'

   })
});

/*
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
*/

 var server = app.listen(8000, function()
{
     var host = server.address().address;
     var port = server.address().port;

     console.log('Listening at http://%s:%s', host, port);

 });
