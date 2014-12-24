var Team = function (name, socket) {
  'use strict';
  this.Name = name;
  this.Socket = socket;
};

exports.Team = function (name, socket) {
  return new Team(name, socket);
};

