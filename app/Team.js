var Team = function (name, socket) {
  'use strict';
  this.Name = name;
  this.Socket = socket;
  this.Answers = {};
};

Team.prototype.AddAnswer = function AddAnswer(number, answer) {
  this.Answers[number] = answer;
}

Team.prototype.HasAnswered = function HasAnswered(number) {
  return this.Answers.hasOwnProperty(number);
};

exports.Team = function (name, socket) {
  return new Team(name, socket);
};

