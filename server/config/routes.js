// require controllers here
var usersController = require('../users/usersController.js');
var genresController = require('../genres/genresController.js');
var moviesController = require('../movies/moviesController.js');
var prefsController = require('../prefs/prefsController.js');
var sessionsController = require('../sessions/sessionsController.js');
var votesController = require('../votes/votesController.js');
var helpers = require('./helpers.js'); // our custom middleware


module.exports = function ( app, express ) {
  /* USERS */
  app.get('/api/users', usersController.getAllUsers);
  app.post('/api/users/signin', usersController.signin);
  app.post('/api/users/signup', usersController.signup);
  app.post('/api/users/signout', usersController.signout);

  /* GENRES */
  app.get('/api/genres', genresController.getAllGenres);
  app.get('/api/genres/:genre', genresController.getGenre);

  /* MOVIES */
  app.get('/api/movies', moviesController.getAllMovies);
  app.get('/api/movies/:movie', moviesController.getMovie);

  /* PREFS */
  app.get('/api/prefs', prefsController.getPrefs);
  app.post('/api/prefs', prefsController.addPrefs);

  /* SESSIONS */
  app.get('/api/sessions', sessionsController.getAllSessions);
  app.post('/api/sessions', sessionsController.addSession);

  /* VOTES */
  app.get('/api/votes', votesController.getAllVotes);
  app.post('/api/votes', votesController.addVote);


  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

};