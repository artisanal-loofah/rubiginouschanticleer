angular.module('dinnerDaddy.services', [])

.factory('Socket', ['socketFactory', function (socketFactory) {
  return socketFactory();
}]);
