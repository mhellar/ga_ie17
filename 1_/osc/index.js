var osc = require('node-osc');
                
var oscServer = new osc.Server(8001, '10.2.0.144');
oscServer.on("message", function(msg, rinfo) {
    console.log("TUIO message:");
    console.log(msg);
    if(msg[0] == '/7/push6' && msg[1] == 1){
    	console.log("beep");
    }
});