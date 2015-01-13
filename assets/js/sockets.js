$(function () {

  var ua = navigator.userAgent,
      clickEvent = (ua.match(/iPad/i)) ? "touchstart" : "click";

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
    $('[data-toggle="tooltip"]').tooltip();
  });

  socket.on('title change', function(title) {
    document.title = title;
  });

  socket.on('countdown', function(time) {
    $('.countdown-text').html(time);
  });

  socket.on('request answer', sendAnswer);

  $('body').on(clickEvent, '#confirm-answer', function () {
    sendAnswer();
  });

  if (clickEvent == 'touchstart') {
    $('body').on(clickEvent, '.answer', function () {
      $(this).click();
    });
  }

  function sendAnswer() {
    $('.answer').attr('disabled', 'disabled');
    $('#confirm-answer').attr('disabled', 'disabled');
    var answer = $('.answers input:checked').val();
    socket.emit('send answer', answer);
  }
  $('body').on('click', '.progress', function () {
    if ($('.countdown-text i').length === 0) {
      socket.emit('pause quiz');
    } else {
      socket.emit('resume quiz');
    }
  });

  socket.on('pause quiz', function () {
    $('.countdown-text').html('<i class="fa fa-pause"></i>');
  });

  socket.on('presenter team submit', function (id) {
    $('#' + id + ' i').removeClass('fa-spin fa-spinner');
    $('#' + id + ' i').addClass('fa-check');
  });

  socket.on('presenter countdown progress', function (width) {
    $('.progress-bar').width(width);
  });

  //endregion

});
