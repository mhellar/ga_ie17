var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://35.167.192.176');

client.on('connect', function() {
    client.subscribe('/hello');
    // client.publish('presence', 'Hello mqtt');
});

client.on('message', function(topic, message) {
    // message is Buffer 
    console.log(message.toString());
});