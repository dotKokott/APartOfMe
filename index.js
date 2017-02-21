
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require('johnny-five');
var board = new five.Board();

const KNOB_COUNT = 3;

board.on('ready', function() {
  for(var i = 0; i < KNOB_COUNT; i++) {

    (function(board, e) {
        boardw.pinMode(e, five.Pin.ANALOG);
        board.analogRead(e, function(voltage) {
          io.emit('knob', e + ':' + voltage);
        });
    })(this, i);
  }
});

app.use('/js', express.static('js'));
app.use('/ext_js',express.static('ext_js'));
app.use('/models',express.static('models'));
app.use('/css',express.static('css'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
