var Quiz = function (io) {
  'use strict';
  this.SocketIO = io;
  this.Teams = {};
  this.CurrentQuestion = 1;
  this.TotalQuestions = 60;
};

Quiz.prototype.Socket = function Socket() {
  var io = this.SocketIO;
  var quiz = this;
  var lobby = require('./Lobby').Lobby(this);

  io.on('connection', function Connect(socket) {
    lobby.Socket(socket);

    socket.on('start quiz', function StartQuiz() {
      //console.log(quiz.Teams);
      for (var teamID in quiz.Teams) {

        var team = quiz.Teams[teamID];

        var nextQuestion = quiz.RenderJade('types/single-choice.jade', {
          team: team.Name,
          currentQuestion: quiz.CurrentQuestion,
          totalQuestions: quiz.TotalQuestions,
          countdown: '60',
          category: 'Music',
          question: 'What is the name of the offical national anthem of the USA?'
        });

        team.Socket.emit('body change', nextQuestion);
      }
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

