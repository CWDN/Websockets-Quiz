var socket = io();
$('#nick_form').submit(function(){
    socket.emit('nickname', $('#nick').val());


    return false;

});
$('#message_form').submit(function(){
    var message = $('#nick').val() + ': ' + $('#m').val();
    socket.emit('chat message', message);
    $('#messages').append($('<li>').text(message));
    $('#m').val('');
    return false;
});
socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});
var clStatus;
socket.on('user typing', function(msg){
    clearTimeout(clStatus);
    if($('#status').val() == ''){
        $('#status').val(msg);
    }
    clStatus = setTimeout(function(){
        $('#status').val('');
    }, 500);
});

$('#m').on('keydown', function(){
   socket.emit('typing', $('#nick').val());
});

socket.on('online users', function(json_users){
    var users = JSON.parse(json_users);
    console.log(users);
    var html = "";
    $(users).each(function(index, element){
        html += '<li>' + element + '</li>';
    });
    console.log(html);
    $('#users').html(html);
});

/* var img = $('<img />', {src : 'images/bpb.png'});
img.appendTo('body');*/

