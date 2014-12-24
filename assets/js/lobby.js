$(function () {
  var socket = io();

  $('.teamName form').submit(function () {
    var teamName = $('.teamName input').val();
    socket.emit('team name update', teamName);
    return false;
  });

  socket.on('teams update', function TeamUpdate(teams) {
    $('.teams').html(teams);
  });
});
