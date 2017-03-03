var util = require('util');
var i2c = require('i2c');

util.debug("Starting...");

var device1 = new i2c(0x4, {device: '/dev/i2c-1', debug: false});

device1.writeByte(0x2, function(err) { console.log("error"); console.log(err); });
util.debug("byte written...");

var http = require('http');
var port = process.env.port || 3000;
http.createServer(function (req, res) {
    util.debug("Got a get");
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
    util.debug("Send response");


	device1.writeByte(0x2, function(err) { console.log("error"); console.log(err); });

}).listen(port);
 
util.debug("Started");