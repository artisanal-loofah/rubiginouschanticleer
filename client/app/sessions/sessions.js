angular.module('dinnerDaddy.sessions', [])

.controller('SessionsController', function ($scope, $rootScope, $cookies, $window, $location, Session, Auth, Socket) {
  // $scope.username = $cookies.get('name');
  $rootScope.currentSession;
  $rootScope.user;
  $scope.sessions = [];

  $scope.sessionName = '';

  Auth.getUser($cookies.get('fbId'))
  .then(function(data) {
    $rootScope.user = data.user;
    $window.localStorage.setItem('com.dinnerDaddy', data.token);
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.fetchSessions = function() {
    Session.fetchSessions()
    .then(function(sessions) {
      $scope.sessions = sessions;
      console.log($scope.sessions, 'this is the scope')
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  $scope.fetchSessions();

  Socket.on('newSession', function(data) {
    $scope.sessions.push(data);
  });

  $scope.setSession = Session.setSession;

  $scope.createSession = function() {
    Session.createSession($scope.sessionName, $scope.sessionLocation)
    .then(function(session) {
      console.log('created session');
      $rootScope.currentSession = session;
      Socket.emit('session', {sessionID: session.id});
      $scope.sessions.push(session);
      $scope.joinSession($scope.sessions.length - 1);
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var emitJoin = function(userID, sessionID) {
    //this function emits a new join event to the socket.
    Socket.emit('newJoin', {
      userID: userID,
      sessionID: sessionID
    });
    $location.path('/lobby');
  };

  // sessionName is from a given session in the view, or from creation
  $scope.joinSession = function(index) {
    var session = $scope.sessions[index];
    $rootScope.currentSession = session;
    Session.setSession(session.id);
    Session.joinSession(session.id)
    .then(function(user) {
      emitJoin(user.id, $rootScope.currentSession.id);
    })
    .catch(function(err) {
      console.error(err);
    });
  };


  $scope.getFriends = function (user) {
    console.log($cookies);
    Session.getFriends();
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

    var setSession = function(sessionID) {
      $window.localStorage.setItem('sessionID', sessionID);
    }; 
    // change getSession call in lobby.js and match.js to pass in session
    // OR just access session from rootScope if possible
    var getSession = function(session) {
      var sessionName = $window.localStorage.getItem('sessionName');
      return $http.get('/api/sessions/' + session.id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err);
      });
    };

    var getFriends = function (user) {

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
