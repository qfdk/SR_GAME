var assert = require('assert');
var request = require('request');
var expect = require("chai").expect;
var httpUtils = require('request-mocha')(request);
var io = require('socket.io-client');
var sleep = require('sleep');

var url = "http://localhost:3000/getJoueurs";
var joueurs = [];
const NB_joueurs = 1000;

for (var i = 0; i < NB_joueurs; i++) {
    joueurs[i] = io.connect("http://localhost:3000", {
        transports: ['websocket'],
        'force new connection': false
    }).emit('start', { pseudo: "joueur" + i });
}

// sleep.sleep(10);

// describe('[1] Joueurs test', function () {
//     httpUtils.save(url);
//     it('responded with number Joueurs', function () {
//         expect(this.err).to.equal(null);
//         expect(this.res.statusCode).to.equal(200);
//         expect(this.body).to.equal('{"size":' + NB_joueurs + '}');
//     });
// });