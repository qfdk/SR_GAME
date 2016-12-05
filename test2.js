var assert = require('assert');
const config = require('./config.js');
var server = require('./server.js')
var io = require('socket.io-client');

var existedElements = config.existedElements;
var nbBonbon = config.nbBonbon
var sizeOfElement = config.sizeOfElement
var hauteurGrille = config.hauteurGrille
var largeurGrille = config.largeurGrille

var bonbons = []; // Liste des Bonbons avec position

describe('[1] Bonbons', function() {
    describe('1)Bonbons number', function() {
        it('Bonbons number = initBonbon nb', function() {
            server.initBonbon(hauteurGrille, largeurGrille, existedElements, bonbons)
            assert.equal(config.nbBonbon, bonbons.length);
        });
    });
});


var clients = []
var socketURL = "http://localhost:3000"

for (var i = 0; i < 1000; i++) {
    clients[i] = io.connect(socketURL);
}

describe('[2] Socket.io', function() {
    describe('1)Number client connected', function() {
        it('client connected', function() {
            server.initBonbon(hauteurGrille, largeurGrille, existedElements, bonbons)
            assert.equal(100, server.getJoueurs());
        });
    });
});