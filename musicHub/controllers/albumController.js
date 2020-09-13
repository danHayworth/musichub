var Album = require('../models/albumModel');
var Artist = require('../models/artistModel');
var Song = require('../models/songModel');
var async = require('async');

// Display list of all books.
exports.album_list = function(req, res, next) {

    Album.find({}, 'albumName artist')
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
              .populate('song')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.album==null) { // No results.
            var err = new Error('Album not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('album_detail', { title: results.album.albumName, album: results.album} );
    });

};

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