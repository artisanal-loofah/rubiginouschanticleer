var User = require( './users' );
var jwt = require( 'jwt-simple' );

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
        console.error('username already exists')
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

// profile is:  { id: '10154541062237004',
//   username: undefined,
//   displayName: 'Gar Lee',
//   name:
//    { familyName: undefined,
//      givenName: undefined,
//      middleName: undefined },
//   gender: undefined,
//   profileUrl: undefined,
//   photos: [ { value: 'https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c0.188.621.621/s160x160/1185676_10152160782972004_1820608898_n.jpg?oh=88924e4d75ec5ba2b106f3b0e320edaa&oe=575B0503' } ],
//   provider: 'facebook',
//   _raw: '{"id":"10154541062237004","name":"Gar Lee","picture":{"data":{"height":160,"is_silhouette":false,"url":"https:\\/\\/scontent.xx.fbcdn.net\\/hprofile-xpa1\\/v\\/t1.0-1\\/c0.188.621.621\\/s160x160\\/1185676_10152160782972004_1820608898_n.jpg?oh=88924e4d75ec5ba2b106f3b0e320edaa&oe=575B0503","width":160}},"friends":{"data":[{"name":"Akshay Buddiga","id":"10153499359678505"}],"paging":{"next":"https:\\/\\/graph.facebook.com\\/v2.5\\/10154541062237004\\/friends?access_token=CAAKSurq6HqUBAHWU9APULZA1O3lTgWn56hBmTgwrFtETJolyL5WjgAisPh3XYvmcvOLtDY586LNkXLMHwLZCTITUsRwbFGJn96bZCPcg0vPZBBvi2oxZCzfIQCwVWxBzLBjwTf2xZBmb07S7tZCr5JZBgTn5NDEQodbNIedeqUIpQAMYSBtVFCtK95ZCn9Kcx4sCqKncxVZA0t2QZDZD&limit=25&offset=25&__after_id=enc_AdDgbR4DraRzESUZC34XuuvmaUOtmCV4CJsIdmjI7CA90OwEsWvhNgqzk3TY3ZC7WJinEZD"},"summary":{"total_count":583}}}',
//   _json:
//    { id: '10154541062237004',
//      name: 'Gar Lee',
//      picture: { data: [Object] },
//      friends: { data: [Object], paging: [Object], summary: [Object] } } }