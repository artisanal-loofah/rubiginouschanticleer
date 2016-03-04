angular.module( 'dinnerDaddy.lobby', [] )

.controller('LobbyController', function($scope, $rootScope, $location, Session, Lobby, Socket, Auth) {
  $scope.users = [];
  $rootScope.currentSession;
    
  Lobby.getUsersInOneSession($rootScope.currentSession.id)
  .then(function(users){
    $scope.users = users;    
  });


  $scope.startSession = function( sessionId ) {
    Socket.emit('startSession', { sessionId: sessionId });
  };

  // Listening for newUser event and updates users 
  Socket.on('newUser', function (data) {
    $scope.users.push(data);
  });

  // Listening for started session, relocates to /match path
  Socket.on('sessionStarted', function () {
    $location.path('/match');
  });
})
.factory('Lobby', function($http) {
  return {
    getUsersInOneSession: function(sessionId) {
      return $http({
        method:'GET',
        url: '/api/sessions/'+ sessionId + '/users/',
        params: {
          sessionId: sessionId
        }})
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err);
      });
    }
  }
});