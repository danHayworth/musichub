var Artist = require('../models/artistModel');
var async = require('async');
const { body,check, validationResult} = require('express-validator');
var Song = require('../models/songModel');

exports.artist_list = function(req, res, next){
    Artist.find()
    .populate('artist')
    .exec(function (err, list_artist){
        if(err){
            return next(err);
        }
        res.render('artist_list', {title: 'Artists list', artist_list: list_artist});
    });
};
exports.artist_detail = function(req, res, next) {

    async.parallel({
        artist: function(callback) {
            Artist.findById(req.params.id)
                .exec(callback)
        },
        artist_songs: function(callback) {
            Song.find({ 'artist': req.params.id })
            .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.artist==null) { // No results.
            var err = new Error('Artist not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('artist_detail', { title: results.artist.artistName, artist: results.artist, artist_songs: results.artist_songs } );
    });

};

// Display Artist create form on GET.
exports.artist_create_get = function(req, res) {
    res.render('artist_form', { title: 'Create Artist'});
};

exports.artist_create_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Full name must be specified.')
        .isAlphanumeric().withMessage('Full name has non-alphanumeric characters.'),
    body('description').isLength({ min: 1 }).trim().withMessage('Description must be specified.')
        .isAlphanumeric().withMessage('Description has non-alphanumeric characters.'),
    body('imageUrl').isLength({ min: 8}).trim().withMessage('Image Url must be added.'),


     // Sanitize fields.
  
     check('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = body(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('artist_form', { title: 'Create Artist', artist: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Artist object with escaped and trimmed data.
            var artist = new Artist(
                {       
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl                  
                });
            artist.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new artist record.
                res.redirect(artist.url);
            });
        }
    }
];

exports.artist_delete_get = function(req, res) {
    async.parallel({
        artist: function(callback) {
            Artist.findById(req.params.id).exec(callback)
        },
        artists_songs: function(callback) {
          Song.find({ 'artist': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.artist==null) { // No results.
            res.redirect(artist.url);
        }
        // Successful, so render.
        res.render('artist_delete', { title: 'Delete Artist', artist: results.artist, artist_songs: results.artists_songs } );
    });
};

// Handle Artist delete on POST.
exports.artist_delete_post = function(req, res, next) {

    async.parallel({
        artist: function(callback) {
          Artist.findById(req.body.artistid).exec(callback)
        },
        artists_songs: function(callback) {
          Song.find({ 'artist': req.body.artistid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.artists_songs.length > 0) {
            // Artist has songs. Render in same way as for GET route.
            res.render('artist_delete', { title: 'Delete Artist', artist: results.artist, artist_songs: results.artists_songs } );
            return;
        }
        else {
            // Artist has no songs. Delete object and redirect to the list of artists.
            Artist.findByIdAndRemove(req.body.artistid, function deleteArtist(err) {
                if (err) { return next(err); }
                // Success - go to artist list
                res.redirect('/hub/artists')
            })
        }
    });
};

// Display Artist delete form on GET.
exports.album_delete_get = function(req, res) {
    async.parallel({
        album: function(callback) {
            Album.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.artist==null) { // No results.
            res.redirect('/album');
        }
        // Successful, so render.
        res.render('album_delete', { title: 'Delete Album', album: results.album } );
    });
};


// Display Artist update form on GET.
exports.artist_update_get = function (req, res, next) {

    Artist.findById(req.params.id, function (err, artist) {
        if (err) { return next(err); }
        if (artist == null) { // No results.
            var err = new Error('Artist not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('artist_form', { title: 'Update Artist', artist: artist });

    });
};

// Handle Artist update on POST.
exports.artist_update_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('Full name must be specified.')
        ,
    body('description').isLength({ min: 1 }).trim().withMessage('Description must be specified.')
        ,
    body('imageUrl').isLength({ min: 8}).trim().withMessage('Image Url must be added.'),

     // Sanitize fields.
  
     check('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Artist object with escaped and trimmed data (and the old id!)
        var artist = new Artist(
            {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('artist_form', { title: 'Update Artist', artist: artist, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Artist.findByIdAndUpdate(req.params.id, artist, {}, function (err, theartist) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theartist.url);
            });
        }
    }
];
