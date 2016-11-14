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
		it('Bonbons number = initBonbon nb', function() {
			server.initBonbon(hauteurGrille,largeurGrille,existedElements,bonbons)
			assert.equal(config.nbBonbon,bonbons.length);
		});
	});
});

// describe('Array', function() {
//     describe('#indexOf()', function() {
//         it('should return -1 when the value is not present', function() {
//             assert.equal(-1, [1, 2, 3].indexOf(4));
//         });
//     });
// });