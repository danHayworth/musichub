var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema(
    {
      "name": {type: String, required: true, maxlength: 100},
      "year": {type: String, required: true},
      "songs": [{type: Schema.Types.ObjectId, ref: 'Song'}],
      "artists": [{type: Schema.Types.ObjectId, ref: 'Artist'}]
    }
  );

AlbumSchema
.virtual('url')
.get(function () {
return '/hub/album/' + this._id;
});

module.exports = mongoose.model('Album', AlbumSchema);