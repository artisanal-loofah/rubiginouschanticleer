angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, Location) {

  $scope.initializeMap = function () {
    var map = new google.maps.Map(document.getElementById('mapcontainer'), {
      center: {
        lat: 37.7,
        lng: -122.4
      },
      scrollwheel: false,
      zoom: 10
    })
  }

  $scope.verify = function () {
    if (navigator.geolocation) {
      console.log('are we getting here: ', navigator.geolocation)
      navigator.geolocation.getCurrentPosition(Location.success);
    } else {
      console.error('User rejected location access');
    }
  };

  $scope.initializeMap();
  $scope.verify();
})

.factory('Location', function ($http) {

  var success = function (position) {
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
    
    var marker = new google.maps.Marker({
        position: coords,
        map: google.maps.Map(document.getElementById("mapcontainer"), options),
        title:"You are here!"
    });

  };
  return {
    success: success
  }
});

// function success(position) {
//   var mapcanvas = document.createElement('div');
//   mapcanvas.id = 'mapcontainer';
//   mapcanvas.style.height = '400px';
//   mapcanvas.style.width = '600px';

//   document.querySelector('article').appendChild(mapcanvas);

//   var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
//   var options = {
//     zoom: 15,
//     center: coords,
//     mapTypeControl: false,
//     navigationControlOptions: {
//       style: google.maps.NavigationControlStyle.SMALL
//     },
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

//   var marker = new google.maps.Marker({
//       position: coords,
//       map: map,
//       title:"You are here!"
//   });
// }
