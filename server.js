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
var nbBonbon = 2; // Nombre de bonbon dans le jeune
var sizeOfElement = 10;
var hauteurGrille = 400 / sizeOfElement;
var largeurGrille = 400 / sizeOfElement;

// Directions
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

// ------------express-------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('express').static(path.join(__dirname, 'public')));
server.listen(3000);
console.log('Server on 3000; http://localhost:3000')

// -----------------index-----------------
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/info', function(req, res) {
    res.render({ user: 'info' });
});

// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function(socket) {

    //--------------ajouter le client--------------
    if (sockets.indexOf(socket) === -1) {
        sockets.push(socket);
        console.log("+1")
    }

    socket.on('start', function(data) {
        var newPosition = generateNewPosition();
        newX = (newPosition % largeurGrille) * sizeOfElement;
        newY = (Math.floor(newPosition / largeurGrille)) * sizeOfElement;
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
    socket.on('disconnect', function(o) {
        var index = sockets.indexOf(socket);
        var indexJoueur = getJoueurIndex(socket);
        if (index !== -1) {
            var tmp = joueurs[indexJoueur].pseudo;
            sockets.splice(index, 1);
            joueurs.splice(indexJoueur, 1);
            console.log("[INFO] " + "Player [" + tmp + "] disconnected.");
        }
    });

    // ------------ Move management ----------
    socket.on('move', function(data) {
        index = getJoueurIndex(socket);

        var newX, newY;
        switch (data.direction) {
            case LEFT_ARROW:
                newX = joueurs[index].x - sizeOfElement;
                newY = joueurs[index].y;
                if (newX >= 0)
                    moveTo(index, newX, newY);
                break;
            case UP_ARROW:
                newX = joueurs[index].x;
                newY = joueurs[index].y - sizeOfElement;
                if (newY >= 0)
                    moveTo(index, newX, newY);
                break;

            case RIGHT_ARROW:
                newX = joueurs[index].x + sizeOfElement;
                newY = joueurs[index].y;
                if (newX < largeurGrille * sizeOfElement)
                    moveTo(index, newX, newY);
                break;
            case DOWN_ARROW:
                newX = joueurs[index].x;
                newY = joueurs[index].y + sizeOfElement;
                if (newY < hauteurGrille * sizeOfElement)
                    moveTo(index, newX, newY);
                break;
            default:
        }

        var result = {
            "msg": 'ok',
            "joueurs": joueurs,
            "bonbons": bonbons
        };

        if (bonbons.length == 0) {
            console.log("Bonbon finished")
            io.sockets.emit('endGame', JSON.stringify(result));
        }
        else
        {
        io.sockets.emit('ok', JSON.stringify(result));
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
    x = (newPosition % largeurGrille) * sizeOfElement;
    y = (Math.floor(newPosition / largeurGrille)) * sizeOfElement;
    bonbons.push({ "x": x, "y": y });
}
/**
 * getJoueurIndex(socket)
 * return indice of joueur
 */
function getJoueurIndex(socket) {
    var id = socket.id;
    var index = -1;
    joueurs.forEach(function(j) {
        if (j.id === id) {
            index = joueurs.indexOf(j);
        }
    }, this);
    return index;
}

/**
 * Core of move into new place
 * 3 cases : new place is Free, there is a player, there is a bonbon
 */
function moveTo(indexJoueur, newX, newY) {

    var exit = false;

    // Check if there is already a player in x,y
    joueurs.forEach(function(j) {

        if (j.x === newX && j.y === newY) {
            exit = true;
        }
    }, this);


    // Check if there is a bonbon in x,y
    if (!exit) {
        bonbons.forEach(function(b) {
            if (b.x === newX && b.y === newY) {
                bonbons.splice(bonbons.indexOf(b), 1);

                joueurs[indexJoueur].x = newX;
                joueurs[indexJoueur].y = newY;
                joueurs[indexJoueur].score++;

                exit = true;
            }
        }, this);
    }
    // The place is Free
    if (!exit) {
        joueurs[indexJoueur].x = newX;
        joueurs[indexJoueur].y = newY;
    }
}