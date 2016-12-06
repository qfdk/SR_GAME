var assert = require('assert');

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';


var options = {
    transports: ['websocket'],
    'force new connection': true
};


/*
var data1 = { 'pseudo': 'Tom' };
var data2 = { 'pseudo': 'Sally' };

var client1 = io.connect(socketURL, options);

client1.on('connect', function(data) {
    client1.emit('start', data1);

    var client2 = io.connect(socketURL, options);

    client2.on('connect', function(data) {
        client2.emit('start', data2);
    });

});
*/

var ESC = 27;
var SPACE = 32;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var clients = []
var nbClient = 10

for (var i = 0; i < nbClient; i++) {
    clients[i] = io.connect(socketURL, options)

    var pseudo = 'joueur' + i
    clients[i].emit('start', { 'pseudo': pseudo });
}


setInterval(function() {

    for (var i = 0; i < nbClient; i++) {
        var randomDirection = Math.floor((Math.random() * 4) + 37);
        var nbMove = Math.floor((Math.random() * 10));
        for (var j = 0; j < nbMove; j++) {
            clients[i].emit('move', { 'direction': randomDirection })
        }
    }
}, 200);