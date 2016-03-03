var Friendship = require('./friendships');
var User = require('../users/users');

module.exports = {
 
  friendsFindOrCreate: function (userid, friendFbId) {
    return Friendship.findOne({where: {user_id: userid, friend_fb_id: friendFbId}})
    .then(function (friendship) {
      if (friendship) {
        return friendship;
      } else {
        Friendship.create({
          user_id: userid,
          friend_fb_id: friendFbId
        }).then(function (friendship) {
          return friendship;
        })
      }
    }).catch(function (err) {
      console.error(err);
    })
  },

  friendsFindAll: function (request, response) {
    var userId = request.params.fbId.slice(1);

    User.findOne({where: {fb_id: userId}})
    .then(function (user) {
      var targetId = user.dataValues.id;
      Friendship.findAll({where: {user_id: targetId}})
      .then(function (friendship) {
        response.json(friendship);
      });
    });
  },

  friendsInfo: function (request, response) {
    User.findOne({where: {fb_id: request.body.friend_fb_id}})
    .then(function (friend) {
      //console.log('friend: ', friend)
      response.json(friend.dataValues);
    })
  }

};