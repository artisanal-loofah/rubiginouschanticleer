angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, LocationFactory) {
  var username = $cookies.get('name');
  var origin = [];
  var map = new google.maps.Map(document.getElementById('mapcontainer'), {
    center: {
      lat: 37.75,
      lng: -122.4
    },
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 11
  });
  var info = new google.maps.InfoWindow();

  /* --- Test data ---- !!!!
   PROVIDE RESTAURANT INFO LIKE THIS !!! */
  var restaurant = {
    name: 'Golden Boy Pizza',
    address: '542 Green St, San Francisco, CA 94133'
  };
  /* ---- END ---- */

  $scope.distance;
  $scope.duration;
  $scope.restaurant = restaurant.name;
  $scope.username = $cookies.get('name');

  //position is fed in from google
  var success = function (position, username) {
    var origin = [];
    //gathering coordinates from user geolocation
    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    console.log('coords: ', coords)
    origin.push(position.coords.latitude, position.coords.longitude)

    //setting up options for new google Maps Marker
    var user = new google.maps.Marker({
      position: coords,
      title: username,
      map: map,
      icon: './assets/guy.png'
    });

    // var restaurant = new google.maps.Marker({
    //   position: /* NEED COORDINATES */,
    //   title: restaurant.name,
    //   map: map,
    //   icon: './assets/burger.png'
    // });

    google.maps.event.addListener(user, 'click', (function (user) {
      return function () {
        info.setContent($cookies.get('name'));
        info.open(map, user);
      }
    })(user));

    // google.maps.event.addListener(restaurant, 'click', (function (restaurant) {
    //   return function () {
    //     info.setContent(restaurant.title);
    //     info.open(map, restaurant);
    //   }
    // })(restaurant));

    LocationFactory.getDistance(origin, restaurant.address).then(function (data) {
      $scope.distance = data.distance.text;
      $scope.duration = data.duration.text;
    });
  };

  var verify = function (username) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      console.error('User rejected location access');
    }
  };

  $scope.updateMode = function (mode) {
    if (document.getElementById('mode').value === 'driving') {
      LocationFactory.updateMode('driving');
    }
    if (document.getElementById('mode').value === 'walking') {
      LocationFactory.updateMode('walking');
    }
    if (document.getElementById('mode').value === 'bus') {
      LocationFactory.updateMode('bus');
    }
  };


  verify();
})

.factory('LocationFactory', function ($http, $cookies) {

/* 
The plan is to have a marker type specific to users, and a marker type for the designated restaurant
In a given session, each user will have unique coordinates and in the success function,
the coordinates will be fed into the server socket. The deployed version will give a shared socket,
so the coordinates for all group members can bubble up from server to each client */

  //getDistance expects an array of two Number coordinates 
  var getDistance = function (origin, restaurant) {
    if (typeof origin[0] === 'number') {
      origin = origin.join(',');
    };
    if (typeof restaurant[0] === 'number') {
      restaurant = restaurant.join(',');
    };

    var data = {
      origin: origin,
      restaurant: restaurant
    };
    console.log('data fed out : ', data);

    return $http({
      method: 'POST',
      url: '/api/location',
      data: data
    }).then(function (distance) {
      return distance.data;
    });

  };

  var updateMode = function (mode) {
    console.log(mode)
  };

  return {
    getDistance: getDistance
  }

});