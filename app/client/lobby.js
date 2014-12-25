var ClientLobby = function ClientLobby() {
  'use strict';

};

ClientLobby.prototype.Route = function Route(req, res) {
  'use strict';

  res.render('client-lobby', {
    title  : 'Lobby',
    layout : true
  });
};

exports.ClientLobby = function Contructor() {
  return new ClientLobby();
};
