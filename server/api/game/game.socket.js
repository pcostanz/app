var _ = require('lodash'),
    when = require('when'),
    Tweet = require('../tweet/tweet.model'),
    Hashtag = require('../hashtag/hashtag.model'),
    Game = require('./game');

var usernames = [],
    currentGame = null;

exports.register = function(socket) {
  function startRound(game) {
    var gameState = {
      currentRound: game.currentRound(),
      lastRound: game.lastRound(),
      scoreboard: game.scoreboard(),
      numOfCurrentRound: game.numOfCurrentRound()
    }
    socket.emit('start round', gameState);
    socket.broadcast.emit('start round', gameState);
  }

  socket.on('submit hashtag', function (user, hashtag) {
    currentGame.currentRound().userSubmitHashtag(user, hashtag);
    socket.broadcast.emit(
      'send hashtag to judge',
      currentGame.currentRound()
    );

    if (currentGame.currentRound().checkIfAllTagsSubmitted()) {
      socket.broadcast.emit(
        'judge is now voting',
        currentGame.currentRound()
      );
    } else {
      console.log('not all votes in');
    }
  });

  socket.on('start game', function () {
    console.log(usernames);
    Game.startGame(usernames, function (game) {
      currentGame = game;
      startRound(currentGame);
      // socket.in(socket.user.uuid).emit('new_msg', {msg: 'hello'});
    });
  });

  socket.on('join lobby', function (username) {
    // add the client's username to the global list
    var user = username;
    socket.username = user;
    usernames.push(user);

    console.log('user joined lobby:', username, socket.username);
    // TODO - socket username seems like some weird shit

    socket.emit('user joined', {
      user: user,
      users: usernames
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user list', {users: usernames});
  });

  socket.on('end round', function (data) {
    currentGame.currentRound().submitJudgeVote(data);
    var lastRound = currentGame.currentRound();
    currentGame.newRound(function(game) {
      currentGame = game;
      startRound(currentGame);
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    _.pull(usernames, socket.username);

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
    });
  });
};
