var db = require( '../config/db');
var Sequelize = require('sequelize' );

var User = db.define( 'users', {
  fb_id: Sequelize.STRING,
  username: Sequelize.STRING,
  picUrl: Sequelize.STRING
});

var UserFriend = db.define('user_friends', {});
// create a many to many relation between users and friends
// (who are also users)
User.belongsToMany(User, {as: 'Friends', through: UserFriend});

UserFriend.sync();
User.sync().then(function() {
  console.log( "users table created");
})
.catch( function( err ) {
  console.error( err);
});

module.exports = User;
