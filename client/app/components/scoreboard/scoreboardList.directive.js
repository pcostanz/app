'use strict';

angular.module('rehash-app')
  .directive('scoreboardList', function(
    gameService) {

    return {
      'restrict'    : 'E',
      'templateUrl' : 'app/components/scoreboard/scoreboardList.html',
      'replace'     : true,
      'link'        : function(scope) {
        scope.$watch(function() { return gameService.scoreboard; },
          function (newScoreboard) {
            if (newScoreboard.length) {
              scope.scoreboard = newScoreboard;
            }
          }
        );
      }
    };
  });
