var User = require( './users' );
var Friendship = require('../friendships/friendshipController');
var Promise = require('bluebird');
var jwt =require('jwt-simple')

module.exports = {

  getUser: function(req, res) {
    User.find({where: {fb_id: req.query.fbId}})
    .then(function(user) {
      var token = jwt.encode(user, 'secret');
      res.json({
        user: user,
        token: token
      });
    })
    .catch(function(err) {
      console.error(err);
    })
  },
  
  getFriends: function (req, res) {
    var userId = req.params.id;
    User.find({
      where: {id: userId},
      include: [{model: User, as: 'Friends'}]
    })
    .then(function(user) {
      res.json(user.Friends);
    })
    .then(function(friends) {
      res.json(friends);
    })
    .catch(function(err) {
      console.error(err);
      res.statusCode = 500;
      res.send(err);
    });
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
        return Promise.all(friends.map(function (fbFriend) {
          return User.find({where: {fb_id: fbFriend.id}})
          .then(function(friend) {
            user.addFriend(friend);
          })
          .catch(function(err) {
            console.error(err);
          })
          // return Friendship.findOrCreate(user.dataValues.id, friend.id);
        }));
      })
      .catch(function (error) {
        console.error(error);
      });
  },

  signout: function() {

  }

};