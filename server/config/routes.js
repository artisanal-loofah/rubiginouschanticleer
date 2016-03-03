// require controllers here
var usersController = require('../users/usersController.js');
var genresController = require('../genres/genresController.js');
var moviesController = require('../movies/moviesController.js');
var prefsController = require('../prefs/prefsController.js');
var sessionsController = require('../sessions/sessionsController.js');
var votesController = require('../votes/votesController.js');
// var sessions_usersController = require('../sessions_users/sessions_usersController.js');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

var helpers = require('./helpers.js'); // our custom middleware


module.exports = function ( app, express ) {
  /* USERS */
  // app.get('/api/users', usersController.getAllUsers );
  // app.get('/api/users/:user', usersController.validate );
  // app.post('/api/users/signin', usersController.signin );
  // app.post('/api/users/signup', usersController.signup );
  // app.post('/api/users/signout', usersController.signout );

  /*FACEBOOK LOGIN */
  app.get('/login/facebook', 
    passport.authenticate('facebook', {scope: ['user_friends']})
  );

  app.get('/login/facebook/return', 
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      //send cookie so client side has user info
      res.cookie('name',req.user.displayName);
      res.cookie('fbId',req.user.id);
      res.cookie('picture',req.user.photos[0].value);
      res.redirect('/#/sessions');
  });

  app.get('/login',function(req, res){
    res.redirect('/#/signin');
  });

  /* USER AUTH */
  app.get('/api/users', usersController.getUser);

  /* GENRES */
  app.use('/api/genres', helpers.decode);
  app.get('/api/genres', genresController.getAllGenres );
  app.get('/api/genres/:genre', genresController.getGenre );

  /* MOVIES */
  app.use('/api/movies', helpers.decode);
  app.get('/api/movies', moviesController.getAllMovies );
  app.get('/api/movies/package/:number', moviesController.getMoviePackage );
  app.get('/api/movies/:movie_id', moviesController.getMovie );

  /* PREFS */
  app.use('/api/prefs', helpers.decode);
  app.get('/api/prefs', prefsController.getPrefs );
  app.post('/api/prefs', prefsController.addPrefs );

  /* SESSIONS */
  app.use('/api/sessions', helpers.decode);
  app.get('/api/sessions', sessionsController.getAllSessions);
  app.get('/api/sessions/:id', sessionsController.getSession);
  app.post('/api/sessions', sessionsController.addSession);

  /* VOTES */
  app.use('/api/votes', helpers.decode);
  app.get('/api/votes', votesController.getAllVotes );
  app.get('/api/votes/:session_id/:movie_id', votesController.getSessMovieVotes ); // get votes for a particular session and movie
  app.post('/api/votes', votesController.addVote );

  /* SESSIONS_USERS */
  app.use('/api/sessions/users', helpers.decode);
  app.get('/api/sessions/:sessionId/users', sessionsController.getAllUsers);
  // app.get('/api/sessions/:session_id/:user_id', sessionsController.getOneUser);
  app.post('/api/sessions/:sessionId/users', sessionsController.addUser);

  /* MATCHING */
  // This endpoint answers the question, 'For session <id>, do we currently have a match on movie <id>?'
  app.get('/api/sessions/:session_id/match/:movie_id', votesController.checkMatch );




  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

};
