var db = require( '../config/db' );
var helpers = require( '../config/helpers' );
var Sequelize = require( 'sequelize' );
var User = require( '../users/users' );
var Session = require( '../sessions/sessions' );

var Session_User = db.define( 'sessions_users', {
	user_id: {
    type: Sequelize.INTEGER,
    unique: 'session_user_idx'
  },
	session_id: {
    type: Sequelize.INTEGER,
    unique: 'session_user_idx'
  }
} );

Session_User.sync().then( function(){
  console.log("sessions_users table created");
} )
.catch( function( err ){
  console.error(err);
} );

Session_User.belongsTo( User, {foreignKey: 'user_id'} );
Session_User.belongsTo( Session, {foreignKey: 'session_id'} );

Session_User.getSessionUserBySessionIdAndUserId = function( sessionID, userID ) {
  console.log('searching in ....getSessionUserBySessionIdAndUserId......');
  return Session_User.findOne({where: {session_id: sessionID, user_id: userID} })
    .catch( function( err ) {
      helpers.errorLogger( err );
    });
};

Session_User.countUsersInOneSession = function( sessionID ) {
  return Session_User.count( { where: { session_id: sessionID } } )
  .then( function( result ) {
    console.log( 'Count', sessionID, result );
    return result;
  })
  .catch( function( err ) {
    helpers.errorLogger( err );
  });
};

module.exports = Session_User; 
