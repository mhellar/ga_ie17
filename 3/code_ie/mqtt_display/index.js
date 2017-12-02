var app = require('express')();
var exec = require('child_process').exec;

var server = app.listen(3000);
var io = require('socket.io')(server);

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://10.0.0.193');

var say = 'say ';

function speak(whatosay) {
    //speak the string
    exec(say + whatosay);
    //log it to the console
    console.log(whatosay)
}

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
    if (message.toString() === '255000000') {
        speak("setting led to red");
    } else if (message.toString() === '000255000') {
        speak("setting led to green");
    } else if (message.toString() === '000000255') {
        speak("setting led to blue");
    }
});

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log(msg);
        client.publish('/leds', msg);
    });
});