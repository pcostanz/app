'use strict';

angular.module('rehash-app')
  .directive('scoreboardOverlay', function(
    $rootScope,
    chatService,
    gameService,
    $timeout,
    $interval,
    $sanitize,
    $ionicSideMenuDelegate,
    $window) {

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
          scope.$watch(function() { return $ionicSideMenuDelegate.$getByHandle('game').getOpenRatio(); },
            function (ratio) {
              var avatars = elem.children();

              if (ratio === 1) {
                $timeout(function() {
                  angular.forEach(avatars, function(avatar) {
                    var xFling = windowWidth + 50;
                    var yFling = Math.floor(Math.random() * 200) - 100;
                    angular.element(avatar)
                      .css('transform', 'translateX(' + xFling + 'px) translateY(' + yFling + 'px) rotate(180deg)');
                  });
                }, 25);
              } else if (ratio <= 0) {
                angular.forEach(avatars, function(avatar) {

                  // @TODO - Patrick: This wont fly when the scoreboard needs to rearrange itself
                  // since translateY will need to be used to order the icons
                  angular.element(avatar).attr('style', '');
                });
              }
            }
          );
        });

        // @TODO: This was working as a proof of concept demo, need to re-implement so that
        // scoreboard posiion state can be properly tracked and calculated when the scoreboard
        // object is being overwritten by service update changes that will nuke and rewrite
        // scope.scoreboard

        //var positionScoreboardAvatars = function() {
        //  var elemHeight = elem[0].offsetHeight;
        //  var rankedPlayers = angular.copy(scope.players).sort(sortScoreboard);
        //  var avatarHeight = (elemHeight / rankedPlayers.length); // includes margin
        //
        //  angular.forEach(rankedPlayers, function(player, index) {
        //    var playerIndex = player.id - 1;
        //
        //    var currentOffset = avatarHeight * playerIndex;
        //    var newOffset = avatarHeight * index;
        //
        //    var translateDistance = newOffset - currentOffset;
        //
        //
        //    scope.players[playerIndex].style = {'transform': 'translateY(' + translateDistance + 'px) translateX(50px)'};
        //  });
        //
        //  // utility sorting function
        //  function sortScoreboard(a,b) {
        //    if (a.score > b.score) return -1;
        //    if (a.score < b.score) return 1;
        //    return 0;
        //  }
        //};

        var centerScoreboard = function() {
          var elemHeight = elem[0].offsetHeight;
          elem.css('bottom', ((windowHeight - elemHeight) / 2) + 'px');
        };

        scope.$watch(function() { return gameService.scoreboard; },
          function (newScoreboard) {
            if (newScoreboard.length) {
              scope.scoreboard = newScoreboard;

              $timeout(function() {
                centerScoreboard();
              });
            }
          }
        );
      }
    };
  });
