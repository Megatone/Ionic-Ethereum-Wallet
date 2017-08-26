var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8000;
app.use(express.static('www'));
server.listen(port, function () {
    console.log("Iniciando Servidor Puerto : " + port);
});