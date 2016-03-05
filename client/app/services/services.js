angular.module('dinnerDaddy.services', [])

.factory( 'Match', function( $http, $location ) {
  return {

    sendVote: function( sessionName, username, restaurantId, vote, sessionId ) {
      return $http.post(
        '/api/votes',
        { sessionName: sessionName, username: username, restaurantId: restaurantId, vote: vote, sessionId: sessionId })
      .then(function (response) {
        return response;
      },
      function (err) {
        console.error( err );
      });
    },

    matchRedirect: function (id) {
      $location.path( '/showmatch/' + id );
    },

    checkMatch: function (session, restaurant) {
      // expects session and movie
      // Calls /api/sessions/:sid/match/:mid
      // Should get back either 'false' or the data for the matched movie
      return $http.get(
        '/api/sessions/' + session.id + '/match/' + restaurant.id
      )
      .then( function( response ) {
        return response.data;
      }, function (err) {
        console.error(err);
      });
    }

  }
})

.factory('Socket', ['socketFactory', function (socketFactory) {
  return socketFactory();
}]);
