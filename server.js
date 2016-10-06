// ----------------Configure--------------------
const config = require('./config.js');
// ---------------Environnement-----------------
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');

var users = []; // Client connecté
var joueurs = []; // Liste des jouers avec leurs infos : pseudo, score, position
var bonbons = []; // Liste des bonbons avec position
var nbBonbon = 5; // Nombre de bonbon dans le jeune

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
// -----------------Generation of bonbons----------------------
// ------------------------------------------------
while(bonbons.length<nbBonbon)
{
  // TODO : Check que 2 bonbons peuvent pas avoir la meme position
  var b = {};
  b.x =  Math.floor(Math.random() * 100);
  b.y =  Math.floor(Math.random() * 100);
  bonbons.push({"x":b.x,"y":b.y});
}


// ------------------------------------------------
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function (socket) {
    //--------------ajouter le client--------------
    if (users.indexOf(socket.id) === -1) {
        users.push(socket);
    }

    socket.on('start', function (data) {
        var index = users.indexOf(socket.id);

        joueurs.push({
            score:0,
            pseudo:data.pseudo,
            x:10,
            y:20,
            index:index
          });

        var result = {
          "msg":'ok',
          "joueurs" : joueurs,
          "bonbons" : bonbons
        };

        io.sockets.emit('ok',JSON.stringify(result));
        console.log(JSON.stringify(result, undefined, 2));
    });

    // ------------supprimer le client----------
    socket.on('disconnect', function (o) {
        var index = users.indexOf(socket.id);
        users.splice(index, 1);
        console.log("[user]" + index + " disconnected.");
    });
});
