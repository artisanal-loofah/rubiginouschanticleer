angular.module( 'dinnerDaddy.match', ['dinnerDaddy.services'] )

.controller( 'MatchController', function( $scope, $rootScope, Match, Auth, Session, Socket, Restaurant, $cookies, $window, $location, $timeout) {
  $scope.session = {};

  $scope.currRestaurant = $rootScope.restaurants[0];
  var currentImageURL = $scope.currRestaurant.image_url;
  $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
  
  var currRestaurantIndex = 0;

  var loadNextRestaurant = function(){

    // Check if user finished voting, else allow user to keep voting
    if (currRestaurantIndex > 13) {
      console.log('No more restaurants');
      $location.path('/waiting');
      $timeout(function () {
        $location.path('/sessions');
      }, 4000);
    } else {
      currRestaurantIndex++;
      $scope.currRestaurant = $rootScope.restaurants[currRestaurantIndex];
      var currentImageURL = $scope.currRestaurant.image_url;
      $rootScope.currRestaurantImageHD = currentImageURL.slice(0,currentImageURL.length-6) + 'l.jpg'; 
    }
  };

  // Check if there is a current user on rootScope, if not get new user.
  // This is needed when the page is refreshed so we don't lose $rootScope.user.username
  if (!$rootScope.user) {
    Auth.getUser($cookies.get('fbId'))
    .then(function(data) {
      $rootScope.user = data.user;
    });
  } 

  $scope.yes = function() {
    Match.sendVote($rootScope.currentSession.sessionName, $rootScope.user.username, currRestaurantIndex, true, $rootScope.currentSession.id)
    .then(function () {
      Match.checkMatch($rootScope.currentSession.id, currRestaurantIndex)
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
