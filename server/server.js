var express = require('express');
var db = require('./config/db');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var Session = require('./sessions/sessions');
var User = require('./users/users');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var fbconfig = require('./config/fbconfig');

// Added for Yelp API
var api = require('./config/yelpapi.js');
var yelpkeys = require('./config/yelpkeys.js');

app.get('/getRestaurants', function (req, res) {
  api(req.query, function (error, resp, body) {
    body = JSON.parse(body);
    res.send(200, body.businesses);
  });
});

//setting up serverside facebook request w/ passport
var usersController = require('./users/usersController');

passport.use(new Strategy({
    clientID: fbconfig.clientID,
    clientSecret: fbconfig.clientSecret,
    callbackURL: fbconfig.callbackURL,
    profileFields: ['id', 'displayName', 'picture.height(150).width(150)','friends']
  },
  function(accessToken, refreshToken, profile, cb) {
    //call a function which checks if user is in db
    usersController.findOrCreate(profile);
    return cb(null, profile);
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

io.on( 'connect' , function( socket ){
  console.log( 'we are connected!!' );
  socket.on( 'disconnect', function() {
    console.log( 'were not connected anymore' );
  });

  //this recieves the create event emitted in client/sessions/sessions.js-emitCreate
  socket.on('session', function(data) {
    Session.findOne({ where: { id: data.sessionID } })
    .then(function(session) {
      console.log('this is session.datavalue going to send back to client' ,session.dataValues);
      //this function emits an event named newSession and sends the newly created session
      io.emit('newSession', session.dataValues);
    });
  });

  //this function listens to the new join event in client/sessions/sessions.js-emitJoin
  socket.on('newJoin', function(data) {
    //this function creates a new or joins an existing socket-room
    socket.join(data.sessionName);
    User.findOne({ where: { username: data.username } })
    .then(function(user) {
      //this function emits a newUser event and the new user to a specific room named the session name
      io.to(data.sessionName).emit('newUser', user);
    });
  });

  socket.on('startSession', function(data) {
    socket.join(data.sessionName);
    io.to(data.sessionName).emit('sessionStarted');
  });

  // This listener handles broadcasting a matched movie to connected clients.
  socket.on('foundMatch', function(data) {
    socket.join(data.sessionName);
    io.to(data.sessionName).emit('matchRedirect', data.movie.id);
  });
});

const PORT = 8000;

require('./config/middleware')(app, express);
require('./config/routes')(app, express);

http.listen(process.env.PORT || PORT);
console.log('Listening on port ' + PORT);

module.exports = app;
