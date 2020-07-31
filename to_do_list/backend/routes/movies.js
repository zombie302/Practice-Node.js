var express = require('express');
var router = express.Router();
var movies = require('../models/movies.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(movies);
});

router.get('/:id', function(req, res, next){
  var id = req.params.id;
  var movie = movies.filter(function(movie){
    return movie.id == id;
  });
  res.send(movie);
});

module.exports = router;