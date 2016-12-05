var assert = require('assert');
var io = require('socket.io-client');
// var server = require('./server.js')
var request = require('request');
var url ="http://localhost:3000/getJoueurs";
var joueurs = [];

// describe('[2] Client', function () {
//     describe('1) Client number = 2', function () {
//         it('Client number = 2', function () {

//             assert.equal(joueurs.length, server.getJoueurs().length);
//         });
//     });
// });
for (var i = 0; i < 10; i++) {
    joueurs[i] = io.connect("http://localhost:3000").emit('start', { pseudo: "joueur" + i });
}

setInterval(function(){
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
        console.log('coucou salifou');
        console.log(data);
    }
});

},5000);
