var PresenterLobby = function PresenterLobby(socketIO) {
  'use strict';

  this.SocketIO = socketIO;
};

PresenterLobby.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('presenter-lobby', {
    title : 'Presenter Lobby',
    team: 'The Oldies with an extremely long name',
    currentQuestion: '19',
    totalQuestions: '60',
    countdown: '60',
    category: 'Music',
    question: 'What is the name of the offical national anthem of the USA?'
  });
};

exports.PresenterLobby = function Constructor(socketIO) {
  return new PresenterLobby(socketIO);
};
