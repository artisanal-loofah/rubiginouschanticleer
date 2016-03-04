angular.module( 'dinnerDaddy.showmatch', [] )

.controller( 'ShowmatchController', function( $scope, FetchMovies, Session, Auth, $routeParams ) {

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  $scope.user = {};
  $scope.user.name = $cookies.get('name');

  $scope.currMovie = {};
  var id = parseInt( $routeParams.id );

  FetchMovies.getMovie( id )
  .then( function( movie ) {
    $scope.currMovie = movie;
  });

});
