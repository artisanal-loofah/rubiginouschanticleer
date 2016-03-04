angular.module( 'dinnerDaddy.showmatch', [] )

.controller( 'ShowmatchController', function( $scope, $rootScope, FetchMovies, Session, Auth, $routeParams, $cookies) {

  // Check if there is a session in rootScope, if not, create session
  if (!$rootScope.currentSession) {
    Session.getSession()
    .then(function (session) {
      $rootScope.currentSssion = session;
    }); 
  }

  $scope.user = {};
  $scope.user.name = $cookies.get('name')
  $scope.restaurant = $rootScope.matched;
});