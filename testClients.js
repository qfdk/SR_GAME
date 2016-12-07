var assert = require('assert');
var request = require('request');
var io = require('socket.io-client');
var url = "http://localhost:3000/getJoueurs";
var joueurs = [];
const NB_joueurs = 100;

for (var i = 0; i < NB_joueurs; i++) {
    joueurs[i] = io.connect("http://localhost:3000", {
        transports: ['websocket'],
        'force new connection': false
    }).emit('start', { pseudo: "joueur" + i });
}

request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
}, (err, res, data) => {
    if (err) {
        console.log('Error:', err);
    } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
    } else {
        // console.log(data.size);
        setTimeout(function () {
            assert.equal(data.size, NB_joueurs);
        }, 200000);
    }
});