angular.module( 'dinnerDaddy.match', ['dinnerDaddy.services'] )

.controller( 'MatchController', function( $scope, $rootScope, Match, Auth, Session, Socket, Restaurant, $cookies, $window) {
  $scope.session = {};
  $scope.user = {};

  $scope.user.name = $cookies.get('name');

  $scope.restaurants;
  $scope.currRestaurant;

  var currRestaurantIndex = 0;

  var fetchRestaurants = function (location) {
    Restaurant.getRestaurants(location)
      .then(function (data) {
        $scope.restaurants = data;
        $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
        var currentImageURL = $scope.currRestaurant.image_url;
        $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
      });
  };

  var loadNextRestaurant = function(){
      currRestaurantIndex++;
      $scope.currRestaurant = $scope.restaurants[currRestaurantIndex];
      var currentImageURL = $scope.currRestaurant.image_url;
      $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
  };

  $scope.init = function (location) {
    // Get restaurants with location defined by user when session was created
    fetchRestaurants($rootScope.currentSession.sessionLocation);
  };

  // Check if there is a currentSession on rootScope, if not create a new session
  if (!$rootScope.currentSession) {
    Session.getSession($window.localStorage.getItem('sessionId'))
    .then(function (session) {
      $rootScope.currentSession = session;
      $scope.init();
    });
  } else {
    $scope.init();
  }

  $scope.yes = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $scope.user.name, currRestaurantIndex, true, $rootScope.currentSession.id)
    .then(function () {
      Match.checkMatch($scope.currentSession.id, currRestaurantIndex)
        .then(function (result) {
          if (result !== false) {
            Socket.emit('foundMatch', {sessionName: $rootScope.currentSession.sessionName, restaurant: currRestaurantIndex, sessionId: $rootScope.currentSession.id, matched: $scope.currRestaurant});
            $rootScope.matched = $scope.currRestaurant;
            $window.localStorage.setItem('matched', JSON.stringify($rootScope.matched));
          } else {
            loadNextRestaurant(); 
          }
        });
    });
  }

  $scope.no = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $scope.user.name, currRestaurantIndex, false, $rootScope.currentSession.id);
    loadNextRestaurant();
  }

  // Listen for the signal to redirect to a 'match found' page.
  Socket.on('matchRedirect', function (id) {
    // id refers to the id of the movie that the group matched on
    Match.matchRedirect(id);
  });

  // Listen for the signal to reset matched on rootScope
  Socket.on('setMatched', function (data) {
    // Set matched on rootScope to matched restaurant
    $rootScope.matched = data;
    // Set the image url from small to large
    var currentImageURL = data.image_url;
    $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
    $window.localStorage.setItem('matched', JSON.stringify($rootScope.matched));
  });
})

.factory('Match', function ($http, $location) {
  return {
    sendVote: function (sessionName, username, restaurantId, vote, sessionId) {
      return $http.post(
        '/api/votes',
        { sessionName: sessionName, username: username, restaurantId: restaurantId, vote: vote, sessionId: sessionId })
      .then(function (response) {
        return response;
      },
      function (err) {
        console.error('Error in sendVote POST request: ', err);
      });
    },

    matchRedirect: function(id) {
      $location.path('/showmatch/' + id);
    },

    checkMatch: function(session, restaurant) {
      return $http.get(
        '/api/sessions/' + session + '/match/' + restaurant
      )
      .then(function (response) {
        return response.data;
      }, function (err) {
        console.error("Error in checkMatch GET request ", err);
      });
    }

  }
});
