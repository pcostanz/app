/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function (app) {

  // Insert routes below
  // app.use('/api/things', require('./api/thing'));
  // app.use('/api/users', require('./api/user'));

  // app.use('/auth', require('./auth'));

  app.use('/api', require('./api/tweet'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|www|assets)/*')
     .get(errors[404]);

  // All other routes should redirect to the index.html
  // @NOTE: This is breaking templates on the app side, commenting out
  app.route('/*')
   .get(function (req, res) {
     res.sendfile(app.get('appPath') + '/index.html');
   });
};
