var User = require( './users' );
var Friendship = require('../friendships/friendshipController');
var Promise = require('bluebird');
var jwt =require('jwt-simple')

module.exports = {

  getUserToken: function(req, res) {
    User.find({where: {fb_id: req.query.fbId}})
    .then(function(user) {
      var token = jwt.encode(user, 'secret');
      res.json(token);
    })
    .catch(function(err) {
      console.error(err);
    })
  },
  
  getFriends: function (profile) {

  },

  findOrCreate: function (profile) {
    var friends = profile._json.friends.data;

    User.findOne({where: {fb_id: profile.id}})
      .then(function (user) {
        if (user) {
          return user;
        } else {
          User.create({
            fb_id: profile.id,
            username: profile.displayName,
            picUrl: profile._json.picture.data.url
          })
          .then(function (user) {
            return user;
          })
        }
      })
      .then(function (user) {
        return Promise.all(friends.map(function (friend) {
          return Friendship.friendsFindOrCreate(user.dataValues.id, friend.id);
        }));
      })
      .catch(function (error) {
        console.error(error);
      });
  },

  signout: function() {

  }

};