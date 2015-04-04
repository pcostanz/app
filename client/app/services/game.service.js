'use strict';

angular.module('rehash-app').factory('gameService',
  function (
    socket
  ) {

    console.log('gameService init');

    var gameService = {
      'scoreboard'   : [], // users, score, id, etc...
      'roundResults' : [] // round results, winner, hashtag, tweet, etc...
    };

    socket.on('start round', function(data) {
      gameService.scoreboard = angular.copy(data.scoreboard).sort(sortScoreboard);
    });

    gameService.currentGameInProgress = function() {
      return true;
    };

    function sortScoreboard(a,b) {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return 0;
    }

    return gameService;
  });
