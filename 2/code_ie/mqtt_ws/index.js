var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://35.167.192.176');
var app = require('express')();

var server = app.listen(3000);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


client.on('connect', function() {
    client.subscribe('/hello');
    // client.publish('presence', 'Hello mqtt');
});

client.on('message', function(topic, message) {
    // message is Buffer 
    incoming = message.toString()
    console.log(incoming);
    io.sockets.emit('data', {
        val: incoming
    });
});