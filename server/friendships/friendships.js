var db = require( '../config/db');
var Sequelize = require( 'sequelize' );
var User = require('../users/users');

var Friendship = db.define('friendships', {
  user_id: Sequelize.INTEGER,
  friend_fb_id: Sequelize.STRING
});

Friendship.sync().then(function() {
  console.log("friendships table created");
})
.catch( function(err) {
  console.error(err);
});


Friendship.belongsTo(User, {foreignKey: 'id'});

module.exports = Friendship;
