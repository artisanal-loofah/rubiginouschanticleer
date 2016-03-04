angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, LocationFactory) {

  $scope.username = $cookies.get('name');

  var verify = function (username) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(LocationFactory.success);
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

  /** --- Testing data --- */
  //setTimeout(LocationFactory.getDistance(), 1000);
  /* ---- END -------*/
  verify();
})

.factory('LocationFactory', function ($http, $cookies) {

  var username = $cookies.get('name');
  var origin = [];

  //default map location to SF
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

/* 
The plan is to have a marker type specific to users, and a marker type for the designated restaurant
In a given session, each user will have unique coordinates and in the success function,
the coordinates will be fed into the server socket. The deployed version will give a shared socket,
so the coordinates for all group members can bubble up from server to each client */
 
  /***** TEST DATA ****/
  var restaurant = {
    name: 'Mickey Dz',
    location: [37, -122]
  };
  /**** END ***/

  var success = function (position, username) {
    var origin = [];
    //gathering coordinates from user geolocation
    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    origin.push(position.coords.latitude, position.coords.longitude)
      
    //setting up options for new google Maps Marker
    var marker = new google.maps.Marker({
      position: coords,
      title: username,
      map: map
    });
    google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {

        info.setContent($cookies.get('name'));
        info.open(map, marker);
      }
    })(marker));
    getDistance(origin, restaurant.location);
  };

  var getDistance = function (origin, restaurant) {
    console.log('origin is : ', origin);
  };

  var updateMode = function (mode) {
    console.log(mode)
  };

  return {
    success: success,
    getDistance: getDistance,
    updateMode: updateMode
  }

});