var Quiz = function (io) {
  'use strict';
  this.SocketIO = io;
  this.Teams = {};
  this.CurrentQuestion = 0;
  this.TotalQuestions = 0;
  this.CurrentCategory = 6;
  this.CurrentOffset = -1;
  this.CategoryName = '';
  this.CurrentCountdown = 60;
  this.CountdownID = 0;

  this.Database = require('./Database').Database();
  var quiz = this;
  this.Database.Query('SELECT count(id) as Total FROM questions', function(data) {
    quiz.TotalQuestions = data[0].Total;
  });

  this.Database.Query('SELECT count(id) as Total FROM categories', function(data) {
    quiz.TotalCategories = data[0].Total;
  });




};

Quiz.prototype.Socket = function Socket() {
  var io = this.SocketIO;
  var quiz = this;
  var lobby = require('./Lobby').Lobby(this);

  io.on('connection', function Connect(socket) {
    lobby.Socket(socket);

    socket.on('start quiz', function StartQuiz() {
      quiz.NextQuestion();

    });

    socket.on('send answer', function ReceiveAnswer(answer) {
      quiz.Teams[socket.id].AddAnswer(quiz.CurrentQuestion, answer);
      console.log(quiz.Teams[socket.id].Name + ': ' + answer);
    });
  });
};

Quiz.prototype.RenderNextQuestion = function RenderNextQuestion(team, question) {

  var nextQuestion = this.RenderJade('types/single-choice.jade', {
    team: team.Name,
    currentQuestion: this.CurrentQuestion,
    totalQuestions: this.TotalQuestions,
    countdown: question.countdown,
    category: question.category,
    question: question.question,
    answers: question.answers.split('|')
  });

  return nextQuestion;
};

Quiz.prototype.NextQuestion = function NextQuestion() {
  var quiz = this;

  this.GetNextQuestion(function(results) {
    if (results.length === 0) {

    }

    for (var teamID in quiz.Teams) {

      if (quiz.Teams.hasOwnProperty(teamID)) {
        var team = quiz.Teams[teamID];

        if (team == undefined) {
          continue;
        }

        var nextQuestion = quiz.RenderNextQuestion(team, results[0]);

        team.Socket.emit('body change', nextQuestion);
        quiz.SocketIO.emit('title change', quiz.CategoryName);
      }
    }

    quiz.Countdown();

  });
};

Quiz.prototype.GetNextQuestion = function GetNextQuestion(callback) {
  this.CurrentQuestion++;
  this.CurrentOffset++;
  var quiz = this;
  this.Database.Query('SELECT questions.question, questions.countdown, questions.answers, categories.category FROM questions INNER JOIN categories ON questions.category=categories.id WHERE questions.category=' + this.CurrentCategory + ' LIMIT ' + this.CurrentOffset + ',1', function (results) {
    if (results.length === 0) {
      quiz.CurrentCategory++;
      if (quiz.CurrentCategory === quiz.TotalCategories) {

      } else {
        quiz.GetNextQuestion(callback);
      }
    } else {
      quiz.CurrentCountdown = results[0].countdown;
      callback(results);
    }
  });
};

Quiz.prototype.Countdown = function Countdown() {
  this.CurrentCountdown--;
  var quiz = this;
  console.log('countdown');
  this.CountdownID =setTimeout(count, 1000);

  function count() {
    console.log(quiz.CurrentCountdown);
    quiz.CurrentCountdown--;
    quiz.SocketIO.emit('countdown', quiz.CurrentCountdown + 's');

    if (quiz.CurrentCountdown == 0) {
      for (var teamID in quiz.Teams) {

        var team = quiz.Teams[teamID];

        if (typeof team == undefined) {
          continue;
        }

        team.Socket.emit('request answer');

      }
    } else {
      quiz.CountdownID = setTimeout(count, 1000);
    }

  }
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

