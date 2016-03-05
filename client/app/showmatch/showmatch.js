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
    $rootScope.matched = JSON.parse($window.localStorage.getItem('matched'));
    var currentImageURL = $rootScope.matched.image_url;
    $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
  }

  console.log('the root scope matched:', $rootScope.matched);
  $scope.user = {};
  $scope.user.name = $cookies.get('name')
  $scope.restaurant = $rootScope.matched;

  $scope.currMovie = {};
  var id = parseInt( $routeParams.id );
})
