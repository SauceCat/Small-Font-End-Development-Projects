
$(document).ready(function(){
  $('#green').on("click", function(){
    var audio = $('#green-audio').get(0);
    audio.playbackRate = 0.8;
    audio.play();
    
    $('#green').css('background-color', 'var(--green-light)');
    $('#green').css('border', '8px solid #333');
    
    setTimeout(function(){
      $('#green').css('background-color', 'var(--green)');
      $('#green').css('border', '5px solid #333');
    },300);
  });

  $('#red').on("click", function(){
    var audio = $('#red-audio').get(0);
    audio.playbackRate = 0.8;
    audio.play();
    
    $('#red').css('background-color', 'var(--red-light)');
    $('#red').css('border', '8px solid #333');
    setTimeout(function(){
      $('#red').css('background-color', 'var(--red)');
      $('#red').css('border', '5px solid #333');
    },300);
  });

  $('#yellow').on("click", function(){
    var audio = $('#yellow-audio').get(0);
    audio.playbackRate = 0.8;
    audio.play();
    
    $('#yellow').css('background-color', 'var(--yellow-light)');
    $('#yellow').css('border', '8px solid #333');
    setTimeout(function(){
      $('#yellow').css('background-color', 'var(--yellow)');
      $('#yellow').css('border', '5px solid #333');
    },300);
  });

  $('#blue').on("click", function(){
    var audio = $('#blue-audio').get(0);
    audio.playbackRate = 0.8;
    audio.play();
    
    $('#blue').css('background-color', 'var(--blue-light)');
    $('#blue').css('border', '8px solid #333');
    setTimeout(function(){
      $('#blue').css('background-color', 'var(--blue)');
      $('#blue').css('border', '5px solid #333');
    },300);
  });

  $('#start-btn').on("click", function(){
    $('#start-btn').css('border', '5px solid #333');
    setTimeout(function(){
      $('#start-btn').css('border', '4px solid #333');
    }, 200);
  });

  $('#strict-btn').on("click", function(){
    var oldBorder = $('#strict-sign').css('border');

    var newBorder = oldBorder == '5px solid rgb(51, 51, 51)' ? '3px solid #333' : '5px solid #333';

    $('#strict-sign').css('border', newBorder);
    
    setTimeout(function(){
      $('#strict-btn').css('border', '4px solid #333');
    }, 200);
  });

  $('#show-switch').on('click', function(){
    var oldMarginLeft = $('#show-switch-in').css('margin-left');
    var newMarginLeft = oldMarginLeft == '-15px' ? '15px' : '-15px';
    $('#show-switch-in').css('margin-left', newMarginLeft);
    if(newMarginLeft == '15px') {
      $('#show-count span').css('color', 'var(--red-on)');
    }else {
      $('#show-count span').css('color', 'var(--red-off)');
    }
  });
});


var myapp = angular.module('myapp', []);
myapp.controller('myCtrl', function($scope){
  $scope.gameReady = false;
  
  function game() {
    this.count = 1;
    this.randomList = [];
    this.strict = false;
    this.continue = true;
    this.fail = false;
    this.exit = false;
    this.repeat = false;
    this.inputCount = 0;
    this.timeWait = 0;
    this.waitInput = false;

    $("#start-btn").css("pointer-events", "auto");
    $("#strict-btn").css("pointer-events", "auto");
    $('#strict-sign').css('border', '5px solid rgb(51, 51, 51)');
    
    this.nextList = function() {
      var newNum = Math.floor(Math.random() * 4);
      this.randomList.push(newNum);
      this.inputCount = 0;
      this.continue = false;
    };
  };

  function failMusic() {
    var failSound = new Audio('http://soundbible.com/mp3/Sad_Trombone-Joe_Lamb-665429450.mp3');
    setTimeout(function(){
      failSound.play();
    }, 1000);
  }

  function beepSound() {
    var beep = new Audio('http://soundbible.com/mp3/Censored_Beep-Mastercard-569981218.mp3');
    beep.play();
  }

  function gameContinue() {
    $scope.newGame.fail = false;
    $scope.newGame.continue = false;
    $scope.newGame.waitInput = false;
    $('.fours').removeClass('clickable');
    var delayTime = 0;

    if($scope.newGame.repeat) {
      delayTime = 3000;
    }

    if($scope.newGame.repeat) {
      var display = $scope.newGame.count.toString();
      if(display.length < 2) {
        display = '0' + display;
      }
      setTimeout(function(){
        $('#game-count').text(display);
      }, 2000);
    }

    setTimeout(function(){
      var i = 0;
      var len = $scope.newGame.randomList.length;
      var myinter = setInterval(function(){
        var key = $scope.newGame.randomList[i];
        switch(key) {
          case 0:
            $('#green').click();
            break;
          case 1:
            $('#red').click();
            break;
          case 2:
            $('#yellow').click();
            break;
          case 3:
            $('#blue').click();
            break;
        }
        i++;
        if(i >= len) {
          $scope.newGame.waitInput = true;
          $scope.newGame.repeat = false;
          $('.fours').addClass('clickable');
          $scope.newGame.timeWait = 0;
          timer = setInterval(function(){
              $scope.newGame.timeWait++;
              console.log($scope.newGame.timeWait);

              if($scope.newGame.timeWait >= 10){
                $scope.newGame.fail = true;
                failMusic();
                clearInterval(timer);
              }

              if($scope.newGame.fail){
                clearInterval(timer);
              }

              if($scope.newGame.exit){
                clearInterval(timer);
              }

              if(!$scope.newGame.waitInput){
                console.log('stop');
                clearInterval(timer);
              }
          }, 1000);
          clearInterval(myinter);
        }

        if($scope.newGame.exit){
          clearInterval(myinter);
        }
      }, 1000);
    }, delayTime);
  }

  $scope.inputClick = function(code) {
    $scope.newGame.inputCount++;
    $scope.newGame.timeWait = 0;

    var right = $scope.newGame.randomList[$scope.newGame.inputCount-1];

    if(code != right) {
      $scope.newGame.fail = true;
      if($scope.newGame.strict){
        $scope.newGame.continue = false;
      }else {
        $scope.newGame.repeat = true;
        $scope.newGame.continue = true;
      }
    }

    if(!$scope.newGame.fail && $scope.newGame.inputCount == $scope.newGame.randomList.length) {
      $scope.newGame.continue = true;
      $scope.newGame.count++;
      var display = $scope.newGame.count.toString();
      if(display.length < 2) {
        display = '0' + display;
      }
      setTimeout(function(){
        $('#game-count').text(display);
      }, 1000);
    }

    if($scope.newGame.continue) {
      $scope.newGame.inputCount = 0;
      if(!$scope.newGame.repeat) {
        $scope.newGame.nextList();
      }
      setTimeout(function(){
        gameContinue();
      }, 1000);
    }

    if($scope.newGame.fail) {
      failMusic();
      $('#game-count').text('!!');
    }
  }

  $('#show-switch').on('click', function(){
    var margin = $('#show-switch-in').css('margin-left');
    if(margin == '-15px'){
      $scope.gameReady = true;
      $scope.newGame = new game();
    }else {
      $scope.gameReady = false;
      $scope.newGame.exit = true;
      $scope.newGame.continue = false;
      $('#game-count').text('--');
    }
  });

  $('#strict-btn').on("click", function(){
    var border = $('#strict-sign').css('border');
    if(border == '5px solid rgb(51, 51, 51)'){
      $scope.newGame.strict = true;
    } else {
      $scope.newGame.strict = false;
    }
  });

  $('#start-btn').on('click', function(){
    $("#start-btn").css("pointer-events", "none");
      if($scope.gameReady){
        var i = 0;
        var gameStart = setInterval(function(){
          var oldColor = $('#show-count span').css('color');
          console.log(oldColor);
          var newColor = oldColor == 'rgb(67, 7, 16)' ? 'rgb(220, 13, 41)' : 'rgb(67, 7, 16)';
          $('#show-count span').css('color', newColor);
          i++;

          beepSound();

          if(i >= 4) {
            clearInterval(gameStart);
            var display = $scope.newGame.count.toString();
            if(display.length < 2) {
              display = '0' + display;
            }
            $('#game-count').text(display);
            $scope.newGame.nextList();
            gameContinue();
          }
        }, 1000);
      }
    });
});