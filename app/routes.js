var express = require('express');
var router = express.Router();

var quiz = require('./Quiz').Quiz();

var clientLobby = require('./client/lobby').ClientLobby(global.io);
clientLobby.Socket();

var clientQuiz = require('./client/quiz').ClientQuiz(quiz, global.io);

var presenterLobby = require('./presenter/lobby').PresenterLobby(global.io);
var presenterQuiz = require('./presenter/quiz').PresenterQuiz(quiz, global.io);

router.get('/', function (req, res) {
  clientLobby.Route(req, res);
});

router.get('/quiz', function (req, res) {
  clientQuiz.Route(req, res);
});

router.get('/presenter', function (req, res) {
  presenterLobby.Route(req, res);
});

router.get('/presenter/quiz', function (req, res) {
  presenterQuiz.Route(req, res);
});

module.exports = router;
