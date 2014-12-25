var PresenterLobby = function PresenterLobby() {
  'use strict';
};

PresenterLobby.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('presenter-lobby', {
    title  : 'Presenter Lobby',
    layout : true
  });
};

exports.PresenterLobby = function Constructor() {
  return new PresenterLobby();
};
