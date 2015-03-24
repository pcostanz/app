'use strict';

angular.module('rehash-app').factory('scoreboardService',
  function (
    socket,
    $rootScope,
    $mdSidenav,
    $mdToast,
    $ionicModal
  ) {

    var scoreboardService = {};
    scoreboardService.scope = {};
    scoreboardService.leaderboard = [];
    scoreboardService.scoreboard = '';


    socket.emit('initialize scoreboard');

    socket.on('update scoreboard', function(data) {
      $rootScope.scoreboard = data;
    });

    scoreboardService.initialize = function(scope) {
      scoreboardService.scope = scope;

      $ionicModal.fromTemplateUrl('js/components/scoreboard/scoreboard.html', {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        scoreboardService.scoreboard = modal;
      });

      scoreboardService.scope.closeScoreboard = function() {
        scoreboardService.scoreboard.hide();
      };

      scoreboardService.scope.testSwipeDown = function() {
        scoreboardService.scoreboard.hide();
      };
    };

    scoreboardService.openScoreboard = function(data) {
      console.log('open scoreboard', $rootScope.scoreboard);
      scoreboardService.scoreboard.show();
    };

    return scoreboardService;
  });
