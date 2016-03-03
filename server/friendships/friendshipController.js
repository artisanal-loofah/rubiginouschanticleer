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
      console.log('this is the user: ', user);
      var targetId = user.dataValues.id;
      Friendship.findAll({where: {user_id: targetId}})
      .then(function (friendship) {
        console.log('friendships are : ', friendship)
        response.json(friendship);
      });
    });
  }

};