var Lobby = function (quiz) {
  'use strict';
  this.Quiz = quiz;
};

Lobby.prototype.Socket = function Socket(socket) {
  var teams = this.Quiz.Teams;
  var team = require('./Team');
  var io = this.Quiz.SocketIO;
  var quiz = this.Quiz;

  var renderTeams = function RenderTeams(teams) {

    var teamsArray = new Array();

    for (var property in teams) {
      if (!teams.hasOwnProperty(property)) {
        continue;
      }
      if (teams[property] == undefined) {
        continue;
      }
      teamsArray.push(teams[property].Name);
    }

    var pathToTemplate = 'partials/lobby-team.jade';
    var data = { teams: teamsArray };

    return quiz.RenderJade(pathToTemplate, data);
  };

  var referer = socket.handshake.headers.referer;
  var url = require("url");
  referer = url.parse(referer).pathname;

  if (referer.indexOf('presenter') === -1) {
    console.log('a team connected');
    var totalTeams = 0;

    for (var property in teams) {
      if (!teams.hasOwnProperty(property)) {
        continue;
      }
      if (teams[property] == undefined) {
        continue;
      }
      totalTeams++;
    }
    teams[socket.id] = new team.Team('Team ' + (totalTeams + 1), socket);

    socket.join('teams');

  } else {
    console.log('a presenter connected');
    socket.join('presenters');
  }
  if (!quiz.Started)
    io.sockets.emit('teams update', renderTeams(teams));

  socket.on('disconnect', function Disconnect() {
    teams[socket.id] = undefined;
    if (!quiz.Started)
      socket.broadcast.emit('teams update', renderTeams(teams));
    console.log('a user disconnected');
  });

  socket.on('team name update', function TeamNameUpdate(name) {
    teams[socket.id].Name = name;
    if (!quiz.Started)
      io.sockets.emit('teams update', renderTeams(teams));
  });

    //    fs.readFile('./images/lil-llama.jpg', function (err, buf) {
    //      socket.emit('image', { buffer: buf });
    //    });

};


exports.Lobby = function (quiz) {
  return new Lobby(quiz);
};

