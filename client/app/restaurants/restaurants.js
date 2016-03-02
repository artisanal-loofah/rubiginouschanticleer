angular.module( 'dinnerDaddy.restaurants', [])

.controller('RestaurantsController', function ($scope, Restaurant) {
  $scope.listRestaurants = function (location) {
    Restaurant.getRestaurants(location)
    .then(function (data) {
      $scope.restaurants = data;
    });
  };
})
.factory('Restaurant', function ($http) {
  return {
    getRestaurants: function (location) {
      return $http({
        method: 'GET',
        url: '/getRestaurants',
        params: {'location': location, 'category_filter':'restaurants' },
      }).then(function(response){
        return response.data;
      }, function(error){
        console.log('Error in GET request getting restaurants: ', error);
      });
    }
  };
});

