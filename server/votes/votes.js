var Sequelize = require( 'sequelize' );

var db = require( '../config/db' );
var helpers = require( '../config/helpers' );
var UserSession = require( '../sessions/sessions');


var Vote = db.define('votes', {
  session_user_id: {
    type: Sequelize.INTEGER,
    unique: 'su_movie_idx'
  },
  restaurantId: {
    type: Sequelize.INTEGER,
    unique: 'su_movie_idx'
  },
  vote: {
    type: Sequelize.BOOLEAN
  },
  sessionId: {
    type: Sequelize.INTEGER
  }
});

Vote.sync().then( function() {
  console.log( "votes table created" );
})
.catch( function( err ) {
  console.error( err );
});

Vote.addVote = function (sessionUserId, restaurantId, vote, sessionId) {
  return Vote.create({ session_user_id: sessionUserId, restaurantId: restaurantId, vote: vote, sessionId: sessionId })
    .catch(function (err) {
      console.error(err.stack);
    });
};

Vote.deleteVotes = function (sessionId) {
  Vote.destroy({ where: { sessionId: sessionId }})
    .catch(function (err) {
      console.error("Error destroying votes: ", err);
    });
};

Vote.getSessionVotes = function (sessionId, restaurantId) {
  return Vote.findAll({ where: { restaurantId: restaurantId }})
  .catch( function( err ) {
    console.error( err.stack );
  });
};


module.exports = Vote;
