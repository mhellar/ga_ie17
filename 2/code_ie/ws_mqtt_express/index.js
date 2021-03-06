var app = require('express')();

var server = app.listen(3000);
var io = require('socket.io')(server);


var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://35.167.192.176');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


client.on('connect', function() {
    client.subscribe('/#');
    client.publish('/test', 'online');

});

client.on('message', function(topic, message) {
    // message is Buffer 
    console.log(message.toString());
    io.sockets.emit('data', message.toString());
});

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log(msg);
        client.publish('/test', msg);
    });
});