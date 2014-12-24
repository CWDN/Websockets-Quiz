var ClientLobby = function ClientLobby(socketIO) {
  'use strict';

  this.SocketIO = socketIO;
};

ClientLobby.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('client-lobby', {
    title : 'Lobby',
    team: 'The Oldies with an extremely long name',
    currentQuestion: '19',
    totalQuestions: '60',
    countdown: '60',
    category: 'Music',
    question: 'What is the name of the offical national anthem of the USA?'
  });
};

ClientLobby.prototype.Socket = function Socket() {

  var teams = {};
  var team = require('../Team');
  var io = this.SocketIO;

  var renderTeams = function RenderTeams(teams) {

    var teamsArray = new Array();

    for (var property in teams) {
      if (teams.hasOwnProperty(property)) {
        teamsArray.push(teams[property].Name);
      }
    }

    var pathToTemplate = __dirname + '../../../views/partials/lobby-team.jade';
    var jade = require('jade');
    var template = require('fs').readFileSync(pathToTemplate, 'utf8');
    var jadeFn = jade.compile(template, { filename: pathToTemplate, pretty: true });
    var renderedTemplate = jadeFn( { teams: teamsArray } );

    return renderedTemplate;
  };

  io.on('connection', function Connect(socket) {
    console.log('a user connected');

    var totalTeams = 0;

    for (var property in teams) {
      if (teams.hasOwnProperty(property)) {
        totalTeams++;
      }
    }

    teams[socket.id] = new team.Team('Team' + (totalTeams + 1), socket);

    io.sockets.emit('teams update', renderTeams(teams));

    socket.on('disconnect', function Disconnect() {
      delete teams[socket.id];
      socket.broadcast.emit('teams update', renderTeams(teams));
      console.log('a user disconnected');
    });

    socket.on('team name update', function TeamNameUpdate(name) {

      teams[socket.id].Name = name;

      io.sockets.emit('teams update', renderTeams(teams));
    });

//    fs.readFile('./images/lil-llama.jpg', function (err, buf) {
//      socket.emit('image', { buffer: buf });
//    });
  });
};

exports.ClientLobby = function Contructor(socketIO) {
  return new ClientLobby(socketIO);
};
