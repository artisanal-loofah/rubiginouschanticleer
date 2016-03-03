angular.module('dinnerDaddy.sessions', [])

.controller('SessionsController', function ($scope, $cookies, Session, Auth, Socket) {
  // TODO: these two will need to be removed and created in a different controller
  // $scope.username = '';
  // $scope.username = Auth.getUserName();
  // TODO: this will need to be pulled from the api
  $scope.sessions = [];

  $scope.sessionName = '';

  $scope.fetchSessions = function() {
    Session.fetchSessions().then(function(sessions) {
      $scope.sessions = sessions;
    });
  }

  // $scope.fetchSessions();
  //this function listens to a event emitted by server.js-'new session' and recieves and appends the new session
  Socket.on('newSession', function(data) {
    $scope.sessions.push(data);
  });

  // TODO: Create functions to make buttons work
  $scope.setSession = Session.setSession;
  $scope.createSession = function() {
    Session.createSession($scope.sessionName, $scope.emitCreate);
    $scope.joinSession($scope.sessionName);
  };
  $scope.joinSession = function(sessionName) { // sessionName is from a given session in the view, or from creation
    Session.setSession(sessionName);
    Session.joinSession(sessionName, $scope.username, $scope.emitJoin);
  };

  $scope.emitCreate = function(sessionName) {
    //this function emits a create event to the socket.
    Socket.emit('session', {sessionName : sessionName});
  };
  $scope.emitJoin = function(username, sessionName) {
    //this function emits a new join event to the socket.
    Socket.emit('newJoin', {username: username, sessionName: sessionName});
  };

  $scope.getFriends = function () {
    var fbId = $cookies.get('fbId')
    Session.getFriends(fbId);
  };

  $scope.getFriends();
})

.factory('Session', function($http, $window, $location) {

    var createSession = function(sessionName, callback) {
      return $http.post('/api/sessions', { sessionName: sessionName })
      .then(function(response) {
        callback(sessionName); // used for emitting session data
        return response;
      }, function(err) {
        console.error(err);
      });
    };

    var fetchSessions = function() {
      return $http.get ('/api/sessions')
      .then(function(response) {
        return response.data;
      }, function(err) {
        console.error(err);
      }); 
    };

    var joinSession = function(sessionName, username, callback) {
      return $http.post('/api/sessions/users', { sessionName: sessionName, username: username })
      .then(function(response) {
        callback(username, sessionName); // used for emitting session data
        $location.path('/lobby');
        return response;
      }, function(err) {
        console.error(err);
      });
    };

    var setSession = function(sessionName) {
      $window.localStorage.setItem('sessionName', sessionName);
    }; 

    var getSession = function() {
      var sessionName = $window.localStorage.getItem('sessionName');
      return $http.get('/api/sessions/' + sessionName)
      .then(function(session) {
        return session.data;
      }, function(err) {
        console.error(err);
      });
    };

    var getFriends = function (fbId) {
      return $http({
        method: 'GET',
        url: '/api/friends/:'+ fbId
      }).then(function (friends) {

        //console.log('what do we have here? :', friends.data);
        return friends.data;
      })
    };

    return {
      createSession: createSession,
      fetchSessions: fetchSessions,
      joinSession: joinSession,
      setSession: setSession,
      getSession: getSession,
      getFriends: getFriends
    }
})
