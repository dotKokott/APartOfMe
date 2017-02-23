var socket = io();

function map_range (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var eig = 0;
for (var i = 0;i < pnums;i++) {
    eig = Math.sqrt(pModel.shapeModel.eigenValues[i+2])*3
}

var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var target;

setTimeout(function() {

}, 3000);

var presets = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],            //none 0
    [0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],         //unwell 1
    [0, 0, -9, 0, -11, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0],        //inca 2
    [0, 0, -9, 9, -11, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0],      //cheery 3
    [0, 0, 0, 0, 0, 0, 0, -11, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0],        //dopey 4
    [0, 0, 0, 0, -15, 0, 0, -12, 0, 0, 0, 0, 0, 0, -7, 0, 0, 5],   //longface 5
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -6, 12, 0, 0],        //lucky 6
    [0, 0, 0, 0, 16, 0, -14, 0, 0, 0, 0, 0, -7, 0, 0, 0, 0, 0],    //overcute 7
    [0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, -2, 0, 0, 10],        //aloof 8
    [0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, -8],           //evil 9
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, -16, 0, 0, 0, 0, 0],   //artifial 10
];

var textoverlay = $('#textoverlay');
var message1 = $('#message1');
var message2 = $('#message2');
var message3 = $('#message3');
var message4 = $('#message4');
var message5 = $('#message5');
var message6 = $('#message6');

message1.hide();
message2.hide();
message3.hide();
message4.hide();
message5.hide();
message6.hide();

var textDelay = 1000;
var fadeTime = 500;

var mode = "START";

function startIntro() {
    textoverlay.fadeOut('slow', function() {
        message1.delay(textDelay).fadeIn(fadeTime, function() {
            startVideo();
            mode = "STORY";
        });
    });
}

var storyStarted = false;
var storyEnded = false;
function startStory() {
    if(storyStarted) return;

    storyStarted = true;

    message1.delay(textDelay).fadeOut(fadeTime, function() {
        message2.delay(textDelay).fadeIn(fadeTime, function() {
            changeFaceTo(3, 2000);
            $('#emotion').delay(2000).fadeOut(function(){
                $(this).html("sad").fadeIn(function() {
                    changeFaceTo(1, 2000);
                    $('#emotion').delay(2000).fadeOut(function(){
                        $(this).html("bored").fadeIn(function() {
                            changeFaceTo(5, 2000);
                            message2.delay(textDelay).fadeOut(fadeTime, function() {
                                changeFaceTo(0, 2000);
                                message3.delay(textDelay).fadeIn(fadeTime, function() {
                                    message3.delay(textDelay).fadeOut(fadeTime, function() {
                                        message4.delay(textDelay).fadeIn(fadeTime, function() {

                                            $('#object').delay(2000).fadeOut(function(){
                                                $(this).html("angels").fadeIn(function() {
                                                    $('#object').delay(2000).fadeOut(function(){
                                                        $(this).html("<i><b>you's</b><i>").fadeIn(function() {
                                                            message4.delay(2000).fadeOut(function() {
                                                                message5.delay(textDelay).fadeIn(fadeTime).delay(2000).fadeOut(fadeTime, function() {
                                                                    storyEnded = true;
                                                                    message6.delay(10000).fadeIn(fadeTime).delay(4000).fadeOut(fadeTime);
                                                                });
                                                            })
                                                        })
                                                    })
                                                })
                                            })

                                        })
                                    })
                                })
                            });
                        });
                    });
                });
            });
        });
    });
}

function fitPageScroll() {
    $("body").css("overflow", "hidden");
    window.scrollTo(195.69371032714844, 0);
}

$( document ).ready(function() {
    fitPageScroll();
});

 $(document).keydown(function(evt) {
     if(evt.keyCode == 83) {
         var overflow = $("body").css("overflow");
         if(overflow == "hidden") $("body").css("overflow", "visible");
         if(overflow == "visible") $("body").css("overflow", "hidden");

         window.scrollTo(195.69371032714844, 0);
     }
     if(evt.keyCode == 32) {
         if(mode == "STORY") {
             startStory();
         }

     }
 })

socket.on('knob', function(msg) {
    if(!storyEnded) return;

    var split = msg.split(":");
    var comp = parseInt(split[0]) + 3;
    var val = parseInt(split[1]);

    var eig = Math.sqrt(pModel.shapeModel.eigenValues[comp+2])*3;

    var min = -4 * eig;
    var max = 4 * eig;

    var value = map_range(val, 0, 1023, min, max);

    ph['component ' + (comp + 3)] = value;
});

socket.on('startbtn', function(msg) {
    if(mode == "START") {
        startIntro();
    }
});

socket.on('printbtn', function(msg) {
    console.log('PRINT');
});

socket.on('restartbtn', function(msg) {
    window.location.reload(false);
});

function tick() {
    TWEEN.update();
}

function changeFaceTo(num, time) {
    target = presets[num];
    var tween = new TWEEN.Tween(value).to(target, time);
    tween.start();
    tween.easing(TWEEN.Easing.Elastic.InOut);
    tween.onUpdate(function() {
        for(var i = 0; i < target.length; i++) {
            ph['component ' + (i + 3)] = value[i];
        }
    });
}
