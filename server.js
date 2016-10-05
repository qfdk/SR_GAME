// ----------------Configure--------------------
const config = require('./config.js');
// ---------------Environnement-----------------
var url = require('url');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var favicon = require('serve-favicon');

var users = [];
var jouers = [];

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
// -----------------socket.io----------------------
// ------------------------------------------------
io.sockets.on('connection', function (socket) {
    //--------------ajouter le client--------------
    if (users.indexOf(socket.id) === -1) {
        users.push(socket);
    }

    socket.on('start', function (data) {
        var index = users.indexOf(socket.id);
        jouers[index] = data;
        io.sockets.emit('ok', { msg: 'ok', jouers: { persdo: data.persdo, position: { x: 1, y: 2 } } });
        console.log(jouers[index]);
    });

    // ------------supprimer le client----------
    socket.on('disconnect', function (o) {
        var index = users.indexOf(socket.id);
        users.splice(index, 1);
        console.log("[user]" + index + " disconnected.")
    })
});