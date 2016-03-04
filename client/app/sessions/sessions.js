angular.module('dinnerDaddy.sessions', [])

.controller('SessionsController', function ($scope, $rootScope, $cookies, $window, $location, Session, Auth, Socket) {
  $rootScope.currentSession;
  $rootScope.user;
  $scope.sessions = [];
  $scope.friends = [];

  $scope.sessionName = '';

  var fetchSessions = function() {
    Session.fetchSessions()
    .then(function(sessions) {
      $scope.sessions = sessions;
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  var getFriends = function(userId) {
    Session.getFriends(userId)
    .then(function(friends) {
      $scope.friends = friends;
    });
  };

  Auth.getUser($cookies.get('fbId'))
  .then(function(data) {
    $window.localStorage.setItem('com.dinnerDaddy', data.token);
    $rootScope.user = data.user;
    fetchSessions();
    getFriends(data.user.id);
  })
  .catch(function(err) {
    console.error(err);
  });

  Socket.on('newSession', function(data) {
    $scope.sessions.push(data);
  });

  $scope.createSession = function() {
    Session.createSession($scope.sessionName, $scope.sessionLocation)
    .then(function(session) {
      console.log('created session');
      $rootScope.currentSession = session;
      Socket.emit('session', {sessionId: session.id});
      enterSession(session.id);
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var emitJoin = function(userId, sessionId) {
    //this function emits a new join event to the socket.
    Socket.emit('newJoin', {
      userId: userId,
      sessionId: sessionId
    });
    $location.path('/lobby');
  };

  var enterSession = function(sessionId) {
    Session.setSession(sessionId);
    Session.joinSession(sessionId)
    .then(function(user) {
      emitJoin(user.id, sessionId);
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  $scope.joinSession = function(index) {
    var session = $scope.sessions[index];
    $rootScope.currentSession = session;
    enterSession(session.id);
  };

})

.factory('Session', function($http, $window, $location) {

    var createSession = function(sessionName, sessionLocation) {
      return $http({
        method: 'POST',
        url: '/api/sessions',
        data: {
          sessionName: sessionName,
          sessionLocation: sessionLocation
        }
      })
      .then(function(res) {
        return res.data;
      });
    };

    var fetchSessions = function() {
      return $http({
        method:'GET',
        url: '/api/sessions'
      })
      .then(function(res) {
        return res.data;
      });
    };

    var joinSession = function(sessionId) {
      return $http({
        method: 'POST',
        url: '/api/sessions/' + sessionId + '/users'
      })
      .then(function(res) {
        return res.data;
      });
    };

    var setSession = function(sessionId) {
      $window.localStorage.setItem('sessionId', sessionId);
    }; 

    var getSession = function(session) {
      return $http.get('/api/sessions/' + session.id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err);
      });
    };

    var getFriends = function (userId) {
      return $http({
        method:'GET',
        url: '/api/users/' + userId + '/friends'
      })
      .then(function(res) {
        return res.data;
      });
    };

    return {
      createSession: createSession,
      fetchSessions: fetchSessions,
      joinSession: joinSession,
      setSession: setSession,
      getSession: getSession,
      getFriends: getFriends
    };
})
