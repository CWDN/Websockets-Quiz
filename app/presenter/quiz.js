var PresenterQuiz = function PresenterQuiz(quiz) {
  'use strict';

  this.quiz = quiz;
};


PresenterQuiz.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('types/single-choice', {
    title           : 'Presenter Quiz',
    team            : 'The Oldies with an extremely long name',
    currentQuestion : '19',
    totalQuestions  : '60',
    countdown       : '60',
    category        : 'Music',
    question        : 'What is the name of the offical national anthem of the USA?'
  });
};

exports.PresenterQuiz = function Constructor(quiz) {
  return new PresenterQuiz(quiz);
};
