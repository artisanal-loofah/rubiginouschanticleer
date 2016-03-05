angular.module( 'dinnerDaddy.match', ['dinnerDaddy.services'] )

.controller( 'MatchController', function( $scope, $rootScope, Match, Auth, Session, Socket, Restaurant, $cookies, $window) {
  $scope.session = {};

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
  // This is needed when the page is refreshed so we don't lose $rootScope.currentSession
  if (!$rootScope.currentSession) {
    Session.getSession($window.localStorage.getItem('sessionId'))
    .then(function (session) {
      $rootScope.currentSession = session;
      $scope.init();
    });
  } else {
    $scope.init();
  }

  // Check if there is a current user on rootScope, if not get new user.
  // This is needed when the page is refreshed so we don't lose $rootScope.user.username
  if ($rootScope.user === undefined) {
    Auth.getUser($cookies.get('fbId'))
    .then(function(data) {
      $rootScope.user = data.user;
      $rootScope.user.username = data.user.username;
    });
  } 

  $scope.yes = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $rootScope.user.username, currRestaurantIndex, true, $rootScope.currentSession.id)
    .then(function () {
      Match.checkMatch($scope.currentSession.id, currRestaurantIndex)
        .then(function (matched) {
          if (matched) {
            Socket.emit('foundMatch', { restaurant: currRestaurantIndex, sessionId: $rootScope.currentSession.id, matched: $scope.currRestaurant});
            $rootScope.matched = $scope.currRestaurant;
            $window.localStorage.setItem('matched', JSON.stringify($rootScope.matched));
          } else {
            loadNextRestaurant(); 
          }
        });
    });
  }

  $scope.no = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $rootScope.user.username, currRestaurantIndex, false, $rootScope.currentSession.id);
    loadNextRestaurant();
  }

  // Listen for the signal to redirect to a 'match found' page.
  Socket.on('matchRedirect', function (id) {
    // id refers to the id of the restaurant that the group matched on
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

    checkMatch: function(sessionId, restaurantId) {
      return $http.get(
        '/api/sessions/' + sessionId + '/match/' + restaurantId
      )
      .then(function (response) {
        return response.data;
      }, function (err) {
        console.error("Error in checkMatch GET request ", err);
      });
    }

  }
});
