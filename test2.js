var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};

var socketURL = 'http://localhost:3000';

var clients = []
var nbClient = 5

for (var i = 0; i < nbClient; i++) {
    clients[i] = io.connect(socketURL, options)

    var pseudo = 'joueur' + i
    clients[i].emit('start', { 'pseudo': pseudo });
}

setInterval(function() {
    for (var i = 0; i < nbClient; i++) {
        var randomDirection = Math.floor((Math.random() * 4) + 37);
        var nbMove = Math.floor((Math.random() * 20));
        for (var j = 0; j < nbMove; j++) {
            clients[i].emit('move', { 'direction': randomDirection })
        }
    }
}, 200);