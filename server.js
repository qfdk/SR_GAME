// ----------------Configure--------------------
const config = require('./config.js');
// ---------------Environnement-----------------
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');

var users = []; // Liste des sockets client, la clé est scoket.id 
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

// -----------------index-----------------
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/position', function (req, res) {

});

// ------------------------------------------------
// -----------------INITIALISATION----------------------
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

// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function (socket) {
    //--------------ajouter le client--------------
    if (typeof users[socket.id] === 'undefined') {
        users[socket.id] = socket;
        console.log("[INFO] New user added with id " + users[socket.id].id);
    }

    socket.on('start', function (data) {
        var index = users[socket.id].id;

        var newPosition = generateNewPosition();
        newX = newPosition % largeurGrille;
        newY = Math.floor(newPosition / largeurGrille);

        joueurs.push({
            score: 0,
            pseudo: data.pseudo,
            x: newX,
            y: newY,
            index: index
        });

        var result = {
            "msg": 'ok',
            "joueurs": joueurs,
            "bonbons": bonbons
        };

        io.sockets.emit('ok', JSON.stringify(result));
        console.log(JSON.stringify(result, undefined, 2));
    });

    // ------------supprimer le client----------
    socket.on('disconnect', function (o) {
        var index = users[socket.id].id;
        users.splice(index, 1);
        console.log("[INFO]" + "Deconnexion of client " + index);
    });


});


