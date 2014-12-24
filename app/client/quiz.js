var ClientQuiz = function ClientQuiz(quiz, socketIO) {
  'use strict';

  this.Quiz = quiz;
  this.SocketIO = socketIO;
};

ClientQuiz.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('types/single-choice', {
    title : 'Music',
    team: 'The Oldies with an extremely long name',
    currentQuestion: '19',
    totalQuestions: '60',
    countdown: '60',
    category: 'Music',
    question: 'What is the name of the offical national anthem of the USA?'
  });
};

exports.ClientQuiz = function Constructor(quiz, socketIO) {
  return new ClientQuiz(quiz, socketIO);
};
