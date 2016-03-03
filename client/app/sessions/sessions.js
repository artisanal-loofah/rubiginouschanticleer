angular.module('dinnerDaddy.sessions', [])

.controller('SessionsController', function ($scope, $rootScope, $cookies, $window, Session, Auth, Socket) {
  $scope.username = $cookies.get('name');
  $rootScope.currentSession;
  $scope.sessions = [];

  $scope.sessionName = '';

  Auth.getUserToken($cookies.get('fbId'))
  .then(function(token) {
    $window.localStorage.setItem('com.dinnerDaddy', token);
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.fetchSessions = function() {
    Session.fetchSessions()
    .then(function(sessions) {
      $scope.sessions = sessions;
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  // UNCOMMENT THIS WHEN IT WORKS: $scope.fetchSessions();

  //this function listens to a event emitted by server.js-'new session' and recieves and appends the new session
  Socket.on('newSession', function(data) {
    $scope.sessions.push(data);
  });

  $scope.setSession = Session.setSession;

  $scope.createSession = function() {
    Session.createSession($scope.sessionName, $scope.sessionLocation)
    .then(function() {
      console.log('created session');
      $rootScope.currentSession = session;
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
  $scope.joinSession = function(index) {
    var session = $scope.sessions[index];
    $rootScope.currentSession = session;
    Session.setSession(session.sessionName);
    Session.joinSession(session.id)
    .then(function() {
      emitJoin($scope.username, session.sessionName);
    })
    .catch(function(err) {
      console.error(err);
    });
  };


  $scope.getFriends = function (user) {
    console.log($cookies)
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
        url: '/api/sessions/users',
        data: {
          sessionId: sessionId
        }
      });
    };

    var setSession = function(sessionName) {
      $window.localStorage.setItem('sessionName', sessionName);
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

    }

    return {
      createSession: createSession,
      fetchSessions: fetchSessions,
      joinSession: joinSession,
      setSession: setSession,
      getSession: getSession,
      getFriends: getFriends
    }
})
