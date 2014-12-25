var Team = function (name, socket) {
  'use strict';
  this.Name = name;
  this.Socket = socket;
  this.Answers = new Array();
};

Team.prototype.AddAnswer = function AddAnswer(number, answer) {
  this.Answers[number] = answer;
}

exports.Team = function (name, socket) {
  return new Team(name, socket);
};

