var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema(
    {
     
      "name": {type: String, required: true, maxlength: 100},
      "description": {type: String, required: true, maxlength: 1000},
      "imageUrl": {type: String},
      "song":[{type: Schema.Types.ObjectId, ref: 'Song', required: false}],
      "album":[{type: Schema.Types.ObjectId, ref: 'Album', required: false}]
    }
  );

ArtistSchema
.virtual('url')
.get(function () {
return '/hub/artist/' + this._id;
});

module.exports = mongoose.model('Artist', ArtistSchema);