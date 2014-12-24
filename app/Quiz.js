var Quiz = function (io) {
  'use strict';
  this.SocketIO = io;
  this.Teams = {};
};

Quiz.prototype.Socket = function Socket() {
  var io = this.SocketIO;
  var quiz = this;
  var lobby = require('./Lobby').Lobby(this);

  io.on('connection', function Connect(socket) {
    lobby.Socket(socket);

    socket.on('start quiz', function StartQuiz() {
      console.log(quiz.Teams);
    });

  });
};

Quiz.prototype.RenderJade = function RenderJade(path, data) {
  var appRoot = require('app-root-path');
  var jade = require('jade');
  var template = require('fs').readFileSync(appRoot + '/views/' + path, 'utf8');
  var jadeFn = jade.compile(template, { filename: path, pretty: true });
  var renderedTemplate = jadeFn( data );

  return renderedTemplate;
}

exports.Quiz = function (io) {
  return new Quiz(io);
};

