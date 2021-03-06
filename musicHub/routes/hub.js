var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
// Require controller modules.
var song_controller = require('../controllers/songController');
var artist_controller = require('../controllers/artistController');
var user_controller = require('../controllers/userController');

// Song Routes
router.get('/',auth, song_controller.index);

// GET request for creating Song. 
router.get('/song/create',auth,  song_controller.song_create_get);

// POST request for creating song.
router.post('/song/create',auth,  song_controller.song_create_post);

// GET request to delete Song.
router.get('/song/:id/delete',auth, song_controller.song_delete_get);

// POST request to delete Song.
router.post('/song/:id/delete',auth, song_controller.song_delete_post);

//GET for song update
router.get('/song/:id/update',auth, song_controller.song_update_get);

//POST for update
router.post('/song/:id/update',auth, song_controller.song_update_post);

//GET for song detail
router.get('/song/:id',auth,  song_controller.song_detail);

//GET for song list
router.get('/songs',auth,  song_controller.song_list);

/// Artist Routes 

// GET request for creating artist. 
router.get('/artist/create',auth, artist_controller.artist_create_get);

// POST request for creating artist.
router.post('/artist/create',auth, artist_controller.artist_create_post);

// GET request to delete artist.
router.get('/artist/:id/delete',auth, artist_controller.artist_delete_get);

// POST request to delete artist.
router.post('/artist/:id/delete',auth, artist_controller.artist_delete_post);

// GET request to update artist.
router.get('/artist/:id/update',auth, artist_controller.artist_update_get);

// POST request to update artist.
router.post('/artist/:id/update',auth, artist_controller.artist_update_post);

// GET request for one artist.
router.get('/artist/:id',auth,  artist_controller.artist_detail);

// GET request for list of all artists.
router.get('/artists',auth,  artist_controller.artist_list);


//User
//GET request for creating an user
router.get('/user/signup', user_controller.user_create_get);

//POST request for creating the user and store
router.post('/user/signup', user_controller.user_create_post);

//GET request for loggin in
router.get('/user/login', user_controller.user_login_get);

//POST request for authentication
router.post('/user/login', user_controller.user_login_post);

//GET request fro user 
router.get('/user/:id', auth, user_controller.user_detail);

//POST request to delete an user
router.post('/user/:id',auth, user_controller.user_delete_post);


module.exports = router;