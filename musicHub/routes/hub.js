var express = require('express');
var router = express.Router();

// Require controller modules.
var song_controller = require('../controllers/songController');
var artist_controller = require('../controllers/artistController');
var album_controller = require('../controllers/albumController');

// Song Routes
router.get('/', song_controller.index);

// GET request for creating song. 
router.get('/song/create', song_controller.song_create_get);

// POST request for creating song.
router.post('/song/create', song_controller.song_create_post);

// GET request to delete Book.
router.get('/song/:id/delete', song_controller.song_delete_get);

// POST request to delete Book.
router.post('/song/:id/delete', song_controller.song_delete_post);

//GET for song update
router.get('/song/:id/update', song_controller.song_update_get);

//POST for update
router.get('/song/:id/update', song_controller.song_update_post);

//GET for song detail
router.get('/song/:id', song_controller.song_detail);

//GET for song list
router.get('/songs', song_controller.song_list);

/// Artist Routes 

// GET request for creating artist. 
router.get('/artist/create', artist_controller.artist_create_get);

// POST request for creating artist.
router.post('/artist/create', artist_controller.artist_create_post);

// GET request to delete artist.
router.get('/artist/:id/delete', artist_controller.artist_delete_get);

// POST request to delete artist.
router.post('/artist/:id/delete', artist_controller.artist_delete_post);

// GET request to update Author.
router.get('/artist/:id/update', artist_controller.artist_update_get);

// POST request to update Author.
router.post('/artist/:id/update', artist_controller.artist_update_post);

// GET request for one artist.
router.get('/artist/:id', artist_controller.artist_detail);

// GET request for list of all artists.
router.get('/artists', artist_controller.artist_list);


//Albums

router.get('/album/create', album_controller.album_create_get);

// POST request for creating artist.
router.post('/album/create', album_controller.album_create_post);

// GET request for one artist.
router.get('/album/:id', album_controller.album_detail);

// GET request for list of all artists.
router.get('/albums', album_controller.album_list);

module.exports = router;