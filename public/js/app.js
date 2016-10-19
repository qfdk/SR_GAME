/**
 * Created by qfdk on 16/3/2.
 */

$('#myModal').modal('show')

var socket = io.connect('http://localhost:3000');

$('#btnStart').click(function () {
    socket.emit('start', { pseudo: filterXSS($('#pseudo').val()) });
});

$('#myModal').keyup(function (evt) {
    if (evt.keyCode == 13) {
        socket.emit('start', { pseudo: filterXSS($('#pseudo').val()) })
        $('#myModal').modal('hide');
    }
});
socket.on('ok', function (data) {
    var score = ""
    var joueurs = [];
    joueurs = JSON.parse(data).joueurs;


    for (var i = 0; i < joueurs.length; i++) {
        var j = joueurs[i];
        score += j.pseudo + " => " + j.score + "</BR> "
    }

    drawGame(JSON.parse(data));
    $('#score').html(score)
});

socket.on('endGame', function (data) {
    drawGame(JSON.parse(data));

    var result = "Game finished and SCORE are : \n";
    joueurs = JSON.parse(data).joueurs;
    for (var i = 0; i < joueurs.length; i++) {
        var j = joueurs[i];
        result += j.pseudo + " ===> " + j.score + "\n"
    }
    alert(result);
    location.reload();

});


var ESC = 27;
var SPACE = 32;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;


$(document).ready(function () {
    $('body').keydown(keyPressedHandler);
});


function keyPressedHandler(e) {
    var code = (e.keyCode ? e.keyCode : e.which);

    switch (code) {
        case LEFT_ARROW:
        case UP_ARROW:
        case RIGHT_ARROW:
        case DOWN_ARROW:
            socket.emit('move', { direction: code })
            break;
        case SPACE:
            // TODO
            break;
        case ESC:
            // TODO
            socket.disconnect();
            location.reload();
            break;
        default:
    }
}

function drawGame(data) {
    var c = document.getElementById("gameCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    // draw players
    var joueurs = data.joueurs
    for (var i = 0; i < joueurs.length; i++) {

        var x = joueurs[i].x;
        var y = joueurs[i].y;
        ctx.beginPath();
        ctx.fillStyle = "black"
        ctx.fillRect(x, y, 10, 10);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    // draw food
    var bonbons = data.bonbons;
    for (var i = 0; i < bonbons.length; i++) {

        var x = bonbons[i].x;
        var y = bonbons[i].y;

        ctx.beginPath();
        ctx.fillStyle = "red"
        ctx.fillRect(x, y, 10, 10);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

//************************//