var util = require("util");
var i2c = require("i2c");
var http = require("http");
var leftPad = require("left-pad");

var port = process.env.port || 3000;
var address = process.env.address || 0x4;

var i2cDevice = new i2c(address, { device: "/dev/i2c-1", debug: false });
console.log("I2C bus started on address " + address + " ...");

var queue = [];
var isRunning = false;

var port = process.env.port || 3000;
http
  .createServer(function(req, res) {
    queue.push(function(callback) {
      processReq(req, res, callback);
    });
    dequeue();
  })
  .listen(port);

function dequeue() {
  if (!isRunning) {
    var fn = queue.pop();
    if (fn) {
      isRunning = true;
      fn(function() {
        isRunning = false;
        dequeue();
      });
    }
  }
}

function processReq(req, res, callback) {
  var url = require("url");
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log("incoming request:", query);

  if (query.device) {
    var code = (query.device << 4) | (query.command ? query.command : 7);

    console.log("I2C write value:", code);
    i2cDevice.writeByte(code, function(err) {
      if (err) {
        console.log("I2C write error", err);
      } else {
        console.log("I2C write done");
      }
      // segmentation fault protection
      setTimeout(function() {
        i2cDevice.readByte(function(err, data) {
          if (err) {
            console.error("I2C read error", err);
            callback();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end('{"status":"error","message":"I2C read error"}');
          } else {
            var dataBin = leftPad(data.toString(2), 8, 0);
            var deviceData = dataBin[query.device];
            console.log("I2C read done", data);
            callback();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              '{"status":"success","devices":"' +
                data +
                '","devicesBin":"' +
                dataBin +
                '","device":"' +
                deviceData +
                '"}'
            );
          }
        });
      }, 100);
    });
  } else {
    callback();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("HomeController gateway API\n");
  }
}

console.log("HTTP server started on port " + port + " ...");
