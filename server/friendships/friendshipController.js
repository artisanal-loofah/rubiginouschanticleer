var Friendship = require('./friendships');
var User = require('./users/users');

module.exports = {
 
  friendsFindOrCreate: function (userid, friendFbId, cb) {

    Friendship.findOne({where: {user_id: userid, friend_fb_id: friendFbId}})
    .then(function (friendship) {
      if (friendship) {
        cb(friendship);
      } else {
        Friendship.create({
          user_id: userid,
          friend_fb_id: friendFbId
        });
      }
    }).catch(function (err) {
      console.error(err);
    })
  }

};