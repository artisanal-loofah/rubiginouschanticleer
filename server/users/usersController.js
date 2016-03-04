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
    // this query includes the models connected to the user
    // by the belongsToMany 'Friend' association under the key
    // 'Friends'. We can then access with 'user.Friends'.
    User.find({
      where: {id: userId},
      include: [{model: User, as: 'Friends'}]
    })
    .then(function(user) {
      res.json(user.Friends);
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
          return User.create({
            fb_id: profile.id,
            username: profile.displayName,
            picUrl: profile._json.picture.data.url
          });
        }
      })
      .then(function (user) {
        return Promise.all(friends.map(function (fbFriend) {
          return User.find({where: {fb_id: fbFriend.id}})
          .then(function(friend) {
            // use the Sequelize method provided by the belongsToMany
            // association to add a friend for this user
            user.addFriend(friend);
          })
          .catch(function(err) {
            console.error(err);
          })
        }));
      })
      .catch(function (error) {
        console.error(error);
      });
  },

  signout: function() {

  }

};