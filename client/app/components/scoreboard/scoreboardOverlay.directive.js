'use strict';

angular.module('rehash-app')
  .directive('scoreboardOverlay', function(
    $rootScope,
    chatService,
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


        scope.players = [
          {
            'email' : 'test@test.com',
            'score' : 2,
            'id'    : 1
          },
          {
            'email' : 'randomshit389042@test.com',
            'score' : 4,
            'id'    : 2
          },
          {
            'email' : 'helloworld@test.com',
            'score' : 9,
            'id'    : 3
          },
          {
            'email' : '912301290321@test.com',
            'score' : 1,
            'id'    : 4
          },
          {
            'email' : 'anotheremailaddress@test.com',
            'score' : 5,
            'id'    : 5
          }
        ];

        var positionScoreboardAvatars = function() {
          var elemHeight = elem[0].offsetHeight;
          var rankedPlayers = angular.copy(scope.players).sort(compare);
          var avatarHeight = (elemHeight / rankedPlayers.length); // includes margin

          angular.forEach(rankedPlayers, function(player, index) {
            var playerIndex = player.id - 1;

            var currentOffset = avatarHeight * playerIndex;
            var newOffset = avatarHeight * index;

            var translateDistance = newOffset - currentOffset;


            scope.players[playerIndex].style = {'transform': 'translateY(' + translateDistance + 'px) translateX(50px)'};
          });

          // utility sorting function
          function compare(a,b) {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return 0;
          }
        };

        $timeout(function() {
          positionScoreboardAvatars();
        })


      }
    };
  });
