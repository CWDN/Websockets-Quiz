$(function () {
  $('[data-toggle="tooltip"]').tooltip();

  var socket = io();

  // region Lobby

  $('.teamName form').submit(function () {
    var teamName = $('.teamName input').val();
    socket.emit('team name update', teamName);
    return false;
  });

  $('#lobby-start').click(function () {
    socket.emit('start quiz', '');
  });

  socket.on('teams update', function TeamUpdate(teams) {
    $('.teams').html(teams);
  });

  socket.on('start quiz', function StartQuiz(url) {
    window.location.url = url;
  });

  // endregion

  //region Quiz

  socket.on('body change', function (html) {
    $('body').html(html);
  });

  socket.on('title change', function(title) {
    document.title = title;
  });

  //endregion

});
