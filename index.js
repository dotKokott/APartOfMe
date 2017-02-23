
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require('johnny-five');
var board = new five.Board();
var robot = require("robotjs");

var exec = require('child_process').exec;
const fs = require('fs');

const KNOB_COUNT = 15;

var voltages = [];
var watcher;
board.on('ready', function() {
    for(var i = 0; i < KNOB_COUNT; i++) {
        voltages.push(0);
    }
    var startbtn = new five.Button({
        pin: 2,
        isPullup: true
    });

    startbtn.on("press", function() {
      io.emit("startbtn", true);
    });

    var printbtn = new five.Button({
        pin: 3,
        isPullup: true
    });

    printbtn.on("press", function() {
      io.emit("printbtn", true);
      var path = "C:\\Users\\Christian\\Dropbox\\Screenshots\\"
      watcher = fs.watch('C:\\Users\\Christian\\Dropbox\\Screenshots', (eventType, filename) => {
        if (filename) {

            exec("rundll32    shimgvw.dll    ImageView_PrintTo /pt   \"" + path + filename +   "\" \"XP-225 Series(Network)");

            watcher.close();
        }
          console.log(filename);
          // Prints: <Buffer ...>
      });

      robot.keyToggle("alt", "down");
      robot.keyTap("printscreen");
      robot.keyToggle("alt", "up");
    });

    var restartbtn = new five.Button({
        pin: 4,
        isPullup: true
    });

    restartbtn.on("press", function() {
      io.emit("restartbtn", true);
    });

  for(var i = 0; i < KNOB_COUNT; i++) {

    (function(board, e) {
        board.analogRead(e, function(voltage) {
            var dif = Math.abs(voltages[e] - voltage);
            if(dif > 5) {
                voltages[e] = voltage;
                io.emit('knob', e + ':' + voltage);
            }
        });
    })(this, i);
  }



});

app.use('/js', express.static('js'));
app.use('/ext_js',express.static('ext_js'));
app.use('/models',express.static('models'));
app.use('/css',express.static('css'));
app.use('/images',express.static('images'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
