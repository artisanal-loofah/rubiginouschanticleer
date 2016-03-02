angular.module( 'dinnerDaddy.match', ['dinnerDaddy.services'] )

.controller( 'MatchController', function( $scope, Match, Auth, Session, FetchMovies, Socket, Restaurant ) {
  $scope.session = {};
  $scope.user = {};
  $scope.imgPath = 'http://image.tmdb.org/t/p/w500';

  $scope.user.name = Auth.getUserName();
  $scope.restaurants;
  $scope.currRestaurant;

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });

  var currRestaurantIndex = 0;

  var fetchNextMovies = function( packageNumber, callback ){
    FetchMovies.getNext10Movies( packageNumber )
      .then( function( data ) {
        $scope.moviePackage = data;
        callback();
      })
  };

  var fetchRestaurants = function (location) {
    Restaurant.getRestaurants(location)
      .then(function (data) {
        $scope.restaurants = data;
        $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
        console.log('fetched ok: ', $scope.restaurants);
      });
  };

  var loadNextRestaurant = function(){
      currRestaurantIndex++;
      $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
      console.log('current rest: ', $scope.currRestaurant);
  };

  $scope.init = function() {        //as soon as the view is loaded request the first movie-package here
    fetchRestaurants('San Francisco');
    fetchNextMovies( 0, function() {
      $scope.currMovie = $scope.moviePackage[0];
    });
  };

  $scope.init();

  // Listen for the signal to redirect to a 'match found' page.
  Socket.on( 'matchRedirect', function( id ) {
    // id refers to the id of the movie that the group matched on
    Match.matchRedirect( id );
  });

  $scope.yes = function() {
    Match.sendVote( $scope.session.sessionName, $scope.user.name, $scope.currMovie.id, true )
    // For every 'yes' we want to double check to see if we have a match. If we do,
    // we want to send a socket event out to inform the server.
    .then( function() {
      Match.checkMatch( $scope.session, $scope.currMovie )
      .then( function( result ) {
        if( result ) {
          Socket.emit( 'foundMatch', { sessionName: $scope.session.sessionName, movie: $scope.currMovie } );
        } else {
          loadNextRestaurant(); 
        }
      });
    });
  }
  $scope.no = function() {
    Match.sendVote( $scope.session.sessionName, $scope.user.name, $scope.currMovie.id, false );
    loadNextRestaurant();
  }
} );
