// ----------------Configure--------------------
const config = require('./config.js');
// ---------------Environnement-----------------
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');

var sockets = []; // Liste des sockets client
var joueurs = []; // Players avec leurs infos : pseudo, score, position

var bonbons = []; // Liste des Bonbons avec position
var nbBonbon = 10; // Nombre de bonbon dans le jeune
var hauteurGrille = 20;
var largeurGrille = 20;

// ------------express-------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('express').static(path.join(__dirname, 'public')));
server.listen(3000);
console.log('Server on 3000; http://localhost:3000')

// -----------------index-----------------
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api/info', function (req, res) {
    res.render({ user: 'info' });
});

// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function (socket) {

    //--------------ajouter le client--------------
    if (sockets.indexOf(socket) === -1) {
        sockets.push(socket);
        console.log("+1")
    }

    socket.on('start', function (data) {
        var newPosition = generateNewPosition();
        newX = newPosition % largeurGrille;
        newY = Math.floor(newPosition / largeurGrille);
        var joueur = {
            score: 0,
            pseudo: data.pseudo,
            x: newX,
            y: newY,
            id: socket.id
        };
        joueurs.push(joueur);
        console.log("[INFO] " + "New player [" + joueur.pseudo + "] connected.");
        var result = {
            "msg": 'ok',
            "joueurs": joueurs,
            "bonbons": bonbons
        };
        io.sockets.emit('ok', JSON.stringify(result));
    });

    // ------------supprimer le client----------
    socket.on('disconnect', function (o) {
        var index = sockets.indexOf(socket);
        var indexJoueur = getJoueurIndex(socket);
        if (index !== -1) {
            var tmp = joueurs[indexJoueur].pseudo;
            sockets.splice(index, 1);
            joueurs.splice(indexJoueur, 1);
            console.log("[INFO] " + "Player [" + tmp + "] disconnected.");
        }
    });
});


// ------------------------------------------------
// -----------------INITIALISATION-----------------
// ------------------------------------------------
var existingNumbers = [];
for (var i = 0; i < hauteurGrille * largeurGrille; i++) {
    existingNumbers[i] = false;
}

/**
* Generate new position in the game
* without duplication
*/
function generateNewPosition() {
    var number;
    do {
        number = Math.floor(Math.random() * hauteurGrille * largeurGrille);
    }
    while (existingNumbers[number]);
    existingNumbers[number] = true;
    return number;
}
// Initialisation of the BONBONS
while (bonbons.length < nbBonbon) {
    var newPosition = generateNewPosition();
    x = newPosition % largeurGrille;
    y = Math.floor(newPosition / largeurGrille);
    bonbons.push({ "x": x, "y": y });
}
/**
 * getJoueurIndex(socket)
 * return indice of joueur
 */
function getJoueurIndex(socket) {
    var id = socket.id;
    var index = -1;
    joueurs.forEach(function (j) {
        if (j.id === id) {
            index = joueurs.indexOf(j);
        }
    }, this);
    return index;
}