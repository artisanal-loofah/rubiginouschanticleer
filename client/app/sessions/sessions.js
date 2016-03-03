angular.module('dinnerDaddy.sessions', [])

.controller('SessionsController', function ($scope, $cookies, Session, Auth, Socket) {
  $scope.username = $cookies.get('name');
  $scope.sessions = [];

  $scope.sessionName = '';

  $scope.fetchSessions = function() {
    Session.fetchSessions($scope.username)
    .then(function(sessions) {
      $scope.sessions = sessions;
    });
  };

  // UNCOMMENT THIS WHEN IT WORKS: $scope.fetchSessions();

  //this function listens to a event emitted by server.js-'new session' and recieves and appends the new session
  Socket.on('newSession', function(data) {
    $scope.sessions.push(data);
  });

  $scope.setSession = Session.setSession;

  $scope.createSession = function() {
    Session.createSession($scope.sessionName)
    .then(function() {
      console.log('created session');
      Socket.emit('session', {sessionName: $scope.sessionName});
      $scope.joinSession($scope.sessionName);
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var emitJoin = function(username, sessionName) {
    //this function emits a new join event to the socket.
    Socket.emit('newJoin', {
      username: username,
      sessionName: sessionName
    });
    $location.path('/lobby');
  };

  // sessionName is from a given session in the view, or from creation
  $scope.joinSession = function(sessionName) {
    Session.setSession(sessionName);
    Session.joinSession($scope.username, sessionName)
    .then(function() {
      emitJoin($scope.username, sessionName);
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  $scope.friends = [];

  $scope.getFriends = function () {
    var fbId = $cookies.get('fbId')
    Session.getFriends(fbId).then(function (info) {
      for (var i=0; i < info.length; i++) {
        Session.getFriendInfo(info[i])
        .then(function (friend) {
          $scope.friends.push(friend);
        })
      }
    })
  };

  $scope.getFriends();
})

.factory('Session', function($http, $window, $location) {

    var createSession = function(sessionName) {
      return $http({
        method: 'POST',
        url: '/api/sessions',
        data: {
          sessionName: sessionName
        }
      });
    };

    var fetchSessions = function(username) {
      return $http({
        method:'GET',
        url: '/api/sessions',
        params: {
          username: username
        }
      })
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err);
      }); 
    };

    var joinSession = function(username, sessionName) {
      return $http({
        method: 'POST',
        url: '/api/sessions/users',
        data: {
          sessionName: sessionName,
          username: username
        }
      });
    };

    var setSession = function(sessionName) {
      $window.localStorage.setItem('sessionName', sessionName);
    }; 

    var getSession = function() {
      var sessionName = $window.localStorage.getItem('sessionName');
      return $http.get('/api/sessions/' + sessionName)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err);
      });
    };

    var getFriends = function (fbId) {
      return $http({
        method: 'GET',
        url: '/api/friends/:'+ fbId
      }).then(function (friends) {
        return friends.data;
      })
    };

    var getFriendInfo = function (friend) {
      return $http({
        method: 'POST',
        url: '/api/friends',
        data: friend
      }).then(function (friendInfo) {
        return friendInfo.data;
      })
    };

    return {
      createSession: createSession,
      fetchSessions: fetchSessions,
      joinSession: joinSession,
      setSession: setSession,
      getSession: getSession,
      getFriends: getFriends,
      getFriendInfo: getFriendInfo
    }
})
