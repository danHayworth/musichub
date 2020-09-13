var Song = require('../models/songModel')
var Artist = require('../models/artistModel');
var Album = require('../models/albumModel');
const { body,check, validationResult } = require('express-validator');


var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        song_count: function(callback) {
            Song.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        artist_count: function(callback) {
            Artist.countDocuments({}, callback);
        },
        album_count: function(callback) {
            Album.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Music Hub Home', error: err, data: results });
    });
};

exports.song_list = function(req, res, next) {

    Song.find({}, 'title artist')
      .populate('artist')
      .exec(function (err, list_songs) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('song_list', { title: 'Song List', song_list: list_songs });
      });
      
  };

  // Display detail page for a specific song.
exports.song_detail = function(req, res, next) {

    async.parallel({
        song: function(callback) {
            Song.findById(req.params.id)
             .populate('artist')
              .exec(callback);
        },
        artist: function(callback){
            Artist.find({'name':req.params.id})
            .exec(callback)
        }

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.song==null) { // No results.
            var err = new Error('Song not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('song_detail', { title: results.song.title, song: results.song, artist:results.artist} );
    });

};


// Display Song create form on GET.
exports.song_create_get = function(req, res) {
    // Get all artists and genres, which we can use for adding to our song.
    async.parallel({
        artists: function(callback) {
            Artist.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('song_form', { title: 'Create Song', artists: results.artists});
    });
};

// Handle song create on POST.
exports.song_create_post = [
    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('name', 'Artist must not be empty.').trim().isLength({ min: 1 }),
    body('length', 'Length must not be empty.').trim().isLength({ min: 1 }),

    // Sanitize fields.
  
    check('*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);
        // Create a song object with escaped and trimmed data.

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render('song_form', { title: 'Create Song', song: req.body, errors: errors.array() });
            return;
        }
        else {
            var song = new Song(
            { title: req.body.title,
              artist: req.body.name,
              length: req.body.length
            });
            (req, res, next)=>{
                // Get all artists for form.
                async.parallel({
                    artists: function(callback) {
                        Artist.find(callback);
                    }
                }, function(err, results) {
                    if (err) { return next(err); }
                    res.render('song_form', { title: 'Create Song',artists:results.artists, length :results.length, song: song, errors: errors.array() });
                });
                return;
            }
        
    
            // Data from form is valid. Save song.
            song.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new song record.
                   res.redirect(song.url);
            });
        }
        
    }
];


// Display song delete form on GET.
exports.song_delete_get = function(req, res, next) {

    async.parallel({
        song: function(callback) {
            Song.findById(req.params.id).populate('artist').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.song==null) { // No results.
            res.redirect('/hub/songs');
        }
        // Successful, so render.
        res.render('song_delete', { title: 'Delete Song', song: results.song} );
    });

};

// Handle song delete on POST.
exports.song_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        song: function(callback) {
            Song.findById(req.body.id).populate('artist').exec(callback);
        },
    }, function(err) {
        if (err) { return next(err); }
        // Success
        else {
           // Delete object and redirect to the list of songs.
            Song.findByIdAndRemove(req.body.id, function deleteSong(err) {
                if (err) { return next(err); }
                // Success - got to songs list.
                res.redirect('/hub/songs');
            });

        }
    });

};



// Display song update form on GET.
exports.song_update_get = function(req, res, next) {
    // Get songs and  artists for form.
    async.parallel({
        song: function(callback) {
            Song.findById(req.params.id).populate('artist').exec(callback);
        },
        artists: function(callback) {
            Artist.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.song==null) { // No results.
                var err = new Error('Song not found');
                err.status = 404;
                return next(err);
            }
            // Success.

            res.render('song_form', { title: 'Update Song', artists: results.artists, artists_list : results.artists, selected_artist:results.song._id, song: results.song });
        });
};

// Handle song update on POST.
exports.song_update_post = [

    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('artist', 'Artist must not be empty.').trim().isLength({ min: 1 }),
    body('length', 'Length must not be empty.').trim().isLength({ min: 1 }),

    // Sanitize fields.
    check('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Song object with escaped/trimmed data and old id.
        var song = new Song(
          { title: req.body.title,
            artist: req.body.artist,
            length:req.body.length,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {

            // Get all artists and songs for form.
            async.parallel({
                artists: function(callback) {
                    Artist.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('song_form', { title: 'Update Song',artists: results.artists, song: song, errors: errors.array() });
               
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Song.findByIdAndUpdate(req.params.id, song, {}, function (err, thesong) {
                if (err) { return next(err); }             
                   // Successful - redirect to song detail page.
                   res.redirect(thesong.url);
                });
        }
    }
];