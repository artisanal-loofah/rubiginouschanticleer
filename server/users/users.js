var db = require( '../config/db');
var Sequelize = require('sequelize' );

var User = db.define( 'users', {
  fb_id: Sequelize.STRING,
  username: Sequelize.STRING,
  picUrl: Sequelize.STRING
});

User.sync().then(function() {
  console.log( "users table created");
})
.catch( function( err ) {
  console.error( err);
});

module.exports = User;
