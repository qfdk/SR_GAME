var assert = require('assert');
var request = require('request');
var io = require('socket.io-client');
var url = "http://localhost:3000/getJoueurs";
var joueurs = [];
const NB_joueurs = 20;

describe('[1] Joueurs', function () {
    describe('1)', function () {
        it('Joueurs number = Our joueurs number ' + NB_joueurs, function () {
            setTimeout(function () {
                for (var i = 0; i < NB_joueurs; i++) {
                    joueurs[i] = io.connect("http://localhost:3000", {
                        transports: ['websocket'],
                        'force new connection': true
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
                        assert.equal(data.size, NB_joueurs);
                    }
                });
            }, NB_joueurs * 1000);
        });
    });
});