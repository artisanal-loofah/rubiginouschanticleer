var Friendship = require('./friendships');
// var User = require('./users/users');

module.exports = {
 
  friendsFindOrCreate: function (userid, friendFbId) {
    console.log('are we getting here???? =========')
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