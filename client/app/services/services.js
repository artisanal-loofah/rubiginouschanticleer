angular.module( 'dinnerDaddy.services', [] )

.factory( 'Session', function( $http, $window, $location ) {
  return {
    createSession: function( sessionName, callback ) {
      return $http.post( '/api/sessions', { sessionName: sessionName } )
      .then( function( response ) {
        callback( sessionName ); // used for emitting session data
        return response;
      }, function( err ) {
        console.error( err );
      } );
    },

    fetchSessions: function() {
      return $http.get ( '/api/sessions' )
      .then( function( response ) {
        return response.data;
      }, function( err ) {
        console.error( err );
      } ); 
    }, 

    joinSession: function( sessionName, username, callback ) {
      return $http.post( '/api/sessions/users', { sessionName: sessionName, username: username } )
      .then( function( response ) {
        callback( username, sessionName ); // used for emitting session data
        $location.path( '/lobby' );
        return response;
      }, function( err ) {
        console.error( err );
      } );
    },

    setSession: function( sessionName ) {
      $window.localStorage.setItem( 'sessionName', sessionName );
    }, 

    getSession: function() {
      var sessionName = $window.localStorage.getItem( 'sessionName' );
      return $http.get( '/api/sessions/' + sessionName )
      .then( function( session ) {
        return session.data;
      }, function( err ) {
        console.error( err );
      });
    }

  }
} )

.factory( 'Match', function( $http, $location ) {
  return {

    sendVote: function( sessionName, username, movieID, vote ) {
      return $http.post( // returns a promise; if you want to make use of a callback simply use .then on the return value.
        '/api/votes', // expect this endpoint to take a json object
                                      // with sessionID and userID
                                      // OR sessionuserID
                                      // AND movieID
                                      // AND vote (boolean true/false where true is yes and false is no)
        { sessionName: sessionName, username: username, movie_id: movieID, vote: vote })
      .then( function( response ) { // if the promise is resolved
        return response;
      },
      function( err ) { // if the promise is rejected
        console.error( err );
      } );
    },

    matchRedirect: function( id ) {
      $location.path( '/showmatch/' + id );
    },

    checkMatch: function( session, movie ) {
      // expects session and movie
      // Calls /api/sessions/:sid/match/:mid
      // Should get back either 'false' or the data for the matched movie
      return $http.get(
        '/api/sessions/' + session.id + '/match/' + movie.id
      )
      .then( function( response ) {
        return response.data;
      }, function( err ) {
        console.error( err );
      });
    }

  }
} )

.factory( 'Socket', ['socketFactory', function(socketFactory){
  return socketFactory();
}]);
