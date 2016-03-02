angular.module( 'moviematch.restaurants', [])

.controller('RestaurantsController', function($scope, Restaurant){
  // $scope.bars = ['hello', 'world']; 
  $scope.listRestaurants = function(location){
    Restaurant.getRestaurants(location)
    .then(function(data){
      console.log("INSIDE INNER FUNCTION! Finding restaurants in " + location);
      console.log("The returned data is: " + data);
      $scope.restaurants = data;
      $scope.location='';
      $scope.displayBar='';
      // console.log('THE BARS ARE!', $scope.bars);
      // console.log('the first bar is', $scope.bars[0].name);
    });
  };
})
.factory('Restaurant', function($http){
    return{
    getRestaurants : function(location){
      console.log(location);
      return $http({
        method: 'GET',
        url: '/getRestaurants',
        params: {'location': location, 'category_filter':'restaurants' },
      }).then(function(response){
        console.log('RESPONSE IS --------------->', response.data);
        return response.data;
      }, function(error){
        console.log('we got a big problem yo in getrestaurants');
      });
    },
    addBar: function(item) {
      var latitude = item.location.coordinate.latitude;
      var longitude = item.location.coordinate.longitude;
      var barRating = item.rating_img_url;
      var barURL = item.url;
      console.log(barRating);
      console.log(barURL);
      console.log("adding a bar was called", item.location.city);
      return $http({
        method: 'POST',
        url: '/addRestaurants',
        data: {'bar': item.name, 'phone': item.phone, 'city': item.location.city, 'url': barURL, 'rating': barRating, 'longit': longitude, 'latit': latitude}
      })
      .then(function(response) {
        // console.log('THIS IS THE RESPONSE', response);
        return response.data;
      }, function(error) {
        console.error('THERE IS AN ERROR');
      });
    },
    loadAllBars: function(){
      return $http({
        method: 'GET',
        url: '/faveBars',
      })
      .then(function(response){
        return response.data;
      }, function(error){
        console.log('Error from the Angular factory!', error);
      });
    },
    deleteBar : function(barName){
      console.log(barName);
      return $http({
        method: 'DELETE',
        url: '/faveBars',
        params: {'barName': barName},
      }).then(function(response){
        // console.log('BAR DELETED IS --------------->', response);
        return response.data;
      }, function(error){
        console.log('ERROR DELETING THE BAR!');
      });
    },
    };
  });