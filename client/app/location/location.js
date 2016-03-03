angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, Location) {

  $scope.username = $cookies.get('name');

  $scope.verify = function (username) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(Location.success);
    } else {
      console.error('User rejected location access');
    }
  };

  $scope.verify();
})

.factory('Location', function ($http, $cookies) {

  var username = $cookies.get('name');

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

  var success = function (position, username) {
    //gathering coordinates from user geolocation
    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    //setting up options for new google Maps Marker
    var marker = new google.maps.Marker({
      position: coords,
      title: username
    });

    marker.setMap(map)
  };

  return {
    success: success
  }

});