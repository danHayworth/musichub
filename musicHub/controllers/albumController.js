var Album = require('../models/albumModel');
var Artist = require('../models/artistModel');
var Song = require('../models/songModel');
const { body,check, validationResult} = require('express-validator');
var async = require('async');

// Display list of all books.
exports.album_list = function(req, res, next) {

    Album.find({}, 'name artist')
      .populate('artist')
      .exec(function (err, list_albums) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('album_list', { title: 'Album List', album_list: list_albums });
      });
      
  };

// Display detail page for a specific book.
exports.album_detail = function(req, res, next) {

    async.parallel({
        album: function(callback) {
            Album.findById(req.params.id)
              .populate('artist')
              .populate('songs')
              .exec(callback);
        },
        artist: function(callback){
            Artist.find({'name':req.params.id})
            .exec(callback)
        },
        songs: function(callback){
            Song.find({'name':req.params.id})
            .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.album==null) { // No results.
            var err = new Error('Album not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('album_detail', { title: results.album.name, album: results.album, artist:results.artist, songs:results.songs} );
    });

};



// Display Song create form on GET.
exports.album_create_get = function(req, res) {
    // Get all artists and genres, which we can use for adding to our song.
    async.parallel({
        artists: function(callback) {
            Artist.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('album_form', { title: 'Create Album', artists: results.artists });
    });
};

exports.album_create_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Album name must be specified.')
        .isAlphanumeric().withMessage('Full name has non-alphanumeric characters.'),
    body('year').isLength({ min: 1 }).trim().withMessage('Year must be specified.'),
    body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }),

     // Sanitize fields.
  
     check('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('album_form', { title: 'Create Album', album: req.body, errors: errors.array() });
            return;
        }
        else {
            var album = new Album(
                {    
                    name: req.body.name,
                    year: req.body.year,
                    artist: req.body.artist,                               
                });
                (req, res, next)=>{
                    // Get all artists for form.
                    async.parallel({
                        artists: function(callback) {
                            Artist.find(callback);
                        }
                    }, function(err, results) {
                        if (err) { return next(err); }
                        res.render('album_form', { title: 'Create Album',artists:results.artists, album: album, errors: errors.array() });
                    });
                    return;
                }
            artist.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new artist record.
                res.redirect(album.url);
            });
        }
    }
];

// Handle delete on POST.
exports.album_delete_post = function(req, res, next) {

    async.parallel({
        album: function(callback) {
          Album.findById(req.body.albumid).exec(callback)
        },
    }, function(err) {
        if (err) { return next(err); }

        else {
            // Delete object and redirect to the list 
            Author.findByIdAndRemove(req.body.albumid, function deleteAlbum(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/album')
            })
        }
    });
};