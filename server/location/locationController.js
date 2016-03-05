var distance = require('google-distance-matrix');
var googlekeys = require('../config/googleconfig.js');

distance.key(process.env.DISTANCE_MATRIX_KEY);
distance.units('imperial');

module.exports = {

  getDistance: function (request, response) {
    distance.mode(request.body.transport.toLowerCase());

    var arrOrigin = [request.body.origin];
    var arrRestaurant = [request.body.restaurant];

    distance.matrix(arrOrigin, arrRestaurant, function (error, distances) {
      //expect distances to be object response from distance node module matrix call
      //contains distance and duration from origin to destination
      if (error) {
        console.error(error);
      };
      if (!distances) {
        console.error('no distances were found');
      };
      if (distances.status === 'OK') {
        //this is in preparation for multiple user origins
        for (var i=0; i < arrOrigin.length; i++) {
          if (distances.rows[0].elements[0].status === 'OK') { 
            var distanceInfo = {
              distance: distances.rows[0].elements[0].distance,
              duration: distances.rows[0].elements[0].duration
            }
            response.json(distanceInfo);
          }
        }
      }
    });
  }
};