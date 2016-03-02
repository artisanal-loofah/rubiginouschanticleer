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
  }

};