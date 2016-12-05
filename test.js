var assert = require('assert');
const config = require('./config.js');
var server = require('./server.js')

var existedElements=config.existedElements;
var nbBonbon = config.nbBonbon
var sizeOfElement = config.sizeOfElement
var hauteurGrille = config.hauteurGrille
var largeurGrille = config.largeurGrille

var bonbons = []; // Liste des Bonbons avec position

describe('[1] Bonbons', function() {
	describe('1)Bonbons number', function() {
		it('Bonbons number = initBonbon number', function() {
			server.initBonbon(hauteurGrille,largeurGrille,existedElements,bonbons)
			assert.equal(config.nbBonbon,bonbons.length);
		});
	});
});

