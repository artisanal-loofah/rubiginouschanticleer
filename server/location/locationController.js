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
      if (error) {
        console.error(error);
      };
      if (!distances) {
        console.error('no distances were found');
      };
      if (distances.status === 'OK') {
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