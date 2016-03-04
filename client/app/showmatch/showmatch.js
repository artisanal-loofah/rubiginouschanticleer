angular.module( 'dinnerDaddy.showmatch', [] )

.controller( 'ShowmatchController', function( $scope, $rootScope, Session, Auth, $routeParams, $cookies, $window, Socket) {

  // Check if there is a session in rootScope, if not, create session
  // if (!$rootScope.currentSession) {
  //   Session.getSession($window.localStorage.getItem('sessionId'))
  //   .then(function (session) {
  //     $rootScope.currentSession = session;
  //   });
  // } 

  if (!$rootScope.matched) {

  }

  console.log('the root scope:', $rootScope);
  $scope.user = {};
  $scope.user.name = $cookies.get('name')
  $scope.restaurant = $rootScope.matched;

  $scope.currMovie = {};
  var id = parseInt( $routeParams.id );
})
