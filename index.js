var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  this.pinMode(0, five.Pin.ANALOG);
  this.analogRead(0, function(voltage) {
    console.log(voltage);
  });  
});
