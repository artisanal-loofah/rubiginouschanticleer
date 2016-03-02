var User = require( './users' );
var Friendship = require('./friendships/friendships');

module.exports = {
  getAllUsers: function() {
    
  },

  findOrCreate: function (profile) {
    //var friendswithapp = profile._json.friends.data;
    var newUser = {
      fb_id: profile.id,
      username: profile.displayName,
      picUrl: profile._json.picture.data.url
    };

    User.findOne({where: {fb_id: newUser.fb_id}})
    .then(function (user) {
      if (user) {
        user.friends = 
      } else {
        User.create(newUser)
      }
    }).catch(function (error) {
      console.error(error);
    })

  },

  signout: function() {

  }

};