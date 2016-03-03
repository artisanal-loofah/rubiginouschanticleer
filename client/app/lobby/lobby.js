angular.module( 'dinnerDaddy.lobby', [] )

.controller('LobbyController', function($scope, $rootScope, Session, Lobby, Socket, $location, Auth) {
  // $scope.session = {};
  // $scope.username = Auth.getUserName();
  $scope.users = [];
  $rootScope.currentSession;

  // Session.getSession()
  // .then( function( session ) {

  //   $scope.session = session;

  Lobby.getUsersInOneSession($rootScope.currentSession.id)
  .then(function(users){
    $scope.users = users;
  });

  // });



  //this function is listening to any newUser event and recieves/appends the new user
  Socket.on( 'newUser', function( data ) {
    $scope.users.push( data );
  } );

  $scope.startSession = function( sessionId ) {
    Socket.emit( 'startSession', { sessionId: sessionId } );
  };

  Socket.on( 'sessionStarted', function() {
    $location.path( '/match' );
  } );

} )

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