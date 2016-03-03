var Friendship = require('./friendships');

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

    console.log('userId is : ', userId);

    Friendship.findAll({where: {user_id: userId}})
    .then(function (friends) {
      console.log('friends are : ', friends)
      return friends;
    })
  }

};