var Movies = require( './movies' );

module.exports = {

  getAllMovies: function() {
    Movies.getAllMovies();
  },

  //returns the requested 10er movie package
  getMoviePackage: function( req, res ) {
    res.send( Movies.getMoviePackage( req.params.number ));
  },   

  getMovie: function( req, res, next ) {
    var movieID = parseInt(req.params.movie_id);
    var movie = Movies.getMovie(movieID);
    res.json(movie);
  }

};
