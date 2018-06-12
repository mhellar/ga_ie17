const express = require("express");
const app = express();
const server = app.listen(3000);
var path = require("path");
const io = require("socket.io")(server);
const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
    baudRate: 115200
});

//expose the local public folder for inluding files js, css etc..
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

parser.on("data", function(data) {
    io.sockets.emit("data", data);
    console.log(data);
});