var ws = require("nodejs-websocket")
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://ec2-35-161-110-220.us-west-2.compute.amazonaws.com');

client.on('connect', function() {
    client.subscribe('/stats');

});

var a;

client.on('message', function(topic, message) {
    // message is Buffer 
    console.log(message.toString());
    a = message.toString();
});

 
// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(a);
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001);




// var ws = require("nodejs-websocket");
// var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://ec2-35-161-110-220.us-west-2.compute.amazonaws.com');

// // Scream server example: "hi" -> "HI!!!" 
// var server = ws.createServer(function(conn) {
//     console.log("New connection")



//     conn.on("text", function(str) {
//         console.log("Received " + str)
//         conn.sendText(str.toUpperCase() + "!!!")
//     })
//     conn.on("close", function(code, reason) {
//         console.log("Connection closed")
//     })
// }).listen(8001)

// client.on('connect', function() {
//     client.subscribe('/test');
//     client.on('message', function(topic, message) {
//         conn.sendText(message);
//         console.log(message);
//     });
// });
