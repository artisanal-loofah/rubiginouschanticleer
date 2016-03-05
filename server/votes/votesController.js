var helpers = require( '../config/helpers' );
var Vote = require( './votes' );
var Session_User = require( '../sessions_users/sessions_users' );
var mController = require( '../movies/moviesController' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' );

var getAllVotes = function() {};

var addVote = function(req, res) {
  console.log('>>>>>>>>>>in the addVote server side function...', req.body);

  var addVote = function(session_user, restaurantId, vote, sessionId) {
    Vote.addVote(session_user, restaurantId, vote, sessionId) // add vote to db
    .then(function (data) {
      // add vote to database
      // return 201 created
      res.status( 201 );
      res.json( data );
      }, function( err ) {
        helpers.errorHandler( err, req, res );
      });
  };

  var session_user = parseInt( req.body.sessionName );
  var restaurantId = parseInt( req.body.restaurantId );
  var vote = req.body.vote;
  var sessionId = req.body.sessionId;
  // var user = parseInt( req.body.user_id );
  // var session = parseInt( req.body.session_id );
  User.findOne({where: {username: req.body.username}})
    .then(function (user) {
      var user = user.dataValues.id;
      console.log('user found: ', user);
      Session.findOne({where: {sessionName: req.body.sessionName}})
      .then(function (session) {
        var session = session.dataValues.id;
        if(restaurantId === undefined) {
          send400('restaurant ID not provided');
          return;
        } else if (!session_user) {
          if(user && session) {
            Session.getUserSession(session, user)
            .then(function (sessionUser) {
              session_user = sessionUser.dataValues.user_id;
              if(!session_user) {
                res.status(404);
                res.send();
                return;
              } else {
                addVote(session_user, restaurantId, vote, sessionId);
              }
            });
          } else {
            send400('No session, user, or session_user id provided');
            return;
          }
        } else {
          addVote(session_user, restaurantId, vote, sessionId);
        };
    });
  });

  var send400 = function (message) {
    res.status(400);
    res.send(message);
  };
};

var getSessionVotes = function (req, res, next) {
  var sessionId = req.params.session_id;
  var restaurantId = req.params.restaurantId;
  Vote.getSessionVotes( sessionId, restaurantId )
  .then( function( voteData ) {
    res.json( voteData );
  }, function( err ) {
    helpers.errorHandler( err );
  })
};

var checkMatch = function(req, res, next) {

  var sessionId = req.params.session_id;
  var restaurantId = req.params.restaurantId;

  Session.countUsersInSession(sessionId)
  .then(function (userCount) {
    Vote.getSessionVotes(sessionId, restaurantId)
    .then(function (voteData) {
      if( Array.isArray( voteData ) ) {
        if(voteData.length === userCount ) {
          var matched = voteData.reduce( function( memo, curr ) {
            if(curr.vote === false ) {
              memo = false;
            }
            return memo;
          }, true);
          if(matched) {
            mController.getMovie(req, res); // pass response object to mController so it can res.send movie data
            Vote.deleteVotes(sessionId);
          } else {
            res.json( false );
          }
        } else {
          res.json( false );
        }
      } else {
        res.json( false );
      }
    });
  });  
}

module.exports = {

  getAllVotes: getAllVotes,
  addVote: addVote,
  getSessionVotes: getSessionVotes,
  checkMatch: checkMatch
  
};
