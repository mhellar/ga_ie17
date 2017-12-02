var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://ec2-35-161-110-220.us-west-2.compute.amazonaws.com')
 
client.on('connect', function () {
  client.subscribe('/test')
  client.publish('/test', 'Hello mqtt')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
})