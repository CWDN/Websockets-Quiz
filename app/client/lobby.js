var ClientLobby = function ClientLobby() {
  'use strict';

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

exports.ClientLobby = function Contructor() {
  return new ClientLobby();
};
