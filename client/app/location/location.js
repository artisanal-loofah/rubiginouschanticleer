angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, Location) {

  var coordinates = new google.maps.LatLng(position.coords.latitutde, position.coords.longitude);

  $scope.verify = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(Location.success);
    } else {
      error('Geo Location is not supported');
    }
  }


  $scope.verify();
})

.factory('Location', function ($http) {

});


function success(position) {
  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcontainer';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '600px';

  document.querySelector('article').appendChild(mapcanvas);

  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
  var options = {
    zoom: 15,
    center: coords,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

  var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title:"You are here!"
  });
}