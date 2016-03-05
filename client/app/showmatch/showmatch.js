angular.module( 'dinnerDaddy.showmatch', [] )

.controller( 'ShowmatchController', function( $scope, $rootScope, Session, Auth, $routeParams, $cookies, $window, Socket) {

  if (!$rootScope.matched) {
    $rootScope.matched = JSON.parse($window.localStorage.getItem('matched'));
    var currentImageURL = $rootScope.matched.image_url;
    $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
  }

  if ($rootScope.user === undefined) {
    Auth.getUser($cookies.get('fbId'))
    .then(function(data) {
      $rootScope.user = data.user;
      $rootScope.user.username = data.user.username;
    });
  } 

  $scope.currMovie = {};
  var id = parseInt( $routeParams.id );
})
