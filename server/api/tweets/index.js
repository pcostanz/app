'use strict';

var express = require('express');
var controller = require('./tweets.controller');
var config = require('../../config/environment');
// var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/tweets', controller.tweets);
router.get('/hashtags', controller.hashtags);

module.exports = router;
