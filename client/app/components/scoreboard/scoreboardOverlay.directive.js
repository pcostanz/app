'use strict';

angular.module('rehash-app')
  .directive('scoreboardOverlay', function(
    $rootScope,
    chatService,
    $timeout,
    $interval,
    $sanitize,
    $ionicSideMenuDelegate,
    $window,
    gameService) {

    return {
      'restrict'    : 'E',
      'templateUrl' : 'app/components/scoreboard/scoreboardOverlay.html',
      'replace'     : true,
      'link'        : function(scope, elem, attrs) {

        var windowHeight = $window.outerHeight;
        var windowWidth = $window.outerWidth;

        // DOM manipulation needs to happen inside a $timeout so the digest cycle
        // can finish processing ng-repeat items, same applies to $watch listeners.
        $timeout(function() {
          var flung = false;
          var avatars = elem.children();

          scope.$watch(function() { return $ionicSideMenuDelegate.$getByHandle('game').getOpenRatio(); },
            function (ratio) {
              if (ratio === 1) {
                flung = true;
                $timeout(function() {
                  angular.forEach(avatars, function(avatar) {
                    var xFling = windowWidth + 50;
                    var yFling = Math.floor(Math.random() * 200) - 100;
                    angular.element(avatar)
                      .css('transform', 'translateX(' + xFling + 'px) translateY(' + yFling + 'px) rotate(180deg)');
                  });
                }, 25);
              } else if (ratio <= 0 && flung === true) {
                angular.forEach(avatars, function(avatar) {

                  // @TODO - Patrick: This wont fly when the scoreboard needs to rearrange itself
                  // since translateY will need to be used to order the icons
                  angular.element(avatar).attr('style', '');
                });
              }
            }
          );
        });

        //$interval(function() {
        //  scope.increaseScore(Math.floor((Math.random() * 4) + 1 ));
        //}, 350);

        scope.increaseScore = function(id) {
          scope.players[id - 1].score++;
          scope.$broadcast('scoreboard updated');
        };

        scope.$on('scoreboard updated', function() {
          console.log('scoreboard updated');
          positionScoreboardAvatars();
        });

        scope.scoreboard = [];

        scope.$watch(function() { return gameService.scoreboard; },
          function (newScoreboard) {

            // this is funky, we were relying on updating something in the scoreboard
            // array...this means we probably need to do some data manipulation

            if (newScoreboard.length) {
              positionScoreboardAvatars(newScoreboard);
            }
          }
        );

        // probably should run this on a landscape mode switch right?
        var centerScoreboard = function() {
          var elemHeight = elem[0].offsetHeight;
          elem.css('bottom', ((windowHeight - elemHeight) / 2) + 'px');
        };

        var positionScoreboardAvatars = function(newScoreboard) {

          if (!gameService.currentGameInProgress()) {
            return;
          }

          // if the scoreboard hasn't been initialized, do it with the new data
          if (scope.scoreboard.length === 0) {
            scope.scoreboard = angular.copy(newScoreboard);

            // need to set an id to track the sorted list back to the original
            // object used to construct the scoreboard, we'll also store the
            // style coordinates on this object and modify them from this method
            angular.forEach(scope.scoreboard, function(player, index) {
              player.id = index;
              player.styles = {};
            });
          }

          // @TODO - move this into the service

          var sortedScoreboard = angular.copy(scope.scoreboard).sort(sortScore);
          var elemHeight = elem[0].offsetHeight;
          var avatarHeight = (elemHeight / sortedScoreboard.length); // includes margin

          angular.forEach(sortedScoreboard, function(player, index) {
            console.log(player);
            var scoreboardIndex = player.id;
            var currentOffset = 65 * scoreboardIndex;
            var newOffset = 65 * index;
            var translateDistance = newOffset - currentOffset;

            console.log(currentOffset, newOffset);

            scope.scoreboard[scoreboardIndex].score = player.score;
            scope.scoreboard[scoreboardIndex].styles = {'transform': 'translateY(' + translateDistance + 'px)'};
          });

          // utility sorting function for scores
          function sortScore(a,b) {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return 0;
          }
        };

        var revealAvatars = function() {
          elem.addClass('visible');
        };

        $timeout(function() {
          centerScoreboard();
          revealAvatars();
        });

      }
    };
  });
