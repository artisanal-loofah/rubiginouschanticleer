var Movies = require( './movies' );

module.exports = {

  getMovie: function( req, res, next ) {
    var movieID = parseInt(req.params.movie_id);
    var movie = Movies.getMovie(movieID);
    res.json(movie);
  }

};
