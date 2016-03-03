var helpers = require( '../config/helpers' );
var Vote = require( './votes' );
var Session_User = require( '../sessions_users/sessions_users' );
var mController = require( '../movies/moviesController' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' );

var getAllVotes = function() {};

var addVote = function(req, res) {
  console.log('>>>>>>>>>>in the addVote server side function...');

  var addVote = function(session_user, movie, vote) {
    Vote.addVote(session_user, movie, vote) // add vote to db
    .then(function (data) {
      // add vote to database
      // return 201 created
      console.log('>>>>>>>>vote has been added to the DB');
      matchHandler(); // refactor as necessary
      res.status( 201 );
      res.json( data );
      }, function( err ) {
        helpers.errorHandler( err, req, res );
      });
  };

  var session_user = parseInt( req.body.sessionName );
  var movie = parseInt( req.body.movie_id );
  var vote = req.body.vote;
  // var user = parseInt( req.body.user_id );
  // var session = parseInt( req.body.session_id );
  User.findOne({where: {username: req.body.username}})
    .then(function (user) {
      var user = user.dataValues.id;
      console.log('user found: ', user);
      Session.findOne({where: {sessionName: req.body.sessionName}})
        .then(function (session) {
          var session = session.dataValues.id;
          console.log('session found: ', session);
          if( movie === undefined ) { // if movie is not provided
            send400( 'Movie ID not provided' );
            return;
          } else if( !session_user ) { // if session_user is not provided
            if(user && session) { // but user and session are...
              Session.getUserSession(session, user)
              // Session_User.getSessionUserBySessionIdAndUserId(session, user) // try to look up session_user
                .then(function (sessionUser) {
                  console.log('session and user found: ', session, user);
                  console.log('sessionUser is: ', sessionUser);
                  session_user = sessionUser.dataValues.user_id;
                  if(!session_user) { // we were not able to look up session_user
                    // Could not find the given user in the given session
                    res.status(404);
                    res.send();
                    return;
                  } else { // we were able to look up session_user
                    console.log('ADDING VOTE...... w/: ', session_user, movie, vote);
                    addVote(session_user, movie, vote);
                  }
                });
          } else { // session and user not provided, session_user also not provided
            send400('No session, user, or session_user id provided');
            return;
          }
          } else { // session_user is provided
            console.log("ADDING VOTE.....");
            addVote(session_user, movie, vote);
          };
    });
  });

  var send400 = function (message) {
    res.status(400);
    res.send(message);
  };
};

var matchHandler = function() {
    // check if there is a match in current session
    // if so, send socket event to inform users of match
};

var getSessMovieVotes = function( req, res, next ) {
  // expects req.params.session_id
  // expects req.params.movie_id
  // res.json an array of vote objects,
  // Where each object represents a row in the
  // Votes table
  var sessionId = req.params.session_id;
  var movieId = req.params.movie_id;
  Vote.getSessMovieVotes( sessionId, movieId )
  .then( function( voteData ) {
    res.json( voteData );
  }, function( err ) {
    helpers.errorHandler( err );
  })
};

var checkMatch = function(req, res, next) {
  console.log('Checking match server side...');
  // Given a session and a movie,
  // We should know whether there is currently a match
  // # of yes votes for a given movie = # of users
  // Respond with movie object if there is a match,
  // Otherwise respond with false
  var sessionID = req.params.session_id;
  var movieID = req.params.movie_id;
  console.log('session id is: ' + sessionID + ' movieid is: ' + movieID);
  // get number of users in session
  // We are overriding the json method on the response object that our suController receives so that we have 
  // access to the object it gives us in this scope.

  // Get the count of users in a specific session
    // Get the votes for the specfic movie ID
    // If the votes for a movie is equal to count of users in session
    // Check if all votes are true
  Session.countUsersInSession(sessionID)
  // Session_User.countUsersInOneSession( sessionID )
  .then(function (userCount) {
    // get votedata
    Vote.getSessMovieVotes(sessionID, movieID)
    .then(function (voteData) {
      console.log('GOT VOTE DATA: ', voteData);
      // check if votedata is an array
      if( Array.isArray( voteData ) ) {
        console.log('VOTE DATA IS AN ARRAY....continueing.... length is: ', voteData.length);
        // if so, compare # of users to array.length. If they are the same,
        if(voteData.length === userCount ) {
          console.log('VOTEDATA LENGTH = USER COUNT.....');
          // reduce votedata array to see if all are true
          var matched = voteData.reduce( function( memo, curr ) {
            if( curr.vote === false ) {
              console.log('found a no vote');
              memo = false;
            }
            return memo;
          }, true);
          // if they are all true
          console.log('what is matched...', matched);
          if(matched) {
            console.log('GOT A MATCH!!!!');
            // get movie object for the movie id
            // return movie object
            mController.getMovie( req, res ); // pass response object to mController so it can res.send movie data
          } else { // did not match
            res.json( false );
          } // end if ( matched )
        } else { // voteData.length !== userCount
          res.json( false );
        } // end if ( voteData.length === userCount )
      } else { // voteData is not an array
        res.json( false );
      } // end if ( isArray )
    } );
  } );  
}



module.exports = {

  getAllVotes: getAllVotes,
  addVote: addVote,
  getSessMovieVotes: getSessMovieVotes,
  checkMatch: checkMatch
  
};
