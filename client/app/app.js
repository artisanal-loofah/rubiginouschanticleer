var app = angular.module( 'dinnerDaddy', [
  'dinnerDaddy.auth',
  'dinnerDaddy.match',
  'dinnerDaddy.prefs',
  'dinnerDaddy.sessions',
  'dinnerDaddy.services',
  'dinnerDaddy.showmatch',
  'dinnerDaddy.lobby',
  'dinnerDaddy.restaurants',
  'dinnerDaddy.location',
  'ngRoute',
  'ngCookies',
  'btford.socket-io',
  'dinnerDaddy.directive',
  'dinnerDaddy.dstValidateUser'
  ])

.config( function ( $routeProvider, $httpProvider ) {
  $routeProvider
    .when( '/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when( '/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when( '/signout', {
      templateUrl: 'app/auth/signout.html',
      controller: 'AuthController'
    })
    .when( '/match', {
      templateUrl: 'app/match/match.html',
      controller: 'MatchController',
      authenticate: true
    })
    .when( '/waiting', {
      templateUrl: 'app/match/waiting.html',
      controller: 'MatchController',
      authenticate: true
    })
    .when( '/sessions', {
      templateUrl: 'app/sessions/joinsessions.html',
      controller: 'SessionsController',
      authenticate: true
    })
    .when( '/lobby', {
      templateUrl: 'app/lobby/lobby.html',
      controller: 'LobbyController',
      authenticate: true
    })
    .when( '/showmatch/:id', {
      templateUrl: 'app/showmatch/showmatch.html',
      controller: 'ShowmatchController',
      authenticate: true
    })
    .when('/location', {
      templateUrl: 'app/location/location.html',
      controller: 'locationController',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/sessions'
    })

    $httpProvider.interceptors.push('AttachTokens');

})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.dinnerDaddy');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

