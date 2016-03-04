angular.module( 'dinnerDaddy.showmatch', [] )

.controller( 'ShowmatchController', function( $scope, $rootScope, FetchMovies, Session, Auth, $routeParams, $cookies) {

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  $scope.user = {};
  $scope.user.name = $cookies.get('name')
  $scope.restaurant = $rootScope.matched;
  console.log('SCOPE.RESTAURANT IS..........', $rootScope.matched);

  $scope.currMovie = {};
  var id = parseInt( $routeParams.id );



  FetchMovies.getMovie(id)
  .then(function(movie) {
    $scope.currMovie = movie;
  });

})
.factory( 'FetchMovies', function( $http ) {
  return {

    getMovie: function( id ) {
      return $http.get( '/api/movies/' + id )
      .then( function( res ) {
        return res.data;
      },
      function( err ) {
        console.error( err );
      });
    },

    getNext10Movies: function( packageNumber ) {
      return $http.get( '/api/movies/package/' + packageNumber )
      .then( function( res ) {
        return res.data;
      },
      function( err ) {
        console.error( err );
      } );
    }

  }
});