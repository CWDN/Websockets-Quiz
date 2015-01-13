var Quiz = function (io) {
  'use strict';
  this.SocketIO = io;
  this.Teams = {};
  this.CurrentQuestion = 0;
  this.TotalQuestions = 0;
  this.CurrentQuestionID = 0;
  this.CurrentCategory = 1;
  this.CurrentOffset = -1;
  this.CategoryName = '';
  this.CurrentCountdown = 60;
  this.TotalCountdown = 60;
  this.CountdownID = 0;
  this.Started = false;

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
      quiz.Started = true;

    });

    socket.on('send answer', function ReceiveAnswer(answer) {
      quiz.Teams[socket.id].AddAnswer(quiz.CurrentQuestionID, answer);

      if (quiz.CheckAllHaveAnswered()) {
        quiz.NextQuestion();
      } else {
        quiz.SocketIO.to('presenters').emit('presenter team submit', socket.id);
      }
    });

    socket.on('pause quiz', function PauseQuiz() {
      clearTimeout(quiz.CountdownID);
      quiz.SocketIO.emit('pause quiz');
    });

    socket.on('resume quiz', function ResumeQuiz() {
      quiz.Countdown();
    });
  });
};

Quiz.prototype.RenderTeamNextQuestion = function RenderTeamNextQuestion(team, question) {

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

Quiz.prototype.RenderPresenterNextQuestion = function RenderPresenterNextQuestion(teams, question) {

  var nextQuestion = this.RenderJade('presenter-question.jade', {
    teams: teams,
    currentQuestion: this.CurrentQuestion,
    totalQuestions: this.TotalQuestions,
    countdown: question.countdown,
    category: question.category,
    question: question.question
  });

  return nextQuestion;
};


Quiz.prototype.NextQuestion = function NextQuestion() {
  var quiz = this;

  clearTimeout(this.CountdownID);

  this.GetNextQuestion(function(results) {
    if (results.length === 0) {

    }

    var teamNames = new Array();

    for (var teamID in quiz.Teams) {

      if (quiz.Teams.hasOwnProperty(teamID)) {
        var team = quiz.Teams[teamID];

        if (team == undefined) {
          continue;
        }

        teamNames.push({ Name: team.Name, ID: team.Socket.id });

        var teamNextQuestion = quiz.RenderTeamNextQuestion(team, results[0]);

        team.Socket.emit('body change', teamNextQuestion);
      }
    }
    var presenterNextQuestion = quiz.RenderPresenterNextQuestion(teamNames, results[0]);

    quiz.SocketIO.to('presenters').emit('body change', presenterNextQuestion);

    quiz.SocketIO.emit('title change', quiz.CategoryName);

    quiz.Countdown();

  });
};

Quiz.prototype.GetNextQuestion = function GetNextQuestion(callback) {
  this.CurrentOffset++;
  var quiz = this;
  this.Database.Query('SELECT questions.id, questions.question, questions.countdown, questions.answers, categories.category FROM questions INNER JOIN categories ON questions.category=categories.id WHERE questions.category=' + this.CurrentCategory + ' LIMIT ' + this.CurrentOffset + ',1', function (results) {
    if (results.length === 0) {
      quiz.CurrentCategory++;
      quiz.CurrentOffset = -1;
      if (quiz.CurrentCategory === quiz.TotalCategories + 1) {
        quiz.EndQuiz();
      } else {
        quiz.GetNextQuestion(callback);
      }
    } else {
      quiz.CurrentCountdown = results[0].countdown;
      quiz.TotalCountdown = results[0].countdown;
      quiz.CurrentQuestionID = results[0].id;
      quiz.CurrentQuestion++;
      callback(results);
    }
  });
};

Quiz.prototype.CheckAllHaveAnswered = function CheckAllHaveAnswered() {
  var allAnswered = true;

  for (var teamID in this.Teams) {

    if (this.Teams.hasOwnProperty(teamID)) {
      var team = this.Teams[teamID];

      if (team == undefined) {
        continue;
      }

      if (!team.HasAnswered(this.CurrentQuestion)) {
        allAnswered = false;
        break;
      }
    }
  }

  return allAnswered;

};

Quiz.prototype.Countdown = function Countdown() {
  var quiz = this;
  console.log('countdown');
  quiz.SocketIO.emit('countdown', quiz.CurrentCountdown + 's');
  quiz.SocketIO.to('presenters').emit('presenter countdown progress', (100 / (quiz.TotalCountdown / quiz.CurrentCountdown)) + '%');
  this.CountdownID = setTimeout(count, 1000);

  function count() {
    quiz.CurrentCountdown--;
    quiz.SocketIO.emit('countdown', quiz.CurrentCountdown + 's');
    quiz.SocketIO.to('presenters').emit('presenter countdown progress', (100 / (quiz.TotalCountdown / quiz.CurrentCountdown)) + '%');

    if (quiz.CurrentCountdown == 0) {
      for (var teamID in quiz.Teams) {

        var team = quiz.Teams[teamID];

        if (team === undefined) {
          continue;
        }

        team.Socket.emit('request answer');

      }
    } else {
      quiz.CountdownID = setTimeout(count, 1000);
    }

  }
};

Quiz.prototype.EndQuiz = function EndQuiz() {
  var quiz = this;
  this.Database.Query('SELECT id, question, correctAnswer FROM questions;', function (results) {

    var presenterData = new Array();
    var totalTeamCorrectAnswers = {};
    var teamsData = {};

    for (var result in results) {
      var result = results[result];
      var question = {};
      question.question = result.question;
      question.correctAnswer = result.correctAnswer;

      var teamAnswers = new Array();

      for (var teamID in quiz.Teams) {

        if (quiz.Teams.hasOwnProperty(teamID)) {
          var team = quiz.Teams[teamID];

          if (team == undefined) {
            continue;
          }

          var teamQuestion = {
            question      : question.question,
            correctAnswer : question.correctAnswer,
            team          : {
              Name   : team.Name,
              Answer : team.Answers[result.id]
            }
          };

          if (teamsData[team.Socket.id] === undefined) {
            teamsData[team.Socket.id] = { totalCorrect: 0 };
          }

          var teamQuestions = teamsData[team.Socket.id].teamQuestions;

          if (teamQuestions === undefined) {
            teamQuestions = new Array();
          }

          teamQuestions.push(teamQuestion);

          teamsData[team.Socket.id].teamQuestions = teamQuestions;

          if (teamQuestion.correctAnswer == teamQuestion.team.Answer) {
            teamsData[team.Socket.id].totalCorrect += 1;

            if (totalTeamCorrectAnswers[team.Socket.id] === undefined) {
              totalTeamCorrectAnswers[team.Socket.id] = {
                correctAnswers : 0,
                name           : team.Name
              };
            }

            totalTeamCorrectAnswers[team.Socket.id].correctAnswers += 1;
          }

          teamAnswers.push({
            Name   : team.Name,
            Answer : team.Answers[result.id]
          });
        }
      }

      question.teams = teamAnswers;
      presenterData.push(question);
    }

    totalTeamCorrectAnswersArray = new Array();

    for (teamID in totalTeamCorrectAnswers) {
      var team = totalTeamCorrectAnswers[teamID];

      totalTeamCorrectAnswersArray.push(team);
    }

    function sortTeamsScore(a,b) {
      if (a.correctAnswers < b.correctAnswers)
        return 1;
      if (a.correctAnswers > b.correctAnswerss)
        return -1;
      return 0;
    }

    totalTeamCorrectAnswersArray.sort(sortTeamsScore);

    console.log(totalTeamCorrectAnswersArray);

    var presenterResults = quiz.RenderJade('presenter-results.jade', {
      questions      : presenterData,
      leaderboard    : totalTeamCorrectAnswersArray,
      totalQuestions : quiz.TotalQuestions
    });

    for (var teamID in quiz.Teams) {

      if (quiz.Teams.hasOwnProperty(teamID)) {
        var team = quiz.Teams[teamID];

        if (team == undefined) {
          continue;
        }

        var teamResults = quiz.RenderJade('client-results.jade', {
          questions      : teamsData[team.Socket.id].teamQuestions,
          totalCorrect   : teamsData[team.Socket.id].totalCorrect,
          totalQuestions : quiz.TotalQuestions
        });

        team.Socket.emit('body change', teamResults);

      }
    }

    quiz.SocketIO.to('presenters').emit('body change', presenterResults);
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

