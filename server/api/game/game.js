var Tweet = require('../tweet/tweet.model'),
    GameRound = require('./game_round'),
    _ = require('lodash');

function Game() {
  this.tweets = [];
  this.users = [];
  this.rounds = [];
  this.currentJudgeIndex = null;
  this.tweetIndex = null;
}

Game.startGame = function (users, callback) {
  var game = new Game();
  game.users = users;
  game.users.forEach(function (user) {
    user.score = 0;
  });

  Tweet.findRandom().limit(10).exec(function (err, tweets) {
    game.tweets = tweets;
    if (game.rounds.length === 0) {
      GameRound.newRound(game.users, game.tweets[0], users[0], function(round) {
        game.rounds.push(round);
        game.currentJudgeIndex = 0;
        game.tweetIndex = 0;
        return callback(game);
      });
    } else {
      return callback(game);
    }
  });
}

Game.prototype.lastRound = function () {
  return this.rounds[this.rounds.length - 2]
}


Game.prototype.scoreboard = function () {
  return this.users;
}

Game.prototype.removeUser = function (user) {
  var remainingUsers = _.remove(this.users, function(u) {
    return user.username !== u.username;
  });
  this.users = remainingUsers;
  this.currentRound().users = remainingUsers;
}

Game.prototype.currentRound = function () {
  return this.rounds[this.rounds.length - 1];
}

Game.prototype.numOfCurrentRound = function () {
  return this.rounds.length;
}

Game.prototype.newRound = function (callback) {
  var self = this;
  if ((self.users.length - 1) === self.currentJudgeIndex) {
    self.currentJudgeIndex = 0;
  } else {
    self.currentJudgeIndex++;
  }

  if (self.currentRound().winner) {
    self.users.forEach(function (user, index) {
      console.log('user', user, 'winner', self.currentRound.winner);
      if (self.currentRound().winner.username === user.username) {
        self.users[index].score++;
      }
    });
  }

  GameRound.newRound(
    Game.resetUsers(self.users),
    self.tweets[self.tweetIndex + 1],
    self.users[self.currentJudgeIndex],
    function (round) {
      self.rounds.push(round);
      return callback(self);
    }
  )
}

Game.resetUsers = function(users) {
  users = _.map(users, function(u) {
    return _.omit(u, 'hashtags');
  });
  return _.map(users, function(u) {
    return _.omit(u, 'submittedHashtag');
  });
}

Game.prototype.getNewJudge = function () {

}

module.exports = Game;
