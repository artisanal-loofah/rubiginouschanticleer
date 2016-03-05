var helpers = require( '../config/helpers' );
var Vote = require( './votes' );
var Session_User = require( '../sessions_users/sessions_users' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' );

var getAllVotes = function() {};

var addVote = function(req, res) {

  var addVote = function(session_user, restaurantId, vote, sessionId) {
    Vote.addVote(session_user, restaurantId, vote, sessionId)
    .then(function (data) {
      res.status( 201 );
      res.json( data );
      }, function( err ) {
        helpers.errorHandler( err, req, res );
      });
  };

  var session_user;
  var restaurantId = parseInt( req.body.restaurantId );
  var vote = req.body.vote;
  User.findOne({where: {username: req.body.username}})
    .then(function (user) {
      var user = user.dataValues.id;
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
                addVote(session_user, restaurantId, vote, sessionUser.dataValues.session_id);
              }
            });
          } else {
            send400('No session, user, or session_user id provided');
            return;
          }
        } else {
          addVote(session_user, restaurantId, vote, sessionUser.dataValues.session_id);
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
            Vote.deleteVotes(sessionId);
            res.json(true);
          } else {
            res.json(false);
          }
        } else {
          res.json(false);
        }
      } else {
        res.json(false);
      }
    });
  });  
};

module.exports = {

  getAllVotes: getAllVotes,
  addVote: addVote,
  getSessionVotes: getSessionVotes,
  checkMatch: checkMatch
  
};
