'use strict';

angular.module('rehash-app').factory('gameService',
  function (
    socket,
    $rootScope
  ) {

    console.log('gameService init');

    var gameService = {};

    // track if the game is in progress
    gameService.inProgress = false;

    // users, score, id, etc...
    gameService.scoreboard = [];

    // round results, winner, hashtag, tweet, etc...
    gameService.roundResults = [];

    gameService.inProgress = true;

    socket.emit('initialize game');

    socket.on('start round', function(data) {
      gameService.scoreboard = data.scores;
    });

    socket.on('update scores', function(data) {
      gameService.scoreboard = data.scoreboard;
      gameService.roundResults = data.roundResults;

      console.log('!! scores updated, gameService is', gameService);
    });

    gameService.currentGameInProgress = function() {
      return gameService.inProgress;
    };

    gameService.sendMessage = function(messageData) {
      socket.emit('chat message sent', {
        'user'      : messageData.name || 'System',
        'message'   : messageData.body,
        'isSystem'  : messageData.isSystem || false,
        'popToast'  : messageData.popToast || false,
        'showCount' : messageData.showCount || false
      });
    };

    return gameService;
  });
