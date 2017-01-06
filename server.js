// ----------------Configure--------------------
const config = require('./config.js');
// ---------------Environnement-----------------
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');
// ------------------------------------------------
// -----------------INITIALISATION-----------------
// ------------------------------------------------
var sockets = []; // Liste des sockets client
var joueurs = []; // Players avec leurs infos : pseudo, score, position
var bonbons = []; // Liste des Bonbons avec position

var existedElements = config.existedElements;
var nbBonbon = config.nbBonbon
var sizeOfElement = config.sizeOfElement
var hauteurGrille = config.hauteurGrille
var largeurGrille = config.largeurGrille

// // Directions
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

// ------------express-------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('express').static(path.join(__dirname, 'public')));
server.listen(3000);
console.log('Server on 3000; http://localhost:3000')

initBonbon(); // first initialisation

// -----------------index-----------------
app.get('/', function(req, res) {
    res.render('index');
});


app.get('/getJoueurs', function(req, res) {
    res.json({ 'size': joueurs.length });
});

// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function(socket) {

    //--------------ajouter le client--------------
    if (sockets.indexOf(socket) === -1) {
        sockets.push(socket);
    }

    socket.on('start', function(data) {

        var newPosition = generateNewPosition();
        newX = (newPosition % largeurGrille) * sizeOfElement;
        newY = (Math.floor(newPosition / largeurGrille)) * sizeOfElement;

        var pseudo = data.pseudo;

        if (pseudo.trim() === '') {
            pseudo = "[invited] " + newX + newY
        }
        var joueur = {
            score: 0,
            pseudo: pseudo,
            x: newX,
            y: newY,
            id: socket.id,
            color: getRndColor()
        };
        joueurs.push(joueur);
        console.log("[INFO] " + "New player [" + joueur.pseudo + "] connected.");
        var result = {
            "msg": 'ok', // todo
            "joueurs": joueurs,
            "bonbons": bonbons
        };
        io.sockets.emit('ok', JSON.stringify(result));
    });

    // ------------supprimer le client----------
    socket.on('disconnect', function(o) {
        var indexSocket = sockets.indexOf(socket);
        var indexJoueur = getJoueurIndex(socket);
        if (indexSocket !== -1 && indexJoueur !== -1) {
            var tmp = joueurs[indexJoueur].pseudo;
            sockets.splice(indexSocket, 1);
            joueurs.splice(indexJoueur, 1);
            console.log("[INFO] " + "Player [" + tmp + "] disconnected.");
        }
    });

    // ------------ Move management ----------
    socket.on('move', function(data) {
        indexJoueur = getJoueurIndex(socket);
        if (indexJoueur !== -1) {
            var newX, newY;
            switch (data.direction) {
                case LEFT_ARROW:
                    newX = joueurs[indexJoueur].x - sizeOfElement;
                    newY = joueurs[indexJoueur].y;
                    if (newX >= 0)
                        moveTo(indexJoueur, newX, newY);
                    break;
                case UP_ARROW:
                    newX = joueurs[indexJoueur].x;
                    newY = joueurs[indexJoueur].y - sizeOfElement;
                    if (newY >= 0)
                        moveTo(indexJoueur, newX, newY);
                    break;

                case RIGHT_ARROW:
                    newX = joueurs[indexJoueur].x + sizeOfElement;
                    newY = joueurs[indexJoueur].y;
                    if (newX < largeurGrille * sizeOfElement)
                        moveTo(indexJoueur, newX, newY);
                    break;
                case DOWN_ARROW:
                    newX = joueurs[indexJoueur].x;
                    newY = joueurs[indexJoueur].y + sizeOfElement;
                    if (newY < hauteurGrille * sizeOfElement)
                        moveTo(indexJoueur, newX, newY);
                    break;
                default:
            }

            var result = {
                "msg": 'ok',
                "joueurs": joueurs,
                "bonbons": bonbons
            };

            if (bonbons.length == 0) {
                console.log("[info] Game finished.")
                io.sockets.emit('endGame', JSON.stringify(result));
                clearGame();
                initBonbon();
            } else {
                io.sockets.emit('ok', JSON.stringify(result));
            }
        }
    });
});

function initBonbon() {
    initBonbonConst
        (hauteurGrille, largeurGrille, existedElements, bonbons);
}

function initBonbonConst(hauteurGrille, largeurGrille, existedElements, bonbons) {
    for (var i = 0; i < hauteurGrille * largeurGrille; i++) {
        existedElements[i] = false;
    }
    // Initialisation of the BONBONS
    while (bonbons.length < nbBonbon) {
        var newPosition = generateNewPosition();
        x = (newPosition % largeurGrille) * sizeOfElement;
        y = (Math.floor(newPosition / largeurGrille)) * sizeOfElement;
        bonbons.push({ "x": x, "y": y });
    }
}


/**
 * Generate new position in the game
 * without duplication
 * to improve
 */
function generateNewPosition() {
    var number;
    do {
        number = Math.floor(Math.random() * hauteurGrille * largeurGrille);
    }
    while (existedElements[number]);
    existedElements[number] = true;
    return number;
}

/**
 * getJoueurIndex(socket)
 * return indice of joueur
 */
function getJoueurIndex(socket) {
    var id = socket.id;
    var index = -1;
    joueurs.forEach(function(joueur) {
        if (joueur.id === id) {
            index = joueurs.indexOf(joueur);
        }
    }, this);
    return index;
}

/**
 * Core of move into new place
 * 3 cases : new place is Free, there is a player, there is a bonbon
 */
function moveTo(indexJoueur, newX, newY) {

    var finished = false;
    var joueur = joueurs[indexJoueur];
    // Check if there is already a player in newX,newY
    joueurs.forEach(function(j) {
        if (j.x === newX && j.y === newY) {
            finished = true;
        }
    }, this);

    // Check if there is a bonbon in x,y
    if (!finished) {
        bonbons.forEach(function(bonbon) {
            if (bonbon.x === newX && bonbon.y === newY) {
                bonbons.splice(bonbons.indexOf(bonbon), 1);
                joueur.x = newX;
                joueur.y = newY;
                joueur.score++; // to improve
                finished = true;
            }
        }, this);
    }
    // The place is Free
    if (!finished) {
        joueur.x = newX;
        joueur.y = newY;
    }
}

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function clearGame() {
    sockets.forEach(function(s) {
        s.disconnect(true);
    });
    joueurs = [];
}

module.exports.initBonbon = initBonbonConst;
module.exports.generateNewPosition = generateNewPosition;