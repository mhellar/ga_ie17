var app = require('express')();
var exec = require('child_process').exec;

var server = app.listen(3000);
var io = require('socket.io')(server);

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://ec2-35-161-110-220.us-west-2.compute.amazonaws.com');

var say = 'say ';

function speak(whatosay){
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
    if(message.toString() === '1'){
    speak("-v Agnes setting led to red");
}   else if(message.toString() === '2'){
    speak("-v Daniel setting led to green");
}   else if(message.toString() === '3'){
    speak("-v Ralph setting led to blue");
}   else if(message.toString() === 'hello'){
    speak("-v Zarvox greeting human");
}   else if(message.toString() === '5'){
    speak("-v Fred Ryan is new media director");
}
});

io.on('connection', function(socket) {
    socket.on('message', function(msg) {
        console.log(msg);
        client.publish('/test', msg);
    });
});