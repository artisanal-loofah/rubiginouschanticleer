angular.module( 'dinnerDaddy.lobby', [] )

.controller('LobbyController', function($scope, $rootScope, $location, Session, Lobby, Socket, Auth, Restaurant) {
  $scope.users = [];
  $rootScope.currentSession;
  $rootScope.restaurants;
  Lobby.getUsersInOneSession($rootScope.currentSession.id)
  .then(function (users){
    $scope.users = users;    
  });

  $scope.startSession = function (sessionId) {
    Restaurant.getRestaurants($rootScope.currentSession.sessionLocation)
    .then(function(data){
      var shuffledRestaurants = _.shuffle(data);
      console.log(shuffledRestaurants, 'start session here shuffled');
      Socket.emit('startSession', {sessionId: sessionId, restaurants: shuffledRestaurants});
    });
  };

  // Listening for newUser event and updates users 
  Socket.on('newUser', function (data) {
    $scope.users.push(data);
  });

  // Listening for started session, relocates to /match path
  Socket.on('sessionStarted', function (data) {
    $rootScope.restaurants = data;
    $location.path('/match');
  });

})
.factory('Lobby', function ($http) {
  return {
    getUsersInOneSession: function (sessionId) {
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