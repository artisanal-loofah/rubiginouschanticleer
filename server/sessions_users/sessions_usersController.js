var helpers = require( '../config/helpers' );
var Session_User = require( './sessions_users' );
var Session = require( '../sessions/sessions' );
var User = require( '../users/users' )
module.exports = {

  getUsersInOneSession: function( req, res, next ) {
    var sessionName = req.params.sessionName;
    Session.findOne( {where: {sessionName: sessionName}} )
    .then( function(session) {
      Session_User.findAll( {where: {session_id: session.id}} )
      .then( function(sessions_users) {
        var users = [];
        for(var i = 0; i < sessions_users.length; i++){
          users.push(sessions_users[i].dataValues.user_id);
        }
        User.findAll( {where: {id: {$in: users}}} )
        .then( function(users) {
          res.send(users);
        } )
      } )
    } )
  },

  countUsersInOneSession: function( req, res, next ) {
    // expects req.params.session_id
    var sessionId = parseInt( req.params.session_id );
    Session_User.countUsersInOneSession( sessionId )
    .then( function( count ) {
      res.json( count );
    }, function( err ) {
      helpers.errorHandler( err, req, res, next );
    });
  },

  getSessionUserBySessionAndUser: function( req, res, next ) {
    // expects req.params.session_id
    // expects req.params.user_id
    // responds with data for that user in that session
    var session = parseInt( req.params.session_id );
    var user = parseInt( req.params.user_id );

    console.log("getSessionUserBySessionAndUser", session, user);
    if( !session ) {
      res.status( 400 );
      res.send( "Invalid session id" );
      return;
    }
    if( !user ) {
      res.status( 400 );
      res.send( "Invalid user id" );
      return;
    }
    Session_User.getSessionUserBySessionIdAndUserId( session, user )
      .then( function( sessionUser ) {
        res.json( sessionUser );
      })
      .catch( function( err ) {
        helpers.errorHandler( err, req, res, next );
      } );
  },

  addOneUser: function(req, res, next) {
    var username = req.body.username;
    var sessionName = req.body.sessionName;

    User.findOne({where: {username : username}})
    .then(function(user) {
      return Session.findOne({where: {sessionName : sessionName}});
    })
    .then(function(session) {
      return Session_User.findOrCreate({
        where: {
          user_id: user.id,
          session_id: session.id
        }
      });
    })
    .then(function(sessionUser) {
      res.statusCode = 201;
      res.json(sessionUser);
    })
    .catch(function(err) {
      helpers.errorHandler(err, req, res, next);
    });
  }
};
