angular.module( 'dinnerDaddy.match', ['dinnerDaddy.services'] )

.controller( 'MatchController', function( $scope, $rootScope, Match, Auth, Session, Socket, Restaurant, $cookies) {
  $scope.session = {};
  $scope.user = {};

  $scope.user.name = $cookies.get('name');

  $scope.restaurants;
  $scope.currRestaurant;
  $scope.currRestaurantImageHD;

  Session.getSession()
  .then(function (session) {
    console.log('got the session: ', session);
    $scope.session = session;
  });

  var currRestaurantIndex = 0;

  var fetchRestaurants = function (location) {
    Restaurant.getRestaurants(location)
      .then(function (data) {
        $scope.restaurants = data;
        $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
        var currentImageURL = $scope.currRestaurant.image_url;
        $scope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
        console.log('fetched ok: ', $scope.restaurants);
      });
  };

  var loadNextRestaurant = function(){
      currRestaurantIndex++;
      $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
      var currentImageURL = $scope.currRestaurant.image_url;
      $scope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
      console.log('current restaurant: ', $scope.currRestaurant);
  };

  $scope.init = function (location) {
    // Get restaurants with location defined by user when session was created
    fetchRestaurants($rootScope.currentSession.sessionLocation);
  };

  $scope.init();

  // Listen for the signal to redirect to a 'match found' page.
  Socket.on( 'matchRedirect', function( id ) {
    // id refers to the id of the movie that the group matched on
    Match.matchRedirect( id );
  });

  $scope.yes = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $scope.user.name, currRestaurantIndex, true )
    // For every 'yes' we want to double check to see if we have a match. If we do,
    // we want to send a socket event out to inform the server.
      .then(function () {
        console.log('checking match......');
        Match.checkMatch($scope.currentSession.id, currRestaurantIndex)
          .then(function (result) {
            console.log('CHECKMATCH RESULT: ', result);
            if (result !== false) {
              console.log('FOUND A MATCH..socket emit...');
              Socket.emit( 'foundMatch', { sessionName: $rootScope.currentSession.sessionName, restaurant: currRestaurantIndex } );
              Match.matchRedirect(currRestaurantIndex);
            } else {
              loadNextRestaurant(); 
            }
          });
      });
  }

  $scope.no = function() {
    console.log('clicked on NO');
    console.log('session object:', $rootScope.currentSession);
    Match.sendVote($rootScope.currentSession.sessionName, $scope.user.name, currRestaurantIndex, false);
    loadNextRestaurant();
  }
})
.factory( 'Match', function($http, $location) {
  return {
    sendVote: function(sessionName, username, movieID, vote) {
      console.log('sending vote....');
      return $http.post( // returns a promise; if you want to make use of a callback simply use .then on the return value.
        '/api/votes', // expect this endpoint to take a json object
                                      // with sessionID and userID
                                      // OR sessionuserID
                                      // AND movieID
                                      // AND vote (boolean true/false where true is yes and false is no)
        { sessionName: sessionName, username: username, movie_id: movieID, vote: vote})
      .then(function (response) { // if the promise is resolved
        console.log('promise resolved in sendvote, resp is: ', response);
        return response;
      },
      function(err) { // if the promise is rejected
        console.error('Error in send vote POST request: ', err);
      });
    },

    matchRedirect: function(id) {
      $location.path( '/showmatch/' + id );
    },

    checkMatch: function(session, movie) {
      console.log('MAKING CHECKMATCH GET REQUEST... w/ ', session, movie);
      // expects session and movie
      // Calls /api/sessions/:sid/match/:mid
      // Should get back either 'false' or the data for the matched movie
      return $http.get(
        '/api/sessions/' + session + '/match/' + movie
      )
      .then(function (response) {
        console.log('PROMISE RESOLVED IN CHECKMATCH: ', response);
        return response.data;
      }, function (err) {
        console.error(err);
      });
    }

  }
});
